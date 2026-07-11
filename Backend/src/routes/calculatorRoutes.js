import express from "express";
import {
  getCalculations,
  saveCalculation,
  deleteCalculation,
} from "../controller/calculatorController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // Protect all cost calculator routes

router.get("/history", getCalculations);
router.post("/save", saveCalculation);
router.delete("/:id", deleteCalculation);

export default router;
