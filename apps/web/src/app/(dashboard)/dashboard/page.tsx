import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, FileText, Bot, Layers, Crown, BarChart3, type LucideIcon } from 'lucide-react'
import { formatFcfa, normalizePlan, planPrice } from '@alpha-kelassi/types'
import { getSubjectArtwork } from '@/components/subject-artwork'

interface Shortcut {
  href: string
  label: string
  Icon: LucideIcon
  gradient: string
  bg: string
  text: string
  iconColor: string
}

const SHORTCUTS: Shortcut[] = [
  {
    href: '/cours',
    label: 'Cours',
    Icon: BookOpen,
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    iconColor: 'text-white',
  },
  {
    href: '/examens',
    label: 'Prépa',
    Icon: FileText,
    gradient: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    iconColor: 'text-white',
  },
  {
    href: '/tuteur',
    label: 'Kelassi IA',
    Icon: Bot,
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    iconColor: 'text-white',
  },
  {
    href: '/flashcards',
    label: 'Flashcards',
    Icon: Layers,
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    iconColor: 'text-white',
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: profile }, { data: progress }, { data: recentDocs }] = await Promise.all([
    supabase
      .from('users')
      .select('full_name, plan, role, onboarding_completed')
      .eq('id', user!.id)
      .single(),
    supabase.from('user_progress').select('*, subjects(name)').eq('user_id', user!.id).limit(5),
    supabase
      .from('documents')
      .select('id, title, type, level')
      .eq('is_premium', false)
      .order('created_at', { ascending: false })
      .limit(4),
  ])

  // Redirige les nouveaux utilisateurs vers l'onboarding
  if (profile && !profile.onboarding_completed) redirect('/onboarding')

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Élève'

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-8">
      {/* ── HERO GREETING ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e3a8a] via-[#172554] to-[#111827] px-8 py-10 shadow-xl">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/4 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-48 translate-y-1/2 rounded-full bg-white/5" />
        <div className="relative">
          <p className="mb-1 text-sm font-medium text-blue-200">{greeting} 👋</p>
          <h1 className="mb-2 text-3xl font-black text-white">{firstName}</h1>
          <p className="max-w-xs text-sm text-blue-100">
            Prêt à réviser aujourd'hui ? Continue là où tu t'es arrêté.
          </p>
          {normalizePlan(profile?.plan) === 'free' && profile?.role !== 'admin' && (
            <Link
              href="/billing"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-50"
            >
              <Crown className="h-4 w-4" aria-hidden="true" />
              Découvrir les formules — dès {formatFcfa(planPrice('starter', 'month'))} / mois
            </Link>
          )}
        </div>
      </div>

      {/* ── SHORTCUTS ── */}
      <div>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">
          Accès rapide
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {SHORTCUTS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`${s.bg} group flex flex-col items-center gap-3 rounded-2xl border border-white p-5 shadow-sm transition-all duration-200 hover:scale-105`}
            >
              <div
                className={`h-12 w-12 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md`}
              >
                <s.Icon className="h-6 w-6 text-white" strokeWidth={1.75} />
              </div>
              <span className={`text-sm font-bold ${s.text}`}>{s.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Progression */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Ma progression</h2>
            <Link
              href="/progression"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Voir tout →
            </Link>
          </div>
          {progress && progress.length > 0 ? (
            <div className="space-y-4">
              {progress.map((p) => (
                <div key={p.id}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {(p.subjects as { name: string } | null)?.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-orange-500">{p.streak_days}🔥</span>
                      <span className="text-xs text-gray-400">
                        {Math.round((p.score_avg ?? 0) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                      style={{ width: `${Math.min((p.score_avg ?? 0) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
                <BarChart3 className="h-6 w-6 text-gray-400" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-gray-400">
                Commence à réviser pour voir
                <br />
                ta progression ici.
              </p>
              <Link
                href="/cours"
                className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline"
              >
                Parcourir les cours →
              </Link>
            </div>
          )}
        </div>

        {/* Cours récents */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Cours récents</h2>
            <Link href="/cours" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              Voir tout →
            </Link>
          </div>
          <div className="space-y-2">
            {recentDocs && recentDocs.length > 0 ? (
              recentDocs.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/cours/${doc.id}`}
                  className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-gray-50"
                >
                  <div
                    aria-hidden="true"
                    className="h-14 w-16 flex-shrink-0 rounded-xl bg-cover bg-center"
                    style={{ backgroundImage: `url("${getSubjectArtwork(doc.title)}")` }}
                  ></div>
                  <div className="min-w-0">
                    <p className="line-clamp-1 text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                      {doc.title}
                    </p>
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-gray-400">
                      {doc.level.replace('_', ' ')}
                    </p>
                  </div>
                  <span className="ml-auto text-gray-300 transition-colors group-hover:text-blue-400">
                    →
                  </span>
                </Link>
              ))
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100">
                  <BookOpen className="h-6 w-6 text-gray-400" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-gray-400">Aucun document disponible.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── TIPS CARD ── */}
      <div className="flex items-start gap-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-6">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100">
          <Bot className="h-5 w-5 text-emerald-700" strokeWidth={1.5} />
        </div>
        <div>
          <p className="mb-1 font-bold text-emerald-900">Conseil du jour</p>
          <p className="text-sm leading-relaxed text-emerald-700">
            Pose tes questions à <strong>Kelassi IA</strong> en disant "explique-moi comme si
            j'avais 10 ans" pour des explications ultra-claires. La méthode Feynman est la plus
            efficace pour mémoriser.
          </p>
          <Link
            href="/tuteur"
            className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-900"
          >
            Essayer maintenant →
          </Link>
        </div>
      </div>
    </div>
  )
}
