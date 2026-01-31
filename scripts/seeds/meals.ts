/**
 * Seed Meal Selections Data
 *
 * Usage:
 *   npx tsx scripts/seeds/meals.ts
 */

import { connectDB, disconnectDB } from "../lib/db";
import User from "../../src/models/User";
import Meal from "../../src/models/Meal";

function getDateWithOffset(daysOffset: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function seedMeals(): Promise<{ success: number; skipped: number; failed: number }> {
  console.log("\n📌 Seeding Meal Selections...");

  let success = 0;
  let skipped = 0;
  let failed = 0;

  // Get all active students
  const students = await User.find({ userType: "student", approvalStatus: "approved", isActive: true });
  if (students.length === 0) {
    console.log("  ⚠️  No active students found, skipping meal selections");
    return { success: 0, skipped: 0, failed: 0 };
  }

  // Clear existing meals
  try {
    const deleteResult = await Meal.deleteMany({});
    console.log(`  🗑️  Cleared ${deleteResult.deletedCount} existing meal selections`);
  } catch (error) {
    console.error("  ⚠️  Failed to clear existing meals:", error);
  }

  // Create meal selections for today and tomorrow for each student
  const dates = [
    getDateWithOffset(0), // Today
    getDateWithOffset(1), // Tomorrow
  ];

  for (const student of students) {
    for (const date of dates) {
      try {
        // Random meal selections (most students eat all meals)
        const breakfast = Math.random() > 0.2;
        const lunch = Math.random() > 0.1;
        const dinner = Math.random() > 0.15;

        await Meal.create({
          studentId: student._id,
          date,
          breakfast,
          lunch,
          dinner,
        });
        
        success++;
      } catch (error) {
        console.error(`  ❌ Failed to create meal for ${student.fullName}:`, error);
        failed++;
      }
    }
  }

  console.log(`  ✅ Created meal selections for ${students.length} students over ${dates.length} days`);
  return { success, skipped, failed };
}

// Run directly if called as main script
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  (async () => {
    const connected = await connectDB();
    if (!connected) process.exit(1);

    const result = await seedMeals();
    console.log(`\n📊 Results: ${result.success} created, ${result.skipped} skipped, ${result.failed} failed`);

    await disconnectDB();
    process.exit(result.failed > 0 ? 1 : 0);
  })();
}
