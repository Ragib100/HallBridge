'use client';

import TomorrowMeals from "@/components/student/tomorrow_meals";
import GuestMeal from "@/components/student/guest_meal";
import { Loading } from "@/components/ui/loading";
import { useState } from "react";

export default function MealSelection() {

    const [loading, setLoading] = useState<boolean>(true);

    if (loading) {
        return (
            <>
                <Loading />
                <div className="hidden">
                    <TomorrowMeals setLoading={setLoading} />
                </div>
            </>
        );
    }
    
    return (
        <div className="space-y-6">
            <TomorrowMeals setLoading={setLoading} />
            <GuestMeal />
        </div>
    );
}