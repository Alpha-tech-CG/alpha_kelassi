/**
 * Le fascicule SVT importé (import-svt-3e-fascicule.mjs) vient du Sénégal
 * (Lycée de Samécouta) — après comparaison avec le VRAI programme officiel
 * congolais (SVT-4e-3e-Programmes-et-Guides.md, MEPPSA 2023), plusieurs
 * chapitres importés ne correspondent à AUCUN module du programme 3e du
 * Congo (soit absents, soit en fait de niveau 4e). Ce script les supprime
 * et réindexe/replace les chapitres restants sur le calendrier officiel
 * réel (canevas mensuel MS3.1-MS3.27).
 *
 * Usage : node scripts/purge-svt-hors-programme-congo.mjs [--dry-run]
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

const TO_DELETE = [
  'Étude de la vision',
  'Les phénomènes énergétiques accompagnant la respiration',
  "La fermentation : un autre moyen de se procurer de l'énergie",
  'Un autre exemple de spécificité immunologique : les groupes sanguins',
  'La formation des roches métamorphiques',
  'Le cycle des roches',
  'La chronologie en géologie',
  'Reproduction humaine',
  'Écosystèmes et environnement',
]

// Ordre final = calendrier officiel réel (canevas MS3.1-MS3.27, MEPPSA 2023)
const FINAL_ORDER = [
  { titre: 'La tectonique des plaques', month: 'Octobre 2025' },
  { titre: 'Génétique', month: 'Novembre 2025' },
  { titre: "La respiration chez l'espèce humaine", month: 'Janvier 2026' },
  { titre: "Le rôle du rein dans l'excrétion urinaire et la régulation du milieu intérieur", month: 'Février 2026' },
  { titre: "L'immunité et la réponse immunitaire", month: 'Avril 2026' },
  { titre: 'Le système immunitaire', month: 'Avril 2026' },
  { titre: "Dysfonctionnement du système immunitaire : cas de l'infection au VIH/SIDA", month: 'Avril 2026' },
  { titre: "Aide à l'immunité", month: 'Avril 2026' },
  { titre: 'Le fonctionnement du système nerveux', month: 'Mai 2026' },
]

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')
  const [subject] = await sb(`/rest/v1/subjects?level=eq.bepc&name=eq.SVT&select=id`)
  const months = await sb('/rest/v1/school_months?select=id,label,term_id')
  const monthByLabel = Object.fromEntries(months.map((m) => [m.label, m]))

  console.log('\n--- Suppression des chapitres hors-programme ---')
  let deleted = 0
  for (const titre of TO_DELETE) {
    const [chapter] = await sb(`/rest/v1/chapters?subject_id=eq.${subject.id}&title=eq.${encodeURIComponent(titre)}&select=id`)
    if (!chapter) { console.warn(`⚠ Introuvable (déjà absent ?) : "${titre}"`); continue }
    if (DRY_RUN) { console.log(`[dry-run] supprimerait : "${titre}"`); continue }
    const exercises = await sb(`/rest/v1/exercises?chapter_id=eq.${chapter.id}&select=id`)
    for (const ex of exercises) {
      await sb(`/rest/v1/exercise_solutions?exercise_id=eq.${ex.id}`, { method: 'DELETE' })
    }
    await sb(`/rest/v1/exercises?chapter_id=eq.${chapter.id}`, { method: 'DELETE' })
    await sb(`/rest/v1/lessons?chapter_id=eq.${chapter.id}`, { method: 'DELETE' })
    await sb(`/rest/v1/curriculum_items?chapter_id=eq.${chapter.id}`, { method: 'DELETE' })
    await sb(`/rest/v1/chapters?id=eq.${chapter.id}`, { method: 'DELETE' })
    console.log(`✓ Supprimé : "${titre}"`)
    deleted++
  }

  console.log('\n--- Réindexation / replacement sur le calendrier officiel ---')
  let reordered = 0
  let orderIndex = 0
  for (const { titre, month } of FINAL_ORDER) {
    const monthRow = monthByLabel[month]
    const [chapter] = await sb(`/rest/v1/chapters?subject_id=eq.${subject.id}&title=eq.${encodeURIComponent(titre)}&select=id,order_index`)
    if (!chapter) { console.warn(`⚠ Chapitre à réordonner introuvable : "${titre}"`); orderIndex++; continue }
    if (DRY_RUN) {
      console.log(`[dry-run] "${titre}" : order_index → ${orderIndex}, mois → ${month}`)
    } else {
      await sb(`/rest/v1/chapters?id=eq.${chapter.id}`, { method: 'PATCH', body: JSON.stringify({ order_index: orderIndex }) })
      const [item] = await sb(`/rest/v1/curriculum_items?chapter_id=eq.${chapter.id}&select=id`)
      if (item) await sb(`/rest/v1/curriculum_items?id=eq.${item.id}`, { method: 'PATCH', body: JSON.stringify({ school_month_id: monthRow.id, term_id: monthRow.term_id, order_index: orderIndex }) })
      console.log(`✓ "${titre}" → ${month} (#${orderIndex})`)
    }
    reordered++
    orderIndex++
  }

  console.log(`\n${DRY_RUN ? '[dry-run]' : 'Terminé.'} ${deleted} chapitres supprimés, ${reordered} réordonnés.`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
