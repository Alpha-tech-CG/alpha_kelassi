import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'

/**
 * GET /api/admin/curriculum/chapters/count?level= — nombre de chapitres par
 * matière, pour une classe.
 *
 * Évite à la page « Matières d'une classe » d'émettre une requête par matière
 * juste pour afficher un compteur.
 */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const level = req.nextUrl.searchParams.get('level')
  if (!level) {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'level requis' } }, { status: 400 })
  }

  const { data: subjects, error: sErr } = await supabaseAdmin
    .from('subjects').select('id').eq('level', level)
  if (sErr) {
    console.error('[/api/admin/curriculum/chapters/count]', sErr)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }

  const ids = (subjects ?? []).map((s) => s.id)
  if (ids.length === 0) return NextResponse.json({ data: {} })

  const { data: chapters, error } = await supabaseAdmin
    .from('chapters').select('id, subject_id').in('subject_id', ids)
  if (error) {
    console.error('[/api/admin/curriculum/chapters/count]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }

  const counts: Record<string, number> = {}
  for (const c of chapters ?? []) counts[c.subject_id] = (counts[c.subject_id] ?? 0) + 1
  return NextResponse.json({ data: counts })
}
