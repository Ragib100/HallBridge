'use client';

import TopNavigation from "@/components/common/top_navigation";
import { StaffRoleGuard } from "@/components/staff/role-guard";

export default function MealsLayout( { children } : { children: React.ReactNode } ) {

    const nav_items = [
        { name: 'Meal Count', path: '/dashboard/staff/mess/meal_count' },
        { name: 'Weekly Menu', path: '/dashboard/staff/mess/weekly_menu' },
        { name: 'Voting Result', path: '/dashboard/staff/mess/voting_result' },
    ];

    return(
        <StaffRoleGuard allowedRoles={['mess_manager']}>
            <div className="px-4 md:px-8 py-4 max-w-full overflow-x-hidden">
                <TopNavigation navItems={nav_items} />
                {children}
            </div>
        </StaffRoleGuard>
    );
}