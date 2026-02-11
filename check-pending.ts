/**
 * Check Pending Students in Database
 * Quick script to verify pending student registrations
 */

import { connectDB, disconnectDB } from "./scripts/lib/db";
import User from "./src/models/User";

async function checkPendingStudents() {
  try {
    console.log("🔍 Connecting to database...\n");
    await connectDB();

    // Check all students first
    const allStudents = await User.find({
      userType: "student"
    }).select("fullName email studentId approvalStatus isActive createdAt passwordHash").lean();

    console.log(`📊 Found ${allStudents.length} total student(s):\n`);
    
    if (allStudents.length > 0) {
      allStudents.forEach((student, index) => {
        console.log(`${index + 1}. ${student.fullName}`);
        console.log(`   Student ID: ${student.studentId}`);
        console.log(`   Email: ${student.email}`);
        console.log(`   Approval Status: ${student.approvalStatus}`);
        console.log(`   Has Password: ${!!student.passwordHash}`);
        console.log(`   Active: ${student.isActive}`);
        console.log(`   Created: ${student.createdAt}`);
        console.log(`   DB ID: ${student._id}\n`);
      });
    } else {
      console.log("   No students found.\n");
    }

    // Check for pending students
    const pendingStudents = allStudents.filter(s => s.approvalStatus === "pending");

    console.log(`\n📈 All students breakdown:`);
    const statusCounts = {
      pending: allStudents.filter(s => s.approvalStatus === "pending").length,
      approved: allStudents.filter(s => s.approvalStatus === "approved").length,
      rejected: allStudents.filter(s => s.approvalStatus === "rejected").length,
    };
    
    console.log(`   Total Students: ${allStudents.length}`);
    console.log(`   Pending: ${statusCounts.pending}`);
    console.log(`   Approved: ${statusCounts.approved}`);
    console.log(`   Rejected: ${statusCounts.rejected}`);

    await disconnectDB();
    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Error:", error);
    await disconnectDB();
    process.exit(1);
  }
}

checkPendingStudents();
