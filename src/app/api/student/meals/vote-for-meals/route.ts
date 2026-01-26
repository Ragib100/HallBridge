import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Meal, { MealDocument} from "@/models/Meal";
import WeeklyMeal, { WeeklyMealDocument } from "@/models/WeeklyMeal";
import VoteMeal from "@/models/VoteMeal";
import mongoose from "mongoose";
import { getCurrentDateBD, getDayFromDateBD } from "@/lib/dates";

export async function POST(req: Request) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { searchParams } = new URL(req.url);
        const studentId = searchParams.get("studentId");
        const {mealTime, rating, comments } = await req.json();

        // console.log({studentId, mealTime, rating, comments});

        if (
            !studentId ||
            typeof rating !== "number" ||
            rating < 0 || rating > 5 ||
            (mealTime !== "breakfast" && mealTime !== "lunch" && mealTime !== "dinner")
        ) {
            return NextResponse.json(
                { message: "Invalid vote meal data" },
                { status: 400 }
            );
        }

        await connectDB();

        const currentDate = getCurrentDateBD();

        const voteMeal = new VoteMeal({
            studentId,
            rating,
            comments,
            date: currentDate,
        });

        const savedVoteMeal = await voteMeal.save({ session });

        if(!savedVoteMeal) {
            await session.abortTransaction();
            return NextResponse.json(
                { message: "Failed to save meal vote" },
                { status: 500 }
            );
        }

        const mealUpdate = await Meal.findOneAndUpdate(
            { studentId, date: currentDate },
            { [`${mealTime}_rating`]: savedVoteMeal._id },
            { session, new: true }
        );

        if(!mealUpdate) {
            await session.abortTransaction();
            return NextResponse.json(
                { message: "Meal record not found" },
                { status: 404 }
            );
        }

        await session.commitTransaction();
        session.endSession();

        return NextResponse.json(
            {
                message: "Meal vote submitted successfully",
                voteMeal: savedVoteMeal,
            },
            { status: 201 }
        );
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error("Error submitting meal vote:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {

    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");

    await connectDB();

    try {
        if (!studentId) {
            return NextResponse.json(
                { message: "Student ID is required" },
                { status: 400 }
            );
        }

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

        // console.log(menu);
        // console.log(meal);

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