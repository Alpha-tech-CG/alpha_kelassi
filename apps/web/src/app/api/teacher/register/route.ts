import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authenticate } from '@/lib/supabase/api'
import { supabaseAdmin } from '@/lib/admin-guard'

const ownsPath = (userId: string, path: string) => path.split('/')[0] === userId

const schema = z.object({
  school:                   z.string().min(2).max(160),
  id_doc_url:               z.string().min(3).max(512),
  teaching_certificate_url: z.string().min(3).max(512),
})

/** POST /api/teacher/register — devenir enseignant (en attente de validation 48h). */
export async function POST(req: Request) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 }) }

  if (!ownsPath(user.id, body.id_doc_url) || !ownsPath(user.id, body.teaching_certificate_url)) {
    return NextResponse.json({ error: { code: 'FORBIDDEN', message: 'Document hors de votre dossier.' } }, { status: 403 })
  }

  const { data: existing } = await supabaseAdmin.from('teacher_profiles').select('user_id').eq('user_id', user.id).maybeSingle()
  if (existing) return NextResponse.json({ error: { code: 'ALREADY_TEACHER', message: 'Profil enseignant déjà créé.' } }, { status: 409 })

  const { error } = await supabaseAdmin.from('teacher_profiles').insert({
    user_id: user.id, school: body.school, id_doc_url: body.id_doc_url,
    teaching_certificate_url: body.teaching_certificate_url, is_verified: false,
  })
  if (error) {
    console.error('[/api/teacher/register]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }

  await supabaseAdmin.from('users').update({ role: 'teacher' }).eq('id', user.id)
  return NextResponse.json({ data: { status: 'pending_verification' } }, { status: 201 })
}
