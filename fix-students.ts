/**
 * Fix Student Records
 * Updates existing students to have proper approvalStatus
 */

import { connectDB, disconnectDB } from "./scripts/lib/db";
import User from "./src/models/User";

async function fixStudents() {
  try {
    console.log("🔍 Connecting to database...\n");
    await connectDB();

    // Find all students without proper approvalStatus
    const studentsToFix = await User.find({
      userType: "student",
      $or: [
        { approvalStatus: { $exists: false } },
        { approvalStatus: null },
        { approvalStatus: undefined }
      ]
    });

    console.log(`📊 Found ${studentsToFix.length} student(s) to fix\n`);

    if (studentsToFix.length === 0) {
      console.log("✅ All students already have proper approval status!");
      await disconnectDB();
      return;
    }

    // Update each student
    for (const student of studentsToFix) {
      const updates: any = {};
      
      // If they have a password, they were already "approved" in old system
      if (student.passwordHash) {
        updates.approvalStatus = "approved";
        updates.isActive = true;
      } else {
        // If no password, they're pending approval
        updates.approvalStatus = "pending";
        updates.isActive = false;
      }

      // Set studentId if missing (use email prefix or generate one)
      if (!student.studentId) {
        const emailPrefix = student.email.split('@')[0];
        updates.studentId = `STU${Date.now().toString().slice(-6)}`;
        console.log(`   🔢 Generated Student ID: ${updates.studentId} for ${student.fullName}`);
      }

      await User.findByIdAndUpdate(student._id, updates);
      console.log(`   ✅ Fixed: ${student.fullName} (${student.email}) - Status: ${updates.approvalStatus}`);
    }

    console.log(`\n✅ Fixed ${studentsToFix.length} student record(s)!`);

    // Show summary
    const summary = await User.aggregate([
      { $match: { userType: "student" } },
      { $group: { 
        _id: "$approvalStatus", 
        count: { $sum: 1 }
      }}
    ]);

    console.log("\n📈 Updated breakdown:");
    summary.forEach(s => {
      console.log(`   ${s._id}: ${s.count}`);
    });

    await disconnectDB();
  } catch (error) {
    console.error("❌ Error:", error);
    await disconnectDB();
    process.exit(1);
  }
}

fixStudents();
