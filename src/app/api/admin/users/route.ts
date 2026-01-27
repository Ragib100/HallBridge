import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";

// GET /api/admin/users - Get all users (admin only)
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;

    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    // Verify admin access
    const admin = await User.findById(session).select("userType");
    if (!admin || admin.userType !== "admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userType = searchParams.get("type"); // student, staff, or all
    const status = searchParams.get("status"); // active, pending, archived

    // Build query
    const query: Record<string, unknown> = {};

    if (userType && userType !== "all") {
      query.userType = userType;
    } else if (!userType) {
      // Default to exclude admin
      query.userType = { $ne: "admin" };
    }

    // For students, active means isActive: true, pending means isActive: false
    if (status === "active") {
      query.isActive = true;
    } else if (status === "pending") {
      query.isActive = false;
    }

    const users = await User.find(query)
      .select("fullName email userType staffRole phone isActive createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      users: users.map((u) => ({
        id: u._id,
        fullName: u.fullName,
        email: u.email,
        userType: u.userType,
        staffRole: u.staffRole,
        phone: u.phone,
        isActive: u.isActive ?? true,
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// PATCH /api/admin/users - Update user status (admin only)
export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;

    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    // Verify admin access
    const admin = await User.findById(session).select("userType");
    if (!admin || admin.userType !== "admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const { id, isActive } = body;

    if (!id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select("fullName email userType isActive");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// DELETE /api/admin/users - Delete user (admin only)
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;

    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    // Verify admin access
    const admin = await User.findById(session).select("userType");
    if (!admin || admin.userType !== "admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Don't allow deleting self
    if (id === session) {
      return NextResponse.json({ message: "Cannot delete your own account" }, { status: 400 });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
