import express from "express";
import {
  queryRAGChat,
  getConversations,
  getMessagesByConversation,
  createConversation,
  updateConversation,
  deleteConversation,
  deleteMessage,
  submitFeedback,
  exportTextTranscript
} from "../controller/aiController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Allow optional/guest access to AI chat assistant, but require auth to view/delete stored histories
router.post("/chat", (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, next);
  }
  next();
}, queryRAGChat);

// All session and history metadata requires authentication
router.use(authMiddleware);

router.get("/conversations", getConversations);
router.post("/conversations", createConversation);
router.put("/conversations/:id", updateConversation);
router.delete("/conversations/:id", deleteConversation);
router.get("/conversations/:conversationId/messages", getMessagesByConversation);

router.delete("/history/:messageId", deleteMessage);
router.post("/history/:messageId/feedback", submitFeedback);
router.get("/conversations/:conversationId/export/text", exportTextTranscript);

export default router;
