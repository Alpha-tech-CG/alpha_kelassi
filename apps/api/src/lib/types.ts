import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@alpha-kelassi/types'

export type AppVariables = {
  userId: string
  supabase: SupabaseClient<Database>
}

export type StudyLevel = 'bepc' | 'bac_a' | 'bac_c' | 'bac_d'
const STUDY_LEVELS: readonly StudyLevel[] = ['bepc', 'bac_a', 'bac_c', 'bac_d']

/** Valide un paramètre de requête ?level= face à l'enum réel, sans jamais faire confiance à l'input brut. */
export function parseStudyLevel(value: string | undefined): StudyLevel | undefined {
  return STUDY_LEVELS.includes(value as StudyLevel) ? (value as StudyLevel) : undefined
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Valide un paramètre de requête id (?subject_id=, ?chapter_id=…) face au format UUID. */
export function parseUuidParam(value: string | undefined): string | undefined {
  return value !== undefined && UUID_RE.test(value) ? value : undefined
}
