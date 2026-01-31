import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import connectDB from "@/lib/db"
import WeeklyMenu from "@/models/WeeklyMeal"
import User from "@/models/User"

const meals = [
    {
        day: "Saturday",
        breakfast: "luchi, dal",
        lunch: "rice, chicken curry, dal",
        dinner: "rice, vegetable curry, egg, dal",
    },
    {
        day: "Sunday",
        breakfast: "khichuri, egg",
        lunch: "rice, fish curry, dal",
        dinner: "polao, chicken roast",
    },
    {
        day: "Monday",
        breakfast: "paratha, vegetable curry",
        lunch: "rice, chicken curry, dal",
        dinner: "rice, fish vorta, egg, dal",
    },
    {
        day: "Tuesday",
        breakfast: "paratha, vegetable curry",
        lunch: "khichuri, beef curry",
        dinner: "rice, vegetable curry, egg, dal",
    },
    {
        day: "Wednesday",
        breakfast: "khichuri, egg",
        lunch: "rice, chicken curry, dal",
        dinner: "polao, egg curry",
    },
    {
        day: "Thursday",
        breakfast: "bread, omelette",
        lunch: "rice, fish curry, dal",
        dinner: "paratha, chicken curry",
    },
    {
        day: "Friday",
        breakfast: "khichuri, egg",
        lunch: "rice, beef curry, dal",
        dinner: "rice, vegetable curry, egg, dal",
    },
];

export async function GET() {
    try {
        await connectDB()

        // Auth check - any authenticated user can view menu
        const cookieStore = await cookies()
        const session = cookieStore.get("hb_session")?.value
        if (!session) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            )
        }

        const user = await User.findById(session)
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            )
        }

        let weeklyMenu = await WeeklyMenu.find().lean()

        if (weeklyMenu.length === 0) {
            const insertedMenus = await WeeklyMenu.insertMany(meals);

            if (!insertedMenus) {
                return NextResponse.json(
                    { message: "Failed to create weekly menu" },
                    { status: 500 }
                )
            }

            weeklyMenu = insertedMenus;
        }

        return NextResponse.json(
            { weeklyMenu },
            { status: 200 }
        )
    }
    catch (error) {
        console.error("Error fetching weekly menu:", error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB()

        // Auth check - only mess_manager or admin can update menu
        const cookieStore = await cookies()
        const session = cookieStore.get("hb_session")?.value
        if (!session) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            )
        }

        const user = await User.findById(session)
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            )
        }

        if (user.role !== "admin" && user.role !== "mess_manager") {
            return NextResponse.json(
                { message: "Only mess manager or admin can update menu" },
                { status: 403 }
            )
        }

        const { day, breakfast, lunch, dinner } = await req.json()

        if (!day) {
            return NextResponse.json(
                { message: "Day is required" },
                { status: 400 }
            )
        }

        const updatedMeal = await WeeklyMenu.findOneAndUpdate(
            { day },
            { breakfast, lunch, dinner },
            { new: true, upsert: true }
        )

        return NextResponse.json(
            { message: "Meal updated successfully", meal: updatedMeal },
            { status: 200 }
        )
    }
    catch (error) {
        console.error("Error updating weekly menu:", error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}

