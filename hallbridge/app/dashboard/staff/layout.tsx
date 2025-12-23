import LayoutComponent from '@/components/layout_component';
import { getIcon } from '@/components/icons';

export default function layout({ children }: { children: React.ReactNode }) {
    // Example usage in a layout or page:
    const studentNavItems = [
        { name: 'Home', path: '/dashboard/staff', icon: getIcon('dashboard') },
        { name: 'Mess', path: '/dashboard/staff/mess', icon: getIcon('meals') },
    ];

    return (
        <div className="flex flex-row">
            <LayoutComponent navItems={studentNavItems} />
            {children}
        </div>
    )
}