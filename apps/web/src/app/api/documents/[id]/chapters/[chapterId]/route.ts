import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> },
) {
  const { id, chapterId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data, error } = await supabase
    .from('course_chapters')
    .select('id, chapter_number, title, summary_md, word_count, status')
    .eq('document_id', id)
    .eq('id', chapterId)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Chapitre introuvable' }, { status: 404 })

  return NextResponse.json({ chapter: data })
}
