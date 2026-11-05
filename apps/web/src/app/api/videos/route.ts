import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { parseUuidParam, parseLevelParam } from '@/lib/query-validation'

/** GET /api/videos?subject_id=&level= — liste des cours vidéo accessibles */
export async function GET(req: NextRequest) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const subjectId = parseUuidParam(req.nextUrl.searchParams.get('subject_id'))
  const level = parseLevelParam(req.nextUrl.searchParams.get('level'))
  if (subjectId === undefined || level === undefined) {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Paramètre subject_id ou level invalide.' } }, { status: 400 })
  }

  let query = supabase
    .from('videos')
    .select('id, title, description, level, provider, external_id, url, duration_sec, thumbnail_url, is_premium, subjects(name)')
    .order('created_at', { ascending: false })

  if (subjectId) query = query.eq('subject_id', subjectId)
  if (level) query = query.eq('level', level)

  const { data, error } = await query.limit(100)
  if (error) {
    console.error('[/api/videos]', error)
    return NextResponse.json({ error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } }, { status: 500 })
  }
  return NextResponse.json({ data: data ?? [] })
}
