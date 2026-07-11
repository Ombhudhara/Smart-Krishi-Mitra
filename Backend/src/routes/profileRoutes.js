import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  changeLanguage,
  updateNotificationSettings,
  updateProfileImage,
  deleteProfileImage,
  getAccountInfo,
} from "../controller/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // Protect all profile routes

router.get("/", getProfile);
router.put("/", updateProfile);
router.put("/password", changePassword);
router.put("/language", changeLanguage);
router.put("/notifications", updateNotificationSettings);
router.put("/image", updateProfileImage);
router.delete("/image", deleteProfileImage);
router.get("/account", getAccountInfo);

export default router;
