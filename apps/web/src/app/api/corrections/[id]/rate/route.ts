import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authenticate } from '@/lib/supabase/api'
import { admin, recomputeTutorScore } from '@/lib/tutor'

const schema = z.object({
  clarity: z.number().int().min(1).max(5),
  quality: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
})

/** POST /api/corrections/:id/rate — l'élève note le tuteur. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 }) }

  const { data: mission } = await admin().from('correction_missions')
    .select('id, tutor_id, status').eq('id', id).eq('student_id', user.id).maybeSingle()
  if (!mission) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })
  if (!mission.tutor_id) return NextResponse.json({ error: { code: 'NO_TUTOR', message: 'Correction faite par l’IA.' } }, { status: 422 })
  if (mission.status !== 'delivered') return NextResponse.json({ error: { code: 'NOT_DELIVERED' } }, { status: 422 })

  const { error } = await admin().from('tutor_ratings').insert({
    mission_id: id, student_id: user.id, tutor_id: mission.tutor_id,
    clarity: body.clarity, quality: body.quality, comment: body.comment ?? null,
  })
  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: { code: 'ALREADY_RATED' } }, { status: 409 })
    console.error('[/corrections/[id]/rate]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  await recomputeTutorScore(mission.tutor_id)
  return NextResponse.json({ data: { ok: true } }, { status: 201 })
}
