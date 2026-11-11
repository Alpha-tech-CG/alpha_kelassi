/**
 * Publie les épreuves QCM de SVT Terminale C & D (Prépa → Bac test / Bac blanc),
 * à partir de la banque qcm.mjs. Les choix de chaque question sont mélangés de façon
 * déterministe (la bonne réponse n'est pas toujours au même endroit, et une relance
 * donne le même ordre). Relançable : une épreuve existante (même titre) est mise à
 * jour question par question, avec sauvegarde dans backups/.
 *
 * Usage : node scripts/content/svt-tle/publish-qcm.mjs [--dry-run]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { BANK, EXAMS } from './qcm.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY = process.argv.includes('--dry-run')
const env = Object.fromEntries(readFileSync(join(__dirname, '..', '..', '..', 'apps', 'web', '.env.local'), 'utf-8').split('\n').filter(l => l.includes('=') && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const URL = env.NEXT_PUBLIC_SUPABASE_URL, KEY = env.SUPABASE_SERVICE_ROLE_KEY
async function sb(path, init) {
  const r = await fetch(`${URL}/rest/v1${path}`, { ...init, headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}`, Prefer: 'return=representation', ...(init?.headers ?? {}) } })
  const t = await r.text(); const j = t ? JSON.parse(t) : null
  if (!r.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> ${r.status}: ${JSON.stringify(j).slice(0, 300)}`)
  return j
}

const SUBJECTS = { C: { id: '226d7765-dfeb-4e56-aefa-aec9cb467d79', level: 'bac_c' }, D: { id: 'a9987cc5-6d4c-4b9f-8dc7-2679cae32e59', level: 'bac_d' } }

/** Mélange déterministe des choix (graine = énoncé). */
function shuffled([prompt, options, correct, explanation]) {
  let h = 2166136261
  for (const ch of prompt) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0
  const idx = options.map((_, i) => i)
  for (let i = idx.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0
    const j = h % (i + 1);
    [idx[i], idx[j]] = [idx[j], idx[i]]
  }
  return { prompt, options: idx.map((i) => options[i]), correct_index: idx.indexOf(correct), explanation }
}

function questionsOf(slices) {
  const out = []
  for (const [key, from, to] of slices) {
    const list = BANK[key]
    if (!list || list.length < to) throw new Error(`Banque « ${key} » trop courte (${list?.length} < ${to})`)
    for (const q of list.slice(from, to)) {
      if (q[1].length !== 4 || q[2] < 0 || q[2] > 3) throw new Error(`Question mal formée : ${q[0]}`)
      out.push(shuffled(q))
    }
  }
  return out
}

const backup = []
const tag = DRY ? '[dry-run] ' : ''
const spread = [0, 0, 0, 0]
console.log(DRY ? '=== DRY RUN ===' : '=== ÉPREUVES QCM SVT Tle C & D ===')
for (const [serie, exams] of Object.entries(EXAMS)) {
  const subject = SUBJECTS[serie]
  for (const [kind, title, minutes, slices] of exams) {
    const qs = questionsOf(slices)
    qs.forEach((q) => spread[q.correct_index]++)
    let [quiz] = await sb(`/quizzes?select=id&subject_id=eq.${subject.id}&title=eq.${encodeURIComponent(title)}&deleted_at=is.null`)
    if (!quiz) {
      console.log(`${tag}+ ${title} (${kind}, ${qs.length} questions, ${minutes} min)`)
      if (DRY) continue
      ;[quiz] = await sb('/quizzes', { method: 'POST', body: JSON.stringify({
        subject_id: subject.id, level: subject.level, title, is_exam: true, exam_kind: kind,
        time_limit_sec: minutes * 60, is_premium: false,
      }) })
    } else if (!DRY) {
      await sb(`/quizzes?id=eq.${quiz.id}`, { method: 'PATCH', body: JSON.stringify({ exam_kind: kind, time_limit_sec: minutes * 60 }) })
    }
    const existing = await sb(`/quiz_questions?select=id,position,prompt,options,correct_index,explanation&quiz_id=eq.${quiz.id}&order=position`)
    let created = 0, updated = 0, same = 0
    for (const [i, q] of qs.entries()) {
      const position = i + 1
      const old = existing.find((e) => e.position === position)
      if (!old) { created++; if (!DRY) await sb('/quiz_questions', { method: 'POST', body: JSON.stringify({ quiz_id: quiz.id, position, ...q }) }); continue }
      if (old.prompt === q.prompt && JSON.stringify(old.options) === JSON.stringify(q.options) && old.correct_index === q.correct_index && old.explanation === q.explanation) { same++; continue }
      updated++; backup.push(old)
      if (!DRY) await sb(`/quiz_questions?id=eq.${old.id}`, { method: 'PATCH', body: JSON.stringify(q) })
    }
    const extra = existing.filter((e) => e.position > qs.length)
    for (const e of extra) { backup.push(e); if (!DRY) await sb(`/quiz_questions?id=eq.${e.id}`, { method: 'DELETE' }) }
    console.log(`${tag}  ${title} : ${created} créée(s), ${updated} mise(s) à jour, ${same} à jour${extra.length ? `, ${extra.length} retirée(s)` : ''}`)
  }
}
console.log('Bonne réponse en A/B/C/D :', spread.join(' / '))
if (!DRY && backup.length) {
  mkdirSync(join(__dirname, 'backups'), { recursive: true })
  const file = join(__dirname, 'backups', `qcm-avant-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  writeFileSync(file, JSON.stringify(backup, null, 1))
  console.log(`Sauvegarde : ${file}`)
}
