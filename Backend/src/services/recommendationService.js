import axios from "axios";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Notification from "../models/Notification.js";
import Listing from "../models/Listing.js";
import Calculation from "../models/Calculation.js";
import weatherService from "./weatherService.js";
import marketPriceService from "./marketPriceService.js";

// Retrieve configurations from environment
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/**
 * 1. Generate recommendation based on weather conditions.
 *
 * @param {object} [weather={}] - Mapped complete weather data.
 * @returns {object} Weather recommendation insights.
 */
export const getWeatherRecommendation = (weather = {}) => {
  const current = weather.current || {};
  const forecast = weather.forecast || [];
  
  const temp = current.temp || 28;
  const humidity = current.humidity || 60;
  const condition = (current.condition || "").toLowerCase();
  
  // Look at the immediate forecast day parameters
  const firstDay = forecast[0] || {};
  const chanceOfRain = firstDay.chanceOfRain || 0;
  const windSpeed = current.windSpeed || 10;
  const uvIndex = current.uvIndex || 5;

  let action = "Irrigate crops normally. Weather conditions are stable.";
  let status = "Normal";
  let reason = "Moderate temperature and stable humidity levels detected.";

  if (chanceOfRain > 60 || condition.includes("rain") || condition.includes("drizzle")) {
    action = "Delay irrigation. Heavy rainfall is expected.";
    status = "Warning";
    reason = `High precipitation probability of ${chanceOfRain}% indicated in local forecasts.`;
  } else if (windSpeed > 22) {
    action = "Avoid pesticide or fertilizer spraying today.";
    status = "Warning";
    reason = `Wind speed is currently high at ${windSpeed} km/h, which can cause chemical drift.`;
  } else if (temp > 38) {
    action = "Increase irrigation frequency (heat wave warning).";
    status = "Alert";
    reason = `Extreme high temperature of ${temp}°C detected. Risk of crop moisture depletion.`;
  } else if (uvIndex > 8) {
    action = "Apply organic mulch to retain soil moisture.";
    status = "Normal";
    reason = `High solar UV index of ${uvIndex} can cause crop leaf burn and rapid soil drying.`;
  }

  return {
    action,
    status,
    reason,
    details: {
      temperature: `${temp}°C`,
      humidity: `${humidity}%`,
      windSpeed: `${windSpeed} km/h`,
      rainChance: `${chanceOfRain}%`,
      uvIndex
    }
  };
};

/**
 * 2. Generate market crop pricing recommendations.
 *
 * @param {object} [marketData={}] - Aggregated market price details.
 * @param {Array<string>} [preferredCrops=[]] - List of crops historically grown by farmer.
 * @returns {object} Market price recommendation insights.
 */
export const getMarketRecommendation = (marketData = {}, preferredCrops = []) => {
  const prices = marketData.data || [];
  const summary = marketData.summary || {};

  let action = "Hold inventory and monitor market prices.";
  let insights = "Market rates are currently stable for most local agricultural commodities.";
  let recommendations = [];

  // Match local prices against preferred crops
  const userCropsInMarket = prices.filter(p => 
    preferredCrops.some(pc => pc.toLowerCase() === p.cropName.toLowerCase())
  );

  if (userCropsInMarket.length > 0) {
    const highDemandCrop = userCropsInMarket.find(p => p.demandLevel === "High");
    if (highDemandCrop) {
      action = `Sell your ${highDemandCrop.cropName} inventory this week.`;
      insights = `High demand level detected for ${highDemandCrop.cropName} at ${highDemandCrop.mandiName} with average prices reaching ₹${highDemandCrop.averagePrice}/${highDemandCrop.priceUnit}.`;
    } else {
      const lowPriceCrop = userCropsInMarket.find(p => p.demandLevel === "Low");
      if (lowPriceCrop) {
        action = `Hold your ${lowPriceCrop.cropName} crops for a few more days.`;
        insights = `Low market demand and weaker pricing (₹${lowPriceCrop.averagePrice}/${lowPriceCrop.priceUnit}) observed. Price recovery expected in upcoming weeks.`;
      }
    }
  } else if (prices.length > 0) {
    // General fallback insights based on mandi prices
    const highestCrop = prices[0];
    action = `Consider planting ${highestCrop.cropName} next season.`;
    insights = `Highest average price in recent mandi listings is for ${highestCrop.cropName} at ₹${highestCrop.averagePrice}/${highestCrop.priceUnit}.`;
  }

  return {
    action,
    insights,
    highestPriceCropName: summary.highestPriceCrop?.cropName || "N/A",
    overallAveragePrice: summary.overallAveragePrice || 0,
    activeMandis: summary.activeMandisCount || 0
  };
};

