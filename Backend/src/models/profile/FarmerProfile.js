import mongoose from "mongoose";

/**
 * FarmerProfile
 * Purpose: Stores extended agricultural profile data for users with role="Farmer".
 * Separated from User to keep auth model lean and allow farmer-specific indexing.
 */
const FarmerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One profile per farmer
      index: true,
    },
    // Farm Details
    farmName:    { type: String, trim: true, maxlength: 100, default: "" },
    farmSize:    { type: String, trim: true, default: "" }, // e.g. "5 acres"
    farmSizeUnit:{
      type: String,
      enum: ["Acres", "Hectares", "Bigha", "Guntha", ""],
      default: "",
    },
    soilType:    {
      type: String,
      enum: ["Clay", "Sandy", "Loamy", "Silt", "Peat", "Chalky", "Mixed", ""],
      default: "",
    },
    cropsGrown:  { type: [String], default: [] },
    irrigationType: {
      type: String,
      enum: ["Drip", "Sprinkler", "Flood", "Rainfed", "Canal", "Borewell", ""],
      default: "",
    },
    farmingType: {
      type: String,
      enum: ["Organic", "Conventional", "Mixed", ""],
      default: "",
    },
    // Location (separate from User for geo-indexing)
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    village:  { type: String, trim: true, default: "" },
    taluka:   { type: String, trim: true, default: "" },
    district: { type: String, trim: true, default: "" },
    state:    { type: String, trim: true, default: "" },
    pincode:  { type: String, trim: true, default: "" },
    // Certifications (embedded – small static list)
    certifications: [
      {
        name:       { type: String, required: true },
        issuedBy:   { type: String, default: "" },
        issuedOn:   { type: Date, default: null },
        expiresOn:  { type: Date, default: null },
        documentUrl:{ type: String, default: "" },
      },
    ],
    // KYC
    aadhaarVerified: { type: Boolean, default: false },
    bankAccountLinked: { type: Boolean, default: false },
    // Stats (denormalized for read performance)
    totalListings:      { type: Number, default: 0, min: 0 },
    totalSales:         { type: Number, default: 0, min: 0 },
    totalRevenue:       { type: Number, default: 0, min: 0 },
    averageRating:      { type: Number, default: 0, min: 0, max: 5 },
    totalReviews:       { type: Number, default: 0, min: 0 },
    preferredLanguage:  { type: String, default: "Hindi" },
    bio:                { type: String, maxlength: 500, default: "" },
    isProfileComplete:  { type: Boolean, default: false },
  },
  { timestamps: true }
);

FarmerProfileSchema.index({ location: "2dsphere" });
FarmerProfileSchema.index({ state: 1, district: 1 });

const FarmerProfile = mongoose.model("FarmerProfile", FarmerProfileSchema);
export default FarmerProfile;
