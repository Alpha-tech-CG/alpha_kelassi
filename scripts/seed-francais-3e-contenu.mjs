/**
 * Contenu des cours de Français 3e (BEPC) — 06/11/2026.
 *
 * Les chapitres de Français n'avaient qu'un squelette (« Au programme de ce
 * chapitre » + liste de points). On rédige de vraies leçons à partir du
 * programme officiel : grammaire, conjugaison, orthographe/vocabulaire,
 * expression écrite. Le chapitre « Annales BEPC » (vide) reçoit une leçon de
 * méthode + un entraînement. Le chapitre « Lecture et compréhension » (déjà
 * garni de fiches) n'est PAS touché.
 *
 * Source : scripts/content/francais-3e/*.md
 * Non destructif : sauvegarde complète avant écriture.
 *
 * Usage :
 *   node scripts/seed-francais-3e-contenu.mjs            (dry-run + backup)
 *   node scripts/seed-francais-3e-contenu.mjs --confirm
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC = join(__dirname, 'content', 'francais-3e')
const CONFIRM = process.argv.includes('--confirm')
const env = Object.fromEntries(
  readFileSync(join(ROOT, 'apps', 'web', '.env.local'), 'utf-8')
    .split(/\r?\n/).filter((l) => l.includes('=') && !l.trimStart().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const URL = env.NEXT_PUBLIC_SUPABASE_URL, KEY = env.SUPABASE_SERVICE_ROLE_KEY
async function sb(path, init = {}) {
  const r = await fetch(`${URL}/rest/v1${path}`, { ...init, headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}`, ...(init.headers ?? {}) } })
  const t = await r.text(); const d = t ? JSON.parse(t) : null
  if (!r.ok) throw new Error(`${init.method || 'GET'} ${path} -> ${r.status}: ${JSON.stringify(d)}`)
  return d
}
const read = (f) => readFileSync(join(SRC, f), 'utf-8').trim()

// chapitre → leçon « cours » (id si existe, sinon création) + fichier source.
const MAP = [
  { title: 'Grammaire : phrase complexe', chapterId: '794e8438-219b-4296-87f7-4b694fd7b59e', coursId: 'fc823839-e475-4d44-a198-a1ec827b8064', file: '01-grammaire.md' },
  { title: 'Conjugaison : temps et modes', chapterId: 'e47b8c17-ccdd-4142-9712-8294ac715d1b', coursId: '3659e72c-7073-4955-90ec-43cf46e4e748', file: '02-conjugaison.md' },
  { title: 'Orthographe et vocabulaire', chapterId: '88a2171e-ec71-41eb-bcfe-df41321f51d8', coursId: 'ba9dd0af-ef10-4a53-b6fa-95e52672770f', file: '03-orthographe.md' },
  { title: 'Expression écrite', chapterId: '420663ff-3104-4c1d-930a-242f2cc2ab60', coursId: '4d7da735-c2f8-410f-9591-0fe9a9c6c876', file: '04-expression.md' },
  { title: 'Annales BEPC — Dictées et questions', chapterId: '357820cf-7167-4717-b990-2ef5b5d079c2', coursId: null, file: '06-annales.md' },
]

async function main() {
  const ids = MAP.map((m) => m.chapterId).join(',')
  const lss = await sb(`/lessons?chapter_id=in.(${ids})&select=*`)
  const backup = { created_at: new Date().toISOString(), note: 'État AVANT rédaction contenu Français 3e', lessons: lss }
  mkdirSync(join(ROOT, 'backups'), { recursive: true })
  const bfile = join(ROOT, 'backups', `francais-3e-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  writeFileSync(bfile, JSON.stringify(backup, null, 2), 'utf-8')
  console.log(`Sauvegarde : ${bfile}\n`)

  for (const m of MAP) {
    const content = read(m.file)
    console.log(`• ${m.title}  (${m.file}, ${content.length}c) ${m.coursId ? 'MAJ' : 'CRÉATION'}`)
    if (!CONFIRM) continue
    if (m.coursId) {
      await sb(`/lessons?id=eq.${m.coursId}`, { method: 'PATCH', body: JSON.stringify({ title: m.title, content }) })
    } else {
      await sb('/lessons', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ chapter_id: m.chapterId, type: 'cours', title: m.title, content, order_index: 0, is_premium: false }) })
    }
  }
  console.log(CONFIRM ? '\n✓ Appliqué.' : '\n[DRY-RUN] Ajoute --confirm pour appliquer.')
}
main().catch((e) => { console.error('✗', e); process.exit(1) })
