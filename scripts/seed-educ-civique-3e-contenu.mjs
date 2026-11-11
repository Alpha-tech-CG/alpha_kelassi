/**
 * Contenu des cours d'Éducation civique 3e (BEPC) — 06/11/2026.
 * Les 3 chapitres n'avaient qu'un squelette « Au programme… » ; on rédige de
 * vraies leçons depuis le programme (cadre congolais, notions stables).
 * Source : scripts/content/educ-civique-3e/*.md. Non destructif (sauvegarde).
 *
 * Usage : node scripts/seed-educ-civique-3e-contenu.mjs [--confirm]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC = join(__dirname, 'content', 'educ-civique-3e')
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
  { title: 'Institutions et pouvoir', coursId: 'ef4f179a-6fa3-445c-8d78-87ef1d5d01e9', file: '01-institutions.md' },
  { title: 'Citoyenneté et démocratie', coursId: 'b35e1e4b-60a3-4f84-9ec3-353d6f6cdd90', file: '02-citoyennete.md' },
  { title: 'Problèmes de société', coursId: '209652c0-8d99-4f8a-a492-cadf30f6f4c8', file: '03-problemes-societe.md' },
]
async function main() {
  const ids = MAP.map((m) => m.coursId).join(',')
  const lss = await sb(`/lessons?id=in.(${ids})&select=*`)
  mkdirSync(join(ROOT, 'backups'), { recursive: true })
  const bfile = join(ROOT, 'backups', `educ-civique-3e-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
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
