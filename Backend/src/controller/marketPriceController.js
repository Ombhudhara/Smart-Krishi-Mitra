import * as marketPriceService from "../services/marketPriceService.js";
import mongoose from "mongoose";

/**
 * Helper to validate Mongoose ObjectIds.
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Fetch all market prices (supports paging, sorting, filtering).
 * GET /api/market-prices
 */
export const getMarketPrices = async (req, res) => {
  try {
    const {
      cropCategory,
      state,
      district,
      season,
      demandLevel,
      marketStatus,
      minPrice,
      maxPrice,
      page,
      limit,
      sortBy,
    } = req.query;

    const filters = {
      cropCategory,
      state,
      district,
      season,
      demandLevel,
      marketStatus,
      minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
    };

    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      sortBy,
    };

    const result = await marketPriceService.getAllMarketPrices(filters, options);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getMarketPrices controller:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch market prices.",
    });
  }
};

/**
 * Fetch market prices for a specific crop name.
 * GET /api/market-prices/:crop
 */
export const getMarketPriceByCropName = async (req, res) => {
  try {
    const { crop } = req.params;
    if (!crop) {
      return res.status(400).json({
        success: false,
        message: "Crop name parameter is required.",
      });
    }

    const result = await marketPriceService.getMarketPriceByCrop(crop);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getMarketPriceByCropName controller:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch market prices.",
    });
  }
};

/**
 * Fetch prices for a specific state.
 * GET /api/market-prices/state/:state
 */
export const getMarketPricesByState = async (req, res) => {
  try {
    const { state } = req.params;
    if (!state) {
      return res.status(400).json({
        success: false,
        message: "State parameter is required.",
      });
    }

    const result = await marketPriceService.getMarketPricesByState(state);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getMarketPricesByState controller:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch market prices.",
    });
  }
};

/**
 * Fetch prices for a specific district.
 * GET /api/market-prices/district/:district
 */
export const getMarketPricesByDistrict = async (req, res) => {
  try {
    const { district } = req.params;
    if (!district) {
      return res.status(400).json({
        success: false,
        message: "District parameter is required.",
      });
    }

    const result = await marketPriceService.getMarketPricesByDistrict(district);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getMarketPricesByDistrict controller:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch market prices.",
    });
  }
};

/**
 * Fetch prices for a specific crop category.
 * GET /api/market-prices/category/:category
 */
export const getMarketPricesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category parameter is required.",
      });
    }

    const result = await marketPriceService.getMarketPricesByCategory(category);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getMarketPricesByCategory controller:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch market prices.",
    });
  }
};

/**
 * Search market prices across crop name, variety, district, or mandi.
 * GET /api/market-prices/search
 */
export const searchMarketPrices = async (req, res) => {
  try {
    const { keyword, q } = req.query;
    const term = keyword || q;

    const result = await marketPriceService.searchMarketPrices(term);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in searchMarketPrices controller:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch market prices.",
    });
  }
};

/**
 * Fetch top trending high-demand crops.
 * GET /api/market-prices/trending
 */
export const getTrending = async (req, res) => {
  try {
    const result = await marketPriceService.getTrendingCrops();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getTrending controller:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch market prices.",
    });
  }
};

/**
 * Fetch dashboard overview statistics.
 * GET /api/market-prices/dashboard
 */
export const getDashboard = async (req, res) => {
  try {
    const result = await marketPriceService.getDashboardMarketSummary();
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getDashboard controller:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch market prices.",
    });
  }
};

/**
 * Create a new market price entry (Admin Only).
 * POST /api/market-prices
 */
export const createPriceListing = async (req, res) => {
  try {
    const adminId = req.user._id;

    // Validate request body
    const required = [
      "cropName",
      "cropCategory",
      "season",
      "state",
      "district",
      "mandiName",
      "minimumPrice",
      "maximumPrice",
      "averagePrice",
      "priceUnit",
    ];

    const missing = required.filter((field) => req.body[field] === undefined);
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    const result = await marketPriceService.createMarketPrice(req.body, adminId);
    return res.status(201).json(result);
  } catch (error) {
    console.error("Error in createPriceListing controller:", error.message || error);
    return res.status(400).json({
      success: false,
      message: error.message || "Unable to fetch market prices.", // Maintain expected standard signature fallback if API fails
    });
  }
};

/**
 * Update an existing price entry and push to history (Admin Only).
 * PUT /api/market-prices/:id
 */
export const updatePriceListing = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid market price record identifier.",
      });
    }

    const result = await marketPriceService.updateMarketPrice(id, req.body, adminId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in updatePriceListing controller:", error.message || error);
    return res.status(400).json({
      success: false,
      message: error.message || "Unable to fetch market prices.",
    });
  }
};

/**
 * Delete a market price entry (Admin Only).
 * DELETE /api/market-prices/:id
 */
export const deletePriceListing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid market price record identifier.",
      });
    }

    const result = await marketPriceService.deleteMarketPrice(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in deletePriceListing controller:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch market prices.",
    });
  }
};
