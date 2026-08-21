import { z } from 'zod'

/**
 * Valide les paramètres de requête `?subject_id=`/`?level=` utilisés comme
 * filtres optionnels dans plusieurs routes GET. `null` (paramètre absent)
 * est toujours valide — seule une valeur présente mais malformée est rejetée.
 */

const uuidSchema = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
const LEVELS = ['bepc', 'bac_a', 'bac_c', 'bac_d'] as const
const levelSchema = z.enum(LEVELS)

export function parseUuidParam(raw: string | null): string | null | undefined {
  if (raw === null) return null
  const result = uuidSchema.safeParse(raw)
  return result.success ? result.data : undefined
}

export function parseLevelParam(raw: string | null): (typeof LEVELS)[number] | null | undefined {
  if (raw === null) return null
  const result = levelSchema.safeParse(raw)
  return result.success ? result.data : undefined
}
