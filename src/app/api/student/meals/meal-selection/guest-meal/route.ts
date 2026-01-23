import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import GuestMeal from "@/models/GuestMeal";

export async function POST(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const studentId = searchParams.get("studentId");
        const { name, id, department, phone, breakfast, lunch, dinner } = await req.json();

        if (
            !studentId || !name || !id || !department || !phone ||
            typeof breakfast !== "boolean" ||
            typeof lunch !== "boolean" ||
            typeof dinner !== "boolean"
        ) {
            return NextResponse.json(
                { message: "Invalid guest meal data" },
                { status: 400 }
            );
        }

        await connectDB();

        const newGuestMeal = new GuestMeal({
            studentId,
            name,
            id,
            department,
            phone,
            breakfast,
            lunch,
            dinner
        });

        await newGuestMeal.save();

        return NextResponse.json(
            {
                message: "Guest meal selection saved successfully",
                guestMeal: newGuestMeal,
            },
            { status: 201 }
        );
    }
    catch (error) {
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}