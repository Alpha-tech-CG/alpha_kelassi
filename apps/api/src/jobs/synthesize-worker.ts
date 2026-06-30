import { Worker, Job } from 'bullmq'
import { GoogleGenAI } from '@google/genai'
import { supabaseAdmin as supabase } from '../lib/supabase.js'
import type { SynthesizeJobData } from './synthesize-queue.js'

// ── Gemini ────────────────────────────────────────────────────────────────────

let _genai: GoogleGenAI | null = null
function getGenai(): GoogleGenAI {
  if (!_genai) _genai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY']! })
  return _genai
}

// ── Prompt pédagogique ────────────────────────────────────────────────────────

function buildPrompt(chapterTitle: string, level: string, text: string): string {
  const exam = level === 'bepc' ? 'BEPC' : 'BAC'
  return `Tu es un expert pédagogue congolais spécialisé dans la préparation au ${exam} (MEPSA).
Génère une fiche de révision structurée à partir du texte de cours ci-dessous.

TEXTE SOURCE :
"""
${text.slice(0, 6000)}
"""

STRUCTURE OBLIGATOIRE (Markdown, respecte exactement ces balises) :

# ${chapterTitle}

## 🎯 Objectifs ${exam}
- Compétences et savoirs directement évaluables au ${exam} issus de ce chapitre (liste à puces, max 5).

## 📌 Concepts Clés
| Terme | Définition | Exemple concret |
|-------|-----------|----------------|
(3 à 7 lignes — termes du programme officiel congolais)

## 📝 Résumé du chapitre
Synthèse structurée en **250 mots maximum**. Inclure les idées essentielles dans l'ordre logique du cours.

## 📐 Formules & Lois à retenir
(Pour maths/physique/chimie/SVT uniquement. Utilise LaTeX inline $...$ et bloc $$...$$. Si pas applicable, omet cette section.)

## ❓ Questions d'évaluation type ${exam}
1. [question type dissertation/développement]
   **Réponse attendue :** …
2. [question type calcul ou analyse]
   **Réponse attendue :** …
3. [question type définition ou QCM]
   **Réponse attendue :** …

Réponds UNIQUEMENT avec le Markdown de la fiche. Pas d'introduction, pas de commentaire.`
}

// ── Découpage en chapitres ────────────────────────────────────────────────────

const HEADING_RE = /^(Chapitre|Chapter|CHAPITRE|Section|SECTION|Partie|PARTIE|Thème|THÈME|Leçon|LEÇON|Unit[eé])\s+\S.*$/m

interface RawChapter {
  title: string
  text:  string
}

function splitIntoChapters(text: string): RawChapter[] {
  const lines = text.split('\n')

  // Essaie le découpage structurel par titres
  const headings: { title: string; lineIdx: number }[] = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim()
    if (line.length > 3 && line.length < 120 && HEADING_RE.test(line)) {
      headings.push({ title: line, lineIdx: i })
    }
  }

  if (headings.length >= 3) {
    const chapters: RawChapter[] = []
    for (let h = 0; h < headings.length; h++) {
      const start   = headings[h]!.lineIdx
      const end     = headings[h + 1]?.lineIdx ?? lines.length
      const content = lines.slice(start, end).join('\n').trim()
      if (content.length >= 300) {
        chapters.push({ title: headings[h]!.title, text: content })
      }
    }
    if (chapters.length >= 2) return chapters
  }

  // Fallback : découpage par taille (8 000 chars, chevauchement 800)
  return sizeBasedSplit(text, 8_000, 800)
}

function sizeBasedSplit(text: string, size: number, overlap: number): RawChapter[] {
  const chapters: RawChapter[] = []
  let start = 0
  let idx   = 1

  while (start < text.length) {
    // Coupe proprement à la dernière ligne complète dans la fenêtre
    let end = Math.min(start + size, text.length)
    if (end < text.length) {
      const lastNl = text.lastIndexOf('\n', end)
      if (lastNl > start + size / 2) end = lastNl
    }
    const slice = text.slice(start, end).trim()
    if (slice.length >= 200) {
      chapters.push({ title: `Partie ${idx}`, text: slice })
      idx++
    }
    start = end - overlap
    if (start >= text.length) break
  }

  return chapters
}

