import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
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
      return NextResponse.json({ message: "Only students can view billing info" }, { status: 403 });
    }

    const payments = await Payment.find({ student: session }).sort({ billingYear: -1, billingMonth: -1 }).lean();

    return NextResponse.json(
      {
        message: "Billing information loaded successfully",
        payments,
      },
      { status: 200 }
    );
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
    const { amount, paymentMethod, billingMonth, billingYear, description } = body;
    console.log("Payment request body:", body);

    if (!amount || !paymentMethod) {
      return NextResponse.json({ message: "Amount and payment method are required" }, { status: 400 });
    }

    const currentDate = getBDDate();
    const month = billingMonth || currentDate.getMonth() + 1;
    const year = billingYear || currentDate.getFullYear();

    // Check for existing payment
    const existingPayment = await Payment.findOne({
      student: session,
      billingMonth: month,
      billingYear: year,
      paymentMethod,
      status: "completed",
    });

    if (existingPayment) {
      return NextResponse.json(
        { message: "Payment already exists for this period" },
        { status: 400 }
      );
    }

    const response = await Payment.updateMany(
      {
        student: session,
        billingMonth: month,
        billingYear: year,
        status: "pending",
      },
      {
        $set: {
          status: "completed",
          paidDate: currentDate,
          paymentMethod,
          description,
        }
      }
    );

    if (response.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No pending payment found for this period" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Payment processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST /api/billing error:", error);
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
