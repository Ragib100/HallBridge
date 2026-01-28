import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Room from "@/models/Room";
import User from "@/models/User";

// GET /api/admin/rooms/available - Get rooms with available beds
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

    // Find rooms that are not full and not under maintenance
    const query: Record<string, unknown> = {
      status: { $in: ["vacant", "partial"] },
    };

    if (floor && floor !== "all") {
      query.floor = parseInt(floor);
    }

    const rooms = await Room.find(query)
      .select("floor roomNumber displayNumber capacity beds status amenities hallId")
      .sort({ floor: 1, roomNumber: 1 });

    // Transform to include available beds info
    const availableRooms = rooms.map((room) => {
      const availableBeds = room.beds
        .filter((b: { isOccupied: boolean }) => !b.isOccupied)
        .map((b: { bedNumber: number }) => b.bedNumber);

      return {
        id: room._id,
        floor: room.floor,
        roomNumber: room.roomNumber,
        displayNumber: room.displayNumber,
        capacity: room.capacity,
        status: room.status,
        amenities: room.amenities,
        hallId: room.hallId,
        availableBeds,
        availableCount: availableBeds.length,
      };
    });

    return NextResponse.json({ rooms: availableRooms });
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
