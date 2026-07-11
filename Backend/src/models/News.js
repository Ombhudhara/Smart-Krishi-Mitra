import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "News title is required"],
      trim: true,
      maxlength: [200, "News title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "News content is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
      index: true,
    },
    source: {
      type: String,
      default: "Smart Krishi",
      trim: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    state: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    district: {
      type: String,
      default: "",
      trim: true,
      index: true,
    },
    language: {
      type: String,
      default: "English",
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const News = mongoose.model("News", NewsSchema);
export default News;
