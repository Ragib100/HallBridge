import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment";
import Expense from "@/models/Expense";
import Meal from "@/models/Meal";
import GuestMeal from "@/models/GuestMeal";
import SystemSettings from "@/models/SystemSettings";
import Laundry from "@/models/Laundry";
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
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
      periodLabel = startDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } else if (timeRange === "last-month") {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0, 23, 59, 59);
      periodLabel = startDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } else if (timeRange === "this-year") {
      startDate = new Date(currentDate.getFullYear(), 0, 1);
      endDate = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59);
      periodLabel = `Year ${currentDate.getFullYear()}`;
    } else {
      // Custom range
      const targetYear = customYear ? parseInt(customYear) : currentDate.getFullYear();
      const targetMonth = customMonth 
        ? parseInt(customMonth.split("-")[1]) 
        : currentDate.getMonth() + 1;
      startDate = new Date(targetYear, targetMonth - 1, 1);
      endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);
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

    // Find settings for billing calculation
    const settingsKeys = ["monthly_rent", "laundry_fee", "maintenance_fee", "wifi_fee", 
                          "breakfast_price", "lunch_price", "dinner_price", "guest_meal_price"];
    const settingsDocs = await SystemSettings.find({ key: { $in: settingsKeys } }).lean() as unknown as SettingsDoc[];
    const settings: Record<string, number> = {};
    settingsDocs.forEach(s => { settings[s.key] = parseFloat(s.value) || 0; });

    // Calculate defaulters with actual due amounts
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    
    const defaultersWithDues = [];
    for (const student of students) {
      // Check if they have paid for current month
      const paidThisMonth = await Payment.findOne({
        student: student._id,
        billingMonth: currentMonth,
        billingYear: currentYear,
        status: "completed",
      });

      if (!paidThisMonth) {
        // Calculate their due amount
        const startOfCurrMonth = new Date(currentYear, currentMonth - 1, 1);
        const endOfCurrMonth = new Date(currentYear, currentMonth, 0, 23, 59, 59);

        // Get their meals
        const meals = await Meal.find({
          studentId: student._id,
          date: { $gte: startOfCurrMonth, $lte: endOfCurrMonth },
        });

        let messBill = 0;
        for (const meal of meals) {
          if (meal.breakfast) messBill += settings.breakfast_price || 30;
          if (meal.lunch) messBill += settings.lunch_price || 60;
          if (meal.dinner) messBill += settings.dinner_price || 50;
        }

        // Guest meals
        const guestMeals = await GuestMeal.find({
          studentId: student._id,
          date: { $gte: startOfCurrMonth, $lte: endOfCurrMonth },
        });
        for (const gm of guestMeals) {
          const count = (gm.breakfast || 0) + (gm.lunch || 0) + (gm.dinner || 0);
          messBill += count * (settings.guest_meal_price || 80);
        }

        const seatRent = settings.monthly_rent || 0;
        const laundry = settings.laundry_fee || 0;
        const other = (settings.maintenance_fee || 0) + (settings.wifi_fee || 0);
        const dueAmount = seatRent + messBill + laundry + other;

        // Check previous unpaid months
        let monthsOverdue = 0;
        for (let m = currentMonth - 1; m >= 1; m--) {
          const prevPaid = await Payment.findOne({
            student: student._id,
            billingMonth: m,
            billingYear: currentYear,
            status: "completed",
          });
          if (!prevPaid) monthsOverdue++;
          else break;
        }

        defaultersWithDues.push({
          id: student._id,
          name: student.fullName,
          studentId: student.studentId || `STU-${student._id.toString().slice(-6)}`,
          room: student.roomNumber || 'N/A',
          dueAmount,
          dueDate: new Date(currentYear, currentMonth - 1, 15).toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', year: 'numeric' 
          }),
          monthsOverdue: monthsOverdue + 1,
        });
      }
    }

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
      const mDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const mStart = new Date(mDate.getFullYear(), mDate.getMonth(), 1);
      const mEnd = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 0, 23, 59, 59);

      const mRevenue = await Payment.aggregate([
        { $match: { status: "completed", paidDate: { $gte: mStart, $lte: mEnd } } },
        { $group: { _id: null, total: { $sum: "$finalAmount" } } },
      ]);

      const mExpenses = await Expense.aggregate([
        { $match: { date: { $gte: mStart, $lte: mEnd } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      monthlyStats.push({
        month: mDate.toLocaleDateString("en-US", { month: "short" }),
        monthYear: mDate.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
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
      settings,
    });
  } catch (error) {
    console.error("Error fetching financials:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
