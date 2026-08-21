import { NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { admin } from '@/lib/tutor'

/** GET /api/tutor/missions — missions disponibles sur mes matières (vérifié + actif). */
export async function GET(req: Request) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  const { data: profile } = await admin().from('tutor_profiles')
    .select('is_verified, is_active').eq('user_id', user.id).maybeSingle()
  if (!profile?.is_verified) return NextResponse.json({ error: { code: 'NOT_VERIFIED' } }, { status: 403 })
  if (!profile.is_active) return NextResponse.json({ data: [] })

  const { data: subs } = await admin().from('tutor_subjects').select('subject_id').eq('tutor_id', user.id)
  const subjectIds = (subs ?? []).map((s) => s.subject_id)
  if (subjectIds.length === 0) return NextResponse.json({ data: [] })

  const { data, error } = await admin().from('correction_missions')
    .select('id, subject_id, created_at, subjects(name)')
    .eq('status', 'pending').in('subject_id', subjectIds)
    .order('created_at', { ascending: true }).limit(30)
  if (error) {
    console.error('[/api/tutor/missions]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  return NextResponse.json({ data: data ?? [] })
}
