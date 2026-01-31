/**
 * Seed Laundry Requests Data
 *
 * Usage:
 *   npx tsx scripts/seeds/laundry.ts
 */

import { connectDB, disconnectDB } from "../lib/db";
import User from "../../src/models/User";
import Laundry from "../../src/models/Laundry";

function getDateWithOffset(daysOffset: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(0, 0, 0, 0);
  return date;
}

const laundryData = [
  {
    items: [
      { type: "shirt", quantity: 3, notes: "" },
      { type: "pant", quantity: 2, notes: "" },
      { type: "towel", quantity: 1, notes: "" },
    ],
    status: "pending",
    daysOffset: 0,
  },
  {
    items: [
      { type: "shirt", quantity: 5, notes: "Handle with care" },
      { type: "pant", quantity: 3, notes: "" },
      { type: "bedsheet", quantity: 2, notes: "" },
    ],
    status: "collected",
    daysOffset: -1,
  },
  {
    items: [
      { type: "shirt", quantity: 2, notes: "" },
      { type: "towel", quantity: 2, notes: "" },
    ],
    status: "washing",
    daysOffset: -2,
  },
  {
    items: [
      { type: "pant", quantity: 4, notes: "" },
      { type: "shirt", quantity: 4, notes: "" },
      { type: "other", quantity: 1, notes: "Blanket - Dry clean only" },
    ],
    status: "ready",
    daysOffset: -3,
  },
  {
    items: [
      { type: "shirt", quantity: 6, notes: "" },
      { type: "pant", quantity: 4, notes: "" },
      { type: "towel", quantity: 2, notes: "" },
    ],
    status: "delivered",
    daysOffset: -5,
  },
];

export async function seedLaundry(): Promise<{ success: number; skipped: number; failed: number }> {
  console.log("\n📌 Seeding Laundry Requests...");

  let success = 0;
  let skipped = 0;
  let failed = 0;

  // Get active students
  const students = await User.find({ userType: "student", approvalStatus: "approved", isActive: true }).limit(5);
  if (students.length === 0) {
    console.log("  ⚠️  No active students found, skipping laundry requests");
    return { success: 0, skipped: 0, failed: 0 };
  }

  // Clear existing laundry requests
  try {
    const deleteResult = await Laundry.deleteMany({});
    console.log(`  🗑️  Cleared ${deleteResult.deletedCount} existing laundry requests`);
  } catch (error) {
    console.error("  ⚠️  Failed to clear existing laundry requests:", error);
  }

  for (let i = 0; i < laundryData.length; i++) {
    const laundry = laundryData[i];
    const student = students[i % students.length];
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    const requestId = `LR-${year}${month}-${String(i + 1).padStart(4, "0")}`;

    try {
      const submittedDate = getDateWithOffset(laundry.daysOffset);
      const totalItems = laundry.items.reduce((sum, item) => sum + item.quantity, 0);

      // Calculate expected delivery (2 days after submission)
      const expectedDelivery = new Date(submittedDate);
      expectedDelivery.setDate(expectedDelivery.getDate() + 2);

      await Laundry.create({
        requestId,
        student: student._id,
        items: laundry.items,
        totalItems,
        status: laundry.status,
        pickupDate: laundry.status !== "pending" ? submittedDate : undefined,
        expectedDelivery,
        actualDelivery: laundry.status === "delivered" ? expectedDelivery : undefined,
      });
      console.log(`  ✅ Created: ${requestId} - ${totalItems} items (${laundry.status})`);
      success++;
    } catch (error) {
      console.error(`  ❌ Failed to create laundry request:`, error);
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

    const result = await seedLaundry();
    console.log(`\n📊 Results: ${result.success} created, ${result.skipped} skipped, ${result.failed} failed`);

    await disconnectDB();
    process.exit(result.failed > 0 ? 1 : 0);
  })();
}
