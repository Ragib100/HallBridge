import TopNavigation from "@/components/common/top_navigation";

export default function MealsLayout( { children } : { children: React.ReactNode } ) {

    const nav_items = [
        { name: 'Current Dues', path: '/dashboard/student/billing/current_dues' },
        { name: 'Invoices', path: '/dashboard/student/billing/invoices' },
    ];

    return(
        <div className="px-4 md:px-8 py-4 max-w-full overflow-x-hidden">
            <TopNavigation navItems={nav_items} />
            <div className="mt-4">
                {children}
            </div>
        </div>
    );
}