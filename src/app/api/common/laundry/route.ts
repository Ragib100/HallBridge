import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Laundry, { LAUNDRY_STATUSES } from "@/models/Laundry";

// GET /api/common/laundry - Get laundry requests
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;

    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session).select("userType staffRole fullName");
    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const studentOnly = searchParams.get("studentOnly");

    // Build query based on user type
    const query: Record<string, unknown> = {};

    // Students can only see their own requests
    if (user.userType === "student" || studentOnly === "true") {
      query.student = session;
    }

    // Filter by status if provided
    if (status && status !== "all") {
      query.status = status;
    }

    const requests = await Laundry.find(query)
      .populate("student", "fullName email roomNumber")
      .populate("handledBy", "fullName")
      .sort({ createdAt: -1 });

    // Get stats for staff
    let stats = null;
    if (user.userType === "staff" && user.staffRole === "laundry_manager") {
      const pending = await Laundry.countDocuments({ status: "pending" });
      const collected = await Laundry.countDocuments({ status: "collected" });
      const washing = await Laundry.countDocuments({ status: "washing" });
      const ready = await Laundry.countDocuments({ status: "ready" });
      const todayDelivered = await Laundry.countDocuments({
        status: "delivered",
        actualDelivery: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      });

      stats = { pending, collected, washing, ready, todayDelivered };
    }

    return NextResponse.json({
      requests: requests.map((r) => ({
        id: r._id,
        requestId: r.requestId,
        student: r.student,
        items: r.items,
        totalItems: r.totalItems,
        status: r.status,
        pickupDate: r.pickupDate,
        expectedDelivery: r.expectedDelivery,
        actualDelivery: r.actualDelivery,
        handledBy: r.handledBy,
        staffNotes: r.staffNotes,
        studentNotes: r.studentNotes,
        cost: r.cost,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
      stats,
      statuses: LAUNDRY_STATUSES,
    });
  } catch (error) {
    console.error("Error fetching laundry requests:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// POST /api/common/laundry - Create a new laundry request (students only)
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;

    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session).select("userType");
    if (!user || user.userType !== "student") {
      return NextResponse.json(
        { message: "Only students can submit laundry requests" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { items, studentNotes } = body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { message: "At least one item is required" },
        { status: 400 }
      );
    }

    // Calculate total items
    const totalItems = items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);

    // Generate request ID
    const count = await Laundry.countDocuments();
    const year = new Date().getFullYear();
    const requestId = `LND-${year}-${String(count + 1).padStart(4, "0")}`;

    // Expected delivery is 2 days from now
    const expectedDelivery = new Date();
    expectedDelivery.setDate(expectedDelivery.getDate() + 2);

    const laundryRequest = new Laundry({
      requestId,
      student: session,
      items,
      totalItems,
      status: "pending",
      expectedDelivery,
      studentNotes,
    });

    await laundryRequest.save();

    return NextResponse.json({
      message: "Laundry request submitted successfully",
      request: {
        id: laundryRequest._id,
        requestId: laundryRequest.requestId,
        totalItems: laundryRequest.totalItems,
        status: laundryRequest.status,
        expectedDelivery: laundryRequest.expectedDelivery,
      },
    });
  } catch (error) {
    console.error("Error creating laundry request:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// PATCH /api/common/laundry - Update laundry request status (staff only)
export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;

    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session).select("userType staffRole");
    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    // Only laundry manager can update status
    if (user.userType !== "admin" && user.staffRole !== "laundry_manager") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { id, status, staffNotes, cost } = body;

    if (!id) {
      return NextResponse.json({ message: "Request ID required" }, { status: 400 });
    }

    const laundryRequest = await Laundry.findById(id);
    if (!laundryRequest) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    // Update fields
    if (status && LAUNDRY_STATUSES.includes(status)) {
      laundryRequest.status = status;
      
      // Set pickup date when collected
      if (status === "collected" && !laundryRequest.pickupDate) {
        laundryRequest.pickupDate = new Date();
      }
      
      // Set delivery date when delivered
      if (status === "delivered") {
        laundryRequest.actualDelivery = new Date();
      }
    }

    if (staffNotes !== undefined) laundryRequest.staffNotes = staffNotes;
    if (cost !== undefined) laundryRequest.cost = cost;
    
    laundryRequest.handledBy = session;

    await laundryRequest.save();

    return NextResponse.json({
      message: "Laundry request updated successfully",
      request: {
        id: laundryRequest._id,
        status: laundryRequest.status,
      },
    });
  } catch (error) {
    console.error("Error updating laundry request:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
