import { Hono } from 'hono'
import type { AppVariables } from '../lib/types.js'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { GoogleGenAI } from '@google/genai'
import { authMiddleware } from '../middleware/auth.js'
import { adminDb, COLLECTIONS } from '../lib/firebase.js'
import { computeSM2 } from '../lib/sm2.js'
import { FieldValue } from 'firebase-admin/firestore'

const router = new Hono<{ Variables: AppVariables }>()
const genai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY']! })

router.use('*', authMiddleware)

// GET /flashcards/due — cartes à réviser aujourd'hui
router.get('/due', async (c) => {
  const userId = c.get('userId')
  const limit  = Math.min(parseInt(c.req.query('limit') ?? '20', 10), 50)
  const now    = new Date().toISOString()

  const snap = await adminDb.collection(COLLECTIONS.FLASHCARDS)
    .where('user_id', '==', userId)
    .where('next_review', '<=', now)
    .orderBy('next_review', 'asc')
    .limit(limit)
    .get()

  const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return c.json({ data, count: data.length })
})

// GET /flashcards — toutes les cartes
router.get('/', async (c) => {
  const userId     = c.get('userId')
  const documentId = c.req.query('document_id')

  let ref = adminDb.collection(COLLECTIONS.FLASHCARDS)
    .where('user_id', '==', userId)
    .orderBy('created_at', 'desc')
    .limit(200) as FirebaseFirestore.Query

  if (documentId) ref = ref.where('document_id', '==', documentId)

  const snap = await ref.get()
  const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return c.json({ data })
})

// POST /flashcards/review — enregistre une révision SM-2
router.post(
  '/review',
  zValidator('json', z.object({
    flashcard_id: z.string(),
    quality:      z.number().int().min(0).max(5),
  })),
  async (c) => {
    const userId                   = c.get('userId')
    const { flashcard_id, quality } = c.req.valid('json')

    const cardRef  = adminDb.collection(COLLECTIONS.FLASHCARDS).doc(flashcard_id)
    const cardSnap = await cardRef.get()

    if (!cardSnap.exists || cardSnap.data()?.user_id !== userId) {
      return c.json({ error: { code: 'NOT_FOUND' } }, 404)
    }

    const card   = cardSnap.data()!
    const result = computeSM2(
      { easeFactor: card['ease_factor'], interval: card['interval'], reps: card['reps'] },
      quality
    )

    const update = {
      ease_factor: result.easeFactor,
      interval:    result.interval,
      reps:        result.reps,
      next_review: result.nextReview.toISOString(),
      updated_at:  FieldValue.serverTimestamp(),
    }
    await cardRef.update(update)

    const xpAmount = quality >= 4 ? 3 : quality >= 3 ? 2 : 0
    if (xpAmount > 0) {
      const { awardXP, checkAndAwardBadges } = await import('../lib/xp.js')
      Promise.allSettled([awardXP(userId, xpAmount), checkAndAwardBadges(userId)])
    }

    return c.json({ data: { id: flashcard_id, ...card, ...update } })
  }
)

// POST /flashcards/generate — génère des flashcards IA depuis un document
router.post(
  '/generate',
  zValidator('json', z.object({
    document_id: z.string(),
    count:       z.number().int().min(1).max(20).default(10),
  })),
  async (c) => {
    const userId                  = c.get('userId')
    const { document_id, count }  = c.req.valid('json')

    const chunksSnap = await adminDb.collection(COLLECTIONS.DOCUMENT_CHUNKS)
      .where('document_id', '==', document_id)
      .orderBy('chunk_index', 'asc')
      .limit(30)
      .get()

    if (chunksSnap.empty) {
      return c.json({ error: { code: 'NOT_INDEXED', message: 'Document pas encore indexé. Réessaie dans quelques minutes.' } }, 422)
    }

    const context = chunksSnap.docs.map((d) => d.data()['content']).join('\n\n---\n\n').slice(0, 8000)

    const prompt = `Tu es un expert pédagogique. À partir du contenu ci-dessous, génère exactement ${count} flashcards pour un élève congolais.

Règles :
- Recto : question courte et précise (max 120 caractères)
- Verso : réponse concise (max 300 caractères)
- Varie les types : définition, application, exemple, calcul
- Retourne UNIQUEMENT un tableau JSON valide, sans markdown :
[{"front":"...","back":"..."},...]

Contenu :
${context}`

    const response = await genai.models.generateContent({
      model:    'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })
    const raw = response.text ?? ''

    let cards: Array<{ front: string; back: string }>
    try {
      const jsonStr = raw.startsWith('[') ? raw : raw.slice(raw.indexOf('['), raw.lastIndexOf(']') + 1)
      cards = JSON.parse(jsonStr)
      if (!Array.isArray(cards)) throw new Error('Not an array')
    } catch {
      return c.json({ error: { code: 'GENERATION_ERROR', message: 'Erreur de génération. Réessaie.' } }, 500)
    }

    const now    = new Date().toISOString()
    const batch  = adminDb.batch()
    const inserted: { id: string; front: string; back: string }[] = []

    for (const card of cards.slice(0, count)) {
      const ref = adminDb.collection(COLLECTIONS.FLASHCARDS).doc()
      batch.set(ref, {
        user_id:     userId,
        document_id,
        front:       card.front,
        back:        card.back,
        ease_factor: 2.5,
        interval:    1,
        reps:        0,
        next_review: now,
        created_at:  FieldValue.serverTimestamp(),
      })
      inserted.push({ id: ref.id, ...card })
    }

    await batch.commit()
    return c.json({ data: inserted, count: inserted.length }, 201)
  }
)

// DELETE /flashcards/:id
router.delete('/:id', async (c) => {
  const userId = c.get('userId')
  const id     = c.req.param('id')

  const cardSnap = await adminDb.collection(COLLECTIONS.FLASHCARDS).doc(id).get()
  if (cardSnap.exists && cardSnap.data()?.user_id === userId) {
    await adminDb.collection(COLLECTIONS.FLASHCARDS).doc(id).delete()
  }

  return c.json({ data: { deleted: true } })
})

export { router as flashcardsRouter }
