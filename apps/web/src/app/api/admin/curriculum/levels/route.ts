import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { STUDY_LEVELS } from '@alpha-kelassi/types'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'

/**
 * Ouverture des classes aux élèves (table `study_level_settings`, migration 064).
 * Une classe fermée reste entièrement gérable depuis la console ; la base la
 * cache aux élèves (séries, matières, chapitres).
 */

const MIGRATION_MISSING = {
  error: { code: 'MIGRATION_MISSING', message: 'Applique d’abord les migrations 063 et 064 (classes intermédiaires).' },
}

export async function GET() {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const { data, error } = await supabaseAdmin.from('study_level_settings').select('level, published')
  if (error) return NextResponse.json(MIGRATION_MISSING, { status: 503 })
  return NextResponse.json({ data: data ?? [] })
}

const schema = z.object({ level: z.enum(STUDY_LEVELS), published: z.boolean() })

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  let b: z.infer<typeof schema>
  try { b = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Classe ou valeur invalide.' } }, { status: 400 }) }

  const { error } = await supabaseAdmin.from('study_level_settings')
    .upsert({ level: b.level, published: b.published, updated_at: new Date().toISOString() }, { onConflict: 'level' })
  if (error) {
    console.error('[/api/admin/curriculum/levels]', error)
    return NextResponse.json(MIGRATION_MISSING, { status: 503 })
  }
  return NextResponse.json({ data: { level: b.level, published: b.published } })
}
