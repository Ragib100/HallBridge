import TopNavigation from "@/components/common/top_navigation";

export default function MealsLayout( { children } : { children: React.ReactNode } ) {

    const nav_items = [
        { name: 'Meal Selection', path: '/dashboard/student/meals/meal_selection' },
        { name: 'Weekly Menu', path: '/dashboard/student/meals/weekly_menu' },
        { name: 'Vote for Meals', path: '/dashboard/student/meals/vote_for_meals' },
    ];

    return(
        <div className="px-4 md:px-8 py-4 max-w-full overflow-x-hidden">
            <TopNavigation navItems={nav_items} />
            {children}
        </div>
    );
}