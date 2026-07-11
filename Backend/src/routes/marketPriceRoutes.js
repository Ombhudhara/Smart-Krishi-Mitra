import express from "express";
import {
  getMarketPrices,
  getMarketPriceByCropName,
  getMarketPricesByState,
  getMarketPricesByDistrict,
  getMarketPricesByCategory,
  searchMarketPrices,
  getTrending,
  getDashboard,
  createPriceListing,
  updatePriceListing,
  deletePriceListing,
} from "../controller/marketPriceController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// ── PUBLIC / SHARED ENDPOINTS ──────────────────────────────────────────────────
// Note: Register static endpoints BEFORE parameterized dynamic routes to avoid Express collisions.
router.get("/", getMarketPrices);
router.get("/search", searchMarketPrices);
router.get("/trending", getTrending);
router.get("/dashboard", getDashboard);

router.get("/state/:state", getMarketPricesByState);
router.get("/district/:district", getMarketPricesByDistrict);
router.get("/category/:category", getMarketPricesByCategory);
router.get("/:crop", getMarketPriceByCropName);

// ── PROTECTED ADMIN MUTATION ENDPOINTS ──────────────────────────────────────────
router.post("/", authMiddleware, allowRoles("Admin"), createPriceListing);
router.put("/:id", authMiddleware, allowRoles("Admin"), updatePriceListing);
router.delete("/:id", authMiddleware, allowRoles("Admin"), deletePriceListing);

export default router;
