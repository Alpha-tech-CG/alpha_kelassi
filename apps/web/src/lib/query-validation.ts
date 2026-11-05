import { z } from 'zod'
import { STUDY_LEVELS } from '@alpha-kelassi/types'

/**
 * Valide les paramètres de requête `?subject_id=`/`?level=` utilisés comme
 * filtres optionnels dans plusieurs routes GET. `null` (paramètre absent)
 * est toujours valide — seule une valeur présente mais malformée est rejetée.
 */

const uuidSchema = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
// Liste partagée, alignée sur l'enum PostgreSQL : une liste écrite en dur ici
// finissait par diverger de la base et rejetait des classes pourtant valides.
const LEVELS = STUDY_LEVELS
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