/**
 * 3. Recommend best crop based on season, soil type, and mandi prices.
 *
 * @param {object} [profile={}] - User profile details.
 * @param {object} [weather={}] - Weather data.
 * @param {object} [marketData={}] - Market prices.
 * @returns {object} Crop recommendations.
 */
export const getCropRecommendation = (profile = {}, weather = {}, marketData = {}) => {
  const soilType = (profile.soilType || "Alluvial").trim().toLowerCase();
  
  // Decide current crop season based on current calendar month
  const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
  let season = "Whole Year";
  if (month >= 5 && month <= 9) season = "Kharif"; // June to October
  else if (month >= 10 || month <= 2) season = "Rabi"; // November to March
  else season = "Zaid / Summer"; // April to May

  let recommendedCrops = ["Maize", "Moong"];
  let reason = "Broad-spectrum pulses and cereals suitable for standard agricultural seasons.";

  if (soilType.includes("black")) {
    recommendedCrops = ["Cotton", "Soybean", "Gram"];
    reason = `Black soil type has high water retention, which is highly compatible for growing ${season} Cash crops like Cotton.`;
  } else if (soilType.includes("red")) {
    recommendedCrops = ["Groundnut", "Ragi", "Tobacco"];
    reason = `Red porous soils are well-suited for oilseeds and millets during the ${season} season.`;
  } else if (soilType.includes("alluvial") || soilType.includes("clay")) {
    recommendedCrops = ["Rice", "Wheat", "Sugarcane"];
    reason = `Alluvial loam/clayey soils are fertile and support high moisture crops like Rice (Kharif) and Wheat (Rabi).`;
  } else if (soilType.includes("sandy")) {
    recommendedCrops = ["Bajra", "Sesame", "Guar"];
    reason = `Sandy soils dry quickly, requiring drought-resistant crops like Bajra and Guar.`;
  }

  return {
    recommendedCrops,
    season,
    reason,
    soilCompatibility: `${profile.soilType || "Not Specified"} Soil`
  };
};

/**
 * 4. Recommend fertilizers based on soil and targeted crop.
 *
 * @param {object} [profile={}] - User profile details.
 * @param {object} [cropRec={}] - Recommended crop insights.
 * @returns {object} Fertilizer recommendations.
 */
export const getFertilizerRecommendation = (profile = {}, cropRec = {}) => {
  const soilType = (profile.soilType || "Alluvial").toLowerCase();
  const crop = cropRec.recommendedCrops ? cropRec.recommendedCrops[0] : "Wheat";

  let fertilizer = "NPK (Nitrogen, Phosphorus, Potassium) 19:19:19 complex";
  let dosage = "100-120 kg per acre in split applications.";
  let tips = "Apply organic compost manure to restore microbial activity.";

  if (soilType.includes("black")) {
    fertilizer = "DAP (Diammonium Phosphate) and Urea";
    dosage = "50 kg DAP at sowing stage + 40 kg Urea top dressing after 30 days.";
    tips = "Add sulfur additives to boost oil production in oilseeds or cotton yield.";
  } else if (soilType.includes("sandy") || soilType.includes("red")) {
    fertilizer = "NPK 12:32:16 fertilizer mix";
    dosage = "75 kg per acre during field preparation and sowing stages.";
    tips = "Apply zinc sulfate micronutrients to prevent zinc deficiency symptoms.";
  } else if (soilType.includes("clay") || soilType.includes("alluvial")) {
    fertilizer = "Urea and Muriate of Potash (MOP)";
    dosage = "80 kg Urea in three split doses + 30 kg MOP per acre.";
    tips = "Ensure soil has moderate moisture before applying granular urea.";
  }

  return {
    recommendation: `NPK/Urea balanced dosage customized for growing ${crop}.`,
    fertilizerName: fertilizer,
    dosage,
    tips
  };
};

