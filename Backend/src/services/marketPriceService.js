import MarketPrice from "../models/MarketPrice.js";
import mongoose from "mongoose";

/**
 * Retrieve all crop market prices with optional filters, pagination, and sorting.
 *
 * @param {object} [filters={}] - Filter keys (category, state, district, season, demandLevel, marketStatus, minPrice, maxPrice).
 * @param {object} [options={}] - Pagination and sorting options (page, limit, sortBy).
 * @returns {Promise<{success: boolean, message: string, data: Array<object>, total: number, page: number, limit: number}>}
 */
export const getAllMarketPrices = async (filters = {}, options = {}) => {
  try {
    const query = {};

    // Apply filters if provided
    if (filters.cropCategory) query.cropCategory = filters.cropCategory;
    if (filters.state) query.state = { $regex: new RegExp("^" + filters.state + "$", "i") };
    if (filters.district) query.district = { $regex: new RegExp("^" + filters.district + "$", "i") };
    if (filters.season) query.season = filters.season;
    if (filters.demandLevel) query.demandLevel = filters.demandLevel;
    if (filters.marketStatus) query.marketStatus = filters.marketStatus;

    // Price range filters
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.averagePrice = {};
      if (filters.minPrice !== undefined) query.averagePrice.$gte = Number(filters.minPrice);
      if (filters.maxPrice !== undefined) query.averagePrice.$lte = Number(filters.maxPrice);
    }

    // Pagination details
    const page = Math.max(1, parseInt(options.page) || 1);
    const limit = Math.max(1, parseInt(options.limit) || 20);
    const skip = (page - 1) * limit;

    // Sorting details (e.g. "averagePrice:desc", "cropName:asc")
    let sort = { cropName: 1 };
    if (options.sortBy) {
      const parts = options.sortBy.split(":");
      sort = { [parts[0]]: parts[1] === "desc" ? -1 : 1 };
    }

    const total = await MarketPrice.countDocuments(query);
    const prices = await MarketPrice.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("updatedBy", "fullName email phone")
      .lean();

    return {
      success: true,
      message: "Market prices fetched successfully.",
      data: prices,
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error in getAllMarketPrices service:", error.message || error);
    throw new Error("Unable to fetch market prices.");
  }
};

/**
 * Retrieve prices for a specific crop by name.
 *
 * @param {string} cropName - Crop name to match.
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const getMarketPriceByCrop = async (cropName) => {
  try {
    const prices = await MarketPrice.find({
      cropName: { $regex: cropName, $options: "i" },
    })
      .populate("updatedBy", "fullName email")
      .lean();

    return {
      success: true,
      message: "Market prices fetched successfully.",
      data: prices,
    };
  } catch (error) {
    console.error("Error in getMarketPriceByCrop service:", error.message || error);
    throw new Error("Unable to fetch market prices for the crop.");
  }
};

/**
 * Retrieve prices by crop category.
 *
 * @param {string} category - Category string (e.g. Cereals, Pulses).
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const getMarketPricesByCategory = async (category) => {
  try {
    const prices = await MarketPrice.find({
      cropCategory: { $regex: category, $options: "i" },
    })
      .populate("updatedBy", "fullName email")
      .lean();

    return {
      success: true,
      message: "Market prices fetched successfully.",
      data: prices,
    };
  } catch (error) {
    console.error("Error in getMarketPricesByCategory service:", error.message || error);
    throw new Error("Unable to fetch market prices for the category.");
  }
};

/**
 * Retrieve prices for a specific state.
 *
 * @param {string} state - Indian state name.
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const getMarketPricesByState = async (state) => {
  try {
    const prices = await MarketPrice.find({
      state: { $regex: new RegExp("^" + state + "$", "i") },
    })
      .populate("updatedBy", "fullName email")
      .lean();

    return {
      success: true,
      message: "Market prices fetched successfully.",
      data: prices,
    };
  } catch (error) {
    console.error("Error in getMarketPricesByState service:", error.message || error);
    throw new Error("Unable to fetch market prices for the state.");
  }
};

/**
 * Retrieve prices for a specific district.
 *
 * @param {string} district - District name.
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const getMarketPricesByDistrict = async (district) => {
  try {
    const prices = await MarketPrice.find({
      district: { $regex: new RegExp("^" + district + "$", "i") },
    })
      .populate("updatedBy", "fullName email")
      .lean();

    return {
      success: true,
      message: "Market prices fetched successfully.",
      data: prices,
    };
  } catch (error) {
    console.error("Error in getMarketPricesByDistrict service:", error.message || error);
    throw new Error("Unable to fetch market prices for the district.");
  }
};

/**
 * Search market prices by crop name, variety, or mandi name.
 *
 * @param {string} keyword - Search term.
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const searchMarketPrices = async (keyword) => {
  try {
    if (!keyword) {
      return await getAllMarketPrices();
    }
    const cleanKeyword = String(keyword).trim();
    const query = {
      $or: [
        { cropName: { $regex: cleanKeyword, $options: "i" } },
        { cropVariety: { $regex: cleanKeyword, $options: "i" } },
        { mandiName: { $regex: cleanKeyword, $options: "i" } },
        { district: { $regex: cleanKeyword, $options: "i" } },
        { state: { $regex: cleanKeyword, $options: "i" } }
      ],
    };

    const prices = await MarketPrice.find(query)
      .populate("updatedBy", "fullName email")
      .lean();

    return {
      success: true,
      message: "Market prices fetched successfully.",
      data: prices,
    };
  } catch (error) {
    console.error("Error in searchMarketPrices service:", error.message || error);
    throw new Error("Unable to search market prices.");
  }
};

/**
 * Combines filters to fetch custom market price lists.
 *
 * @param {object} filters - Dynamic crop filter criteria.
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const filterMarketPrices = async (filters = {}) => {
  try {
    const query = {};

    if (filters.cropCategory) query.cropCategory = filters.cropCategory;
    if (filters.state) query.state = { $regex: new RegExp("^" + filters.state + "$", "i") };
    if (filters.district) query.district = { $regex: new RegExp("^" + filters.district + "$", "i") };
    if (filters.season) query.season = filters.season;
    if (filters.demandLevel) query.demandLevel = filters.demandLevel;
    if (filters.marketStatus) query.marketStatus = filters.marketStatus;

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.averagePrice = {};
      if (filters.minPrice !== undefined) query.averagePrice.$gte = Number(filters.minPrice);
      if (filters.maxPrice !== undefined) query.averagePrice.$lte = Number(filters.maxPrice);
    }

    const prices = await MarketPrice.find(query)
      .populate("updatedBy", "fullName email")
      .lean();

    return {
      success: true,
      message: "Market prices fetched successfully.",
      data: prices,
    };
  } catch (error) {
    console.error("Error in filterMarketPrices service:", error.message || error);
    throw new Error("Unable to filter market prices.");
  }
};

/**
 * Admin action: Create a new market price listing and initialize its history.
 *
 * @param {object} data - Crop price body data.
 * @param {string} adminId - Ref user who initialized.
 * @returns {Promise<{success: boolean, message: string, data: object}>}
 */
