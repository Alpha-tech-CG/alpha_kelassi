'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignOutButton } from '@/components/sign-out-button'
import {
  Activity, BookMarked, CalendarDays, Clapperboard, CreditCard, Eye, Gauge, GraduationCap, Headphones,
  LayoutDashboard, Library, LineChart, ListChecks, Megaphone, Presentation, ScrollText, ShieldCheck,
  Trash2, Trophy, UserCheck, UserPlus, Users, X, type LucideIcon,
} from 'lucide-react'
import { Logo } from '@/components/brand/logo'

/**
 * Navigation de la console admin.
 *
 * Les entrées sont regroupées par domaine, une page par sujet : les
 * statistiques d'usage, la gestion des contenus, les médias, la communauté,
 * les finances, la relation élèves et les outils ne se mélangent pas.
 */

interface NavItem { href: string; label: string; icon: LucideIcon; hint?: string }
interface NavGroup { title: string; items: NavItem[] }

const GROUPS: NavGroup[] = [
  {
    title: 'Pilotage',
    items: [
      { href: '/admin', label: 'Vue d’ensemble', icon: LayoutDashboard, hint: 'Chiffres clés, à traiter' },
    ],
  },
  {
    title: 'Statistiques',
    items: [
      { href: '/admin/stats/activite',     label: 'Activité',             icon: Activity, hint: 'Élèves actifs, rétention' },
      { href: '/admin/stats/inscriptions', label: 'Inscriptions',         icon: UserPlus, hint: 'Entonnoir du questionnaire' },
      { href: '/admin/stats/contenus',     label: 'Contenus consultés',   icon: Eye },
      { href: '/admin/stats/vitesse',      label: 'Vitesse du site',      icon: Gauge },
      { href: '/admin/stats/evenements',   label: 'Journal d’événements', icon: ScrollText },
    ],
  },
  {
    title: 'Contenu',
    items: [
      { href: '/admin/subjects',   label: 'Matières',            icon: BookMarked },
      { href: '/admin/curriculum', label: 'Cours & chapitres',   icon: GraduationCap, hint: 'Leçons, exercices, QCM' },
      { href: '/admin/prepa',      label: 'Prépa — examens & TD', icon: Trophy, hint: 'Bac test, blanc, rouge, anciens bacs' },
      { href: '/admin/quiz',       label: 'QCM (génération IA)', icon: ListChecks },
    ],
  },
  {
    title: 'Médias',
    items: [
      { href: '/admin/documents', label: 'Documents (PDF)', icon: Library },
      { href: '/admin/videos',    label: 'Vidéos',          icon: Clapperboard },
    ],
  },
  {
    title: 'Communauté',
    items: [
      { href: '/admin/users',      label: 'Utilisateurs', icon: Users },
      { href: '/admin/tutors',     label: 'Tuteurs',      icon: UserCheck, hint: 'Validation des dossiers' },
      { href: '/admin/teachers',   label: 'Enseignants',  icon: Presentation },
      { href: '/admin/moderation', label: 'Modération',   icon: ShieldCheck },
    ],
  },
  {
    title: 'Finances',
    items: [
      { href: '/admin/subscriptions', label: 'Abonnements',           icon: CreditCard, hint: 'Gestion, expirations' },
      { href: '/admin/revenus',       label: 'Revenus & conversions', icon: LineChart, hint: 'Paiements, passage au payant' },
    ],
  },
  {
    title: 'Relation élèves',
    items: [
      { href: '/admin/support',       label: 'Support',  icon: Headphones, hint: 'Demandes par priorité' },
      { href: '/admin/notifications', label: 'Annonces', icon: Megaphone },
    ],
  },
  {
    title: 'Outils',
    items: [
      { href: '/admin/exams',     label: 'Dates d’examen', icon: CalendarDays },
      { href: '/admin/corbeille', label: 'Corbeille',      icon: Trash2, hint: 'Restaurer un élément supprimé' },
    ],
  },
]

export function AdminSidebar({
  name,
  isOpen = false,
  onClose,
}: {
  name: string
  isOpen?: boolean
  onClose?: () => void
}) {
  const pathname = usePathname()

  return (
    <aside className={`fixed left-0 top-0 h-full w-64 bg-gray-950 border-r border-gray-800 flex flex-col z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800 flex-shrink-0 flex items-center justify-between">
        <div>
          <Logo dark size="sm" />
          <p className="text-gray-400 text-[11px] mt-1.5 pl-9">Console admin</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav groupée */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <p className="px-3 mb-1.5 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon, hint }) => {
                const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                      active
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block truncate">{label}</span>
                      {hint && (
                        <span className={`block text-[10px] truncate ${active ? 'text-blue-100' : 'text-gray-500'}`}>
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
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{name}</p>
            <p className="text-gray-500 text-xs">Administrateur</p>
          </div>
        </div>

        <Link
          href="/dashboard"
          onClick={onClose}
          className="mt-3 flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Retour au dashboard élève
        </Link>
        <SignOutButton className="mt-2 flex items-center gap-2 text-xs text-gray-500 hover:text-red-400 transition-colors" />
      </div>
    </aside>
  )
}
