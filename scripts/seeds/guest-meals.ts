/**
 * Seed Guest Meal Requests Data
 *
 * Usage:
 *   npx tsx scripts/seeds/guest-meals.ts
 */

import { connectDB, disconnectDB } from "../lib/db";
import User from "../../src/models/User";
import GuestMeal from "../../src/models/GuestMeal";

function getDateWithOffset(daysOffset: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  date.setHours(0, 0, 0, 0);
  return date;
}

const guestMealData = [
  {
    guestName: "Mohammad Ali",
    guestId: "GUEST-001",
    department: "Computer Science",
    phone: "01712345678",
    breakfast: false,
    lunch: true,
    dinner: true,
    daysOffset: 0,
  },
  {
    guestName: "Fatima Khan",
    guestId: "GUEST-002",
    department: "Electrical Engineering",
    phone: "01812345678",
    breakfast: true,
    lunch: true,
    dinner: false,
    daysOffset: 1,
  },
  {
    guestName: "Hasan Rahman",
    guestId: "GUEST-003",
    department: "Civil Engineering",
    phone: "01612345678",
    breakfast: false,
    lunch: true,
    dinner: false,
    daysOffset: -1,
  },
];

export async function seedGuestMeals(): Promise<{ success: number; skipped: number; failed: number }> {
  console.log("\n📌 Seeding Guest Meal Requests...");

  let success = 0;
  let skipped = 0;
  let failed = 0;

  // Get first 3 active students to host guests
  const students = await User.find({ userType: "student", approvalStatus: "approved", isActive: true }).limit(3);
  if (students.length === 0) {
    console.log("  ⚠️  No active students found, skipping guest meals");
    return { success: 0, skipped: 0, failed: 0 };
  }

  // Clear existing guest meals
  try {
    const deleteResult = await GuestMeal.deleteMany({});
    console.log(`  🗑️  Cleared ${deleteResult.deletedCount} existing guest meals`);
  } catch (error) {
    console.error("  ⚠️  Failed to clear existing guest meals:", error);
  }

  for (let i = 0; i < guestMealData.length; i++) {
    const guest = guestMealData[i];
    const student = students[i % students.length];

    try {
      const mealDate = getDateWithOffset(guest.daysOffset);

      await GuestMeal.create({
        studentId: student._id,
        name: guest.guestName,
        id: guest.guestId,
        department: guest.department,
        phone: guest.phone,
        date: mealDate,
        breakfast: guest.breakfast,
        lunch: guest.lunch,
        dinner: guest.dinner,
      });
      console.log(`  ✅ Created: Guest meal for ${guest.guestName} hosted by ${student.fullName}`);
      success++;
    } catch (error) {
      console.error(`  ❌ Failed to create guest meal:`, error);
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

    const result = await seedGuestMeals();
    console.log(`\n📊 Results: ${result.success} created, ${result.skipped} skipped, ${result.failed} failed`);

    await disconnectDB();
    process.exit(result.failed > 0 ? 1 : 0);
  })();
}
