import mongoose, { Schema, type InferSchemaType } from "mongoose";

export const LAUNDRY_STATUSES = [
  "pending",
  "collected",
  "washing",
  "ready",
  "delivered",
] as const;

export type LaundryStatus = (typeof LAUNDRY_STATUSES)[number];

const laundryItemSchema = new Schema({
  type: { 
    type: String, 
    required: true,
    enum: ["shirt", "pant", "bedsheet", "towel", "other"],
  },
  quantity: { type: Number, required: true, min: 1 },
  notes: { type: String },
});

const laundrySchema = new Schema(
  {
    // Laundry request ID (e.g., LND-2026-001)
    requestId: { type: String, required: true, unique: true },
    
    // Student who submitted the request
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Items in this laundry request
    items: [laundryItemSchema],
    
    // Total number of items
    totalItems: { type: Number, required: true, min: 1 },
    
    // Status of the request
    status: {
      type: String,
      enum: LAUNDRY_STATUSES,
      default: "pending",
    },
    
    // Pickup date (when student drops clothes)
    pickupDate: { type: Date },
    
    // Expected delivery date
    expectedDelivery: { type: Date },
    
    // Actual delivery date
    actualDelivery: { type: Date },
    
    // Staff who handled this request
    handledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    
    // Notes from staff
    staffNotes: { type: String },
    
    // Student notes
    studentNotes: { type: String },
    
    // Cost (if applicable)
    cost: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes
laundrySchema.index({ student: 1, createdAt: -1 });
laundrySchema.index({ status: 1 });

export type LaundryDocument = InferSchemaType<typeof laundrySchema> & {
  _id: mongoose.Types.ObjectId;
};

const Laundry =
  mongoose.models.Laundry || mongoose.model("Laundry", laundrySchema);

export default Laundry;
