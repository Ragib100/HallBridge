import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";
import GatePass from "@/models/GatePass";
import { getCurrentDateBD } from "@/lib/dates";

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

    const passes = await GatePass.find(query).sort({ createdAt: -1 }).lean();

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
