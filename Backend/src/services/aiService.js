import axios from "axios";
import mongoose from "mongoose";
import User from "../models/User.js";
import AIConversation from "../models/AIConversation.js";
import AIHistory from "../models/AIHistory.js";
import weatherService from "./weatherService.js";
import marketPriceService from "./marketPriceService.js";
import governmentSchemeService from "./governmentSchemeService.js";
import mapService from "./mapService.js";

// Retrieve configuration parameters
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const CHROMA_URL = (process.env.CHROMA_URL || "http://localhost:8000").replace(/\/+$/, "");

// ── DYNAMIC DOCUMENT SCHEMAS ─────────────────────────────────────────────────
// Ensures Mongoose collections for vector fallbacks exist
const DocumentSchema = mongoose.models.Document || mongoose.model("Document", new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  category: { type: String, required: true, index: true },
  embedding: { type: [Number], required: true }
}, { timestamps: true }));

// Create Axios Clients
const geminiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" }
});

const chromaClient = axios.create({
  baseURL: CHROMA_URL,
  timeout: 4000,
  headers: { "Content-Type": "application/json" }
});

// Seed data array for initial setup (in case of blank database instances)
const SEED_DOCUMENTS = [
  {
    id: "rice_guide_001",
    title: "Rice Cultivation & Soil Management Guide",
    category: "Crop Guides",
    content: "Rice grows best in clayey loam or fertile alluvial soils. It requires heavy water supply with rainfall of 150-300 cm, standing water in the fields, and temperature range of 25-30°C. Apply Nitrogen-rich fertilizers like Urea in split doses. Ensure field leveling is complete before sowing to prevent dry patches."
  },
  {
    id: "tomato_blight_002",
    title: "Tomato Late Blight Symptoms & Chemical Controls",
    category: "Disease Solutions",
    content: "Tomato Late Blight is caused by the oomycete Phytophthora infestans. It shows as dark water-soaked spots on leaves and stems, accompanied by white fuzzy spores under humid conditions. Control options include spray application of Mancozeb or Metalaxyl fungicides. Avoid overhead sprinklers to reduce humidity."
  },
  {
    id: "cotton_sowing_003",
    title: "Cotton Sowing and Black Soil Advisory",
    category: "Crop Guides",
    content: "Cotton is a primary Kharif cash crop that thrives in deep, well-drained black clay soil (regur) which has natural moisture retention capabilities. Sowing should commence at the onset of monsoon showers. Apply Diammonium Phosphate (DAP) during soil preparation to enhance initial root development."
  },
  {
    id: "pm_kisan_004",
    title: "PM-Kisan Samman Nidhi Income Subsidy",
    category: "Government Schemes",
    content: "Under Pradhan Mantri Kisan Samman Nidhi (PM-KISAN), all landholding farmer families across the country receive income support of ₹6,000 per year in three equal installments of ₹2,000 directly transferred into their bank accounts every four months."
  },
  {
    id: "organic_rotation_005",
    title: "Organic Fertilizer and Crop Rotation Practice",
    category: "Agriculture Articles",
    content: "Restoring crop nutrients through organic farming involves incorporating compost, vermicompost, and neem cake into the soil. Rotating leguminous crops (like moong, chickpeas, or beans) with cereals helps naturally fix nitrogen, reducing dependence on chemical nitrogen fertilizers."
  }
];

// ── INTENT DETECTOR & CHROMADB UTILS ──────────────────────────────────────────

/**
 * Deterministic classifier to map the user's intent.
 *
 * @param {string} query - English translated question.
 * @returns {Array<string>} Detected intent categories.
 */
