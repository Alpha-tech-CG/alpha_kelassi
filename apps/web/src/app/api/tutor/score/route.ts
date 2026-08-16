import { NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { admin } from '@/lib/tutor'

/** GET /api/tutor/score — score global + avis récents des élèves. */
export async function GET(req: Request) {
  const { user } = await authenticate(req)
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 })

  const { data: profile } = await admin().from('tutor_profiles').select('score').eq('user_id', user.id).maybeSingle()
  if (!profile) return NextResponse.json({ error: { code: 'NOT_TUTOR' } }, { status: 403 })

  const { data: ratings } = await admin().from('tutor_ratings')
    .select('clarity, quality, comment, created_at').eq('tutor_id', user.id)
    .order('created_at', { ascending: false }).limit(30)
  return NextResponse.json({ data: { score: profile.score, ratings: ratings ?? [] } })
}
