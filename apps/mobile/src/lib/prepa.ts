/**
 * Rayons de l'espace « Prépa » (migration 058). Copie de `apps/web/src/lib/prepa.ts`
 * (le mobile n'importe pas les paquets du monorepo).
 *
 * Bac test, Bac blanc et Bac rouge fixent le mode de passage de l'épreuve ;
 * un ancien bac se passe dans le mode que l'élève choisit. « TD » regroupe
 * les exercices corrigés des chapitres de la matière.
 */
export type ExamKind = 'bac_test' | 'bac_blanc' | 'bac_rouge' | 'ancien_bac'
export type PrepaRayon = ExamKind | 'td'
export type ExamMode = 'entrainement' | 'bac_test' | 'bac_blanc' | 'bac_rouge'

export const RAYONS: PrepaRayon[] = ['bac_test', 'bac_blanc', 'bac_rouge', 'ancien_bac', 'td']

/** Nom de l'examen de la classe : « Bac », « BEPC » ou « CEPE ». */
export function examName(level: string | null): string {
  if (level === 'cepe') return 'CEPE'
  if (level === 'bepc') return 'BEPC'
  return 'Bac'
}

export function rayonMeta(rayon: PrepaRayon, level: string | null) {
  const exam = examName(level)
  switch (rayon) {
    case 'bac_test':   return { label: `${exam} test`,  emoji: '⏱️', desc: 'Chronométré, pour te tester',            mode: 'bac_test' as ExamMode,  plan: 'starter', planLabel: 'Starter' }
    case 'bac_blanc':  return { label: `${exam} blanc`, emoji: '📝', desc: 'Chronométré et noté, comme le jour J',  mode: 'bac_blanc' as ExamMode, plan: 'pro',     planLabel: 'Pro' }
    case 'bac_rouge':  return { label: `${exam} rouge`, emoji: '🔴', desc: 'Difficile : −1 point par erreur',      mode: 'bac_rouge' as ExamMode, plan: 'pro',     planLabel: 'Pro' }
    case 'ancien_bac': return { label: `Anciens ${exam}`, emoji: '📜', desc: 'Les sujets des sessions passées',   mode: null,                    plan: 'starter', planLabel: 'Starter' }
    case 'td':         return { label: 'TD',            emoji: '✏️', desc: 'Exercices corrigés, chapitre par chapitre', mode: null,             plan: null,      planLabel: '' }
  }
}

export const MODE_LABEL: Record<ExamMode, { label: string; emoji: string; plan: 'starter' | 'pro'; planLabel: string }> = {
  entrainement: { label: 'Entraînement libre', emoji: '🎯', plan: 'starter', planLabel: 'Starter' },
  bac_test:     { label: 'Test chronométré',   emoji: '⏱️', plan: 'starter', planLabel: 'Starter' },
  bac_blanc:    { label: 'Blanc (noté)',       emoji: '📝', plan: 'pro',     planLabel: 'Pro' },
  bac_rouge:    { label: 'Rouge (−1/erreur)',  emoji: '🔴', plan: 'pro',     planLabel: 'Pro' },
}

export const isRayon = (v: unknown): v is PrepaRayon =>
  typeof v === 'string' && (RAYONS as string[]).includes(v)

/* ── Sujets rédigés (migration 074) ─────────────────────────────────────────
 * Un sujet d'épreuve est un exercice dont `exam_kind` est renseigné : énoncé
 * complet, durée officielle, barème. `origin` distingue les sujets réels
 * (sessions officielles, bacs blancs d'inspection) des sujets créés par Cognix
 * à partir d'eux (mêmes notions, mêmes questions posées autrement).
 */
export type PaperOrigin = 'reel' | 'genere'
export interface BaremeItem { label: string; points: number }
export interface Paper {
  id: string
  title: string
  exam_kind: ExamKind
  origin: PaperOrigin
  exam_year: number | null
  duration_min: number
  bareme: BaremeItem[] | null
}

export const PAPER_COLUMNS = 'id, title, exam_kind, origin, exam_year, duration_min, bareme'

export function parseBareme(v: unknown): BaremeItem[] {
  if (!Array.isArray(v)) return []
  return v.flatMap((it) => {
    const o = it as { label?: unknown; points?: unknown }
    return typeof o?.label === 'string' && typeof o.points === 'number' && o.points > 0
      ? [{ label: o.label, points: o.points }]
      : []
  })
}

export const originLabel = (p: Pick<Paper, 'origin' | 'exam_year'>) =>
  p.origin === 'reel' ? (p.exam_year ? `Sujet officiel ${p.exam_year}` : 'Sujet officiel') : 'Sujet Cognix (inédit)'

/**
 * Sujet de la prochaine simulation : on alterne sujet réel et sujet créé par Cognix
 * (l'origine opposée à celle de la dernière copie rendue dans la matière), en
 * privilégiant les sujets les moins faits ; si l'origine voulue manque, on prend l'autre.
 */
export function pickSimulationPaper(
  papers: Pick<Paper, 'id' | 'origin'>[],
  results: { exercise_id: string; created_at: string }[],
  rand: () => number = Math.random,
): string | null {
  if (papers.length === 0) return null
  const byId = new Map(papers.map((p) => [p.id, p]))
  const mine = results.filter((r) => byId.has(r.exercise_id)).sort((a, b) => b.created_at.localeCompare(a.created_at))
  const last = mine[0] ? byId.get(mine[0].exercise_id)!.origin : null
  const wanted: PaperOrigin = last === 'reel' ? 'genere' : 'reel'
  const done = new Map<string, number>()
  for (const r of mine) done.set(r.exercise_id, (done.get(r.exercise_id) ?? 0) + 1)
  const pool = papers.filter((p) => p.origin === wanted)
  const candidates = pool.length > 0 ? pool : papers
  const least = Math.min(...candidates.map((p) => done.get(p.id) ?? 0))
  const fresh = candidates.filter((p) => (done.get(p.id) ?? 0) === least)
  return fresh[Math.floor(rand() * fresh.length)]!.id
}
