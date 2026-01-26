'use client'

import Toggle from "@/components/student/toggle_button";
import { getIcon } from "../common/icons";
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

            // console.log("User ID:", user.id);

            try {
                const url = `/api/student/meals/meal-selection/tomorrow-meal?studentId=${user.id}`;
                // console.log('Fetching meal selection from:', url);

                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })

                // console.log('Response status:', response.status);

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

            // const data = await response.json() as { meal: MealDocument };
            console.log('Saved meal successfully');
        } catch (error) {
            console.error('Error saving:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex bg-white m-5 flex-col px-4 py-8 rounded-lg shadow-md justify-between">
            <div className="font-bold text-lg">
                {getIcon("meals")} Tomorrow's Meals
            </div>
            <div>
                <Toggle value={breakfast} onChange={setBreakfast} mealtype="Breakfast" />
                <Toggle value={lunch} onChange={setLunch} mealtype="Lunch" />
                <Toggle value={dinner} onChange={setDinner} mealtype="Dinner" />
            </div>

            <div className="flex items-end justify-end mt-4">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex w-[50%] h-full border border-blue-800 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer rounded-lg"
                >
                    {isSaving ? (
                        <>
                            <Spinner />
                            Saving...
                        </>
                    ) : (
                        'Save'
                    )}
                </Button>
            </div>
        </div>
    );
}