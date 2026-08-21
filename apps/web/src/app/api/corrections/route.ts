import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authenticate } from '@/lib/supabase/api'
import { admin } from '@/lib/tutor'
import { rateLimit, tooMany } from '@/lib/rate-limit'

const ownsPath = (userId: string, path: string) => path.split('/')[0] === userId

const createSchema = z.object({
  subject_id:   z.string().uuid(),
  exercise_url: z.string().min(3).max(512),
  work_url:     z.string().min(3).max(512),
})

/** GET /api/corrections — mes missions (élève). */
export async function GET(req: Request) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  const { data, error } = await supabase.from('correction_missions')
    .select('id, subject_id, status, reward_fcfa, due_at, delivered_at, created_at, subjects(name)')
    .eq('student_id', user.id).order('created_at', { ascending: false }).limit(50)
  if (error) {
    console.error('[/api/corrections]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  return NextResponse.json({ data: data ?? [] })
}

/** POST /api/corrections — soumettre un exercice à corriger (Premium requis). */
export async function POST(req: Request) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })
  if (!(await rateLimit(`corrections:${user.id}`, 15, 3600))) return tooMany()

  let body: z.infer<typeof createSchema>
  try { body = createSchema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 }) }

  if (!ownsPath(user.id, body.exercise_url) || !ownsPath(user.id, body.work_url)) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Fichier hors de votre dossier.' } }, { status: 403 })
  }

  const { data: me } = await admin().from('users').select('plan').eq('id', user.id).single()
  if (me?.plan !== 'premium') {
    return NextResponse.json({ error: { code: 'PREMIUM_REQUIRED', message: 'La correction par un tuteur est réservée au Premium.' } }, { status: 403 })
  }

  const { data: subject } = await admin().from('subjects').select('id').eq('id', body.subject_id).maybeSingle()
  if (!subject) return NextResponse.json({ error: { code: 'NO_SUBJECT', message: 'Matière inconnue.' } }, { status: 422 })

  const { data: mission, error } = await admin().from('correction_missions').insert({
    student_id: user.id, subject_id: body.subject_id, exercise_url: body.exercise_url, work_url: body.work_url, status: 'pending',
  }).select('id, status, created_at').single()
  if (error) {
    console.error('[/api/corrections]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }

  // La mission apparaît dans le pool des tuteurs (GET /api/tutor/missions).
  return NextResponse.json({ data: mission }, { status: 201 })
}
