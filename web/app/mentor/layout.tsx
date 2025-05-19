'use client'
import React, { ReactNode } from 'react'
import Header from '../../src/components/Header'
import SidebarMentor from '../../src/components/SidebarMentor'

interface MentorLayoutProps {
  children: ReactNode
}

export default function MentorLayout({ children }: MentorLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <SidebarMentor />

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}