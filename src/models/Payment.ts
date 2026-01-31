import mongoose, { Schema, type InferSchemaType } from "mongoose";

export const PAYMENT_STATUSES = [
  "pending",
  "completed",
  "failed",
  "refunded",
] as const;

export const PAYMENT_TYPES = [
  "hall_fee",
  "mess_fee",
  "laundry_fee",
  "fine",
  "other",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type PaymentType = (typeof PAYMENT_TYPES)[number];

const paymentSchema = new Schema(
  {
    // Payment/Invoice ID (e.g., INV-2026-001)
    paymentId: { type: String, required: true, unique: true },
    
    // Student who made the payment
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Type of payment
    type: {
      type: String,
      enum: PAYMENT_TYPES,
      required: true,
    },
    
    // Amount
    amount: { type: Number, required: true, min: 0 },
    
    // Status
    status: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "pending",
    },
    
    // Billing period (month/year)
    billingMonth: { type: Number, required: true, min: 1, max: 12 },
    billingYear: { type: Number, required: true },
    
    // Due date
    dueDate: { type: Date, required: true },
    
    // Paid date (when payment was completed)
    paidDate: { type: Date },
    
    // Payment method
    paymentMethod: { 
      type: String,
      enum: ["cash", "card", "online", "bank_transfer"],
    },
    
    // Transaction reference (if online payment)
    transactionRef: { type: String },
    
    // Staff who processed this payment (if manual)
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    
    // Description/notes
    description: { type: String },
    
    // Late fee (if applicable)
    lateFee: { type: Number, default: 0 },
    
    // Discount (if applicable)
    discount: { type: Number, default: 0 },
    
    // Final amount (amount + lateFee - discount)
    finalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

// Indexes
paymentSchema.index({ student: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ billingYear: 1, billingMonth: 1 });

export type PaymentDocument = InferSchemaType<typeof paymentSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
