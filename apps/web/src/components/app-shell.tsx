import Link from 'next/link'
import { BetaFeedbackButton } from '@/components/beta-feedback-button'
import { NotificationBanner } from '@/components/notification-banner'
import { SignOutButton } from '@/components/sign-out-button'
import {
  Home, BookOpen, FileText, Bot, Layers, TrendingUp,
  Crown, Wrench, ListChecks, CalendarClock, PlayCircle, Sparkles, type LucideIcon,
} from 'lucide-react'
import { PLAN_META, normalizePlan } from '@alpha-kelassi/types'

/**
 * Coque de l'application pour un utilisateur connecté : barre latérale,
 * navigation mobile, bandeau de notification.
 *
 * Extraite du layout du tableau de bord pour être partagée avec le catalogue
 * de cours, qui est accessible sans compte : un visiteur connecté y retrouve
 * la même navigation, un visiteur anonyme voit la coque publique à la place
 * (voir `public-shell.tsx`).
 */

interface NavItem { href: string; label: string; Icon: LucideIcon }

const NAV: NavItem[] = [
  { href: '/dashboard',  label: 'Accueil',     Icon: Home       },
  { href: '/cours',      label: 'Cours',       Icon: BookOpen   },
  { href: '/examens',    label: 'Examens',     Icon: FileText   },
  { href: '/videos',     label: 'Vidéos',      Icon: PlayCircle },
  { href: '/tuteur',     label: 'Kelassi IA',  Icon: Bot        },
  { href: '/flashcards', label: 'Flashcards',  Icon: Layers     },
  { href: '/quiz',       label: 'QCM',         Icon: ListChecks },
  { href: '/planning',   label: 'Planning',    Icon: CalendarClock },
  { href: '/progression',label: 'Progression', Icon: TrendingUp },
  { href: '/analyse',    label: 'Mon analyse', Icon: Sparkles   },
  { href: '/billing',    label: 'Formules',    Icon: Crown      },
]

const MOBILE_NAV: NavItem[] = [
  { href: '/dashboard',   label: 'Accueil', Icon: Home       },
  { href: '/cours',       label: 'Cours',   Icon: BookOpen   },
  { href: '/tuteur',      label: 'IA',      Icon: Bot        },
  { href: '/flashcards',  label: 'Cartes',  Icon: Layers     },
  { href: '/progression', label: 'Progrès', Icon: TrendingUp },
]

export interface ShellProfile {
  full_name: string | null
  plan: string | null
  role: string | null
}

export function AppShell({
  email,
  profile,
  isAdmin = false,
  children,
}: {
  email: string | null
  profile: ShellProfile | null
  /** Affiche l'accès à la console admin. Calculé côté serveur (liste blanche + rôle). */
  isAdmin?: boolean
  children: React.ReactNode
}) {
  const initial = (profile?.full_name ?? email ?? 'U')[0]!.toUpperCase()
  const displayName = profile?.full_name ?? email
  // `profile.plan` est la formule effective, calculée par le layout serveur.
  const plan = normalizePlan(profile?.plan)
  const paidPlan = plan !== 'free'
  const planLabel = profile?.role === 'admin' ? 'Admin · accès complet' : PLAN_META[plan].label

  return (
    <div className="min-h-screen flex">
      {/* Skip to content — accessibilité clavier */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Aller au contenu principal
      </a>

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-[#172554] px-4 py-6 text-white" aria-label="Navigation principale">
        <Link href="/dashboard" className="flex items-center gap-2 mb-8 px-2" aria-label="Kelassi — Accueil">
          <div className="w-9 h-9 bg-[#f5a623] rounded-xl flex items-center justify-center" aria-hidden="true">
            <BookOpen className="h-5 w-5 text-[#172554]" />
          </div>
          <span className="text-xl font-black text-white">Alpha Kelassi</span>
        </Link>

        <nav className="flex-1 space-y-0.5" aria-label="Menu principal">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-blue-100 hover:bg-white/10 hover:text-white transition-colors"
            >
              <item.Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} aria-hidden="true" />
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <>
              <div className="pt-4 pb-1 px-3">
                <p className="text-[10px] font-bold text-blue-300/70 uppercase tracking-wider">Administration</p>
              </div>
              {/* Couleurs explicites : la barre latérale est bleu marine, un gris
                  foncé hérité rendait ce lien pratiquement illisible. */}
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-[#f5a623] text-[#172554] hover:brightness-105 transition-all"
              >
                <Wrench className="w-4 h-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                Console admin
              </Link>
            </>
          )}
        </nav>

        <div className="border-t border-white/10 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-sm">{initial}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{displayName}</p>
              <Link
                href="/billing"
                aria-label={`Formule ${planLabel} — voir les formules`}
                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-0.5 ${
                  paidPlan ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {paidPlan && <Crown className="w-3 h-3" aria-hidden="true" />} {planLabel}
              </Link>
            </div>
          </div>

          <SignOutButton />

          <div className="flex flex-wrap gap-3 px-2 text-xs text-gray-400">
            <Link href="/compte/securite" className="hover:text-gray-600 transition-colors">Sécurité</Link>
            <Link href="/cgu" className="hover:text-gray-600 transition-colors">CGU</Link>
            <Link href="/confidentialite" className="hover:text-gray-600 transition-colors">Confidentialité</Link>
            <Link href="/compte/supprimer" className="hover:text-red-500 transition-colors">Supprimer</Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main id="main-content" className="flex-1 overflow-auto bg-[#fcfbf9] pb-20 md:pb-0">
        {/* Barre compte mobile — la barre latérale est masquée en dessous de md,
            c'est donc le seul accès au compte et à la déconnexion sur mobile web. */}
        <div className="md:hidden flex items-center justify-between gap-3 px-4 py-2.5 bg-[#172554] text-white">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-[11px]">{initial}</span>
            </div>
            <span className="text-xs text-blue-100 truncate">{displayName}</span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 text-xs text-blue-100">
            {isAdmin && (
              <Link href="/admin" className="font-bold text-[#f5a623] hover:brightness-110 transition-all">Admin</Link>
            )}
            <Link href="/compte/securite" className="hover:text-white transition-colors">Compte</Link>
            <SignOutButton className="flex items-center gap-1 hover:text-white transition-colors" />
          </div>
        </div>
        <NotificationBanner plan={normalizePlan(profile?.plan)} />
        {children}
      </main>

      <BetaFeedbackButton />

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#172554] border-t border-white/10 px-2 py-2 flex items-center justify-around" aria-label="Navigation mobile">
        {(isAdmin ? [...MOBILE_NAV, { href: '/admin', label: 'Console', Icon: Wrench }] : MOBILE_NAV).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-blue-200 hover:text-[#f5a623] hover:bg-white/10 transition-all"
          >
            <item.Icon className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
