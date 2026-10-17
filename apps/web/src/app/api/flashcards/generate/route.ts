import { NextRequest, NextResponse } from 'next/server'
import { authenticate } from '@/lib/supabase/api'
import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'
import { FREE_TIER } from '@alpha-kelassi/types'
import { getEntitlements, planRequired, planRequiredFromDbError } from '@/lib/subscription/server'

export const maxDuration = 60

let _genai: GoogleGenAI | null = null
function getGenai() {
  if (!_genai) _genai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] ?? '' })
  return _genai
}

const schema = z
  .object({
    document_id: z.string().uuid().optional(),
    lesson_id: z.string().uuid().optional(),
    count: z.number().int().min(1).max(20).default(10),
  })
  .refine((input) => Boolean(input.document_id) !== Boolean(input.lesson_id), {
    message: 'Choisis un document ou une leçon.',
  })

/** POST /api/flashcards/generate — génère des flashcards IA depuis un cours */
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

  // Gratuit : jusqu'à 20 cartes seulement. Vérifié avant l'appel Gemini ;
  // la base conserve également sa limite comme protection contre la concurrence.
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
  let context: string

  if (lesson_id) {
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id, title, content, chapter_id')
      .eq('id', lesson_id)
      .eq('type', 'cours')
      .maybeSingle()

    if (lessonError) {
      console.error('[/api/flashcards/generate] lesson lookup failed', lessonError)
      return NextResponse.json(
        { error: { code: 'DB_ERROR', message: 'Impossible de charger le cours.' } },
        { status: 500 }
      )
    }
    if (!lesson || !lesson.content?.trim()) {
      return NextResponse.json(
        {
          error: { code: 'SOURCE_NOT_FOUND', message: 'Ce cours est introuvable ou inaccessible.' },
        },
        { status: 404 }
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('study_level_pref, subject_ids_pref')
      .eq('id', user.id)
      .maybeSingle()
    if (profileError) {
      console.error('[/api/flashcards/generate] profile lookup failed', profileError)
      return NextResponse.json(
        { error: { code: 'DB_ERROR', message: 'Impossible de vérifier ton parcours.' } },
        { status: 500 }
      )
    }

    const { data: chapter, error: chapterError } = await supabase
      .from('chapters')
      .select('subject_id')
      .eq('id', lesson.chapter_id)
      .maybeSingle()
    if (chapterError) {
      console.error('[/api/flashcards/generate] chapter lookup failed', chapterError)
      return NextResponse.json(
        { error: { code: 'DB_ERROR', message: 'Impossible de vérifier le chapitre.' } },
        { status: 500 }
      )
    }
    if (!chapter) {
      return NextResponse.json(
        {
          error: { code: 'SOURCE_NOT_FOUND', message: 'Ce cours est introuvable ou inaccessible.' },
        },
        { status: 404 }
      )
    }

    const { data: subject, error: subjectError } = await supabase
      .from('subjects')
      .select('id, level, parent_subject_id')
      .eq('id', chapter.subject_id)
      .maybeSingle()
    if (subjectError) {
      console.error('[/api/flashcards/generate] subject lookup failed', subjectError)
      return NextResponse.json(
        { error: { code: 'DB_ERROR', message: 'Impossible de vérifier la matière.' } },
        { status: 500 }
      )
    }
    if (
      !subject ||
      (profile?.study_level_pref && profile.study_level_pref !== subject.level) ||
      (profile?.subject_ids_pref?.length &&
        !profile.subject_ids_pref.includes(subject.id) &&
        (!subject.parent_subject_id ||
          !profile.subject_ids_pref.includes(subject.parent_subject_id)))
    ) {
      return NextResponse.json(
        {
          error: {
            code: 'SOURCE_NOT_FOUND',
            message: 'Ce cours ne fait pas partie de ton parcours.',
          },
        },
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
    context = lesson.content.slice(0, 8000)
  } else {
    if (!document_id) {
      return NextResponse.json({ error: 'Corps invalide' }, { status: 400 })
    }
    const documentId = document_id
    const { data: chunks, error: chunksError } = await supabase
      .from('document_chunks')
      .select('content')
      .eq('document_id', documentId)
      .order('chunk_index', { ascending: true })
      .limit(30)

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

    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('title')
      .eq('id', documentId)
      .maybeSingle()
    if (documentError) {
      console.error('[/api/flashcards/generate] document metadata lookup failed', documentError)
      return NextResponse.json(
        { error: { code: 'DB_ERROR', message: 'Impossible de charger le document.' } },
        { status: 500 }
      )
    }
    sourceTitle = document?.title ?? 'Document'
    context = chunks
      .map((chunk) => chunk.content)
      .join('\n\n---\n\n')
      .slice(0, 8000)
  }

  const prompt = `Tu es un expert pédagogique. À partir du cours « ${sourceTitle} » ci-dessous, génère exactement ${count} flashcards pour aider un élève congolais à réviser.

Règles :
- Recto (front) : question courte et précise (max 120 caractères)
- Verso (back) : réponse concise (max 300 caractères), avec un exemple concret si possible
- Couvre les concepts clés, définitions et formules importantes
- Varie les types : définition, application, exemple, calcul

Retourne UNIQUEMENT un tableau JSON valide, sans markdown, sans commentaires :
[{"front":"...","back":"..."},...]

Contenu du cours :
${context}`

  let raw: string
  try {
    const response = await getGenai().models.generateContent({
      model: 'gemini-2.5-flash',
      config: { thinkingConfig: { thinkingBudget: 0 } },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })
    raw = response.text ?? ''
  } catch (error) {
    console.error('[/api/flashcards/generate] Gemini request failed', error)
    return NextResponse.json(
      {
        error: {
          code: 'GENERATION_ERROR',
          message: 'La génération a échoué. Vérifie ta connexion puis réessaie.',
        },
      },
      { status: 502 }
    )
  }

  let cards: Array<{ front: string; back: string }>
  try {
    const jsonStr = raw.startsWith('[')
      ? raw
      : raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1)
    const parsed: unknown = JSON.parse(jsonStr)
    if (!Array.isArray(parsed)) throw new Error('Response is not an array')
    cards = parsed
      .map((card: unknown) => {
        if (
          typeof card !== 'object' ||
          card === null ||
          !('front' in card) ||
          !('back' in card) ||
          typeof card.front !== 'string' ||
          typeof card.back !== 'string' ||
          !card.front.trim() ||
          !card.back.trim()
        )
          throw new Error('Response contains an invalid card')
        return { front: card.front.trim().slice(0, 500), back: card.back.trim().slice(0, 2000) }
      })
      .filter((card) => card.front && card.back)
      .slice(0, count)
    if (cards.length === 0) throw new Error('Response contains no cards')
  } catch (error) {
    console.error('[/api/flashcards/generate] invalid Gemini response', error)
    return NextResponse.json(
      { error: { code: 'GENERATION_ERROR', message: 'Erreur de génération. Réessaie.' } },
      { status: 500 }
    )
  }

  const rows = cards.slice(0, count).map((card) => ({
    user_id: user.id,
    document_id: document_id ?? null,
    lesson_id: lesson_id ?? null,
    front: card.front,
    back: card.back,
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
