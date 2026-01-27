import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User, { STAFF_ROLES } from "@/models/User";

// GET - List all staff members (admin only)
export async function GET() {
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

    // Get all staff members
    const staff = await User.find({ userType: "staff" })
      .select("fullName email staffRole phone isActive createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      staff: staff.map((s) => ({
        id: s._id,
        fullName: s.fullName,
        email: s.email,
        staffRole: s.staffRole,
        phone: s.phone,
        isActive: s.isActive ?? true,
        createdAt: s.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// POST - Create new staff member (admin only)
export async function POST(req: Request) {
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

    const body = await req.json();
    const { fullName, email, password, staffRole, phone } = body;

    // Validation
    if (!fullName || !email || !password || !staffRole) {
      return NextResponse.json(
        { message: "Full name, email, password, and role are required" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    // Validate staffRole is one of the allowed values
    const validRoles = ["mess_manager", "financial_staff", "maintenance_staff", "laundry_manager", "security_guard"];
    if (!validRoles.includes(staffRole)) {
      return NextResponse.json(
        { message: `Invalid staff role: ${staffRole}` },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    // Create staff member
    const passwordHash = await bcrypt.hash(password, 10);
    
    const staff = await User.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      userType: "staff",
      staffRole: staffRole,
      phone: phone || undefined,
      isActive: true,
    });

    return NextResponse.json(
      {
        message: "Staff member created successfully",
        staff: {
          id: staff._id,
          fullName: staff.fullName,
          email: staff.email,
          staffRole: staff.staffRole,
          phone: staff.phone,
          isActive: staff.isActive,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating staff:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// PATCH - Update staff member (admin only)
export async function PATCH(req: Request) {
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

    const { id, fullName, staffRole, phone, isActive } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Staff ID is required" }, { status: 400 });
    }

    // Build update object
    const updateData: Record<string, unknown> = {};
    if (fullName) updateData.fullName = fullName;
    if (staffRole && STAFF_ROLES.includes(staffRole)) updateData.staffRole = staffRole;
    if (phone !== undefined) updateData.phone = phone;
    if (typeof isActive === "boolean") updateData.isActive = isActive;

    const staff = await User.findOneAndUpdate(
      { _id: id, userType: "staff" },
      updateData,
      { new: true }
    ).select("fullName email staffRole phone isActive");

    if (!staff) {
      return NextResponse.json({ message: "Staff member not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Staff member updated successfully",
      staff: {
        id: staff._id,
        fullName: staff.fullName,
        email: staff.email,
        staffRole: staff.staffRole,
        phone: staff.phone,
        isActive: staff.isActive,
      },
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// DELETE - Delete staff member (admin only)
export async function DELETE(req: Request) {
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Staff ID is required" }, { status: 400 });
    }

    const staff = await User.findOneAndDelete({ _id: id, userType: "staff" });

    if (!staff) {
      return NextResponse.json({ message: "Staff member not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.error("Error deleting staff:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
