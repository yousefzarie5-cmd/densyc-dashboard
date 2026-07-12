'use client'

import { Sidebar } from './sidebar'
import { Navbar } from './navbar'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Sidebar />
      <Navbar />
      <main className="flex-1 md:ml-64 mt-16 p-6 overflow-auto bg-background">
        {children}
      </main>
    </div>
  )
}
