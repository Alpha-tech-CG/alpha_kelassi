/**
 * Range les SUJETS RÉELS des Terminales A/C/D dans les rayons de la Prépa (migration 074).
 *
 * Les annales publiées par seed-annales-bac-tle.mjs sont des exercices « sujet complet ».
 * Ce script leur donne les champs d'épreuve, déduits du titre et de l'énoncé :
 *   - exam_kind : « Bac blanc … » → bac_blanc ; « Composition … » → bac_test ;
 *                 « Bac X 20xx … » → ancien_bac ; le reste (TD, devoirs, fascicules) n'est pas classé ;
 *   - origin = 'reel', exam_year = première année du titre ;
 *   - duration_min : durée officielle de l'épreuve (pour un sujet de physique-chimie scindé,
 *     au prorata des points : chimie 8/20, physique 12/20 de 4 h) ;
 *   - bareme : les « (N points) » des titres de partie de l'énoncé. Quand le premier
 *     total couvre exactement les suivants (« PHYSIQUE (12 points) » puis A, B, C), on garde le détail.
 *
 * Idempotent ; n'écrit que les champs d'épreuve. Les sujets générés (origin 'genere')
 * sont publiés par seed-sujets-generes.mjs, pas ici.
 *
 * Usage : node scripts/classer-sujets-prepa.mjs [--dry-run]
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
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

const LEVELS = ['bac_a', 'bac_c', 'bac_d']
const POINTS = /\((\d+(?:[.,]\d+)?)\s*(?:points?|pts)\)/i

/** Durée officielle (min) selon la matière ; physique-chimie scindée au prorata des points. */
function duration(subject, level, total) {
  const n = subject.toLowerCase()
  if (n.startsWith('chimie') || n === 'physique') return Math.round((240 * total) / 20 / 30) * 30
  if (n.includes('histoire') || n.includes('géographie')) return 180
  if (n.startsWith('math')) return level === 'bac_a' ? 180 : 240
  return 240
}

/** Lignes « titre (N points) » de l'énoncé → barème. */
export function extractBareme(statement) {
  const items = []
  for (const line of statement.split('\n')) {
    const m = line.match(POINTS)
    if (!m) continue
    const label = line.replace(POINTS, '').split(/\s[—–]\s/)[0].replace(/\*\*/g, '').replace(/^[#>\s*_-]+|[*_:.\s—–-]+$/g, '').trim().slice(0, 70)
    items.push({ label: label || `Partie ${items.length + 1}`, points: Number(m[1].replace(',', '.')) })
  }
  // Total d'une matière suivi de son détail : on garde le détail.
  if (items.length > 1) {
    const rest = items.slice(1).reduce((a, b) => a + b.points, 0)
    if (Math.abs(rest - items[0].points) < 1e-9) items.shift()
  }
  // Sujet en parties A/B/C : on note par partie, pas par sous-question.
  const parts = items.filter((it) => /^Partie\s/i.test(it.label))
  return (parts.length > 1 ? parts : items).filter((it) => it.points > 0)
}

function kindOf(title) {
  if (/^Bac blanc\b/i.test(title)) return 'bac_blanc'
  if (/^Composition\b/i.test(title)) return 'bac_test'
  if (/^Bac [A-Z]\b/.test(title)) return 'ancien_bac'
  return null
}

const subjects = await sb(`/subjects?select=id,name,level&level=in.(${LEVELS.join(',')})`)
const byId = new Map(subjects.map((s) => [s.id, s]))
const chapters = await sb(`/chapters?select=id,title,subject_id&subject_id=in.(${subjects.map((s) => s.id).join(',')})&or=(title.ilike.Annales*,title.ilike.*sujets type bac*)`)

let done = 0, skipped = 0
for (const c of chapters) {
  const s = byId.get(c.subject_id)
  const rows = await sb(`/exercises?select=id,title,statement,exam_kind,origin,duration_min,bareme,exam_year&chapter_id=eq.${c.id}&deleted_at=is.null`)
  console.log(`\n■ ${s.name} — ${s.level} — ${c.title}`)
  for (const e of rows) {
    if (e.origin === 'genere') continue
    const kind = kindOf(e.title)
    if (!kind) { skipped++; console.log(`   · non classé : ${e.title}`); continue }
    const bareme = extractBareme(e.statement)
    // Histoire-géo : deux groupes au choix (dissertation + commentaire) — on note un seul groupe.
    const isHG = /histoire|géographie/i.test(s.name)
    // Ancien sujet de physique-chimie scindé : une seule ligne « Baccalauréat … partie CHIMIE ».
    if (bareme.length === 1 && /^Baccalauréat/i.test(bareme[0].label)) bareme[0].label = s.name.toLowerCase().startsWith('chimie') ? 'Chimie' : 'Physique'
    const finalBareme = isHG ? [{ label: 'Dissertation', points: 12 }, { label: 'Commentaire de document', points: 8 }] : bareme
    const total = finalBareme.reduce((a, b) => a + b.points, 0) || 20
    const patch = {
      exam_kind: kind,
      origin: 'reel',
      exam_year: Number(e.title.match(/\b(19|20)\d{2}\b/)?.[0]) || null,
      duration_min: duration(s.name, s.level, total),
      bareme: finalBareme.length ? finalBareme : null,
    }
    const same = e.exam_kind === patch.exam_kind && e.origin === 'reel' && e.exam_year === patch.exam_year
      && e.duration_min === patch.duration_min && JSON.stringify(e.bareme) === JSON.stringify(patch.bareme)
    console.log(`   ${same ? '=' : DRY_RUN ? '~' : '✓'} ${kind.padEnd(10)} ${patch.duration_min} min  ${total} pts  ${e.title.slice(0, 70)}`)
    if (finalBareme.length) console.log(`        ${finalBareme.map((b) => `${b.label} (${b.points})`).join(' · ')}`)
    if (!same && !DRY_RUN) await sb(`/exercises?id=eq.${e.id}`, { method: 'PATCH', body: JSON.stringify(patch) })
    done++
  }
}
console.log(`\n=== ${done} sujet(s) classé(s), ${skipped} non classé(s)${DRY_RUN ? ' (dry-run)' : ''} ===`)
