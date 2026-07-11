import Calculation from "../models/Calculation.js";

/**
 * Get calculation history for logged-in user.
 * GET /api/calculator/history
 */
export const getCalculations = async (req, res) => {
  try {
    const history = await Calculation.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, history });
  } catch (error) {
    console.error("Error in getCalculations controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error retrieving calculation history." });
  }
};

/**
 * Save cost calculation details.
 * POST /api/calculator/save
 */
export const saveCalculation = async (req, res) => {
  try {
    const {
      cropName,
      landArea,
      seedCost,
      fertilizerCost,
      labourCost,
      machineryCost,
      irrigationCost,
      otherCost,
      totalCost,
      expectedYield,
      expectedRevenue,
      expectedProfit,
      season,
      year,
      cropVariety,
    } = req.body;

    if (!cropName || !landArea || totalCost === undefined) {
      return res.status(400).json({ success: false, message: "Please provide all required fields." });
    }

    const calc = await Calculation.create({
      user: req.user._id,
      cropName,
      landArea,
      seedCost: seedCost || 0,
      fertilizerCost: fertilizerCost || 0,
      labourCost: labourCost || 0,
      machineryCost: machineryCost || 0,
      irrigationCost: irrigationCost || 0,
      otherCost: otherCost || 0,
      totalCost,
      expectedYield: expectedYield || 0,
      expectedRevenue: expectedRevenue || 0,
      expectedProfit: expectedProfit || 0,
      season: season || "",
      year: year || new Date().getFullYear(),
      cropVariety: cropVariety || "",
    });

    return res.status(201).json({
      success: true,
      message: "Calculation saved successfully.",
      calculation: calc,
    });
  } catch (error) {
    console.error("Error in saveCalculation controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error saving calculation." });
  }
};

/**
 * Delete a saved calculation.
 * DELETE /api/calculator/:id
 */
export const deleteCalculation = async (req, res) => {
  try {
    const calc = await Calculation.findById(req.params.id);
    if (!calc) {
      return res.status(404).json({ success: false, message: "Calculation not found." });
    }

    if (calc.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    await Calculation.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Calculation record deleted." });
  } catch (error) {
    console.error("Error in deleteCalculation controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error deleting record." });
  }
};
