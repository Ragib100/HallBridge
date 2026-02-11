import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Room from "@/models/Room";
import User from "@/models/User";

// POST /api/admin/rooms/create - Create a new room
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
    const { floor, roomNumber, capacity, amenities, hallId } = body;

    // Validation
    if (!floor || !roomNumber) {
      return NextResponse.json(
        { message: "Floor and room number are required" },
        { status: 400 }
      );
    }

    if (floor < 1 || floor > 8) {
      return NextResponse.json(
        { message: "Floor must be between 1 and 8" },
        { status: 400 }
      );
    }

    const roomCapacity = capacity || 4;
    if (roomCapacity < 1 || roomCapacity > 6) {
      return NextResponse.json(
        { message: "Room capacity must be between 1 and 6 beds" },
        { status: 400 }
      );
    }

    // Check if room already exists
    const existingRoom = await Room.findOne({ floor, roomNumber });
    if (existingRoom) {
      return NextResponse.json(
        { message: `Room ${roomNumber} on floor ${floor} already exists` },
        { status: 409 }
      );
    }

    // Create display number (e.g., "101", "F2-R05")
    const displayNumber = `${floor}${roomNumber.padStart(2, "0")}`;

    // Create beds array
    const beds = [];
    for (let i = 1; i <= roomCapacity; i++) {
      beds.push({
        bedNumber: i,
        studentId: null,
        isOccupied: false,
      });
    }

    // Create the room
    const room = await Room.create({
      floor: parseInt(floor),
      roomNumber: roomNumber.toString(),
      displayNumber,
      capacity: roomCapacity,
      beds,
      status: "vacant",
      amenities: amenities || [],
      hallId: hallId || null,
    });

    return NextResponse.json({
      message: "Room created successfully",
      room: {
        id: room._id,
        floor: room.floor,
        roomNumber: room.roomNumber,
        displayNumber: room.displayNumber,
        capacity: room.capacity,
        status: room.status,
        amenities: room.amenities,
      },
    });
  } catch (error: any) {
    console.error("Error creating room:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "A room with this floor and room number already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Failed to create room" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/rooms/create - Delete a room (only if empty)
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
    const roomId = searchParams.get("roomId");

    if (!roomId) {
      return NextResponse.json({ message: "Room ID is required" }, { status: 400 });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    // Check if room has any occupied beds
    const hasOccupiedBeds = room.beds.some((bed: { isOccupied: boolean }) => bed.isOccupied);
    if (hasOccupiedBeds) {
      return NextResponse.json(
        { message: "Cannot delete a room with occupied beds. Please remove all students first." },
        { status: 400 }
      );
    }

    await Room.findByIdAndDelete(roomId);

    return NextResponse.json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { message: "Failed to delete room" },
      { status: 500 }
    );
  }
}
