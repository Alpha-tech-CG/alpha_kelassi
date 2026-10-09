import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { z } from 'zod'
import { isUuid } from '@/lib/query-validation'
import { EXAM_KINDS } from '@/lib/prepa'

const DB_ERROR = { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' }

/**
 * GET /api/admin/prepa?subjectId= — tout l'espace Prépa d'une matière :
 * épreuves (hors corbeille), chapitres avec leur nombre d'exercices (TD) et
 * sujets PDF d'anciens examens.
 */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  const subjectId = req.nextUrl.searchParams.get('subjectId')
  if (!isUuid(subjectId)) {
    return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'subjectId requis (UUID valide)' } }, { status: 400 })
  }

  const [epreuves, chapters, sujets] = await Promise.all([
    supabaseAdmin.from('quizzes')
      .select('id, title, exam_kind, year, time_limit_sec, is_premium, created_at, quiz_questions(count)')
      .eq('subject_id', subjectId).eq('is_exam', true).is('deleted_at', null)
      .order('year', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false }),
    supabaseAdmin.from('chapters')
      .select('id, title, order_index, exercises(id, deleted_at)')
      .eq('subject_id', subjectId).order('order_index'),
    supabaseAdmin.from('documents')
      .select('id, title, year, session, is_premium, pdf_url, corrige_url')
      .eq('subject_id', subjectId).eq('type', 'examen')
      .order('year', { ascending: false, nullsFirst: false }),
  ])

  const err = epreuves.error ?? chapters.error ?? sujets.error
  if (err) {
    console.error('[/api/admin/prepa GET]', err)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }

  return NextResponse.json({
    data: {
      epreuves: (epreuves.data ?? []).map((q) => ({
        id: q.id, title: q.title, exam_kind: q.exam_kind, year: q.year,
        time_limit_sec: q.time_limit_sec, is_premium: q.is_premium,
        question_count: (q.quiz_questions as unknown as { count: number }[] | null)?.[0]?.count ?? 0,
      })),
      chapters: (chapters.data ?? []).map((c) => ({
        id: c.id, title: c.title, order_index: c.order_index,
        exercise_count: ((c.exercises ?? []) as { deleted_at: string | null }[]).filter((e) => !e.deleted_at).length,
      })),
      sujets: sujets.data ?? [],
    },
  })
}

const createSchema = z.object({
  subject_id:     z.string().uuid(),
  exam_kind:      z.enum(EXAM_KINDS),
  title:          z.string().trim().min(3).max(200),
  description:    z.string().max(1000).nullish(),
  year:           z.number().int().min(1960).max(2100).nullish(),
  time_limit_sec: z.number().int().min(60).max(4 * 3600).default(3600),
  is_premium:     z.boolean().default(false),
})

/** POST /api/admin/prepa — crée une épreuve (sans questions) dans une matière. */
export async function POST(req: NextRequest) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error

  let b: z.infer<typeof createSchema>
  try { b = createSchema.parse(await req.json()) }
  catch { return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Champs invalides : vérifie le titre, l\'année et la durée.' } }, { status: 400 }) }

  // Le niveau vient de la matière : une épreuve est toujours cohérente avec sa classe.
  const { data: subject } = await supabaseAdmin.from('subjects').select('id, level').eq('id', b.subject_id).maybeSingle()
  if (!subject) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Matière introuvable' } }, { status: 404 })

  const { data, error } = await supabaseAdmin.from('quizzes').insert({
    subject_id: b.subject_id, level: subject.level, is_exam: true,
    exam_kind: b.exam_kind, title: b.title, description: b.description ?? null,
    year: b.year ?? null, time_limit_sec: b.time_limit_sec, is_premium: b.is_premium,
  }).select('id').single()

  if (error) {
    console.error('[/api/admin/prepa POST]', error)
    return NextResponse.json({ error: DB_ERROR }, { status: 500 })
  }
  return NextResponse.json({ data: { id: data.id } }, { status: 201 })
}
