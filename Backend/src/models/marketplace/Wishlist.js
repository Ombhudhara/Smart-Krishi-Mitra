import mongoose from "mongoose";

/**
 * Wishlist – One wishlist per user. Stores product refs.
 */
const WishlistSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const Wishlist = mongoose.model("Wishlist", WishlistSchema);
export default Wishlist;
