import mongoose from "mongoose";

/**
 * Category
 * Purpose: Hierarchical product categories (supports parent-child nesting).
 */
const CategorySchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, unique: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    icon:        { type: String, default: "" },    // emoji or icon class
    image:       { type: String, default: "" },    // banner image URL
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive:  { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CategorySchema.index({ parent: 1, isActive: 1 });

const Category = mongoose.model("Category", CategorySchema);
export default Category;
