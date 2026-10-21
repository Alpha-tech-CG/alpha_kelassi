/**
 * Import des documents reçus le 19/10/2026 (TD, devoirs, bacs blancs, annales, cours).
 * Contenu : scripts/content/import-2026-10-19/*.mjs — chaque module exporte `blocs` :
 *   { chapterId } ou { subjectId, chapterTitle, description }   → chapitre cible (créé si absent)
 *   exercises : [{ title, statement, solution }]                → exercises + exercise_solutions
 *   lessons   : [{ title, content }]                            → lessons (type cours)
 *   copyTo    : [subjectId]                                     → copie liée du chapitre (même cours dans une autre série)
 * Idempotent : un exercice / une leçon dont le titre existe déjà dans le chapitre est ignoré.
 *
 * Usage : node scripts/seed-import-2026-10-19.mjs <module…> [--dry-run]
 *   ex. node scripts/seed-import-2026-10-19.mjs maths svt --dry-run
 */
import { readFileSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
const modules = process.argv.slice(2).filter((a) => !a.startsWith('--'))
if (modules.length === 0) { console.error('Indique au moins un module (ex. maths)'); process.exit(1) }

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

async function sb(path, init) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
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

async function resolveChapter(b) {
  if (b.chapterId) {
    const [c] = await sb(`/rest/v1/chapters?id=eq.${b.chapterId}&select=id,title`)
    if (!c) throw new Error(`Chapitre introuvable : ${b.chapterId}`)
    return c.id
  }
  const existing = await sb(`/rest/v1/chapters?subject_id=eq.${b.subjectId}&title=eq.${encodeURIComponent(b.chapterTitle)}&select=id`)
  if (existing.length > 0) return existing[0].id
  const [last] = await sb(`/rest/v1/chapters?subject_id=eq.${b.subjectId}&select=order_index&order=order_index.desc&limit=1`)
  if (DRY_RUN) { console.log(`[dry-run] créerait chapitre « ${b.chapterTitle} »`); return null }
  const [c] = await sb('/rest/v1/chapters', {
    method: 'POST',
    body: JSON.stringify({ subject_id: b.subjectId, title: b.chapterTitle, description: b.description ?? null, order_index: (last?.order_index ?? 0) + 1 }),
  })
  console.log(`✓ Chapitre créé : ${b.chapterTitle}`)
  return c.id
}

async function existingTitles(table, chapterId) {
  if (!chapterId) return new Set()
  const extra = table === 'exercises' ? '&deleted_at=is.null' : ''
  const rows = await sb(`/rest/v1/${table}?chapter_id=eq.${chapterId}&select=title,order_index${extra}`)
  return { titles: new Set(rows.map((r) => r.title)), max: rows.reduce((m, r) => Math.max(m, r.order_index ?? 0), -1) }
}

// Pages scannées (figures des sujets) : rendues en JPEG (voir PLAN.md), envoyées dans le
// bucket public course-images et ajoutées en fin d'énoncé.
const PAGES_DIR = process.env.PAGES_DIR
const uploaded = new Map()
async function pageUrl(file) {
  if (uploaded.has(file)) return uploaded.get(file)
  const storagePath = `annales/2026-10-19/${file}`
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
  return `${ex.statement}\n\n---\n\n**Sujet original (page${ex.pages.length > 1 ? 's' : ''} scannée${ex.pages.length > 1 ? 's' : ''}, avec les figures)**\n\n${imgs.join('\n\n')}`
}

let created = 0
async function importBloc(b) {
  const label = b.chapterTitle ?? b.chapterId
  console.log(`\n— ${label} —`)
  const chapterId = await resolveChapter(b)

  if (b.lessons?.length) {
    const { titles = new Set(), max = -1 } = await existingTitles('lessons', chapterId)
    let order = max + 1
    for (const l of b.lessons) {
      if (titles.has(l.title)) { console.log(`  … leçon déjà présente : ${l.title}`); continue }
      if (DRY_RUN) { console.log(`  [dry-run] leçon ${l.title} (${l.content.length} car.)`); continue }
      await sb('/rest/v1/lessons', { method: 'POST', body: JSON.stringify({ chapter_id: chapterId, type: 'cours', title: l.title, content: l.content, is_premium: false, order_index: order++ }) })
      created++
      console.log(`  ✓ leçon ${l.title}`)
    }
  }

  if (b.exercises?.length) {
    const { titles = new Set(), max = -1 } = await existingTitles('exercises', chapterId)
    let order = max + 1
    for (const ex of b.exercises) {
      if (titles.has(ex.title)) { console.log(`  … exercice déjà présent : ${ex.title}`); continue }
      const statement = await withPages(ex)
      if (DRY_RUN) { console.log(`  [dry-run] ${ex.title} (${statement.length} / ${ex.solution.length} car., ${ex.pages?.length ?? 0} page(s))`); continue }
      const [row] = await sb('/rest/v1/exercises', {
        method: 'POST',
        body: JSON.stringify({ chapter_id: chapterId, title: ex.title, statement, difficulty: ex.difficulty ?? 2, is_premium: false, order_index: order++ }),
      })
      await sb('/rest/v1/exercise_solutions', { method: 'POST', body: JSON.stringify({ exercise_id: row.id, solution: ex.solution }) })
      created++
      console.log(`  ✓ ${ex.title}`)
    }
  }

  if (b.copyTo?.length && chapterId && !DRY_RUN) {
    for (const subjectId of b.copyTo) {
      const copies = await sb(`/rest/v1/chapters?source_chapter_id=eq.${chapterId}&subject_id=eq.${subjectId}&select=id`)
      if (copies.length === 0) {
        await sb('/rest/v1/rpc/copy_chapter_to_subject', { method: 'POST', body: JSON.stringify({ p_chapter: chapterId, p_subject: subjectId }) })
        console.log(`  ✓ copie liée créée dans la matière ${subjectId}`)
      }
    }
    await sb('/rest/v1/rpc/sync_chapter_copies', { method: 'POST', body: JSON.stringify({ p_chapter: chapterId }) })
  }
}

console.log(DRY_RUN ? '=== DRY RUN (aucune écriture) ===' : '=== Écriture en base ===')
for (const m of modules) {
  const { blocs } = await import(pathToFileURL(join(__dirname, 'content', 'import-2026-10-19', `${m}.mjs`)).href)
  for (const b of blocs) await importBloc(b)
}
console.log(`\n=== Terminé : ${created} élément(s) créé(s) ===`)
