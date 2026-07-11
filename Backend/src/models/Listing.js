import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller reference is required"],
      index: true,
    },
    cropName: {
      type: String,
      required: [true, "Crop name is required"],
      trim: true,
      minlength: [2, "Crop name must be at least 2 characters long"],
      maxlength: [100, "Crop name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Grains", "Vegetables", "Fruits", "Pulses", "Oilseeds", "Spices", "Other"],
        message: "{VALUE} is not a valid category",
      },
      default: "Other",
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    images: {
      type: [String],
      default: [],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      default: "kg",
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    isOrganic: {
      type: Boolean,
      default: false,
    },
    harvestDate: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    state: {
      type: String,
      default: "",
      trim: true,
    },
    district: {
      type: String,
      default: "",
      trim: true,
    },
    deliveryAvailable: {
      type: Boolean,
      default: false,
    },
    pickupAvailable: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: {
        values: ["Active", "Sold Out", "Inactive"],
        message: "{VALUE} is not a valid status",
      },
      default: "Active",
      index: true,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    wishlistCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    minimumOrder: {
      type: Number,
      default: 1,
      min: 0,
    },
    maximumOrder: {
      type: Number,
      default: null,
    },
    pricePerUnit: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ListingSchema.index({ cropName: "text", description: "text" });

const Listing = mongoose.model("Listing", ListingSchema);
export default Listing;
