import { NextResponse, NextRequest } from "next/server"
import { cookies } from "next/headers"
import connectDB from "@/lib/db"
import SystemSettings from "@/models/SystemSettings"
import Payment from "@/models/Payment"
import User from "@/models/User"
import Meal from "@/models/Meal"
import GuestMeal from "@/models/GuestMeal"
import Laundry from "@/models/Laundry"
import { getBDDate } from "@/lib/dates"

export async function GET(req: NextRequest) {
    try {
        // Check for Vercel Cron authentication
        const authHeader = req.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;
        
        const isCron = req.headers.get("x-vercel-cron") || 
                      (authHeader && cronSecret && authHeader === `Bearer ${cronSecret}`);

        const cookieStore = await cookies();
        const session = cookieStore.get("hb_session")?.value;

        if (!isCron && !session) {
            console.log("Auth failed - no cron header or session");
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
        }

        await connectDB();

        if(session) {
            const user = await User.findById(session).select("userType");
            if (!user || user.userType !== "admin") {
                return NextResponse.json({ message: "Only admins can trigger this job" }, { status: 403 });
            }
        }

        const currentDate = getBDDate();
        const previousMonthDate = getBDDate();
        previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
        previousMonthDate.setDate(1);
        const billingMonth = previousMonthDate.getMonth() + 1; // Months are 0-indexed
        const billingYear = previousMonthDate.getFullYear();

        const existingPayments = await Payment.exists({ billingMonth, billingYear });
        if (existingPayments) {
            // console.log(`Billing for ${billingMonth} ${billingYear} already exists. Skipping.`);
            return NextResponse.json({ message: "Billing already processed for this month" }, { status: 200 });
        }

        const settingsKeys = [
            "monthly_rent", "laundry_fee", "maintenance_fee", "wifi_fee", 
            "payment_due_days", "late_fee_percent",
            "breakfast_price", "lunch_price", "dinner_price", "guest_meal_price"
        ];
        const settings = await SystemSettings.find({ key: { $in: settingsKeys } }).lean() as unknown as { key: string; value: string }[];
        const settingsMap: Record<string, number> = {};
        settings.forEach((setting) => {
            settingsMap[setting.key] = parseFloat(setting.value) || 0;
        });

        // Calculate date range once (same for all students)
        const bdNow = getBDDate();
        const prevMonthYear = bdNow.getMonth() === 0 ? bdNow.getFullYear() - 1 : bdNow.getFullYear();
        const prevMonth = bdNow.getMonth() === 0 ? 11 : bdNow.getMonth() - 1;
        const startOfPrevMonth = new Date(`${prevMonthYear}-${String(prevMonth + 1).padStart(2, '0')}-01T00:00:00+06:00`);
        const lastDayOfPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
        const endOfPrevMonth = new Date(`${prevMonthYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(lastDayOfPrevMonth).padStart(2, '0')}T23:59:59+06:00`);
        const dueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), (settingsMap.payment_due_days || 7));

        const students = await User.find({ userType: "student" }).lean();
        const studentIds = students.map(s => s._id);

        // Batch fetch all data for all students using aggregation
        const [mealStats, guestMealCounts, laundryCounts] = await Promise.all([
            Meal.aggregate([
                {
                    $match: {
                        studentId: { $in: studentIds },
                        date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth }
                    }
                },
                {
                    $group: {
                        _id: "$studentId",
                        breakfastCount: { $sum: { $cond: ["$breakfast", 1, 0] } },
                        lunchCount: { $sum: { $cond: ["$lunch", 1, 0] } },
                        dinnerCount: { $sum: { $cond: ["$dinner", 1, 0] } }
                    }
                }
            ]),
            GuestMeal.aggregate([
                {
                    $match: {
                        studentId: { $in: studentIds },
                        date: { $gte: startOfPrevMonth, $lte: endOfPrevMonth }
                    }
                },
                {
                    $group: {
                        _id: "$studentId",
                        count: { $sum: 1 }
                    }
                }
            ]),
            Laundry.aggregate([
                {
                    $match: {
                        student: { $in: studentIds },
                        createdAt: { $gte: startOfPrevMonth, $lte: endOfPrevMonth }
                    }
                },
                {
                    $group: {
                        _id: "$student",
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        // Create lookup maps for O(1) access
        const mealStatsMap = new Map(mealStats.map(m => [String(m._id), m]));
        const guestMealCountMap = new Map(guestMealCounts.map(g => [String(g._id), g.count]));
        const laundryCountMap = new Map(laundryCounts.map(l => [String(l._id), l.count]));

        const paymentsToInsert = students.flatMap((student) => {
            const studentIdStr = String(student._id);
            const mealStat = mealStatsMap.get(studentIdStr);
            const guestMealCount = guestMealCountMap.get(studentIdStr) || 0;
            const laundryCount = laundryCountMap.get(studentIdStr) || 0;

            const mealCharges = 
                ((mealStat?.breakfastCount || 0) * settingsMap.breakfast_price) +
                ((mealStat?.lunchCount || 0) * settingsMap.lunch_price) +
                ((mealStat?.dinnerCount || 0) * settingsMap.dinner_price) +
                (guestMealCount * settingsMap.guest_meal_price);
            const laundryCharges = laundryCount * settingsMap.laundry_fee;
            const otherCharges = settingsMap.maintenance_fee + settingsMap.wifi_fee;

            const studentIdSlice = String(student._id).slice(-4);
            const monthStr = String(previousMonthDate.getMonth() + 1).padStart(2, '0');

            const paymentRecords = [
                {
                    paymentId: `INV-${billingYear}-${monthStr}-${studentIdSlice}`,
                    student: student._id,
                    type: "hall_fee",
                    amount: settingsMap.monthly_rent || 0,
                    billingMonth,
                    billingYear,
                    dueDate,
                    finalAmount: settingsMap.monthly_rent || 0
                },
                {
                    paymentId: `INV-${billingYear}-${monthStr}-OTHER-${studentIdSlice}`,
                    student: student._id,
                    type: "other",
                    amount: otherCharges,
                    billingMonth,
                    billingYear,
                    dueDate,
                    finalAmount: otherCharges
                }
            ];

            if (mealCharges > 0) {
                paymentRecords.push({
                    paymentId: `INV-${billingYear}-${monthStr}-MEAL-${studentIdSlice}`,
                    student: student._id,
                    type: "mess_fee",
                    amount: mealCharges,
                    billingMonth,
                    billingYear,
                    dueDate,
                    finalAmount: mealCharges
                });
            }

            if (laundryCharges > 0) {
                paymentRecords.push({
                    paymentId: `INV-${billingYear}-${monthStr}-LAUNDRY-${studentIdSlice}`,
                    student: student._id,
                    type: "laundry_fee",
                    amount: laundryCharges,
                    billingMonth,
                    billingYear,
                    dueDate,
                    finalAmount: laundryCharges
                });
            }

            return paymentRecords;
        });

        await Payment.insertMany(paymentsToInsert);
        // console.log(`Billing for ${billingMonth} ${billingYear} processed successfully for ${students.length} students.`);
        return NextResponse.json({ message: "Billing processed successfully" }, { status: 200 });
    }
    catch (error) {
        // console.error("Error in student billing job:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}