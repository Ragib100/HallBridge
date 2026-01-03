import LayoutComponent from '@/components/common/left_navigation';
import { getIcon } from '@/components/common/icons';

export default function layout({ children }: { children: React.ReactNode }) {
    const staffNavItems = [
        { name: 'Dashboard',default_path:'/dashboard/staff', path: '/dashboard/staff', icon: getIcon('dashboard') },
        { name: 'Mess Management',default_path:'/dashboard/staff/mess', path: '/dashboard/staff/mess', icon: getIcon('meals') },
        { name: 'Maintenance',default_path:'/dashboard/staff/maintenance', path: '/dashboard/staff/maintenance', icon: getIcon('maintenance'), badge: 5 },
        { name: 'Laundry',default_path:'/dashboard/staff/laundry', path: '/dashboard/staff/laundry', icon: getIcon('laundry'), badge: 12 },
        { name: 'Expenses',default_path:'/dashboard/staff/expenses', path: '/dashboard/staff/expenses', icon: getIcon('expenses'), active: true },
        { name: 'Profile',default_path:'/dashboard/staff/profile', path: '/dashboard/staff/profile', icon: getIcon('profile') },
        { name: 'Settings',default_path:'/dashboard/staff/settings', path: '/dashboard/staff/settings', icon: getIcon('settings') },
    ];

    return (
        <div className="flex flex-row">
            <LayoutComponent navItems={staffNavItems}/>
            <div className="flex-l flex-col w-400 h-screen overflow-y-auto">
                {children}
            </div>
        </div>
    )
}