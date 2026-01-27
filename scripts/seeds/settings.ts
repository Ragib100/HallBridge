/**
 * Seed System Settings Data
 *
 * Usage:
 *   npx tsx scripts/seeds/settings.ts
 */

import { connectDB, disconnectDB } from "../lib/db";
import SystemSettings from "../../src/models/SystemSettings";

const settingsData = [
  { key: "hall_name", value: "Shahid Zia Hall" },
  { key: "institution_address", value: "University of Engineering & Technology" },
  { key: "admin_email", value: "admin@hallbridge.com" },
  { key: "admin_phone", value: "+880 1712-345678" },
  { key: "emergency_contact", value: "+880 1700-000000" },
  { key: "meal_cutoff_time", value: "22:00" },
  { key: "gate_pass_duration", value: "3" },
  { key: "gate_pass_unit", value: "days" },
  { key: "max_gate_pass_days", value: "7" },
  { key: "laundry_pickup_day", value: "Tuesday" },
  { key: "laundry_delivery_days", value: "2" },
  { key: "check_in_time", value: "22:00" },
  { key: "late_entry_fine", value: "50" },
  { key: "max_laundry_items", value: "20" },
  { key: "bill_generation_date", value: "1" },
  { key: "payment_due_days", value: "15" },
  { key: "late_fee_percent", value: "5" },
  { key: "monthly_rent", value: "3000" },
  { key: "laundry_fee", value: "400" },
  { key: "maintenance_fee", value: "100" },
  { key: "wifi_fee", value: "100" },
];

export async function seedSystemSettings(): Promise<{ success: number; skipped: number; failed: number }> {
  console.log("\n📌 Seeding System Settings...");

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const setting of settingsData) {
    try {
      const existing = await SystemSettings.findOne({ key: setting.key });
      if (existing) {
        console.log(`  ⏭️  Setting already exists: ${setting.key}`);
        skipped++;
        continue;
      }
      await SystemSettings.create(setting);
      console.log(`  ✅ Created: ${setting.key} = ${setting.value}`);
      success++;
    } catch (error) {
      console.error(`  ❌ Failed to create ${setting.key}:`, error);
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

    const result = await seedSystemSettings();
    console.log(`\n📊 Results: ${result.success} created, ${result.skipped} skipped, ${result.failed} failed`);

    await disconnectDB();
    process.exit(result.failed > 0 ? 1 : 0);
  })();
}
