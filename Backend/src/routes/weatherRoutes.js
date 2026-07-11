import express from "express";
import {
  getCurrentWeather,
  getHourlyForecast,
  getWeeklyForecast,
  getAirQuality,
} from "../controller/weatherController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Weather routes use optional auth — works for all users,
// but logs history only when a user is logged in
router.get("/", optionalAuth, getCurrentWeather);
router.get("/hourly", optionalAuth, getHourlyForecast);
router.get("/weekly", optionalAuth, getWeeklyForecast);
router.get("/aqi", optionalAuth, getAirQuality);

export default router;
