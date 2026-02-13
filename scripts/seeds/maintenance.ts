/**
 * Seed Maintenance Requests Data
 *
 * Usage:
 *   npx tsx scripts/seeds/maintenance.ts
 */

import { connectDB, disconnectDB } from "../lib/db";
import User from "../../src/models/User";
import MaintenanceRequest from "../../src/models/MaintenanceRequest";
import { getBDDate } from "../../src/lib/dates";

const requestsData = [
  {
    category: "electrical",
    priority: "urgent",
    location: "Room 201",
    description: "Power outlet sparking when plugging in devices. Potential fire hazard.",
    status: "pending",
  },
  {
    category: "plumbing",
    priority: "high",
    location: "Room 201 Bathroom",
    description: "Water leak under the sink. Floor is getting wet.",
    status: "in-progress",
  },
  {
    category: "ac-heating",
    priority: "normal",
    location: "Room 305",
    description: "AC not cooling properly. Temperature stays high even at lowest setting.",
    status: "pending",
  },
  {
    category: "furniture",
    priority: "low",
    location: "Room 305",
    description: "Study desk drawer is stuck and won't open.",
    status: "completed",
  },
  {
    category: "internet",
    priority: "normal",
    location: "Room 102",
    description: "WiFi signal very weak in this room. Keeps disconnecting.",
    status: "pending",
  },
  {
    category: "doors-windows",
    priority: "high",
    location: "Room 102",
    description: "Window lock is broken. Cannot close window properly.",
    status: "in-progress",
  },
];

export async function seedMaintenanceRequests(): Promise<{ success: number; failed: number }> {
  console.log("\n📌 Seeding Maintenance Requests...");

  let success = 0;
  let failed = 0;

  // Get some students for the requests
  const students = await User.find({ userType: "student", isActive: true }).limit(3);
  if (students.length === 0) {
    console.log("  ⚠️  No active students found, skipping maintenance requests");
    return { success: 0, failed: 0 };
  }

  // Clear existing maintenance requests
  try {
    const deleteResult = await MaintenanceRequest.deleteMany({});
    console.log(`  🗑️  Cleared ${deleteResult.deletedCount} existing maintenance requests`);
  } catch (error) {
    console.error("  ⚠️  Failed to clear existing requests:", error);
  }

  for (let i = 0; i < requestsData.length; i++) {
    const request = requestsData[i];
    const studentIndex = i % students.length;

    // Generate requestId (same format as in the model's pre-save hook)
    const bdDate = getBDDate();
    const year = bdDate.getFullYear();
    const requestId = `MT-${year}-${String(i + 1).padStart(3, "0")}`;

    try {
      await MaintenanceRequest.create({
        ...request,
        requestId,
        student: students[studentIndex]._id,
      });
      console.log(`  ✅ Created: ${request.category} - ${request.location}`);
      success++;
    } catch (error) {
      console.error(`  ❌ Failed to create ${request.category}:`, error);
      failed++;
    }
  }

  return { success, failed };
}

// Run directly if called as main script
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  (async () => {
    const connected = await connectDB();
    if (!connected) process.exit(1);

    const result = await seedMaintenanceRequests();
    console.log(`\n📊 Results: ${result.success} created, ${result.failed} failed`);

    await disconnectDB();
    process.exit(result.failed > 0 ? 1 : 0);
  })();
}
