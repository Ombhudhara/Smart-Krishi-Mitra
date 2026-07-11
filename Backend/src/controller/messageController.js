import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

/**
 * Get all conversations for current user.
 * GET /api/chat/conversations
 */
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "fullName email phone profileImage role")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "fullName" },
      })
      .sort({ updatedAt: -1 });

    return res.status(200).json({ success: true, conversations });
  } catch (error) {
    console.error("Error in getConversations controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error fetching conversations." });
  }
};

/**
 * Start or retrieve a conversation with a recipient.
 * POST /api/chat/conversations
 */
export const startConversation = async (req, res) => {
  try {
    const { recipientId } = req.body;
    if (!recipientId) {
      return res.status(400).json({ success: false, message: "Recipient ID is required." });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [req.user._id, recipientId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId],
      });
    }

    const populatedConv = await Conversation.findById(conversation._id).populate(
      "participants",
      "fullName email phone profileImage role"
    );

    return res.status(200).json({ success: true, conversation: populatedConv });
  } catch (error) {
    console.error("Error in startConversation controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error starting conversation." });
  }
};

/**
 * Get messages inside a conversation.
 * GET /api/chat/messages/:conversationId
 */
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "fullName profileImage")
      .sort({ createdAt: 1 });

    return res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error in getMessages controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error retrieving messages." });
  }
};

/**
 * Send a message inside a conversation.
 * POST /api/chat/messages
 */
export const sendMessage = async (req, res) => {
  try {
    const { conversationId, recipientId, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Message content cannot be empty." });
    }

    let activeConvId = conversationId;

    // If no conversationId is supplied, find or create one with the recipientId
    if (!activeConvId && recipientId) {
      let conversation = await Conversation.findOne({
        participants: { $all: [req.user._id, recipientId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [req.user._id, recipientId],
        });
      }
      activeConvId = conversation._id;
    }

    if (!activeConvId) {
      return res.status(400).json({ success: false, message: "Conversation ID or Recipient ID is required." });
    }

    const conv = await Conversation.findById(activeConvId);
    if (!conv) {
      return res.status(400).json({ success: false, message: "Conversation not found." });
    }
    const receiver = conv.participants.find(p => p.toString() !== req.user._id.toString());

    // Create the message
    const message = await Message.create({
      conversation: activeConvId,
      sender: req.user._id,
      receiver,
      text,
    });

    // Update conversation's last message, lastSender, and lastMessageTime
    await Conversation.findByIdAndUpdate(activeConvId, {
      $set: {
        lastMessage: message._id,
        lastSender: req.user._id,
        lastMessageTime: new Date()
      },
    });

    const populatedMsg = await Message.findById(message._id).populate("sender", "fullName profileImage");

    return res.status(201).json({ success: true, message: populatedMsg });
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error sending message." });
  }
};

/**
 * Mark a conversation's messages as read.
 * PUT /api/chat/conversations/:conversationId/read
 */
export const markConversationRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Mark messages sent by the other participant as read
    await Message.updateMany(
      { conversation: conversationId, sender: { $ne: req.user._id }, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({ success: true, message: "Conversation marked as read." });
  } catch (error) {
    console.error("Error in markConversationRead controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error marking conversation as read." });
  }
};
