import mongoose from "mongoose";

const CalculationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    cropName: {
      type: String,
      required: [true, "Crop name is required"],
      trim: true,
      index: true,
    },
    landArea: {
      type: Number,
      required: [true, "Land area is required"],
      min: [0, "Land area cannot be negative"],
    },
    seedCost: {
      type: Number,
      default: 0,
      min: [0, "Seed cost cannot be negative"],
    },
    fertilizerCost: {
      type: Number,
      default: 0,
      min: [0, "Fertilizer cost cannot be negative"],
    },
    labourCost: {
      type: Number,
      default: 0,
      min: [0, "Labour cost cannot be negative"],
    },
    machineryCost: {
      type: Number,
      default: 0,
      min: [0, "Machinery cost cannot be negative"],
    },
    irrigationCost: {
      type: Number,
      default: 0,
      min: [0, "Irrigation cost cannot be negative"],
    },
    otherCost: {
      type: Number,
      default: 0,
      min: [0, "Other cost cannot be negative"],
    },
    totalCost: {
      type: Number,
      required: [true, "Total cost is required"],
      min: [0, "Total cost cannot be negative"],
    },
    expectedYield: {
      type: Number,
      default: 0,
      min: [0, "Expected yield cannot be negative"],
    },
    expectedRevenue: {
      type: Number,
      default: 0,
      min: [0, "Expected revenue cannot be negative"],
    },
    expectedProfit: {
      type: Number,
      default: 0,
    },
    season: {
      type: String,
      default: "",
      trim: true,
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    cropVariety: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CalculationSchema.index({ user: 1, createdAt: -1 });

const Calculation = mongoose.model("Calculation", CalculationSchema);
export default Calculation;
