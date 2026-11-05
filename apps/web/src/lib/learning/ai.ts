import { GoogleGenAI } from '@google/genai'
import type { MissedQuestion, RevisionRecommendation, SubjectErrorStat, SubjectProgress } from './analytics'

/**
 * Analyses IA des fonctionnalités Pro Max. Chaque fonction renvoie un repli
 * lisible si Gemini n'est pas configuré ou échoue : l'élève n'a jamais un
 * écran vide ni une erreur technique.
 */

let _genai: GoogleGenAI | null = null
function genai(): GoogleGenAI | null {
  const key = process.env['GEMINI_API_KEY']
  if (!key) return null
  if (!_genai) _genai = new GoogleGenAI({ apiKey: key })
  return _genai
}

async function askJson<T>(prompt: string, parts: object[] = []): Promise<T | null> {
  const client = genai()
  if (!client) return null
  try {
    const resp = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      config: { thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json' },
      contents: [{ role: 'user', parts: [{ text: prompt }, ...parts] }],
    })
    const text = resp.text ?? ''
    const start = text.search(/[[{]/)
    return JSON.parse(start > 0 ? text.slice(start) : text) as T
  } catch (err) {
    console.error('[learning/ai]', err instanceof Error ? err.message : err)
    return null
  }
}

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n)}…` : s)

/* ── Erreurs récurrentes ──────────────────────────────────────────────────── */

export interface RecurringError {
  pattern: string
  subject: string
  evidence: string
  remedy: string
}

export async function recurringErrors(missed: MissedQuestion[]): Promise<{ generated: boolean; items: RecurringError[] }> {
  if (missed.length === 0) return { generated: false, items: [] }

  const list = missed.map((m, i) =>
    `${i + 1}. [${m.subject_name}${m.chapter_title ? ` — ${m.chapter_title}` : ''}] ratée ${m.times_wrong} fois sur ${m.times_answered} : ${clip(m.prompt.replace(/\s+/g, ' '), 220)}`
    + (m.explanation ? `\n   Explication attendue : ${clip(m.explanation.replace(/\s+/g, ' '), 220)}` : '')).join('\n')

  const ai = await askJson<{ items?: RecurringError[] }>(
    `Tu es professeur au Congo et tu analyses les QCM ratés par un élève de terminale.\n` +
    `Identifie 2 à 4 ERREURS RÉCURRENTES (des confusions ou méthodes fausses qui reviennent), pas une liste de questions.\n` +
    `Réponds en JSON : {"items":[{"pattern":"l'erreur en une phrase","subject":"matière","evidence":"quelles questions le montrent","remedy":"que faire concrètement, en une ou deux phrases, en tutoyant l'élève"}]}.\n\n` +
    `Questions ratées :\n${list}`,
  )
  if (ai?.items?.length) return { generated: true, items: ai.items.slice(0, 4) }

  // Repli sans IA : regroupement par chapitre.
  const byChapter = new Map<string, MissedQuestion[]>()
  for (const m of missed) {
    const key = `${m.subject_name}${m.chapter_title ? ` — ${m.chapter_title}` : ''}`
    byChapter.set(key, [...(byChapter.get(key) ?? []), m])
  }
  return {
    generated: false,
    items: [...byChapter.entries()].filter(([, qs]) => qs.reduce((s, q) => s + q.times_wrong, 0) >= 2).slice(0, 4).map(([key, qs]) => ({
      pattern: `Erreurs répétées sur « ${key} »`,
      subject: qs[0]!.subject_name,
      evidence: `${qs.length} question(s) ratée(s) plusieurs fois`,
      remedy: 'Relis l’explication de chaque question ratée, puis refais le QCM de ce chapitre dans deux jours.',
    })),
  }
}

/* ── Recommandations personnalisées par matière ───────────────────────────── */

export interface SubjectCoaching {
  subject_id: string
  subject_name: string
  diagnosis: string
  steps: string[]
  weekly_goal: string
}

export async function subjectCoaching(
  progress: SubjectProgress[],
  errors: SubjectErrorStat[],
  missed: MissedQuestion[],
  rules: RevisionRecommendation[],
): Promise<{ generated: boolean; items: SubjectCoaching[] }> {
  const targets = rules.filter((r) => r.priority !== 'basse').slice(0, 3)
  if (targets.length === 0) return { generated: false, items: [] }

  const context = targets.map((t) => {
    const p = progress.find((x) => x.subject_id === t.subject_id)
    const e = errors.find((x) => x.subject_id === t.subject_id)
    const qs = missed.filter((m) => m.subject_name === t.subject_name).slice(0, 4)
    return `### ${t.subject_name} (id ${t.subject_id})\n` +
      `Leçons : ${p?.lessons_done ?? 0}/${p?.lessons_total ?? 0} ; QCM passés : ${p?.quiz_attempts ?? 0} ; moyenne : ${p?.quiz_average ?? '—'} % ; erreurs : ${e?.error_rate ?? '—'} %\n` +
      `Constat : ${t.reason}\n` +
      (qs.length ? `Questions ratées : ${qs.map((q) => clip(q.prompt.replace(/\s+/g, ' '), 140)).join(' | ')}` : '')
  }).join('\n\n')

  const ai = await askJson<{ items?: SubjectCoaching[] }>(
    `Tu es coach scolaire pour un élève congolais qui prépare son examen. Pour chaque matière ci-dessous, rédige des recommandations PERSONNALISÉES à partir des chiffres.\n` +
    `Réponds en JSON : {"items":[{"subject_id":"…","subject_name":"…","diagnosis":"une phrase","steps":["3 étapes concrètes et courtes"],"weekly_goal":"objectif mesurable pour la semaine"}]}. Tutoie l'élève.\n\n${context}`,
  )
  if (ai?.items?.length) return { generated: true, items: ai.items.slice(0, 3).map((i) => ({ ...i, steps: (i.steps ?? []).slice(0, 4) })) }

  return {
    generated: false,
    items: targets.map((t) => ({
      subject_id: t.subject_id,
      subject_name: t.subject_name,
      diagnosis: `À travailler en priorité : ${t.reason}.`,
      steps: [t.action, 'Fais une série de flashcards sur les notions ratées.', 'Termine la semaine par un QCM de contrôle.'],
      weekly_goal: 'Gagner 10 points de réussite sur les QCM de cette matière.',
    })),
  }
}

