'use client';

import TopNavigation from "@/components/common/top_navigation";

export default function MealsLayout( { children } : { children: React.ReactNode } ) {

    const nav_items = [
        { name: 'Current Dues', path: '/dashboard/student/billing/current_dues' },
        { name: 'Invoices', path: '/dashboard/student/billing/invoices' },
    ];

    return(
        <div className="px-8 py-4">
            <header className="flex w-auto h-16 items-center px-4 font-bold text-lg">Billings</header>
            <TopNavigation navItems={nav_items} />
            {children}
        </div>
    );
}