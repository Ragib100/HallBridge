/**
 * Seed Weekly Menu Data
 *
 * Usage:
 *   npx tsx scripts/seeds/weekly-menu.ts
 */

import { connectDB, disconnectDB } from "../lib/db";
import WeeklyMeal from "../../src/models/WeeklyMeal";

const weeklyMenuData = [
  {
    day: "Saturday",
    breakfast: "Paratha, Egg Curry, Tea",
    lunch: "Rice, Chicken Curry, Dal, Salad",
    dinner: "Rice, Fish Curry, Vegetables, Dessert",
  },
  {
    day: "Sunday",
    breakfast: "Bread, Omelette, Banana, Tea",
    lunch: "Rice, Beef Curry, Mixed Vegetables, Salad",
    dinner: "Rice, Dal, Egg Curry, Bhaji",
  },
  {
    day: "Monday",
    breakfast: "Paratha, Bhaji, Tea",
    lunch: "Rice, Chicken Roast, Dal, Salad",
    dinner: "Rice, Fish Fry, Vegetables, Soup",
  },
  {
    day: "Tuesday",
    breakfast: "Khichuri, Egg, Tea",
    lunch: "Rice, Mutton Curry, Vegetables, Salad",
    dinner: "Rice, Chicken Curry, Dal, Bhaji",
  },
  {
    day: "Wednesday",
    breakfast: "Bread, Egg Bhurji, Fruit, Tea",
    lunch: "Rice, Fish Curry, Dal, Salad",
    dinner: "Rice, Beef Bhuna, Vegetables, Dessert",
  },
  {
    day: "Thursday",
    breakfast: "Paratha, Chicken, Tea",
    lunch: "Biryani, Chicken, Raita, Salad",
    dinner: "Rice, Dal, Fish Curry, Bhaji",
  },
  {
    day: "Friday",
    breakfast: "Luchi, Halwa, Banana, Tea",
    lunch: "Polao, Chicken Roast, Vegetables, Dessert",
    dinner: "Rice, Beef Curry, Dal, Salad",
  },
];

export async function seedWeeklyMenu(): Promise<{ success: number; skipped: number; failed: number }> {
  console.log("\n📌 Seeding Weekly Menu...");

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const menu of weeklyMenuData) {
    try {
      const existing = await WeeklyMeal.findOne({ day: menu.day });
      if (existing) {
        // Update existing menu
        await WeeklyMeal.findOneAndUpdate({ day: menu.day }, menu);
        console.log(`  🔄 Updated: ${menu.day}`);
        skipped++;
        continue;
      }
      await WeeklyMeal.create(menu);
      console.log(`  ✅ Created: ${menu.day}`);
      success++;
    } catch (error) {
      console.error(`  ❌ Failed to create ${menu.day}:`, error);
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

    const result = await seedWeeklyMenu();
    console.log(`\n📊 Results: ${result.success} created, ${result.skipped} updated, ${result.failed} failed`);

    await disconnectDB();
    process.exit(result.failed > 0 ? 1 : 0);
  })();
}
