import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'

const schema = z.object({
  answers: z.array(z.object({
    question_id:    z.string().uuid(),
    selected_index: z.number().int().min(0).nullable(),
  })),
  duration_sec: z.number().int().min(0).max(86400),
})

/**
 * POST /api/quiz/:id/submit — soumet les réponses.
 * Le score est calculé côté serveur par la RPC submit_quiz_attempt
 * (security definer) : le client n'envoie jamais le score.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { data, error } = await supabase.rpc('submit_quiz_attempt', {
    p_quiz_id:      id,
    p_answers:      body.answers,
    p_duration_sec: body.duration_sec,
  })

  if (error) {
    const msg = error.message
    if (msg.includes('PREMIUM_REQUIRED'))
      return NextResponse.json({ error: { code: 'PREMIUM_REQUIRED', message: 'Ce QCM est réservé aux abonnés premium.' } }, { status: 403 })
    if (msg.includes('QUIZ_NOT_FOUND'))
      return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })
    return NextResponse.json({ error: { code: 'DB_ERROR', message: msg } }, { status: 500 })
  }

  // XP : 5 par bonne réponse (non bloquant, best-effort).
  // Via le client admin : la RPC increment_xp n'est plus exposée aux clients.
  const score = (data as { score?: number })?.score ?? 0
  if (score > 0) {
    supabaseAdmin.rpc('increment_xp', { p_user_id: user.id, p_amount: score * 5 }).then(() => {}, () => {})
  }

  return NextResponse.json({ data })
}
