/**
 * Réaligne sur leur vrai mois les chapitres CEPE dont le sujet correspond à un
 * créneau Novembre-Juin de cepe_programme_complet.md (26 correspondances
 * validées — cf. artefact "Correspondance calendrier CEPE").
 *
 * Ne touche qu'à curriculum_items.school_month_id/term_id — aucun contenu de
 * leçon/exercice/test n'est créé ou modifié (Nov-Juin restent des squelettes
 * placeholder dans le fichier source).
 *
 * Usage : node scripts/realign-nov-juin-cepe.mjs [--dry-run]
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

// chapitre → mois cible (26 correspondances validées, cf. artefact de mapping)
const REALIGN = [
  { chapter: "La nature et la fonction d'un mot",                 month: 'Novembre 2025' },
  { chapter: 'Le futur simple — ÊTRE et AVOIR',                    month: 'Novembre 2025' },
  { chapter: 'Les fractions — Définition et lecture',               month: 'Novembre 2025' },
  { chapter: 'Les nombres décimaux — Lecture et écriture',          month: 'Novembre 2025' },
  { chapter: 'Les problèmes — Méthode de résolution',                month: 'Novembre 2025' },

  { chapter: 'Les compléments circonstanciels',                     month: 'Décembre 2025' },
  { chapter: 'Le passé composé — 1er groupe',                       month: 'Décembre 2025' },
  { chapter: 'La lettre — Structure et modèle',                     month: 'Décembre 2025' },
  { chapter: 'Comparaison et rangement des nombres décimaux',       month: 'Décembre 2025' },
  { chapter: 'Les opérations — Rappels essentiels',                 month: 'Décembre 2025' },
  { chapter: 'Les fonctions vitales de l\'homme',                   month: 'Décembre 2025' },
  { chapter: 'Les institutions et symboles de la République',       month: 'Décembre 2025' },

  { chapter: 'Le sujet du verbe',                                   month: 'Janvier 2026' },
  { chapter: "L'imparfait de l'indicatif — 1er groupe",             month: 'Janvier 2026' },
  { chapter: "L'indépendance et les institutions internationales",  month: 'Janvier 2026' },

  { chapter: 'Les pronoms personnels compléments',                  month: 'Février 2026' },
  { chapter: 'Le passé simple — ÊTRE et AVOIR',                     month: 'Février 2026' },
  { chapter: 'Les mesures de temps',                                 month: 'Février 2026' },
  { chapter: 'La colonisation et les grands explorateurs',          month: 'Février 2026' },

  { chapter: 'La proposition subordonnée circonstancielle',         month: 'Mars 2026' },
  { chapter: 'Périmètre et aire des figures usuelles',               month: 'Mars 2026' },
  { chapter: 'Un séisme (tremblement de terre)',                    month: 'Mars 2026' },
  { chapter: "Les dangers de l'alcool, du tabac et de l'automédication", month: 'Mars 2026' },

  { chapter: 'Le présent du conditionnel',                          month: 'Avril 2026' },

  { chapter: 'La méthode de la dictée',                             month: 'Mai 2026' },
  { chapter: 'Doubles, moitiés, triples et quarts',                 month: 'Mai 2026' },
]

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===', `(${REALIGN.length} chapitres)`)

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
