/**
 * Sauvegarde (lecture seule) des cours de LANGUES ajoutés sur Cognix et qu'on
 * retire (changement de cap sur les langues, 29/10/2026) :
 *   - Anglais  Terminale A / C / D  (thèmes 1-9 + référence/examen ; C = originaux, A/D = copies liées)
 *   - Espagnol Terminale A           (unités 1-8)
 *
 * Cible : TOUS les chapitres de ces quatre matières (leur seul contenu est ce
 * cours de langue). Les autres Anglais (BEPC, G2, G3…) ne sont pas touchés.
 *
 * Écrit un JSON complet (chapitres + tout ce qui en dépend par cascade) dans
 * backups/, de façon à pouvoir tout restaurer avec les mêmes identifiants.
 *
 * Usage : node scripts/backup-langues-acd.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const env = Object.fromEntries(
  readFileSync(join(ROOT, 'apps', 'web', '.env.local'), 'utf-8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trimStart().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')]
    })
)
const URL = env.NEXT_PUBLIC_SUPABASE_URL
const KEY = env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !KEY) throw new Error('Configuration Supabase incomplète (apps/web/.env.local)')

// Matières ciblées (IDs vérifiés le 29/10/2026 — voir mémoire « IDs matières Terminale »).
const SUBJECT_IDS = [
  'c12bd331-8ab5-4f2c-8913-0ab6236183df', // Anglais  bac_a
  '7e735c7f-555d-41c5-a3b3-3e84185c2171', // Anglais  bac_c (originaux)
  '496dc730-f19d-439c-98db-90075e359e50', // Anglais  bac_d
  '2a1d80e9-ed89-406e-bf45-a05f2c700c05', // Espagnol bac_a
]

async function sb(path) {
  const r = await fetch(`${URL}/rest/v1${path}`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } })
  const t = await r.text()
  const d = t ? JSON.parse(t) : null
  if (!r.ok) throw new Error(`GET ${path} -> ${r.status}: ${JSON.stringify(d)}`)
  return d
}
const inList = (ids) => `(${ids.join(',')})`

const subjects = await sb(`/subjects?id=in.${inList(SUBJECT_IDS)}&select=id,name,level&order=name,level`)
if (subjects.length !== SUBJECT_IDS.length) {
  throw new Error(`Attendu ${SUBJECT_IDS.length} matières, trouvé ${subjects.length} : ${JSON.stringify(subjects)}`)
}
for (const s of subjects) {
  if (!['Anglais', 'Espagnol'].includes(s.name)) throw new Error(`Matière inattendue : ${s.name}/${s.level} (${s.id})`)
}

const chapters = await sb(`/chapters?subject_id=in.${inList(SUBJECT_IDS)}&select=*&order=subject_id,order_index`)
const chapterIds = chapters.map((c) => c.id)
if (!chapterIds.length) throw new Error('Aucun chapitre trouvé — rien à sauvegarder.')

const lessons = await sb(`/lessons?chapter_id=in.${inList(chapterIds)}&select=*`)
const lessonIds = lessons.map((l) => l.id)
const exercises = await sb(`/exercises?chapter_id=in.${inList(chapterIds)}&select=*`)
const exerciseIds = exercises.map((e) => e.id)
const quizzes = await sb(`/quizzes?chapter_id=in.${inList(chapterIds)}&select=*`)
const quizIds = quizzes.map((q) => q.id)

// Requête découpée par lots : une longue liste d'UUID (ex. 397 exercices)
// dépasse la limite de longueur d'URL en GET et fait échouer fetch.
const chunk = (arr, size) => { const out = []; for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size)); return out }
const maybeChunked = async (table, col, ids) => {
  if (!ids.length) return []
  try {
    const parts = await Promise.all(chunk(ids, 80).map((b) => sb(`/${table}?${col}=in.${inList(b)}&select=*`)))
    return parts.flat()
  } catch (e) { if (/does not exist/i.test(e.message)) return []; return { __error: e.message } }
}

const exercise_solutions = await maybeChunked('exercise_solutions', 'exercise_id', exerciseIds)
const exercise_attempts  = await maybeChunked('exercise_attempts', 'exercise_id', exerciseIds)
const quiz_questions     = await maybeChunked('quiz_questions', 'quiz_id', quizIds)
const quiz_attempts      = await maybeChunked('quiz_attempts', 'quiz_id', quizIds)
const lesson_progress    = await maybeChunked('lesson_progress', 'lesson_id', lessonIds)
const flashcards         = await maybeChunked('flashcards', 'lesson_id', lessonIds)
const curriculum_items   = await maybeChunked('curriculum_items', 'lesson_id', lessonIds)

const backup = {
  meta: {
    created_at: new Date().toISOString(),
    description: 'Cours de langues retirés — Anglais Terminale A/C/D + Espagnol Terminale A (changement de cap 29/10/2026)',
    marker: 'tous les chapitres des matières ciblées',
    subjects,
  },
  chapters, lessons, exercises, exercise_solutions, quizzes, quiz_questions,
  // Données élève incluses pour archive (perdues à la suppression en cascade) :
  lesson_progress, exercise_attempts, quiz_attempts, flashcards, curriculum_items,
}

mkdirSync(join(ROOT, 'backups'), { recursive: true })
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const file = join(ROOT, 'backups', `langues-acd-${stamp}.json`)
writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8')

const n = (x) => (Array.isArray(x) ? x.length : `ERREUR: ${x.__error}`)
console.log('Sauvegarde écrite :', file)
console.log('\nContenu par matière :')
for (const s of subjects) {
  const chs = chapters.filter((c) => c.subject_id === s.id)
  console.log(`  ${s.name}/${s.level} : ${chs.length} chapitres`)
}
console.log('\nLignes sauvegardées :')
for (const [k, v] of Object.entries(backup)) {
  if (k === 'meta') continue
  console.log(`  ${k}: ${n(v)}`)
}
