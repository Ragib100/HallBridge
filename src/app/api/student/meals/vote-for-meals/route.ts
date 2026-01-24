import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import VoteMeal from "@/models/VoteMeal";
import Meal from "@/models/Meal";
import mongoose from "mongoose";

function getCurrentDate(): Date {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return today;
}

export async function POST(req: Request) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { searchParams } = new URL(req.url);
        const studentId = searchParams.get("studentId");
        const { day, meal, rating, comments, mealType } = await req.json();

        if (
            !studentId ||
            !day ||
            !meal ||
            typeof rating !== "number" ||
            rating < 0 || rating > 5 ||
            !mealType ||
            !['breakfast', 'lunch', 'dinner'].includes(mealType)
        ) {
            return NextResponse.json(
                { message: "Invalid vote meal data" },
                { status: 400 }
            );
        }

        await connectDB();

        const currentDate = getCurrentDate();

        const voteMeal = new VoteMeal({
            studentId,
            day,
            meal,
            rating,
            comments,
            date: currentDate,
            mealType
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
            { rating_submitted: true },
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

// export async function GET(req: Request) {
//     try {
//         const { searchParams } = new URL(req.url);
//         const studentId = searchParams.get("studentId");
//         const mealType = searchParams.get("mealType");

//         if (!studentId || !mealType || !['breakfast', 'lunch', 'dinner'].includes(mealType)) {
//             return NextResponse.json(
//                 { message: "Invalid parameters" },
//                 { status: 400 }
//             );
//         }

//         await connectDB();

//         const currentDate = getCurrentDate();

//         const existingMeal = await Meal.findOne({ studentId, date: currentDate });

//         if (!existingMeal) {
//             return NextResponse.json(
//                 { message: "Meal record not found" },
//                 { status: 404 }
//             );
//         }

//         const breakfast = existingMeal.breakfast;
//         const lunch = existingMeal.lunch;
//         const dinner = existingMeal.dinner;