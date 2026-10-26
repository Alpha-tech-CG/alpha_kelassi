import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { formatFcfa } from '@alpha-kelassi/types'
import { supabaseAdmin } from '@/lib/admin-guard'
import { Card } from './stats/_components/sections'
import { loadAppStats } from './stats/_lib'

export const dynamic = 'force-dynamic'

/**
 * Vue d'ensemble de la console : quelques chiffres clés et ce qui attend une
 * action. Le détail vit dans chaque page (Statistiques, Finances, Communauté…),
 * on n'y affiche rien qui n'y mène pas.
 */

type Count = { count: number | null }

async function loadOverview() {
  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0, 0, 0, 0)
  const inAWeek = new Date(Date.now() + 7 * 86_400_000).toISOString()
  const head = { count: 'exact' as const, head: true }

  const [stats, tutors, teachers, flags, support, expiring, pendingPay, chapters, lessons, monthPay] = await Promise.all([
    loadAppStats(30),
    supabaseAdmin.from('tutor_profiles').select('user_id', head).eq('is_verified', false),
    supabaseAdmin.from('teacher_profiles').select('user_id', head).eq('is_verified', false),
    supabaseAdmin.from('moderation_flags').select('id', head).eq('status', 'open'),
    supabaseAdmin.from('beta_feedback').select('id', head).eq('status', 'open'),
    supabaseAdmin.from('subscriptions').select('id', head).eq('status', 'active')
      .gte('expires_at', new Date().toISOString()).lte('expires_at', inAWeek),
    supabaseAdmin.from('payment_transactions').select('id', head).eq('status', 'pending'),
    supabaseAdmin.from('chapters').select('id', head),
    supabaseAdmin.from('lessons').select('id', head),
    supabaseAdmin.from('payment_transactions').select('amount').eq('status', 'successful').gte('created_at', monthStart.toISOString()),
  ])

  const n = (r: Count) => r.count ?? 0
  return {
    stats: stats.stats,
    todo: [
      { label: 'Dossiers de tuteurs à valider', n: n(tutors), href: '/admin/tutors' },
      { label: 'Dossiers d’enseignants à valider', n: n(teachers), href: '/admin/teachers' },
      { label: 'Messages signalés à modérer', n: n(flags), href: '/admin/moderation' },
      { label: 'Demandes de support ouvertes', n: n(support), href: '/admin/support' },
      { label: 'Abonnements qui expirent sous 7 jours', n: n(expiring), href: '/admin/subscriptions' },
      { label: 'Paiements en attente de confirmation', n: n(pendingPay), href: '/admin/subscriptions' },
    ],
    catalogue: { chapters: n(chapters), lessons: n(lessons) },
    revenueMonth: ((monthPay.data ?? []) as { amount: number }[]).reduce((s, p) => s + p.amount, 0),
  }
}

function Tile({ label, value, hint, href }: { label: string; value: string; hint?: string; href: string }) {
  return (
    <Link href={href} className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:border-blue-200 hover:shadow-md transition">
      <p className="text-2xl font-black text-gray-900 tabular-nums">{value}</p>
      <p className="text-xs font-semibold text-gray-600 mt-0.5">{label}</p>
      {hint ? <p className="text-[11px] text-gray-400 mt-1">{hint}</p> : null}
      <p className="text-[11px] font-semibold text-blue-700 mt-2 opacity-0 group-hover:opacity-100 transition">Voir le détail →</p>
    </Link>
  )
}

export default async function AdminOverviewPage() {
  const { stats, todo, catalogue, revenueMonth } = await loadOverview()
  const pending = todo.filter((t) => t.n > 0)
  const fr = (v: number | undefined) => (v ?? 0).toLocaleString('fr')

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Vue d&apos;ensemble</h1>
        <p className="text-gray-500 text-sm mt-1">Les chiffres clés et ce qui attend une action. Le détail est dans chaque rubrique.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        <Tile label="Élèves inscrits" value={fr(stats?.students_total)} hint={`+${fr(stats?.signups_period)} sur 30 jours`} href="/admin/stats/inscriptions" />
        <Tile label="Actifs sur 7 jours" value={fr(stats?.wau)} hint="élèves" href="/admin/stats/activite" />
        <Tile label="Actifs aujourd’hui" value={fr(stats?.dau)} hint="heure du Congo" href="/admin/stats/activite" />
        <Tile label="Abonnés payants" value={fr(stats?.conversions.paying_now)} hint="en cours de validité" href="/admin/subscriptions" />
        <Tile label="Encaissé ce mois-ci" value={formatFcfa(revenueMonth)} hint="paiements confirmés" href="/admin/revenus" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="À traiter" className="lg:col-span-2">
          {pending.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-green-700 py-4">
              <CheckCircle2 className="w-5 h-5" aria-hidden="true" /> Rien en attente : dossiers, signalements, support et paiements sont à jour.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {pending.map((t) => (
                <li key={t.label}>
                  <Link href={t.href} className="flex items-center justify-between gap-3 py-3 hover:text-blue-700">
                    <span className="text-sm text-gray-700">{t.label}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white bg-amber-500 px-2 py-0.5 rounded-full tabular-nums">{t.n}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {pending.length > 0 && pending.length < todo.length && (
            <p className="text-[11px] text-gray-400 mt-3">Les autres files sont vides.</p>
          )}
        </Card>

        <Card title="Catalogue">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-600">Chapitres</dt><dd className="font-semibold tabular-nums">{fr(catalogue.chapters)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-600">Leçons</dt><dd className="font-semibold tabular-nums">{fr(catalogue.lessons)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-600">QCM terminés (30 j)</dt><dd className="font-semibold tabular-nums">{fr(stats?.quizzes_completed)}</dd></div>
          </dl>
          <div className="flex flex-col gap-1.5 mt-4 text-sm">
            <Link href="/admin/curriculum" className="text-blue-700 font-semibold hover:underline">Gérer les cours →</Link>
            <Link href="/admin/stats/contenus" className="text-blue-700 font-semibold hover:underline">Contenus les plus consultés →</Link>
          </div>
        </Card>
      </div>

      {!stats && (
        <p className="text-xs text-red-700">Statistiques d’usage indisponibles pour le moment : les chiffres d’élèves affichent 0.</p>
      )}
    </div>
  )
}
