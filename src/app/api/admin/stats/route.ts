import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";
import MaintenanceRequest from "@/models/MaintenanceRequest";

// GET /api/admin/stats - Get dashboard statistics (admin only)
export async function GET() {
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

    // Get current month start date
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // User stats
    const totalStudents = await User.countDocuments({ userType: "student", isActive: true });
    const totalStaff = await User.countDocuments({ userType: "staff", isActive: true });
    const pendingRegistrations = await User.countDocuments({ userType: "student", isActive: false });
    const newStudentsThisMonth = await User.countDocuments({
      userType: "student",
      createdAt: { $gte: monthStart },
    });

    // Get recent students (joined this month)
    const recentStudents = await User.find({
      userType: "student",
      createdAt: { $gte: monthStart },
    })
      .select("fullName email createdAt")
      .sort({ createdAt: -1 })
      .limit(10);

    // Maintenance stats
    const maintenanceStats = {
      total: await MaintenanceRequest.countDocuments(),
      pending: await MaintenanceRequest.countDocuments({ status: "pending" }),
      inProgress: await MaintenanceRequest.countDocuments({ status: "in-progress" }),
      completed: await MaintenanceRequest.countDocuments({ status: "completed" }),
      urgent: await MaintenanceRequest.countDocuments({ priority: "urgent", status: { $ne: "completed" } }),
    };

    // Recent maintenance requests
    const recentMaintenance = await MaintenanceRequest.find()
      .populate("student", "fullName")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get staff by role count
    const staffByRole = await User.aggregate([
      { $match: { userType: "staff", isActive: true } },
      { $group: { _id: "$staffRole", count: { $sum: 1 } } },
    ]);

    return NextResponse.json({
      stats: {
        students: {
          total: totalStudents,
          newThisMonth: newStudentsThisMonth,
          pendingRegistrations,
        },
        staff: {
          total: totalStaff,
          byRole: staffByRole.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {} as Record<string, number>),
        },
        maintenance: maintenanceStats,
      },
      recentStudents: recentStudents.map((s) => ({
        id: s._id,
        fullName: s.fullName,
        email: s.email,
        joinedDate: s.createdAt,
      })),
      recentMaintenance: recentMaintenance.map((r) => ({
        id: r._id,
        requestId: r.requestId,
        student: r.student,
        category: r.category,
        priority: r.priority,
        status: r.status,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