export const detectIntent = (query) => {
  const q = (query || "").toLowerCase();
  
  const weatherKeywords = ["weather", "rain", "temperature", "temp", "wind", "humidity", "rainy", "forecast", "cloudy", "mausam", "barish", "monsoon", "climate", "freeze"];
  const marketKeywords = ["price", "mandi", "market", "msp", "rate", "cost", "selling", "value", "mandi price", "bhav", "selling price", "buying price"];
  const schemeKeywords = ["scheme", "yojana", "govt", "government", "subsidy", "pm-kisan", "pmkisan", "pmfby", "kcc", "eligibility", "subsidy", "subsidies"];
  const shopKeywords = ["shop", "dealer", "mandi near", "market near", "store", "hospital", "clinic", "shop near", "fertilizer shop", "seed shop", "krishi kendra"];

  const intents = [];
  if (weatherKeywords.some(kw => q.includes(kw))) intents.push("weather");
  if (marketKeywords.some(kw => q.includes(kw))) intents.push("market");
  if (schemeKeywords.some(kw => q.includes(kw))) intents.push("scheme");
  if (shopKeywords.some(kw => q.includes(kw))) intents.push("shop");

  if (intents.length === 0) {
    intents.push("knowledge"); // Default search RAG
  }
  return intents;
};

const getOrCreateChromaCollection = async (collectionName) => {
  try {
    const response = await chromaClient.post("/api/v1/collections", {
      name: collectionName,
      get_or_create: true
    });
    return response.data?.id || null;
  } catch (error) {
    console.warn(`[ChromaDB] Collection retrieval failed on "${CHROMA_URL}":`, error.message);
    return null;
  }
};

const addDocumentToChroma = async (collectionId, id, embedding, documentText, metadata) => {
  try {
    await chromaClient.post(`/api/v1/collections/${collectionId}/add`, {
      ids: [id],
      embeddings: [embedding],
      metadatas: [metadata],
      documents: [documentText]
    });
  } catch (error) {
    console.error(`[ChromaDB] Add document failed:`, error.message);
  }
};

const queryChromaCollection = async (collectionId, queryEmbedding, limit) => {
  try {
    const response = await chromaClient.post(`/api/v1/collections/${collectionId}/query`, {
      query_embeddings: [queryEmbedding],
      n_results: limit,
      include: ["documents", "metadatas", "distances"]
    });

    const data = response.data;
    if (!data || !data.ids || data.ids.length === 0 || data.ids[0].length === 0) {
      return [];
    }

    return data.ids[0].map((id, index) => ({
      _id: id,
      title: data.metadatas[0][index]?.title || "Untitled Document",
      category: data.metadatas[0][index]?.category || "General",
      content: data.documents[0][index] || "",
      distance: data.distances[0][index]
    }));
  } catch (error) {
    console.error(`[ChromaDB] Query collection failed:`, error.message);
    return [];
  }
};

// ── EXPORTED SERVICE MODULES ──────────────────────────────────────────────────

/**
 * 1. Generate text response from Gemini LLM.
 */
export const generateText = async (prompt, systemInstruction = "") => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured in environment variables.");
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.5-flash",
        messages: [
          ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
          { role: "user", content: prompt }
        ],
        max_tokens: 2000
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    const text = response.data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error("Empty response returned from Router text generator API.");
    }
    return text.trim();
  } catch (error) {
    const status = error.response ? error.response.status : "network error";
    console.error(`[AI Service] generateText failed (Status: ${status}):`, error.message);
    throw error;
  }
};

/**
 * 2. Generate vector embedding using gemini-embedding-001.
 * Returns a deterministic word-hash-based fake embedding vector (pseudo-embedding)
 * so that ChromaDB similarity queries can function correctly.
 */
export const generateEmbedding = async (text) => {
  const vector = new Array(768).fill(0);
  if (!text) return vector;

  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  const words = cleaned.split(/\s+/).filter(Boolean);

  words.forEach((word) => {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % 768;
    const val = Math.sin(hash) * 0.5;
    vector[index] = (vector[index] || 0) + val;
  });

  // L2 normalization
  let norm = 0;
  for (let i = 0; i < 768; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < 768; i++) {
      vector[i] /= norm;
    }
  }
  return vector;
};

