import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import GuestMeal from "@/models/GuestMeal";
import { getNextDateBD } from "@/lib/dates";

export async function PUT(req: Request) {
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

        const tomorrowDate = getNextDateBD();

        if (breakfast || lunch || dinner) {
            const guestMeal = new GuestMeal({
                studentId,
                name,
                id,
                department,
                phone,
                date: tomorrowDate,
                breakfast,
                lunch,
                dinner
            });

            const savedGuestMeal = await GuestMeal.findOneAndReplace(
                { studentId, date: tomorrowDate, id },guestMeal,
                { new: true, upsert: true }
            );

            return NextResponse.json(
                {
                    message: "Guest meal selection saved successfully",
                    guestMeal: savedGuestMeal,
                },
                { status: 201 }
            );
        }

        await GuestMeal.findOneAndDelete({ studentId, date: tomorrowDate, id, department });

        return NextResponse.json(
            { message: "Guest meal selection deleted successfully" },
            { status: 200 }
        );

    }
    catch (error) {
        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}