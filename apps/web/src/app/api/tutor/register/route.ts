import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authenticate } from '@/lib/supabase/api'
import { admin } from '@/lib/tutor'

const ownsPath = (userId: string, path: string) => path.split('/')[0] === userId

const schema = z.object({
  bio:         z.string().max(500).optional(),
  subject_ids: z.array(z.string().uuid()).min(1).max(15),
  id_doc_url:  z.string().min(3).max(512),
  bac_doc_url: z.string().min(3).max(512),
})

/** POST /api/tutor/register — devenir tuteur (en attente de validation). */
export async function POST(req: Request) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 }) }

  if (!ownsPath(user.id, body.id_doc_url) || !ownsPath(user.id, body.bac_doc_url)) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Document hors de votre dossier.' } }, { status: 403 })
  }

  const { data: existing } = await admin().from('tutor_profiles').select('user_id').eq('user_id', user.id).maybeSingle()
  if (existing) return NextResponse.json({ error: { code: 'ALREADY_TUTOR', message: 'Profil tuteur déjà créé.' } }, { status: 409 })

  const { error: pErr } = await admin().from('tutor_profiles').insert({
    user_id: user.id, bio: body.bio ?? null, id_doc_url: body.id_doc_url, bac_doc_url: body.bac_doc_url, is_verified: false,
  })
  if (pErr) return NextResponse.json({ error: { code: 'DB_ERROR', message: pErr.message } }, { status: 500 })

  await admin().from('tutor_subjects').insert(body.subject_ids.map((subject_id) => ({ tutor_id: user.id, subject_id })))
  await admin().from('users').update({ role: 'tutor' }).eq('id', user.id)

  return NextResponse.json({ data: { status: 'pending_verification' } }, { status: 201 })
}
