/**
 * Sauvegarde (lecture seule) des cours Terminale ajoutés automatiquement
 * par le seed INRAP (scripts/seed-terminales-courses.mjs) pour les séries A, C et D.
 *
 * Cible : les chapitres dont `description` commence par "Programme officiel INRAP",
 * dans les matières Anglais / Français / Philosophie (bac_a, bac_c, bac_d).
 * Le contenu ajouté sur le site (sans cette description) n'est jamais touché.
 *
 * Écrit un JSON complet (chapitres + tout ce qui en dépend par cascade) dans
 * backups/, de façon à pouvoir tout restaurer avec les mêmes identifiants.
 *
 * Usage : node scripts/backup-terminales-inrap.mjs
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

async function sb(path) {
  const r = await fetch(`${URL}/rest/v1${path}`, {
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
  })
  const t = await r.text()
  const d = t ? JSON.parse(t) : null
  if (!r.ok) throw new Error(`GET ${path} -> ${r.status}: ${JSON.stringify(d)}`)
  return d
}
const inList = (ids) => `(${ids.join(',')})`

const subjects = await sb(
  '/subjects?select=id,name,level&level=in.(bac_a,bac_c,bac_d)&name=in.(Anglais,Fran%C3%A7ais,Philosophie)&order=name,level'
)
const subjectIds = subjects.map((s) => s.id)

// Chapitres INRAP (auto-ajoutés) dans ces matières uniquement.
const chapters = await sb(
  `/chapters?subject_id=in.${inList(subjectIds)}&description=ilike.Programme officiel INRAP*&select=*&order=subject_id,order_index`
)
const chapterIds = chapters.map((c) => c.id)
if (!chapterIds.length) throw new Error('Aucun chapitre INRAP trouvé — rien à sauvegarder.')

const lessons = await sb(`/lessons?chapter_id=in.${inList(chapterIds)}&select=*`)
const lessonIds = lessons.map((l) => l.id)

const exercises = await sb(`/exercises?chapter_id=in.${inList(chapterIds)}&select=*`)
const exerciseIds = exercises.map((e) => e.id)

const quizzes = await sb(`/quizzes?chapter_id=in.${inList(chapterIds)}&select=*`)
const quizIds = quizzes.map((q) => q.id)

const maybe = async (path) => {
  try {
    return await sb(path)
  } catch (e) {
    // Table/colonne absente de la base (ex. migration non appliquée) => rien à sauvegarder.
    if (/does not exist/i.test(e.message)) return []
    return { __error: e.message }
  }
}

const exercise_solutions = exerciseIds.length
  ? await maybe(`/exercise_solutions?exercise_id=in.${inList(exerciseIds)}&select=*`)
  : []
const exercise_attempts = exerciseIds.length
  ? await maybe(`/exercise_attempts?exercise_id=in.${inList(exerciseIds)}&select=*`)
  : []
const quiz_questions = quizIds.length
  ? await maybe(`/quiz_questions?quiz_id=in.${inList(quizIds)}&select=*`)
  : []
const quiz_attempts = quizIds.length
  ? await maybe(`/quiz_attempts?quiz_id=in.${inList(quizIds)}&select=*`)
  : []
const lesson_progress = lessonIds.length
  ? await maybe(`/lesson_progress?lesson_id=in.${inList(lessonIds)}&select=*`)
  : []
const flashcards = lessonIds.length
  ? await maybe(`/flashcards?lesson_id=in.${inList(lessonIds)}&select=*`)
  : []
const curriculum_items = lessonIds.length
  ? await maybe(`/curriculum_items?lesson_id=in.${inList(lessonIds)}&select=*`)
  : []

const backup = {
  meta: {
    created_at: new Date().toISOString(),
    description:
      'Cours Terminale INRAP (auto-ajoutés) — séries A, C, D — Anglais/Français/Philosophie',
    marker: 'description ilike "Programme officiel INRAP%"',
    subjects,
  },
  chapters,
  lessons,
  exercises,
  exercise_solutions,
  quizzes,
  quiz_questions,
  // Données élève incluses pour archive (seront perdues à la suppression en cascade) :
  lesson_progress,
  exercise_attempts,
  quiz_attempts,
  flashcards,
  curriculum_items,
}

mkdirSync(join(ROOT, 'backups'), { recursive: true })
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const file = join(ROOT, 'backups', `terminales-inrap-acd-${stamp}.json`)
writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8')

const n = (x) => (Array.isArray(x) ? x.length : `ERREUR: ${x.__error}`)
console.log('Sauvegarde écrite :', file)
console.log('\nContenu par matière :')
for (const s of subjects) {
  const chs = chapters.filter((c) => c.subject_id === s.id)
  if (chs.length) console.log(`  ${s.name}/${s.level} : ${chs.length} chapitres`)
}
console.log('\nLignes sauvegardées :')
for (const [k, v] of Object.entries(backup)) {
  if (k === 'meta') continue
  console.log(`  ${k}: ${n(v)}`)
}
