'use client'

import Logo from '@/components/common/logo'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getIcon } from './common/icons'

interface NavItem {
    name: string
    path: string
    icon?: React.ReactNode
}

interface LayoutComponentProps {
    navItems: NavItem[]
}


export default function LayoutComponent({ navItems }: LayoutComponentProps){

    const currentPage = usePathname();
    
    return(
        <div className="w-64 min-h-screen bg-linear-to-l from-gray-800 to-zinc-800 flex flex-col">
            <div className='h-16 shrink-0'>
                <Logo />
            </div>
            
            <div className='flex-1 overflow-y-auto'>
                <nav className="flex px-4 py-6">
                    <ul className="space-y-2 w-full">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                {item.path === currentPage ? (
                                    <div className="flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-lg">
                                        {item.icon && <span className="text-lg">{item.icon}</span>}
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                ) :
                                <Link 
                                    href={item.path}
                                    className="flex items-center gap-3 px-4 py-3 text-white rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    {item.icon && <span className="text-lg">{item.icon}</span>}
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                                }
                            </li>
                        ))}
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