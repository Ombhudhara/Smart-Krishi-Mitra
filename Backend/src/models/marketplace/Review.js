import mongoose from "mongoose";

/**
 * Review – Product reviews submitted by buyers after an order.
 */
const ReviewSchema = new mongoose.Schema(
  {
    product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    order:    { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    rating:   { type: Number, required: true, min: 1, max: 5 },
    title:    { type: String, trim: true, maxlength: 100, default: "" },
    body:     { type: String, trim: true, maxlength: 1000, default: "" },
    images:   { type: [String], default: [] },
    isVerifiedPurchase: { type: Boolean, default: true },
    helpfulCount: { type: Number, default: 0, min: 0 },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// One review per product per order
ReviewSchema.index({ product: 1, reviewer: 1, order: 1 }, { unique: true });

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
