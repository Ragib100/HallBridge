/**
 * Database Clear Script
 *
 * This script removes all data from the database.
 * USE WITH CAUTION - This is destructive!
 *
 * Usage:
 *   pnpm seed:clear         # Run with confirmation prompt
 *   pnpm seed:clear --force # Skip confirmation
 */

import readline from "readline";
import { connectDB, disconnectDB } from "./lib/db";
import User from "../src/models/User";
import MaintenanceRequest from "../src/models/MaintenanceRequest";
import SystemSettings from "../src/models/SystemSettings";
import Meal from "../src/models/Meal";
import GuestMeal from "../src/models/GuestMeal";
import VoteMeal from "../src/models/VoteMeal";
import WeeklyMeal from "../src/models/WeeklyMeal";
import Room from "../src/models/Room";

async function promptConfirmation(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      "\n⚠️  WARNING: This will DELETE ALL DATA from the database!\n" +
        "Are you sure you want to continue? (type 'yes' to confirm): ",
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === "yes");
      }
    );
  });
}

async function clearDatabase() {
  console.log("\n🗑️  Clearing database...\n");

  // List of all models to clear
  const models = [
    { name: "Users", model: User },
    { name: "MaintenanceRequests", model: MaintenanceRequest },
    { name: "SystemSettings", model: SystemSettings },
    { name: "Meals", model: Meal },
    { name: "GuestMeals", model: GuestMeal },
    { name: "VoteMeals", model: VoteMeal },
    { name: "WeeklyMeals", model: WeeklyMeal },
    { name: "Rooms", model: Room },
  ];

  let totalDeleted = 0;
  let errors = 0;

  for (const { name, model } of models) {
    try {
      const result = await model.deleteMany({});
      console.log(`  ✅ Cleared ${name}: ${result.deletedCount} documents deleted`);
      totalDeleted += result.deletedCount;
    } catch (error) {
      console.log(`  ⚠️  Could not clear ${name}: ${error}`);
      errors++;
    }
  }

  console.log(`\n✅ Database cleared! Total: ${totalDeleted} documents deleted`);
  return errors;
}

async function main() {
  console.log("🧹 Database Clear Script\n");

  // Skip confirmation if --force flag is passed
  const forceMode = process.argv.includes("--force");

  if (!forceMode) {
    const confirmed = await promptConfirmation();
    if (!confirmed) {
      console.log("\n❌ Operation cancelled.");
      process.exit(0);
    }
  }

  const connected = await connectDB();
  if (!connected) process.exit(1);

  const errors = await clearDatabase();

  await disconnectDB();
  process.exit(errors > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("❌ Clear failed:", error);
  process.exit(1);
});
