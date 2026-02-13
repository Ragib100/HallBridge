import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import User from "@/models/User";
import connectDB from "@/lib/db";
import Payment from "@/models/Payment";
import SystemSettings from "@/models/SystemSettings";
import { getBDDate } from "@/lib/dates";

export async function GET(req: NextRequest) {
    try {
        const isCron = req.headers.get("x-vercel-cron");

        const cookieStore = await cookies();
        const session = cookieStore.get("hb_session")?.value;

        if (!isCron && !session) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        await connectDB();
        if(session) {
            const user = await User.findById(session).select("userType");
            if (!user || user.userType !== "admin") {
                return NextResponse.json({ message: "Only admins can trigger this job" }, { status: 403 });
            }
        }

        const lateFeePercentInfo = await SystemSettings.findOne({ key: "late_fee_percent" }).lean();
        const lateFeePercent = parseFloat((lateFeePercentInfo as any)?.value);

        if (!lateFeePercent || isNaN(lateFeePercent)) {
            console.error("Missing or invalid system setting for late fee percent.");
            return NextResponse.json({ message: "System settings not properly configured" }, { status: 500 });
        }

        const currentDate = getBDDate();
        const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed
        const currentYear = currentDate.getFullYear();
        currentDate.setHours(0, 0, 0, 0); // Normalize to start of day for fair comparison

        // Apply late fees to overdue payments
        const updateResponse = await Payment.updateMany(
            { 
                status: "pending", 
                dueDate: { $lt: currentDate },
                lateFee: { $eq: 0 }
            },
            [
                {
                    $set: { 
                        lateFee: { $multiply: ["$amount", lateFeePercent / 100] },
                        finalAmount: { 
                            $add: [
                                "$amount", 
                                { $multiply: ["$amount", lateFeePercent / 100] }
                            ]
                        }
                    }
                }
            ]
        );

        const messages = [];
        if (updateResponse.modifiedCount > 0) {
            messages.push(`Applied late fees to ${updateResponse.modifiedCount} overdue payment(s).`);
        }

        const message = messages.length > 0 ? messages.join(" ") : "No payments required late fee updates.";
        // console.log(message);
        return NextResponse.json({ message }, { status: 200 });
    }
    catch (error) {
        // console.error("Error processing due billing:", error);
        return NextResponse.json({ message: "Error processing due billing" }, { status: 500 });
    }
}