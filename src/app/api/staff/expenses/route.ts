import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Expense, { EXPENSE_CATEGORIES } from "@/models/Expense";

// GET /api/staff/expenses - Get all expenses
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

    // Only admin and financial staff can view expenses
    if (user.userType !== "admin" && user.staffRole !== "financial_staff") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const month = searchParams.get("month"); // Format: 2026-01
    const limit = parseInt(searchParams.get("limit") || "50");

    // Build query
    const query: Record<string, unknown> = {};

    if (category && category !== "all") {
      query.category = category;
    }

    if (month) {
      const [year, monthNum] = month.split("-").map(Number);
      const startOfMonth = new Date(year, monthNum - 1, 1);
      const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59);
      query.date = { $gte: startOfMonth, $lte: endOfMonth };
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) (query.date as Record<string, Date>).$gte = new Date(startDate);
      if (endDate) (query.date as Record<string, Date>).$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .populate("addedBy", "fullName")
      .sort({ date: -1 })
      .limit(limit);

    // Calculate totals by category
    const totals = await Expense.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const totalsByCategory: Record<string, { total: number; count: number }> = {};
    let grandTotal = 0;
    
    for (const t of totals) {
      totalsByCategory[t._id] = { total: t.total, count: t.count };
      grandTotal += t.total;
    }

    // Monthly totals for chart
    const monthlyTotals = await Expense.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    return NextResponse.json({
      expenses: expenses.map((e) => ({
        id: e._id,
        expenseId: e.expenseId,
        category: e.category,
        amount: e.amount,
        description: e.description,
        date: e.date,
        addedBy: e.addedBy,
        vendor: e.vendor,
        notes: e.notes,
        createdAt: e.createdAt,
      })),
      totals: totalsByCategory,
      grandTotal,
      monthlyTotals: monthlyTotals.map((m) => ({
        year: m._id.year,
        month: m._id.month,
        total: m.total,
      })),
      categories: EXPENSE_CATEGORIES,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// POST /api/staff/expenses - Create a new expense
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

    // Only admin and financial staff can add expenses
    if (user.userType !== "admin" && user.staffRole !== "financial_staff") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { category, amount, description, date, vendor, notes } = body;

    // Validation
    if (!category || !amount || !description) {
      return NextResponse.json(
        { message: "Category, amount, and description are required" },
        { status: 400 }
      );
    }

    if (!EXPENSE_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { message: "Invalid category" },
        { status: 400 }
      );
    }

    // Generate expense ID
    const count = await Expense.countDocuments();
    const year = new Date().getFullYear();
    const expenseId = `EXP-${year}-${String(count + 1).padStart(4, "0")}`;

    const expense = new Expense({
      expenseId,
      category,
      amount: parseFloat(amount),
      description,
      date: date ? new Date(date) : new Date(),
      addedBy: session,
      vendor,
      notes,
    });

    await expense.save();

    return NextResponse.json({
      message: "Expense added successfully",
      expense: {
        id: expense._id,
        expenseId: expense.expenseId,
        category: expense.category,
        amount: expense.amount,
        description: expense.description,
        date: expense.date,
      },
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}

// DELETE /api/staff/expenses - Delete an expense
export async function DELETE(request: Request) {
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

    // Only admin and financial staff can delete expenses
    if (user.userType !== "admin" && user.staffRole !== "financial_staff") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Expense ID required" }, { status: 400 });
    }

    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return NextResponse.json({ message: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
