import mongoose, { Schema, type InferSchemaType } from "mongoose";

export const EXPENSE_CATEGORIES = [
  "market",
  "utilities",
  "maintenance",
  "salary",
  "equipment",
  "other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

const expenseSchema = new Schema(
  {
    // Expense ID (e.g., EXP-2026-001)
    expenseId: { type: String, required: true, unique: true },
    
    // Category of expense
    category: {
      type: String,
      enum: EXPENSE_CATEGORIES,
      required: true,
    },
    
    // Amount in currency
    amount: { type: Number, required: true, min: 0 },
    
    // Description of the expense
    description: { type: String, required: true },
    
    // Date of the expense
    date: { type: Date, required: true, default: Date.now },
    
    // Staff who added this expense
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Optional receipt or invoice reference
    receipt: { type: String },
    
    // Vendor/supplier name (optional)
    vendor: { type: String },
    
    // Notes
    notes: { type: String },
  },
  { timestamps: true }
);

// Indexes for efficient queries
expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ addedBy: 1 });

export type ExpenseDocument = InferSchemaType<typeof expenseSchema> & {
  _id: mongoose.Types.ObjectId;
};

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default Expense;
