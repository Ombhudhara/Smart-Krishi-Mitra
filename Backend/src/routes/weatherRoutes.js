import express from "express";
import {
  getCurrentWeather,
  getHourlyForecast,
  getWeeklyForecast,
  getAirQuality,
} from "../controller/weatherController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Weather can be checked with optional authorization to store history
router.get("/", authMiddleware, getCurrentWeather);
router.get("/hourly", authMiddleware, getHourlyForecast);
router.get("/weekly", authMiddleware, getWeeklyForecast);
router.get("/aqi", authMiddleware, getAirQuality);

export default router;
