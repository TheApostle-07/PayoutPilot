'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  Calendar,
  UploadCloud,
  IndianRupee,
  FileText,
  Users,
  MessageSquare,
  History,
  Zap,
  DownloadCloud,
  Settings,
  LogOut,
} from 'lucide-react';
import { useUser, signOut } from '../lib/firebaseClient';

export default function SidebarAdmin() {
  const user = useUser();
  const router = useRouter();
  const path = usePathname();
  const isActive = (href: string) => path.startsWith(href);

  // Derive display name
  const rawName = user?.displayName ?? user?.email?.split('@')[0] ?? 'Administrator';
  // Remove trailing digits if any, then convert to title case
  const nameWithoutDigits = rawName.replace(/\d+$/, '');
  const displayName = nameWithoutDigits
    .split(/[\s._-]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  // Derive initials from display name
  const initials = displayName
    .split(' ')
    .map(w => w[0]?.toUpperCase())
    .join('') || '--';

  async function handleLogout() {
    await signOut();
    router.push('/');
  }

  return (
    <aside className="sticky top-0 bottom-0 flex flex-col justify-between w-64 min-h-screen bg-white shadow-lg border-r p-6 overflow-y-auto">
      {/* User panel */}
      <div className="flex items-center gap-4 p-4 border-b">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)' }}
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">
            {displayName}
          </p>
          <span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
            Administrator
          </span>
        </div>
      </div>

      <div className="flex-1 mt-8 overflow-y-auto">
        <nav className="space-y-2">
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-2 p-2 rounded transition ${
              isActive('/admin/dashboard') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
            }`}
          >
            <Home size={20} /> Dashboard
          </Link>

          <Link
            href="/admin/sessions"
            className={`flex items-center gap-2 p-2 rounded transition ${
              isActive('/admin/sessions') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
            }`}
          >
            <Calendar size={20} /> Sessions
          </Link>
          <Link
            href="/admin/sessions/upload"
            className={`flex items-center gap-2 p-2 rounded transition ${
              isActive('/admin/sessions/upload') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
            }`}
          >
            <UploadCloud size={20} /> CSV Upload
          </Link>

          <Link
            href="/admin/payouts"
            className={`flex items-center gap-2 p-2 rounded transition ${
              isActive('/admin/payouts') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
            }`}
          >
            <IndianRupee size={20} /> Payouts
          </Link>

          <Link
            href="/admin/receipts"
            className={`flex items-center gap-2 p-2 rounded transition ${
              isActive('/admin/receipts') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
            }`}
          >
            <FileText size={20} /> Receipts
          </Link>

          <Link
            href="/admin/mentors"
            className={`flex items-center gap-2 p-2 rounded transition ${
              isActive('/admin/mentors') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
            }`}
          >
            <Users size={20} /> Mentors
          </Link>

          <Link
            href="/admin/chat"
            className={`flex items-center gap-2 p-2 rounded transition ${
              isActive('/admin/chat') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
            }`}
          >
            <MessageSquare size={20} /> Chat
          </Link>

          <Link
            href="/admin/audit-logs"
            className={`flex items-center gap-2 p-2 rounded transition ${
              isActive('/admin/audit-logs') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
            }`}
          >
            <History size={20} /> Audit Logs
          </Link>

          <Link
            href="/admin/simulation"
            className={`flex items-center gap-2 p-2 rounded transition ${
              isActive('/admin/simulation') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
            }`}
          >
            <Zap size={20} /> Simulation
          </Link>

          <Link
            href="/admin/exports"
            className={`flex items-center gap-2 p-2 rounded transition ${
              isActive('/admin/exports') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
            }`}
          >
            <DownloadCloud size={20} /> Exports
          </Link>

          <Link
            href="/admin/settings"
            className={`flex items-center gap-2 p-2 rounded transition ${
              isActive('/admin/settings') ? 'bg-indigo-100 text-indigo-600' : 'text-gray-700 hover:bg-indigo-50'
            }`}
          >
            <Settings size={20} /> Settings
          </Link>
        </nav>
      </div>

      {/* Sign Out */}
      <div className="border-t border-gray-200 my-4" />
      <button
        onClick={handleLogout}
        className="
          flex items-center gap-2 p-2 rounded transition
          text-red-600 hover:bg-indigo-50 hover:text-red-800
        "
      >
        <LogOut size={20} />
        <span className="font-medium">Sign Out</span>
      </button>
    </aside>
  );
}