import mongoose from "mongoose";

const SchemeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Scheme title is required"],
      trim: true,
      index: true,
      maxlength: [200, "Scheme title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Scheme description is required"],
      trim: true,
    },
    category: {
      type: String,
      default: "Other",
      trim: true,
      index: true,
    },
    state: {
      type: String,
      default: "All India",
      trim: true,
      index: true,
    },
    eligibility: {
      type: String,
      required: [true, "Eligibility criteria details are required"],
      trim: true,
    },
    benefits: {
      type: String,
      required: [true, "Benefits description is required"],
      trim: true,
    },
    documentsRequired: {
      type: [String],
      default: [],
    },
    officialLink: {
      type: String,
      default: "",
      trim: true,
    },
    lastDate: {
      type: Date,
      default: null,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Scheme = mongoose.model("Scheme", SchemeSchema);
export default Scheme;
