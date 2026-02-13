import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import PasswordResetToken from "@/models/PasswordResetToken";
import { getBDDate } from "@/lib/dates";

const MAX_ATTEMPTS = 5;

/**
 * POST /api/auth/verify-otp
 * Verify the OTP code for password reset
 */
export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the reset token
    const resetToken = await PasswordResetToken.findOne({
      email: email.toLowerCase(),
      expiresAt: { $gt: getBDDate() },
    });

    if (!resetToken) {
      return NextResponse.json(
        { message: "No valid reset request found. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Check if max attempts exceeded
    if (resetToken.attempts >= MAX_ATTEMPTS) {
      // Delete the token
      await PasswordResetToken.deleteOne({ _id: resetToken._id });
      return NextResponse.json(
        { message: "Too many failed attempts. Please request a new OTP." },
        { status: 429 }
      );
    }

    // Verify OTP
    if (resetToken.otp !== otp) {
      // Increment attempts
      await PasswordResetToken.updateOne(
        { _id: resetToken._id },
        { $inc: { attempts: 1 } }
      );

      const remainingAttempts = MAX_ATTEMPTS - resetToken.attempts - 1;
      return NextResponse.json(
        {
          message: `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts !== 1 ? "s" : ""} remaining.`,
        },
        { status: 400 }
      );
    }

    // OTP is correct - mark as verified
    await PasswordResetToken.updateOne(
      { _id: resetToken._id },
      { isVerified: true }
    );

    return NextResponse.json({
      message: "OTP verified successfully",
      verified: true,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
