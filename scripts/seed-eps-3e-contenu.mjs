/**
 * Contenu des cours d'EPS 3e (BEPC) — 06/11/2026. Les 4 chapitres n'avaient
 * qu'un squelette ; on rédige des leçons de théorie depuis le programme.
 * Source : scripts/content/eps-3e/*.md. Non destructif (sauvegarde).
 * Usage : node scripts/seed-eps-3e-contenu.mjs [--confirm]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC = join(__dirname, 'content', 'eps-3e')
const CONFIRM = process.argv.includes('--confirm')
const env = Object.fromEntries(readFileSync(join(ROOT, 'apps', 'web', '.env.local'), 'utf-8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trimStart().startsWith('#')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] }))
const URL = env.NEXT_PUBLIC_SUPABASE_URL, KEY = env.SUPABASE_SERVICE_ROLE_KEY
async function sb(path, init = {}) {
  const r = await fetch(`${URL}/rest/v1${path}`, { ...init, headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}`, ...(init.headers ?? {}) } })
  const t = await r.text(); const d = t ? JSON.parse(t) : null
  if (!r.ok) throw new Error(`${init.method || 'GET'} ${path} -> ${r.status}: ${JSON.stringify(d)}`)
  return d
}
const read = (f) => readFileSync(join(SRC, f), 'utf-8').trim()
const MAP = [
  { title: 'Athlétisme', coursId: '9498e8a1-d344-4729-aeb7-a57a4b20d47a', file: '01-athletisme.md' },
  { title: 'Sports collectifs', coursId: 'd673f5dc-d960-44f8-93a3-75fcb92863b1', file: '02-sports-collectifs.md' },
  { title: 'Gymnastique et danse', coursId: 'a74d42ea-6eb3-4122-9f83-fea1fb988dee', file: '03-gymnastique-danse.md' },
  { title: 'Natation et pleine nature', coursId: '63183704-5eaa-4194-81c3-8a501e3fc738', file: '04-natation-pleine-nature.md' },
]
async function main() {
  const lss = await sb(`/lessons?id=in.(${MAP.map((m) => m.coursId).join(',')})&select=*`)
  mkdirSync(join(ROOT, 'backups'), { recursive: true })
  const bfile = join(ROOT, 'backups', `eps-3e-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  writeFileSync(bfile, JSON.stringify({ created_at: new Date().toISOString(), lessons: lss }, null, 2), 'utf-8')
  console.log(`Sauvegarde : ${bfile}\n`)
  for (const m of MAP) {
    const content = read(m.file)
    console.log(`• ${m.title}  (${m.file}, ${content.length}c)`)
    if (CONFIRM) await sb(`/lessons?id=eq.${m.coursId}`, { method: 'PATCH', body: JSON.stringify({ title: m.title, content }) })
  }
  console.log(CONFIRM ? '\n✓ Appliqué.' : '\n[DRY-RUN] Ajoute --confirm pour appliquer.')
}
main().catch((e) => { console.error('✗', e); process.exit(1) })
