import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import SystemSettings from "@/models/SystemSettings"
import Payment from "@/models/Payment"
import User from "@/models/User"
import Meal from "@/models/Meal"
import GuestMeal from "@/models/GuestMeal"
import Laundry from "@/models/Laundry"
import { getBDDate } from "@/lib/dates"

export async function GET() {
    try {
        const currentDate = getBDDate();
        const previousMonthDate = getBDDate();
        previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
        previousMonthDate.setDate(1);
        const billingMonth = previousMonthDate.getMonth() + 2; // Months are 0-indexed
        const billingYear = previousMonthDate.getFullYear();

        await connectDB();
        const existingPayments = await Payment.find({ billingMonth, billingYear }).lean();
        if (existingPayments.length > 0) {
            console.log(`Billing for ${billingMonth} ${billingYear} already exists. Skipping.`);
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

        const students = await User.find({ userType: "student" }).lean();
        let paymentsToInsert = students.map(async (student) => {
            
            // Create proper BD timezone dates for previous month
            const bdNow = getBDDate();
            const prevMonthYear = bdNow.getMonth() === 0 ? bdNow.getFullYear() - 1 : bdNow.getFullYear();
            const prevMonth = bdNow.getMonth() === 0 ? 11 : bdNow.getMonth() - 1;
            
            // Start of previous month in BD timezone (YYYY-MM-01T00:00:00+06:00)
            const startOfPrevMonth = new Date(`${prevMonthYear}-${String(prevMonth + 1).padStart(2, '0')}-01T00:00:00+06:00`);
            
            // End of previous month in BD timezone
            const lastDayOfPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();
            const endOfPrevMonth = new Date(`${prevMonthYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(lastDayOfPrevMonth).padStart(2, '0')}T23:59:59+06:00`);
            
            console.log(`Querying meals for student ${student.email} from ${startOfPrevMonth.toISOString()} to ${endOfPrevMonth.toISOString()}`);
            
            const meals = await Meal.find(
                {
                    studentId: student._id,
                    date: {
                        $gte: startOfPrevMonth,
                        $lte: endOfPrevMonth
                    }
                }
            ).lean();
            const guestMeals = await GuestMeal.find(
                {
                    studentId: student._id,
                    date: {
                        $gte: startOfPrevMonth,
                        $lte: endOfPrevMonth
                    }
                }
            ).lean();
            console.log("Meal length ", meals.length, "Guest meal length ", guestMeals.length);
            const laundryCount = await Laundry.countDocuments(
                {
                    student: student._id,
                    createdAt: {
                        $gte: startOfPrevMonth,
                        $lte: endOfPrevMonth
                    }
                }
            ).lean();
            const latePayments = await Payment.find(
                {
                    student: student._id,
                    status: "pending",
                    dueDate: { $lt: currentDate }
                }
            ).lean();

            const mealCharges = (meals.filter(m => m.breakfast).length * settingsMap.breakfast_price) +
                (meals.filter(m => m.lunch).length * settingsMap.lunch_price) +
                (meals.filter(m => m.dinner).length * settingsMap.dinner_price) + guestMeals.length * settingsMap.guest_meal_price;
            const laundryCharges = laundryCount * settingsMap.laundry_fee;
            const otherCharges = settingsMap.maintenance_fee + settingsMap.wifi_fee;

            const paymentRecords = [
                {
                    paymentId: `INV-${billingYear}-${String(previousMonthDate.getMonth() + 1).padStart(2, '0')}-${String(student._id).slice(-4)}`,
                    student: student._id,
                    type: "hall_fee",
                    amount: (settingsMap.monthly_rent || 0),
                    billingMonth,
                    billingYear,
                    dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), (settingsMap.payment_due_days || 7)),
                    finalAmount: (settingsMap.monthly_rent || 0)
                },
                {
                    paymentId: `INV-${billingYear}-${String(previousMonthDate.getMonth() + 1).padStart(2, '0')}-OTHER-${String(student._id).slice(-4)}`,
                    student: student._id,
                    type: "other",
                    amount: otherCharges,
                    billingMonth,
                    billingYear,
                    dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), (settingsMap.payment_due_days || 7)),
                    finalAmount: otherCharges
                }
            ];

            if (mealCharges > 0) {
                paymentRecords.push({
                    paymentId: `INV-${billingYear}-${String(previousMonthDate.getMonth() + 1).padStart(2, '0')}-MEAL-${String(student._id).slice(-4)}`,
                    student: student._id,
                    type: "mess_fee",
                    amount: mealCharges,
                    billingMonth,
                    billingYear,
                    dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), (settingsMap.payment_due_days || 7)),
                    finalAmount: mealCharges
                });
            }

            if(laundryCharges > 0) {
                paymentRecords.push({
                    paymentId: `INV-${billingYear}-${String(previousMonthDate.getMonth() + 1).padStart(2, '0')}-LAUNDRY-${String(student._id).slice(-4)}`,
                    student: student._id,
                    type: "laundry_fee",
                    amount: laundryCharges,
                    billingMonth,
                    billingYear,
                    dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), (settingsMap.payment_due_days || 7)),
                    finalAmount: laundryCharges
                });
            }

            return paymentRecords;
        });

        await Payment.insertMany((await Promise.all(paymentsToInsert)).flat());
        console.log(`Billing for ${billingMonth} ${billingYear} processed successfully for ${students.length} students.`);
        return NextResponse.json({ message: "Billing processed successfully" }, { status: 200 });
    }
    catch (error) {
        console.error("Error in student billing job:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}