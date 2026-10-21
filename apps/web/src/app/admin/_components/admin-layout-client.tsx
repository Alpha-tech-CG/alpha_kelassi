'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { AdminSidebar } from './sidebar'

export function AdminLayoutClient({
  name,
  children
}: {
  name: string
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row">
      {/* Header mobile */}
      <header className="md:hidden flex items-center justify-between bg-gray-950 border-b border-gray-800 px-4 py-3 text-white sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Logo dark size="sm" />
          <span className="text-gray-400 text-[11px]">Admin</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 transition-colors"
          aria-label="Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar */}
      <AdminSidebar name={name} isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Contenu principal */}
      <main className="flex-1 min-h-screen bg-cx-paper md:ml-64 w-full admin-content-override">
        {children}
      </main>
    </div>
  )
}
