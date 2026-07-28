import { Hono } from 'hono'
import type { AppVariables } from '../../lib/types.js'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { GoogleGenAI } from '@google/genai'
import { supabaseAdmin as supabase } from '../../lib/supabase.js'
import { authMiddleware } from '../../middleware/auth.js'

const router = new Hono<{ Variables: AppVariables }>()

router.use('*', authMiddleware)

// Admin uniquement
router.use('*', async (c, next) => {
  const userId = c.get('userId')
  const { data: user } = await supabase.from('users').select('role').eq('id', userId).single()
  if (user?.role !== 'admin') {
    return c.json({ error: { code: 'FORBIDDEN', message: 'Admin requis' } }, 403)
  }
  await next()
})

// Lazy — évite de faire planter le serveur si GEMINI_API_KEY est absente
let _genai: GoogleGenAI | null = null
function getGenai(): GoogleGenAI {
  if (!_genai) _genai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] ?? '' })
  return _genai
}

/* ── Séries ───────────────────────────────────────────────────────────────── */
const seriesSchema = z.object({
  code:         z.string().min(1).max(8),
  label:        z.string().min(3).max(120),
  track:        z.enum(['generale', 'technique', 'professionnel']),
  level:        z.enum(['bepc', 'bac_a', 'bac_c', 'bac_d']),
  country_code: z.string().length(2).default('CG'),
})

router.post('/series', zValidator('json', seriesSchema), async (c) => {
  const body = c.req.valid('json')
  const { data, error } = await supabase.from('series').insert(body).select().single()
  if (error) {
    if (error.code === '23505') {
      return c.json({ error: { code: 'DUPLICATE', message: 'Cette série existe déjà pour ce niveau.' } }, 409)
    }
    return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  }
  return c.json({ data }, 201)
})

/* ── Chapitres ────────────────────────────────────────────────────────────── */
const chapterSchema = z.object({
  subject_id:  z.string().uuid(),
  series_id:   z.string().uuid().nullish(),
  title:       z.string().min(2).max(160),
  order_index: z.number().int().min(0).default(0),
  description: z.string().max(500).nullish(),
})

router.post('/chapters', zValidator('json', chapterSchema), async (c) => {
  const b = c.req.valid('json')
  const { data, error } = await supabase.from('chapters').insert({
    subject_id:  b.subject_id,
    series_id:   b.series_id ?? null,
    title:       b.title,
    order_index: b.order_index,
    description: b.description ?? null,
  }).select().single()
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data }, 201)
})

router.put('/chapters/:id', zValidator('json', chapterSchema.partial()), async (c) => {
  const id = c.req.param('id')
  const updates = c.req.valid('json')
  const { data, error } = await supabase.from('chapters').update(updates).eq('id', id).select().single()
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data })
})

router.delete('/chapters/:id', async (c) => {
  const id = c.req.param('id')
  const { error } = await supabase.from('chapters').delete().eq('id', id)
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data: { deleted: true } })
})

/* ── Leçons ───────────────────────────────────────────────────────────────── */
const lessonSchema = z.object({
  chapter_id:   z.string().uuid(),
  type:         z.enum(['cours', 'resume', 'quiz', 'video']),
  title:        z.string().min(2).max(160),
  content:      z.string().nullish(),
  video_url:    z.string().url().nullish(),
  duration_min: z.number().int().min(0).max(600).nullish(),
  is_premium:   z.boolean().default(false),
  order_index:  z.number().int().min(0).default(0),
})

router.post('/lessons', zValidator('json', lessonSchema), async (c) => {
  const b = c.req.valid('json')
  const { data, error } = await supabase.from('lessons').insert({
    chapter_id:   b.chapter_id,
    type:         b.type,
    title:        b.title,
    content:      b.content ?? null,
    video_url:    b.video_url ?? null,
    duration_min: b.duration_min ?? null,
    is_premium:   b.is_premium,
    order_index:  b.order_index,
  }).select().single()
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data }, 201)
})

router.put('/lessons/:id', zValidator('json', lessonSchema.partial()), async (c) => {
  const id = c.req.param('id')
  const updates = c.req.valid('json')
  const { data, error } = await supabase.from('lessons').update(updates).eq('id', id).select().single()
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data })
})

router.delete('/lessons/:id', async (c) => {
  const id = c.req.param('id')
  const { error } = await supabase.from('lessons').delete().eq('id', id)
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)
  return c.json({ data: { deleted: true } })
})

/* ── Génération IA d'un résumé ────────────────────────────────────────────────
 * Génère le résumé de la leçon :id à partir du contenu de la leçon 'cours' du
 * même chapitre, et écrit le résultat dans lessons.content de la leçon :id. */
router.post('/lessons/:id/generate-resume', async (c) => {
  const id = c.req.param('id')

  // Leçon cible + son chapitre (pour retrouver le cours source et le niveau)
  const { data: target, error: tErr } = await supabase
    .from('lessons')
    .select('id, chapter_id, chapters(subject_id, subjects(name, level))')
    .eq('id', id)
    .maybeSingle()
  if (tErr) return c.json({ error: { code: 'DB_ERROR', message: tErr.message } }, 500)
  if (!target) return c.json({ error: { code: 'NOT_FOUND', message: 'Leçon introuvable' } }, 404)

  // Contenu du cours source dans le même chapitre
  const { data: courseLesson } = await supabase
    .from('lessons')
    .select('content')
    .eq('chapter_id', target.chapter_id)
    .eq('type', 'cours')
    .not('content', 'is', null)
    .order('order_index')
    .limit(1)
    .maybeSingle()

  const source = courseLesson?.content?.trim()
  if (!source || source.length < 40) {
    return c.json({ error: { code: 'NO_SOURCE', message: 'Aucun cours exploitable dans ce chapitre pour générer un résumé.' } }, 422)
  }

  const subject = (target.chapters as { subjects?: { name?: string; level?: string } } | null)?.subjects
  const examLabel = ({
    bepc:  'le BEPC', bac_a: 'le BAC série A', bac_c: 'le BAC série C', bac_d: 'le BAC série D',
  } as Record<string, string>)[subject?.level ?? ''] ?? "l'examen d'État"

  const prompt = `Génère un résumé de révision concis et structuré en bullet points pour un élève congolais préparant ${examLabel}${subject?.name ? ` (matière : ${subject.name})` : ''}. Utilise des exemples locaux si pertinent. Écris en français, en Markdown, sans introduction ni conclusion superflue.

Contenu du cours :
${source}`

  let resume: string
  try {
    const response = await getGenai().models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })
    resume = (response.text ?? '').trim()
    if (!resume) throw new Error('réponse vide')
  } catch (err) {
    return c.json({ error: { code: 'GENERATION_ERROR', message: `Génération échouée : ${(err as Error).message}` } }, 502)
  }

  // Écrit le résumé dans la leçon cible
  const { data, error } = await supabase
    .from('lessons')
    .update({ content: resume })
    .eq('id', id)
    .select()
    .single()
  if (error) return c.json({ error: { code: 'DB_ERROR', message: error.message } }, 500)

  return c.json({ data })
})

export { router as adminCurriculumRouter }
