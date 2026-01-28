import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Room from "@/models/Room";
import { sendRoomAllocationEmail, sendRejectionEmail } from "@/lib/email";

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

    // For students, use approvalStatus for filtering
    if (userType === "student") {
      if (status === "active") {
        query.approvalStatus = "approved";
        query.isActive = true;
      } else if (status === "pending") {
        query.approvalStatus = "pending";
      } else if (status === "rejected") {
        query.approvalStatus = "rejected";
      }
    } else {
      // For non-students, use isActive
      if (status === "active") {
        query.isActive = true;
      } else if (status === "pending") {
        query.isActive = false;
      }
    }

    const users = await User.find(query)
      .select("fullName email userType staffRole studentId phone isActive approvalStatus createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      users: users.map((u) => ({
        id: u._id,
        fullName: u.fullName,
        email: u.email,
        userType: u.userType,
        staffRole: u.staffRole,
        studentId: u.studentId,
        phone: u.phone,
        isActive: u.isActive ?? true,
        approvalStatus: u.approvalStatus,
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// PATCH /api/admin/users - Update user status or approve/reject student (admin only)
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
    const { id, isActive, action } = body;

    if (!id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    // Handle approval/rejection actions for students
    if (action === "approve" || action === "reject") {
      const student = await User.findById(id).select("fullName email studentId userType approvalStatus");
      
      if (!student) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      if (student.userType !== "student") {
        return NextResponse.json({ message: "This action is only for students" }, { status: 400 });
      }

      if (!student.studentId) {
        return NextResponse.json({ message: "Student ID is required for approval. Please update student profile first." }, { status: 400 });
      }

      if (action === "approve") {
        // Room allocation is required for approval
        const { roomId, bedNumber } = body;
        
        if (!roomId || !bedNumber) {
          return NextResponse.json(
            { message: "Room and bed allocation is required for approval" },
            { status: 400 }
          );
        }

        // Find and validate the room
        const room = await Room.findById(roomId);
        if (!room) {
          return NextResponse.json({ message: "Room not found" }, { status: 404 });
        }

        if (room.status === "maintenance") {
          return NextResponse.json(
            { message: "Cannot allocate to a room under maintenance" },
            { status: 400 }
          );
        }

        // Find and validate the bed
        const bedIndex = room.beds.findIndex((b: { bedNumber: number }) => b.bedNumber === bedNumber);
        if (bedIndex === -1) {
          return NextResponse.json({ message: "Bed not found" }, { status: 404 });
        }

        if (room.beds[bedIndex].isOccupied) {
          return NextResponse.json({ message: "This bed is already occupied" }, { status: 400 });
        }

        // Set password hash using student ID as initial password
        const passwordHash = await bcrypt.hash(student.studentId, 10);

        // Allocate the bed to student
        room.beds[bedIndex].studentId = student._id;
        room.beds[bedIndex].isOccupied = true;
        room.updateStatus();
        await room.save();
        
        // Update student with approval and room allocation
        const updatedStudent = await User.findByIdAndUpdate(
          id,
          {
            approvalStatus: "approved",
            isActive: true,
            passwordHash,
            mustChangePassword: true,
            roomAllocation: {
              roomId: room._id,
              floor: room.floor,
              roomNumber: room.roomNumber,
              bedNumber,
              hallId: room.hallId,
              allocatedAt: new Date(),
            },
          },
          { new: true }
        ).select("fullName email studentId userType approvalStatus isActive roomAllocation");

        // Send room allocation email notification (async, don't wait)
        sendRoomAllocationEmail(
          updatedStudent.email,
          updatedStudent.fullName,
          updatedStudent.studentId,
          {
            floor: room.floor,
            roomNumber: room.roomNumber,
            bedNumber,
            hallId: room.hallId,
          }
        ).catch((err) => {
          console.error("Failed to send room allocation email:", err);
        });

        return NextResponse.json({
          message: "Student approved and room allocated successfully.",
          user: {
            id: updatedStudent._id,
            fullName: updatedStudent.fullName,
            email: updatedStudent.email,
            studentId: updatedStudent.studentId,
            approvalStatus: updatedStudent.approvalStatus,
            isActive: updatedStudent.isActive,
            roomAllocation: updatedStudent.roomAllocation,
          },
          room: {
            floor: room.floor,
            roomNumber: room.roomNumber,
            bedNumber,
          },
        });
      } else if (action === "reject") {
        const updatedStudent = await User.findByIdAndUpdate(
          id,
          { approvalStatus: "rejected", isActive: false },
          { new: true }
        ).select("fullName email studentId userType approvalStatus isActive");

        // Send rejection email notification (async, don't wait)
        sendRejectionEmail(
          updatedStudent.email,
          updatedStudent.fullName
        ).catch((err) => {
          console.error("Failed to send rejection email:", err);
        });

        return NextResponse.json({
          message: "Student request rejected",
          user: {
            id: updatedStudent._id,
            fullName: updatedStudent.fullName,
            email: updatedStudent.email,
            approvalStatus: updatedStudent.approvalStatus,
          },
        });
      }
    }

    // Regular isActive toggle (for deactivating approved students)
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select("fullName email userType isActive approvalStatus");

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
