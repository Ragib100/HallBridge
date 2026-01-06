import TopNavigation from "@/components/common/top_navigation";

export default function MealsLayout( { children } : { children: React.ReactNode } ) {

    const nav_items = [
        { name: 'Current Dues', path: '/dashboard/student/billing/current_dues' },
        { name: 'Invoices', path: '/dashboard/student/billing/invoices' },
    ];

    return(
        <div className="px-4 md:px-8 py-4 max-w-full overflow-x-hidden">
            {/* <header className="flex w-full h-16 items-center px-2 md:px-4 font-bold text-lg">Billings</header> */}
            <TopNavigation navItems={nav_items} />
            {children}
        </div>
    );
}