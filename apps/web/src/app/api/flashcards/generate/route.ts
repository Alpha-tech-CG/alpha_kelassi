import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { z } from 'zod'
import { FREE_TIER } from '@alpha-kelassi/types'
import { getEntitlements, planRequired, planRequiredFromDbError } from '@/lib/subscription/server'
import { extractFlashcards } from '@/lib/flashcards/extract'

const schema = z
  .object({
    document_id: z.string().uuid().optional(),
    lesson_id: z.string().uuid().optional(),
    count: z.number().int().min(1).max(20).default(10),
  })
  .refine((input) => Boolean(input.document_id) !== Boolean(input.lesson_id), {
    message: 'Choisis un document ou une leçon.',
  })

/**
 * POST /api/flashcards/generate — crée des flashcards à partir d'un cours (ou d'un PDF).
 * Les cartes sont tirées du texte du cours par lib/flashcards/extract.ts : pas d'IA,
 * donc ni quota Gemini, ni panne, ni attente.
 */
export async function POST(req: NextRequest) {
  const { user, supabase } = await authenticate(req)
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'Corps invalide' }, { status: 400 })
  }

  const { document_id, lesson_id } = body
  let { count } = body

  // Gratuit : jusqu'à 20 cartes ; la base garde aussi sa limite (concurrence).
  const ent = await getEntitlements(user.id)
  if (!ent.can('flashcards')) {
    const { count: owned, error: countError } = await supabase
      .from('flashcards')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
    if (countError) {
      console.error('[/api/flashcards/generate] quota lookup failed', countError)
      return NextResponse.json(
        { error: { code: 'DB_ERROR', message: 'Impossible de vérifier ton quota.' } },
        { status: 500 }
      )
    }
    const room = FREE_TIER.maxFlashcards - (owned ?? 0)
    if (room <= 0) return planRequired('flashcards')
    count = Math.min(count, room)
  }

  let sourceTitle: string
  let text: string

  if (lesson_id) {
    const [{ data: lesson, error: lessonError }, { data: profile, error: profileError }] =
      await Promise.all([
        supabase
          .from('lessons')
          .select('id, title, content, chapters!inner(subjects!inner(id, level, parent_subject_id))')
          .eq('id', lesson_id)
          .in('type', ['cours', 'resume'])
          .maybeSingle(),
        supabase
          .from('users')
          .select('study_level_pref, subject_ids_pref')
          .eq('id', user.id)
          .maybeSingle(),
      ])
    if (lessonError || profileError) {
      console.error('[/api/flashcards/generate] lookup failed', lessonError ?? profileError)
      return NextResponse.json(
        { error: { code: 'DB_ERROR', message: 'Impossible de charger le cours.' } },
        { status: 500 }
      )
    }
    const subject = (
      lesson as unknown as {
        chapters?: { subjects?: { id: string; level: string; parent_subject_id: string | null } }
      } | null
    )?.chapters?.subjects
    if (!lesson || !lesson.content?.trim() || !subject) {
      return NextResponse.json(
        { error: { code: 'SOURCE_NOT_FOUND', message: 'Ce cours est introuvable ou inaccessible.' } },
        { status: 404 }
      )
    }
    const prefs = profile?.subject_ids_pref ?? []
    if (
      (profile?.study_level_pref && profile.study_level_pref !== subject.level) ||
      (prefs.length > 0 &&
        !prefs.includes(subject.id) &&
        !(subject.parent_subject_id && prefs.includes(subject.parent_subject_id)))
    ) {
      return NextResponse.json(
        { error: { code: 'SOURCE_NOT_FOUND', message: 'Ce cours ne fait pas partie de ton parcours.' } },
        { status: 404 }
      )
    }

    const { count: existingCount, error: existingError } = await supabase
      .from('flashcards')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('lesson_id', lesson_id)
    if (existingError) {
      console.error('[/api/flashcards/generate] existing-card lookup failed', existingError)
      return NextResponse.json(
        { error: { code: 'DB_ERROR', message: 'Impossible de vérifier les cartes existantes.' } },
        { status: 500 }
      )
    }
    if ((existingCount ?? 0) > 0) {
      return NextResponse.json(
        { error: { code: 'ALREADY_GENERATED', message: 'Tu as déjà des cartes pour ce cours.' } },
        { status: 409 }
      )
    }

    sourceTitle = lesson.title
    text = lesson.content
  } else {
    const { data: chunks, error: chunksError } = await supabase
      .from('document_chunks')
      .select('content')
      .eq('document_id', document_id!)
      .order('chunk_index', { ascending: true })
      .limit(60)
    if (chunksError) {
      console.error('[/api/flashcards/generate] document lookup failed', chunksError)
      return NextResponse.json(
        { error: { code: 'DB_ERROR', message: 'Impossible de charger le document.' } },
        { status: 500 }
      )
    }
    if (!chunks || chunks.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_INDEXED',
            message: 'Ce document n’est pas encore indexé. Réessaie dans quelques minutes.',
          },
        },
        { status: 422 }
      )
    }
    const { data: document } = await supabase
      .from('documents')
      .select('title')
      .eq('id', document_id!)
      .maybeSingle()
    sourceTitle = document?.title ?? 'Document'
    text = chunks.map((chunk) => chunk.content).join('\n\n')
  }

  const cards = extractFlashcards(text, count, sourceTitle)
  if (cards.length === 0) {
    return NextResponse.json(
      {
        error: {
          code: 'NO_CARDS',
          message: 'Ce cours ne contient pas assez de définitions ou de notions à retenir pour en faire des cartes. Essaie un autre cours.',
        },
      },
      { status: 422 }
    )
  }

  const rows = cards.map((card) => ({
    user_id: user.id,
    document_id: document_id ?? null,
    lesson_id: lesson_id ?? null,
    front: card.front.slice(0, 500),
    back: card.back.slice(0, 2000),
  }))

  const { data: inserted, error: dbError } = await supabase.from('flashcards').insert(rows).select()
  if (dbError) {
    const locked = planRequiredFromDbError(dbError.message)
    if (locked) return locked
    console.error('[/api/flashcards/generate]', dbError)
    return NextResponse.json(
      { error: { code: 'DB_ERROR', message: 'Une erreur est survenue, réessaie plus tard.' } },
      { status: 500 }
    )
  }
  return NextResponse.json({ data: inserted, count: inserted?.length ?? 0 }, { status: 201 })
}
