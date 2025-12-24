'use client'

import Toggle from "@/components/toggle_button";
import { getIcon } from "../icons";
import { useState, useEffect } from "react";

export default function TomorrowMeals() {
    const [breakfast, setBreakfast] = useState<boolean>(false);
    const [lunch, setLunch] = useState<boolean>(false);
    const [dinner, setDinner] = useState<boolean>(false);
    
    useEffect(() => {
        console.log({breakfast, lunch, dinner});
    }, [breakfast, lunch, dinner]);
    
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
        </div>
    );
}