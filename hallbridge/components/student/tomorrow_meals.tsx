'use client'

import Toggle from "@/components/student/toggle_button";
import { getIcon } from "../common/icons";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function TomorrowMeals() {
    const [breakfast, setBreakfast] = useState<boolean>(false);
    const [lunch, setLunch] = useState<boolean>(false);
    const [dinner, setDinner] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    
    useEffect(() => {
        // console.log({breakfast, lunch, dinner});
    }, [breakfast, lunch, dinner]);
    
    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Simulate API call - replace with your actual save logic
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Saved:', { breakfast, lunch, dinner });
            // Add your save logic here
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
                <Toggle value={breakfast} onChange={setBreakfast} mealtype="Breakfast"/>
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
                            <Spinner/>
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