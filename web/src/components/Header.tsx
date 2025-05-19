// File: web/src/components/Header.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, signOut } from '../lib/firebaseClient';
import { LogOut } from 'lucide-react';

export default function Header() {
  const user = useUser();
  const router = useRouter();
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Redirect to the correct dashboard only when on the root or login path
  useEffect(() => {
    if (user && (path === '/' || path === '/login')) {
      const role = 
        user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
          ? 'admin'
          : 'mentor';
      router.replace(`/${role}/dashboard`);
    }
  }, [user, path, router]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Derive user initials
  function getInitials() {
    if (!user) return '';
    const name = user.displayName || user.email || '';
    return name
      .split(/[\s.\-_]+/)
      .map(part => part[0]?.toUpperCase())
      .filter(Boolean)
      .join('');
  }

  // Sign out and return home
  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-3xl font-extrabold font-poppins bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
          PayoutPilot
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="text-gray-600 hover:text-gray-900 font-medium transition">
            About
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-medium transition">
            Contact
          </Link>
          {user ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold uppercase"
                aria-label="User menu"
              >
                {getInitials() || '?'}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-20 overflow-hidden">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {user.displayName || user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 flex items-center gap-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}