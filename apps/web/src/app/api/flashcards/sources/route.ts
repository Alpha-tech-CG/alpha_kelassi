import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { FREE_TIER } from '@alpha-kelassi/types'
import { getEntitlements } from '@/lib/subscription/server'

/** GET /api/flashcards/sources — leçons accessibles pour créer des cartes */
export async function GET(req: NextRequest) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const [{ data: profile, error: profileError }, ent] = await Promise.all([
    supabase
      .from('users')
      .select('study_level_pref, subject_ids_pref')
      .eq('id', user.id)
      .maybeSingle(),
    getEntitlements(user.id),
  ])
  if (profileError) {
    console.error('[/api/flashcards/sources] profile lookup failed', profileError)
    return NextResponse.json(
      { error: { code: 'DB_ERROR', message: 'Impossible de charger ton parcours.' } },
      { status: 500 }
    )
  }

  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id, title, chapter_id')
    .eq('type', 'cours')
    .not('content', 'is', null)
    .order('title')
    .limit(1000)
  if (lessonsError) {
    console.error('[/api/flashcards/sources] lessons lookup failed', lessonsError)
    return NextResponse.json(
      { error: { code: 'DB_ERROR', message: 'Impossible de charger les cours disponibles.' } },
      { status: 500 }
    )
  }

  const chapterIds = [...new Set((lessons ?? []).map((lesson) => lesson.chapter_id))]
  if (chapterIds.length === 0) {
    return NextResponse.json({ data: [], remaining: null, limit: null })
  }

  const { data: chapters, error: chaptersError } = await supabase
    .from('chapters')
    .select('id, title, subject_id')
    .in('id', chapterIds)
  if (chaptersError) {
    console.error('[/api/flashcards/sources] chapters lookup failed', chaptersError)
    return NextResponse.json(
      { error: { code: 'DB_ERROR', message: 'Impossible de charger les chapitres.' } },
      { status: 500 }
    )
  }

  const subjectIds = [...new Set((chapters ?? []).map((chapter) => chapter.subject_id))]
  const { data: subjects, error: subjectsError } = await supabase
    .from('subjects')
    .select('id, name, level, parent_subject_id')
    .in('id', subjectIds)
  if (subjectsError) {
    console.error('[/api/flashcards/sources] subjects lookup failed', subjectsError)
    return NextResponse.json(
      { error: { code: 'DB_ERROR', message: 'Impossible de charger les matières.' } },
      { status: 500 }
    )
  }

  const chaptersById = new Map((chapters ?? []).map((chapter) => [chapter.id, chapter]))
  const subjectsById = new Map((subjects ?? []).map((subject) => [subject.id, subject]))
  const preferredSubjects = profile?.subject_ids_pref?.length
    ? new Set(profile.subject_ids_pref)
    : null
  const sources = (lessons ?? [])
    .map((lesson) => {
      const chapter = chaptersById.get(lesson.chapter_id)
      const subject = chapter ? subjectsById.get(chapter.subject_id) : undefined
      return { id: lesson.id, title: lesson.title, chapter, subject }
    })
    .filter(
      ({ subject }) =>
        subject &&
        (!profile?.study_level_pref || subject.level === profile.study_level_pref) &&
        (!preferredSubjects ||
          preferredSubjects.has(subject.id) ||
          (subject.parent_subject_id !== null && preferredSubjects.has(subject.parent_subject_id)))
    )

  const sourceLessonIds = sources.map((source) => source.id)
  let sourcesWithCards = new Set<string | null>()
  if (sourceLessonIds.length > 0) {
    const { data: existingCards, error: cardsError } = await supabase
      .from('flashcards')
      .select('lesson_id')
      .eq('user_id', user.id)
      .in('lesson_id', sourceLessonIds)
    if (cardsError) {
      console.error('[/api/flashcards/sources] flashcard lookup failed', cardsError)
      return NextResponse.json(
        { error: { code: 'DB_ERROR', message: 'Impossible de charger tes cartes.' } },
        { status: 500 }
      )
    }
    sourcesWithCards = new Set((existingCards ?? []).map((card) => card.lesson_id))
  }

  const { count: totalOwned, error: totalError } = await supabase
    .from('flashcards')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
  if (totalError) {
    console.error('[/api/flashcards/sources] quota lookup failed', totalError)
    return NextResponse.json(
      { error: { code: 'DB_ERROR', message: 'Impossible de vérifier ton quota.' } },
      { status: 500 }
    )
  }

  const hasUnlimitedCards = ent.can('flashcards')
  const remaining = hasUnlimitedCards
    ? null
    : Math.max(0, FREE_TIER.maxFlashcards - (totalOwned ?? 0))

  return NextResponse.json({
    data: sources.map(({ id, title, chapter, subject }) => ({
      id,
      title,
      chapter_title: chapter?.title ?? '',
      subject_name: subject?.name ?? '',
      has_cards: sourcesWithCards.has(id),
    })),
    remaining,
    limit: hasUnlimitedCards ? null : FREE_TIER.maxFlashcards,
  })
}
