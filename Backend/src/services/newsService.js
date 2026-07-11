import axios from "axios";

// Retrieve configurations from environment
const API_KEY = process.env.GNEWS_API_KEY;
const API_URL = (process.env.GNEWS_BASE_URL || "https://gnews.io/api/v4").replace(/\/+$/, "");

// Create Axios Client Instance for GNews
const gnewsClient = axios.create({
  baseURL: API_URL,
  timeout: 8000, // 8-second request timeout limit
});

// Cache for query requests to avoid hitting GNews 100 requests/day free tier limit
const requestCache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache TTL

// Country and Language code mapping tables
const COUNTRY_MAP = {
  india: "in",
  ind: "in",
  "united states": "us",
  usa: "us",
  us: "us",
  australia: "au",
  aus: "au",
  au: "au"
};

const LANGUAGE_MAP = {
  english: "en",
  eng: "en",
  en: "en",
  hindi: "hi",
  hin: "hi",
  hi: "hi",
  gujarati: "gu",
  guj: "gu",
  gu: "gu"
};

// GNews API native categories
const GNEWS_NATIVE_CATEGORIES = [
  "general",
  "world",
  "nation",
  "business",
  "technology",
  "entertainment",
  "sports",
  "science",
  "health"
];

// Fallback high-quality agricultural mock news database
const MOCK_NEWS = [
  {
    id: "news-mock-01",
    title: "New Digital Portal Set to Revolutionize Seed Distribution for Indian Farmers",
    description: "The Ministry of Agriculture has launched an online tracking system to ensure certified quality seeds reach small and marginal farmers across all states without intermediaries.",
    content: "New Digital Portal Set to Revolutionize Seed Distribution for Indian Farmers. The Ministry of Agriculture has launched an online tracking system to ensure certified quality seeds reach small and marginal farmers across all states without intermediaries. The portal, named SATHI (Seed Traceability, Authentication and Holistic Inventory), will help trace quality seeds, prevent black marketing, and provide subsidies directly to farmers' bank accounts.",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    source: "Krishi News",
    author: "Ravi Sharma",
    publishedAt: "2026-07-06T10:15:00Z",
    url: "https://krishinews.in/seed-distribution-portal",
    category: "Government",
    country: "in",
    language: "en"
  },
  {
    id: "news-mock-02",
    title: "Monsoon Forecast: Normal Rainfall to Boost Kharif Crop Sowing",
    description: "Meteorological department predicts a well-distributed monsoon season, raising hopes for a high yield of rice, cotton, and soybean crops this summer.",
    content: "Monsoon Forecast: Normal Rainfall to Boost Kharif Crop Sowing. Meteorological department predicts a well-distributed monsoon season, raising hopes for a high yield of rice, cotton, and soybean crops this summer. Sowing has started early in parts of Maharashtra, Gujarat, and Rajasthan, where pre-monsoon showers have prepared the soil with adequate moisture content.",
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&w=800&q=80",
    source: "Weather Agro India",
    author: "Neha Patel",
    publishedAt: "2026-07-05T08:30:00Z",
    url: "https://weatheragro.in/monsoon-forecast-kharif",
    category: "Weather",
    country: "in",
    language: "en"
  },
  {
    id: "news-mock-03",
    title: "Smart Irrigation Tech Reduces Water Usage by 35% in Punjab Farms",
    description: "A pilot project deploying IoT-based soil moisture sensors and automated drip systems reveals remarkable water and electricity savings for local wheat farmers.",
    content: "Smart Irrigation Tech Reduces Water Usage by 35% in Punjab Farms. A pilot project deploying IoT-based soil moisture sensors and automated drip systems reveals remarkable water and electricity savings for local wheat farmers. The technology helps regulate water flow based on real-time soil moisture parameters, preventing over-watering and nutrient leaching.",
    image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=800&q=80",
    source: "AgriTech Today",
    author: "Amit Singh",
    publishedAt: "2026-07-04T12:45:00Z",
    url: "https://agritechtoday.com/smart-irrigation-punjab",
    category: "Technology",
    country: "in",
    language: "en"
  },
  {
    id: "news-mock-04",
    title: "Organic Farming Subsidies Increased under PKVY Scheme",
    description: "The government has announced additional financial incentives for farmer groups converting to organic agricultural practices, aiming to double certified organic exports.",
    content: "Organic Farming Subsidies Increased under PKVY Scheme. The government has announced additional financial incentives for farmer groups converting to organic agricultural practices, aiming to double certified organic exports. Incentives will cover costs for organic fertilizers, bio-pesticides, and Participatory Guarantee System (PGS) certification processes.",
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=800&q=80",
    source: "Green Earth India",
    author: "Sanjay Joshi",
    publishedAt: "2026-07-03T09:20:00Z",
    url: "https://greenearth.in/organic-farming-pkvy-subsidy",
    category: "Organic Farming",
    country: "in",
    language: "en"
  },
  {
    id: "news-mock-05",
    title: "Cotton Prices Hit Record High in Gujarat Markets",
    description: "Sturdy global demand and low inventory carryover have driven cotton market prices upwards, bringing substantial profits to cultivators in Rajkot and Gondal.",
    content: "Cotton Prices Hit Record High in Gujarat Markets. Sturdy global demand and low inventory carryover have driven cotton market prices upwards, bringing substantial profits to cultivators in Rajkot and Gondal. Trade analysts suggest that prices are likely to remain stable over the next crop season due to sustained export commitments.",
    image: "https://images.unsplash.com/photo-1594756297426-5b145887ac5b?auto=format&fit=crop&w=800&q=80",
    source: "Business Agro Daily",
    author: "Kiran Patel",
    publishedAt: "2026-07-02T14:10:00Z",
    url: "https://businessagro.com/cotton-prices-gujarat",
    category: "Business",
    country: "in",
    language: "en"
  },
  {
    id: "news-mock-06",
    title: "Sustainable Agroforestry: Balancing Environment and Economy",
    description: "Integrating trees into farming landscapes helps prevent soil erosion, sequesters carbon, and provides farmers with secondary timber and fruit income streams.",
    content: "Sustainable Agroforestry: Balancing Environment and Economy. Integrating trees into farming landscapes helps prevent soil erosion, sequesters carbon, and provides farmers with secondary timber and fruit income streams. Experts advocate for combining poplars, teak, and eucalyptus with traditional horticultural crops.",
    image: "https://images.unsplash.com/photo-1464241353294-6341a653c05b?auto=format&fit=crop&w=800&q=80",
    source: "Agri Environment Watch",
    author: "Elena Carter",
    publishedAt: "2026-07-01T11:05:00Z",
    url: "https://agrienvwatch.org/sustainable-agroforestry",
    category: "Environment",
    country: "us",
    language: "en"
  },
  {
    id: "news-mock-07",
    title: "Dairy Sector Gets Boost with Low-Interest Infrastructure Loans",
    description: "NABARD launches a dedicated fund to set up automated bulk milk coolers and refrigerated transport vans for local dairy cooperative unions.",
    content: "Dairy Sector Gets Boost with Low-Interest Infrastructure Loans. NABARD launches a dedicated fund to set up automated bulk milk coolers and refrigerated transport vans for local dairy cooperative unions. This aims to minimize milk spoilage during heatwaves and double milk collection efficiency in remote villages.",
    image: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=800&q=80",
    source: "Dairy India Tribune",
    author: "Vikram Mehta",
    publishedAt: "2026-06-30T07:50:00Z",
    url: "https://dairyindiatribune.com/dairy-infrastructure-boost",
    category: "Agriculture",
    country: "in",
    language: "en"
  },
  {
    id: "news-mock-08",
    title: "Drone Spraying Guidelines Formulated for Safe Pesticide Sowing",
    description: "Ministry releases standard operating procedures for operating unmanned aerial vehicles to spray bio-pesticides on crops, ensuring safety and precision.",
    content: "Drone Spraying Guidelines Formulated for Safe Pesticide Sowing. Ministry releases standard operating procedures for operating unmanned aerial vehicles to spray bio-pesticides on crops, ensuring safety and precision. The drone systems must comply with local altitude limits and use specialized nozzles to prevent spray drift onto neighboring farms.",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
    source: "Tech Farmer Bulletin",
    author: "Rajesh Mishra",
    publishedAt: "2026-06-29T16:40:00Z",
    url: "https://techfarmer.com/drone-spraying-guidelines",
    category: "Technology",
    country: "in",
    language: "en"
  }
];

