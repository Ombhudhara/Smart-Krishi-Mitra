import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  changeLanguage,
  updateNotificationSettings,
  updateProfileImage,
  deleteProfileImage,
  updateCoverImage,
  deleteCoverImage,
  getProfileImages,
  getPublicProfile,
  getAccountInfo,
} from "../controller/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route to view another user's profile
router.get("/public/:userId", getPublicProfile);

router.use(authMiddleware); // Protect all profile routes below

router.get("/", getProfile);
router.put("/", updateProfile);
router.put("/password", changePassword);
router.put("/language", changeLanguage);
router.put("/notifications", updateNotificationSettings);
router.put("/image", updateProfileImage);
router.delete("/image", deleteProfileImage);
router.put("/cover", updateCoverImage);
router.delete("/cover", deleteCoverImage);
router.get("/images", getProfileImages);
router.get("/account", getAccountInfo);

export default router;
