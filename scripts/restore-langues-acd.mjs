/**
 * Restaure un backup produit par scripts/backup-langues-acd.mjs.
 * Réinsère chapitres, leçons, exercices, QCM, progression… avec LEURS IDENTIFIANTS
 * d'origine, de sorte que les copies liées (source_chapter_id) et la progression
 * élève reviennent telles quelles.
 *
 * Usage :
 *   node scripts/restore-langues-acd.mjs backups/langues-acd-XXXX.json --dry-run
 *   node scripts/restore-langues-acd.mjs backups/langues-acd-XXXX.json --confirm
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, isAbsolute } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const fileArg = process.argv[2]
const CONFIRM = process.argv.includes('--confirm')
if (!fileArg) throw new Error('Usage: restore-langues-acd.mjs <backup.json> [--confirm]')

const env = Object.fromEntries(
  readFileSync(join(ROOT, 'apps', 'web', '.env.local'), 'utf-8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trimStart().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const URL = env.NEXT_PUBLIC_SUPABASE_URL
const KEY = env.SUPABASE_SERVICE_ROLE_KEY

async function sb(path, init = {}) {
  const r = await fetch(`${URL}/rest/v1${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}`, Prefer: 'return=minimal,resolution=merge-duplicates', ...(init.headers ?? {}) },
  })
  const t = await r.text()
  if (!r.ok) throw new Error(`${init.method || 'GET'} ${path} -> ${r.status}: ${t}`)
  return t ? JSON.parse(t) : null
}
const insert = (table, rows) => (rows.length ? sb(`/${table}`, { method: 'POST', body: JSON.stringify(rows) }) : null)

const backup = JSON.parse(readFileSync(isAbsolute(fileArg) ? fileArg : join(ROOT, fileArg), 'utf-8'))
const drop = (rows, ...keys) => rows.map((r) => { const c = { ...r }; for (const k of keys) delete c[k]; return c })

console.log(`Restauration depuis ${fileArg}`)
for (const k of ['chapters', 'lessons', 'exercises', 'exercise_solutions', 'quizzes', 'quiz_questions', 'lesson_progress', 'exercise_attempts', 'quiz_attempts', 'flashcards', 'curriculum_items']) {
  console.log(`  ${k}: ${(backup[k] || []).length}`)
}
if (!CONFIRM) {
  console.log('\n[DRY-RUN] Ajoute --confirm pour écrire réellement.')
  process.exit(0)
}

// 1) Chapitres : d'abord sans source_chapter_id (originaux et copies coexistent),
//    puis on repositionne source_chapter_id en second passage.
await insert('chapters', drop(backup.chapters, 'source_chapter_id'))
for (const c of backup.chapters.filter((c) => c.source_chapter_id)) {
  await sb(`/chapters?id=eq.${c.id}`, { method: 'PATCH', body: JSON.stringify({ source_chapter_id: c.source_chapter_id }) })
}
// 2) Enfants
await insert('lessons', backup.lessons)
await insert('exercises', backup.exercises || [])
await insert('exercise_solutions', backup.exercise_solutions || [])
await insert('quizzes', backup.quizzes || [])
await insert('quiz_questions', backup.quiz_questions || [])
await insert('lesson_progress', backup.lesson_progress || [])
await insert('exercise_attempts', backup.exercise_attempts || [])
await insert('quiz_attempts', backup.quiz_attempts || [])
await insert('flashcards', backup.flashcards || [])
await insert('curriculum_items', backup.curriculum_items || [])

console.log('\nRestauration terminée.')
