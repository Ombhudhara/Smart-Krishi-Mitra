import mongoose from "mongoose";

/**
 * Cart
 * Purpose: Stores a user's active shopping cart. One cart per user (upserted).
 */
const CartItemSchema = new mongoose.Schema(
  {
    product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price:    { type: Number, required: true, min: 0 }, // locked at add-time
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    items:    { type: [CartItemSchema], default: [] },
    coupon:   { type: String, default: null },
    discount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Virtual: total price
CartSchema.virtual("totalAmount").get(function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
