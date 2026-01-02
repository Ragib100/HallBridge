import LayoutComponent from '@/components/common/left_navigation';
import { getIcon } from '@/components/common/icons';

export default function layout({ children }: { children: React.ReactNode }) {
    // Example usage in a layout or page:
    const studentNavItems = [
        { name: 'Home', default_path: '/dashboard/student/home', path: '/dashboard/student/home', icon: getIcon('dashboard') },
        { name: 'Meals', default_path: '/dashboard/student/meals', path: '/dashboard/student/meals/meal_selection', icon: getIcon('meals') },
        { name: 'Billing', default_path: '/dashboard/student/billing', path: '/dashboard/student/billing/current_dues', icon: getIcon('money') },
        { name: 'Gate Pass', default_path: '/dashboard/student/gate-pass', path: '/dashboard/student/gate-pass', icon: getIcon('gatePass') },
        { name: 'Maintenance', default_path: '/dashboard/student/maintenance', path: '/dashboard/student/maintenance/new_request', icon: getIcon('maintenance') },
        { name: 'Laundry', default_path: '/dashboard/student/laundry', path: '/dashboard/student/laundry', icon: getIcon('laundry') },
    ];

    return (
        <div className="flex flex-row">
            <LayoutComponent navItems={studentNavItems}/>
            <div className="flex flex-col w-full h-screen overflow-y-auto overflow-x-hidden">
                {children}
            </div>
        </div>
    )
}