import mongoose, { Schema, type InferSchemaType } from "mongoose";

export const MAINTENANCE_CATEGORIES = [
  "electrical",
  "plumbing",
  "furniture",
  "ac-heating",
  "doors-windows",
  "internet",
  "other",
] as const;

export const MAINTENANCE_PRIORITIES = [
  "urgent",
  "high",
  "normal",
  "low",
] as const;

export const MAINTENANCE_STATUSES = [
  "pending",
  "in-progress",
  "completed",
  "cancelled",
] as const;

export type MaintenanceCategory = (typeof MAINTENANCE_CATEGORIES)[number];
export type MaintenancePriority = (typeof MAINTENANCE_PRIORITIES)[number];
export type MaintenanceStatus = (typeof MAINTENANCE_STATUSES)[number];

const maintenanceRequestSchema = new Schema(
  {
    // Request ID (e.g., MT-2026-001)
    requestId: { type: String, required: true, unique: true },
    
    // Student who submitted the request
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Request details
    category: {
      type: String,
      enum: MAINTENANCE_CATEGORIES,
      required: true,
    },
    priority: {
      type: String,
      enum: MAINTENANCE_PRIORITIES,
      required: true,
    },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    contactNumber: { type: String, trim: true },
    
    // Status tracking
    status: {
      type: String,
      enum: MAINTENANCE_STATUSES,
      default: "pending",
    },
    
    // Assignment
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignedAt: { type: Date },
    
    // Completion
    completedAt: { type: Date },
    completionNotes: { type: String, trim: true },
    
    // Estimated time of completion
    estimatedCompletion: { type: Date },
  },
  { timestamps: true }
);

// Generate request ID before saving
maintenanceRequestSchema.pre("save", async function (next) {
  if (this.isNew && !this.requestId) {
    const year = new Date().getFullYear();
    const count = await mongoose.models.MaintenanceRequest.countDocuments();
    this.requestId = `MT-${year}-${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

export type MaintenanceRequestDocument = InferSchemaType<typeof maintenanceRequestSchema> & {
  _id: mongoose.Types.ObjectId;
};

const MaintenanceRequest =
  mongoose.models.MaintenanceRequest ||
  mongoose.model("MaintenanceRequest", maintenanceRequestSchema);

export default MaintenanceRequest;
