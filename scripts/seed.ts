/**
 * Database Seed Script
 *
 * This script populates the database with initial data for development/testing.
 * Each seed module runs independently - if one fails, others will still execute.
 *
 * Usage:
 *   pnpm seed              # Run all seeds
 *   pnpm seed:users        # Seed only users
 *   pnpm seed:maintenance  # Seed only maintenance requests
 *   pnpm seed:settings     # Seed only system settings
 *   pnpm seed:clear        # Clear all data from the database
 *
 * Make sure your .env.local file has MONGODB_URI configured.
 */

import { connectDB, disconnectDB } from "./lib/db";
import { seedUsers } from "./seeds/users";
import { seedMaintenanceRequests } from "./seeds/maintenance";
import { seedSystemSettings } from "./seeds/settings";
import { seedRooms } from "./seeds/rooms";

interface SeedResult {
  name: string;
  success: number;
  skipped: number;
  failed: number;
  error?: string;
}

async function seed() {
  console.log("🌱 Starting database seed...\n");

  const connected = await connectDB();
  if (!connected) {
    process.exit(1);
  }

  const results: SeedResult[] = [];

  // Seed Users
  try {
    const userResult = await seedUsers();
    results.push({ name: "Users", ...userResult });
  } catch (error) {
    console.error("❌ Users seed failed:", error);
    results.push({ name: "Users", success: 0, skipped: 0, failed: 0, error: String(error) });
  }

  // Seed Maintenance Requests
  try {
    const maintenanceResult = await seedMaintenanceRequests();
    results.push({ name: "Maintenance", success: maintenanceResult.success, skipped: 0, failed: maintenanceResult.failed });
  } catch (error) {
    console.error("❌ Maintenance seed failed:", error);
    results.push({ name: "Maintenance", success: 0, skipped: 0, failed: 0, error: String(error) });
  }

  // Seed System Settings
  try {
    const settingsResult = await seedSystemSettings();
    results.push({ name: "Settings", ...settingsResult });
  } catch (error) {
    console.error("❌ Settings seed failed:", error);
    results.push({ name: "Settings", success: 0, skipped: 0, failed: 0, error: String(error) });
  }

  // Seed Rooms
  try {
    const roomsResult = await seedRooms();
    results.push({ name: "Rooms", ...roomsResult });
  } catch (error) {
    console.error("❌ Rooms seed failed:", error);
    results.push({ name: "Rooms", success: 0, skipped: 0, failed: 0, error: String(error) });
  }

  // Print Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 SEED SUMMARY");
  console.log("=".repeat(60));

  let totalSuccess = 0;
  let totalFailed = 0;
  let hasErrors = false;

  for (const result of results) {
    const status = result.error ? "❌" : result.failed > 0 ? "⚠️" : "✅";
    console.log(`${status} ${result.name}: ${result.success} created, ${result.skipped} skipped, ${result.failed} failed`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
      hasErrors = true;
    }
    totalSuccess += result.success;
    totalFailed += result.failed;
    if (result.error) hasErrors = true;
  }

  console.log("=".repeat(60));
  console.log(`Total: ${totalSuccess} created, ${totalFailed} failed`);

  if (!hasErrors && totalSuccess > 0) {
    console.log("\n" + "=".repeat(60));
    console.log("🔐 DEFAULT LOGIN CREDENTIALS");
    console.log("=".repeat(60));
    console.log("Admin:    admin@hallbridge.com / admin123");
    console.log("Staff:    mess@hallbridge.com / staff123");
    console.log("          maintenance@hallbridge.com / staff123");
    console.log("          laundry@hallbridge.com / staff123");
    console.log("          finance@hallbridge.com / staff123");
    console.log("          security@hallbridge.com / staff123");
    console.log("Student:  rahim@student.edu / student123");
    console.log("          karim@student.edu / student123");
    console.log("          fahim@student.edu / student123");
    console.log("=".repeat(60));
  }

  await disconnectDB();
  process.exit(hasErrors || totalFailed > 0 ? 1 : 0);
}

seed().catch((error) => {
  console.error("❌ Seed script failed:", error);
  process.exit(1);
});