/**
 * 5. Recommend harvesting timelines based on weather conditions.
 *
 * @param {object} [weather={}] - Weather reports.
 * @returns {object} Harvesting timeline recommendations.
 */
export const getHarvestRecommendation = (weather = {}) => {
  const forecast = weather.forecast || [];
  const rainChance = forecast[0]?.chanceOfRain || 0;
  const condition = (weather.current?.condition || "").toLowerCase();

  let action = "Proceed with crop harvesting as scheduled.";
  let reason = "Sunny, dry weather creates optimal conditions for drying crops in the field.";

  if (rainChance > 50 || condition.includes("rain") || condition.includes("drizzle")) {
    action = "Delay harvesting for 3-4 days.";
    reason = `Rain showers (${rainChance}% chance) are forecasted, which can rot harvested grains and increase grain moisture levels.`;
  }

  return {
    action,
    reason,
    precautionarySteps: rainChance > 50 
      ? "Move cut crops immediately to elevated dry storage sheds and cover with tarpaulin sheets."
      : "Ensure crops are dry and moisture levels meet standard specifications before bag storage."
  };
};

/**
 * 6. Recommend best selling timelines and mandis.
 *
 * @param {object} [marketData={}] - Consolidated market price details.
 * @param {object} [profile={}] - User profile details.
 * @returns {object} Selling recommendations.
 */
export const getSellingRecommendation = (marketData = {}, profile = {}) => {
  const prices = marketData.data || [];
  const district = (profile.district || "").toLowerCase().trim();

  let bestTime = "Within the next 7-10 days.";
  let expectedPrice = "Market average rates.";
  let nearestMandi = "Nearby APMC center.";

  // Filter mandis within user's district or state
  const localMarkets = prices.filter(p => 
    p.district && p.district.toLowerCase().trim() === district
  );

  if (localMarkets.length > 0) {
    // Find the one with highest price
    const bestMarket = [...localMarkets].sort((a, b) => b.averagePrice - a.averagePrice)[0];
    expectedPrice = `₹${bestMarket.averagePrice}/${bestMarket.priceUnit}`;
    nearestMandi = `${bestMarket.mandiName} (District: ${bestMarket.district})`;
    bestTime = bestMarket.demandLevel === "High" 
      ? "Sell immediately to capitalize on high demand levels." 
      : "Hold and monitor price graphs for positive breakouts.";
  } else if (prices.length > 0) {
    const overallBest = [...prices].sort((a, b) => b.averagePrice - a.averagePrice)[0];
    expectedPrice = `₹${overallBest.averagePrice}/${overallBest.priceUnit}`;
    nearestMandi = `${overallBest.mandiName} (${overallBest.state})`;
  }

  return {
    bestTime,
    expectedPrice,
    nearestMandi
  };
};

/**
 * 7. Communicate with Gemini AI using a structured prompt to receive an advisor summary.
 *
 * @param {object} promptData - Complete consolidated farmer data payload.
 * @returns {Promise<string>} Detailed advice summary text.
 */
