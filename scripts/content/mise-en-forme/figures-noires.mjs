/**
 * 15 figures du manuel de maths 3e (BEPC) étaient des rectangles noirs : des dessins
 * Word mal rendus à l'extraction. figures-bepc/ contient les vraies figures, reprises
 * du PDF (images intactes, sans filigrane ; la flèche « u = AB » est un recadrage de
 * la page). Ce script les dépose dans course-images/bepc-figures-v2/<nom>-v3.png
 * (nouveau nom : pas de cache) et remplace les liens dans le contenu. Sauvegarde dans
 * backups/ ; --restore <fichier> remet l'ancien texte.
 *
 * Usage : node scripts/content/mise-en-forme/figures-noires.mjs [--dry-run]
 *         node scripts/content/mise-en-forme/figures-noires.mjs --restore backups/<fichier>.json
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY = process.argv.includes('--dry-run')
const RESTORE = process.argv.includes('--restore') ? process.argv[process.argv.indexOf('--restore') + 1] : null
const env = Object.fromEntries(readFileSync(join(__dirname, '..', '..', '..', 'apps', 'web', '.env.local'), 'utf-8').split('\n').filter(l => l.includes('=') && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const URL = env.NEXT_PUBLIC_SUPABASE_URL, KEY = env.SUPABASE_SERVICE_ROLE_KEY
async function sb(path, init) {
  const r = await fetch(`${URL}/rest/v1${path}`, { ...init, headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}`, Prefer: 'return=representation', ...(init?.headers ?? {}) } })
  const t = await r.text(); const j = t ? JSON.parse(t) : null
  if (!r.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> ${r.status}: ${JSON.stringify(j).slice(0, 300)}`)
  return j
}

if (RESTORE) {
  const backup = JSON.parse(readFileSync(join(__dirname, RESTORE), 'utf8'))
  for (const b of backup) await sb(`/lessons?id=eq.${b.id}`, { method: 'PATCH', body: JSON.stringify({ content: b.content }) })
  console.log(`Restauré : ${backup.length} leçons.`)
  process.exit(0)
}

const DIR = join(__dirname, 'figures-bepc')
const PUBLIC = `${URL}/storage/v1/object/public/course-images/bepc-figures-v2/`
const replace = new Map()
for (const f of readdirSync(DIR).filter((f) => f.endsWith('.png'))) {
  const name = f.replace(/\.png$/, '')
  if (!DRY) {
    const up = await fetch(`${URL}/storage/v1/object/course-images/bepc-figures-v2/${name}-v3.png`, { method: 'POST', headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'image/png', 'x-upsert': 'true' }, body: readFileSync(join(DIR, f)) })
    if (!up.ok) throw new Error(`upload ${name} -> ${up.status} ${await up.text()}`)
  }
  replace.set(`${PUBLIC}${name}.png`, `${PUBLIC}${name}-v3.png`)
}

const lessons = await sb(`/lessons?select=id,title,content&content=like.*bepc-figures-v2*`)
const backup = []
let n = 0
for (const l of lessons) {
  let text = l.content
  for (const [from, to] of replace) { const parts = text.split(from); n += parts.length - 1; text = parts.join(to) }
  if (text === l.content) continue
  backup.push({ id: l.id, title: l.title, content: l.content })
  if (!DRY) await sb(`/lessons?id=eq.${l.id}`, { method: 'PATCH', body: JSON.stringify({ content: text }) })
}
console.log(`${DRY ? '[dry-run] ' : ''}${replace.size} figures, ${n} liens remplacés dans ${backup.length} leçons`)
if (!DRY && backup.length) {
  mkdirSync(join(__dirname, 'backups'), { recursive: true })
  const file = join(__dirname, 'backups', `figures-noires-avant-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  writeFileSync(file, JSON.stringify(backup, null, 1))
  console.log(`Sauvegarde : ${file}`)
}