/* ── Rapport de progression ───────────────────────────────────────────────── */

export async function reportSummary(facts: Record<string, unknown>): Promise<string> {
  const ai = await askJson<{ summary?: string }>(
    `Rédige le résumé d'un rapport de progression hebdomadaire, lu par l'élève ET par son parent. ` +
    `4 à 6 phrases, ton encourageant et factuel, en français, sans inventer de chiffre. Commence par le point le plus positif, ` +
    `termine par la priorité de la semaine suivante. Réponds en JSON : {"summary":"…"}.\n\nDonnées : ${JSON.stringify(facts)}`,
  )
  if (ai?.summary) return ai.summary
  const f = facts as { lessons_completed?: number; quizzes_taken?: number; quiz_average?: number | null; active_days?: number; top_priority?: string | null }
  return `Cette semaine : ${f.lessons_completed ?? 0} leçon(s) terminée(s), ${f.quizzes_taken ?? 0} QCM passé(s)` +
    `${f.quiz_average != null ? ` avec une moyenne de ${f.quiz_average} %` : ''}, sur ${f.active_days ?? 0} jour(s) d’activité.` +
    `${f.top_priority ? ` Priorité de la semaine prochaine : ${f.top_priority}.` : ''}`
}

/* ── Analyse approfondie d'une copie ──────────────────────────────────────── */

export interface DeepCopyAnalysis {
  overall: string
  strengths: string[]
  errors: { step: string; issue: string; correction: string; kind: 'calcul' | 'méthode' | 'cours' | 'rédaction' | 'autre' }[]
  recurring_risks: string[]
  next_steps: string[]
  estimated_mastery: number | null
}

/** Images : énoncé, copie de l'élève, correction du tuteur (si disponible). */
export async function deepCopyAnalysis(images: object[], hasSolution: boolean): Promise<DeepCopyAnalysis | null> {
  if (images.length < 2) return null
  return askJson<DeepCopyAnalysis>(
    `Tu es correcteur expérimenté du BAC congolais. Images : (1) énoncé, (2) copie manuscrite de l'élève` +
    `${hasSolution ? ', (3) correction validée par un tuteur' : ''}.\n` +
    `Analyse la COPIE en profondeur, étape par étape : ce qui est juste, chaque erreur (où, pourquoi, comment corriger, et sa nature), ` +
    `les risques d'erreurs récurrentes et les prochaines étapes. Tutoie l'élève.\n` +
    `Réponds en JSON : {"overall":"bilan en 2 phrases","strengths":["…"],"errors":[{"step":"…","issue":"…","correction":"…","kind":"calcul|méthode|cours|rédaction|autre"}],` +
    `"recurring_risks":["…"],"next_steps":["…"],"estimated_mastery":0-100}`,
    images,
  )
}
