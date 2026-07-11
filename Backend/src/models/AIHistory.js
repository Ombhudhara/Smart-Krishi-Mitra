import mongoose from "mongoose";

const AIHistorySchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIConversation",
      required: [true, "Conversation ID reference is required."],
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required."],
      index: true
    },
    language: {
      type: String,
      default: "en",
      index: true
    },
    prompt: {
      type: String,
      required: [true, "Prompt text is required."]
    },
    response: {
      type: String,
      required: [true, "Response text is required."]
    },
    retrievedDocuments: {
      type: [
        {
          title: String,
          category: String,
          content: String
        }
      ],
      default: []
    },
    embeddingIds: {
      type: [String],
      default: []
    },
    modelUsed: {
      type: String,
      default: "gemini-2.5-flash"
    },
    imageUrl: {
      type: String,
      default: ""
    },
    apiCallsUsed: {
      type: [String],
      default: []
    },
    weatherSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    marketSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    location: {
      type: String,
      default: ""
    },
    confidenceScore: {
      type: Number,
      default: 100
    },
    sources: {
      type: [String],
      default: []
    },
    tokens: {
      type: Number,
      default: 0
    },
    responseTime: {
      type: Number,
      default: 0
    },
    feedback: {
      type: String,
      default: ""
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  {
    timestamps: true
  }
);

// Indexes
AIHistorySchema.index({ prompt: "text", response: "text" });

const AIHistory = mongoose.models.AIHistory || mongoose.model("AIHistory", AIHistorySchema);
export default AIHistory;
