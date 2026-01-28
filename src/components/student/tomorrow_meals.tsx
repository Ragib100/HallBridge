'use client'

import Toggle from "@/components/student/toggle_button";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { MealDocument } from "@/models/Meal";

export default function TomorrowMeals() {
    const { user } = useCurrentUser();
    const [breakfast, setBreakfast] = useState<boolean>(false);
    const [lunch, setLunch] = useState<boolean>(false);
    const [dinner, setDinner] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    useEffect(() => {
        const fetchMeal = async () => {
            if (!user?.id) return;

            try {
                const url = `/api/student/meals/meal-selection/tomorrow-meal?studentId=${user.id}`;

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error fetching meal selection:', errorData?.message || 'Unknown error');
                    return;
                }

                const data = await response.json() as { meal?: MealDocument };

                if (!data.meal) {
                    console.warn("No meal selection found for this student yet. Initializing defaults.");
                    setBreakfast(false);
                    setLunch(false);
                    setDinner(false);
                } else {
                    setBreakfast(data.meal.breakfast);
                    setLunch(data.meal.lunch);
                    setDinner(data.meal.dinner);
                }
            }
            catch (error) {
                console.error('Error fetching meal selection:', error);
            }
        };

        fetchMeal();
    }, [user?.id]);

    const handleSave = async () => {
        setIsSaving(true);

        if (!user?.id) {
            console.error('No user logged in');
            setIsSaving(false);
            return;
        }

        try {
            const url = `/api/student/meals/meal-selection/tomorrow-meal?studentId=${user.id}`;
            
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    breakfast: breakfast,
                    lunch: lunch,
                    dinner: dinner
                })
            });

            if (!response.ok) {
                const data = await response.json() as { message?: string };
                console.error('Error saving meal selection:', data?.message || 'Unknown error');
                return;
            }

            console.log('Saved meal successfully');
        } catch (error) {
            console.error('Error saving:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-lg font-bold text-gray-800">Tomorrow&apos;s Meals</h2>
            </div>
            
            <div className="space-y-4 mb-6">
                <Toggle value={breakfast} onChange={setBreakfast} mealtype="Breakfast" />
                <Toggle value={lunch} onChange={setLunch} mealtype="Lunch" />
                <Toggle value={dinner} onChange={setDinner} mealtype="Dinner" />
            </div>

            <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full h-11 bg-[#2D6A4F] hover:bg-[#245a42] text-white font-medium cursor-pointer"
            >
                {isSaving ? (
                    <>
                        <Spinner className="mr-2" />
                        Saving...
                    </>
                ) : (
                    <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                    </span>
                )}
            </Button>
        </div>
    );
}