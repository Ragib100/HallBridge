import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { fullName, email, password, userType } = await req.json();

    if (!fullName || !email || !password || !userType) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!["student", "staff", "admin"].includes(userType)) {
      return NextResponse.json(
        { message: "Invalid user type" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      userType,
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          userType: user.userType,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
