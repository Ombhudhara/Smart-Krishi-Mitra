import mongoose from "mongoose";

/**
 * VendorProfile
 * Purpose: Extended profile for Vendor users (agro-input dealers, equipment suppliers).
 */
const VendorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    businessName:    { type: String, trim: true, maxlength: 150, default: "" },
    businessType:    {
      type: String,
      enum: ["Retailer", "Wholesaler", "Distributor", "Manufacturer", "Exporter", "Other", ""],
      default: "",
    },
    gstNumber:       { type: String, trim: true, default: "" },
    panNumber:       { type: String, trim: true, default: "" },
    licenseNumber:   { type: String, trim: true, default: "" },
    establishedYear: { type: Number, default: null },
    website:         { type: String, trim: true, default: "" },
    logo:            { type: String, default: "" },
    bannerImage:     { type: String, default: "" },
    // Location
    address:   { type: String, trim: true, maxlength: 300, default: "" },
    city:      { type: String, trim: true, default: "" },
    district:  { type: String, trim: true, default: "" },
    state:     { type: String, trim: true, default: "" },
    pincode:   { type: String, trim: true, default: "" },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    // Products & Categories offered
    productCategories: { type: [String], default: [] },
    // Business Hours (embedded – tightly coupled)
    businessHours: {
      monday:    { open: String, close: String },
      tuesday:   { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday:  { open: String, close: String },
      friday:    { open: String, close: String },
      saturday:  { open: String, close: String },
      sunday:    { open: String, close: String },
    },
    // Verification
    isGstVerified:       { type: Boolean, default: false },
    isLicenseVerified:   { type: Boolean, default: false },
    verificationStatus:  {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },
    // Stats
    totalProducts:    { type: Number, default: 0, min: 0 },
    totalOrders:      { type: Number, default: 0, min: 0 },
    totalRevenue:     { type: Number, default: 0, min: 0 },
    averageRating:    { type: Number, default: 0, min: 0, max: 5 },
    totalReviews:     { type: Number, default: 0, min: 0 },
    bio:              { type: String, maxlength: 500, default: "" },
    isProfileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

VendorProfileSchema.index({ location: "2dsphere" });
VendorProfileSchema.index({ state: 1, verificationStatus: 1 });

const VendorProfile = mongoose.model("VendorProfile", VendorProfileSchema);
export default VendorProfile;
