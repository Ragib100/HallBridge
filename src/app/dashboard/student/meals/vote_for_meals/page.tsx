"use client"

import VoteForMeal from '@/components/student/vote_for_meal';
import { useState, useEffect } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';

interface MealData {
    mealTime: 'breakfast' | 'lunch' | 'dinner';
    menuItems: string[];
    isSubmitted: boolean;
}

export default function VoteForMealsPage() {

    const [todaysMeals, setTodaysMeals] = useState<MealData[]>([]);
    const { user } = useCurrentUser();

    useEffect(() => {
        const mealInfo = async () => {
            if(!user) return;
            const url = `/api/student/meals/vote-for-meals?studentId=${user.id}`;
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.log("Error fetching today's meal info:", errorData?.message || "Unknown error");
                    return;
                }

                const data = await response.json();
                setTodaysMeals(data.mealsForToday);
            }
            catch (error) {
                console.error("Error fetching today's meal info:", error);
            }
        }

        mealInfo();
    },[user]);

    const handleMealSubmitted = (mealTime: 'breakfast' | 'lunch' | 'dinner') => {
        setTodaysMeals(prev =>
            prev.map(meal =>
                meal.mealTime === mealTime ? { ...meal, isSubmitted: true } : meal
            )
        );
    }

    const allMealsSubmitted = todaysMeals.every(meal => meal.isSubmitted);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Vote for Today&apos;s Meals
                </h1>
                <p className="text-gray-500 mt-1">Rate and provide feedback for the meals you&apos;ve had today</p>
            </div>
            
            {todaysMeals.map((meal, index) => (
                !meal.isSubmitted && (
                    <VoteForMeal key={index} mealinfo={meal} onSubmit={handleMealSubmitted}/>
                )
            ))}

            {allMealsSubmitted && 
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">All Reviewed!</h3>
                    <p className="text-gray-500">All meals for today have been reviewed. Thank you for your feedback!</p>
                </div>
            }
        </div>
    );
}