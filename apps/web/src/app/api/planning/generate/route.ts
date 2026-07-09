import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { z } from 'zod'

const schema = z.object({
  plan_id:         z.string().uuid(),
  subject_ids:     z.array(z.string().uuid()).min(1).max(15),
  sessions_per_day: z.number().int().min(1).max(5).default(2),
  duration_min:    z.number().int().min(15).max(180).default(30),
})

/**
 * POST /api/planning/generate — génère l'emploi du temps de révision.
 * Réparti les matières en round-robin de demain jusqu'à la veille de l'examen.
 * Régénère : supprime d'abord les séances existantes non faites du plan.
 */
export async function POST(req: NextRequest) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  // Récupère le plan (et vérifie qu'il appartient bien à l'élève via RLS)
  const { data: plan } = await supabase
    .from('revision_plans')
    .select('id, exam_date')
    .eq('id', body.plan_id)
    .eq('user_id', user.id)
    .single()
  if (!plan) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })

  // Noms des matières (pour les titres)
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name')
    .in('id', body.subject_ids)
  const nameById = new Map((subjects ?? []).map((s) => [s.id, s.name]))
  const ids = body.subject_ids.filter((id) => nameById.has(id))
  if (ids.length === 0) return NextResponse.json({ error: { code: 'NO_SUBJECT' } }, { status: 422 })

  // Fenêtre : de demain jusqu'à la veille de l'examen
  const start = new Date(); start.setDate(start.getDate() + 1); start.setHours(0, 0, 0, 0)
  const exam = new Date(plan.exam_date + 'T00:00:00')
  const dayMs = 86400000
  const totalDays = Math.floor((exam.getTime() - start.getTime()) / dayMs)
  if (totalDays <= 0) {
    return NextResponse.json({ error: { code: 'EXAM_PASSED', message: 'La date d\'examen est trop proche ou passée.' } }, { status: 422 })
  }

  const MAX = 500
  const rows: Array<{
    user_id: string; plan_id: string; subject_id: string; title: string
    scheduled_date: string; duration_min: number
  }> = []

  let rr = 0
  for (let d = 0; d < totalDays && rows.length < MAX; d++) {
    const date = new Date(start.getTime() + d * dayMs).toISOString().slice(0, 10)
    for (let s = 0; s < body.sessions_per_day && rows.length < MAX; s++) {
      const subjectId = ids[rr % ids.length]!  // ids.length >= 1 garanti
      rr++
      rows.push({
        user_id:        user.id,
        plan_id:        plan.id,
        subject_id:     subjectId,
        title:          `Réviser ${nameById.get(subjectId)}`,
        scheduled_date: date,
        duration_min:   body.duration_min,
      })
    }
  }

  // Régénère : on supprime les séances non faites du plan avant d'insérer
  await supabase.from('revision_sessions')
    .delete()
    .eq('plan_id', plan.id)
    .eq('user_id', user.id)
    .eq('is_done', false)

  const { error } = await supabase.from('revision_sessions').insert(rows)
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })

  return NextResponse.json({ data: { created: rows.length, days: totalDays } }, { status: 201 })
}
