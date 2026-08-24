'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignOutButton } from '@/components/sign-out-button'

/**
 * Navigation de la console admin.
 *
 * Les entrées sont regroupées par domaine plutôt que listées à plat : à treize
 * rubriques, une liste uniforme oblige à tout relire pour trouver la bonne.
 */

interface NavItem { href: string; label: string; icon: string; hint?: string }
interface NavGroup { title: string; items: NavItem[] }

const GROUPS: NavGroup[] = [
  {
    title: 'Pilotage',
    items: [
      { href: '/admin', label: 'Vue d\'ensemble', icon: '📊' },
    ],
  },
  {
    title: 'Contenu pédagogique',
    items: [
      { href: '/admin/subjects',   label: 'Matières',        icon: '📘' },
      { href: '/admin/curriculum', label: 'Cours & chapitres', icon: '🎓', hint: 'Leçons, exercices, QCM' },
      { href: '/admin/quiz',       label: 'QCM & annales',   icon: '✅' },
      { href: '/admin/documents',  label: 'Documents (PDF)', icon: '📚' },
      { href: '/admin/videos',     label: 'Vidéos',          icon: '🎬' },
      { href: '/admin/exams',      label: 'Dates d\'examen', icon: '📅' },
    ],
  },
  {
    title: 'Communauté',
    items: [
      { href: '/admin/users',    label: 'Utilisateurs',       icon: '👥' },
      { href: '/admin/tutors',   label: 'Tuteurs',            icon: '🧑‍🏫', hint: 'Validation des dossiers' },
      { href: '/admin/teachers', label: 'Enseignants',        icon: '👨‍🏫' },
      { href: '/admin/moderation', label: 'Modération',       icon: '🛡️' },
    ],
  },
  {
    title: 'Exploitation',
    items: [
      { href: '/admin/subscriptions', label: 'Abonnements', icon: '💳' },
      { href: '/admin/notifications', label: 'Annonces',    icon: '🔔' },
    ],
  },
]

export function AdminSidebar({ name }: { name: string }) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-950 border-r border-gray-800 flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800 flex-shrink-0">
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

      {/* Nav groupée */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-1.5 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon, hint }) => {
                const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-green-700 text-white shadow-lg shadow-green-700/20'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-base flex-shrink-0" aria-hidden="true">{icon}</span>
                    <span className="min-w-0">
                      <span className="block truncate">{label}</span>
                      {hint && (
                        <span className={`block text-[10px] truncate ${active ? 'text-green-100' : 'text-gray-600'}`}>
                          {hint}
                        </span>
                      )}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Compte */}
      <div className="px-4 py-4 border-t border-gray-800 flex-shrink-0">
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
        <SignOutButton className="mt-2 flex items-center gap-2 text-xs text-gray-500 hover:text-red-400 transition-colors" />
      </div>
    </aside>
  )
}
