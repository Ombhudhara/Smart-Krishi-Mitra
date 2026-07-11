import mongoose from "mongoose";

const PriceHistorySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    minimumPrice: {
      type: Number,
      required: true,
      min: [0, "Minimum price cannot be negative"],
    },
    maximumPrice: {
      type: Number,
      required: true,
      min: [0, "Maximum price cannot be negative"],
    },
    averagePrice: {
      type: Number,
      required: true,
      min: [0, "Average price cannot be negative"],
    },
    availableQuantity: {
      type: Number,
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { _id: false }
);

const MarketPriceSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: [true, "Crop name is required"],
      trim: true,
      index: true,
    },
    cropCategory: {
      type: String,
      required: [true, "Crop category is required"],
      trim: true,
      index: true,
    },
    cropVariety: {
      type: String,
      required: [true, "Crop variety is required"],
      trim: true,
      default: "FAQ", // Fair Average Quality
    },
    season: {
      type: String,
      required: [true, "Crop season is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      index: true,
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
      index: true,
    },
    mandiName: {
      type: String,
      required: [true, "Mandi name is required"],
      trim: true,
      index: true,
    },
    minimumPrice: {
      type: Number,
      required: [true, "Minimum price is required"],
      min: [0, "Minimum price must be a positive number"],
    },
    maximumPrice: {
      type: Number,
      required: [true, "Maximum price is required"],
      min: [0, "Maximum price must be a positive number"],
      validate: {
        validator: function (val) {
          return val >= this.minimumPrice;
        },
        message: "Maximum price ({VALUE}) must be greater than or equal to minimum price",
      },
    },
    averagePrice: {
      type: Number,
      required: [true, "Average price is required"],
      min: [0, "Average price must be a positive number"],
      validate: {
        validator: function (val) {
          return val >= this.minimumPrice && val <= this.maximumPrice;
        },
        message: "Average price ({VALUE}) must be between minimum price and maximum price",
      },
    },
    priceUnit: {
      type: String,
      required: [true, "Price unit is required"],
      enum: {
        values: ["Kg", "Quintal", "Ton"],
        message: "{VALUE} is not a valid price unit. Allowed: Kg, Quintal, Ton",
      },
      default: "Quintal",
    },
    availableQuantity: {
      type: Number,
      required: [true, "Available quantity is required"],
      min: [0, "Available quantity cannot be negative"],
      default: 0,
    },
    demandLevel: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High"],
        message: "{VALUE} is not a valid demand level. Allowed: Low, Medium, High",
      },
      default: "Medium",
      index: true,
    },
    qualityGrade: {
      type: String,
      default: "FAQ",
      trim: true,
    },
    marketStatus: {
      type: String,
      enum: {
        values: ["Open", "Closed", "Suspended"],
        message: "{VALUE} is not a valid market status. Allowed: Open, Closed, Suspended",
      },
      default: "Open",
      index: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    remarks: {
      type: String,
      default: "",
      trim: true,
    },
    priceHistory: {
      type: [PriceHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate crops for the same market, variety, and crop
MarketPriceSchema.index(
  { cropName: 1, cropVariety: 1, state: 1, district: 1, mandiName: 1 },
  { unique: true }
);

// Pre-save hook to keep average price validated on updates
MarketPriceSchema.pre("save", function (next) {
  if (this.maximumPrice < this.minimumPrice) {
    return next(new Error("Maximum price cannot be less than minimum price."));
  }
  if (this.averagePrice < this.minimumPrice || this.averagePrice > this.maximumPrice) {
    return next(new Error("Average price must be between minimum price and maximum price."));
  }
  next();
});

const MarketPrice = mongoose.model("MarketPrice", MarketPriceSchema);
export default MarketPrice;
