import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: [true, "Participant user reference is required"],
        },
      ],
      validate: [
        (val) => val.length >= 2,
        "A conversation must have at least 2 participants",
      ],
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
    lastSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    unreadCount: {
      type: Number,
      default: 0,
      min: [0, "Unread count cannot be negative"],
    },
    conversationStatus: {
      type: String,
      enum: {
        values: ["Active", "Archived", "Deleted", "Paused"],
        message: "{VALUE} is not a valid conversation status",
      },
      default: "Active",
      index: true,
    },
    archived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ participants: 1, updatedAt: -1 });

const Conversation = mongoose.model("Conversation", ConversationSchema);
export default Conversation;