// ── Worker ────────────────────────────────────────────────────────────────────

async function synthesizeChapter(
  chapterId: string,
  chapterTitle: string,
  rawText: string,
  level: string,
): Promise<void> {
  await supabase
    .from('course_chapters')
    .update({ status: 'processing' })
    .eq('id', chapterId)

  try {
    const prompt = buildPrompt(chapterTitle, level, rawText)
    const result = await getGenai().models.generateContent({
      model:    'gemini-2.5-flash',
      config:   { thinkingConfig: { thinkingBudget: 1024 } },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })
    const summaryMd = result.text ?? ''
    if (!summaryMd.trim()) throw new Error('Réponse Gemini vide')

    await supabase
      .from('course_chapters')
      .update({ summary_md: summaryMd, raw_text: null, status: 'done' })
      .eq('id', chapterId)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    await supabase
      .from('course_chapters')
      .update({ status: 'error', error_message: msg })
      .eq('id', chapterId)
    throw err
  }
}

async function processSynthesizeJob(job: Job<SynthesizeJobData>) {
  const { document_id, title: docTitle, level = 'bac_c' } = job.data

  await job.updateProgress(5)

  // 1. Récupère le texte du document
  const { data: doc, error: docErr } = await supabase
    .from('documents')
    .select('text_content')
    .eq('id', document_id)
    .single()

  if (docErr || !doc?.text_content) {
    throw new Error('Document sans texte — lance d\'abord l\'embed job')
  }

  await job.updateProgress(10)

  // 2. Découpe en chapitres
  const rawChapters = splitIntoChapters(doc.text_content)
  console.log(`[synthesize-worker] ${rawChapters.length} chapitres détectés pour "${docTitle}"`)

  // 3. Supprime les anciens chapitres et insère les nouveaux (pending)
  await supabase.from('course_chapters').delete().eq('document_id', document_id)

  const rows = rawChapters.map((ch, i) => ({
    document_id,
    chapter_number: i + 1,
    title:          ch.title,
    raw_text:       ch.text,
    word_count:     ch.text.split(/\s+/).length,
    status:         'pending' as const,
  }))

  const { data: inserted, error: insErr } = await supabase
    .from('course_chapters')
    .insert(rows)
    .select('id, title, raw_text')

  if (insErr || !inserted) {
    throw new Error(`Insertion chapitres échouée : ${insErr?.message}`)
  }

  await job.updateProgress(20)

  // 4. Synthèse Gemini par batches de 3 (évite le rate-limit)
  const BATCH = 3
  for (let i = 0; i < inserted.length; i += BATCH) {
    const batch = inserted.slice(i, i + BATCH)
    await Promise.allSettled(
      batch.map((ch) =>
        synthesizeChapter(ch.id, ch.title, ch.raw_text ?? '', level)
      )
    )
    const progress = 20 + Math.round(((i + BATCH) / inserted.length) * 75)
    await job.updateProgress(Math.min(progress, 95))
  }

  // 5. Marque le document comme synthétisé
  await supabase
    .from('documents')
    .update({ synthesized_at: new Date().toISOString() })
    .eq('id', document_id)

  await job.updateProgress(100)

  const doneCount = inserted.length
  console.log(`[synthesize-worker] ${doneCount} chapitres synthétisés pour "${docTitle}"`)
  return { document_id, chapters_count: doneCount }
}

export function startSynthesizeWorker() {
  const worker = new Worker<SynthesizeJobData>(
    'synthesize_chapters',
    processSynthesizeJob,
    {
      connection:  { url: process.env['QUEUE_REDIS_URL']! },
      concurrency: 1,  // 1 document à la fois (Gemini rate-limit)
    }
  )

  worker.on('completed', (job) => {
    console.log(`[synthesize-worker] Job ${job.id} terminé`)
  })

  worker.on('failed', (job, err) => {
    console.error(`[synthesize-worker] Job ${job?.id} échoué :`, err.message)
  })

  worker.on('progress', (job, progress) => {
    console.log(`[synthesize-worker] Job ${job.id} — ${progress}%`)
  })

  return worker
}
