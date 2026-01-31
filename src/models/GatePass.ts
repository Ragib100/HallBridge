import mongoose, { Schema, type InferSchemaType } from "mongoose";

const gatePassSchema = new Schema(
  {
    passId: { type: String, required: true, unique: true },
    studentId: { type: mongoose.Types.ObjectId, required: true, ref: "User", index: true },
    purpose: {
      type: String,
      required: true,
      enum: ["home", "medical", "personal", "family", "academic", "other"],
    },
    purposeDetails: { type: String },
    destination: { type: String, required: true },
    outDate: { type: Date, required: true, index: true },
    outTime: { type: String, required: true },
    returnDate: { type: Date, required: true },
    returnTime: { type: String, required: true },
    contactNumber: { type: String, required: true },
    emergencyContact: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active", "completed", "late"],
      default: "pending",
      index: true,
    },
    actualOutTime: { type: Date },
    actualReturnTime: { type: Date },
    checkedOutBy: { type: mongoose.Types.ObjectId, ref: "User" },
    checkedInBy: { type: mongoose.Types.ObjectId, ref: "User" },
    approvedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
    rejectionReason: { type: String },
    qrCode: { type: String },
  },
  { timestamps: true }
);

// Compound indexes for common query patterns
gatePassSchema.index({ studentId: 1, status: 1 }); // Student's passes by status
gatePassSchema.index({ studentId: 1, createdAt: -1 }); // Student's recent passes
gatePassSchema.index({ status: 1, createdAt: -1 }); // Pending passes for approval
gatePassSchema.index({ outDate: 1, status: 1 }); // Active passes for a date

export type GatePassDocument = InferSchemaType<typeof gatePassSchema> & {
  _id: mongoose.Types.ObjectId;
};

const GatePass =
  mongoose.models.GatePass || mongoose.model("GatePass", gatePassSchema);

export default GatePass;