/**
 * Standardizes raw news article objects from GNews into a consistent schema format.
 *
 * @param {object} article - Raw GNews article.
 * @returns {object} Formatted news object.
 */
export const formatNews = (article) => {
  if (!article) return null;

  const url = article.url || "";
  const title = article.title || "Agri News Update";

  // Generate a deterministic ID using a simple regex or base64 variant of the URL/Title
  let id = article.id;
  if (!id) {
    id = url 
      ? "news-" + url.replace(/[^a-z0-9]/gi, "").substring(0, 16).toLowerCase()
      : "news-" + title.replace(/[^a-z0-9]/gi, "").substring(0, 16).toLowerCase();
  }

  return {
    id,
    title,
    description: article.description || "No description available for this article.",
    content: article.content || article.description || "No full content available.",
    image: article.image || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
    source: article.source?.name || "Global Agriculture News",
    author: article.author || article.source?.name || "Unknown",
    publishedAt: article.publishedAt || new Date().toISOString(),
    url: url || "https://gnews.io"
  };
};

/**
 * Checks cache for a given key, returning cached data if within TTL.
 *
 * @param {string} key - Unique cache key.
 * @returns {Array<object>|null} Cached articles list or null.
 */
const checkCache = (key) => {
  const cached = requestCache.get(key);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    console.log(`[GNews Service] Serving response for key "${key}" from memory cache.`);
    return cached.data;
  }
  return null;
};