export const createMarketPrice = async (data, adminId) => {
  try {
    const min = Number(data.minimumPrice);
    const max = Number(data.maximumPrice);
    const avg = Number(data.averagePrice);

    if (max < min) throw new Error("Maximum price cannot be less than minimum price.");
    if (avg < min || avg > max) throw new Error("Average price must be between minimum price and maximum price.");

    // Define initial price history node
    const historyNode = {
      date: new Date(),
      minimumPrice: min,
      maximumPrice: max,
      averagePrice: avg,
      availableQuantity: Number(data.availableQuantity) || 0,
      updatedBy: adminId,
    };

    const newRecord = new MarketPrice({
      ...data,
      minimumPrice: min,
      maximumPrice: max,
      averagePrice: avg,
      priceHistory: [historyNode],
      updatedBy: adminId,
      lastUpdated: new Date(),
    });

    const saved = await newRecord.save();
    return {
      success: true,
      message: "Market price record created successfully.",
      data: saved,
    };
  } catch (error) {
    console.error("Error in createMarketPrice service:", error.message || error);
    throw new Error(error.message || "Unable to create market price entry.");
  }
};

/**
 * Admin action: Update current prices and add/update daily price history logs.
 * Keeps history cleaner by updating the same calendar day's entry rather than inflating rows.
 *
 * @param {string} id - The record ObjectId.
 * @param {object} data - Updating fields.
 * @param {string} adminId - Executing admin ID.
 * @returns {Promise<{success: boolean, message: string, data: object}>}
 */
export const updateMarketPrice = async (id, data, adminId) => {
  try {
    const record = await MarketPrice.findById(id);
    if (!record) {
      throw new Error("Market price record not found.");
    }

    // Capture prices (falling back to current values if undefined)
    const min = data.minimumPrice !== undefined ? Number(data.minimumPrice) : record.minimumPrice;
    const max = data.maximumPrice !== undefined ? Number(data.maximumPrice) : record.maximumPrice;
    const avg = data.averagePrice !== undefined ? Number(data.averagePrice) : record.averagePrice;
    const qty = data.availableQuantity !== undefined ? Number(data.availableQuantity) : record.availableQuantity;

    if (max < min) throw new Error("Maximum price cannot be less than minimum price.");
    if (avg < min || avg > max) throw new Error("Average price must be between minimum price and maximum price.");

    // Update main fields
    if (data.cropName) record.cropName = data.cropName;
    if (data.cropCategory) record.cropCategory = data.cropCategory;
    if (data.cropVariety) record.cropVariety = data.cropVariety;
    if (data.season) record.season = data.season;
    if (data.state) record.state = data.state;
    if (data.district) record.district = data.district;
    if (data.mandiName) record.mandiName = data.mandiName;
    if (data.priceUnit) record.priceUnit = data.priceUnit;
    if (data.demandLevel) record.demandLevel = data.demandLevel;
    if (data.qualityGrade) record.qualityGrade = data.qualityGrade;
    if (data.marketStatus) record.marketStatus = data.marketStatus;
    if (data.remarks) record.remarks = data.remarks;

    record.minimumPrice = min;
    record.maximumPrice = max;
    record.averagePrice = avg;
    record.availableQuantity = qty;
    record.updatedBy = adminId;
    record.lastUpdated = new Date();

    // Check if we already have a pricing update on the same calendar day to update it, otherwise push
    const today = new Date();
    const isSameDay = (d1, d2) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    const historyNode = {
      date: today,
      minimumPrice: min,
      maximumPrice: max,
      averagePrice: avg,
      availableQuantity: qty,
      updatedBy: adminId,
    };

    const lastHistory = record.priceHistory[record.priceHistory.length - 1];
    if (lastHistory && isSameDay(new Date(lastHistory.date), today)) {
      // Overwrite today's previous edit to prevent duplicates
      record.priceHistory[record.priceHistory.length - 1] = historyNode;
    } else {
      // Push new record for a new day
      record.priceHistory.push(historyNode);
    }

    const updated = await record.save();
    return {
      success: true,
      message: "Market price updated successfully.",
      data: updated,
    };
  } catch (error) {
    console.error("Error in updateMarketPrice service:", error.message || error);
    throw new Error(error.message || "Unable to update market price entry.");
  }
};

