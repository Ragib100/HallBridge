/**
 * Seed Expenses Data
 *
 * Usage:
 *   npx tsx scripts/seeds/expenses.ts
 */

import { connectDB, disconnectDB } from "../lib/db";
import User from "../../src/models/User";
import Expense from "../../src/models/Expense";

function getDateWithOffset(daysOffset: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(0, 0, 0, 0);
  return date;
}

const expensesData = [
  {
    category: "maintenance",
    description: "Plumbing repair - Floor 3 bathroom",
    amount: 5500,
    daysOffset: -1,
    vendor: "Local Plumber",
  },
  {
    category: "utilities",
    description: "Electricity bill - January 2026",
    amount: 45000,
    daysOffset: -5,
    vendor: "DESCO",
  },
  {
    category: "market",
    description: "Cleaning supplies and equipment",
    amount: 8500,
    daysOffset: -3,
    vendor: "Al-Amin Stores",
  },
  {
    category: "market",
    description: "Monthly grocery purchase - Rice, Oil, Spices",
    amount: 125000,
    daysOffset: -7,
    vendor: "Wholesale Market",
  },
  {
    category: "maintenance",
    description: "AC servicing - All floors",
    amount: 15000,
    daysOffset: -10,
    vendor: "Cool Air Services",
  },
  {
    category: "utilities",
    description: "Water bill - January 2026",
    amount: 12000,
    daysOffset: -4,
    vendor: "WASA",
  },
  {
    category: "equipment",
    description: "New water pump installation",
    amount: 35000,
    daysOffset: -15,
    vendor: "Pump House BD",
  },
  {
    category: "salary",
    description: "Security guard salary - January",
    amount: 15000,
    daysOffset: -2,
    vendor: "",
  },
  {
    category: "market",
    description: "Fresh vegetables and fish",
    amount: 28000,
    daysOffset: -1,
    vendor: "Kawran Bazaar",
  },
  {
    category: "other",
    description: "Miscellaneous office supplies",
    amount: 3500,
    daysOffset: -6,
    vendor: "Office Mart",
  },
];

export async function seedExpenses(): Promise<{ success: number; skipped: number; failed: number }> {
  console.log("\n📌 Seeding Expenses...");

  let success = 0;
  let skipped = 0;
  let failed = 0;

  // Get financial staff for "submittedBy"
  const financialStaff = await User.findOne({ staffRole: "financial_staff", isActive: true });
  if (!financialStaff) {
    console.log("  ⚠️  No financial staff found, skipping expenses");
    return { success: 0, skipped: 0, failed: 0 };
  }

  // Clear existing expenses
  try {
    const deleteResult = await Expense.deleteMany({});
    console.log(`  🗑️  Cleared ${deleteResult.deletedCount} existing expenses`);
  } catch (error) {
    console.error("  ⚠️  Failed to clear existing expenses:", error);
  }

  for (let i = 0; i < expensesData.length; i++) {
    const expense = expensesData[i];
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const expenseId = `EXP-${year}${month}-${String(i + 1).padStart(4, "0")}`;

    try {
      const expenseDate = getDateWithOffset(expense.daysOffset);

      await Expense.create({
        expenseId,
        category: expense.category,
        description: expense.description,
        amount: expense.amount,
        date: expenseDate,
        addedBy: financialStaff._id,
        vendor: expense.vendor || undefined,
      });
      console.log(`  ✅ Created: ${expenseId} - ${expense.category} (৳${expense.amount})`);
      success++;
    } catch (error) {
      console.error(`  ❌ Failed to create expense:`, error);
      failed++;
    }
  }

  return { success, skipped, failed };
}

// Run directly if called as main script
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  (async () => {
    const connected = await connectDB();
    if (!connected) process.exit(1);

    const result = await seedExpenses();
    console.log(`\n📊 Results: ${result.success} created, ${result.skipped} skipped, ${result.failed} failed`);

    await disconnectDB();
    process.exit(result.failed > 0 ? 1 : 0);
  })();
}