/**
 * 3. Translate text between English, Hindi, and Gujarati.
 */
export const translateText = async (text, targetLanguage) => {
  try {
    if (!text || typeof text !== "string") return "";
    
    const target = (targetLanguage || "English").trim();
    if (target.toLowerCase() === "en" || target.toLowerCase() === "english") {
      const hasIndicCharacters = /[\u0900-\u097F\u0A80-\u0AFF]/.test(text);
      if (!hasIndicCharacters) return text;
    }

    const systemInstruction = "You are a precise agricultural translator. Translate the text exactly into the requested language (English, Hindi, or Gujarati). Keep all numbers, crop names, and chemical terms accurate. Respond ONLY with the direct translated text. Do not add quotes, introductions, or warnings.";
    const prompt = `Translate this text into "${target}":\n\n${text}`;

    return await generateText(prompt, systemInstruction);
  } catch (error) {
    console.warn(`[AI Service] Translation failed to "${targetLanguage}". Returning original text:`, error.message);
    return text;
  }
};

/**
 * Helper to extract location name from user query using the LLM
 */
const extractLocationFromQuery = async (query, defaultLocation) => {
  try {
    const prompt = `Analyze this user query and extract any city, town, village, district, or state name mentioned.
Query: "${query}"
Respond with ONLY the name of the location. If no specific location is mentioned in the query, respond with "${defaultLocation}".`;
    const response = await generateText(prompt);
    const cleaned = response.replace(/['"“”\.]/g, "").trim();
    return cleaned || defaultLocation;
  } catch (error) {
    console.error("[AI Service] Failed to extract location from query:", error);
    return defaultLocation;
  }
};

/**
 * Helper to auto-detect language of user query using LLM (returns English, Hindi, or Gujarati)
 */
const detectLanguageFromQuery = async (query, defaultLanguage) => {
  try {
    const prompt = `Analyze the language of the following query. It will be either English, Hindi, or Gujarati.
Query: "${query}"
Respond with ONLY the name of the language ("English", "Hindi", or "Gujarati"). If the query is mixed or you are unsure, respond with "${defaultLanguage}".`;
    const response = await generateText(prompt);
    const cleaned = response.trim().replace(/['"“”\.]/g, "");
    if (["English", "Hindi", "Gujarati"].includes(cleaned)) {
      return cleaned;
    }
    return defaultLanguage;
  } catch (error) {
    console.error("[AI Service] Failed to detect query language:", error);
    return defaultLanguage;
  }
};

/**
 * Helper to auto-seed ChromaDB and MongoDB RAG collection with agricultural guides if empty.
 */
const seedRAGKnowledgeBase = async (chromaCollectionId = null) => {
  try {
    const mongoCount = await DocumentSchema.countDocuments();
    if (mongoCount > 0) return;

    console.log("[AI Service] Seeding RAG knowledge base with documents and embeddings...");
    for (const doc of SEED_DOCUMENTS) {
      const embedding = await generateEmbedding(doc.content);
      
      await DocumentSchema.create({
        title: doc.title,
        category: doc.category,
        content: doc.content,
        embedding
      });

      if (chromaCollectionId) {
        await addDocumentToChroma(
          chromaCollectionId,
          doc.id,
          embedding,
          doc.content,
          { title: doc.title, category: doc.category }
        );
      }
    }
    console.log("[AI Service] Knowledge base successfully synchronized to MongoDB and ChromaDB.");
  } catch (err) {
    console.error("[AI Service] Auto-seeding RAG documents failed:", err.message);
  }
};

/**
 * 4. Execute the Retrieval-Augmented Generation (RAG) search flow.
 * Combines dynamic user profile loading, intent detection, and automated tool snapshots in parallel.
 *
 * @param {string} userQuery - Input farmer question.
 * @param {string} [userLanguage="English"] - Target Indic language.
 * @param {string} [userId=null] - Optional authenticated User ID.
 * @param {string} [conversationId=null] - Optional AIConversation target ID.
 * @returns {Promise<{success: boolean, message: string, data: object}>}
 */
export const queryRAG = async (userQuery, userLanguage = "English", userId = null, conversationId = null) => {
  const startTime = Date.now();
  try {
    if (!userQuery) {
      return { success: false, message: "User query is required." };
    }

    const langMap = {
      en: "English",
      hi: "Hindi",
      gu: "Gujarati",
      english: "English",
      hindi: "Hindi",
      gujarati: "Gujarati"
    };
    const mappedLanguage = langMap[userLanguage.toLowerCase()] || "English";

    // Auto-detect query language to answer in the same language
    const queryLanguage = await detectLanguageFromQuery(userQuery, mappedLanguage);
    console.log(`[RAG Flow] User query language detected: "${queryLanguage}"`);

    // Initialize Chroma collection reference
    const collectionName = "agricultural_knowledge";
    const chromaCollectionId = await getOrCreateChromaCollection(collectionName);
    await seedRAGKnowledgeBase(chromaCollectionId);

    // Step 1: Translate user query into English for RAG indexing
    const englishQuery = await translateText(userQuery, "English");
    const intents = detectIntent(englishQuery);
    console.log(`[RAG Flow] Detected Intents: ${intents.join(", ")}`);

    // Step 2: Load User Profile details in parallel
    let profile = null;
    let userLocation = "Delhi";
    let coordinates = { lat: 28.6139, lon: 77.2090 };

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      profile = await User.findById(userId).lean();
      if (profile) {
        userLocation = profile.district || profile.state || userLocation;
        if (profile.latitude && profile.longitude) {
          coordinates = { lat: profile.latitude, lon: profile.longitude };
        }
      }
    }

    // Step 2.5: Extract dynamic location and coordinates from query if weather or shop intent matches
    let targetLocation = userLocation;
    if (intents.includes("weather") || intents.includes("shop")) {
      targetLocation = await extractLocationFromQuery(englishQuery, userLocation);
      console.log(`[RAG Flow] Location extracted from query: "${targetLocation}"`);

      // If different from default userLocation, geocode it using mapService
      if (targetLocation.toLowerCase() !== userLocation.toLowerCase()) {
        const geoRes = await mapService.searchLocation(targetLocation);
        if (geoRes.success && geoRes.data && geoRes.data.length > 0) {
          coordinates = {
            lat: geoRes.data[0].latitude,
            lon: geoRes.data[0].longitude
          };
          console.log(`[RAG Flow] Geocoded "${targetLocation}" to: ${coordinates.lat}, ${coordinates.lon}`);
        }
      }
    }

    // Step 3: Call external APIs in parallel based on query intent
    let weatherSnapshot = null;
    let marketSnapshot = null;
    let schemeSnapshot = null;
    let shopSnapshot = null;
    const apiCallsUsed = [];

    const weatherPromise = intents.includes("weather")
      ? weatherService.getCompleteWeather(targetLocation).then(res => {
          weatherSnapshot = res;
          apiCallsUsed.push("WeatherAPI");
        }).catch(() => null)
      : Promise.resolve();

    const marketPromise = intents.includes("market")
      ? marketPriceService.getDashboardMarketSummary().then(res => {
          marketSnapshot = res.data;
          apiCallsUsed.push("data.gov.in Mandi Price API");
        }).catch(() => null)
      : Promise.resolve();

    const schemePromise = intents.includes("scheme")
      ? governmentSchemeService.getAllSchemes().then(res => {
          schemeSnapshot = res.data;
          apiCallsUsed.push("Government Scheme Registry");
        }).catch(() => null)
      : Promise.resolve();

    const shopPromise = intents.includes("shop")
      ? mapService.getNearbyMarkets(coordinates.lat, coordinates.lon).then(res => {
          shopSnapshot = res.data;
          apiCallsUsed.push("OpenStreetMap Geocoding API");
        }).catch(() => null)
      : Promise.resolve();

    const queryEmbeddingPromise = generateEmbedding(englishQuery);

    const [, , , , queryEmbedding] = await Promise.all([
      weatherPromise,
      marketPromise,
      schemePromise,
      shopPromise,
      queryEmbeddingPromise
    ]);

    // Step 4: Query ChromaDB Vector Database with MongoDB fallbacks
    let matchedDocs = [];
    let sourceUsed = "ChromaDB";

    if (chromaCollectionId) {
      matchedDocs = await queryChromaCollection(chromaCollectionId, queryEmbedding, 5);
    }

    if (matchedDocs.length === 0) {
      sourceUsed = "MongoDB Keyword Search";
      const keywords = englishQuery.split(" ").filter(w => w.length > 3);
      if (keywords.length > 0) {
        const regexes = keywords.map(kw => new RegExp(kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "i"));
        matchedDocs = await DocumentSchema.find({
          $or: [
            { content: { $in: regexes } },
            { title: { $in: regexes } }
          ]
        }).limit(5).lean();
      } else {
        matchedDocs = await DocumentSchema.find().limit(2).lean();
      }
    }

    // Step 5: Construct Structured context guidelines
    let contextText = matchedDocs.map((doc, idx) => `[Doc ${idx + 1}] Title: ${doc.title}\nCategory: ${doc.category}\nContent: ${doc.content}`).join("\n\n");
    
    // Inject API Snapshots into the context
    if (weatherSnapshot) {
      contextText += `\n\n[Live Weather API Snapshot] Location: ${targetLocation}, Temp: ${weatherSnapshot.current?.temp}°C, Humidity: ${weatherSnapshot.current?.humidity}%, Rain Chance: ${weatherSnapshot.forecast?.[0]?.chanceOfRain || 0}%, Condition: ${weatherSnapshot.current?.condition}`;
    }
    if (marketSnapshot) {
      contextText += `\n\n[Live Mandi Market Snapshot] Overall Avg Price: ₹${marketSnapshot.overallAveragePrice || 0}/Quintal, Active Mandis Count: ${marketSnapshot.activeMandisCount || 0}, Highest Price Crop: ${marketSnapshot.highestPriceCrop?.cropName || "N/A"}`;
    }
    if (schemeSnapshot && schemeSnapshot.length > 0) {
      contextText += `\n\n[Local Schemes Snapshot] Schemes: ${schemeSnapshot.slice(0, 3).map(s => `${s.title} (${s.category})`).join(", ")}`;
    }
    if (shopSnapshot && shopSnapshot.length > 0) {
      contextText += `\n\n[OSM Maps Proximity Snapshot] Nearest Mandis: ${shopSnapshot.slice(0, 2).map(s => `${s.name} (${s.distanceKm}km away)`).join(", ")}`;
    }

    // Inject User Profile metrics for custom memory
    if (profile) {
      contextText += `\n\n[Farmer Profile Context] Soil Type: ${profile.soilType || "Alluvial"}, Farm Size: ${profile.farmSize || "Not Specified"} Acres, Crops Grown: ${profile.cropsGrown?.join(", ") || "None Specified"}`;
    }

    const systemPrompt = `You are a helpful AI agricultural assistant for the Smart Krishi Mitra platform.
Respond precisely in the language requested. Combine the context documents and live API snapshots to answer the farmer's question.
If context documents are matched, provide references. Maintain an encouraging, professional farming tone.`;

    const modelPrompt = `CONTEXT INFORMATION:\n${contextText}\n\nFARMER QUESTION:\n${englishQuery}`;

    const rawAnswer = await generateText(modelPrompt, systemPrompt);

    // Translate answer back
    const finalResponse = await translateText(rawAnswer, queryLanguage);
    const responseTime = Date.now() - startTime;

    // Compile Programmatic citations and confidence metrics
    const sources = [];
    if (weatherSnapshot) sources.push("WeatherAPI");
    if (marketSnapshot) sources.push("data.gov.in Market Registry");
    if (schemeSnapshot) sources.push("Government Scheme Database");
    if (shopSnapshot) sources.push("OpenStreetMap Proximity API");
    matchedDocs.forEach(d => sources.push(d.title));

    // Calculate score based on contextual relevance
    let confidenceScore = 80;
    if (matchedDocs.length > 0) confidenceScore += 10;
    if (profile) confidenceScore += 5;
    if (weatherSnapshot || marketSnapshot) confidenceScore += 5;
    confidenceScore = Math.min(confidenceScore, 100);

    // Ensure session ID resolves or create dynamic placeholder session
    let resolvedConvId = conversationId;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      if (!resolvedConvId || !mongoose.Types.ObjectId.isValid(resolvedConvId)) {
        // Create a new AI Conversation log
        const newConv = await AIConversation.create({
          user: userId,
          title: englishQuery.slice(0, 30) + "..."
        });
        resolvedConvId = newConv._id;
      } else {
        await AIConversation.findByIdAndUpdate(resolvedConvId, { lastActive: new Date() });
      }

      // Log conversation details into chat history database
      await AIHistory.create({
        conversationId: resolvedConvId,
        user: userId,
        language: queryLanguage,
        prompt: userQuery,
        response: finalResponse,
        retrievedDocuments: matchedDocs.map(d => ({ title: d.title, category: d.category, content: d.content })),
        modelUsed: "gemini-2.5-flash",
        apiCallsUsed,
        weatherSnapshot,
        marketSnapshot,
        location: targetLocation,
        confidenceScore,
        sources,
        responseTime
      });
    }

    return {
      success: true,
      message: "AI response generated successfully",
      data: {
        conversationId: resolvedConvId,
        answer: finalResponse,
        originalAnswer: rawAnswer,
        queryInEnglish: englishQuery,
        retrievedDocuments: matchedDocs.map(d => ({ title: d.title, category: d.category })),
        confidenceScore,
        sources,
        responseTime: `${(responseTime / 1000).toFixed(2)}s`,
        sourceUsed
      }
    };
  } catch (error) {
    console.error("[RAG Flow] queryRAG process failed:", error.message || error);
    return {
      success: false,
      message: "Unable to generate AI response. Service is temporarily unavailable."
    };
  }
};

/**
 * 5. Analyze crop leaf images for disease diagnosis.
 */
export const analyzeImage = async (imageBuffer, mimeType, prompt) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured in environment variables.");
    }

    let base64Data = "";
    if (Buffer.isBuffer(imageBuffer)) {
      base64Data = imageBuffer.toString("base64");
    } else if (typeof imageBuffer === "string") {
      base64Data = imageBuffer.replace(/^data:image\/\w+;base64,/, "");
    } else {
      throw new Error("Invalid image source format. Must be a Buffer or base64 string.");
    }

    console.log(`[AI Service] Dispatching multi-modal analysis payload to Router API...`);
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt || "Analyze this crop leaf image. Identify any visible plant diseases, describe the symptoms, recommend organic/chemical controls, and estimate recovery time."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType || "image/jpeg"};base64,${base64Data}`
                }
              }
            ]
          }
        ],
        max_tokens: 2000
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        timeout: 20000
      }
    );

    const analysisText = response.data?.choices?.[0]?.message?.content;
    if (!analysisText) {
      throw new Error("Empty diagnostic analysis returned from Router API.");
    }

    return analysisText.trim();
  } catch (error) {
    const errorDetails = error.response ? JSON.stringify(error.response.data) : "";
    console.error("[AI Service] analyzeImage failed:", error.message, errorDetails);
    throw error;
  }
};

export default {
  generateText,
  generateEmbedding,
  translateText,
  queryRAG,
  analyzeImage,
  detectIntent
};
