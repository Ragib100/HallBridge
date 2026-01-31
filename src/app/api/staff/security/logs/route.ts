import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";
import EntryExitLog from "@/models/EntryExitLog";
import GatePass from "@/models/GatePass";

// GET /api/staff/security/logs - Get entry/exit logs
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

    // Only admin and security guard can view logs
    if (user.userType !== "admin" && user.staffRole !== "security_guard") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // entry or exit
    const date = searchParams.get("date"); // YYYY-MM-DD
    const limit = parseInt(searchParams.get("limit") || "100");

    // Build query
    const query: Record<string, unknown> = {};

    if (type && (type === "entry" || type === "exit")) {
      query.type = type;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.timestamp = { $gte: startOfDay, $lte: endOfDay };
    }

    const logs = await EntryExitLog.find(query)
      .populate("student", "fullName email roomNumber")
      .populate("loggedBy", "fullName")
      .populate("gatePass", "passId purpose destination")
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayEntries = await EntryExitLog.countDocuments({
      type: "entry",
      timestamp: { $gte: today, $lt: tomorrow },
    });

    const todayExits = await EntryExitLog.countDocuments({
      type: "exit",
      timestamp: { $gte: today, $lt: tomorrow },
    });

    const lateReturns = await EntryExitLog.countDocuments({
      isLate: true,
      timestamp: { $gte: today, $lt: tomorrow },
    });

    // Currently out (students who have exit but no entry after)
    const currentlyOut = await GatePass.countDocuments({
      status: "active",
    });

    return NextResponse.json({
      logs: logs.map((l) => ({
        id: l._id,
        logId: l.logId,
        student: l.student,
        type: l.type,
        timestamp: l.timestamp,
        gatePass: l.gatePass,
        loggedBy: l.loggedBy,
        notes: l.notes,
        isLate: l.isLate,
      })),
      stats: {
        todayEntries,
        todayExits,
        lateReturns,
        currentlyOut,
      },
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// POST /api/staff/security/logs - Create a new entry/exit log
export async function POST(request: Request) {
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

    // Only security guard can create logs
    if (user.userType !== "admin" && user.staffRole !== "security_guard") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { studentId, type, gatePassId, notes, isLate } = body;

    // Validation
    if (!studentId || !type) {
      return NextResponse.json(
        { message: "Student ID and type are required" },
        { status: 400 }
      );
    }

    if (type !== "entry" && type !== "exit") {
      return NextResponse.json(
        { message: "Type must be 'entry' or 'exit'" },
        { status: 400 }
      );
    }

    // Verify student exists
    const student = await User.findById(studentId);
    if (!student || student.userType !== "student") {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    // Generate log ID
    const count = await EntryExitLog.countDocuments();
    const year = new Date().getFullYear();
    const logId = `LOG-${year}-${String(count + 1).padStart(5, "0")}`;

    const log = new EntryExitLog({
      logId,
      student: studentId,
      type,
      timestamp: new Date(),
      gatePass: gatePassId || undefined,
      loggedBy: session,
      notes,
      isLate: isLate || false,
    });

    await log.save();

    // If this is related to a gate pass, update the gate pass status
    if (gatePassId) {
      const gatePass = await GatePass.findById(gatePassId);
      if (gatePass) {
        if (type === "exit" && gatePass.status === "approved") {
          gatePass.status = "active";
          gatePass.actualOutTime = new Date();
          gatePass.checkedOutBy = session;
          await gatePass.save();
        } else if (type === "entry" && gatePass.status === "active") {
          gatePass.actualReturnTime = new Date();
          gatePass.checkedInBy = session;
          
          // Check if late
          const expectedReturn = new Date(gatePass.returnDate);
          const [hours, minutes] = gatePass.returnTime.split(":").map(Number);
          expectedReturn.setHours(hours, minutes, 0, 0);
          
          if (new Date() > expectedReturn) {
            gatePass.status = "late";
            log.isLate = true;
            await log.save();
          } else {
            gatePass.status = "completed";
          }
          
          await gatePass.save();
        }
      }
    }

    return NextResponse.json({
      message: "Log created successfully",
      log: {
        id: log._id,
        logId: log.logId,
        type: log.type,
        timestamp: log.timestamp,
      },
    });
  } catch (error) {
    console.error("Error creating log:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
