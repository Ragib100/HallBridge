import TopNavigation from "@/components/common/top_navigation";

export default function MealsLayout( { children } : { children: React.ReactNode } ) {

    const nav_items = [
        { name: 'Current Dues', path: '/dashboard/student/billing/current_dues' },
        { name: 'Invoices', path: '/dashboard/student/billing/invoices' },
    ];

    return(
        <div className="w-full">
            <TopNavigation navItems={nav_items} />
            <div className="mt-4">
                {children}
            </div>
        </div>
    );
}