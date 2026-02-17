import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment";
import Expense from "@/models/Expense";
import { notifyPaymentDue } from "@/lib/notifications";
import { getBDDate } from "@/lib/dates";

// GET /api/staff/financials - Get financial overview
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

    // Only admin and financial staff can view financials
    if (user.userType !== "admin" && user.staffRole !== "financial_staff") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("range") || "this-month"; // this-month, last-month, this-year
    const customMonth = searchParams.get("month"); // Format: 2026-01
    const customYear = searchParams.get("year");

    const currentDate = getBDDate();
    let startDate: Date;
    let endDate: Date;
    let periodLabel: string;

    if (timeRange === "this-month") {
      startDate = getBDDate();
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      
      endDate = getBDDate();
      endDate.setMonth(endDate.getMonth() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      periodLabel = startDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } else if (timeRange === "last-month") {
      startDate = getBDDate();
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      
      endDate = getBDDate();
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      periodLabel = startDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } else if (timeRange === "this-year") {
      startDate = getBDDate();
      startDate.setMonth(0);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      
      endDate = getBDDate();
      endDate.setMonth(11);
      endDate.setDate(31);
      endDate.setHours(23, 59, 59, 999);
      periodLabel = `Year ${currentDate.getFullYear()}`;
    } else {
      // Custom range
      const targetYear = customYear ? parseInt(customYear) : currentDate.getFullYear();
      const targetMonth = customMonth 
        ? parseInt(customMonth.split("-")[1]) 
        : currentDate.getMonth() + 1;
      
      startDate = getBDDate();
      startDate.setFullYear(targetYear);
      startDate.setMonth(targetMonth - 1);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      
      endDate = getBDDate();
      endDate.setFullYear(targetYear);
      endDate.setMonth(targetMonth);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      periodLabel = startDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }

    // Revenue from payments
    const payments = await Payment.find({
      status: "completed",
      paidDate: { $gte: startDate, $lte: endDate },
    }).populate("student", "fullName roomNumber studentId").lean();

    const totalRevenue = payments.reduce((sum, p) => sum + (p.finalAmount || 0), 0);

    // Revenue by type
    const revenueByType = await Payment.aggregate([
      { $match: { status: "completed", paidDate: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$type", total: { $sum: "$finalAmount" }, count: { $sum: 1 } } },
    ]);

    // Expenses for the period
    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate },
    }).populate("addedBy", "fullName").lean();

    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

    // Expenses by category
    const expensesByCategory = await Expense.aggregate([
      { $match: { date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    // Define types for lean queries
    type StudentDoc = { _id: string; fullName: string; roomNumber?: string; studentId?: string };
    type StaffDoc = { _id: string; fullName: string; staffRole?: string; salary?: number };
    type SettingsDoc = { key: string; value: string };

    // Get all students
    const students = await User.find({ userType: "student" }).select("fullName roomNumber studentId").lean() as unknown as StudentDoc[];
    
    // Get all staff
    const staff = await User.find({ userType: "staff" }).select("fullName staffRole salary").lean() as unknown as StaffDoc[];

    // Calculate defaulters from actual pending payments (single source of truth)
    const pendingPayments = await Payment.find({ status: "pending" })
      .populate("student", "fullName roomNumber studentId")
      .lean();

    const defaultersMap = new Map<string, {
      id: string;
      name: string;
      studentId: string;
      room: string;
      dueAmount: number;
      dueDate: Date;
    }>();

    pendingPayments.forEach((payment) => {
      const student = payment.student;
      if (!student || typeof student !== "object" || !("_id" in student)) {
        return;
      }

      const studentKey = student._id.toString();
      const current = defaultersMap.get(studentKey);
      const amount = payment.finalAmount || payment.amount || 0;
      const paymentDueDate = new Date(payment.dueDate);

      if (!current) {
        defaultersMap.set(studentKey, {
          id: studentKey,
          name: student.fullName || "Unknown",
          studentId: student.studentId || `STU-${studentKey.slice(-6)}`,
          room: student.roomNumber || "N/A",
          dueAmount: amount,
          dueDate: paymentDueDate,
        });
        return;
      }

      current.dueAmount += amount;
      if (paymentDueDate < current.dueDate) {
        current.dueDate = paymentDueDate;
      }
    });

    const now = getBDDate();
    const defaultersWithDues = Array.from(defaultersMap.values())
      .map((defaulter) => {
        const monthsOverdue = Math.max(
          1,
          (now.getFullYear() - defaulter.dueDate.getFullYear()) * 12 +
            (now.getMonth() - defaulter.dueDate.getMonth()) +
            (now.getDate() >= defaulter.dueDate.getDate() ? 1 : 0)
        );

        return {
          id: defaulter.id,
          name: defaulter.name,
          studentId: defaulter.studentId,
          room: defaulter.room,
          dueAmount: defaulter.dueAmount,
          dueDate: defaulter.dueDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          monthsOverdue,
        };
      })
      .sort((a, b) => b.dueAmount - a.dueAmount);

    // Calculate staff salaries (from salary expenses in the period)
    const salaryExpenses = await Expense.find({
      category: "salary",
      date: { $gte: startDate, $lte: endDate },
    });

    const staffSalaries = staff.map(s => {
      // Check if salary was paid this period
      const salaryPaid = salaryExpenses.find(e => 
        e.description?.toLowerCase().includes(s.fullName.toLowerCase())
      );
      
      return {
        id: s._id,
        name: s.fullName,
        role: s.staffRole?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Staff',
        salary: s.salary || 15000, // Default salary if not set
        status: salaryPaid ? 'paid' : 'pending',
        paidDate: salaryPaid ? new Date(salaryPaid.date).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        }) : null,
      };
    });

    const totalSalaryBudget = staffSalaries.reduce((sum, s) => sum + s.salary, 0);
    const totalSalaryPaid = staffSalaries.filter(s => s.status === 'paid').reduce((sum, s) => sum + s.salary, 0);

    // Monthly comparison (last 6 months)
    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const mStart = getBDDate();
      mStart.setMonth(mStart.getMonth() - i);
      mStart.setDate(1);
      mStart.setHours(0, 0, 0, 0);
      
      const mEnd = getBDDate();
      mEnd.setMonth(mEnd.getMonth() - i + 1);
      mEnd.setDate(0);
      mEnd.setHours(23, 59, 59, 999);

      const mRevenue = await Payment.aggregate([
        { $match: { status: "completed", paidDate: { $gte: mStart, $lte: mEnd } } },
        { $group: { _id: null, total: { $sum: "$finalAmount" } } },
      ]);

      const mExpenses = await Expense.aggregate([
        { $match: { date: { $gte: mStart, $lte: mEnd } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      monthlyStats.push({
        month: mStart.toLocaleDateString("en-US", { month: "short" }),
        monthYear: mStart.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        revenue: mRevenue[0]?.total || 0,
        expenses: mExpenses[0]?.total || 0,
      });
    }

    // All transactions for the period (combined and sorted)
    const allTransactions = [
      ...payments.map(p => ({
        id: p._id,
        transactionId: p.paymentId,
        date: p.paidDate,
        description: `${p.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} - ${p.student?.fullName || 'Unknown'}`,
        category: p.type,
        amount: p.finalAmount,
        type: 'income' as const,
        student: p.student?.fullName,
        studentId: p.student?.studentId,
        room: p.student?.roomNumber,
      })),
      ...expenses.map(e => ({
        id: e._id,
        transactionId: e.expenseId,
        date: e.date,
        description: e.description,
        category: e.category,
        amount: e.amount,
        type: 'expense' as const,
        addedBy: e.addedBy?.fullName,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Pending dues total
    const pendingDues = defaultersWithDues.reduce((sum, d) => sum + d.dueAmount, 0);

    // Collection rate
    const paidStudentCount = students.length - defaultersWithDues.length;
    const collectionRate = students.length > 0 
      ? Math.round((paidStudentCount / students.length) * 100) 
      : 0;

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalExpenses,
        netIncome: totalRevenue - totalExpenses,
        pendingDues,
        collectionRate,
        totalStudents: students.length,
        paidStudents: paidStudentCount,
        defaulterCount: defaultersWithDues.length,
        totalSalaryBudget,
        totalSalaryPaid,
        totalSalaryPending: totalSalaryBudget - totalSalaryPaid,
      },
      revenueByType: revenueByType.map(r => ({
        type: r._id,
        name: r._id?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Other',
        total: r.total,
        count: r.count,
      })),
      expensesByCategory: expensesByCategory.map(e => ({
        category: e._id,
        name: e._id?.charAt(0).toUpperCase() + e._id?.slice(1) || 'Other',
        total: e.total,
        count: e.count,
      })),
      defaulters: defaultersWithDues,
      staffSalaries,
      monthlyStats,
      transactions: allTransactions.slice(0, 50),
      incomeTransactions: allTransactions.filter(t => t.type === 'income').slice(0, 30),
      expenseTransactions: allTransactions.filter(t => t.type === 'expense').slice(0, 30),
      period: {
        startDate,
        endDate,
        label: periodLabel,
        range: timeRange,
      },
    });
  } catch (error) {
    console.error("Error fetching financials:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// POST /api/staff/financials - Send payment reminders to defaulters
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

    if (user.userType !== "admin" && user.staffRole !== "financial_staff") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const studentIdsInput = Array.isArray(body.studentIds) ? body.studentIds : [];

    if (studentIdsInput.length === 0) {
      return NextResponse.json({ message: "Student IDs are required" }, { status: 400 });
    }

    const studentIds = studentIdsInput.map((id: unknown) => String(id));
    const pendingPayments = await Payment.find({
      student: { $in: studentIds },
      status: "pending",
    })
      .select("student finalAmount amount dueDate")
      .lean();

    const dueMap = new Map<string, { amount: number; dueDate: Date | null }>();
    pendingPayments.forEach((payment) => {
      const studentId = payment.student?.toString();
      if (!studentId) return;

      const current = dueMap.get(studentId) || { amount: 0, dueDate: null };
      const amount = payment.finalAmount || payment.amount || 0;
      const paymentDueDate = payment.dueDate ? new Date(payment.dueDate) : null;

      current.amount += amount;
      if (paymentDueDate && (!current.dueDate || paymentDueDate < current.dueDate)) {
        current.dueDate = paymentDueDate;
      }

      dueMap.set(studentId, current);
    });

    const reminderTargets = Array.from(dueMap.entries()).filter(([, due]) => due.amount > 0);

    await Promise.all(
      reminderTargets.map(([studentId, due]) =>
        notifyPaymentDue(
          studentId,
          due.amount,
          (due.dueDate || getBDDate()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        )
      )
    );

    return NextResponse.json({
      message: `Payment reminders sent to ${reminderTargets.length} student(s).`,
      sentCount: reminderTargets.length,
    });
  } catch (error) {
    console.error("Error sending payment reminders:", error);
    return NextResponse.json({ message: "Failed to send reminders" }, { status: 500 });
  }
}
