/**
 * Prépare le paquet de FLASHCARDS de chaque chapitre (table chapter_flashcards, migration 075).
 *
 * Pas d'IA : les cartes sont tirées des cours du chapitre par l'extracteur du web
 * (apps/web/src/lib/flashcards/extract.ts — encadrés, définitions, propriétés, formules,
 * listes terme : explication, tableaux, questions, essentiel de chaque partie).
 * On vise 50 cartes par chapitre ; l'élève en voit 15, tirées au hasard à chaque séance.
 *
 * Les cartes sont réparties entre les leçons du chapitre (au prorata de leur longueur),
 * dédoublonnées, et numérotées. Rejouer le script remplace le paquet d'un chapitre
 * seulement s'il a changé. Un chapitre qui a ses cartes rédigées (`source = 'manuel'`,
 * scripts/seed-flashcards-manuelles.mjs) est laissé tel quel.
 *
 * Usage :
 *   node scripts/seed-flashcards-chapitres.mjs --dry-run      (statistiques seulement)
 *   node scripts/seed-flashcards-chapitres.mjs [--level=bac_d] [--chapter=<uuid>]
 */
import { readFileSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
const LEVEL = process.argv.find((a) => a.startsWith('--level='))?.slice(8)
const CHAPTER = process.argv.find((a) => a.startsWith('--chapter='))?.slice(10)
const TARGET = 50

const { extractFlashcards } = await import(
  pathToFileURL(join(__dirname, '..', 'apps', 'web', 'src', 'lib', 'flashcards', 'extract.ts')).href
)

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trimStart().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] }),
)
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL
const KEY = env.SUPABASE_SERVICE_ROLE_KEY
async function sb(path, init) {
  const res = await fetch(`${URL_}/rest/v1${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}`, Prefer: 'return=minimal', ...(init?.headers ?? {}) },
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> HTTP ${res.status}: ${text}`)
  return text ? JSON.parse(text) : null
}

/** Toutes les lignes d'une requête, par pages de 1000. */
async function all(path) {
  const out = []
  for (let from = 0; ; from += 1000) {
    const page = await sb(path, { headers: { Range: `${from}-${from + 999}` } })
    out.push(...page)
    if (page.length < 1000) return out
  }
}

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()

/** Paquet d'un chapitre : jusqu'à TARGET cartes, réparties entre ses leçons. */
export function buildDeck(lessons, target = TARGET) {
  const per = lessons.map((l) => extractFlashcards(l.content, 200, l.title))
  const total = per.reduce((s, c) => s + c.length, 0)
  if (total === 0) return []
  // Quota par leçon au prorata de ce qu'elle offre, puis on complète dans l'ordre du cours.
  const quota = per.map((c) => Math.min(c.length, Math.max(1, Math.round((c.length / total) * target))))
  const picked = per.map((c, i) => c.slice(0, quota[i]))
  let n = picked.reduce((s, c) => s + c.length, 0)
  for (let i = 0; n < target && i < per.length; i++) {
    const extra = per[i].slice(picked[i].length, picked[i].length + (target - n))
    picked[i].push(...extra)
    n += extra.length
  }
  const seen = new Set()
  const deck = []
  for (const c of picked.flat()) {
    const k = norm(c.front)
    if (seen.has(k)) continue
    seen.add(k)
    deck.push({ front: c.front.slice(0, 500), back: c.back.slice(0, 2000) })
    if (deck.length === target) break
  }
  return deck
}

let filter = ''
if (CHAPTER) filter = `&chapter_id=eq.${CHAPTER}`
const lessons = await all(
  `/lessons?select=id,title,content,order_index,chapter_id,chapters!inner(id,title,subjects!inner(level))&type=in.(cours,resume)&content=neq.${filter}${LEVEL ? `&chapters.subjects.level=eq.${LEVEL}` : ''}&order=chapter_id,order_index`,
)
const byChapter = new Map()
for (const l of lessons) {
  if (!l.content?.trim()) continue
  const list = byChapter.get(l.chapter_id) ?? []
  list.push(l)
  byChapter.set(l.chapter_id, list)
}

const existing = DRY_RUN ? [] : await all(`/chapter_flashcards?select=chapter_id,front,back,order_index&source=eq.auto${CHAPTER ? `&chapter_id=eq.${CHAPTER}` : ''}&order=chapter_id,order_index`)
const current = new Map()
for (const c of existing) {
  const list = current.get(c.chapter_id) ?? []
  list.push(c)
  current.set(c.chapter_id, list)
}

// Chapitres qui ont déjà leurs cartes rédigées : on n'y remet pas de cartes automatiques.
const manual = new Set(DRY_RUN ? [] : (await all('/chapter_flashcards?select=chapter_id&source=eq.manuel')).map((c) => c.chapter_id))

const buckets = { '0': 0, '1-14': 0, '15-29': 0, '30-49': 0, '50': 0 }
let cards = 0, written = 0, same = 0
for (const [chapterId, list] of byChapter) {
  if (manual.has(chapterId)) continue
  const deck = buildDeck(list)
  cards += deck.length
  const n = deck.length
  buckets[n === 0 ? '0' : n < 15 ? '1-14' : n < 30 ? '15-29' : n < 50 ? '30-49' : '50']++
  if (DRY_RUN) continue
  const before = (current.get(chapterId) ?? []).map((c) => `${c.front}\u0000${c.back}`).join('\n')
  const after = deck.map((c) => `${c.front}\u0000${c.back}`).join('\n')
  if (before === after) { same++; continue }
  await sb(`/chapter_flashcards?chapter_id=eq.${chapterId}&source=eq.auto`, { method: 'DELETE' })
  if (deck.length) {
    await sb('/chapter_flashcards', {
      method: 'POST',
      body: JSON.stringify(deck.map((c, i) => ({ chapter_id: chapterId, front: c.front, back: c.back, order_index: i, source: 'auto' }))),
    })
  }
  written++
}

console.log(`${byChapter.size} chapitres avec des cours — ${cards} cartes (${(cards / Math.max(1, byChapter.size)).toFixed(1)} en moyenne)`)
console.log('Répartition des paquets :', buckets)
if (!DRY_RUN) console.log(`${written} paquet(s) écrit(s), ${same} déjà à jour.`)
