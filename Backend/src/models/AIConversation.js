import mongoose from "mongoose";

const AIConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required for AI conversations."],
      index: true
    },
    title: {
      type: String,
      default: "New Conversation",
      trim: true
    },
    isFavorite: {
      type: Boolean,
      default: false,
      index: true
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true
    },
    lastActive: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Index to quickly load user conversations sorted by active date
AIConversationSchema.index({ user: 1, lastActive: -1 });

const AIConversation = mongoose.models.AIConversation || mongoose.model("AIConversation", AIConversationSchema);
export default AIConversation;
