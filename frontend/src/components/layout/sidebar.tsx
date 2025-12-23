'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, MapPin, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/search', icon: Search, label: '검색' },
  { href: '/itinerary', icon: MapPin, label: '일정' },
  { href: '/mypage', icon: User, label: '마이' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-16 border-r border-border bg-background">
      <div className="flex h-full flex-col items-center py-6">
        {/* Logo */}
        <Link href="/" className="mb-8">
          <div className="text-2xl font-bold text-primary">D</div>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col items-center gap-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
