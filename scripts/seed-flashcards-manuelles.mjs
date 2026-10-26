/**
 * Publie les FLASHCARDS RÉDIGÉES des chapitres (table chapter_flashcards, source = 'manuel').
 *
 * Les cartes sont écrites à la main à partir du cours de chaque chapitre, une cinquantaine
 * par chapitre ; l'élève en voit 15, tirées au hasard. Modules : scripts/content/flashcards/*.mjs
 *   export const DECKS = [{ chapter: '<uuid>', title: '<titre exact du chapitre>',
 *                           also?: ['<uuid>', …], cards: [['recto', 'verso'], …] }]
 * `also` : autres chapitres au même programme (ex. même chapitre en série C et en série D).
 * Les copies liées d'un chapitre (chapters.source_chapter_id, migration 060) reçoivent
 * automatiquement le même paquet.
 *
 * Dès qu'un chapitre a au moins 15 cartes rédigées, ses cartes tirées automatiquement du
 * cours (source = 'auto') sont retirées. Idempotent ; ne touche aucun autre chapitre.
 *
 * Usage : node scripts/seed-flashcards-manuelles.mjs [--dry-run] [--module=maths-tle]
 */
import { readFileSync, readdirSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CONTENT = join(__dirname, 'content', 'flashcards')
const DRY_RUN = process.argv.includes('--dry-run')
const ONLY = process.argv.find((a) => a.startsWith('--module='))?.slice(9)
const MIN_SESSION = 15

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

// Comparaison des rectos : on garde les symboles (« < » et « = » font deux cartes différentes).
const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim()

/** Contrôles de forme d'un paquet : longueurs, doublons, nombre de cartes. */
export function checkDeck(deck) {
  const errors = []
  const seen = new Set()
  for (const [i, c] of deck.cards.entries()) {
    if (!Array.isArray(c) || c.length !== 2) { errors.push(`carte ${i + 1} : format [recto, verso] attendu`); continue }
    const [f, b] = c
    if (!f?.trim() || f.length > 500) errors.push(`carte ${i + 1} : recto vide ou trop long`)
    if (!b?.trim() || b.length > 2000) errors.push(`carte ${i + 1} : verso vide ou trop long`)
    const k = norm(f)
    if (seen.has(k)) errors.push(`carte ${i + 1} : recto en double (« ${f.slice(0, 50)} »)`)
    seen.add(k)
  }
  if (deck.cards.length < MIN_SESSION) errors.push(`${deck.cards.length} cartes seulement (au moins ${MIN_SESSION})`)
  return errors
}

const modules = readdirSync(CONTENT).filter((f) => f.endsWith('.mjs')).map((f) => f.slice(0, -4))
const selected = ONLY ? modules.filter((m) => m === ONLY) : modules
if (!selected.length) throw new Error(`Module inconnu : ${ONLY} (disponibles : ${modules.join(', ')}).`)

let chapters = 0, cards = 0
for (const m of selected) {
  const { DECKS } = await import(pathToFileURL(join(CONTENT, `${m}.mjs`)).href)
  console.log(`\n=== ${m} (${DECKS.length} chapitre(s)) ===`)
  for (const deck of DECKS) {
    const errors = checkDeck(deck)
    if (errors.length) throw new Error(`« ${deck.title} » :\n  - ${errors.join('\n  - ')}`)
    const [ch] = await sb(`/chapters?select=id,title&id=eq.${deck.chapter}`)
    if (!ch) throw new Error(`Chapitre ${deck.chapter} introuvable (« ${deck.title} »).`)
    if (ch.title.trim() !== deck.title.trim()) throw new Error(`Chapitre ${deck.chapter} : titre « ${ch.title} » ≠ « ${deck.title} ».`)
    const copies = await sb(`/chapters?select=id&source_chapter_id=in.(${[deck.chapter, ...(deck.also ?? [])].join(',')})`)
    const targets = [...new Set([deck.chapter, ...(deck.also ?? []), ...copies.map((c) => c.id)])]
    console.log(`■ ${deck.title} — ${deck.cards.length} cartes → ${targets.length} chapitre(s)`)
    chapters += targets.length
    cards += deck.cards.length * targets.length
    if (DRY_RUN) continue
    for (const id of targets) {
      await sb(`/chapter_flashcards?chapter_id=eq.${id}&source=eq.manuel`, { method: 'DELETE' })
      await sb('/chapter_flashcards', {
        method: 'POST',
        body: JSON.stringify(deck.cards.map(([front, back], i) => ({ chapter_id: id, front, back, order_index: i, source: 'manuel' }))),
      })
      await sb(`/chapter_flashcards?chapter_id=eq.${id}&source=eq.auto`, { method: 'DELETE' })
    }
  }
}
console.log(`\n=== ${chapters} chapitre(s), ${cards} carte(s)${DRY_RUN ? ' (dry-run)' : ''} ===`)