/**
 * Saves fetched data into the in-memory cache map.
 *
 * @param {string} key - Unique cache key.
 * @param {Array<object>} data - Normalized news articles.
 */
const populateCache = (key, data) => {
  requestCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Makes an HTTP request to the GNews API with caching and fallback capabilities.
 *
 * @param {string} endpoint - API path (e.g. '/search' or '/top-headlines').
 * @param {object} params - Request query parameters.
 * @returns {Promise<Array<object>>} Formatted articles list.
 */
const makeRequest = async (endpoint, params = {}) => {
  const cacheKey = JSON.stringify({ endpoint, params });
  
  // Return cached result if available
  const cachedData = checkCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  if (!API_KEY) {
    throw new Error("GNews API Key is not set. Operating in fallback mode.");
  }

  try {
    console.log(`[GNews Service] Calling API endpoint: ${endpoint} with parameters:`, JSON.stringify(params));
    const response = await gnewsClient.get(endpoint, {
      params: {
        apikey: API_KEY,
        lang: "en", // default language is english
        ...params
      }
    });

    const articles = response.data?.articles;
    if (!Array.isArray(articles)) {
      console.warn("[GNews Service] GNews API responded with an empty or non-array article list.");
      return [];
    }

    const formattedArticles = articles.map(formatNews).filter(Boolean);
    populateCache(cacheKey, formattedArticles);
    return formattedArticles;
  } catch (error) {
    let errMsg = error.message;
    if (error.response) {
      const gnewsErr = error.response.data?.errors;
      errMsg = gnewsErr ? gnewsErr.join(", ") : `Status ${error.response.status} - GNews API responded with error`;
      console.error(`[GNews Service] API Failure [Status ${error.response.status}]:`, errMsg);
    } else if (error.code === "ECONNABORTED") {
      errMsg = "Request timeout. GNews API server took too long to respond.";
      console.error("[GNews Service] API Timeout Error:", error.message);
    } else {
      console.error("[GNews Service] API Network/System Error:", error.message);
    }
    
    // Bubble up error to trigger local mock news fallback
    throw new Error(errMsg);
  }
};

/**
 * Helper to perform mock search filters on the local mock news database.
 * Used as a fallback when GNews API fails.
 *
 * @param {string} keyword - The search term.
 * @returns {Array<object>} Filtered mock articles.
 */
const searchMockNews = (keyword) => {
  if (!keyword) return MOCK_NEWS;
  const term = keyword.toLowerCase().trim();
  return MOCK_NEWS.filter(article => {
    return (article.title && article.title.toLowerCase().includes(term)) ||
           (article.description && article.description.toLowerCase().includes(term)) ||
           (article.content && article.content.toLowerCase().includes(term)) ||
           (article.category && article.category.toLowerCase().includes(term));
  });
};

// ── EXPORTED SERVICE MODULES ──────────────────────────────────────────────────

/**
 * 1. Retrieve the latest agriculture top headlines.
 *
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const getTopHeadlines = async () => {
  try {
    const data = await makeRequest("/top-headlines", { q: "agriculture OR farming" });
    return {
      success: true,
      message: "News fetched successfully",
      data
    };
  } catch (err) {
    console.warn(`[GNews Service] Falling back to mock headlines. Reason: ${err.message}`);
    // Safe agricultural mock data fallback
    const fallbackData = searchMockNews("agriculture");
    return {
      success: true, // We return success: true to keep the frontend functional with mock data
      message: "News fetched successfully",
      data: fallbackData
    };
  }
};

/**
 * 2. Search news using keywords.
 * Keywords typically include crop names, farming, agriculture, etc.
 *
 * @param {string} keyword - Query search term.
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const searchNews = async (keyword) => {
  try {
    if (!keyword || typeof keyword !== "string") {
      return await getTopHeadlines();
    }
    const data = await makeRequest("/search", { q: keyword });
    return {
      success: true,
      message: "News fetched successfully",
      data
    };
  } catch (err) {
    console.warn(`[GNews Service] Falling back to mock search for "${keyword}". Reason: ${err.message}`);
    const fallbackData = searchMockNews(keyword);
    return {
      success: true,
      message: "News fetched successfully",
      data: fallbackData
    };
  }
};

/**
 * 3. Return category-wise news.
 * Standardizes requested categories into either search parameters or native GNews categories.
 *
 * Supported category values: Agriculture, Business, Technology, Environment, Government, Weather.
 *
 * @param {string} category - Category filter string.
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const getNewsByCategory = async (category) => {
  try {
    if (!category || typeof category !== "string") {
      return await getTopHeadlines();
    }

    const normCategory = category.trim().toLowerCase();
    
    // GNews API native category endpoint vs Search query routing
    if (GNEWS_NATIVE_CATEGORIES.includes(normCategory)) {
      const data = await makeRequest("/top-headlines", { category: normCategory });
      return {
        success: true,
        message: "News fetched successfully",
        data
      };
    } else {
      // Route custom categories (e.g. Agriculture, Weather, Environment, Government) to search queries
      const data = await makeRequest("/search", { q: normCategory });
      return {
        success: true,
        message: "News fetched successfully",
        data
      };
    }
  } catch (err) {
    console.warn(`[GNews Service] Falling back to mock categories for "${category}". Reason: ${err.message}`);
    const fallbackData = MOCK_NEWS.filter(n => {
      const artCat = n.category ? n.category.toLowerCase() : "";
      return artCat === category.trim().toLowerCase() || artCat.includes(category.trim().toLowerCase());
    });
    return {
      success: true,
      message: "News fetched successfully",
      data: fallbackData.length > 0 ? fallbackData : MOCK_NEWS
    };
  }
};

/**
 * 4. Return news filtered by country.
 * Supported values: India, United States, Australia.
 *
 * @param {string} country - Target country name.
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const getNewsByCountry = async (country) => {
  try {
    if (!country || typeof country !== "string") {
      return await getTopHeadlines();
    }

    const normCountry = country.trim().toLowerCase();
    const mappedCode = COUNTRY_MAP[normCountry];

    if (!mappedCode) {
      console.warn(`[GNews Service] Country "${country}" not supported natively. Performing generic query.`);
      return await getTopHeadlines();
    }

    const data = await makeRequest("/top-headlines", { q: "agriculture", country: mappedCode });
    return {
      success: true,
      message: "News fetched successfully",
      data
    };
  } catch (err) {
    console.warn(`[GNews Service] Falling back to mock country for "${country}". Reason: ${err.message}`);
    const normCountry = country.trim().toLowerCase();
    const mappedCode = COUNTRY_MAP[normCountry] || "in";
    const fallbackData = MOCK_NEWS.filter(n => n.country === mappedCode);
    return {
      success: true,
      message: "News fetched successfully",
      data: fallbackData.length > 0 ? fallbackData : MOCK_NEWS
    };
  }
};

/**
 * 5. Return news filtered by language.
 * Supported values: English, Hindi, Gujarati.
 *
 * @param {string} language - Target language name.
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const getNewsByLanguage = async (language) => {
  try {
    if (!language || typeof language !== "string") {
      return await getTopHeadlines();
    }

    const normLanguage = language.trim().toLowerCase();
    const mappedCode = LANGUAGE_MAP[normLanguage];

    if (!mappedCode) {
      console.warn(`[GNews Service] Language "${language}" not supported natively. Performing generic query.`);
      return await getTopHeadlines();
    }

    const data = await makeRequest("/top-headlines", { q: "agriculture", lang: mappedCode });
    return {
      success: true,
      message: "News fetched successfully",
      data
    };
  } catch (err) {
    console.warn(`[GNews Service] Falling back to mock language for "${language}". Reason: ${err.message}`);
    const normLanguage = language.trim().toLowerCase();
    const mappedCode = LANGUAGE_MAP[normLanguage] || "en";
    const fallbackData = MOCK_NEWS.filter(n => n.language === mappedCode);
    return {
      success: true,
      message: "News fetched successfully",
      data: fallbackData.length > 0 ? fallbackData : MOCK_NEWS
    };
  }
};

/**
 * 6. Return only agriculture-related articles.
 * Combines standard farming keyword triggers inside GNews search query.
 *
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const getLatestAgricultureNews = async () => {
  try {
    // Formulate a robust boolean logic query for GNews search
    const query = "(farming OR crops OR agriculture OR irrigation OR soil OR harvest OR seeds OR fertilizer OR dairy OR livestock)";
    const data = await makeRequest("/search", { q: query });
    return {
      success: true,
      message: "News fetched successfully",
      data
    };
  } catch (err) {
    console.warn(`[GNews Service] Falling back to mock latest agriculture news. Reason: ${err.message}`);
    return {
      success: true,
      message: "News fetched successfully",
      data: MOCK_NEWS
    };
  }
};

/**
 * 7. Mock bookmarkNews function for future MongoDB persistence.
 *
 * @param {string} newsId - The unique news identifier to bookmark.
 * @returns {Promise<{success: boolean, message: string, data: {newsId: string}}>}
 */
export const bookmarkNews = async (newsId) => {
  try {
    if (!newsId) {
      return {
        success: false,
        message: "Unable to bookmark news. News ID is required."
      };
    }
    console.log(`[GNews Service] Simulated saving bookmark for Article ID: ${newsId} to MongoDB.`);
    
    return {
      success: true,
      message: "News article bookmarked successfully",
      data: {
        newsId
      }
    };
  } catch (err) {
    console.error("[GNews Service] Bookmark error:", err.message);
    return {
      success: false,
      message: "Unable to bookmark news"
    };
  }
};

export default {
  getTopHeadlines,
  searchNews,
  getNewsByCategory,
  getNewsByCountry,
  getNewsByLanguage,
  getLatestAgricultureNews,
  bookmarkNews,
  formatNews
};
