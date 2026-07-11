import express from "express";
import {
  getListings,
  getListingById,
  searchListings,
  contactSeller,
  getMyListings,
  createListing,
  updateListing,
  deleteListing,
  toggleListingStatus,
} from "../controller/marketplaceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes for marketplace viewing
router.get("/", getListings);
router.get("/search", searchListings);
router.get("/:id", getListingById);

// Protected routes (require authorization)
router.post("/:id/contact", authMiddleware, contactSeller);
router.get("/mine", authMiddleware, getMyListings); // support mylistingService getMyListings
router.get("/my/all", authMiddleware, getMyListings); 
router.post("/", authMiddleware, createListing);
router.put("/:id", authMiddleware, updateListing);
router.put("/:id/status", authMiddleware, toggleListingStatus); // toggle listing status
router.delete("/:id", authMiddleware, deleteListing);

export default router;
