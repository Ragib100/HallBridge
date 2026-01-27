import mongoose, { Schema, type InferSchemaType } from "mongoose";

// Staff role types for role-based dashboard access
export const STAFF_ROLES = [
  "mess_manager",
  "financial_staff",
  "maintenance_staff",
  "laundry_manager",
  "security_guard",
] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    userType: {
      type: String,
      required: true,
      enum: ["student", "staff", "admin"],
    },
    // Staff-specific fields
    staffRole: {
      type: String,
      enum: STAFF_ROLES,
      required: function (this: { userType: string }) {
        return this.userType === "staff";
      },
    },
    phone: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

// Use existing model or create new one
// The pattern handles Next.js hot module reloading correctly
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
