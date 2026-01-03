'use client'

import Logo from '@/components/common/logo'
import Link from 'next/link'
import { getIcon } from '@/components/common/icons'
import { usePathname } from 'next/navigation'

interface NavItem {
    name: string
    default_path: string
    path: string
    icon?: React.ReactNode
}

interface LayoutComponentProps {
    navItems: NavItem[]
}


export default function LayoutComponent({ navItems }: LayoutComponentProps){

    const pathname = usePathname();

    const isActive = (item: NavItem) => {
        return pathname.startsWith(item.default_path);
    };

    return(
        <div className="w-85 min-h-screen bg-linear-to-l from-gray-800 to-zinc-800 flex flex-col">
            <div className='h-16 shrink-0 pt-4'>
                <Logo />
            </div>
            
            <div className='flex-1 overflow-y-auto pt-8'>
                <nav className="flex px-4 py-6">
                    <ul className="space-y-2 w-full">
                        {navItems.map((item) => {
                            const active = isActive(item);
                            
                            return (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        active 
                                            ? 'bg-white/10 text-white font-semibold' 
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {item.icon && <span className="text-lg">{item.icon}</span>}
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        )})}
                    </ul>
                </nav>
            </div>

            <div className="flex px-4 py-6 flex-col gap-4 shrink-0">
                <button 
                    className="w-full px-4 py-3 border border-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer"
                >
                    {getIcon('logout')} Logout
                </button>
            </div>
        </div>
    )
}