import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";
import { sendPasswordResetOTPEmail } from "@/lib/email";

/**
 * Generate a random 6-digit OTP
 */
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * POST /api/auth/forgot-password
 * Request password reset - sends OTP to email
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration attacks
    // But only send email if user exists
    if (!user) {
      return NextResponse.json({
        message: "If an account with that email exists, we've sent a password reset OTP.",
      });
    }

    // Check if user is a student with pending/rejected status
    if (user.userType === "student") {
      if (user.approvalStatus === "pending") {
        return NextResponse.json(
          { message: "Your account is still pending approval. Please wait for admin confirmation." },
          { status: 403 }
        );
      }
      if (user.approvalStatus === "rejected") {
        return NextResponse.json(
          { message: "Your account request was rejected. Please contact administration." },
          { status: 403 }
        );
      }
    }

    // Delete any existing reset tokens for this user
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Generate new OTP
    const otp = generateOTP();

    // Create new reset token
    await PasswordResetToken.create({
      userId: user._id,
      email: user.email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send OTP email
    await sendPasswordResetOTPEmail(user.email, user.fullName, otp);

    return NextResponse.json({
      message: "If an account with that email exists, we've sent a password reset OTP.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
