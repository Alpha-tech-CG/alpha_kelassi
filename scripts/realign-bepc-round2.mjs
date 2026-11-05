/**
 * 2e passe de réalignement BEPC : correspondances plus larges que le premier
 * passage (scripts/realign-bepc-cepe.mjs), qui était trop strict (titre quasi
 * identique uniquement). Ici on capture aussi les cas où un sujet du fichier
 * correspond à PLUSIEURS chapitres existants plus fins (ex. "Circuits
 * électriques et loi d'Ohm" couvre 4 chapitres distincts sur le courant/la
 * tension), tant que c'est le même concept précis — pas juste "même unité".
 *
 * Usage : node scripts/realign-bepc-round2.mjs [--dry-run]
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split('\n').filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

async function sb(path, init) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, Prefer: 'return=representation', ...(init?.headers ?? {}) },
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : null
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> HTTP ${res.status}: ${JSON.stringify(json)}`)
  return json
}

const REALIGN = [
  // Mathématiques — "Géométrie : triangles et droites remarquables" (Octobre) couvre aussi Pythagore
  { chapter: 'Théorème de Pythagore', month: 'Octobre 2025' },

  // Histoire-Géographie — le fichier dit "causes ET grandes phases" pour la 2GM
  { chapter: 'LES GRANDES ETAPES DE LA DEUXIEME GURRE MONDIALE', month: 'Novembre 2025' },

  // Physique-Chimie — "Circuits électriques et loi d'Ohm" (Octobre) = tension/intensité/résistance/courant
  { chapter: 'Courant electrique dans les metaux', month: 'Octobre 2025' },
  { chapter: 'Tension continue – tension alternative', month: 'Octobre 2025' },
  { chapter: 'Determination de la tension electrique en courant continu', month: 'Octobre 2025' },
  { chapter: 'Determination de l’intensite electrique en courant continu', month: 'Octobre 2025' },

  // Physique-Chimie — "Lentilles..." + "Œil, vision..." (Décembre) = bloc optique
  { chapter: 'Appareils d’optiques', month: 'Décembre 2025' },
  { chapter: 'Image donnee par un miroir plan', month: 'Décembre 2025' },
  { chapter: 'Appareil photographique', month: 'Décembre 2025' },

  // Physique-Chimie — "Solutions acides, basiques et pH" (Février) = bloc acide-base
  { chapter: 'Determination de l’acidite et de la basicite des solutions aqueuses', month: 'Février 2026' },
  { chapter: 'Importance des solutions acides et basiques', month: 'Février 2026' },
  { chapter: 'Determination du titre des solutions acides et basiques', month: 'Février 2026' },
]

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN (round 2) ===' : '=== Écriture en base (round 2) ===', `(${REALIGN.length} chapitres)`)

  const monthLabels = [...new Set(REALIGN.map((r) => r.month))]
  const months = await sb(`/rest/v1/school_months?label=in.(${monthLabels.map((l) => `"${l}"`).join(',')})&select=id,label,term_id`)
  const monthByLabel = Object.fromEntries(months.map((m) => [m.label, m]))

  const chapterTitles = REALIGN.map((r) => r.chapter)
  const chapters = await sb(`/rest/v1/chapters?title=in.(${chapterTitles.map((t) => `"${t.replace(/"/g, '')}"`).join(',')})&select=id,title`)
  const chapterByTitle = Object.fromEntries(chapters.map((c) => [c.title, c]))

  let done = 0, skipped = 0
  for (const r of REALIGN) {
    const chapter = chapterByTitle[r.chapter]
    const month = monthByLabel[r.month]
    if (!chapter) { console.warn(`⚠ Chapitre introuvable : "${r.chapter}"`); continue }
    if (!month) { console.warn(`⚠ Mois introuvable : "${r.month}"`); continue }

    const [item] = await sb(`/rest/v1/curriculum_items?chapter_id=eq.${chapter.id}&item_type=eq.chapter&select=id,school_month_id`)
    if (!item) { console.warn(`⚠ Pas de curriculum_item pour "${r.chapter}"`); continue }
    if (item.school_month_id === month.id) { console.log(`… déjà sur ${r.month} : ${r.chapter}`); skipped++; continue }

    if (DRY_RUN) { console.log(`[dry-run] "${r.chapter}" → ${r.month}`); continue }
    await sb(`/rest/v1/curriculum_items?id=eq.${item.id}`, { method: 'PATCH', body: JSON.stringify({ school_month_id: month.id, term_id: month.term_id }) })
    console.log(`✓ "${r.chapter}" → ${r.month}`)
    done++
  }
  console.log(`\n${DRY_RUN ? '[dry-run]' : 'Terminé.'} ${done} réalignés, ${skipped} déjà en place.`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
