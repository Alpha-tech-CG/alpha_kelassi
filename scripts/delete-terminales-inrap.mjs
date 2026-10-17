/**
 * Supprime les cours Terminale ajoutés automatiquement (seed INRAP) pour les
 * séries A, C et D : les chapitres dont `description` commence par
 * "Programme officiel INRAP", dans Anglais / Français / Philosophie.
 *
 * Le contenu ajouté sur le site (description différente) n'est JAMAIS touché.
 * La suppression se fait par chapitre ; tout le reste part en cascade
 * (leçons, progression, exercices, QCM, calendrier…).
 *
 * Sécurité : refuse de supprimer un chapitre absent du backup fourni.
 *
 * Usage :
 *   node scripts/delete-terminales-inrap.mjs backups/terminales-inrap-acd-XXXX.json            (dry-run)
 *   node scripts/delete-terminales-inrap.mjs backups/terminales-inrap-acd-XXXX.json --confirm
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, isAbsolute } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const backupArg = process.argv[2]
const CONFIRM = process.argv.includes('--confirm')
if (!backupArg) throw new Error('Usage: delete-terminales-inrap.mjs <backup.json> [--confirm]')

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

async function sb(path, init = {}) {
  const r = await fetch(`${URL}/rest/v1${path}`, {
    ...init,
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, ...(init.headers ?? {}) },
  })
  const t = await r.text()
  const d = t ? JSON.parse(t) : null
  if (!r.ok) throw new Error(`${init.method || 'GET'} ${path} -> ${r.status}: ${JSON.stringify(d)}`)
  return d
}
const inList = (ids) => `(${ids.join(',')})`

const backup = JSON.parse(
  readFileSync(isAbsolute(backupArg) ? backupArg : join(ROOT, backupArg), 'utf-8')
)
const backupIds = new Set(backup.chapters.map((c) => c.id))

// Recalcule la cible en direct, exactement comme le backup.
const subjects = await sb(
  '/subjects?select=id,name,level&level=in.(bac_a,bac_c,bac_d)&name=in.(Anglais,Fran%C3%A7ais,Philosophie)'
)
const subjectIds = subjects.map((s) => s.id)
const chapters = await sb(
  `/chapters?subject_id=in.${inList(subjectIds)}&description=ilike.Programme officiel INRAP*&select=id,title,subject_id`
)

// Sécurité : chaque chapitre ciblé doit exister dans le backup.
const notBacked = chapters.filter((c) => !backupIds.has(c.id))
if (notBacked.length) {
  throw new Error(
    `Arrêt : ${notBacked.length} chapitre(s) ciblé(s) absent(s) du backup — ` +
      notBacked.map((c) => `${c.title} (${c.id})`).join(' ; ')
  )
}

const targetIds = chapters.map((c) => c.id)
const byLevel = {}
for (const c of chapters) {
  const s = subjects.find((s) => s.id === c.subject_id)
  const k = `${s.name}/${s.level}`
  byLevel[k] = (byLevel[k] || 0) + 1
}
console.log(`Chapitres INRAP ciblés : ${targetIds.length}`)
for (const [k, v] of Object.entries(byLevel)) console.log(`  ${k} : ${v}`)

if (!CONFIRM) {
  console.log('\n[DRY-RUN] Ajoute --confirm pour supprimer réellement (cascade).')
  process.exit(0)
}

await sb(`/chapters?id=in.${inList(targetIds)}`, {
  method: 'DELETE',
  headers: { Prefer: 'return=minimal' },
})

// Vérification : plus aucun chapitre INRAP dans ces matières.
const left = await sb(
  `/chapters?subject_id=in.${inList(subjectIds)}&description=ilike.Programme officiel INRAP*&select=id`
)
console.log(`\nSuppression effectuée. Chapitres INRAP restants : ${left.length}`)
if (left.length) throw new Error('Des chapitres INRAP subsistent — à vérifier.')
