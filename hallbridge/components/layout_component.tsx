import Logo from '@/components/logo'
import Link from 'next/link'
import { getIcon } from './icons'

interface NavItem {
    name: string
    path: string
    icon?: React.ReactNode
}

interface LayoutComponentProps {
    navItems: NavItem[]
}

export default function LayoutComponent({ navItems }: LayoutComponentProps){
    return(
        <div className="w-64 h-256 bg-linear-to-l from-gray-800 to-zinc-800 flex flex-col">
            <div className='h-16'>
                <Logo />
            </div>
            
            <div className='h-190'>
                <nav className="flex px-4 py-6">
                    <ul className="space-y-2 w-full">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link 
                                    href={item.path}
                                    className="flex items-center gap-3 px-4 py-3 text-white rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    {item.icon && <span className="text-lg">{item.icon}</span>}
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="flex px-4 py-6 flex-col gap-4">
                <button 
                    className="w-full px-4 py-3 border border-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium cursor-pointer"
                >
                    {getIcon('logout')} Logout
                </button>
            </div>
        </div>
    )
}