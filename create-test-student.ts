/**
 * Test Registration
 * Creates a test student with pending approval status
 */

import { connectDB, disconnectDB } from "./scripts/lib/db";
import User from "./src/models/User";

async function createTestStudent() {
  try {
    console.log("🔍 Connecting to database...\n");
    await connectDB();

    const testStudent = {
      fullName: "Test Pending Student",
      email: "test.pending@student.mist.ac.bd",
      studentId: "201411001", // MIST format: batch(4) + dept(2) + roll(3)
      userType: "student",
      approvalStatus: "pending",
      isActive: false,
      mustChangePassword: true,
      academicInfo: {
        department: "CSE",
        batch: "2014",
      }
      // Note: No passwordHash - this is correct for pending students
    };

    // Check if already exists
    const existing = await User.findOne({ studentId: testStudent.studentId });
    if (existing) {
      console.log("⚠️  Test student already exists!");
      console.log(`   Name: ${existing.fullName}`);
      console.log(`   Student ID: ${existing.studentId}`);
      console.log(`   Status: ${existing.approvalStatus}`);
      await disconnectDB();
      return;
    }

    const student = await User.create(testStudent);
    
    console.log("✅ Created test pending student:");
    console.log(`   Name: ${student.fullName}`);
    console.log(`   Email: ${student.email}`);
    console.log(`   Student ID: ${student.studentId}`);
    console.log(`   Approval Status: ${student.approvalStatus}`);
    console.log(`   Active: ${student.isActive}`);
    console.log(`   Has Password: ${!!student.passwordHash}`);
    console.log(`   DB ID: ${student._id}`);
    
    console.log("\n💡 This student should now appear in Admin > Users > Pending Registrations");

    await disconnectDB();
  } catch (error) {
    console.error("❌ Error:", error);
    await disconnectDB();
    process.exit(1);
  }
}

createTestStudent();
