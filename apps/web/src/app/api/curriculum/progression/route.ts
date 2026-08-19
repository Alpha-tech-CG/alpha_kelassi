import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'

/**
 * GET /api/curriculum/progression?subject=<uuid matière top-level>
 * Liste ordonnée (calendrier CEPE, migration 045) des chapitres d'une matière,
 * avec déblocage séquentiel : le chapitre N n'est débloqué que si le chapitre
 * N-1 est entièrement complété (toutes ses leçons complétées). Le premier
 * chapitre est toujours débloqué.
 *
 * Remplace le déblocage par date (calendrier) par un déblocage par maîtrise —
 * même ordre de contenu (curriculum_items), logique de progression différente.
 */

// TEMPORAIRE — déblocage global pour inspection de contenu (demande explicite).
// Remettre à false pour réactiver le déblocage séquentiel normal.
const UNLOCK_ALL_FOR_INSPECTION = true
export async function GET(req: NextRequest) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const subjectId = req.nextUrl.searchParams.get('subject')
  if (!subjectId) return NextResponse.json({ error: { code: 'BAD_REQUEST', message: 'Paramètre "subject" requis' } }, { status: 400 })

  const { data: subject } = await supabase.from('subjects').select('id, name').eq('id', subjectId).maybeSingle()
  if (!subject) return NextResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })

  const { data: domains } = await supabase.from('subjects').select('id, name').eq('parent_subject_id', subjectId)
  const domainIds = [subjectId, ...(domains ?? []).map((d) => d.id)]
  const domainNameById = new Map([[subjectId, subject.name], ...(domains ?? []).map((d) => [d.id, d.name] as const)])

  const { data: items, error } = await supabase
    .from('curriculum_items')
    .select('chapter_id, subject_id, order_index, chapters(id, title), school_months(order_index, label)')
    .eq('item_type', 'chapter')
    .in('subject_id', domainIds)
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })

  const rows = (items ?? [])
    .filter((it) => it.chapters)
    .sort((a, b) => {
      const am = (a.school_months as any)?.order_index ?? 999
      const bm = (b.school_months as any)?.order_index ?? 999
      if (am !== bm) return am - bm
      return (a.order_index ?? 0) - (b.order_index ?? 0)
    })
  const chapterIds = rows.map((r) => r.chapter_id)
  if (chapterIds.length === 0) return NextResponse.json({ data: { subject, chapters: [] } })

  const { data: lessons } = await supabase.from('lessons').select('id, chapter_id').in('chapter_id', chapterIds)
  const lessonIds = (lessons ?? []).map((l) => l.id)
  const { data: progress } = lessonIds.length
    ? await supabase.from('lesson_progress').select('lesson_id, completed').eq('user_id', user.id).eq('completed', true).in('lesson_id', lessonIds)
    : { data: [] }
  const doneLessonIds = new Set((progress ?? []).map((p) => p.lesson_id))

  const totalByChapter = new Map<string, number>()
  const doneByChapter = new Map<string, number>()
  for (const l of lessons ?? []) {
    totalByChapter.set(l.chapter_id, (totalByChapter.get(l.chapter_id) ?? 0) + 1)
    if (doneLessonIds.has(l.id)) doneByChapter.set(l.chapter_id, (doneByChapter.get(l.chapter_id) ?? 0) + 1)
  }

  let previousCompleted = true // le premier chapitre est toujours débloqué
  const chapters = rows.map((r) => {
    const total = totalByChapter.get(r.chapter_id) ?? 0
    const done = doneByChapter.get(r.chapter_id) ?? 0
    const isCompleted = total > 0 && done >= total
    const isUnlocked = UNLOCK_ALL_FOR_INSPECTION || previousCompleted
    previousCompleted = isCompleted
    return {
      id: r.chapter_id,
      title: (r.chapters as any)?.title ?? '—',
      domain_id: r.subject_id,
      domain_name: domainNameById.get(r.subject_id) ?? '',
      month_label: (r.school_months as any)?.label ?? null,
      total_lessons: total,
      completed_lessons: done,
      is_completed: isCompleted,
      is_unlocked: isUnlocked,
    }
  })

  return NextResponse.json({ data: { subject, chapters } })
}
