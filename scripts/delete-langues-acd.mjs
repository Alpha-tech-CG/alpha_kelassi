/**
 * Supprime les cours de langues retirés (voir scripts/backup-langues-acd.mjs) :
 * TOUS les chapitres des matières Anglais A/C/D et Espagnol A. La suppression se
 * fait par chapitre ; le reste part en cascade (leçons, progression, exercices,
 * QCM, calendrier…).
 *
 * `source_chapter_id` est ON DELETE SET NULL et la synchro des copies liées
 * (migration 060) n'a PAS de trigger : supprimer originaux (C) et copies (A/D)
 * dans le même lot est donc sûr.
 *
 * Sécurité : refuse de supprimer un chapitre absent du backup fourni.
 *
 * Usage :
 *   node scripts/delete-langues-acd.mjs backups/langues-acd-XXXX.json            (dry-run)
 *   node scripts/delete-langues-acd.mjs backups/langues-acd-XXXX.json --confirm
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, isAbsolute } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const backupArg = process.argv[2]
const CONFIRM = process.argv.includes('--confirm')
if (!backupArg) throw new Error('Usage: delete-langues-acd.mjs <backup.json> [--confirm]')

const env = Object.fromEntries(
  readFileSync(join(ROOT, 'apps', 'web', '.env.local'), 'utf-8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trimStart().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const URL = env.NEXT_PUBLIC_SUPABASE_URL
const KEY = env.SUPABASE_SERVICE_ROLE_KEY

async function sb(path, init = {}) {
  const r = await fetch(`${URL}/rest/v1${path}`, { ...init, headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, ...(init.headers ?? {}) } })
  const t = await r.text()
  const d = t ? JSON.parse(t) : null
  if (!r.ok) throw new Error(`${init.method || 'GET'} ${path} -> ${r.status}: ${JSON.stringify(d)}`)
  return d
}
const inList = (ids) => `(${ids.join(',')})`

const backup = JSON.parse(readFileSync(isAbsolute(backupArg) ? backupArg : join(ROOT, backupArg), 'utf-8'))
const backupIds = new Set(backup.chapters.map((c) => c.id))
const subjectIds = backup.meta.subjects.map((s) => s.id)

// Recalcule la cible en direct : tous les chapitres des matières sauvegardées.
const subjects = await sb(`/subjects?id=in.${inList(subjectIds)}&select=id,name,level`)
const chapters = await sb(`/chapters?subject_id=in.${inList(subjectIds)}&select=id,title,subject_id`)

// Sécurité : chaque chapitre ciblé doit exister dans le backup.
const notBacked = chapters.filter((c) => !backupIds.has(c.id))
if (notBacked.length) {
  throw new Error(`Arrêt : ${notBacked.length} chapitre(s) ciblé(s) absent(s) du backup — ` +
    notBacked.map((c) => `${c.title} (${c.id})`).join(' ; '))
}

const targetIds = chapters.map((c) => c.id)
const byLevel = {}
for (const c of chapters) {
  const s = subjects.find((s) => s.id === c.subject_id)
  const k = `${s.name}/${s.level}`
  byLevel[k] = (byLevel[k] || 0) + 1
}
console.log(`Chapitres ciblés : ${targetIds.length}`)
for (const [k, v] of Object.entries(byLevel)) console.log(`  ${k} : ${v}`)

if (!CONFIRM) {
  console.log('\n[DRY-RUN] Ajoute --confirm pour supprimer réellement (cascade).')
  process.exit(0)
}

await sb(`/chapters?id=in.${inList(targetIds)}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } })

const left = await sb(`/chapters?subject_id=in.${inList(subjectIds)}&select=id`)
console.log(`\nSuppression effectuée. Chapitres restants dans ces matières : ${left.length}`)
if (left.length) throw new Error('Des chapitres subsistent — à vérifier.')
