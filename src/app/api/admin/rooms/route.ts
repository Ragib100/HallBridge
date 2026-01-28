import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import Room from "@/models/Room";
import User from "@/models/User";

// GET /api/admin/rooms - Get all rooms with filters
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
    const floor = searchParams.get("floor");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    // Build query
    const query: Record<string, unknown> = {};

    if (floor && floor !== "all") {
      query.floor = parseInt(floor);
    }

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { roomNumber: { $regex: search, $options: "i" } },
        { displayNumber: { $regex: search, $options: "i" } },
      ];
    }

    const rooms = await Room.find(query)
      .populate("beds.studentId", "fullName studentId")
      .sort({ floor: 1, roomNumber: 1 });

    // Get stats
    const stats = await Room.getStats();

    return NextResponse.json({
      rooms: rooms.map((room) => ({
        id: room._id,
        floor: room.floor,
        roomNumber: room.roomNumber,
        displayNumber: room.displayNumber,
        capacity: room.capacity,
        status: room.status,
        amenities: room.amenities,
        hallId: room.hallId,
        beds: room.beds.map((bed: { bedNumber: number; studentId: { _id: mongoose.Types.ObjectId; fullName: string; studentId: string } | null; isOccupied: boolean }) => ({
          bedNumber: bed.bedNumber,
          isOccupied: bed.isOccupied,
          student: bed.studentId
            ? {
                id: bed.studentId._id,
                fullName: bed.studentId.fullName,
                studentId: bed.studentId.studentId,
              }
            : null,
        })),
        availableBeds: room.beds.filter((b: { isOccupied: boolean }) => !b.isOccupied).length,
        occupiedBeds: room.beds.filter((b: { isOccupied: boolean }) => b.isOccupied).length,
      })),
      stats,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// POST /api/admin/rooms - Allocate student to a room
export async function POST(request: Request) {
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
    const { roomId, studentId, bedNumber } = body;

    if (!roomId || !studentId || !bedNumber) {
      return NextResponse.json(
        { message: "Room ID, Student ID, and Bed Number are required" },
        { status: 400 }
      );
    }

    // Find the room
    const room = await Room.findById(roomId);
    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    // Check if room is under maintenance
    if (room.status === "maintenance") {
      return NextResponse.json(
        { message: "Cannot allocate to a room under maintenance" },
        { status: 400 }
      );
    }

    // Find the bed
    const bedIndex = room.beds.findIndex((b: { bedNumber: number }) => b.bedNumber === bedNumber);
    if (bedIndex === -1) {
      return NextResponse.json({ message: "Bed not found" }, { status: 404 });
    }

    // Check if bed is already occupied
    if (room.beds[bedIndex].isOccupied) {
      return NextResponse.json({ message: "This bed is already occupied" }, { status: 400 });
    }

    // Find the student
    const student = await User.findById(studentId);
    if (!student) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // Check if student already has a room allocation
    if (student.roomAllocation?.roomId) {
      return NextResponse.json(
        { message: "Student already has a room allocated" },
        { status: 400 }
      );
    }

    // Allocate the bed
    room.beds[bedIndex].studentId = studentId;
    room.beds[bedIndex].isOccupied = true;
    room.updateStatus();
    await room.save();

    // Update student's room allocation
    student.roomAllocation = {
      roomId: room._id,
      floor: room.floor,
      roomNumber: room.roomNumber,
      bedNumber,
      hallId: room.hallId,
      allocatedAt: new Date(),
    };
    await student.save();

    return NextResponse.json({
      message: "Room allocated successfully",
      room: {
        id: room._id,
        floor: room.floor,
        roomNumber: room.roomNumber,
        displayNumber: room.displayNumber,
        bedNumber,
        hallId: room.hallId,
      },
    });
  } catch (error) {
    console.error("Error allocating room:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// PATCH /api/admin/rooms - Update room status or remove student
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
    const { roomId, action, status, bedNumber } = body;

    if (!roomId) {
      return NextResponse.json({ message: "Room ID is required" }, { status: 400 });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    // Update room status (e.g., set to maintenance)
    if (action === "updateStatus" && status) {
      room.status = status;
      await room.save();
      return NextResponse.json({
        message: "Room status updated successfully",
        room: { id: room._id, status: room.status },
      });
    }

    // Remove student from bed
    if (action === "removeStudent" && bedNumber) {
      const bedIndex = room.beds.findIndex((b: { bedNumber: number }) => b.bedNumber === bedNumber);
      if (bedIndex === -1) {
        return NextResponse.json({ message: "Bed not found" }, { status: 404 });
      }

      const studentId = room.beds[bedIndex].studentId;
      if (studentId) {
        // Remove room allocation from student
        await User.findByIdAndUpdate(studentId, {
          $unset: { roomAllocation: 1 },
        });
      }

      // Clear the bed
      room.beds[bedIndex].studentId = null;
      room.beds[bedIndex].isOccupied = false;
      room.updateStatus();
      await room.save();

      return NextResponse.json({
        message: "Student removed from room successfully",
      });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating room:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// GET available rooms for allocation dropdown
export async function OPTIONS() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
