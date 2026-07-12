import mongoose from "mongoose";

/**
 * CustomerProfile
 * Purpose: Extended profile for Customer users (buyers of agricultural produce).
 */
const CustomerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    // Personal preferences (embedded – tightly coupled, small)
    preferences: {
      preferOrganic:    { type: Boolean, default: false },
      preferLocal:      { type: Boolean, default: true },
      maxDeliveryRange: { type: Number, default: 50 }, // km
      preferredPayment: {
        type: String,
        enum: ["UPI", "Card", "NetBanking", "COD", "Wallet", ""],
        default: "",
      },
      cropInterests:    { type: [String], default: [] },
    },
    // Delivery addresses (array of embedded docs – bounded, user-owned)
    addresses: [
      {
        label:     { type: String, default: "Home" }, // Home, Office, Farm, etc.
        line1:     { type: String, required: true },
        line2:     { type: String, default: "" },
        city:      { type: String, required: true },
        district:  { type: String, default: "" },
        state:     { type: String, required: true },
        pincode:   { type: String, required: true },
        isDefault: { type: Boolean, default: false },
        location: {
          type: { type: String, enum: ["Point"], default: "Point" },
          coordinates: { type: [Number], default: [0, 0] },
        },
      },
    ],
    // Stats
    totalOrders:      { type: Number, default: 0, min: 0 },
    totalSpent:       { type: Number, default: 0, min: 0 },
    totalReviews:     { type: Number, default: 0, min: 0 },
    loyaltyPoints:    { type: Number, default: 0, min: 0 },
    bio:              { type: String, maxlength: 500, default: "" },
    isProfileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CustomerProfile = mongoose.model("CustomerProfile", CustomerProfileSchema);
export default CustomerProfile;
