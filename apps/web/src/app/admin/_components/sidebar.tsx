'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin', label: 'Vue d\'ensemble', icon: '📊' },
  { href: '/admin/subjects', label: 'Matières', icon: '📘' },
  { href: '/admin/documents', label: 'Documents', icon: '📚' },
  { href: '/admin/quiz', label: 'QCM', icon: '✅' },
  { href: '/admin/videos', label: 'Vidéos', icon: '🎬' },
  { href: '/admin/exams', label: 'Dates d\'examen', icon: '📅' },
  { href: '/admin/subscriptions', label: 'Abonnements', icon: '💳' },
  { href: '/admin/notifications', label: 'Annonces', icon: '🔔' },
  { href: '/admin/users', label: 'Utilisateurs', icon: '👥' },
]

export function AdminSidebar({ name }: { name: string }) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-950 border-r border-gray-800 flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-violet-600 rounded-lg flex items-center justify-center text-white text-sm font-black">
            K
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">Kelassi</p>
            <p className="text-gray-500 text-xs mt-0.5">Console Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-green-700 text-white shadow-lg shadow-green-700/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{name}</p>
            <p className="text-gray-500 text-xs">Administrateur</p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="mt-3 flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Retour au dashboard élève
        </Link>
      </div>
    </aside>
  )
}
