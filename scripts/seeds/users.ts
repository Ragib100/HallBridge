/**
 * Seed Users Data
 *
 * Usage:
 *   npx tsx scripts/seeds/users.ts
 */

import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../lib/db";
import User from "../../src/models/User";

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

const usersData = [
  // Admin
  {
    fullName: "Admin User",
    email: "admin@hallbridge.com",
    password: "admin123",
    userType: "admin",
    phone: "+880 1712-345678",
    isActive: true,
  },
  // Staff members
  {
    fullName: "Abdul Karim",
    email: "mess@hallbridge.com",
    password: "staff123",
    userType: "staff",
    staffRole: "mess_manager",
    phone: "+880 1712-111111",
    isActive: true,
  },
  {
    fullName: "Rafiq Ahmed",
    email: "maintenance@hallbridge.com",
    password: "staff123",
    userType: "staff",
    staffRole: "maintenance_staff",
    phone: "+880 1712-222222",
    isActive: true,
  },
  {
    fullName: "Jamal Uddin",
    email: "laundry@hallbridge.com",
    password: "staff123",
    userType: "staff",
    staffRole: "laundry_manager",
    phone: "+880 1712-333333",
    isActive: true,
  },
  {
    fullName: "Hassan Ali",
    email: "finance@hallbridge.com",
    password: "staff123",
    userType: "staff",
    staffRole: "financial_staff",
    phone: "+880 1712-444444",
    isActive: true,
  },
  {
    fullName: "Mohammad Alam",
    email: "security@hallbridge.com",
    password: "staff123",
    userType: "staff",
    staffRole: "security_guard",
    phone: "+880 1712-555555",
    isActive: true,
  },
  // Active Students
  {
    fullName: "Rahim Ahmed",
    email: "rahim@student.edu",
    password: "student123",
    userType: "student",
    studentId: "STU-2024-001",
    phone: "+880 1812-111111",
    isActive: true,
    approvalStatus: "approved",
  },
  {
    fullName: "Karim Khan",
    email: "karim@student.edu",
    password: "student123",
    userType: "student",
    studentId: "STU-2024-002",
    phone: "+880 1812-222222",
    isActive: true,
    approvalStatus: "approved",
  },
  {
    fullName: "Fahim Hasan",
    email: "fahim@student.edu",
    password: "student123",
    userType: "student",
    studentId: "STU-2024-003",
    phone: "+880 1812-333333",
    isActive: true,
    approvalStatus: "approved",
  },
  {
    fullName: "Anik Roy",
    email: "anik@student.edu",
    password: "student123",
    userType: "student",
    studentId: "STU-2024-004",
    phone: "+880 1812-444444",
    isActive: true,
    approvalStatus: "approved",
  },
  {
    fullName: "Tanvir Islam",
    email: "tanvir@student.edu",
    password: "student123",
    userType: "student",
    studentId: "STU-2024-005",
    phone: "+880 1812-555555",
    isActive: true,
    approvalStatus: "approved",
  },
  // Pending Students (not yet approved)
  {
    fullName: "Shakil Ahmed",
    email: "shakil@student.edu",
    password: "student123",
    userType: "student",
    studentId: "STU-2024-006",
    isActive: false,
    approvalStatus: "pending",
  },
  {
    fullName: "Imran Hossain",
    email: "imran@student.edu",
    password: "student123",
    userType: "student",
    studentId: "STU-2024-007",
    isActive: false,
    approvalStatus: "pending",
  },
];

export async function seedUsers(): Promise<{ success: number; skipped: number; failed: number }> {
  console.log("\n📌 Seeding Users...");

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const userData of usersData) {
    try {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`  ⏭️  User already exists: ${userData.email}`);
        skipped++;
        continue;
      }

      const passwordHash = await hashPassword(userData.password);
      await User.create({
        fullName: userData.fullName,
        email: userData.email,
        passwordHash,
        userType: userData.userType,
        staffRole: userData.staffRole,
        studentId: userData.studentId,
        phone: userData.phone,
        isActive: userData.isActive,
        approvalStatus: userData.approvalStatus || (userData.userType === 'student' ? 'pending' : undefined),
      });
      console.log(`  ✅ Created user: ${userData.email} (${userData.userType})`);
      success++;
    } catch (error) {
      console.error(`  ❌ Failed to create user ${userData.email}:`, error);
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

    const result = await seedUsers();
    console.log(`\n📊 Results: ${result.success} created, ${result.skipped} skipped, ${result.failed} failed`);

    await disconnectDB();
    process.exit(result.failed > 0 ? 1 : 0);
  })();
}
