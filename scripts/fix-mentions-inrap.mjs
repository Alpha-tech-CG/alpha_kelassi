/**
 * Retire des leçons la phrase « *Programme officiel BEPC (INRAP/MEPPSA) — points à
 * couvrir pour "…". Cours détaillé à venir.* » ajoutée par un import automatique.
 * Demande de l'utilisateur du 18/10/2026 : ne plus parler de l'INRAP ni des
 * objectifs du programme dans les cours. Sauvegarde dans scripts/.backup-inrap-*.json.
 *
 * Usage : node scripts/fix-mentions-inrap.mjs [--dry-run]
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
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> HTTP ${res.status}: ${text}`)
  return text ? JSON.parse(text) : null
}

const rows = await sb('/lessons?content=ilike.*INRAP*&select=id,title,content')
const LINE = /\n*\*Programme officiel[^*\n]*INRAP[^*\n]*\*\s*$/
const changes = []
for (const r of rows) {
  const next = r.content.replace(LINE, '').trimEnd()
  if (next === r.content || /inrap/i.test(next)) {
    console.log('À VOIR À LA MAIN :', r.id, r.title)
    continue
  }
  changes.push({ ...r, next })
}
// Blocs « ### Objectifs » en tête de leçon (résumés CEPE) : la liste des objectifs
// du programme, pas du contenu à apprendre.
// Puces « - », « • » ou « * » suivie d'un espace (pas « ** » d'un titre en gras).
const OBJ_BLOCK = /^\s*#{2,4}\s*Objectifs?( pédagogiques| du cours)?\s*:?[ \t]*\r?\n([ \t]*(?:[-•]|\*(?= ))[^\n]*\r?\n)+\s*/i
const withObjectives = await sb('/lessons?content=ilike.*Objectif*&select=id,title,content')
for (const r of withObjectives) {
  if (!OBJ_BLOCK.test(r.content)) continue
  rows.push(r)
  changes.push({ ...r, next: r.content.replace(OBJ_BLOCK, '') })
}
console.log(`${changes.length} leçon(s) à corriger (mentions INRAP + blocs « Objectifs »)`)
if (DRY_RUN) { for (const c of changes) console.log('---', c.title, '\n', c.next); process.exit(0) }
writeFileSync(join(__dirname, `.backup-inrap-${new Date().toISOString().replace(/[:.]/g, '-')}.json`), JSON.stringify(rows, null, 2))
for (const c of changes) await sb(`/lessons?id=eq.${c.id}`, { method: 'PATCH', body: JSON.stringify({ content: c.next }) })
console.log('écrit.')
