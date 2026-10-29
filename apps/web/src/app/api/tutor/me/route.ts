import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authenticate } from '@/lib/supabase/api'
import { admin } from '@/lib/tutor'

/** GET /api/tutor/me — profil tuteur + matières + statut de vérification. */
export async function GET(req: Request) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  const { data: profile } = await admin().from('tutor_profiles')
    .select('user_id, is_verified, is_active, score, wallet_balance, bio').eq('user_id', user.id).maybeSingle()
  if (!profile) return NextResponse.json({ data: null })

  const { data: subjects } = await admin().from('tutor_subjects')
    .select('subject_id, subjects(name)').eq('tutor_id', user.id)
  return NextResponse.json({ data: { ...profile, subjects: subjects ?? [] } })
}

const patchSchema = z.object({ is_active: z.boolean().optional(), bio: z.string().max(500).optional() })

/** PATCH /api/tutor/me — disponibilité (en ligne/hors ligne) + bio. */
export async function PATCH(req: Request) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  const { data: profile } = await admin().from('tutor_profiles').select('user_id').eq('user_id', user.id).maybeSingle()
  if (!profile) return NextResponse.json({ error: { code: 'NOT_TUTOR' } }, { status: 403 })

  let raw: z.infer<typeof patchSchema>
  try { raw = patchSchema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST' } }, { status: 400 }) }

  const patch: { is_active?: boolean; bio?: string } = {}
  if (raw.is_active !== undefined) patch.is_active = raw.is_active
  if (raw.bio !== undefined) patch.bio = raw.bio
  if (Object.keys(patch).length === 0) return NextResponse.json({ data: { ok: true } })

  const { error } = await admin().from('tutor_profiles').update(patch).eq('user_id', user.id)
  if (error) {
    console.error('[/api/tutor/me]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  return NextResponse.json({ data: { ok: true } })
}
