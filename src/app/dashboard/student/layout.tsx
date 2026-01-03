import LayoutComponent from '@/components/layout/sidebar';
import { getIcon } from '@/components/ui/icons';

export default function layout({ children }: { children: React.ReactNode }) {
    // Example usage in a layout or page:
    const studentNavItems = [
        { name: 'Home', path: '/dashboard/student', icon: getIcon('dashboard') },
        { name: 'Meals', path: '/dashboard/student/meals', icon: getIcon('meals') },
        { name: 'Billing', path: '/dashboard/student/billing', icon: getIcon('money') },
        { name: 'Gate Pass', path: '/dashboard/student/gate-pass', icon: getIcon('gatePass') },
        { name: 'Maintenance', path: '/dashboard/student/maintenance', icon: getIcon('maintenance') },
        { name: 'Laundry', path: '/dashboard/student/laundry', icon: getIcon('laundry') },
    ];

    return (
        <div className="flex flex-row">
            <LayoutComponent navItems={studentNavItems}/>
            <div className="flex-l flex-col w-400 h-screen overflow-y-auto">
                {children}
            </div>
        </div>
    )
}