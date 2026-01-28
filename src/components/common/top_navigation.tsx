'use client';

import { usePathname, useRouter } from 'next/navigation'

interface NavItem {
    name: string
    path: string
}

interface TopNavigationProps {
    navItems: NavItem[]
}

export default function TopNavigation({ navItems }: TopNavigationProps) {
    const currentPage = usePathname();
    const router = useRouter();

    const isActive = (path: string) => currentPage.startsWith(path);

    return (
        <div className="mb-6">
            <div className="flex gap-2 flex-wrap">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => router.push(item.path)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive(item.path)
                                ? "bg-[#2D6A4F] text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        {item.name}
                    </button>
                ))}
            </div>
        </div>
    )
}