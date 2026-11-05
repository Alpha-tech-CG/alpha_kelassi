import { createClient as createAdminClient } from '@supabase/supabase-js'
import type { Stats, WebVitalsStats } from './_components/sections'

/**
 * Chargement des agrégats des pages Statistiques et Finances. Tout est
 * calculé en base (admin_app_stats, migration 069 ; admin_web_vitals,
 * migration 076), fonctions réservées au service_role ; l'accès aux pages est
 * gardé par le layout admin.
 */

export const PERIODS = [7, 30, 90] as const

/** Période demandée dans l'URL (?days=), 30 jours par défaut. */
export function parseDays(raw: string | undefined): number {
  const n = Number(raw)
  return PERIODS.includes(n as (typeof PERIODS)[number]) ? n : 30
}

type Rpc = (fn: string, args: object) => Promise<{ data: unknown; error: { message: string } | null }>

function adminRpc(): Rpc | null {
  const url = process.env['NEXT_PUBLIC_SUPABASE_URL']
  const key = process.env['SUPABASE_SERVICE_ROLE_KEY']
  if (!url || !key) return null
  const admin = createAdminClient(url, key, { auth: { persistSession: false } })
  // bind : sortie de l'objet, la méthode perdrait son `this` (le client Supabase).
  return admin.rpc.bind(admin) as unknown as Rpc
}

export async function loadAppStats(days: number): Promise<{ stats: Stats | null; error: string | null }> {
  const rpc = adminRpc()
  if (!rpc) return { stats: null, error: 'Clé de service Supabase absente côté serveur.' }
  const { data, error } = await rpc('admin_app_stats', { p_days: days })
  if (error) return { stats: null, error: error.message }
  return { stats: data as Stats, error: null }
}

export async function loadWebVitals(days: number): Promise<{ vitals: WebVitalsStats | null; error: string | null }> {
  const rpc = adminRpc()
  if (!rpc) return { vitals: null, error: 'Clé de service Supabase absente côté serveur.' }
  const { data, error } = await rpc('admin_web_vitals', { p_days: days })
  if (error) return { vitals: null, error: error.message }
  return { vitals: data as WebVitalsStats, error: null }
}
