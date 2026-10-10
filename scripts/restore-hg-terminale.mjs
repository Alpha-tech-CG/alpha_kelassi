/**
 * Restauration — HISTOIRE-GÉOGRAPHIE, Terminales A, C et D.
 *
 * Annule l'import du 09/10/2026 (scripts/seed-histoire-geo-terminale.mjs) à la
 * demande de l'utilisateur : retire tous les chapitres de ces trois matières et
 * remet les chapitres qui existaient avant, tels que sauvegardés juste avant
 * l'import dans scripts/.backup-hg-terminale-2026-10-09T11-15-58-240Z.json
 * (Terminale C : 5 chapitres, Terminale D : 1 chapitre, Terminale A : aucun),
 * avec leurs identifiants d'origine.
 *
 * L'état actuel est d'abord sauvegardé dans scripts/.backup-hg-avant-restauration-*.json.
 *
 * Usage :
 *   node scripts/restore-hg-terminale.mjs --dry-run
 *   node scripts/restore-hg-terminale.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')

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

// Mêmes matières que le seed (IDs vérifiés le 10/10/2026).
const SUBJECTS = {
  bac_c: '4202d209-291e-4adf-88fd-b52af08c3a47',
  bac_d: '8386f566-931a-440d-a521-15100981090b',
  bac_a: '8860f08b-7300-4c92-8f0a-5c317c86ce60',
}
const BEFORE = JSON.parse(readFileSync(join(__dirname, '.backup-hg-terminale-2026-10-09T11-15-58-240Z.json'), 'utf-8'))

// 1. État actuel, pour pouvoir revenir en arrière.
const current = {}
for (const [level, sid] of Object.entries(SUBJECTS)) {
  current[level] = await sb(`/chapters?subject_id=eq.${sid}&select=*,lessons(*),exercises(*,exercise_solutions(*)),quizzes(*,quiz_questions(*))`)
  console.log(`${level} : ${current[level].length} chapitre(s) actuels → ${(BEFORE[level] ?? []).length} à remettre`)
}
for (const [level, chs] of Object.entries(BEFORE)) {
  for (const c of chs) console.log(`  + ${level} · ${c.title} (${c.lessons.length} leçon(s))`)
}
if (DRY_RUN) { console.log('\n[DRY-RUN] Rien n\'a été écrit.'); process.exit(0) }

const file = join(__dirname, `.backup-hg-avant-restauration-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
writeFileSync(file, JSON.stringify(current, null, 2))
console.log(`\nÉtat actuel sauvegardé : ${file}`)

// 2. Retrait des chapitres actuels (copies liées d'abord, puis originaux) ; leçons, QCM et exercices suivent en cascade.
for (const level of ['bac_a', 'bac_d', 'bac_c']) {
  await sb(`/chapters?subject_id=eq.${SUBJECTS[level]}`, { method: 'DELETE' })
}

// 3. Remise des anciens chapitres et de leurs leçons, avec leurs identifiants d'origine.
for (const [level, chs] of Object.entries(BEFORE)) {
  for (const c of chs) {
    const { lessons, exercises, quizzes, ...chapter } = c
    await sb('/chapters', { method: 'POST', body: JSON.stringify({ ...chapter, subject_id: SUBJECTS[level] }) })
    if (lessons.length) await sb('/lessons', { method: 'POST', body: JSON.stringify(lessons) })
    if (exercises.length || quizzes.length) throw new Error(`${c.title} : exercices ou QCM dans la sauvegarde, non prévus par ce script.`)
  }
}

for (const [level, sid] of Object.entries(SUBJECTS)) {
  const chs = await sb(`/chapters?subject_id=eq.${sid}&select=title,lessons(id)`)
  console.log(`${level} : ${chs.length} chapitre(s), ${chs.reduce((n, c) => n + c.lessons.length, 0)} leçon(s)`)
}