/**
 * Admin action: Delete a market price listing.
 *
 * @param {string} id - The record ID.
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const deleteMarketPrice = async (id) => {
  try {
    const record = await MarketPrice.findByIdAndDelete(id);
    if (!record) {
      throw new Error("Market price record not found.");
    }
    return {
      success: true,
      message: "Market price record deleted successfully.",
    };
  } catch (error) {
    console.error("Error in deleteMarketPrice service:", error.message || error);
    throw new Error(error.message || "Unable to delete market price entry.");
  }
};

/**
 * Return crops with the highest demand Level ("High").
 *
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const getTrendingCrops = async () => {
  try {
    const trending = await MarketPrice.find({ demandLevel: "High" })
      .sort({ averagePrice: -1 })
      .limit(10)
      .lean();

    return {
      success: true,
      message: "Trending crop prices fetched successfully.",
      data: trending,
    };
  } catch (error) {
    console.error("Error in getTrendingCrops service:", error.message || error);
    throw new Error("Unable to fetch trending crops.");
  }
};

/**
 * Return top selling crops (frequently traded based on highest available quantity).
 *
 * @returns {Promise<{success: boolean, message: string, data: Array<object>}>}
 */
export const getTopSellingCrops = async () => {
  try {
    const topSelling = await MarketPrice.find({ marketStatus: "Open" })
      .sort({ availableQuantity: -1 })
      .limit(10)
      .lean();

    return {
      success: true,
      message: "Top selling crop prices fetched successfully.",
      data: topSelling,
    };
  } catch (error) {
    console.error("Error in getTopSellingCrops service:", error.message || error);
    throw new Error("Unable to fetch top selling crops.");
  }
};

/**
 * Return consolidated dashboard market price metrics summary.
 *
 * @returns {Promise<{success: boolean, message: string, data: object}>}
 */
export const getDashboardMarketSummary = async () => {
  try {
    const totalCrops = await MarketPrice.distinct("cropName");
    const activeMandis = await MarketPrice.distinct("mandiName", { marketStatus: "Open" });

    // Aggregate statistics
    const stats = await MarketPrice.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: "$averagePrice" },
        },
      },
    ]);

    const highestPriceCrop = await MarketPrice.findOne()
      .sort({ averagePrice: -1 })
      .select("cropName cropVariety mandiName averagePrice priceUnit state")
      .lean();

    const lowestPriceCrop = await MarketPrice.findOne()
      .sort({ averagePrice: 1 })
      .select("cropName cropVariety mandiName averagePrice priceUnit state")
      .lean();

    const recentlyUpdated = await MarketPrice.find()
      .sort({ lastUpdated: -1 })
      .limit(5)
      .select("cropName cropVariety mandiName averagePrice lastUpdated state")
      .lean();

    return {
      success: true,
      message: "Market summary fetched successfully.",
      data: {
        totalCropsCount: totalCrops.length,
        activeMandisCount: activeMandis.length,
        highestPriceCrop: highestPriceCrop || null,
        lowestPriceCrop: lowestPriceCrop || null,
        overallAveragePrice: stats[0] ? parseFloat(stats[0].avgPrice.toFixed(2)) : 0,
        recentlyUpdated,
      },
    };
  } catch (error) {
    console.error("Error in getDashboardMarketSummary service:", error.message || error);
    throw new Error("Unable to calculate market summary.");
  }
};

export default {
  getAllMarketPrices,
  getMarketPriceByCrop,
  getMarketPricesByCategory,
  getMarketPricesByState,
  getMarketPricesByDistrict,
  searchMarketPrices,
  filterMarketPrices,
  createMarketPrice,
  updateMarketPrice,
  deleteMarketPrice,
  getTrendingCrops,
  getTopSellingCrops,
  getDashboardMarketSummary,
};
