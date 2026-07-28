import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin, supabaseAdmin } from '@/lib/admin-guard'
import { GoogleGenAI } from '@google/genai'

let _genai: GoogleGenAI | null = null
function getGenai(): GoogleGenAI {
  if (!_genai) _genai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] ?? '' })
  return _genai
}

/**
 * POST /api/admin/curriculum/lessons/:id/generate-resume
 * Génère le résumé de la leçon :id depuis le contenu de la leçon 'cours' du même
 * chapitre, et l'écrit dans lessons.content de la leçon :id.
 */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const guard = await requireAdmin()
  if ('error' in guard) return guard.error
  const { id } = await params

  const { data: target, error: tErr } = await supabaseAdmin
    .from('lessons')
    .select('id, chapter_id, chapters(subject_id, subjects(name, level))')
    .eq('id', id)
    .maybeSingle()
  if (tErr) return NextResponse.json({ error: { code: 'DB_ERROR', message: tErr.message } }, { status: 500 })
  if (!target) return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Leçon introuvable' } }, { status: 404 })

  const { data: courseLesson } = await supabaseAdmin
    .from('lessons')
    .select('content')
    .eq('chapter_id', (target as { chapter_id: string }).chapter_id)
    .eq('type', 'cours')
    .not('content', 'is', null)
    .order('order_index')
    .limit(1)
    .maybeSingle()

  const source = (courseLesson as { content?: string } | null)?.content?.trim()
  if (!source || source.length < 40) {
    return NextResponse.json({ error: { code: 'NO_SOURCE', message: 'Aucun cours exploitable dans ce chapitre pour générer un résumé.' } }, { status: 422 })
  }

  const subject = (target as { chapters?: { subjects?: { name?: string; level?: string } } }).chapters?.subjects
  const examLabel = ({
    bepc: 'le BEPC', bac_a: 'le BAC série A', bac_c: 'le BAC série C', bac_d: 'le BAC série D',
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
    return NextResponse.json({ error: { code: 'GENERATION_ERROR', message: `Génération échouée : ${(err as Error).message}` } }, { status: 502 })
  }

  const { data, error } = await supabaseAdmin.from('lessons').update({ content: resume }).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: { code: 'DB_ERROR', message: error.message } }, { status: 500 })

  return NextResponse.json({ data })
}
