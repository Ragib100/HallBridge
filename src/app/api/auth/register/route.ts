import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendRequestReceivedEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { fullName, email, studentId, userType } = await req.json();

    if (!fullName || !email || !studentId || !userType) {
      return NextResponse.json(
        { message: "Full name, email, and student ID are required" },
        { status: 400 }
      );
    }

    // Only students can self-register via hall seat request
    if (userType !== "student") {
      return NextResponse.json(
        { message: "Only students can request hall seats" },
        { status: 403 }
      );
    }

    await connectDB();

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      // Provide specific message based on current status
      if (existingEmail.userType === "student") {
        if (existingEmail.approvalStatus === "pending") {
          return NextResponse.json(
            { message: "A hall seat request with this email is already pending. Please wait for admin approval." },
            { status: 409 }
          );
        }
        if (existingEmail.approvalStatus === "approved" && existingEmail.isActive) {
          return NextResponse.json(
            { message: "This email is already registered and approved. Please log in instead." },
            { status: 409 }
          );
        }
        if (existingEmail.approvalStatus === "rejected") {
          return NextResponse.json(
            { message: "A previous request with this email was rejected. Please contact administration for assistance." },
            { status: 409 }
          );
        }
      }
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    // Check if student ID already exists
    const existingStudentId = await User.findOne({ studentId: studentId.trim() });
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

    // Create user with pending status (no password yet)
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      studentId: studentId.trim(),
      userType: "student",
      approvalStatus: "pending",
      isActive: false, // Will be activated upon approval
      mustChangePassword: true, // Will need to change password on first login
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
