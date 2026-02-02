import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendRequestReceivedEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { fullName, studentId } = await req.json();

    if (!fullName || !studentId) {
      return NextResponse.json(
        { message: "Full name and student ID are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if student ID already exists
    const existingStudentId = await User.findOne({ studentId: studentId });
    if (existingStudentId) {
      // Provide specific message based on current status
      if (existingStudentId.approvalStatus === "pending") {
        return NextResponse.json(
          { message: "A hall seat request with this Student ID is already pending. Please wait for admin approval." },
          { status: 409 }
        );
      }
      if (existingStudentId.approvalStatus === "approved" && existingStudentId.isActive) {
        return NextResponse.json(
          { message: "This Student ID is already registered and approved. Please log in instead." },
          { status: 409 }
        );
      }
      if (existingStudentId.approvalStatus === "rejected") {
        return NextResponse.json(
          { message: "A previous request with this Student ID was rejected. Please contact administration for assistance." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { message: "Student ID already registered" },
        { status: 409 }
      );
    }

    const email = studentId+ "@student.mist.ac.bd";
    const batch = studentId.slice(0, 4);
    const departmentCode = studentId.slice(4, 6);
    const departments: { [key: string]: string } = {
      "11": "CE",
      "14": "CSE",
      "16": "EECE",
      "18": "ME",
      "22": "AE",
      "24": "NAME",
      "26": "BME",
      "28": "NSE",
      "30": "EWCE",
      "32": "ARCH",
      "34": "PME",
      "36": "IPE",
    };
    const department = departments[departmentCode];
    // Create user with pending status (no password yet)
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      studentId: studentId.trim(),
      userType: "student",
      approvalStatus: "pending",
      isActive: false, // Will be activated upon approval
      mustChangePassword: true, // Will need to change password on first login
      academicInfo: {
        department: department || "Unknown",
        batch: batch,
      },
    });

    // Send confirmation email (async, don't wait)
    sendRequestReceivedEmail(user.email, user.fullName, user.studentId).catch((err) => {
      console.error("Failed to send request received email:", err);
    });

    return NextResponse.json(
      {
        message: "Hall seat request submitted successfully. Please wait for admin approval.",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          studentId: user.studentId,
          approvalStatus: user.approvalStatus,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
