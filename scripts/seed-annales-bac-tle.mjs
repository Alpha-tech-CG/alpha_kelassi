/**
 * Seed des ANNALES DU BAC — Terminales générales A, C et D (République du Congo).
 *
 * Sources : PDF fournis par l'utilisateur le 26/10/2026 (sujets officiels du bac,
 * bacs blancs zonaux 2026, corrigés). Les énoncés sont transcrits fidèlement ; quand
 * seul le corrigé était fourni, l'énoncé est reconstitué d'après lui et le signale.
 * Les corrigés sont rédigés pour l'application (démarche + résultats), pas recopiés.
 *
 * Un sujet = un exercice (énoncé complet + corrigé), publié dans l'espace « Exercices »
 * de la matière, dans un chapitre d'annales. Les sujets de physique-chimie sont
 * partagés : partie chimie dans la matière « CHIMIE », partie physique dans « Physique ».
 *
 * Les matières sont résolues par (niveau, nom exact) et ne sont JAMAIS créées : une
 * matière introuvable arrête le script. Idempotent (titre) ; rien n'est supprimé.
 *
 * Usage :
 *   node scripts/seed-annales-bac-tle.mjs --dry-run
 *   node scripts/seed-annales-bac-tle.mjs
 *   node scripts/seed-annales-bac-tle.mjs --module=maths-a     (un seul fichier de contenu)
 */
import { readFileSync, readdirSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'
import { syncExercises } from './lib/exercises.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CONTENT = join(__dirname, 'content', 'annales-bac-tle')
const DRY_RUN = process.argv.includes('--dry-run')
const ONLY = process.argv.find((a) => a.startsWith('--module='))?.slice('--module='.length)

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trimStart().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] }),
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) throw new Error('NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans apps/web/.env.local')

async function sb(path, init) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: 'return=representation',
      ...(init?.headers ?? {}),
    },
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : null
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> HTTP ${res.status}: ${JSON.stringify(json)}`)
  return json
}

const tag = DRY_RUN ? '[dry-run] ' : ''

async function resolveSubject(name, level) {
  const found = await sb(`/subjects?select=id,name&level=eq.${level}&name=eq.${encodeURIComponent(name)}`)
  if (found.length !== 1) throw new Error(`Matière « ${name} » (${level}) : ${found.length} trouvée(s), attendu 1. Rien n'est créé.`)
  return found[0].id
}

async function resolveChapter(subjectId, title, description) {
  const existing = await sb(`/chapters?select=id&subject_id=eq.${subjectId}&title=eq.${encodeURIComponent(title)}`)
  if (existing[0]) return existing[0].id
  if (DRY_RUN) { console.log(`${tag}    chapitre « ${title} » : créerait`); return null }
  const [last] = await sb(`/chapters?subject_id=eq.${subjectId}&select=order_index&order=order_index.desc&limit=1`)
  const [created] = await sb('/chapters', {
    method: 'POST',
    body: JSON.stringify({ subject_id: subjectId, title, description: description ?? null, order_index: (last?.order_index ?? -1) + 1 }),
  })
  console.log(`    chapitre « ${title} » créé`)
  return created.id
}

// Pages scannées (figures des sujets) : JPEG du dossier PAGES_DIR, envoyés dans le bucket
// public course-images et ajoutés en fin d'énoncé.
const PAGES_DIR = process.env.PAGES_DIR
const uploaded = new Map()
async function pageUrl(file) {
  if (uploaded.has(file)) return uploaded.get(file)
  const storagePath = `annales/2026-10-26/${file}`
  const url = `${SUPABASE_URL}/storage/v1/object/public/course-images/${storagePath}`
  if (!DRY_RUN) {
    if (!PAGES_DIR) throw new Error('PAGES_DIR manquant (dossier des pages JPEG)')
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/course-images/${storagePath}`, {
      method: 'POST',
      headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, 'Content-Type': 'image/jpeg', 'x-upsert': 'true' },
      body: readFileSync(join(PAGES_DIR, file)),
    })
    if (!res.ok) throw new Error(`upload ${file} -> HTTP ${res.status}: ${await res.text()}`)
  }
  uploaded.set(file, url)
  return url
}
async function withPages(ex) {
  if (!ex.pages?.length) return ex.statement
  const imgs = []
  for (const [i, f] of ex.pages.entries()) imgs.push(`![Sujet original, page ${i + 1}](${await pageUrl(f)})`)
  const s = ex.pages.length > 1 ? 's' : ''
  return `${ex.statement}\n\n---\n\n**Sujet original (page${s} scannée${s}, avec les figures)**\n\n${imgs.join('\n\n')}`
}

const modules = readdirSync(CONTENT).filter((f) => f.endsWith('.mjs')).map((f) => f.slice(0, -4))
const selected = ONLY ? modules.filter((m) => m === ONLY) : modules
if (!selected.length) throw new Error(`Module inconnu : ${ONLY} (disponibles : ${modules.join(', ')}).`)

console.log(DRY_RUN ? '=== DRY RUN (aucune écriture) ===' : '=== Écriture en base ===')
let total = 0
const backup = []
for (const m of selected) {
  const { BLOCS } = await import(pathToFileURL(join(CONTENT, `${m}.mjs`)).href)
  console.log(`\n=== ${m} ===`)
  for (const b of BLOCS) {
    for (const level of b.levels) {
      console.log(`■ ${b.subject} — ${level} — « ${b.chapterTitle} » (${b.exercises.length} sujet(s))`)
      const subjectId = await resolveSubject(b.subject, level)
      const chapterId = await resolveChapter(subjectId, b.chapterTitle, b.description)
      const exercises = []
      for (const [i, e] of b.exercises.entries()) {
        const { pages, ...rest } = e
        exercises.push({ difficulty: 3, order_index: (b.orderStart ?? 0) + i, ...rest, statement: await withPages(e) })
      }
      await syncExercises(sb, chapterId, exercises, { dryRun: DRY_RUN, backup })
      // Chapitre original avec des copies liées dans d'autres séries : on les met à jour.
      if (b.syncCopies && chapterId && !DRY_RUN) {
        const n = await sb('/rpc/sync_chapter_copies', { method: 'POST', body: JSON.stringify({ p_chapter: chapterId }) })
        console.log(`      copies liées synchronisées : ${n}`)
      }
      total += exercises.length
    }
  }
}
console.log(`\n=== Terminé : ${total} sujet(s) traité(s)${DRY_RUN ? ' (dry-run)' : ''}. ${backup.length} mise(s) à jour. ===`)
