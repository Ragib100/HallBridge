'use client';

import TopNavigation from "@/components/common/top_navigation";

export default function MaintenanceLayout( { children } : { children: React.ReactNode } ) {

    const nav_items = [
        { name: 'New Request', path: '/dashboard/student/maintenance/new_request' },
        { name: 'My Requests', path: '/dashboard/student/maintenance/my_requests' },
        { name: 'FAQ', path: '/dashboard/student/maintenance/faq' },
    ];

    return(
        <div className="px-4 md:px-8 py-4 max-w-full overflow-x-hidden">
            <header className="flex w-full h-16 items-center px-2 md:px-4 font-bold text-lg">Maintenance</header>
            <TopNavigation navItems={nav_items} />
            {children}
        </div>
    );
}