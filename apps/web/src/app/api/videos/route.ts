import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/** GET /api/videos?subject_id=&level= — liste des cours vidéo accessibles */
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const subjectId = req.nextUrl.searchParams.get('subject_id')
  const level = req.nextUrl.searchParams.get('level')

  let query = supabase
    .from('videos')
    .select('id, title, description, level, provider, external_id, url, duration_sec, thumbnail_url, is_premium, subjects(name)')
    .order('created_at', { ascending: false })

  if (subjectId) query = query.eq('subject_id', subjectId)
  if (level) query = query.eq('level', level)

  const { data, error } = await query.limit(100)
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}
