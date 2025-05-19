// File: web/src/components/SidebarMentor.tsx
'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  CalendarDays,
  Download,
  MessageSquare,
  LogOut,
  User as UserIcon,
  Bell,
  PieChart,
  Settings,
  CreditCard,
} from 'lucide-react'
import { useUser, signOut } from '../lib/firebaseClient'

export default function SidebarMentor() {
  const user = useUser()
  const router = useRouter()
  const path = usePathname()

  if (!user) return null

  // Derive displayName & initials
  const displayName =
    user.displayName ||
    user.email?.split('@')[0].replace(/[\.\-_]/g, ' ') ||
    'Mentor'
  const initials = displayName
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  async function handleLogout() {
    await signOut()
    router.push('/')
  }

  const isActive = (href: string) => path.startsWith(href)

  return (
    
    <aside className="sticky top-0 bottom-0 flex flex-col justify-between w-64 min-h-screen bg-white shadow-lg border-r p-6 overflow-y-auto">
    
      {/* — Top: User info — */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #3B82F6)',
            }}
          >
            {initials || <UserIcon size={20} />}
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Signed in as
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-800 truncate">
                {displayName}
              </span>
              <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
                Mentor
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* — Middle: Navigation — */}
      <nav className="flex flex-col flex-grow space-y-2 overflow-y-auto">
        {[
          { href: '/mentor/dashboard', icon: Home, label: 'Dashboard' },
          { href: '/mentor/sessions', icon: CalendarDays, label: 'Sessions' },
          { href: '/mentor/receipts', icon: Download, label: 'Receipts' },
          { href: '/mentor/chat', icon: MessageSquare, label: 'Chat' },
          { href: '/mentor/notifications', icon: Bell, label: 'Notifications' },
          { href: '/mentor/earnings', icon: PieChart, label: 'Earnings' },
          { href: '/mentor/profile', icon: UserIcon, label: 'Profile' },
          { href: '/mentor/settings', icon: Settings, label: 'Settings' },
        ].map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg transition
              ${isActive(href)
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}
            `}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* — Quick Actions: Request Payout — */}
      <div className="mt-6 pt-4 border-t">
        <button
          onClick={() => router.push('/mentor/request-payout')}
          className="w-full flex items-center justify-center gap-2 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
        >
          <CreditCard size={18} />
          <span className="font-medium">Request Payout</span>
        </button>
      </div>

      {/* Divider */}
      <hr className="my-4 border-gray-200" />

      {/* — Bottom: Sign out — */}
      <button
        onClick={handleLogout}
        className="mt-0 w-full flex items-center justify-center gap-2 py-2 text-red-600 hover:text-red-800 transition"
      >
        <LogOut size={18} />
        <span className="font-medium">Sign Out</span>
      </button>
    </aside>
  )
}