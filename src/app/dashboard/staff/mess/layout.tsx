import TopNavigation from "@/components/common/top_navigation";

export default function MealsLayout( { children } : { children: React.ReactNode } ) {

    const nav_items = [
        { name: 'Meal Count', path: '/dashboard/staff/mess/meal_count' },
        { name: 'Weekly Menu', path: '/dashboard/staff/mess/weekly_menu' },
        { name: 'Voting Result', path: '/dashboard/staff/mess/voting_result' },
    ];

    return(
        <div className="px-4 md:px-8 py-4 max-w-full overflow-x-hidden">
            <header className="flex w-full h-16 items-center px-2 md:px-4 font-bold text-lg">Meals</header>
            <TopNavigation navItems={nav_items} />
            {children}
        </div>
    );
}