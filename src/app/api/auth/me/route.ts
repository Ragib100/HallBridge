import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;

    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session).select("fullName email userType createdAt");
    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
