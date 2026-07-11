import express from "express";
import {
  getConversations,
  startConversation,
  getMessages,
  sendMessage,
  markConversationRead,
} from "../controller/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // Protect all chat routes

router.get("/conversations", getConversations);
router.post("/conversations", startConversation);
router.put("/conversations/:conversationId/read", markConversationRead);

router.get("/messages/:conversationId", getMessages);
router.post("/messages", sendMessage);

export default router;
