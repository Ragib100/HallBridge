import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import GuestMeal from "@/models/GuestMeal";
import User from "@/models/User";
import { getNextDateBD } from "@/lib/dates";

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

        if (user.role !== "student") {
            return NextResponse.json(
                { message: "Only students can add guest meals" },
                { status: 403 }
            );
        }

        // Use authenticated user's studentId
        const studentId = user.studentId;
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