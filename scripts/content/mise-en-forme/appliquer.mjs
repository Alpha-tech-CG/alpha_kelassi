/**
 * Met en forme les leçons « à plat » de toutes les matières : leurs faux titres
 * (« I- … », « 1) … », « SECTION 2 — … », lignes en majuscules ou en gras, questions)
 * deviennent de vrais sous-titres (structurer.mjs), pour que le sommaire repliable et
 * le style des cours s'appliquent partout. Ne touche qu'aux leçons qui ont moins de
 * deux vrais titres. Sauvegarde dans backups/ ; --restore <fichier> remet l'ancien texte.
 *
 * Usage : node scripts/content/mise-en-forme/appliquer.mjs [--dry-run]
 *         node scripts/content/mise-en-forme/appliquer.mjs --restore backups/<fichier>.json
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { structurer } from './structurer.mjs'

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

let lessons = []
for (let o = 0; ; o += 1000) {
  const page = await sb(`/lessons?select=id,title,type,content,chapters(title,subjects(name,level))&type=in.(cours,resume,fiche)&content=not.is.null&order=id&offset=${o}&limit=1000`)
  lessons = lessons.concat(page); if (page.length < 1000) break
}
const backup = []
const bySubject = {}
let heads = 0
for (const l of lessons) {
  const realHeads = (l.content.replace(/```[\s\S]*?```/g, '').match(/^#{1,4}\s/gm) || []).length
  if (realHeads >= 2) continue
  const { text, changed } = structurer(l.content)
  if (!changed || text === l.content) continue
  const s = l.chapters?.subjects; const key = s ? `${s.name} (${s.level})` : '?'
  bySubject[key] = (bySubject[key] || 0) + 1
  heads += changed
  backup.push({ id: l.id, title: l.title, content: l.content })
  if (!DRY) await sb(`/lessons?id=eq.${l.id}`, { method: 'PATCH', body: JSON.stringify({ content: text }) })
}
console.log(`${DRY ? '[dry-run] ' : ''}${backup.length} leçons mises en forme, ${heads} sous-titres créés`)
console.log(JSON.stringify(Object.entries(bySubject).sort((a, b) => b[1] - a[1])))
if (!DRY && backup.length) {
  mkdirSync(join(__dirname, 'backups'), { recursive: true })
  const file = join(__dirname, 'backups', `lecons-avant-mise-en-forme-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  writeFileSync(file, JSON.stringify(backup, null, 1))
  console.log(`Sauvegarde : ${file}`)
}
