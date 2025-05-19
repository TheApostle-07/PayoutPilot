'use client';
import React from 'react'
import Header from '../src/components/Header'
import Footer from '../src/components/Footer'
import Features from '../src/components/Features';
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  // any /admin or /mentor route is handled by its own layout
  const isAppShell = path.startsWith('/admin') || path.startsWith('/mentor')
  const hideFeatures = path === '/contact' || path === '/about';

  return (
    <html lang="en">
      <head>
        <script
          src="https://cdn.tailwindcss.com"
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: { extend: {} },
                plugins: [require('daisyui')],
                daisyui: { themes: ['light', 'dark'] },
              }
            `,
          }}
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/devicon.min.css"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-gray-50 antialiased">
        {isAppShell ? (
          // for admin/mentor, let their own layouts render header/sidebar
          children
        ) : (
          // public routes: wrap with Header + main + Footer
          <>
            <Header />
            <main className="flex-1 p-6">{children}</main>
            {!hideFeatures && <Features />}
            <Footer />
          </>
        )}
      </body>
    </html>
  )
}