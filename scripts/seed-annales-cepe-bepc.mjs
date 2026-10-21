/**
 * Annales CEPE / BEPC au format d'origine (énoncé + corrigé) → rayon TD de la Prépa.
 * Les QCM d'annales de ces mêmes sujets existent déjà (seed-exam-content.mjs) ; on ajoute :
 *  - CEPE « Lecture & Dictée »        → chapitre « Annales CEPE — Dictées et questions »
 *  - CEPE « Calcul rapide & mental »  → chapitre « Annales CEPE — Calcul rapide »
 *  - CEPE « Histoire-Géographie »     → chapitre « Annales CEPE — Questions de cours »
 *  - BEPC « Français »                → chapitre « Annales BEPC — Dictées et questions »
 *  - le QCM d'annale BEPC 2022 (absent jusque-là).
 * Contenu : scripts/content/annales-cepe-bepc/*.mjs. Idempotent (titres déjà présents ignorés).
 *
 * Usage : node scripts/seed-annales-cepe-bepc.mjs [--dry-run]
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { buildCepeChapters } from './content/annales-cepe-bepc/cepe.mjs'
import { buildBepcExercises, bepc2022Quiz } from './content/annales-cepe-bepc/bepc.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants dans apps/web/.env.local')
  process.exit(1)
}

async function sb(path, init) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: 'return=representation',
      ...(init?.headers ?? {}),
    },
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : null
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> HTTP ${res.status}: ${JSON.stringify(json)}`)
  return json
}

// IDs vérifiés le 19/10/2026 (subjects, level cepe / bepc).
const SUBJECTS = {
  cepeDictee: 'dcc96d92-8a61-4423-982c-0c79ddfbbf42',  // CEPE · Lecture & Dictée
  cepeCalcul: '2eacfc7d-30b5-4cab-81e9-0c68ecfe9c15',  // CEPE · Calcul rapide & mental
  cepeHG: '39c4caac-6a89-455d-ac4d-65ee0bb42f83',      // CEPE · Histoire-Géographie
  bepcFr: '83e1f492-03b8-4810-a96a-45ca053ad94f',      // BEPC · Français
}

async function checkSubject(id, level, name) {
  const [s] = await sb(`/rest/v1/subjects?id=eq.${id}&select=name,level`)
  if (!s || s.level !== level || s.name !== name) throw new Error(`Matière ${id} inattendue : ${JSON.stringify(s)} (attendu ${name}/${level})`)
}

async function ensureChapter(subjectId, title, description) {
  const existing = await sb(`/rest/v1/chapters?subject_id=eq.${subjectId}&title=eq.${encodeURIComponent(title)}&select=id`)
  if (existing.length > 0) return existing[0].id
  const [last] = await sb(`/rest/v1/chapters?subject_id=eq.${subjectId}&select=order_index&order=order_index.desc&limit=1`)
  const max = last?.order_index ?? 0
  if (DRY_RUN) { console.log(`[dry-run] créerait chapitre « ${title} »`); return null }
  const [created] = await sb('/rest/v1/chapters', {
    method: 'POST',
    body: JSON.stringify({ subject_id: subjectId, title, description, order_index: (max ?? 0) + 1 }),
  })
  console.log(`✓ Chapitre créé : ${title}`)
  return created.id
}

async function insertExercises(chapterId, exercises) {
  let created = 0
  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i]
    if (chapterId) {
      const existing = await sb(`/rest/v1/exercises?chapter_id=eq.${chapterId}&title=eq.${encodeURIComponent(ex.title)}&deleted_at=is.null&select=id`)
      if (existing.length > 0) { console.log(`  … déjà présent : ${ex.title}`); continue }
    }
    if (DRY_RUN) { console.log(`  [dry-run] ${ex.title} (${ex.statement.length} / ${ex.solution.length} car.)`); continue }
    const [row] = await sb('/rest/v1/exercises', {
      method: 'POST',
      body: JSON.stringify({ chapter_id: chapterId, title: ex.title, statement: ex.statement, difficulty: 2, is_premium: false, order_index: i }),
    })
    await sb('/rest/v1/exercise_solutions', { method: 'POST', body: JSON.stringify({ exercise_id: row.id, solution: ex.solution }) })
    created++
    console.log(`  ✓ ${ex.title}`)
  }
  return created
}

async function insertBepc2022Quiz() {
  const existing = await sb(`/rest/v1/quizzes?title=eq.${encodeURIComponent(bepc2022Quiz.title)}&level=eq.bepc&deleted_at=is.null&select=id`)
  if (existing.length > 0) { console.log(`… QCM déjà présent : ${bepc2022Quiz.title}`); return }
  // Mêmes réglages que les autres annales BEPC de français.
  const [model] = await sb(`/rest/v1/quizzes?title=eq.${encodeURIComponent("BEPC 2023 — Dictée : L'importance de l'éducation")}&select=time_limit_sec,is_premium`)
  if (DRY_RUN) { console.log(`[dry-run] créerait QCM « ${bepc2022Quiz.title} » (${bepc2022Quiz.questions.length} questions)`); return }
  const [quiz] = await sb('/rest/v1/quizzes', {
    method: 'POST',
    body: JSON.stringify({
      subject_id: SUBJECTS.bepcFr, title: bepc2022Quiz.title, description: null, level: 'bepc',
      time_limit_sec: model?.time_limit_sec ?? 900, is_premium: model?.is_premium ?? false,
      is_exam: true, year: bepc2022Quiz.year, exam_kind: 'ancien_bac',
    }),
  })
  await sb('/rest/v1/quiz_questions', {
    method: 'POST',
    body: JSON.stringify(bepc2022Quiz.questions.map((q, i) => ({ quiz_id: quiz.id, position: i + 1, ...q }))),
  })
  console.log(`✓ QCM créé : ${bepc2022Quiz.title} (${bepc2022Quiz.questions.length} questions)`)
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN (aucune écriture) ===' : '=== Écriture en base ===')
  await checkSubject(SUBJECTS.cepeDictee, 'cepe', 'Lecture & Dictée')
  await checkSubject(SUBJECTS.cepeCalcul, 'cepe', 'Calcul rapide & mental')
  await checkSubject(SUBJECTS.cepeHG, 'cepe', 'Histoire-Géographie')
  await checkSubject(SUBJECTS.bepcFr, 'bepc', 'Français')

  const cepe = buildCepeChapters()
  const plan = [
    [SUBJECTS.cepeDictee, 'Annales CEPE — Dictées et questions', "Dictées d'examen du CEPE avec leurs questions, à faire par écrit puis à comparer au corrigé.", cepe.dictees],
    [SUBJECTS.cepeCalcul, 'Annales CEPE — Calcul rapide', 'Épreuves de calcul rapide des CEPE 2002 à 2017, avec opérations détaillées.', cepe.calcul],
    [SUBJECTS.cepeHG, 'Annales CEPE — Questions de cours', "Questions de cours des CEPE 2001 à 2017 : histoire, géographie, SVT, initiation à la production, santé, ECMP.", cepe.questionsDeCours],
    [SUBJECTS.bepcFr, 'Annales BEPC — Dictées et questions', 'Dictées du BEPC 2010 à 2023 : compréhension, maniement de la langue, grammaire, conjugaison.', buildBepcExercises()],
  ]
  let total = 0
  for (const [subjectId, title, description, exercises] of plan) {
    console.log(`\n— ${title} (${exercises.length}) —`)
    const chapterId = await ensureChapter(subjectId, title, description)
    total += await insertExercises(chapterId, exercises)
  }
  console.log()
  await insertBepc2022Quiz()
  console.log(`\n=== Terminé : ${total} exercice(s) créé(s) ===`)
}

main().catch((e) => { console.error('✗', e.message); process.exit(1) })
