import mongoose from "mongoose";

/**
 * Product (replaces Listing.js)
 * Purpose: Agricultural produce and agro-input product listings in the marketplace.
 */
const ProductSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    // Core fields
    title:       { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    images:      { type: [String], default: [] },
    // Pricing
    price:         { type: Number, required: true, min: 0 },
    pricePerUnit:  { type: Number, default: 0, min: 0 },
    unit:          { type: String, required: true, default: "kg" },
    minimumOrder:  { type: Number, default: 1, min: 0 },
    maximumOrder:  { type: Number, default: null },
    discount:      { type: Number, default: 0, min: 0, max: 100 }, // % discount
    // Inventory
    stock:    { type: Number, required: true, default: 0, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    // Agriculture-specific
    cropName:    { type: String, trim: true, default: "" },
    isOrganic:   { type: Boolean, default: false },
    harvestDate: { type: Date, default: null },
    expiryDate:  { type: Date, default: null },
    grade:       {
      type: String,
      enum: ["A", "B", "C", "Premium", "Standard", ""],
      default: "",
    },
    // Extra attributes (embedded – flexible key-value)
    attributes: [
      {
        key:   { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    // Location
    location:           { type: String, trim: true, default: "" },
    state:              { type: String, trim: true, default: "", index: true },
    district:           { type: String, trim: true, default: "" },
    deliveryAvailable:  { type: Boolean, default: false },
    pickupAvailable:    { type: Boolean, default: true },
    deliveryRadius:     { type: Number, default: 0 }, // km
    geoLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    // Status
    status: {
      type: String,
      enum: ["Active", "Sold Out", "Inactive", "Pending", "Rejected"],
      default: "Active",
      index: true,
    },
    // Aggregated stats (updated via hooks)
    views:        { type: Number, default: 0, min: 0 },
    wishlistCount:{ type: Number, default: 0, min: 0 },
    averageRating:{ type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0, min: 0 },
    totalSold:    { type: Number, default: 0, min: 0 },
    // Meta
    isFeatured:   { type: Boolean, default: false },
    tags:         { type: [String], default: [] },
  },
  { timestamps: true }
);

ProductSchema.index({ geoLocation: "2dsphere" });
ProductSchema.index({ title: "text", description: "text", cropName: "text", tags: "text" });
ProductSchema.index({ seller: 1, status: 1 });
ProductSchema.index({ category: 1, status: 1, state: 1 });
ProductSchema.index({ isOrganic: 1, status: 1 });

const Product = mongoose.model("Product", ProductSchema);
export default Product;
