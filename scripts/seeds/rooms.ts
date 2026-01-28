import mongoose from "mongoose";
import Room from "../../src/models/Room";

// Room seed configuration
const TOTAL_FLOORS = 8;
const ROOMS_PER_FLOOR = 20;
const BEDS_PER_ROOM = 4;

interface SeedResult {
  success: number;
  skipped: number;
  failed: number;
}

export async function seedRooms(): Promise<SeedResult> {
  console.log("🏢 Seeding rooms...");
  console.log(`   Configuration: ${TOTAL_FLOORS} floors × ${ROOMS_PER_FLOOR} rooms × ${BEDS_PER_ROOM} beds = ${TOTAL_FLOORS * ROOMS_PER_FLOOR * BEDS_PER_ROOM} total beds`);

  // Check if rooms already exist
  const existingCount = await Room.countDocuments();
  if (existingCount > 0) {
    console.log(`   ⚠️ ${existingCount} rooms already exist. Skipping seed.`);
    console.log(`   💡 To reseed, run: pnpm seed:rooms --force`);
    return { success: 0, skipped: existingCount, failed: 0 };
  }

  const rooms = [];

  for (let floor = 1; floor <= TOTAL_FLOORS; floor++) {
    for (let roomNum = 1; roomNum <= ROOMS_PER_FLOOR; roomNum++) {
      // Create room number format: 101, 102, ..., 120, 201, 202, ..., 820
      const roomNumber = `${floor}${roomNum.toString().padStart(2, "0")}`;
      
      // Create beds array
      const beds = [];
      for (let bedNum = 1; bedNum <= BEDS_PER_ROOM; bedNum++) {
        beds.push({
          bedNumber: bedNum,
          studentId: null,
          isOccupied: false,
        });
      }

      rooms.push({
        floor,
        roomNumber,
        displayNumber: `Room ${roomNumber}`,
        capacity: BEDS_PER_ROOM,
        beds,
        status: "vacant",
        amenities: ["Fan", "Common Bath"],
        hallId: "HB-001", // Default hall ID
      });
    }
  }

  // Insert all rooms
  await Room.insertMany(rooms);

  console.log(`   ✅ Created ${rooms.length} rooms successfully!`);
  console.log(`   📊 Summary:`);
  console.log(`      - Total Rooms: ${rooms.length}`);
  console.log(`      - Total Beds: ${rooms.length * BEDS_PER_ROOM}`);
  console.log(`      - Floors: 1-${TOTAL_FLOORS}`);
  console.log(`      - Rooms per floor: ${ROOMS_PER_FLOOR}`);

  return { success: rooms.length, skipped: 0, failed: 0 };
}

export async function clearRooms() {
  console.log("🧹 Clearing all rooms...");
  const result = await Room.deleteMany({});
  console.log(`   ✅ Deleted ${result.deletedCount} rooms.`);
}

// Run directly if this file is executed
if (require.main === module) {
  const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/hallbridge";

  const args = process.argv.slice(2);
  const forceReseed = args.includes("--force") || args.includes("-f");
  const clearOnly = args.includes("--clear") || args.includes("-c");

  mongoose
    .connect(MONGODB_URI)
    .then(async () => {
      console.log("📦 Connected to MongoDB");

      if (clearOnly) {
        await clearRooms();
      } else if (forceReseed) {
        await clearRooms();
        await seedRooms();
      } else {
        await seedRooms();
      }

      console.log("🎉 Room seed complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error seeding rooms:", error);
      process.exit(1);
    });
}
