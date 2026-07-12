import Scheme from "../models/Scheme.js";
import Notification from "../models/Notification.js";
import { getAllSchemes } from "../services/governmentSchemeService.js";

/**
 * Get government welfare schemes.
 * GET /api/schemes
 */
export const getGovSchemes = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    // Fetch from OGD / real-time / local fallback service
    const result = await getAllSchemes();
    let schemes = result.data || [];

    if (category && category !== "All" && category !== "all") {
      schemes = schemes.filter(s => s.category?.toLowerCase() === category.toLowerCase() || s.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      schemes = schemes.filter(s => 
        (s.title || s.name || "").toLowerCase().includes(q) || 
        (s.description || "").toLowerCase().includes(q)
      );
    }

    return res.status(200).json({ success: true, schemes });
  } catch (error) {
    console.error("Error in getGovSchemes controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error retrieving government schemes." });
  }
};

/**
 * Get scheme by ID.
 * GET /api/schemes/:id
 */
export const getSchemeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getAllSchemes();
    const schemes = result.data || [];
    const scheme = schemes.find(s => s.id === id || s._id?.toString() === id);

    if (!scheme) {
      return res.status(404).json({ success: false, message: "Scheme not found." });
    }
    return res.status(200).json({ success: true, scheme });
  } catch (error) {
    console.error("Error in getSchemeById controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error retrieving scheme details." });
  }
};

/**
 * Check scheme eligibility dynamically based on farmer inputs.
 * POST /api/schemes/check-eligibility
 */
export const checkEligibility = async (req, res) => {
  try {
    const { age, landholding, income, state } = req.body;

    // Simple rule-based calculation engine
    let eligible = true;
    let message = "Based on your criteria, you are eligible for the Prime Minister Kisan Scheme and State subsidy plans!";

    if (parseFloat(landholding) > 5) {
      eligible = false;
      message = "Your landholding is above the 5 acres margin limit for small/marginal farmer schemes. However, you can apply for infrastructure loans.";
    } else if (parseFloat(income) > 300000) {
      eligible = false;
      message = "Your annual income exceeds the maximum threshold limit for subsidy-specific benefits.";
    }

    return res.status(200).json({
      success: true,
      eligible,
      message,
    });
  } catch (error) {
    console.error("Error in checkEligibility controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error evaluating eligibility criteria." });
  }
};

/**
 * Apply for a scheme.
 * POST /api/schemes/:schemeId/apply
 */
export const applyForScheme = async (req, res) => {
  try {
    const { schemeId } = req.params;
    const result = await getAllSchemes();
    const schemes = result.data || [];
    const scheme = schemes.find(s => s.id === schemeId || s._id?.toString() === schemeId);

    if (!scheme) {
      return res.status(404).json({ success: false, message: "Scheme not found." });
    }

    // Create a notification for application receipt
    await Notification.create({
      recipient: req.user._id,
      title: "Scheme Application Received",
      message: `Your application for "${scheme.title || scheme.name}" has been successfully logged. Status: In Review. Reference ID: SKM-${Math.floor(100000 + Math.random() * 900000)}.`,
      type: "scheme",
    });

    return res.status(200).json({
      success: true,
      message: "Application submitted successfully! Check notifications for updates.",
    });
  } catch (error) {
    console.error("Error in applyForScheme controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error processing application." });
  }
};
