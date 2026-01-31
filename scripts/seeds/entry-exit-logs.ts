/**
 * Seed Entry/Exit Logs Data
 *
 * Usage:
 *   npx tsx scripts/seeds/entry-exit-logs.ts
 */

import { connectDB, disconnectDB } from "../lib/db";
import User from "../../src/models/User";
import EntryExitLog from "../../src/models/EntryExitLog";

function getDateTimeWithOffset(hoursOffset: number): Date {
  const date = new Date();
  date.setHours(date.getHours() + hoursOffset);
  return date;
}

export async function seedEntryExitLogs(): Promise<{ success: number; skipped: number; failed: number }> {
  console.log("\n📌 Seeding Entry/Exit Logs...");

  let success = 0;
  let skipped = 0;
  let failed = 0;

  // Get active students
  const students = await User.find({ userType: "student", approvalStatus: "approved", isActive: true });
  if (students.length === 0) {
    console.log("  ⚠️  No active students found, skipping entry/exit logs");
    return { success: 0, skipped: 0, failed: 0 };
  }

  // Get security staff
  const securityStaff = await User.findOne({ staffRole: "security_guard", isActive: true });
  if (!securityStaff) {
    console.log("  ⚠️  No security staff found, skipping entry/exit logs");
    return { success: 0, skipped: 0, failed: 0 };
  }

  // Clear existing logs
  try {
    const deleteResult = await EntryExitLog.deleteMany({});
    console.log(`  🗑️  Cleared ${deleteResult.deletedCount} existing entry/exit logs`);
  } catch (error) {
    console.error("  ⚠️  Failed to clear existing logs:", error);
  }

  const logEntries = [
    { hoursOffset: -24, type: "exit", notes: "Going to library", isLate: false },
    { hoursOffset: -22, type: "entry", notes: "", isLate: false },
    { hoursOffset: -12, type: "exit", notes: "Market visit", isLate: false },
    { hoursOffset: -10, type: "entry", notes: "", isLate: false },
    { hoursOffset: -6, type: "exit", notes: "Evening class", isLate: false },
    { hoursOffset: -3, type: "entry", notes: "Late return - class extended", isLate: true },
    { hoursOffset: -2, type: "exit", notes: "Quick errand", isLate: false },
    { hoursOffset: -1, type: "entry", notes: "", isLate: false },
  ];

  let logCounter = 0;

  for (let i = 0; i < Math.min(students.length, 4); i++) {
    const student = students[i];
    // Each student gets 2 log entries
    for (let j = 0; j < 2; j++) {
      const logEntry = logEntries[(i * 2 + j) % logEntries.length];
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, "0");
      logCounter++;
      const logId = `LOG-${year}${month}-${String(logCounter).padStart(4, "0")}`;

      try {
        await EntryExitLog.create({
          logId,
          student: student._id,
          type: logEntry.type,
          timestamp: getDateTimeWithOffset(logEntry.hoursOffset),
          loggedBy: securityStaff._id,
          notes: logEntry.notes || undefined,
          isLate: logEntry.isLate,
        });
        success++;
      } catch (error) {
        console.error(`  ❌ Failed to create log for ${student.fullName}:`, error);
        failed++;
      }
    }
  }

  console.log(`  ✅ Created ${success} entry/exit logs`);
  return { success, skipped, failed };
}

// Run directly if called as main script
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  (async () => {
    const connected = await connectDB();
    if (!connected) process.exit(1);

    const result = await seedEntryExitLogs();
    console.log(`\n📊 Results: ${result.success} created, ${result.skipped} skipped, ${result.failed} failed`);

    await disconnectDB();
    process.exit(result.failed > 0 ? 1 : 0);
  })();
}
