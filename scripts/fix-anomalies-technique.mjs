/**
 * Corrections ponctuelles des matières du lycée technique (état des lieux du 09/10/2026).
 *
 *  1. Philosophie G2 : le chapitre « Chapitre 2 : Les relations Nord-Sud » est un
 *     doublon du chapitre de Géographie G2 (même texte) rangé par erreur → retiré.
 *  2. G3 : matière « Math » vide (un chapitre sans leçon), doublon de
 *     « Mathématiques Générales » → supprimée, si rien d'autre ne la référence.
 *  3. F3 Français : deux chapitres de test de niveau primaire (« Le verbe être »,
 *     « le verbe ay », 71 caractères au total) → retirés ; la matière reste.
 *  4. G2 : fautes de frappe dans des titres de chapitres (et de leçons homonymes).
 *
 * Tout ce qui est supprimé est d'abord sauvegardé dans scripts/.backup-anomalies-*.json.
 *
 * Usage : node scripts/fix-anomalies-technique.mjs [--dry-run]
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

const PHILO_DUP = 'a4585677-d058-45e6-bddd-bd7efa9116dd'
const GEO_ORIGINAL = '5f484d7e-48e7-4301-8844-b8fa018af9f9'
const G3_MATH = '35122c06-2997-4e2c-b32b-2a79d00036c6'
const F3_JUNK = ['1c162c4c-d238-4d5d-94cb-f25e8cf548ba', '26447c0c-c3c6-4165-b9ff-aa234ed6bef4']
const RENAMES = {
  'c9c730e7-1d18-4d8d-96eb-795eab39380e': 'Chapitre 1 : Les sources du droit commercial',
  '6df635db-71c2-48d9-9386-ea9532c864a7': 'Introduction au droit commercial',
  'cfaba8a7-7afc-444b-8645-9b6e4105b7c8': 'Chapter 3: English practical work — Tag questions',
  'e15dd06d-a41c-40c8-a7e3-56cdc285a1e9': 'Chapter 7: Grammar — Relative pronouns',
  '7682419b-8177-46e1-b251-b4cecc0787f4': 'Chapter 2: The simple present',
}

const backup = { at: new Date().toISOString() }
const sel = 'id,subject_id,title,description,order_index,lessons(*),exercises(*),quizzes(*)'

// 1. Doublon de géographie dans Philosophie G2 — on vérifie que l'original existe toujours.
const [geo] = await sb(`/chapters?id=eq.${GEO_ORIGINAL}&select=id,lessons(count)`)
if (!geo || !geo.lessons?.[0]?.count) throw new Error('Chapitre original de géographie introuvable : arrêt.')
backup.philoDuplicate = await sb(`/chapters?id=eq.${PHILO_DUP}&select=${sel}`)

// 2. Matière « Math » G3 : aucune référence hors de son chapitre vide.
const [math] = await sb(`/subjects?id=eq.${G3_MATH}&level=eq.bac_g3&select=*`)
if (math) {
  const tables = ['documents', 'quizzes', 'videos', 'user_progress', 'revision_sessions', 'courses', 'tutor_subjects', 'correction_missions', 'study_groups', 'curriculum_items']
  for (const t of tables) {
    const rows = await sb(`/${t}?subject_id=eq.${math.id}&select=subject_id&limit=1`)
    if (rows.length) throw new Error(`La matière « Math » G3 est référencée dans ${t} : arrêt.`)
  }
  const chs = await sb(`/chapters?subject_id=eq.${math.id}&select=${sel}`)
  if (chs.some((c) => c.lessons.length || c.exercises.length || c.quizzes.length)) throw new Error('« Math » G3 n\'est plus vide : arrêt.')
  backup.g3Math = { subject: math, chapters: chs }
}

// 3. Chapitres de test en F3.
backup.f3Junk = await sb(`/chapters?id=in.(${F3_JUNK.join(',')})&select=${sel}`)
if (backup.f3Junk.some((c) => c.lessons.reduce((n, l) => n + (l.content?.length ?? 0), 0) > 200)) throw new Error('Un chapitre F3 a reçu du contenu : arrêt.')

// 4. Titres.
backup.renames = await sb(`/chapters?id=in.(${Object.keys(RENAMES).join(',')})&select=id,title,lessons(id,title)`)

console.log(`${DRY_RUN ? '[DRY-RUN] ' : ''}Philosophie G2 : retrait de « ${backup.philoDuplicate[0]?.title ?? '(déjà fait)'} »`)
console.log(`G3 : suppression de la matière « ${math?.name ?? '(déjà faite)'} »`)
console.log(`F3 : retrait de ${backup.f3Junk.length} chapitre(s) de test`)
for (const r of backup.renames) console.log(`Titre : « ${r.title.trim()} » → « ${RENAMES[r.id]} »`)
if (DRY_RUN) process.exit(0)

const file = join(__dirname, `.backup-anomalies-${backup.at.replace(/[:.]/g, '-')}.json`)
writeFileSync(file, JSON.stringify(backup, null, 2))
console.log(`Sauvegarde : ${file}`)

if (backup.philoDuplicate.length) await sb(`/chapters?id=eq.${PHILO_DUP}`, { method: 'DELETE' })
if (math) await sb(`/subjects?id=eq.${math.id}`, { method: 'DELETE' })
if (backup.f3Junk.length) await sb(`/chapters?id=in.(${F3_JUNK.join(',')})`, { method: 'DELETE' })
for (const r of backup.renames) {
  await sb(`/chapters?id=eq.${r.id}`, { method: 'PATCH', body: JSON.stringify({ title: RENAMES[r.id] }) })
  // Leçon portant le même titre fautif que son chapitre : corrigée aussi.
  for (const l of r.lessons) if (l.title.trim() === r.title.trim()) await sb(`/lessons?id=eq.${l.id}`, { method: 'PATCH', body: JSON.stringify({ title: RENAMES[r.id] }) })
}
console.log('Corrections appliquées.')
