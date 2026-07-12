import mongoose from "mongoose";

/**
 * Order (replaces Transaction.js)
 * Purpose: Records a buyer's purchase of a product from a seller.
 */
const StatusHistorySchema = new mongoose.Schema(
  {
    status:    { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    note:      { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
    // Snapshot at purchase time (in case product data changes later)
    snapshot: {
      title:     { type: String },
      cropName:  { type: String },
      price:     { type: Number },
      unit:      { type: String },
      image:     { type: String },
    },
    quantity:    { type: Number, required: true, min: 1 },
    unit:        { type: String, required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    discount:    { type: Number, default: 0 },
    // Delivery
    deliveryType: {
      type: String,
      enum: ["Pickup", "Delivery"],
      required: true,
    },
    deliveryAddress: {
      line1:   { type: String, default: "" },
      city:    { type: String, default: "" },
      state:   { type: String, default: "" },
      pincode: { type: String, default: "" },
    },
    estimatedDelivery: { type: Date, default: null },
    deliveredAt:       { type: Date, default: null },
    // Status
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"],
      default: "Pending",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    invoiceNumber:  { type: String, unique: true, sparse: true },
    statusHistory:  { type: [StatusHistorySchema], default: [] },
    cancelReason:   { type: String, default: "" },
    notes:          { type: String, default: "" },
  },
  { timestamps: true }
);

OrderSchema.index({ buyer: 1, createdAt: -1 });
OrderSchema.index({ seller: 1, orderStatus: 1 });
OrderSchema.index({ invoiceNumber: 1 });

const Order = mongoose.model("Order", OrderSchema);
export default Order;
