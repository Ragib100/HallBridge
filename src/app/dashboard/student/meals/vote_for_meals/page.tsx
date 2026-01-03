'use client';

import { useState } from 'react';
import VoteForMeal from '@/components/student/vote_for_meal';
import { Card, CardContent } from '@/components/ui/card';

interface MealData {
    mealTime: 'breakfast' | 'lunch' | 'dinner';
    menuItems: string[];
    isSubmitted: boolean;
}

export default function VoteForMealsPage() {

    const todaysMeals: MealData[] = [
        {
            mealTime: 'breakfast',
            menuItems: ['Paratha', 'Egg Curry', 'Tea/Coffee', 'Banana'],
            isSubmitted: false,
        },
        {
            mealTime: 'lunch',
            menuItems: ['Rice', 'Dal', 'Chicken Curry', 'Mixed Vegetable', 'Salad'],
            isSubmitted: false,
        },
        {
            mealTime: 'dinner',
            menuItems: ['Roti', 'Fish Curry', 'Aloo Bhaji', 'Dal', 'Sweet Dish'],
            isSubmitted: false,
        },
    ];

    const allMealsSubmitted = todaysMeals.every(meal => meal.isSubmitted);

    return (
        <div className="space-y-6 p-2 md:p-4 max-w-full overflow-x-hidden">
            <h1 className="text-2xl font-bold mb-4">Vote for Today's Meals</h1>
            <p className="text-muted-foreground mb-6">Rate and provide feedback for the meals you&apos;ve had today.</p>
            
            {todaysMeals.map((meal, index) => (
                !meal.isSubmitted && (
                    <VoteForMeal key={index} mealinfo={meal} />
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