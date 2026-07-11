import express from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controller/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // Protect all notification routes

router.get("/", getNotifications);
router.put("/read-all", markAllAsRead); // placed above :id to prevent mapping conflict
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
