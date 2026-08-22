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

/**
 * Valide un paramètre de requête numérique borné (?limit=, ?page=…).
 * Toute valeur absente, non entière ou hors bornes retombe sur `fallback` :
 * jamais de NaN ni de valeur arbitraire transmise à la base.
 */
export function parseIntParam(
  raw: string | null,
  { min, max, fallback }: { min: number; max: number; fallback: number },
): number {
  if (raw === null) return fallback
  const parsed = z.coerce.number().int().safeParse(raw)
  if (!parsed.success) return fallback
  return Math.min(max, Math.max(min, parsed.data))
}

/** Valide un identifiant de route (`/api/…/[id]`) face au format UUID. */
export function isUuid(raw: string | null | undefined): raw is string {
  return typeof raw === 'string' && uuidSchema.safeParse(raw).success
}
