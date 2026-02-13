/**
 * Seed Gate Pass Data
 *
 * Usage:
 *   npx tsx scripts/seeds/gate-pass.ts
 */

import { connectDB, disconnectDB } from "../lib/db";
import User from "../../src/models/User";
import GatePass from "../../src/models/GatePass";
import { getBDDateWithOffset, getBDDate } from "../../src/lib/dates";

const gatePassData = [
  {
    purpose: "home",
    destination: "Dhaka, Mirpur",
    outTime: "09:00",
    returnTime: "18:00",
    contactNumber: "+880 1812-111111",
    emergencyContact: "+880 1712-999999",
    status: "pending",
    daysOffset: 1,
    returnDaysOffset: 3,
  },
  {
    purpose: "medical",
    destination: "Square Hospital, Dhaka",
    outTime: "10:00",
    returnTime: "14:00",
    contactNumber: "+880 1812-222222",
    emergencyContact: "+880 1712-888888",
    status: "approved",
    daysOffset: 0,
    returnDaysOffset: 0,
  },
  {
    purpose: "academic",
    destination: "National Library, Dhaka",
    outTime: "08:00",
    returnTime: "17:00",
    contactNumber: "+880 1812-333333",
    emergencyContact: "+880 1712-777777",
    status: "active",
    daysOffset: 0,
    returnDaysOffset: 0,
  },
  {
    purpose: "personal",
    destination: "Gulshan, Dhaka",
    outTime: "14:00",
    returnTime: "20:00",
    contactNumber: "+880 1812-444444",
    emergencyContact: "+880 1712-666666",
    status: "completed",
    daysOffset: -2,
    returnDaysOffset: -2,
  },
  {
    purpose: "family",
    destination: "Chittagong",
    outTime: "06:00",
    returnTime: "22:00",
    contactNumber: "+880 1812-555555",
    emergencyContact: "+880 1712-555555",
    status: "rejected",
    daysOffset: 2,
    returnDaysOffset: 4,
  },
];

export async function seedGatePass(): Promise<{ success: number; skipped: number; failed: number }> {
  console.log("\n📌 Seeding Gate Passes...");

  let success = 0;
  let skipped = 0;
  let failed = 0;

  // Get active students
  const students = await User.find({ userType: "student", approvalStatus: "approved", isActive: true }).limit(5);
  if (students.length === 0) {
    console.log("  ⚠️  No active students found, skipping gate passes");
    return { success: 0, skipped: 0, failed: 0 };
  }

  // Clear existing gate passes
  try {
    const deleteResult = await GatePass.deleteMany({});
    console.log(`  🗑️  Cleared ${deleteResult.deletedCount} existing gate passes`);
  } catch (error) {
    console.error("  ⚠️  Failed to clear existing gate passes:", error);
  }

  for (let i = 0; i < gatePassData.length; i++) {
    const pass = gatePassData[i];
    const student = students[i % students.length];
    const bdDate = getBDDate();
    const year = bdDate.getFullYear();
    const passId = `GP-${year}-${String(i + 1).padStart(4, "0")}`;

    try {
      const outDate = getBDDateWithOffset(pass.daysOffset);
      const returnDate = getBDDateWithOffset(pass.returnDaysOffset);

      await GatePass.create({
        passId,
        studentId: student._id,
        purpose: pass.purpose,
        destination: pass.destination,
        outDate,
        outTime: pass.outTime,
        returnDate,
        returnTime: pass.returnTime,
        contactNumber: pass.contactNumber,
        emergencyContact: pass.emergencyContact,
        status: pass.status,
      });
      console.log(`  ✅ Created: ${passId} - ${pass.purpose} (${pass.status})`);
      success++;
    } catch (error) {
      console.error(`  ❌ Failed to create gate pass:`, error);
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

    const result = await seedGatePass();
    console.log(`\n📊 Results: ${result.success} created, ${result.skipped} skipped, ${result.failed} failed`);

    await disconnectDB();
    process.exit(result.failed > 0 ? 1 : 0);
  })();
}
