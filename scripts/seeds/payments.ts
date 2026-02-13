/**
 * Seed Payments Data
 *
 * Usage:
 *   npx tsx scripts/seeds/payments.ts
 */

import { connectDB, disconnectDB } from "../lib/db";
import User from "../../src/models/User";
import Payment from "../../src/models/Payment";
import { getBDDateWithOffset, getBDDate } from "../../src/lib/dates";

export async function seedPayments(): Promise<{ success: number; skipped: number; failed: number }> {
  console.log("\n📌 Seeding Payments...");

  let success = 0;
  let skipped = 0;
  let failed = 0;

  // Get active students
  const students = await User.find({ userType: "student", approvalStatus: "approved", isActive: true });
  if (students.length === 0) {
    console.log("  ⚠️  No active students found, skipping payments");
    return { success: 0, skipped: 0, failed: 0 };
  }

  // Clear existing payments
  try {
    const deleteResult = await Payment.deleteMany({});
    console.log(`  🗑️  Cleared ${deleteResult.deletedCount} existing payments`);
  } catch (error) {
    console.error("  ⚠️  Failed to clear existing payments:", error);
  }

  const paymentTypes = [
    { type: "hall_fee", amount: 3000, description: "Monthly Hall Rent" },
    { type: "mess_fee", amount: 4200, description: "Monthly Meal Charges" },
    { type: "laundry_fee", amount: 400, description: "Laundry Service Fee" },
    { type: "fine", amount: 100, description: "Late Return Fine" },
    { type: "other", amount: 100, description: "Miscellaneous Fee" },
  ];

  let paymentCounter = 0;

  for (const student of students) {
    // Generate 1-3 payments per student
    const numPayments = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numPayments; i++) {
      const paymentType = paymentTypes[i % paymentTypes.length];
      const bdDate = getBDDate();
      const year = bdDate.getFullYear();
      const month = String(bdDate.getMonth() + 1).padStart(2, "0");
      paymentCounter++;
      const paymentId = `PAY-${year}${month}-${String(paymentCounter).padStart(5, "0")}`;

      try {
        const paymentDate = getBDDateWithOffset(-Math.floor(Math.random() * 30));
        const status = Math.random() > 0.3 ? "completed" : (Math.random() > 0.5 ? "pending" : "failed");
        
        // Random payment methods
        const methods = ["cash", "card", "online", "bank_transfer"] as const;
        const method = methods[Math.floor(Math.random() * methods.length)];

        const currentMonth = bdDate.getMonth() + 1;
        const currentYear = bdDate.getFullYear();

        // Calculate late fee (10% if past due date)
        const lateFee = Math.random() > 0.7 ? Math.round(paymentType.amount * 0.1) : 0;
        const discount = 0;
        const finalAmount = paymentType.amount + lateFee - discount;

        await Payment.create({
          paymentId,
          student: student._id,
          amount: paymentType.amount,
          type: paymentType.type,
          description: paymentType.description,
          paymentMethod: method,
          status,
          billingMonth: currentMonth,
          billingYear: currentYear,
          dueDate: getBDDateWithOffset(15),
          lateFee,
          discount,
          finalAmount,
          transactionRef: status === "completed" ? `TXN${Date.now()}${Math.floor(Math.random() * 1000)}` : undefined,
          paidDate: status === "completed" ? paymentDate : undefined,
        });
        success++;
      } catch (error) {
        console.error(`  ❌ Failed to create payment for ${student.fullName}:`, error);
        failed++;
      }
    }
  }

  console.log(`  ✅ Created ${success} payments for ${students.length} students`);
  return { success, skipped, failed };
}

// Run directly if called as main script
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  (async () => {
    const connected = await connectDB();
    if (!connected) process.exit(1);

    const result = await seedPayments();
    console.log(`\n📊 Results: ${result.success} created, ${result.skipped} skipped, ${result.failed} failed`);

    await disconnectDB();
    process.exit(result.failed > 0 ? 1 : 0);
  })();
}
