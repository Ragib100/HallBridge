import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";
import GatePass from "@/models/GatePass";
import { getCurrentDateBD } from "@/lib/dates";
import mongoose from "mongoose";

// GET /api/gate-pass - Get user's gate passes
export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;

    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session).select("userType");
    if (!user) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const query: Record<string, unknown> = {};
    if (user.userType === "student") {
      query.studentId = session;
    }

    const passes = await GatePass.find(query)
      .populate("studentId", "fullName email phone")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ passes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching gate passes:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// POST /api/gate-pass - Create a new gate pass request
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
      return NextResponse.json({ message: "Only students can submit gate passes" }, { status: 403 });
    }

    const body = await request.json();
    const {
      purpose,
      destination,
      outDate,
      outTime,
      returnDate,
      returnTime,
      contactNumber,
      emergencyContact,
      purposeDetails,
    } = body;

    if (
      !purpose ||
      !destination ||
      !outDate ||
      !outTime ||
      !returnDate ||
      !returnTime ||
      !contactNumber ||
      !emergencyContact
    ) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (purpose === "other" && (!purposeDetails || !String(purposeDetails).trim())) {
      return NextResponse.json(
        { message: "Please provide your purpose details" },
        { status: 400 }
      );
    }

    const today = getCurrentDateBD();
    if (outDate < today) {
      return NextResponse.json(
        { message: "Out date cannot be before today" },
        { status: 400 }
      );
    }

    if (returnDate < outDate) {
      return NextResponse.json(
        { message: "Return date cannot be before out date" },
        { status: 400 }
      );
    }

    if (returnDate === outDate && returnTime <= outTime) {
      return NextResponse.json(
        { message: "Return time must be after out time" },
        { status: 400 }
      );
    }

    const year = new Date().getFullYear();
    const count = await GatePass.countDocuments();
    const passId = `GP-${year}-${String(count + 1).padStart(4, "0")}`;

    const gatePass = await GatePass.create({
      passId,
      studentId: session,
      purpose,
      purposeDetails: purpose === "other" ? String(purposeDetails).trim() : undefined,
      destination,
      outDate: new Date(outDate),
      outTime,
      returnDate: new Date(returnDate),
      returnTime,
      contactNumber,
      emergencyContact,
      status: "pending",
    });

    return NextResponse.json(
      {
        message: "Gate pass submitted successfully",
        gatePass: {
          id: gatePass._id,
          passId: gatePass.passId,
          status: gatePass.status,
          createdAt: gatePass.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create gate pass" },
      { status: 500 }
    );
  }
}

// PATCH /api/gate-pass - Update gate pass status (security/admin)
export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;

    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session).select("userType staffRole");
    if (!user || (user.userType !== "staff" && user.userType !== "admin")) {
      return NextResponse.json(
        { message: "Only staff can update gate passes" },
        { status: 403 }
      );
    }

    if (user.userType === "staff" && user.staffRole !== "security_guard") {
      return NextResponse.json(
        { message: "Only security guards can update gate passes" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { passId, action } = body;

    if (!passId || !action) {
      return NextResponse.json(
        { message: "Pass ID and action are required" },
        { status: 400 }
      );
    }

    const gatePass = await GatePass.findById(passId);
    if (!gatePass) {
      return NextResponse.json({ message: "Gate pass not found" }, { status: 404 });
    }

    const now = new Date();
    const userId = new mongoose.Types.ObjectId(session);

    switch (action) {
      case "approve":
        if (gatePass.status !== "pending") {
          return NextResponse.json(
            { message: "Only pending passes can be approved" },
            { status: 400 }
          );
        }
        await GatePass.findByIdAndUpdate(passId, {
          status: "approved",
          approvedBy: userId,
          approvedAt: now
        });
        
        return NextResponse.json(
          {
            message: "Gate pass approved successfully",
            gatePass: {
              id: passId,
              status: "approved",
            },
          },
          { status: 200 }
        );

      case "verify_exit":
        if (gatePass.status !== "approved") {
          return NextResponse.json(
            { message: "Only approved passes can be verified for exit" },
            { status: 400 }
          );
        }
        await GatePass.findByIdAndUpdate(passId, {
          status: "active",
          actualOutTime: now,
          checkedOutBy: userId
        });
        
        return NextResponse.json(
          {
            message: "Gate pass exit verified successfully",
            gatePass: {
              id: passId,
              status: "active",
            },
          },
          { status: 200 }
        );

      case "verify_return":
        if (gatePass.status !== "active") {
          return NextResponse.json(
            { message: "Only active passes can be verified for return" },
            { status: 400 }
          );
        }
        const returnDateStr = gatePass.returnDate.toISOString().split('T')[0];
        const returnTimeStr = gatePass.returnTime.includes(':') ? gatePass.returnTime : `${gatePass.returnTime}:00`;
        const expectedReturnStr = `${returnDateStr}T${returnTimeStr}:00`;
        const expectedReturn = new Date(expectedReturnStr);
        const isLate = now > expectedReturn;
        const newStatus = isLate ? "late" : "completed";
        
        await GatePass.findByIdAndUpdate(passId, {
          status: newStatus,
          actualReturnTime: now,
          checkedInBy: userId
        });
        
        return NextResponse.json(
          {
            message: "Gate pass return verified successfully",
            gatePass: {
              id: passId,
              status: newStatus,
            },
          },
          { status: 200 }
        );

      case "reject":
        if (gatePass.status !== "pending") {
          return NextResponse.json(
            { message: "Only pending passes can be rejected" },
            { status: 400 }
          );
        }
        await GatePass.findByIdAndUpdate(passId, {
          status: "rejected",
          rejectionReason: body.reason || "Not specified"
        });
        
        return NextResponse.json(
          {
            message: "Gate pass rejected successfully",
            gatePass: {
              id: passId,
              status: "rejected",
            },
          },
          { status: 200 }
        );

      default:
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error updating gate pass:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
