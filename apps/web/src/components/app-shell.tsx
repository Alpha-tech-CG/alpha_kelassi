import Link from 'next/link'
import { AppNavLink } from '@/components/app-nav-link'
import { Logo } from '@/components/brand/logo'
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
  { href: '/examens',    label: 'Prépa',       Icon: FileText   },
  { href: '/videos',     label: 'Vidéos',      Icon: PlayCircle },
  { href: '/tuteur',     label: 'Cognix IA',   Icon: Bot        },
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
    <div className="text-cx-navy flex min-h-screen">
      {/* Skip to content — accessibilité clavier */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Aller au contenu principal
      </a>

      {/* Barre latérale (charte Cognix : blanc, liens en pilule bleue) */}
      <aside
        className="sticky top-0 hidden h-screen w-64 flex-col border-r border-gray-100 bg-white px-4 py-6 md:flex"
        aria-label="Navigation principale"
      >
        <Link href="/dashboard" className="mb-8 px-2" aria-label="Cognix, accueil">
          <Logo />
        </Link>

        <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Menu principal">
          {NAV.map((item) => (
            <AppNavLink key={item.href} href={item.href}>
              <item.Icon className="h-4 w-4 flex-shrink-0" strokeWidth={1.75} aria-hidden="true" />
              {item.label}
            </AppNavLink>
          ))}
          {isAdmin && (
            <>
              <p className="px-4 pb-1 pt-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                Administration
              </p>
              <Link
                href="/admin"
                className="bg-cx-navy flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Wrench className="h-4 w-4 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
                Console admin
              </Link>
            </>
          )}
        </nav>

        <div className="space-y-3 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
              <span className="text-sm font-bold text-blue-600">{initial}</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold">{displayName}</p>
              <Link
                href="/billing"
                aria-label={`Formule ${planLabel} — voir les formules`}
                className={`mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                  paidPlan ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {paidPlan && <Crown className="h-3 w-3" aria-hidden="true" />} {planLabel}
              </Link>
            </div>
          </div>

          <SignOutButton className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900" />

          <div className="flex flex-wrap gap-3 px-2 text-xs text-gray-400">
            <Link href="/compte/securite" className="transition-colors hover:text-gray-700">Sécurité</Link>
            <Link href="/cgu" className="transition-colors hover:text-gray-700">CGU</Link>
            <Link href="/confidentialite" className="transition-colors hover:text-gray-700">Confidentialité</Link>
            <Link href="/compte/supprimer" className="transition-colors hover:text-red-500">Supprimer</Link>
          </div>
        </div>
      </aside>

      {/* Contenu */}
      <main id="main-content" className="bg-cx-paper flex-1 overflow-auto pb-20 md:pb-0">
        {/* Barre compte mobile — la barre latérale est masquée en dessous de md,
            c'est donc le seul accès au compte et à la déconnexion sur mobile web. */}
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-2.5 md:hidden">
          <Link href="/dashboard" aria-label="Cognix, accueil">
            <Logo size="sm" />
          </Link>
          <div className="flex flex-shrink-0 items-center gap-3 text-xs font-medium text-gray-600">
            {isAdmin && (
              <Link href="/admin" className="font-semibold text-blue-600">Admin</Link>
            )}
            <Link href="/compte/securite" className="hover:text-gray-900">Compte</Link>
            <SignOutButton className="flex items-center gap-1 hover:text-gray-900" />
          </div>
        </div>
        <NotificationBanner plan={normalizePlan(profile?.plan)} />
        {children}
      </main>

      <BetaFeedbackButton />

      {/* Navigation mobile */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-gray-100 bg-white/95 px-2 py-2 backdrop-blur md:hidden"
        aria-label="Navigation mobile"
      >
        {(isAdmin ? [...MOBILE_NAV, { href: '/admin', label: 'Console', Icon: Wrench }] : MOBILE_NAV).map((item) => (
          <AppNavLink key={item.href} href={item.href} variant="bottom">
            <item.Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </AppNavLink>
        ))}
      </nav>
    </div>
  )
}
