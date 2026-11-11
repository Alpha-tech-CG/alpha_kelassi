/**
 * Seed du contenu "Sujets d'examen" (dictées BEPC, dictées CEPE CM2, calcul rapide CEPE,
 * questions de cours CEPE, expressions écrites CEPE) dans Supabase.
 *
 * - QCM (dictées, calcul rapide, questions de cours) → public.quizzes / quiz_questions,
 *   is_exam=true, consommés par l'écran "Simulations d'examen".
 * - Expressions écrites (rédaction, pas de QCM) → public.exercises / exercise_solutions,
 *   corrigé débloqué après tentative (écran "Exercices").
 *
 * Usage : node scripts/seed-exam-content.mjs [--dry-run]
 * Lit SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY depuis apps/web/.env.local.
 */
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

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

const SCRATCHPAD = 'C:/Users/miche/AppData/Local/Temp/claude/D--alpha-kelassi-new/e14b1709-c92a-401a-a7b0-afd9aea3502d/scratchpad'

const {
  bepcQuizzes,
  cepeDicteeQuizzes,
  cepeCalculRapideQuizzes,
  cepeExpressionEcriteExercises,
} = await import(`file:///${SCRATCHPAD}/exam-content-bepc-cepe.mjs`)

const QDC_PATH = `${SCRATCHPAD}/questions_de_cours.json`
let questionsDeCours = null
if (existsSync(QDC_PATH)) {
  questionsDeCours = JSON.parse(readFileSync(QDC_PATH, 'utf-8'))
  console.log(`✓ Questions de cours trouvées : ${questionsDeCours.quizzes.length} sujets, ${questionsDeCours.skipped?.length ?? 0} ignorées`)
} else {
  console.log('… Pas de questions_de_cours.json trouvé — cette catégorie sera ignorée pour ce passage.')
}

// ── 1) Matières CEPE (upsert par name+level+country_code) ──────────────────
const subjectIndex = new Map() // key `${name}::${level}` -> id

async function ensureSubject(name, level, icon) {
  const key = `${name}::${level}`
  if (subjectIndex.has(key)) return subjectIndex.get(key)
  const existing = await sb(`/rest/v1/subjects?name=eq.${encodeURIComponent(name)}&level=eq.${level}&country_code=eq.CG&select=id`)
  if (existing.length > 0) {
    subjectIndex.set(key, existing[0].id)
    return existing[0].id
  }
  if (DRY_RUN) { console.log(`[dry-run] créerait subject ${name} (${level})`); subjectIndex.set(key, `dry-${key}`); return `dry-${key}` }
  const created = await sb('/rest/v1/subjects', { method: 'POST', body: JSON.stringify({ name, level, country_code: 'CG', icon }) })
  subjectIndex.set(key, created[0].id)
  console.log(`✓ Matière créée : ${name} (${level})`)
  return created[0].id
}

// ── 2) Quizzes + quiz_questions ─────────────────────────────────────────────
async function insertQuiz(quiz) {
  const subjectId = await ensureSubject(quiz.subject, quiz.level, quiz.subject === 'Mathématiques' ? '📐' : quiz.subject === 'Éveil' ? '🌍' : '📝')

  const existing = await sb(`/rest/v1/quizzes?title=eq.${encodeURIComponent(quiz.title)}&level=eq.${quiz.level}&select=id`)
  if (existing.length > 0) {
    console.log(`… déjà présent, ignoré : ${quiz.title}`)
    return
  }

  if (DRY_RUN) { console.log(`[dry-run] créerait quiz "${quiz.title}" (${quiz.questions.length} questions)`); return }

  const [created] = await sb('/rest/v1/quizzes', {
    method: 'POST',
    body: JSON.stringify({
      subject_id: subjectId,
      title: quiz.title,
      description: null,
      level: quiz.level,
      time_limit_sec: quiz.time_limit_sec,
      is_premium: false,
      is_exam: true,
      year: quiz.year ?? null,
    }),
  })

  const rows = quiz.questions.map((q, i) => ({
    quiz_id: created.id,
    position: i + 1,
    prompt: q.prompt,
    options: q.options,
    correct_index: q.correct_index,
    explanation: q.explanation ?? null,
  }))
  await sb('/rest/v1/quiz_questions', { method: 'POST', body: JSON.stringify(rows) })
  console.log(`✓ Quiz créé : ${quiz.title} (${rows.length} questions)`)
}

// ── 3) Chapitre + exercises + exercise_solutions (expressions écrites) ─────
async function ensureChapter(subjectId, title) {
  const existing = await sb(`/rest/v1/chapters?subject_id=eq.${subjectId}&title=eq.${encodeURIComponent(title)}&select=id`)
  if (existing.length > 0) return existing[0].id
  if (DRY_RUN) { console.log(`[dry-run] créerait chapitre "${title}"`); return 'dry-chapter' }
  const [created] = await sb('/rest/v1/chapters', { method: 'POST', body: JSON.stringify({ subject_id: subjectId, title, order_index: 0 }) })
  console.log(`✓ Chapitre créé : ${title}`)
  return created.id
}

async function insertExercise(chapterId, ex, index) {
  const existing = await sb(`/rest/v1/exercises?chapter_id=eq.${chapterId}&title=eq.${encodeURIComponent(ex.title)}&select=id`)
  if (existing.length > 0) { console.log(`… déjà présent, ignoré : ${ex.title}`); return }
  if (DRY_RUN) { console.log(`[dry-run] créerait exercice "${ex.title}"`); return }
  const [created] = await sb('/rest/v1/exercises', {
    method: 'POST',
    body: JSON.stringify({ chapter_id: chapterId, title: ex.title, statement: ex.statement, difficulty: 2, is_premium: false, order_index: index }),
  })
  await sb('/rest/v1/exercise_solutions', { method: 'POST', body: JSON.stringify({ exercise_id: created.id, solution: ex.solution }) })
  console.log(`✓ Exercice créé : ${ex.title}`)
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN (aucune écriture) ===' : '=== Écriture en base ===')

  for (const name of ['Français', 'Mathématiques']) {
    await ensureSubject(name, 'cepe', name === 'Mathématiques' ? '📐' : '📝')
  }

  console.log(`\n— BEPC dictées (${bepcQuizzes.length}) —`)
  for (const q of bepcQuizzes) await insertQuiz(q)

  console.log(`\n— CEPE dictées CM2 (${cepeDicteeQuizzes.length}) —`)
  for (const q of cepeDicteeQuizzes) await insertQuiz(q)

  console.log(`\n— CEPE calcul rapide (${cepeCalculRapideQuizzes.length}) —`)
  for (const q of cepeCalculRapideQuizzes) await insertQuiz(q)

  if (questionsDeCours) {
    console.log(`\n— CEPE questions de cours (${questionsDeCours.quizzes.length}) —`)
    for (const q of questionsDeCours.quizzes) {
      await insertQuiz({ ...q, subject: questionsDeCours.subject_name, level: questionsDeCours.level, time_limit_sec: q.time_limit_sec ?? 900 })
    }
  }

  console.log(`\n— CEPE expressions écrites (${cepeExpressionEcriteExercises.length}) —`)
  const frCepeId = await ensureSubject('Français', 'cepe', '📝')
  const chapterId = await ensureChapter(frCepeId, "Sujets d'examen — Expression écrite (CEPE)")
  for (let i = 0; i < cepeExpressionEcriteExercises.length; i++) {
    await insertExercise(chapterId, cepeExpressionEcriteExercises[i], i)
  }

  console.log('\n=== Terminé ===')
}

main().catch((e) => { console.error('✗', e.message); process.exit(1) })
