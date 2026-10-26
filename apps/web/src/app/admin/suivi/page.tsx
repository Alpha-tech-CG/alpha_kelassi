import Link from 'next/link'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { Dashboard, type Stats, type WebVitalsStats } from './dashboard'

/**
 * Suivi de l'app : usage des élèves (table `app_events`), entonnoir
 * d'inscription, abonnements et paiements FeexPay.
 *
 * Tout est agrégé en base par `admin_app_stats()` (migration 069), réservée au
 * service_role ; l'accès à la page est gardé par le layout admin.
 */

export const dynamic = 'force-dynamic'

const PERIODS = [7, 30, 90] as const

async function loadStats(days: number): Promise<{ stats: Stats | null; vitals: WebVitalsStats | null; error: string | null }> {
  const url = process.env['NEXT_PUBLIC_SUPABASE_URL']
  const key = process.env['SUPABASE_SERVICE_ROLE_KEY']
  if (!url || !key) return { stats: null, vitals: null, error: 'Clé de service Supabase absente côté serveur.' }
  const admin = createAdminClient(url, key, { auth: { persistSession: false } })
  // bind : sortie de l'objet, la méthode perdrait son `this` (le client Supabase).
  const rpc = admin.rpc.bind(admin) as unknown as (fn: string, args: object) => Promise<{ data: unknown; error: { message: string } | null }>
  // Vitesse du site (migration 076) : plafonnée à 90 jours ; un échec ne
  // masque pas le reste du tableau de bord.
  const [stats, vitals] = await Promise.all([
    rpc('admin_app_stats', { p_days: days }),
    rpc('admin_web_vitals', { p_days: days }),
  ])
  if (stats.error) return { stats: null, vitals: null, error: stats.error.message }
  return { stats: stats.data as Stats, vitals: vitals.error ? null : (vitals.data as WebVitalsStats), error: null }
}

export default async function AdminSuiviPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  const sp = await searchParams
  const days = PERIODS.includes(Number(sp.days) as (typeof PERIODS)[number]) ? Number(sp.days) : 30
  const { stats, vitals, error } = await loadStats(days)

  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Suivi de l’app</h1>
          <p className="text-gray-500 text-sm mt-1">
            Usage des élèves, inscriptions, abonnements et paiements — données gardées dans Supabase, aucun service tiers.
          </p>
        </div>
        <nav className="flex gap-1 bg-gray-100 rounded-xl p-1" aria-label="Période">
          {PERIODS.map((p) => (
            <Link
              key={p}
              href={`/admin/suivi?days=${p}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${p === days ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-800'}`}
            >
              {p} jours
            </Link>
          ))}
        </nav>
      </div>

      {error || !stats ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-2xl p-5 text-sm">
          Statistiques indisponibles : {error ?? 'réponse vide'}.
        </div>
      ) : (
        <Dashboard s={stats} vitals={vitals} />
      )}
    </div>
  )
}

