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

// Approval status for student hall seat requests
export const APPROVAL_STATUS = ["pending", "approved", "rejected"] as const;
export type ApprovalStatus = (typeof APPROVAL_STATUS)[number];

// Room allocation schema for students
const roomAllocationSchema = new Schema(
  {
    roomId: { type: Schema.Types.ObjectId, ref: "Room" },
    floor: { type: Number },
    roomNumber: { type: String },
    bedNumber: { type: Number },
    hallId: { type: String, default: null },
    allocatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    // Student ID - unique identifier for students (serves as primary key along with email)
    studentId: {
      type: String,
      trim: true,
      sparse: true, // Allows null values while maintaining uniqueness
      unique: true,
    },
    passwordHash: { type: String, required: false }, // Not required until approved
    userType: {
      type: String,
      required: true,
      enum: ["student", "staff", "admin"],
    },
    // Approval status for student hall seat requests
    approvalStatus: {
      type: String,
      enum: APPROVAL_STATUS,
      default: "pending",
      required: function (this: { userType: string }) {
        return this.userType === "student";
      },
    },
    picture: { type: String, trim: true },
    // Flag to force password change on first login
    mustChangePassword: { type: Boolean, default: false },
    // Room allocation for students
    roomAllocation: roomAllocationSchema,
    academicInfo: {
      department: { type: String, trim: true },
      batch: { type: String, trim: true },
      bloodGroup: { type: String, trim: true, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
      emergencyContact: { type: String, trim: true },
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
    isActive: { 
      type: Boolean, 
      default: function (this: { userType: string; approvalStatus?: string }) {
        // Students start as inactive until approved
        if (this.userType === "student") {
          return this.approvalStatus === "approved";
        }
        // Staff and admin are active by default
        return true;
      }
    },
    // Google OAuth
    googleId: { type: String, sparse: true }, // Store Google email for reference
  },
  { timestamps: true }
);

// Compound index for efficient queries
userSchema.index({ userType: 1, approvalStatus: 1 });

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

// Use existing model or create new one
// The pattern handles Next.js hot module reloading correctly
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
