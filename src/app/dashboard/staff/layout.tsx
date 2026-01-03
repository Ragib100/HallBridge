import LayoutComponent from '@/components/layout/sidebar';
import { getIcon } from '@/components/ui/icons';

export default function layout({ children }: { children: React.ReactNode }) {
    const staffNavItems = [
        { name: 'Staff Member', path: '/dashboard/staff', icon: getIcon('staff'), subtitle: 'Operations', active: true },
        { name: 'Dashboard', path: '/dashboard/staff', icon: getIcon('dashboard') },
        { name: 'Mess Management', path: '/dashboard/staff/mess', icon: getIcon('meals') },
        { name: 'Maintenance', path: '/dashboard/staff/maintenance', icon: getIcon('maintenance'), badge: 5 },
        { name: 'Laundry', path: '/dashboard/staff/laundry', icon: getIcon('laundry'), badge: 12 },
        { name: 'Expenses', path: '/dashboard/staff/expenses', icon: getIcon('expenses'), active: true },
        { name: 'Profile', path: '/dashboard/staff/profile', icon: getIcon('profile') },
        { name: 'Settings', path: '/dashboard/staff/settings', icon: getIcon('settings') },
    ];

    return (
        <div className="flex flex-row">
            <LayoutComponent navItems={staffNavItems} title="Operations Staff" />
            {children}
        </div>
    )
}