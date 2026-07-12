import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    ipAddress: { type: String, default: "" },
    userAgent: { type: String, default: "" },
    isRevoked: { type: Boolean, default: false },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // TTL index – auto-delete expired tokens
    },
  },
  { timestamps: true }
);

RefreshTokenSchema.index({ user: 1, expiresAt: 1 });

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);
export default RefreshToken;
