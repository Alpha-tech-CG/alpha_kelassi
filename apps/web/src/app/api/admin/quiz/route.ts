import { NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'

/** GET /api/admin/quiz — liste des QCM avec nombre de questions (admin) */
export async function GET() {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const { data, error } = await supabaseAdmin
    .from('quizzes')
    .select('id, title, level, is_premium, created_at, subjects(name), quiz_questions(count)')
    .order('created_at', { ascending: false })
    .limit(300)

  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })

  const rows = (data ?? []).map((q) => {
    const qc = q.quiz_questions as unknown as Array<{ count: number }> | null
    return {
      id: q.id, title: q.title, level: q.level, is_premium: q.is_premium,
      subject_name: (q.subjects as unknown as { name: string } | null)?.name ?? null,
      question_count: qc?.[0]?.count ?? 0,
    }
  })
  return NextResponse.json({ data: rows })
}
