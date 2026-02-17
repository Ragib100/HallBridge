import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Meal, { MealDocument} from "@/models/Meal";
import WeeklyMeal, { WeeklyMealDocument } from "@/models/WeeklyMeal";
import VoteMeal from "@/models/VoteMeal";
import User from "@/models/User";
import mongoose from "mongoose";
import { getCurrentDateBD, getDayFromDateBD } from "@/lib/dates";

export async function POST(req: Request) {
    await connectDB();
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
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
                { message: "Only students can vote for meals" },
                { status: 403 }
            );
        }

        // Use authenticated user's studentId
        const studentId = user._id;
        const {mealTime, rating, comments } = await req.json();

        if (
            typeof rating !== "number" ||
            rating < 1 || rating > 5 ||
            (mealTime !== "breakfast" && mealTime !== "lunch" && mealTime !== "dinner")
        ) {
            return NextResponse.json(
                { message: "Invalid vote meal data" },
                { status: 400 }
            );
        }

        const currentDate = getCurrentDateBD();

        const voteMeal = new VoteMeal({
            studentId,
            rating,
            comments,
            date: currentDate,
        });

        const savedVoteMeal = await voteMeal.save({ session: dbSession });

        if(!savedVoteMeal) {
            await dbSession.abortTransaction();
            dbSession.endSession();
            return NextResponse.json(
                { message: "Failed to save meal vote" },
                { status: 500 }
            );
        }

        const mealUpdate = await Meal.findOneAndUpdate(
            { studentId, date: currentDate },
            { [`${mealTime}_rating`]: savedVoteMeal._id },
            { session: dbSession, new: true }
        );

        if(!mealUpdate) {
            await dbSession.abortTransaction();
            dbSession.endSession();
            return NextResponse.json(
                { message: "Meal record not found" },
                { status: 404 }
            );
        }

        await dbSession.commitTransaction();
        dbSession.endSession();

        return NextResponse.json(
            {
                message: "Meal vote submitted successfully",
                voteMeal: savedVoteMeal,
            },
            { status: 201 }
        );
    }
    catch (error) {
        await dbSession.abortTransaction();
        dbSession.endSession();

        console.error("Error submitting meal vote:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
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
                { message: "Only students can access voting" },
                { status: 403 }
            );
        }

        // Use authenticated user's studentId
        const studentId = user._id;

        const currentDate = getCurrentDateBD();
        const meal = await Meal.findOne({ studentId, date: currentDate }).lean<MealDocument>();

        if (!meal) {
            return NextResponse.json(
                { message: "Meal record not found for today" },
                { status: 404 }
            );
        }

        const currentDay = getDayFromDateBD(currentDate);

        const menu = await WeeklyMeal.findOne({ day: currentDay }).lean<WeeklyMealDocument>();

        if (!menu) {
            return NextResponse.json(
                { message: `${currentDay} Menu not found for today` },
                { status: 404 }
            );
        }

        const mealsForToday = [];

        if (meal.breakfast_rating==null && meal.breakfast) {
            mealsForToday.push({
                mealTime: 'breakfast',
                menuItems: menu.breakfast.split(',').map(item => item.trim()),
                isSubmitted: false
            });
        }

        if (meal.lunch_rating==null && meal.lunch) {
            mealsForToday.push({
                mealTime: 'lunch',
                menuItems: menu.lunch.split(',').map(item => item.trim()),
                isSubmitted: false
            });
        }

        if (meal.dinner_rating==null && meal.dinner) {
            mealsForToday.push({
                mealTime: 'dinner',
                menuItems: menu.dinner.split(',').map(item => item.trim()),
                isSubmitted: false
            });
        }

        return NextResponse.json(
            { mealsForToday },
            { status: 200 }
        );
    }
    catch (error) {
        console.error("Error fetching meal info for voting:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}