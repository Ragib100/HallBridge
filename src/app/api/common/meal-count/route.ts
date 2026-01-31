import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import Meal from "@/models/Meal";
import GuestMeal from "@/models/GuestMeal";
import User from "@/models/User";

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

    const now = new Date();
    const baseDate = new Date(now);

    if (day === "tomorrow") {
      baseDate.setDate(now.getDate() + 1);
    }

    baseDate.setHours(0, 0, 0, 0);

    const dayStart = new Date(baseDate);
    const dayEnd = new Date(baseDate);
    dayEnd.setHours(23, 59, 59, 999);

    const [breakfast, lunch, dinner, guestMeals, totalStudents] = await Promise.all([
      Meal.countDocuments({
        date: { $gte: dayStart, $lte: dayEnd },
        breakfast: true,
      }),
      Meal.countDocuments({
        date: { $gte: dayStart, $lte: dayEnd },
        lunch: true,
      }),
      Meal.countDocuments({
        date: { $gte: dayStart, $lte: dayEnd },
        dinner: true,
      }),
      GuestMeal.countDocuments({
        date: { $gte: dayStart, $lte: dayEnd },
      }),
      User.countDocuments({ userType: "student" }),
    ]);

    return NextResponse.json(
      {
        mealCounts: { breakfast, lunch, dinner },
        guestMeals,
        totalStudents,
        date: dayStart,
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
