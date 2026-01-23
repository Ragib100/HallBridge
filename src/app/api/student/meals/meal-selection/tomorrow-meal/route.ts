import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Meal from "@/models/Meal";

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

        const updatedMeal = await Meal.findOneAndUpdate(
            { studentId },
            { breakfast, lunch, dinner },
            { new: true, upsert: true }
        );

        return NextResponse.json(
            {
                message: "Meal selection updated successfully",
                meal: updatedMeal,
            },
            { status: 200 }
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

        const meal = await Meal.findOne({ studentId });

        if (!meal) {
            return NextResponse.json(
                { message: "No meal selection found for the student" },
                { status: 404 }
            );
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