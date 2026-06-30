import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { data, error } = await supabase
    .from('course_chapters')
    .select('id, chapter_number, title, word_count, status')
    .eq('document_id', id)
    .eq('status', 'done')
    .order('chapter_number')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ chapters: data ?? [] })
}
