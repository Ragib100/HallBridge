import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SystemSettings from "@/models/SystemSettings";

// GET /api/billing - Get billing information with settings from database
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Fetch billing-related settings from database
    const settingsKeys = ["monthly_rent", "laundry_fee", "maintenance_fee", "wifi_fee", "payment_due_days", "late_fee_percent"];
    const settings = await SystemSettings.find({ key: { $in: settingsKeys } }).lean();

    // Convert to a map for easy access
    const settingsMap: Record<string, number> = {};
    settings.forEach((setting: any) => {
      settingsMap[setting.key] = parseFloat(setting.value) || 0;
    });

    // Calculate current month billing
    const currentDate = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();

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

    // TODO: Fetch actual mess bill from student's meal records
    // For now, calculate based on a placeholder or set to 0
    const messBill = 0; // This should be calculated from meal records

    const totalAmount = seatRent + messBill + otherCharges + laundryFee;

    const invoiceId = `INV-${currentYear}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

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
        amount: totalAmount,
        dueDate: dueDateStr,
        isPaid: false,
      },
      settings: {
        monthly_rent: seatRent,
        laundry_fee: laundryFee,
        maintenance_fee: maintenanceFee,
        wifi_fee: wifiFee,
        late_fee_percent: settingsMap.late_fee_percent || 5,
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
    const body = await request.json();
    
    // TODO: Implement payment processing logic
    return NextResponse.json({
      message: "Payment processed",
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
