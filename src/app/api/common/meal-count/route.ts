import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Meal from "@/models/Meal";
import GuestMeal from "@/models/GuestMeal";
import User from "@/models/User";
import { getCurrentDateBD, getNextDateBD } from "@/lib/dates";

export async function GET(request: Request) {
  try {
    await connectDB();

    // Auth check - staff or admin only
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

    // Only allow staff (mess_manager) or admin
    if (user.userType !== "admin" && !(user.userType === "staff" && user.staffRole === "mess_manager")) {
      return NextResponse.json(
        { message: "Forbidden - Mess manager or admin access only" },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const day = url.searchParams.get("day");

    // Get the appropriate date string in BD timezone
    const dateString = day === "tomorrow" ? getNextDateBD() : getCurrentDateBD();
    
    console.log(`Fetching meal counts for date: ${dateString}`);

    const [breakfast, lunch, dinner] = await Promise.all([
      Meal.countDocuments({
        date: dateString,
        breakfast: true,
      }),
      Meal.countDocuments({
        date: dateString,
        lunch: true,
      }),
      Meal.countDocuments({
        date: dateString,
        dinner: true,
      })
    ]);

    const [guestBreakfast, guestLunch, guestDinner] = await Promise.all([
      GuestMeal.countDocuments({
        date: dateString,
        breakfast: true,
      }),
      GuestMeal.countDocuments({
        date: dateString,
        lunch: true,
      }),
      GuestMeal.countDocuments({
        date: dateString,
        dinner: true,
      }),
    ]);

    return NextResponse.json(
      {
        mealCounts: { breakfast, lunch, dinner },
        guestMeals: { guestBreakfast, guestLunch, guestDinner },
        date: dateString,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching meal counts:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
