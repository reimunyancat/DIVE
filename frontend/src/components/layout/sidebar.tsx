'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Compass, Users, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Home', activeOn: [] },
  { href: '/', icon: Search, label: 'Search', activeOn: ['/'] },
  { href: '/search', icon: Compass, label: 'Dashboard', activeOn: ['/search', '/loading', '/itinerary'] },
  { href: '/community', icon: Users, label: 'Community', activeOn: ['/community'] },
  { href: '/mypage', icon: User, label: 'Profile', activeOn: ['/mypage', '/login'] },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="group fixed left-0 top-0 z-[9999] h-screen w-16 border-r border-gray-800 bg-[#1a1a1a] transition-all duration-300 hover:w-48">
      <div className="flex h-full flex-col py-4">
        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item, index) => {
            const isActive = item.activeOn.includes(pathname)
            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  'flex h-10 items-center gap-3 rounded-lg px-3 transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-white'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
