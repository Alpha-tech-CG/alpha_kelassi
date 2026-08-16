import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'

/** GET /api/admin/curriculum/exercises?chapterId= — exercices d'un chapitre (+ corrigé). */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const chapterId = req.nextUrl.searchParams.get('chapterId')
  if (!chapterId) return NextResponse.json({ error: 'chapterId requis' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('exercises')
    .select('id, chapter_id, title, statement, difficulty, is_premium, order_index, exercise_solutions(solution)')
    .eq('chapter_id', chapterId).order('order_index')
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })
  return NextResponse.json({ data: data ?? [] })
}

const schema = z.object({
  chapter_id:  z.string().uuid(),
  title:       z.string().min(2).max(200),
  statement:   z.string().min(2),
  solution:    z.string().min(2),
  difficulty:  z.number().int().min(1).max(3).default(1),
  is_premium:  z.boolean().default(false),
  order_index: z.number().int().min(0).default(0),
})

/** POST /api/admin/curriculum/exercises — crée un exercice + son corrigé. */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  let b: z.infer<typeof schema>
  try { b = schema.parse(await req.json()) }
  catch { return NextResponse.json({ error: 'Corps invalide' }, { status: 400 }) }

  const { data: ex, error } = await supabaseAdmin.from('exercises').insert({
    chapter_id: b.chapter_id, title: b.title, statement: b.statement,
    difficulty: b.difficulty, is_premium: b.is_premium, order_index: b.order_index,
  }).select('id').single()
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })

  const { error: sErr } = await supabaseAdmin.from('exercise_solutions')
    .insert({ exercise_id: ex.id, solution: b.solution })
  if (sErr) {
    await supabaseAdmin.from('exercises').delete().eq('id', ex.id)   // rollback
    return NextResponse.json({ error: { code: 'DB_ERROR', message: sErr.message } }, { status: 500 })
  }
  return NextResponse.json({ data: { id: ex.id } }, { status: 201 })
}
