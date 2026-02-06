import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import connectDB from "@/lib/db"
import VoteMeal from "@/models/VoteMeal"
import User from "@/models/User"
import Meal from "@/models/Meal"
import { getCurrentDateBD } from "@/lib/dates"

export async function GET(req: Request) {
    try {
        await connectDB()

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

        // Only allow staff members or admin
        const staffRoles = ["mess_manager", "maintenance_staff", "financial_staff", "security_guard"];
        if (user.userType !== "admin" && !(user.userType === "staff" && staffRoles.includes(user.staffRole))) {
            return NextResponse.json(
                { message: "Forbidden - Staff access only" },
                { status: 403 }
            );
        }

        const todayDateString = getCurrentDateBD();

        // Fetch meals with non-null ratings for today
        const breakfastMeals = await Meal.find({ 
            date: todayDateString, 
            breakfast_rating: { $ne: null } 
        }).select("breakfast_rating").lean();
        
        const lunchMeals = await Meal.find({ 
            date: todayDateString, 
            lunch_rating: { $ne: null } 
        }).select("lunch_rating").lean();
        
        const dinnerMeals = await Meal.find({ 
            date: todayDateString, 
            dinner_rating: { $ne: null } 
        }).select("dinner_rating").lean();

        // Extract ObjectIDs from the meal documents
        const breakfastVoteIds = breakfastMeals
            .map(meal => meal.breakfast_rating)
            .filter(id => id); // Filter out any null/undefined values
        
        const lunchVoteIds = lunchMeals
            .map(meal => meal.lunch_rating)
            .filter(id => id);
        
        const dinnerVoteIds = dinnerMeals
            .map(meal => meal.dinner_rating)
            .filter(id => id);

        // Fetch the actual vote data from VoteMeal collection
        const breakfastVotes = await VoteMeal.find({ 
            _id: { $in: breakfastVoteIds } 
        }).select("rating comments").lean();
        
        const lunchVotes = await VoteMeal.find({ 
            _id: { $in: lunchVoteIds } 
        }).select("rating comments").lean();
        
        const dinnerVotes = await VoteMeal.find({ 
            _id: { $in: dinnerVoteIds } 
        }).select("rating comments").lean();

        // Calculate statistics
        const calculateStats = (votes: any[]) => {
            if (votes.length === 0) {
                return {
                    totalVotes: 0,
                    averageRating: 0,
                    votes: []
                };
            }
            
            const totalRating = votes.reduce((sum, vote) => sum + vote.rating, 0);
            const averageRating = totalRating / votes.length;
            
            return {
                totalVotes: votes.length,
                averageRating: parseFloat(averageRating.toFixed(2)),
                votes: votes.map(vote => ({
                    rating: vote.rating,
                    comments: vote.comments
                }))
            };
        };

        const breakfastStats = calculateStats(breakfastVotes);
        const lunchStats = calculateStats(lunchVotes);
        const dinnerStats = calculateStats(dinnerVotes);

        // Format response for frontend
        const mealRatings = [
            {
                mealTime: "Breakfast",
                icon: "🌅",
                avgRating: breakfastStats.averageRating,
                totalReviews: breakfastStats.totalVotes,
                votes: breakfastStats.votes
            },
            {
                mealTime: "Lunch",
                icon: "☀️",
                avgRating: lunchStats.averageRating,
                totalReviews: lunchStats.totalVotes,
                votes: lunchStats.votes
            },
            {
                mealTime: "Dinner",
                icon: "🌙",
                avgRating: dinnerStats.averageRating,
                totalReviews: dinnerStats.totalVotes,
                votes: dinnerStats.votes
            }
        ].filter(meal => meal.totalReviews > 0); // Only include meals with votes

        const results = {
            date: todayDateString,
            mealRatings,
            totalReviews: breakfastStats.totalVotes + lunchStats.totalVotes + dinnerStats.totalVotes
        };

        return NextResponse.json(results, { status: 200 });

    }
    catch (error) {
        console.error("Error fetching voting results:", error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
