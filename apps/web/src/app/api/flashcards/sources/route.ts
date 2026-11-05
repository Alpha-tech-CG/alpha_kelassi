import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { FREE_TIER } from '@alpha-kelassi/types'
import { getEntitlements } from '@/lib/subscription/server'

interface LessonRow {
  id: string
  title: string
  chapters: {
    title: string
    order_index: number | null
    subjects: { id: string; name: string; level: string; parent_subject_id: string | null }
  }
}

/**
 * GET /api/flashcards/sources — cours du parcours de l'élève, pour créer des cartes.
 * Une seule requête filtrée par niveau (jointure), puis les cartes déjà créées.
 * (L'ancienne version chargeait tous les cours de tous les niveaux puis passait des
 * centaines d'identifiants dans l'URL : la requête échouait → « aucun cours ».)
 */
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

  let query = supabase
    .from('lessons')
    .select(
      'id, title, chapters!inner(title, order_index, subjects!inner(id, name, level, parent_subject_id))'
    )
    .in('type', ['cours', 'resume'])
    .not('content', 'is', null)
    .limit(1000)
  if (profile?.study_level_pref) query = query.eq('chapters.subjects.level', profile.study_level_pref)

  const { data, error: lessonsError } = await query
  if (lessonsError) {
    console.error('[/api/flashcards/sources] lessons lookup failed', lessonsError)
    return NextResponse.json(
      { error: { code: 'DB_ERROR', message: 'Impossible de charger les cours disponibles.' } },
      { status: 500 }
    )
  }

  const preferred = profile?.subject_ids_pref?.length ? new Set(profile.subject_ids_pref) : null
  const lessons = ((data ?? []) as unknown as LessonRow[])
    .filter(({ chapters: { subjects: s } }) =>
      !preferred || preferred.has(s.id) || (s.parent_subject_id !== null && preferred.has(s.parent_subject_id))
    )
    .sort(
      (a, b) =>
        a.chapters.subjects.name.localeCompare(b.chapters.subjects.name, 'fr') ||
        (a.chapters.order_index ?? 0) - (b.chapters.order_index ?? 0) ||
        a.title.localeCompare(b.title, 'fr')
    )

  // Cartes déjà créées par l'élève (sans liste d'identifiants dans l'URL).
  const { data: owned, error: cardsError } = await supabase
    .from('flashcards')
    .select('lesson_id')
    .eq('user_id', user.id)
    .not('lesson_id', 'is', null)
  if (cardsError) {
    console.error('[/api/flashcards/sources] flashcard lookup failed', cardsError)
    return NextResponse.json(
      { error: { code: 'DB_ERROR', message: 'Impossible de charger tes cartes.' } },
      { status: 500 }
    )
  }
  const withCards = new Set((owned ?? []).map((card) => card.lesson_id))

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
  return NextResponse.json({
    data: lessons.map(({ id, title, chapters }) => ({
      id,
      title,
      chapter_title: chapters.title,
      subject_name: chapters.subjects.name,
      has_cards: withCards.has(id),
    })),
    remaining: hasUnlimitedCards ? null : Math.max(0, FREE_TIER.maxFlashcards - (totalOwned ?? 0)),
    limit: hasUnlimitedCards ? null : FREE_TIER.maxFlashcards,
  })
}
