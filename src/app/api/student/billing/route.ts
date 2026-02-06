import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import SystemSettings from "@/models/SystemSettings";
import Meal from "@/models/Meal";
import GuestMeal from "@/models/GuestMeal";
import Payment from "@/models/Payment";
import User from "@/models/User";
import { getBDDate } from "@/lib/dates";

// GET /api/billing - Get billing information with settings from database
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;

    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(session).select("userType");
    if (!user || user.userType !== "student") {
      return NextResponse.json({ message: "Only students can view billing" }, { status: 403 });
    }

    // Fetch billing-related settings from database
    const settingsKeys = [
      "monthly_rent", "laundry_fee", "maintenance_fee", "wifi_fee", 
      "payment_due_days", "late_fee_percent",
      "breakfast_price", "lunch_price", "dinner_price", "guest_meal_price"
    ];
    const settings = await SystemSettings.find({ key: { $in: settingsKeys } }).lean() as unknown as { key: string; value: string }[];

    // Convert to a map for easy access
    const settingsMap: Record<string, number> = {};
    settings.forEach((setting) => {
      settingsMap[setting.key] = parseFloat(setting.value) || 0;
    });

    // Calculate current month billing
    const currentDate = getBDDate();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    const currentMonthNum = currentDate.getMonth() + 1;

    // Get start and end of current month
    const startOfMonth = new Date(currentYear, currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentYear, currentDate.getMonth() + 1, 0, 23, 59, 59);

    // Calculate mess bill from actual meal records
    const meals = await Meal.find({
      studentId: session,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const breakfastPrice = settingsMap.breakfast_price || 30;
    const lunchPrice = settingsMap.lunch_price || 60;
    const dinnerPrice = settingsMap.dinner_price || 50;
    const guestMealPrice = settingsMap.guest_meal_price || 80;

    let messBill = 0;
    let breakfastCount = 0;
    let lunchCount = 0;
    let dinnerCount = 0;

    for (const meal of meals) {
      if (meal.breakfast) {
        messBill += breakfastPrice;
        breakfastCount++;
      }
      if (meal.lunch) {
        messBill += lunchPrice;
        lunchCount++;
      }
      if (meal.dinner) {
        messBill += dinnerPrice;
        dinnerCount++;
      }
    }

    // Add guest meals
    const guestMeals = await GuestMeal.find({
      studentId: session,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    let guestMealCount = 0;
    for (const gm of guestMeals) {
      const count = (gm.breakfast || 0) + (gm.lunch || 0) + (gm.dinner || 0);
      guestMealCount += count;
      messBill += count * guestMealPrice;
    }

    // Calculate due date (payment_due_days from first of month)
    const paymentDueDays = settingsMap.payment_due_days || 15;
    const dueDate = new Date(currentYear, currentDate.getMonth(), paymentDueDays);
    const dueDateStr = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Build bill breakdown
    const seatRent = settingsMap.monthly_rent || 0;
    const laundryFee = settingsMap.laundry_fee || 0;
    const maintenanceFee = settingsMap.maintenance_fee || 0;
    const wifiFee = settingsMap.wifi_fee || 0;
    const otherCharges = maintenanceFee + wifiFee;

    const totalAmount = seatRent + messBill + otherCharges + laundryFee;

    const invoiceId = `INV-${currentYear}-${String(currentMonthNum).padStart(2, '0')}-${session.toString().slice(-4)}`;

    // Check if payment exists for this month
    const existingPayment = await Payment.findOne({
      student: session,
      billingMonth: currentMonthNum,
      billingYear: currentYear,
      type: "hall_fee",
    });

    const isPaid = existingPayment?.status === "completed";

    // Get payment history
    const paymentHistory = await Payment.find({ student: session })
      .sort({ createdAt: -1 })
      .limit(12);

    return NextResponse.json({
      currentBill: {
        invoice_id: invoiceId,
        month: `${currentMonth} ${currentYear}`,
        billinfo: {
          seatrent: seatRent,
          messbill: messBill,
          laundry: laundryFee,
          othercharges: otherCharges,
        },
        mealBreakdown: {
          breakfast: {
            count: breakfastCount,
            price: breakfastPrice,
            total: breakfastCount * breakfastPrice,
          },
          lunch: {
            count: lunchCount,
            price: lunchPrice,
            total: lunchCount * lunchPrice,
          },
          dinner: {
            count: dinnerCount,
            price: dinnerPrice,
            total: dinnerCount * dinnerPrice,
          },
          guestMeals: {
            count: guestMealCount,
            price: guestMealPrice,
            total: guestMealCount * guestMealPrice,
          },
        },
        amount: totalAmount,
        dueDate: dueDateStr,
        isPaid,
        paymentId: existingPayment?._id,
      },
      paymentHistory: paymentHistory.map((p) => ({
        id: p._id,
        paymentId: p.paymentId,
        type: p.type,
        amount: p.finalAmount,
        status: p.status,
        billingMonth: p.billingMonth,
        billingYear: p.billingYear,
        paidDate: p.paidDate,
        createdAt: p.createdAt,
      })),
      settings: {
        monthly_rent: seatRent,
        laundry_fee: laundryFee,
        maintenance_fee: maintenanceFee,
        wifi_fee: wifiFee,
        late_fee_percent: settingsMap.late_fee_percent || 5,
        breakfast_price: breakfastPrice,
        lunch_price: lunchPrice,
        dinner_price: dinnerPrice,
        guest_meal_price: guestMealPrice,
      }
    });
  } catch (error) {
    console.error("GET /api/billing error:", error);
    return NextResponse.json(
      { error: "Failed to load billing data" },
      { status: 500 }
    );
  }
}

// POST /api/billing - Process payment
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
      return NextResponse.json({ message: "Only students can make payments" }, { status: 403 });
    }

    const body = await request.json();
    const { amount, type, paymentMethod, billingMonth, billingYear, description } = body;

    if (!amount || !type) {
      return NextResponse.json({ message: "Amount and type are required" }, { status: 400 });
    }

    const currentDate = getBDDate();
    const month = billingMonth || currentDate.getMonth() + 1;
    const year = billingYear || currentDate.getFullYear();

    // Check for existing payment
    const existingPayment = await Payment.findOne({
      student: session,
      billingMonth: month,
      billingYear: year,
      type,
      status: "completed",
    });

    if (existingPayment) {
      return NextResponse.json(
        { message: "Payment already exists for this period" },
        { status: 400 }
      );
    }

    // Generate payment ID
    const count = await Payment.countDocuments();
    const paymentId = `PAY-${year}-${String(count + 1).padStart(5, "0")}`;

    // Calculate due date and late fee
    const settingsDoc = await SystemSettings.findOne({ key: "payment_due_days" });
    const paymentDueDays = settingsDoc ? parseInt(settingsDoc.value) : 15;
    const dueDate = new Date(year, month - 1, paymentDueDays);

    const lateFeeSettingsDoc = await SystemSettings.findOne({ key: "late_fee_percent" });
    const lateFeePercent = lateFeeSettingsDoc ? parseFloat(lateFeeSettingsDoc.value) : 5;

    let lateFee = 0;
    if (currentDate > dueDate) {
      lateFee = (amount * lateFeePercent) / 100;
    }

    const finalAmount = amount + lateFee;

    const payment = new Payment({
      paymentId,
      student: session,
      type,
      amount,
      status: "completed", // In a real app, this would be "pending" until payment gateway confirms
      billingMonth: month,
      billingYear: year,
      dueDate,
      paidDate: getBDDate(),
      paymentMethod: paymentMethod || "online",
      description,
      lateFee,
      discount: 0,
      finalAmount,
    });

    await payment.save();

    return NextResponse.json({
      message: "Payment processed successfully",
      payment: {
        id: payment._id,
        paymentId: payment.paymentId,
        amount: payment.finalAmount,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error("POST /api/billing error:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
