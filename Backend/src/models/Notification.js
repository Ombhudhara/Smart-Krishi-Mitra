import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    category: {
      type: String,
      required: [true, "Notification category is required"],
      enum: {
        values: [
          "Weather Alerts",
          "Marketplace Updates",
          "Government Schemes",
          "AI Recommendations",
          "Messages",
          "Transactions",
          "System",
        ],
        message: "{VALUE} is not a valid category",
      },
      default: "System",
      index: true,
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
      maxlength: [150, "Notification title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Notification description is required"],
      trim: true,
      maxlength: [500, "Notification description cannot exceed 500 characters"],
    },
    priority: {
      type: String,
      enum: {
        values: ["Critical", "High", "Normal", "Information"],
        message: "{VALUE} is not a valid priority",
      },
      default: "Normal",
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    isSeen: {
      type: Boolean,
      default: false,
      index: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    entityType: {
      type: String,
      default: "",
      trim: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    icon: {
      type: String,
      default: "",
      trim: true,
    },
    deleted: {
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
NotificationSchema.index({ user: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
