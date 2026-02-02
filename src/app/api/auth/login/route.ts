import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check approval status for students
    if (user.userType === "student") {
      if (user.approvalStatus === "pending") {
        return NextResponse.json(
          { message: "Your hall seat request is still pending approval. Please wait for admin confirmation." },
          { status: 403 }
        );
      }
      if (user.approvalStatus === "rejected") {
        return NextResponse.json(
          { message: "Your hall seat request has been rejected. Please contact administration for more information." },
          { status: 403 }
        );
      }
    }

    // Check if user has a password set
    if (!user.passwordHash) {
      return NextResponse.json(
        { message: "Your account is not yet activated. Please wait for admin approval." },
        { status: 403 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          userType: user.userType,
          staffRole: user.staffRole,
          isActive: user.isActive,
          mustChangePassword: user.mustChangePassword ?? false,
        },
      },
      { status: 200 }
    );

    response.cookies.set({
      name: "hb_session",
      value: user._id.toString(),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set({
      name: "hb_route",
      value: user.userType,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
