import express from "express";
import { getSummary, getStats, getActivity } from "../controller/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // Protect all dashboard routes

router.get("/summary", getSummary);
router.get("/stats", getStats);
router.get("/activity", getActivity);

export default router;
