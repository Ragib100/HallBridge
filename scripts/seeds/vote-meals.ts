/**
 * Seed Vote Meal Data
 *
 * Usage:
 *   npx tsx scripts/seeds/vote-meals.ts
 */

import { connectDB, disconnectDB } from "../lib/db";
import User from "../../src/models/User";
import VoteMeal from "../../src/models/VoteMeal";

export async function seedVoteMeals(): Promise<{ success: number; skipped: number; failed: number }> {
  console.log("\n📌 Seeding Meal Votes...");

  let success = 0;
  let skipped = 0;
  let failed = 0;

  // Get active students
  const students = await User.find({ userType: "student", approvalStatus: "approved", isActive: true });
  if (students.length === 0) {
    console.log("  ⚠️  No active students found, skipping vote meals");
    return { success: 0, skipped: 0, failed: 0 };
  }

  // Clear existing vote meals
  try {
    const deleteResult = await VoteMeal.deleteMany({});
    console.log(`  🗑️  Cleared ${deleteResult.deletedCount} existing vote meals`);
  } catch (error) {
    console.error("  ⚠️  Failed to clear existing vote meals:", error);
  }

  const comments = [
    "Great food today!",
    "Rice was a bit undercooked",
    "Loved the fish curry",
    "Could use more vegetables",
    "Excellent quality as always",
    "The dal was perfect",
    "",
    "Average meal",
    "Very tasty!",
    "",
  ];

  for (const student of students) {
    try {
      // Random rating between 1-5
      const rating = Math.floor(Math.random() * 5) + 1;
      const comment = comments[Math.floor(Math.random() * comments.length)];

      await VoteMeal.create({
        studentId: student._id,
        rating,
        comments: comment,
      });
      success++;
    } catch (error) {
      console.error(`  ❌ Failed to create vote for ${student.fullName}:`, error);
      failed++;
    }
  }

  console.log(`  ✅ Created ${success} meal votes from ${students.length} students`);
  return { success, skipped, failed };
}

// Run directly if called as main script
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  (async () => {
    const connected = await connectDB();
    if (!connected) process.exit(1);

    const result = await seedVoteMeals();
    console.log(`\n📊 Results: ${result.success} created, ${result.skipped} skipped, ${result.failed} failed`);

    await disconnectDB();
    process.exit(result.failed > 0 ? 1 : 0);
  })();
}
