import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Meal from "@/models/Meal";
import { getCurrentDateBD, getNextDateBD } from "@/lib/dates";

export async function PUT(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const studentId = searchParams.get("studentId");
        const { breakfast, lunch, dinner } = await req.json();

        // console.log("Received data:", { studentId, breakfast, lunch, dinner });

        if (
            !studentId ||
            typeof breakfast !== "boolean" ||
            typeof lunch !== "boolean" ||
            typeof dinner !== "boolean"
        ) {
            return NextResponse.json(
                { message: "Invalid meal selection data" },
                { status: 400 }
            );
        }

        await connectDB();

        const tomorrowDate = getNextDateBD();

        const existingMeal = await Meal.findOne({
            studentId,
            date: tomorrowDate
        });

        if (existingMeal?.isLocked) {
            return NextResponse.json(
                { message: "Meal selection deadline has passed (11:00 PM). You cannot modify tomorrow's meals." },
                { status: 403 }
            );
        }

        const updatedMeal = await Meal.findOneAndUpdate(
            { studentId, date: tomorrowDate },
            {
                studentId,
                date: tomorrowDate,
                breakfast,
                lunch,
                dinner,
                isLocked: false,
                breakfast_rating: null,
                lunch_rating: null,
                dinner_rating: null
            },
            { new: true, upsert: true }
        );

        return NextResponse.json(
            {
                message: "Meal selection updated successfully",
                meal: updatedMeal,
            },
            { status: 201 }
        );
    }
    catch (error) {
        // console.error("Error updating meal selection:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const studentId = searchParams.get("studentId");

        if (!studentId) {
            return NextResponse.json(
                { message: "Student ID is required" },
                { status: 400 }
            );
        }

        await connectDB();

        const tomorrowDate = getNextDateBD();
        // console.log("Tomorrow's Date (UTC):", tomorrowDate);

        const meal = await Meal.findOne({
            studentId,
            date: tomorrowDate
        });

        if (!meal) {

            const currentDate = getCurrentDateBD();
            const todayMeal = await Meal.findOne({
                studentId,
                date: currentDate
            });

            if (!todayMeal) {
                return NextResponse.json(
                    {
                        message: "No meal selection found, returning defaults",
                        meal: {
                            studentId,
                            date: tomorrowDate,
                            breakfast: false,
                            lunch: false,
                            dinner: false,
                            isLocked: false,
                            breakfast_rating: null,
                            lunch_rating: null,
                            dinner_rating: null
                        },
                    },
                    { status: 200 }
                );
            }

            return NextResponse.json(
                {
                    message: "No meal selection found for tomorrow, returning today's selection as default",
                    todayMeal
                },
                { status: 200 }
            )
        }

        return NextResponse.json(
            {
                message: "Meal selection retrieved successfully",
                meal,
            },
            { status: 200 }
        );
    }
    catch (error) {
        // console.error("Error retrieving meal selection:", error);
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}