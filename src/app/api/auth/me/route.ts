import { NextRequest, NextResponse } from "next/server";
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

    const user = await User.findById(session).select("fullName email studentId userType picture staffRole phone isActive approvalStatus mustChangePassword roomAllocation academicInfo createdAt");
    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        studentId: user.studentId,
        userType: user.userType,
        picture: user.picture,
        staffRole: user.staffRole,
        phone: user.phone,
        isActive: user.isActive,
        approvalStatus: user.approvalStatus,
        mustChangePassword: user.mustChangePassword,
        roomAllocation: user.roomAllocation,
        academicInfo: user.academicInfo,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// PATCH - Update current user's profile
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;

    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session);
    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, picture, academicInfo } = body;

    // Only allow updating fullName, phone, picture, and academicInfo (email is primary key, not editable)
    const updateData: Record<string, any> = {};
    if (fullName !== undefined && fullName.trim()) {
      updateData.fullName = fullName.trim();
    }
    if (phone !== undefined) {
      updateData.phone = phone.trim();
    }
    if (picture !== undefined) {
      updateData.picture = picture.trim();
    }
    if (academicInfo !== undefined) {
      updateData.academicInfo = {
        department: academicInfo.department?.trim() || undefined,
        batch: academicInfo.batch?.trim() || undefined,
        bloodGroup: academicInfo.bloodGroup || undefined,
        emergencyContact: academicInfo.emergencyContact?.trim() || undefined,
      };
    }
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      session,
      updateData,
      { new: true }
    ).select("fullName email studentId userType picture staffRole phone isActive academicInfo roomAllocation approvalStatus mustChangePassword createdAt");

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        studentId: updatedUser.studentId,
        userType: updatedUser.userType,
        picture: updatedUser.picture,
        staffRole: updatedUser.staffRole,
        phone: updatedUser.phone,
        isActive: updatedUser.isActive,
        approvalStatus: updatedUser.approvalStatus,
        mustChangePassword: updatedUser.mustChangePassword,
        roomAllocation: updatedUser.roomAllocation,
        academicInfo: updatedUser.academicInfo,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
