'use client'
import React, { ReactNode } from 'react'
import Header from '../../src/components/Header'
import SidebarAdmin from '../../src/components/SidebarAdmin'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* full admin shell */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <SidebarAdmin />

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}