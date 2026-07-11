import express from "express";
import { toggleBookmark, getBookmarks } from "../controller/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // Protect all bookmark routes

router.post("/", toggleBookmark);
router.get("/", getBookmarks);

export default router;
