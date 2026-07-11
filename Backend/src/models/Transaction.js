import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Buyer reference is required"],
      index: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller reference is required"],
      index: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      default: null,
      index: true,
    },
    cropName: {
      type: String,
      required: [true, "Crop name is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ["UPI", "Cash on Delivery", "Card", "Net Banking", "Other"],
        message: "{VALUE} is not a valid payment method",
      },
      default: "UPI",
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ["Pending", "Completed", "Failed"],
        message: "{VALUE} is not a valid payment status",
      },
      default: "Pending",
      index: true,
    },
    deliveryStatus: {
      type: String,
      enum: {
        values: ["Pending", "Shipped", "Delivered", "Cancelled"],
        message: "{VALUE} is not a valid delivery status",
      },
      default: "Pending",
      index: true,
    },
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true,
      trim: true,
      index: true,
    },
    orderStatus: {
      type: String,
      enum: {
        values: ["Pending", "Accepted", "Processing", "Completed", "Cancelled"],
        message: "{VALUE} is not a valid order status",
      },
      default: "Pending",
      index: true,
    },
    paymentGateway: {
      type: String,
      default: "",
      trim: true,
    },
    transactionId: {
      type: String,
      default: "",
      trim: true,
    },
    invoicePdf: {
      type: String,
      default: "",
      trim: true,
    },
    deliveryAddress: {
      type: String,
      default: "",
      trim: true,
    },
    buyerPhone: {
      type: String,
      default: "",
      trim: true,
    },
    sellerPhone: {
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
TransactionSchema.index({ buyer: 1, createdAt: -1 });
TransactionSchema.index({ seller: 1, createdAt: -1 });

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