const fetchAISummary = async (promptData) => {
  if (!OPENROUTER_API_KEY) {
    console.warn("[Recommendation Service] OPENROUTER_API_KEY variable is missing. Running in rule-based fallback mode.");
    return generateFallbackSummary(promptData);
  }

  // Construct a detailed, structured prompt for the AI Advisor
  const prompt = `
You are the AI Agricultural Expert Advisor for the Smart Krishi Mitra platform.
Analyze the following farmer profile, current real-time weather conditions, and mandi market prices to generate a concise, highly actionable paragraph of personalized advice (max 150 words).

FARMER PROFILE:
- Location: Village: ${promptData.profile.village || "N/A"}, District: ${promptData.profile.district || "N/A"}, State: ${promptData.profile.state || "N/A"}
- Farm Size: ${promptData.profile.farmSize || "N/A"} Acres
- Soil Type: ${promptData.profile.soilType || "Alluvial"}
- Preferred Crops: ${promptData.profile.cropsGrown?.join(", ") || "Wheat, Cotton, Rice"}

CURRENT WEATHER:
- Temp: ${promptData.weather.current?.temp || "N/A"}°C, Humidity: ${promptData.weather.current?.humidity || "N/A"}%
- Forecast Condition: ${promptData.weather.forecast?.[0]?.condition || "Stable"}
- Rain Probability: ${promptData.weather.forecast?.[0]?.chanceOfRain || 0}%
- Wind Speed: ${promptData.weather.current?.windSpeed || 0} km/h

MARKET METRICS:
- District APMC Markets Count: ${promptData.market.summary?.activeMandisCount || 0} Mandis
- Highest Price Crop: ${promptData.market.summary?.highestPriceCrop?.cropName || "N/A"} (₹${promptData.market.summary?.highestPriceCrop?.averagePrice || 0}/Quintal)
- Local Demand Trend: Overall Average Price is ₹${promptData.market.summary?.overallAveragePrice || 0}/Quintal

RECENT ACTIVITY:
- Total Transactions Logged: ${promptData.transactionsCount || 0}
- Unread Notifications: ${promptData.notificationsCount || 0}

Based on this, draft a direct, expert, professional advice paragraph in English. Do not include headers, greetings, bullet points, or sign-offs. Focus on immediate farming actions, crop selections, and selling tactics.
`;

  try {
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured in environment variables.");
    }

    console.log("[Recommendation Service] Dispatching payload to Router API...");
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        timeout: 12000
      }
    );

    const aiText = response.data?.choices?.[0]?.message?.content;
    if (!aiText) {
      throw new Error("Invalid or empty response format received from Router API.");
    }
    return aiText.trim();
  } catch (error) {
    let errMsg = error.message;
    if (error.response) {
      errMsg = `Status ${error.response.status} - ${JSON.stringify(error.response.data)}`;
    }
    console.error("[Recommendation Service] Gemini AI connection failed:", errMsg);
    return generateFallbackSummary(promptData);
  }
};

/**
 * Helper to generate a logical advice summary in case Gemini AI is rate-limited or offline.
 */
const generateFallbackSummary = (data) => {
  const name = data.profile.fullName || "Farmer";
  const state = data.profile.state || "your region";
  const soil = data.profile.soilType || "Alluvial";
  const crops = data.profile.cropsGrown?.length > 0 ? data.profile.cropsGrown[0] : "Wheat";
  const rain = data.weather.forecast?.[0]?.chanceOfRain || 0;

  let advice = `Hello ${name}. For your farm in ${state} with ${soil} soil, we recommend focusing on moisture retention and monitoring market prices. `;
  
  if (rain > 50) {
    advice += `Since there is a high ${rain}% chance of rain, please hold off on applying chemical spray fertilizers and prepare drains to prevent waterlogging. `;
  } else {
    advice += `Stable clear weather is expected. This is an ideal time for crop top-dressing with Urea or starting farm clearing. `;
  }

  advice += `Mandi demand levels for major cash crops remain steady. Check the Marketplace page to connect with active vendors.`;
  return advice;
};

/**
 * 8. Core orchestrator: Fetch User profile, Weather, Mandis, and Transactions in parallel,
 * compile rule-based crop recommendation metrics, query Gemini AI, and return dashboard insights.
 *
 * @param {string} userId - Target user database reference ID.
 * @returns {Promise<{success: boolean, message: string, data: object}>}
 */
