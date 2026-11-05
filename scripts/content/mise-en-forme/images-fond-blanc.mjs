/**
 * Les images à fond transparent (traits noirs sur fond vide) apparaissent noires ou
 * invisibles sur un fond sombre. Ce script repère dans tout le contenu (leçons,
 * énoncés, corrigés) les images du bucket course-images qui ont de la transparence,
 * en dépose une copie aplatie sur fond blanc (même chemin + « -fond-blanc.png ») et
 * remplace le lien dans les textes. Sauvegarde dans backups/.
 *
 * Usage : node scripts/content/mise-en-forme/images-fond-blanc.mjs [--dry-run]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..', '..')
const require = createRequire(import.meta.url)
const sharp = require(join(ROOT, 'node_modules', '.pnpm', 'sharp@0.34.5', 'node_modules', 'sharp'))
const DRY = process.argv.includes('--dry-run')
const env = Object.fromEntries(readFileSync(join(ROOT, 'apps', 'web', '.env.local'), 'utf-8').split('\n').filter(l => l.includes('=') && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const URL = env.NEXT_PUBLIC_SUPABASE_URL, KEY = env.SUPABASE_SERVICE_ROLE_KEY
async function sb(path, init) {
  const r = await fetch(`${URL}/rest/v1${path}`, { ...init, headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}`, Prefer: 'return=representation', ...(init?.headers ?? {}) } })
  const t = await r.text(); const j = t ? JSON.parse(t) : null
  if (!r.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> ${r.status}: ${JSON.stringify(j).slice(0, 300)}`)
  return j
}
async function all(p) { let out = []; for (let o = 0; ; o += 1000) { const page = await sb(`${p}&order=${p.startsWith('/exercise_solutions') ? 'exercise_id' : 'id'}&offset=${o}&limit=1000`); out = out.concat(page); if (page.length < 1000) return out } }

const PUBLIC = `${URL}/storage/v1/object/public/course-images/`
const TABLES = [
  { table: 'lessons', key: 'id', col: 'content' },
  { table: 'exercises', key: 'id', col: 'statement' },
  { table: 'exercise_solutions', key: 'exercise_id', col: 'solution' },
]
const rows = []
for (const t of TABLES) for (const r of await all(`/${t.table}?select=${t.key},${t.col}&${t.col}=like.*course-images*`)) rows.push({ ...t, id: r[t.key], text: r[t.col] })
const urls = new Set()
for (const r of rows) for (const m of r.text.matchAll(/https?:\/\/[^\s)"'>]+\/course-images\/[^\s)"'>]+\.png/g)) if (!m[0].includes('-fond-blanc')) urls.add(m[0])
console.log(`${urls.size} images PNG dans ${rows.length} contenus`)

const replace = new Map()
for (const url of urls) {
  let res; for (let t = 0; t < 6; t++) { res = await fetch(url); if (res.status !== 429) break; await new Promise((ok) => setTimeout(ok, 1500 * (t + 1))) }
  if (!res.ok) { console.log('  inaccessible', res.status, url); continue }
  const buf = Buffer.from(await res.arrayBuffer())
  const meta = await sharp(buf).metadata()
  if (!meta.hasAlpha) continue
  // Part des pixels réellement transparents (comptés un à un : la moyenne du canal
  // alpha donnée par stats() est fausse sur certaines PNG à palette).
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  let clear = 0
  for (let p = 3; p < data.length; p += info.channels) if (data[p] < 250) clear++
  const transparent = clear / (info.width * info.height)
  if (transparent < 0.02) continue
  const path = decodeURIComponent(url.slice(PUBLIC.length)).replace(/\.png$/, '-fond-blanc.png')
  const png = await sharp(buf).flatten({ background: '#ffffff' }).png({ compressionLevel: 9 }).toBuffer()
  if (!DRY) {
    const up = await fetch(`${URL}/storage/v1/object/course-images/${path.split('/').map(encodeURIComponent).join('/')}`, { method: 'POST', headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'image/png', 'x-upsert': 'true' }, body: png })
    if (!up.ok) throw new Error(`upload ${path} -> ${up.status} ${await up.text()}`)
  }
  replace.set(url, `${PUBLIC}${path.split('/').map(encodeURIComponent).join('/')}`)
  console.log(`  ${Math.round(transparent * 100)} % transparent → ${path}`)
}

const backup = []
for (const r of rows) {
  let text = r.text
  for (const [from, to] of replace) text = text.split(from).join(to)
  if (text === r.text) continue
  backup.push({ table: r.table, key: r.key, col: r.col, id: r.id, before: r.text })
  if (!DRY) await sb(`/${r.table}?${r.key}=eq.${r.id}`, { method: 'PATCH', body: JSON.stringify({ [r.col]: text }) })
}
console.log(`${DRY ? '[dry-run] ' : ''}${replace.size} images aplaties, ${backup.length} contenus mis à jour`)
if (!DRY && backup.length) {
  mkdirSync(join(__dirname, 'backups'), { recursive: true })
  const file = join(__dirname, 'backups', `images-avant-fond-blanc-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  writeFileSync(file, JSON.stringify(backup, null, 1))
  console.log(`Sauvegarde : ${file}`)
}
