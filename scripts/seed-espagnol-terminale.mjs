/**
 * Seed — ESPAGNOL Terminale A : unités complètes par thème.
 *
 * Même méthode que l'anglais (voir la mémoire projet « méthode cours de langues »
 * et scripts/seed-anglais-terminale.mjs) : chaque fichier
 * `scripts/content/espagnol-terminale/unite-*.mjs` décrit une unité (leçons dans
 * l'ordre, exercices corrigés, QCM de fin d'unité).
 *
 * Différence avec l'anglais : la matière Espagnol de Terminale A était vide (aucun
 * programme INRAP importé). Le chapitre de l'unité est donc CRÉÉ s'il n'existe pas
 * (titre `unit.chapterTitle`, position `unit.order`), puis mis à jour par titre aux
 * passages suivants. L'espagnol n'existe qu'en Terminale A : pas de copies liées.
 *
 * Usage :
 *   node scripts/seed-espagnol-terminale.mjs --dry-run
 *   node scripts/seed-espagnol-terminale.mjs
 *   node scripts/seed-espagnol-terminale.mjs --unit=01
 */
import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
const ONLY = process.argv.find((a) => a.startsWith('--unit='))?.slice('--unit='.length)

const env = Object.fromEntries(readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
  .split('\n').filter((l) => l.includes('=') && !l.startsWith('#'))
  .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))

async function sb(path, init) {
  const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, Prefer: 'return=representation', ...(init?.headers ?? {}) },
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : null
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> HTTP ${res.status}: ${JSON.stringify(json)}`)
  return json
}

// Espagnol Terminale A — ID vérifié le 09/10/2026 (seule série où la matière existe).
const SUBJECT = '2a1d80e9-ed89-406e-bf45-a05f2c700c05'

const DIR = join(__dirname, 'content', 'espagnol-terminale')
const files = readdirSync(DIR).filter((f) => /^unite-\d+.*\.mjs$/.test(f) && (!ONLY || f.startsWith(`unite-${ONLY}`))).sort()
if (!files.length) throw new Error('Aucune unité à importer.')

const [subject] = await sb(`/subjects?id=eq.${SUBJECT}&select=name,level`)
if (!subject || subject.name !== 'Espagnol') throw new Error(`Matière ${SUBJECT} inattendue : ${JSON.stringify(subject)}`)

const backup = { at: new Date().toISOString(), units: {} }
for (const file of files) {
  const { unit, lessons, exercises, qcm } = await import(pathToFileURL(join(DIR, file)).href)
  let [chapter] = await sb(`/chapters?subject_id=eq.${SUBJECT}&title=eq.${encodeURIComponent(unit.chapterTitle)}&select=id,title,source_chapter_id,lessons(id,type,title,content,order_index),exercises(id,title,deleted_at),quizzes(id,deleted_at)`)
  if (chapter?.source_chapter_id) throw new Error(`${file} : le chapitre est une copie, pas l'original.`)
  backup.units[file] = chapter ?? null

  console.log(`\n${DRY_RUN ? '[DRY-RUN] ' : ''}${file} → chapitre « ${unit.chapterTitle} » ${chapter ? '(existant)' : '(à créer)'}`)
  console.log(`  leçons existantes : ${chapter?.lessons.length ?? 0} · leçons de l'unité : ${lessons.length} · exercices : ${exercises.length} · QCM : ${qcm.questions.length} questions`)
  if (DRY_RUN) continue
  // Sauvegarde AVANT toute écriture.
  writeFileSync(join(__dirname, `.backup-espagnol-${backup.at.replace(/[:.]/g, '-')}.json`), JSON.stringify(backup, null, 2))

  if (!chapter) {
    const [c] = await sb('/chapters', { method: 'POST', body: JSON.stringify({ subject_id: SUBJECT, title: unit.chapterTitle, description: unit.description, order_index: unit.order }) })
    chapter = { ...c, lessons: [], exercises: [], quizzes: [] }
  } else {
    await sb(`/chapters?id=eq.${chapter.id}`, { method: 'PATCH', body: JSON.stringify({ description: unit.description, order_index: unit.order }) })
  }

  // Leçons : mise à jour par titre ; les leçons absentes de l'unité sont retirées.
  const kept = new Set()
  for (const [i, l] of lessons.entries()) {
    const target = chapter.lessons.find((x) => x.title === l.title)
    const row = { type: l.type, title: l.title, content: l.content, order_index: i, is_premium: false }
    if (target) { await sb(`/lessons?id=eq.${target.id}`, { method: 'PATCH', body: JSON.stringify(row) }); kept.add(target.id) }
    else { const [n] = await sb('/lessons', { method: 'POST', body: JSON.stringify({ chapter_id: chapter.id, ...row }) }); kept.add(n.id) }
  }
  for (const x of chapter.lessons) if (!kept.has(x.id)) await sb(`/lessons?id=eq.${x.id}`, { method: 'DELETE' })

  // Exercices et corrigés (mise à jour par titre).
  for (const [i, e] of exercises.entries()) {
    const found = chapter.exercises.find((x) => x.title === e.title && !x.deleted_at)
    const row = { title: e.title, statement: e.statement, difficulty: e.difficulty, is_premium: false, order_index: i }
    const id = found
      ? (await sb(`/exercises?id=eq.${found.id}`, { method: 'PATCH', body: JSON.stringify(row) }))[0].id
      : (await sb('/exercises', { method: 'POST', body: JSON.stringify({ chapter_id: chapter.id, ...row }) }))[0].id
    await sb('/exercise_solutions?on_conflict=exercise_id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify({ exercise_id: id, solution: e.solution }) })
  }

  // QCM de fin d'unité : créé ou mis à jour, questions remplacées position par position.
  let quiz = chapter.quizzes.find((q) => !q.deleted_at)
  if (!quiz) [quiz] = await sb('/quizzes', { method: 'POST', body: JSON.stringify({ chapter_id: chapter.id, subject_id: SUBJECT, level: subject.level, title: qcm.title, time_limit_sec: qcm.time_limit_sec, is_premium: false }) })
  else await sb(`/quizzes?id=eq.${quiz.id}`, { method: 'PATCH', body: JSON.stringify({ title: qcm.title, time_limit_sec: qcm.time_limit_sec }) })
  const have = await sb(`/quiz_questions?quiz_id=eq.${quiz.id}&select=id,position`)
  for (const [i, q] of qcm.questions.entries()) {
    const pos = i + 1
    const h = have.find((x) => x.position === pos)
    const row = { prompt: q.prompt, options: q.options, correct_index: q.correct_index, explanation: q.explanation }
    if (h) await sb(`/quiz_questions?id=eq.${h.id}`, { method: 'PATCH', body: JSON.stringify(row) })
    else await sb('/quiz_questions', { method: 'POST', body: JSON.stringify({ quiz_id: quiz.id, position: pos, ...row }) })
  }
  for (const h of have) if (h.position > qcm.questions.length) await sb(`/quiz_questions?id=eq.${h.id}`, { method: 'DELETE' })

  // Si un jour le chapitre est publié dans d'autres séries (copies liées), on les resynchronise.
  const synced = await sb('/rpc/sync_chapter_copies', { method: 'POST', body: JSON.stringify({ p_chapter: chapter.id }) })
  console.log(`  écrit ; ${synced} copie(s) liée(s) synchronisée(s).`)
}

if (!DRY_RUN) console.log(`
État précédent sauvegardé dans scripts/.backup-espagnol-${backup.at.replace(/[:.]/g, '-')}.json`)
