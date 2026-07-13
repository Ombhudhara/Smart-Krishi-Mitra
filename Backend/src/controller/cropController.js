import cropKnowledgeService from "../services/cropKnowledgeService.js";

/**
 * Get all crops with optional filtering
 * GET /api/crops
 */
export const getAllCrops = async (req, res) => {
  try {
    const { season, category, soil, search, sort } = req.query;
    const result = cropKnowledgeService.getAllCrops({
      season,
      category,
      soil,
      search,
      sort,
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getAllCrops controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error retrieving crops." });
  }
};

/**
 * Get a single crop by ID
 * GET /api/crops/:id
 */
export const getCropById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = cropKnowledgeService.getCropById(id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getCropById controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error retrieving crop details." });
  }
};

/**
 * Search crops
 * GET /api/crops/search
 */
export const searchCrops = async (req, res) => {
  try {
    const { q } = req.query;
    const result = cropKnowledgeService.getAllCrops({ search: q });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in searchCrops controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error searching crops." });
  }
};

/**
 * Get crops by season
 * GET /api/crops/season/:season
 */
export const getCropsBySeason = async (req, res) => {
  try {
    const { season } = req.params;
    const result = cropKnowledgeService.getCropsBySeason(season);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in getCropsBySeason controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error retrieving crops by season." });
  }
};
