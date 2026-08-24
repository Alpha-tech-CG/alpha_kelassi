import { SupabaseClient } from '@supabase/supabase-js'
import type { Database, StudyLevel as SharedStudyLevel } from '@alpha-kelassi/types'
import { STUDY_LEVELS as SHARED_LEVELS } from '@alpha-kelassi/types'

export type AppVariables = {
  userId: string
  supabase: SupabaseClient<Database>
}

// Liste partagee, alignee sur l'enum PostgreSQL (packages/types/src/levels.ts).
export type StudyLevel = SharedStudyLevel
const STUDY_LEVELS: readonly StudyLevel[] = SHARED_LEVELS

/** Valide un paramètre de requête ?level= face à l'enum réel, sans jamais faire confiance à l'input brut. */
export function parseStudyLevel(value: string | undefined): StudyLevel | undefined {
  return STUDY_LEVELS.includes(value as StudyLevel) ? (value as StudyLevel) : undefined
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Valide un paramètre de requête id (?subject_id=, ?chapter_id=…) face au format UUID. */
export function parseUuidParam(value: string | undefined): string | undefined {
  return value !== undefined && UUID_RE.test(value) ? value : undefined
}

/**
 * Valide un paramètre de requête numérique borné (?limit=, ?page=…).
 * Toute valeur absente, non entière ou hors bornes retombe sur `fallback` :
 * jamais de NaN ni de valeur arbitraire transmise à la base.
 */
export function parseIntParam(
  value: string | undefined,
  { min, max, fallback }: { min: number; max: number; fallback: number },
): number {
  if (value === undefined || !/^-?\d{1,9}$/.test(value)) return fallback
  const n = Number.parseInt(value, 10)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, n))
}

/** Valide un paramètre de requête face à une liste blanche de valeurs autorisées. */
export function parseEnumParam<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
): T | undefined {
  return allowed.includes(value as T) ? (value as T) : undefined
}
