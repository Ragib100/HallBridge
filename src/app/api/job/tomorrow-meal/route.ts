import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import User from "@/models/User";
import Meal from "@/models/Meal";
import connectDB from "@/lib/db";
import { getPreviousDateBD, getCurrentDateBD } from "@/lib/dates";

export async function GET(req: NextRequest) {
    try {
        
        const authHeader = req.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        const isCron = authHeader === `Bearer ${cronSecret}`;

        const cookieStore = await cookies();
        const session = cookieStore.get("hb_session")?.value;

        if (!isCron && !session) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            );
        }

        await connectDB();

        if (session) {
            const user = await User.findById(session).select("staffRole");

            if (!user || user.staffRole !== "mess_manager") {
                return NextResponse.json(
                    { message: "Only mess manager can trigger this job" },
                    { status: 403 }
                );
            }
        }

        const previousDate = getPreviousDateBD();
        const today = getCurrentDateBD();

        const previousMeals = await Meal.find({
            date: previousDate,
            $or: [
                { breakfast: true },
                { lunch: true },
                { dinner: true }
            ]
        }).select("studentId breakfast lunch dinner");

        if (previousMeals.length === 0) {
            return NextResponse.json(
                { message: "No previous meals found to process" },
                { status: 200 }
            );
        }

        const operations = previousMeals.map((meal) => ({
            updateOne: {
                filter: {
                    studentId: meal.studentId,
                    date: today
                },
                update: {
                    $setOnInsert: {
                        studentId: meal.studentId,
                        date: today,
                        breakfast: meal.breakfast,
                        lunch: meal.lunch,
                        dinner: meal.dinner
                    }
                },
                upsert: true
            }
        }));

        const result = await Meal.bulkWrite(operations, {
            ordered: false // continue even if some fail
        });

        return NextResponse.json(
            {
                message: "Today's meals processed successfully",
                stats: {
                    totalPreviousMeals: previousMeals.length,
                    inserted: result.upsertedCount,
                    matchedExisting: result.matchedCount
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in meal cron job:", error);

        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}