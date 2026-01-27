import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";
import MaintenanceRequest from "@/models/MaintenanceRequest";

// GET /api/maintenance - Get maintenance requests
// Query params: status, studentId (optional)
export async function GET(request: Request) {
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

    const requests = await MaintenanceRequest.find(query)
      .populate("student", "fullName email phone")
      .populate("assignedTo", "fullName email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      requests: requests.map((r) => ({
        id: r._id,
        requestId: r.requestId,
        student: r.student,
        category: r.category,
        priority: r.priority,
        location: r.location,
        description: r.description,
        contactNumber: r.contactNumber,
        status: r.status,
        assignedTo: r.assignedTo,
        assignedAt: r.assignedAt,
        completedAt: r.completedAt,
        completionNotes: r.completionNotes,
        estimatedCompletion: r.estimatedCompletion,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching maintenance requests:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// POST /api/maintenance - Create a new maintenance request (students only)
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
      return NextResponse.json({ message: "Only students can submit maintenance requests" }, { status: 403 });
    }

    const body = await request.json();
    const { category, priority, location, description, contactNumber } = body;

    // Validation
    if (!category || !priority || !location || !description) {
      return NextResponse.json(
        { message: "Category, priority, location, and description are required" },
        { status: 400 }
      );
    }

    // Generate request ID
    const year = new Date().getFullYear();
    const count = await MaintenanceRequest.countDocuments();
    const requestId = `MT-${year}-${String(count + 1).padStart(3, "0")}`;

    const maintenanceRequest = await MaintenanceRequest.create({
      requestId,
      student: session,
      category,
      priority,
      location,
      description,
      contactNumber: contactNumber || undefined,
      status: "pending",
    });

    return NextResponse.json(
      {
        message: "Maintenance request submitted successfully",
        request: {
          id: maintenanceRequest._id,
          requestId: maintenanceRequest.requestId,
          category: maintenanceRequest.category,
          priority: maintenanceRequest.priority,
          location: maintenanceRequest.location,
          status: maintenanceRequest.status,
          createdAt: maintenanceRequest.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating maintenance request:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// PATCH /api/maintenance - Update maintenance request status (staff/admin only)
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

    // Only staff (maintenance) or admin can update
    const canUpdate =
      user.userType === "admin" ||
      (user.userType === "staff" && user.staffRole === "maintenance_staff");

    if (!canUpdate) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const { id, status, assignedTo, estimatedCompletion, completionNotes } = body;

    if (!id) {
      return NextResponse.json({ message: "Request ID is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status;
      if (status === "in-progress" && !assignedTo) {
        updateData.assignedTo = session;
        updateData.assignedAt = new Date();
      }
      if (status === "completed") {
        updateData.completedAt = new Date();
      }
    }

    if (assignedTo) {
      updateData.assignedTo = assignedTo;
      updateData.assignedAt = new Date();
    }

    if (estimatedCompletion) {
      updateData.estimatedCompletion = new Date(estimatedCompletion);
    }

    if (completionNotes) {
      updateData.completionNotes = completionNotes;
    }

    const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(id, updateData, { new: true })
      .populate("student", "fullName email")
      .populate("assignedTo", "fullName email");

    if (!updatedRequest) {
      return NextResponse.json({ message: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Request updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating maintenance request:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
