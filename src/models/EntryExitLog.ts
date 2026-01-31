import mongoose, { Schema, type InferSchemaType } from "mongoose";

export const LOG_TYPES = ["entry", "exit"] as const;

export type LogType = (typeof LOG_TYPES)[number];

const entryExitLogSchema = new Schema(
  {
    // Log ID (e.g., LOG-2026-001)
    logId: { type: String, required: true, unique: true },
    
    // Student who entered/exited
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Type: entry or exit
    type: {
      type: String,
      enum: LOG_TYPES,
      required: true,
    },
    
    // Timestamp of the event
    timestamp: { type: Date, required: true, default: Date.now },
    
    // Related gate pass (if applicable)
    gatePass: {
      type: Schema.Types.ObjectId,
      ref: "GatePass",
    },
    
    // Security guard who logged this
    loggedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Notes
    notes: { type: String },
    
    // Whether this was a late return
    isLate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
entryExitLogSchema.index({ student: 1, timestamp: -1 });
entryExitLogSchema.index({ type: 1, timestamp: -1 });
entryExitLogSchema.index({ loggedBy: 1 });

export type EntryExitLogDocument = InferSchemaType<typeof entryExitLogSchema> & {
  _id: mongoose.Types.ObjectId;
};

const EntryExitLog =
  mongoose.models.EntryExitLog || mongoose.model("EntryExitLog", entryExitLogSchema);

export default EntryExitLog;
