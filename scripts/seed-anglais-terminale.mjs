/**
 * Seed — ANGLAIS Terminales A, C et D : unités complètes par thème.
 *
 * Chaque fichier `scripts/content/anglais-terminale/unite-*.mjs` décrit une unité
 * construite selon la méthode des cours de langues (voir la mémoire projet
 * « méthode cours de langues ») : leçons dans l'ordre, exercices corrigés et QCM
 * de fin d'unité.
 *
 * Les chapitres de thèmes existent déjà (programme INRAP importé le 09/10/2026) :
 * originaux en Terminale C, copies liées en D et A. Le seed enrichit le chapitre
 * ORIGINAL de Terminale C puis resynchronise les copies (migration 060). La leçon
 * existante du thème (fiche programme) est réutilisée comme introduction, pour
 * garder son identifiant ; son ancien contenu est sauvegardé.
 *
 * Usage :
 *   node scripts/seed-anglais-terminale.mjs --dry-run
 *   node scripts/seed-anglais-terminale.mjs
 *   node scripts/seed-anglais-terminale.mjs --unit=01
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

// Anglais Terminale C (originaux) — IDs vérifiés le 09/10/2026 ; D et A sont des copies liées.
const SUBJECT_C = '7e735c7f-555d-41c5-a3b3-3e84185c2171'

const DIR = join(__dirname, 'content', 'anglais-terminale')
const files = readdirSync(DIR).filter((f) => /^unite-\d+.*\.mjs$/.test(f) && (!ONLY || f.startsWith(`unite-${ONLY}`))).sort()
if (!files.length) throw new Error('Aucune unité à importer.')

const backup = { at: new Date().toISOString(), units: {} }
for (const file of files) {
  const { unit, lessons, exercises, qcm } = await import(pathToFileURL(join(DIR, file)).href)
  const [chapter] = await sb(`/chapters?subject_id=eq.${SUBJECT_C}&title=eq.${encodeURIComponent(unit.chapterTitle)}&select=id,title,source_chapter_id,lessons(id,type,title,content,order_index),exercises(id,title,deleted_at),quizzes(id,deleted_at)`)
  if (!chapter) throw new Error(`${file} : chapitre « ${unit.chapterTitle} » introuvable en Terminale C.`)
  if (chapter.source_chapter_id) throw new Error(`${file} : le chapitre de Terminale C est une copie, pas l'original.`)
  backup.units[file] = chapter

  console.log(`\n${DRY_RUN ? '[DRY-RUN] ' : ''}${file} → chapitre « ${chapter.title} »`)
  console.log(`  leçons existantes : ${chapter.lessons.length} · leçons de l'unité : ${lessons.length} · exercices : ${exercises.length} · QCM : ${qcm.questions.length} questions`)
  if (DRY_RUN) continue
  // Sauvegarde AVANT toute écriture.
  writeFileSync(join(__dirname, `.backup-anglais-${backup.at.replace(/[:.]/g, '-')}.json`), JSON.stringify(backup, null, 2))

  await sb(`/chapters?id=eq.${chapter.id}`, { method: 'PATCH', body: JSON.stringify({ description: unit.description }) })

  // Leçons : on réutilise l'ancienne fiche (première leçon) pour l'introduction, puis
  // mise à jour par titre ; les leçons absentes de l'unité sont retirées.
  const existing = [...chapter.lessons].sort((a, b) => a.order_index - b.order_index)
  const kept = new Set()
  for (const [i, l] of lessons.entries()) {
    let target = existing.find((x) => x.title === l.title)
    if (!target && i === 0 && existing[0] && !lessons.some((u) => u.title === existing[0].title)) target = existing[0]
    const row = { type: l.type, title: l.title, content: l.content, order_index: i, is_premium: false }
    if (target) { await sb(`/lessons?id=eq.${target.id}`, { method: 'PATCH', body: JSON.stringify(row) }); kept.add(target.id) }
    else { const [n] = await sb('/lessons', { method: 'POST', body: JSON.stringify({ chapter_id: chapter.id, ...row }) }); kept.add(n.id) }
  }
  for (const x of existing) if (!kept.has(x.id)) await sb(`/lessons?id=eq.${x.id}`, { method: 'DELETE' })

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
  const [subject] = await sb(`/subjects?id=eq.${SUBJECT_C}&select=level`)
  if (!quiz) [quiz] = await sb('/quizzes', { method: 'POST', body: JSON.stringify({ chapter_id: chapter.id, subject_id: SUBJECT_C, level: subject.level, title: qcm.title, time_limit_sec: qcm.time_limit_sec, is_premium: false }) })
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

  // Copies liées de Terminale D et A.
  const synced = await sb('/rpc/sync_chapter_copies', { method: 'POST', body: JSON.stringify({ p_chapter: chapter.id }) })
  console.log(`  écrit ; ${synced} copie(s) liée(s) synchronisée(s).`)
}

if (!DRY_RUN) console.log(`
État précédent sauvegardé dans scripts/.backup-anglais-${backup.at.replace(/[:.]/g, '-')}.json`)
