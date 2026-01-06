'use client';

import { usePathname, useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

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

    const activeValue = navItems.find(item => currentPage.startsWith(item.path))?.path || navItems[0]?.path;

    const handleTabChange = (value: string) => {
        router.push(value);
    };

    return (
        <div className="py-4 px-4">
            <Tabs value={activeValue} onValueChange={handleTabChange} className="w-full">
                <TabsList className="h-auto w-full justify-start">
                    {navItems.map((item) => (
                        <TabsTrigger
                            key={item.path}
                            value={item.path}
                            className="rounded-none py-4 font-bold cursor-pointer data-[state=active]:bg-blue-500 data-[state=active]:border data-[state=active]:border-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 ease-in-out hover:bg-gray-100"
                        >
                            {item.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    )
}