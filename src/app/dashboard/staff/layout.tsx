import LayoutComponent from '@/components/common/left_navigation';
import { getIcon } from '@/components/common/icons';

export default function layout({ children }: { children: React.ReactNode }) {
    const staffNavItems = [
        { name: 'Dashboard', default_path: '/dashboard/staff', path: '/dashboard/staff', icon: getIcon('dashboard') },
        { name: 'Mess Management', default_path: '/dashboard/staff/mess', path: '/dashboard/staff/mess', icon: getIcon('meals') },
        { name: 'Maintenance', default_path: '/dashboard/staff/maintenance', path: '/dashboard/staff/maintenance', icon: getIcon('maintenance') },
        { name: 'Laundry', default_path: '/dashboard/staff/laundry', path: '/dashboard/staff/laundry', icon: getIcon('laundry') },
        { name: 'Expenses', default_path: '/dashboard/staff/expenses', path: '/dashboard/staff/expenses', icon: getIcon('expenses') },
    ];

    return (
        <div className="flex flex-row">
            <LayoutComponent navItems={staffNavItems}/>
            <div className="flex-1 flex-col h-screen overflow-y-auto">
                {children}
            </div>
        </div>
    )
}