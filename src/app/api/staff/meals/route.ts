import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import User from "@/models/User";
import connectDB from "@/lib/db";

// GET /api/staff/meals - Get all meals (staff only)
export async function GET() {
  try {
    await connectDB();

    // Auth check
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;
    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await User.findById(session);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Only allow staff members
    const staffRoles = ["admin", "mess_manager", "maintenance_staff", "financial_staff", "security_guard"];
    if (!staffRoles.includes(user.role)) {
      return NextResponse.json(
        { message: "Forbidden - Staff access only" },
        { status: 403 }
      );
    }

    // TODO: Implement database query
    return NextResponse.json({
      message: "Meals API endpoint",
      data: [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch meals" },
      { status: 500 }
    );
  }
}

// POST /api/staff/meals - Create or update meal selection (staff only)
export async function POST(request: Request) {
  try {
    await connectDB();

    // Auth check
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;
    if (!session) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await User.findById(session);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Only allow mess_manager or admin
    if (user.role !== "mess_manager" && user.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden - Mess manager or admin access only" },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // TODO: Implement meal selection logic
    return NextResponse.json({
      message: "Meal selection updated",
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update meal selection" },
      { status: 500 }
    );
  }
}
