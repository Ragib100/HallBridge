import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import WeeklyMenu from "@/models/WeeklyMeal"

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

export async function GET(req: Request) {
    try {

        await connectDB()

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

