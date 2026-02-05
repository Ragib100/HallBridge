import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Meal from "@/models/Meal";
import User from "@/models/User";
import { getCurrentDateBD, getNextDateBD } from "@/lib/dates";

export async function PUT(req: Request) {
    try {
        await connectDB();

        // Auth check
        const cookieStore = await cookies();
        const session = cookieStore.get("hb_session")?.value;
        if (!session) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            );
        }

        const user = await User.findById(session);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        if (user.userType !== "student") {
            return NextResponse.json(
                { message: "Only students can update meal selection" },
                { status: 403 }
            );
        }

        // Use authenticated user's studentId instead of query param
        const studentId = user._id;
        const { breakfast, lunch, dinner } = await req.json();

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

export async function GET() {
    try {
        await connectDB();

        // Auth check
        const cookieStore = await cookies();
        const session = cookieStore.get("hb_session")?.value;
        if (!session) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            );
        }

        const user = await User.findById(session);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        if (user.userType !== "student") {
            return NextResponse.json(
                { message: "Only students can access meal selection" },
                { status: 403 }
            );
        }

        const studentId = user._id;

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
                const todayDefaultMeal = new Meal({
                    studentId,
                    date: tomorrowDate,
                    breakfast: false,
                    lunch: false,
                    dinner: false,
                    isLocked: false,
                    breakfast_rating: null,
                    lunch_rating: null,
                    dinner_rating: null
                });
                await todayDefaultMeal.save();

                return NextResponse.json(
                    {
                        message: "No meal selection found for tomorrow or today, returning default selection for tomorrow",
                        meal: todayDefaultMeal
                    },
                    { status: 200 }
                )
            }

            const newMeal = new Meal({
                studentId,
                date: tomorrowDate,
                breakfast: todayMeal.breakfast,
                lunch: todayMeal.lunch,
                dinner: todayMeal.dinner,
                isLocked: false,
                breakfast_rating: null,
                lunch_rating: null,
                dinner_rating: null
            });
            await newMeal.save();

            return NextResponse.json(
                {
                    message: "No meal selection found for tomorrow, returning today's selection as default",
                    meal: newMeal
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