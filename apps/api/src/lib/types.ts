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
