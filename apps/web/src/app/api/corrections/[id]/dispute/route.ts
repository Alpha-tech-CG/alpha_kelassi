import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authenticate } from '@/lib/supabase/api'
import { admin, aiResolveDispute } from '@/lib/tutor'

export const maxDuration = 60

const schema = z.object({ description: z.string().min(10).max(1000) })

/** POST /api/corrections/:id/dispute — l'élève conteste ; l'IA arbitre (synchrone). */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 }) }

  const { data: mission } = await admin().from('correction_missions')
    .select('id, status, exercise_url, work_url').eq('id', id).eq('student_id', user.id).maybeSingle()
  if (!mission) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })
  if (mission.status !== 'delivered') return NextResponse.json({ error: { code: 'NOT_DELIVERED' } }, { status: 422 })

  const { data: dispute, error } = await admin().from('correction_disputes')
    .insert({ mission_id: id, student_id: user.id, description: body.description }).select('id').single()
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })

  await admin().from('correction_missions').update({ status: 'disputed' }).eq('id', id)

  // Arbitrage IA synchrone (pas de worker sur Vercel).
  const { data: sol } = await admin().from('correction_solutions')
    .select('photo_url').eq('mission_id', id).order('attempt', { ascending: false }).limit(1).maybeSingle()
  const explanation = await aiResolveDispute({
    exercise_url: mission.exercise_url, work_url: mission.work_url,
    solution_url: sol?.photo_url ?? null, description: body.description,
  })
  await admin().from('correction_disputes')
    .update({ ai_explanation: explanation, resolved_at: new Date().toISOString() }).eq('id', dispute.id)

  return NextResponse.json({ data: { id: dispute.id, status: 'disputed', ai_explanation: explanation } }, { status: 201 })
}
