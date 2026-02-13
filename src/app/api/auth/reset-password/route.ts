import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";
import { sendPasswordResetSuccessEmail } from "@/lib/email";
import { getBDDate } from "@/lib/dates";

/**
 * POST /api/auth/reset-password
 * Reset password after OTP verification
 */
export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { message: "Email and new password are required" },
        { status: 400 }
      );
    }

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find verified reset token
    const resetToken = await PasswordResetToken.findOne({
      email: email.toLowerCase(),
      isVerified: true,
      expiresAt: { $gt: getBDDate() },
    });

    if (!resetToken) {
      return NextResponse.json(
        { message: "Invalid or expired reset session. Please start over." },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findById(resetToken.userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update user password
    await User.findByIdAndUpdate(user._id, {
      passwordHash,
      mustChangePassword: false, // Clear the flag if it was set
    });

    // Delete the reset token
    await PasswordResetToken.deleteOne({ _id: resetToken._id });

    // Send success email (async, don't wait)
    sendPasswordResetSuccessEmail(user.email, user.fullName).catch((err) => {
      console.error("Failed to send password reset success email:", err);
    });

    return NextResponse.json({
      message: "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