export const generateCompleteRecommendation = async (userId) => {
  try {
    if (!userId) {
      return {
        success: false,
        message: "Unable to generate recommendations. User ID is required."
      };
    }

    // 1. Fetch User Profile
    const profile = await User.findById(userId).lean();
    if (!profile) {
      return {
        success: false,
        message: "Unable to generate recommendations. User profile not found."
      };
    }

    // Derive search location (village/district/state) for weather/mandi lookups
    const weatherLocation = profile.district || profile.state || "Delhi";
    const userState = profile.state || "";
    const userDistrict = profile.district || "";

    // 2. Fetch all parameters simultaneously in parallel
    console.log(`[Recommendation Service] Fetching raw inputs for User: ${profile.fullName} (${userId})`);
    
    let weatherData = {};
    let marketData = {};
    let transactionsCount = 0;
    let notificationsCount = 0;

    const weatherPromise = weatherService.getCompleteWeather(weatherLocation).catch(err => {
      console.error("[Recommendation Service] Error fetching weather values in parallel:", err.message);
      return {}; // return empty to prevent thread crash
    });

    const marketPromise = marketPriceService.getDashboardMarketSummary().catch(err => {
      console.error("[Recommendation Service] Error fetching market dashboard values:", err.message);
      return {};
    });

    const localMarketPricesPromise = marketPriceService.getAllMarketPrices(
      { state: userState, district: userDistrict }, 
      { limit: 30 }
    ).catch(err => {
      console.error("[Recommendation Service] Error fetching local market prices:", err.message);
      return { data: [] };
    });

    const transactionPromise = Transaction.countDocuments({
      $or: [{ buyer: userId }, { seller: userId }]
    }).catch(() => 0);

    const notificationPromise = Notification.countDocuments({
      recipient: userId,
      read: false
    }).catch(() => 0);

    const [weatherRes, marketSummaryRes, localPricesRes, txCount, notifCount] = await Promise.all([
      weatherPromise,
      marketPromise,
      localMarketPricesPromise,
      transactionPromise,
      notificationPromise
    ]);

    weatherData = weatherRes;
    transactionsCount = txCount;
    notificationsCount = notifCount;

    // Combine dashboard market aggregates with local crop prices
    marketData = {
      summary: marketSummaryRes.data || {},
      data: localPricesRes.data || []
    };

    // 3. Compile rule-based recommendation objects
    const weatherRec = getWeatherRecommendation(weatherData);
    const marketRec = getMarketRecommendation(marketData, profile.cropsGrown || []);
    const cropRec = getCropRecommendation(profile, weatherData, marketData);
    const fertilizerRec = getFertilizerRecommendation(profile, cropRec);
    const harvestRec = getHarvestRecommendation(weatherData);
    const sellingRec = getSellingRecommendation(marketData, profile);

    // 4. Dispatch metadata to AI summary provider
    const promptData = {
      profile,
      weather: weatherData,
      market: marketData,
      transactionsCount,
      notificationsCount
    };

    const aiSummary = await fetchAISummary(promptData);

    return {
      success: true,
      message: "Recommendations generated successfully",
      data: {
        weather: weatherRec,
        market: marketRec,
        crop: cropRec,
        fertilizer: fertilizerRec,
        selling: sellingRec,
        harvest: harvestRec,
        summary: aiSummary
      }
    };
  } catch (error) {
    console.error("[Recommendation Service] Critical orchestrator failure:", error.message || error);
    return {
      success: false,
      message: "Unable to generate recommendations."
    };
  }
};

/**
 * 9. Wrapper endpoint returning recommendations.
 *
 * @param {string} userId - Target user database ID.
 * @returns {Promise<{success: boolean, message: string, data: object}>}
 */
export const getDashboardRecommendation = async (userId) => {
  return await generateCompleteRecommendation(userId);
};

export default {
  getWeatherRecommendation,
  getMarketRecommendation,
  getCropRecommendation,
  getFertilizerRecommendation,
  getHarvestRecommendation,
  getSellingRecommendation,
  getDashboardRecommendation,
  generateCompleteRecommendation
};
