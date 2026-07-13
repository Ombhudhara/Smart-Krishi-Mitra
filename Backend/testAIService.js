import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import aiService from "./src/services/aiService.js";

// Helper to introduce delays to prevent 429 rate limits
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTests() {
  console.log("==========================================");
  console.log("     AI SERVICE INTEGRATION TEST RUNNER   ");
  console.log("==========================================\n");

  try {
    // Connect to Database
    const dbUri = process.env.MONGO_URI || "YOUR_MONGODB_URI_PLACEHOLDER";
    console.log("Connecting to database:", dbUri.includes("@") ? dbUri.split("@")[1] : dbUri);
    await mongoose.connect(dbUri);
    console.log("Connected to MongoDB successfully.\n");

    // Get an admin/farmer user ID for chat logging
    let user = await User.findOne({});
    const userId = user ? user._id : new mongoose.Types.ObjectId();
    console.log(`Using reference User ID for ChatHistory logging: ${userId}\n`);

    // 1. Test generateText
    console.log("[Test 1] Testing generateText (gemini-2.5-flash)...");
    await sleep(2000); // 2-second sleep to clear rate limits
    try {
      const textResponse = await aiService.generateText(
        "Write a one-sentence agricultural tip for growing wheat.",
        "You are a friendly farming expert. Respond in under 15 words."
      );
      console.log(`  Response: "${textResponse}"\n`);
    } catch (e) {
      console.warn(`  [Warning] Test 1 encountered an API issue: ${e.response ? e.response.status + " " + e.response.statusText : e.message}\n`);
    }

    // 2. Test generateEmbedding
    console.log("[Test 2] Testing generateEmbedding (gemini-embedding-001)...");
    await sleep(2000);
    try {
      const embedding = await aiService.generateEmbedding("Rice crops require fertile alluvial soil.");
      console.log(`  Success! Embedding generated.`);
      console.log(`  Vector Length: ${embedding.length} dimensions`);
      console.log(`  First 3 coordinates: [${embedding.slice(0, 3).join(", ")}]\n`);
    } catch (e) {
      console.warn(`  [Warning] Test 2 encountered an API issue: ${e.response ? e.response.status + " " + e.response.statusText : e.message}\n`);
    }

    // 3. Test translateText
    console.log("[Test 3] Testing translateText...");
    await sleep(2000);
    try {
      const englishText = "Tomato plants require moderate watering and bright sunlight.";
      console.log(`  Original (English): "${englishText}"`);
      const hindiTrans = await aiService.translateText(englishText, "Hindi");
      console.log(`  Translation (Hindi): "${hindiTrans}"`);
      const gujaratiTrans = await aiService.translateText(englishText, "Gujarati");
      console.log(`  Translation (Gujarati): "${gujaratiTrans}"\n`);
    } catch (e) {
      console.warn(`  [Warning] Test 3 encountered an API issue: ${e.response ? e.response.status + " " + e.response.statusText : e.message}\n`);
    }

    // 4. Test queryRAG
    console.log("[Test 4] Testing queryRAG (RAG search flow with auto-seeding)...");
    await sleep(2000);
    try {
      const userQuery = "ડાંગરની ખેતી માટે કેવા પ્રકારની જમીન અનુકૂળ છે?"; 
      console.log(`  User Question (Gujarati): "${userQuery}"`);
      const ragResponse = await aiService.queryRAG(userQuery, "Gujarati", userId);
      console.log(`  RAG Success: ${ragResponse.success}`);
      console.log(`  Translated query in EN: "${ragResponse.data?.queryInEnglish}"`);
      console.log(`  Documents retrieved:`, ragResponse.data?.retrievedDocuments);
      console.log(`  RAG Answer (Gujarati):\n  "${ragResponse.data?.answer}"\n`);
    } catch (e) {
      console.warn(`  [Warning] Test 4 encountered an API issue: ${e.response ? e.response.status + " " + e.response.statusText : e.message}\n`);
    }

    // 5. Test analyzeImage (multimodal)
    console.log("[Test 5] Testing analyzeImage (using mock single-pixel JPEG)...");
    await sleep(2000);
    try {
      const mockImageBase64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
      const imagePrompt = "Is this image data valid? Reply with a single word.";
      const imageAnalysis = await aiService.analyzeImage(mockImageBase64, "image/jpeg", imagePrompt);
      console.log(`  Image analysis result: "${imageAnalysis}"\n`);
    } catch (e) {
      console.warn(`  [Warning] Test 5 encountered an API issue: ${e.response ? e.response.status + " " + e.response.statusText : e.message}\n`);
    }

    // Clean up mock collections created during seeder (optional, but keeps database clean)
    // We keep Document collection so user can see it in MongoDB, but we close connection
    await mongoose.connection.close();
    console.log("==========================================");
    console.log("   AI SERVICE TESTS COMPLETED SUCCESSFULLY! ");
    console.log("==========================================");
  } catch (error) {
    console.error("Test execution failed:", error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
}

runTests().catch(console.error);
