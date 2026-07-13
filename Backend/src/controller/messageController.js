import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { emitToUser } from "../socket/index.js";
import { uploadSingle } from "../middleware/uploadMiddleware.js";
import uploadService from "../services/uploadService.js";

/**
 * Helper to strip private information from a user object based on their privacy settings.
 */
const getSafeUser = (user) => {
  if (!user) return null;
  
  // Create a plain object if it's a mongoose document
  const safeUser = user.toObject ? user.toObject() : { ...user };
  
  const privacy = safeUser.privacySettings || { showPhoneNumber: true, showEmail: true, allowMessages: true };
  
  if (!privacy.showPhoneNumber) {
    delete safeUser.phone;
  }
  if (!privacy.showEmail) {
    delete safeUser.email;
  }
  
  return safeUser;
};

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

    // Strip private info from participants
    const safeConversations = conversations.map(conv => {
      const convObj = conv.toObject();
      convObj.participants = convObj.participants.map(getSafeUser);
      return convObj;
    });

    return res.status(200).json({ success: true, conversations: safeConversations });
  } catch (error) {
    console.error("Error in getConversations controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error fetching conversations." });
  }
};

/**
 * Get contacts based on role visibility rules.
 * GET /api/chat/contacts
 */
export const getContacts = async (req, res) => {
  try {
    const userRole = req.user.role;
    let targetRoles = [];

    if (userRole === "Farmer") {
      targetRoles = ["Vendor", "Customer"];
    } else if (userRole === "Vendor") {
      targetRoles = ["Farmer", "Customer"];
    } else if (userRole === "Customer") {
      targetRoles = ["Farmer", "Vendor"];
    } else if (userRole === "Admin") {
      targetRoles = ["Farmer", "Vendor", "Customer"];
    }

    const users = await User.find({ role: { $in: targetRoles } })
      .select("fullName email phone profileImage role privacySettings");

    const safeContacts = users.map(getSafeUser);

    return res.status(200).json({ success: true, contacts: safeContacts });
  } catch (error) {
    console.error("Error in getContacts controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error fetching contacts." });
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
      "fullName email phone profileImage role privacySettings"
    );

    const safeConv = populatedConv.toObject();
    safeConv.participants = safeConv.participants.map(getSafeUser);

    return res.status(200).json({ success: true, conversation: safeConv });
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
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: "Image upload failed", error: err.message });
    }

    try {
      const { conversationId, recipientId, text } = req.body;
      const file = req.file;

      if (!text?.trim() && !file) {
        return res.status(400).json({ success: false, message: "Message content or image cannot be empty." });
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
      const receiverIdToFind = conv.participants.find(p => p.toString() !== req.user._id.toString());
      
      // Check if receiver allows messages
      const receiverUser = await User.findById(receiverIdToFind);
      if (!receiverUser) {
        return res.status(404).json({ success: false, message: "Receiver not found." });
      }
      
      const receiverPrivacy = receiverUser.privacySettings || {};
      if (receiverPrivacy.allowMessages === false) {
        return res.status(403).json({ success: false, message: "This user is not accepting messages." });
      }

      let imageUrl = null;
      let messageType = "Text";

      if (file) {
        const uploadRes = await uploadService.uploadChatImage(file);
        if (!uploadRes.success) {
          return res.status(500).json({ success: false, message: uploadRes.message || "Failed to upload image." });
        }
        imageUrl = uploadRes.data.secureUrl;
        messageType = "Image";
      }

      // Create the message
      const message = await Message.create({
        conversation: activeConvId,
        sender: req.user._id,
        receiver: receiverIdToFind,
        text: text || "",
        imageUrl,
        messageType
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

      // Emit live message event to the receiver
      if (receiverIdToFind) {
        emitToUser(receiverIdToFind.toString(), "messageReceived", populatedMsg);
      }

      return res.status(201).json({ success: true, message: populatedMsg });
    } catch (error) {
      console.error("Error in sendMessage controller:", error.message || error);
      return res.status(500).json({ success: false, message: "Server error sending message." });
    }
  });
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

/**
 * Delete a message.
 * DELETE /api/chat/messages/:messageId
 */
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }

    // Only sender can delete
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this message." });
    }

    message.deleted = true;
    message.text = "This message was deleted";
    await message.save();

    // Emit event to receiver
    if (message.receiver) {
      emitToUser(message.receiver.toString(), "messageDeleted", { messageId, conversationId: message.conversation });
    }

    return res.status(200).json({ success: true, message: "Message deleted successfully." });
  } catch (error) {
    console.error("Error in deleteMessage controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error deleting message." });
  }
};
