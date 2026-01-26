"use client"

import VoteForMeal from '@/components/student/vote_for_meal';
import { Card, CardContent } from '@/components/ui/card';
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
        <div className="space-y-6 p-2 md:p-4 max-w-full overflow-x-hidden">
            <h1 className="text-2xl font-bold mb-4">Vote for Today's Meals</h1>
            <p className="text-muted-foreground mb-6">Rate and provide feedback for the meals you&apos;ve had today.</p>
            
            {todaysMeals.map((meal, index) => (
                !meal.isSubmitted && (
                    <VoteForMeal key={index} mealinfo={meal} onSubmit={handleMealSubmitted}/>
                )
            ))}

            {allMealsSubmitted && 
                <Card className="rounded-lg">
                    <CardContent className="text-center">
                        All meals for today have been reviewed. Thank you for your feedback!
                    </CardContent>
                </Card>
            }

        </div>
    );
}