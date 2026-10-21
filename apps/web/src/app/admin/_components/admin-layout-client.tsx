'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
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
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-violet-600 rounded-lg flex items-center justify-center text-white text-sm font-black">
            K
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Kelassi</p>
            <p className="text-gray-500 text-[10px] mt-0.5">Console Admin</p>
          </div>
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
      <main className="flex-1 min-h-screen bg-gray-50 md:ml-64 w-full admin-content-override">
        {children}
      </main>
    </div>
  )
}
