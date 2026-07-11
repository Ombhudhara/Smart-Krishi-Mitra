import express from "express";
import {
  getGovSchemes,
  getSchemeById,
  checkEligibility,
  applyForScheme,
} from "../controller/governmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public scheme list endpoints
router.get("/", getGovSchemes);
router.post("/check-eligibility", checkEligibility);
router.get("/:id", getSchemeById);

// Protected scheme application
router.post("/:schemeId/apply", authMiddleware, applyForScheme);

export default router;
