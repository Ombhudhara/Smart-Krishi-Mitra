import aiService from "../services/aiService.js";
import AIConversation from "../models/AIConversation.js";
import AIHistory from "../models/AIHistory.js";
import mongoose from "mongoose";

/**
 * 1. Post query message to the RAG LLM engine.
 */
export const queryRAGChat = async (req, res) => {
  try {
    const { message, language, image, mimeType, conversationId } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!message && !image) {
      return res.status(400).json({
        success: false,
        message: "Message query or image upload is required."
      });
    }

    // Handle multimodal image diagnostic upload
    if (image) {
      console.log(`[AI Controller] Image diagnostic upload received. Analyzing...`);
      const defaultPrompt = "Analyze this crop leaf image. Identify any visible plant diseases, describe the symptoms, recommend organic/chemical controls, and estimate recovery time.";
      
      const analysisResult = await aiService.analyzeImage(
        image, 
        mimeType || "image/jpeg", 
        message || defaultPrompt
      );

      // Translate response if requested
      let finalResponse = analysisResult;
      if (language && language !== "English") {
        finalResponse = await aiService.translateText(analysisResult, language);
      }

      let resolvedConvId = conversationId;
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        if (!resolvedConvId || !mongoose.Types.ObjectId.isValid(resolvedConvId)) {
          const newConv = await AIConversation.create({
            user: userId,
            title: "Leaf Diagnostic Image"
          });
          resolvedConvId = newConv._id;
        } else {
          await AIConversation.findByIdAndUpdate(resolvedConvId, { lastActive: new Date() });
        }

        // Log visual diagnostics in chat history database
        await AIHistory.create({
          conversationId: resolvedConvId,
          user: userId,
          language: language || "English",
          prompt: message || "Leaf image analysis requested",
          response: finalResponse,
          modelUsed: "gemini-2.5-flash",
          confidenceScore: 90,
          sources: ["Gemini Multi-modal Vision API"],
          imageUrl: "Uploaded base64 content"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Image analysis generated successfully",
        data: {
          conversationId: resolvedConvId,
          answer: finalResponse,
          originalAnswer: analysisResult,
          confidenceScore: 90,
          sources: ["Gemini Vision API"]
        }
      });
    }

    // Normal RAG and API tool orchestrator
    const result = await aiService.queryRAG(message.trim(), language || "English", userId, conversationId);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error) {
    console.error("[AI Controller] queryRAGChat failed:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Unable to process agricultural query at this time."
    });
  }
};

/**
 * 2. Retrieve all conversations for the user.
 */
export const getConversations = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authorization required." });
    }

    // Load user conversations, sorted by pinned first, then last active date
    const conversations = await AIConversation.find({ user: userId })
      .sort({ isPinned: -1, lastActive: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "AI chat sessions loaded successfully",
      data: conversations
    });
  } catch (error) {
    console.error("[AI Controller] getConversations failed:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to load chat conversations."
    });
  }
};

/**
 * 3. Retrieve all messages for a specific conversation session.
 */
export const getMessagesByConversation = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { conversationId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authorization required." });
    }
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ success: false, message: "Invalid Conversation ID." });
    }

    const messages = await AIHistory.find({ conversationId, user: userId })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Conversation messages loaded successfully",
      data: messages
    });
  } catch (error) {
    console.error("[AI Controller] getMessagesByConversation failed:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to load messages."
    });
  }
};

/**
 * 4. Create a new conversation session explicitly.
 */
export const createConversation = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { title } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authorization required." });
    }

    const conversation = await AIConversation.create({
      user: userId,
      title: title || "New Conversation"
    });

    return res.status(201).json({
      success: true,
      message: "New chat session created successfully",
      data: conversation
    });
  } catch (error) {
    console.error("[AI Controller] createConversation failed:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to create conversation."
    });
  }
};

/**
 * 5. Update conversation metadata (Rename, Favorite, Pinned).
 */
export const updateConversation = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { id } = req.params;
    const { title, isFavorite, isPinned } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authorization required." });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid session ID." });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (isFavorite !== undefined) updates.isFavorite = isFavorite;
    if (isPinned !== undefined) updates.isPinned = isPinned;

    const conversation = await AIConversation.findOneAndUpdate(
      { _id: id, user: userId },
      updates,
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found or unauthorized." });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation updated successfully",
      data: conversation
    });
  } catch (error) {
    console.error("[AI Controller] updateConversation failed:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to update conversation."
    });
  }
};

/**
 * 6. Delete a conversation session along with all associated history logs.
 */
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authorization required." });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid session ID." });
    }

    const result = await AIConversation.findOneAndDelete({ _id: id, user: userId });
    if (!result) {
      return res.status(404).json({ success: false, message: "Conversation not found." });
    }

    // Clean up history messages
    await AIHistory.deleteMany({ conversationId: id, user: userId });

    return res.status(200).json({
      success: true,
      message: "Conversation and associated logs deleted successfully"
    });
  } catch (error) {
    console.error("[AI Controller] deleteConversation failed:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete conversation."
    });
  }
};

/**
 * 7. Delete a single chat log message.
 */
export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { messageId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authorization required." });
    }
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ success: false, message: "Invalid message ID." });
    }

    const message = await AIHistory.findOneAndDelete({ _id: messageId, user: userId });
    if (!message) {
      return res.status(404).json({ success: false, message: "Message log not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully"
    });
  } catch (error) {
    console.error("[AI Controller] deleteMessage failed:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete message."
    });
  }
};

/**
 * 8. Submit feedback rating for a generated response.
 */
export const submitFeedback = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { messageId } = req.params;
    const { rating, feedback } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authorization required." });
    }
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ success: false, message: "Invalid message ID." });
    }

    const message = await AIHistory.findOneAndUpdate(
      { _id: messageId, user: userId },
      { rating, feedback },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, message: "Message log not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback submitted successfully",
      data: message
    });
  } catch (error) {
    console.error("[AI Controller] submitFeedback failed:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit feedback."
    });
  }
};

/**
 * 9. Export conversation as plain text transcript.
 */
export const exportTextTranscript = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { conversationId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authorization required." });
    }

    const conversation = await AIConversation.findOne({ _id: conversationId, user: userId });
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found." });
    }

    const logs = await AIHistory.find({ conversationId, user: userId }).sort({ createdAt: 1 });
    
    let text = `==================================================\n`;
    text += `   Smart Krishi Mitra - AI Chat Transcript\n`;
    text += `   Session: ${conversation.title}\n`;
    text += `   Date Exported: ${new Date().toLocaleDateString()}\n`;
    text += `==================================================\n\n`;

    logs.forEach((log, index) => {
      text += `[${index + 1}] Farmer Query (${log.language}):\n${log.prompt}\n\n`;
      text += `Krishi AI Advisor Response:\n${log.response}\n`;
      text += `[Confidence Score: ${log.confidenceScore}%, Sources: ${log.sources.join(", ")}]\n`;
      text += `--------------------------------------------------\n\n`;
    });

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", `attachment; filename="chat_transcript_${conversationId}.txt"`);
    return res.status(200).send(text);
  } catch (error) {
    console.error("[AI Controller] exportTextTranscript failed:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "Failed to export chat transcript."
    });
  }
};

export default {
  queryRAGChat,
  getConversations,
  getMessagesByConversation,
  createConversation,
  updateConversation,
  deleteConversation,
  deleteMessage,
  submitFeedback,
  exportTextTranscript
};
