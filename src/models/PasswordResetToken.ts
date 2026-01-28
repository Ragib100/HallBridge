import mongoose, { Schema, type InferSchemaType } from "mongoose";

/**
 * PasswordResetToken Collection
 * Stores OTP tokens for password reset verification
 * Tokens auto-expire after 10 minutes using MongoDB TTL index
 */
const passwordResetTokenSchema = new Schema(
  {
    // Reference to the user requesting reset
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    // 6-digit OTP code
    otp: {
      type: String,
      required: true,
    },
    // Token expires after 10 minutes (TTL index)
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
    // Track verification attempts to prevent brute force
    attempts: {
      type: Number,
      default: 0,
    },
    // Whether OTP has been verified (used for the reset step)
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// TTL index - MongoDB automatically deletes documents after expiresAt
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for quick lookup by email
passwordResetTokenSchema.index({ email: 1 });

export type PasswordResetTokenDocument = InferSchemaType<
  typeof passwordResetTokenSchema
> & {
  _id: mongoose.Types.ObjectId;
};

const PasswordResetToken =
  mongoose.models.PasswordResetToken ||
  mongoose.model("PasswordResetToken", passwordResetTokenSchema);

export default PasswordResetToken;
