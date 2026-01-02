'use client';

import TopNavigation from "@/components/common/top_navigation";

export default function MealsLayout( { children } : { children: React.ReactNode } ) {

    const nav_items = [
        { name: 'Meal Selection', path: '/dashboard/student/meals/meal_selection' },
        { name: 'Weekly Menu', path: '/dashboard/student/meals/weekly_menu' },
        { name: 'Vote for Meals', path: '/dashboard/student/meals/vote_for_meals' },
    ];

    return(
        <div className="px-8 py-4">
            <header className="flex w-auto h-16 items-center px-4 font-bold text-lg">Meals</header>
            <TopNavigation navItems={nav_items} />
            {children}
        </div>
    );
}