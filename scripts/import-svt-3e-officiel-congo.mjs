/**
 * Remplace le contenu SVT 3e par la version tirée du document rédigé
 * directement par des enseignants congolais (GANKOUE, BOUANDZOBO, MBOU,
 * OBITA, NSOTSOUOMI) suivant scrupuleusement la structure officielle
 * MEPPSA (modules MS3.1 à MS3.27). Ce document ne couvre que 17 modules
 * (MS3.1-5, MS3.8-19 — le climat MS3.6-7 est absent, et le document
 * s'arrête net au tout début de MS3.20).
 *
 * - MS3.1 à MS3.5 : remplacent le chapitre unique "La tectonique des
 *   plaques" (résumé condensé) par les 5 modules officiels séparés.
 * - MS3.8, MS3.9, MS3.10 : remplacent le placeholder "Génétique" par 3
 *   chapitres officiels distincts.
 * - MS3.13 : remplace "La respiration chez l'espèce humaine" (le contenu
 *   sénégalais plus large est remplacé par le cadrage officiel, plus étroit
 *   mais exact).
 * - MS3.17 : remplace "Le rôle du rein..." (contenu déjà très proche).
 * - MS3.11, 12, 14, 15, 16, 18, 19 : nouveaux chapitres.
 * - Les 5 chapitres liés à l'immunité/VIH/nerveux (non couverts par ce
 *   document) restent inchangés.
 *
 * Usage : node scripts/import-svt-3e-officiel-congo.mjs [--dry-run]
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
const SRC_DIR = 'C:/Users/miche/AppData/Local/Temp/claude/D--alpha-kelassi-new/e14b1709-c92a-401a-a7b0-afd9aea3502d/scratchpad/svt3e-v2/modules'

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

function readModule(num) {
  return readFileSync(join(SRC_DIR, `ms${String(num).padStart(2, '0')}.md`), 'utf8')
}

const TO_DELETE = ['La tectonique des plaques', 'Génétique']

// { ms, titre, mode: 'create'|'replace', existingTitle?, month }
const PLAN = [
  { ms: 1, titre: 'Structure interne du globe terrestre', mode: 'create', month: 'Octobre 2025' },
  { ms: 2, titre: 'Plaques lithosphériques', mode: 'create', month: 'Octobre 2025' },
  { ms: 3, titre: 'Fonctionnement de la dorsale océanique et ses conséquences', mode: 'create', month: 'Octobre 2025' },
  { ms: 4, titre: 'Fonctionnement de la fosse océanique et ses conséquences', mode: 'create', month: 'Octobre 2025' },
  { ms: 5, titre: 'Déformations des terrains liées aux forces de compression et de distension', mode: 'create', month: 'Octobre 2025' },
  { ms: 8, titre: 'Structure de la cellule', mode: 'create', month: 'Novembre 2025' },
  { ms: 9, titre: 'Programme génétique', mode: 'create', month: 'Novembre 2025' },
  { ms: 10, titre: "Transmission d'un gène au sein d'une famille", mode: 'create', month: 'Novembre 2025' },
  { ms: 11, titre: 'Digestion', mode: 'create', month: 'Janvier 2026' },
  { ms: 12, titre: "Mécanismes d'approvisionnement des cellules en nutriments", mode: 'create', month: 'Janvier 2026' },
  { ms: 13, titre: "Mécanisme d'approvisionnement des cellules en dioxygène", mode: 'replace', existingTitle: "La respiration chez l'espèce humaine", month: 'Janvier 2026' },
  { ms: 14, titre: "Maladies dues au manque d'hygiène alimentaire et leur prévention", mode: 'create', month: 'Février 2026' },
  { ms: 15, titre: 'Maladies du sang et de la circulation sanguine et leur prévention', mode: 'create', month: 'Février 2026' },
  { ms: 16, titre: "Maladies de l'appareil respiratoire et leur prévention", mode: 'create', month: 'Février 2026' },
  { ms: 17, titre: 'Excrétion urinaire', mode: 'replace', existingTitle: "Le rôle du rein dans l'excrétion urinaire et la régulation du milieu intérieur", month: 'Février 2026' },
  { ms: 18, titre: "Maladies de l'appareil urinaire et leur prévention", mode: 'create', month: 'Février 2026' },
  { ms: 19, titre: "Diversité des agresseurs de l'organisme humain", mode: 'create', month: 'Mars 2026' },
]

// Chapitres déjà présents, non couverts par ce document, conservés tels quels
// mais réordonnés à la suite selon le calendrier officiel (MS3.20-27).
const KEPT_AFTER = [
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

  console.log('\n--- Suppression des chapitres remplacés par des modules officiels séparés ---')
  let deleted = 0
  for (const titre of TO_DELETE) {
    const [chapter] = await sb(`/rest/v1/chapters?subject_id=eq.${subject.id}&title=eq.${encodeURIComponent(titre)}&select=id`)
    if (!chapter) { console.warn(`⚠ Introuvable : "${titre}"`); continue }
    if (DRY_RUN) { console.log(`[dry-run] supprimerait : "${titre}"`); continue }
    await sb(`/rest/v1/lessons?chapter_id=eq.${chapter.id}`, { method: 'DELETE' })
    await sb(`/rest/v1/curriculum_items?chapter_id=eq.${chapter.id}`, { method: 'DELETE' })
    await sb(`/rest/v1/chapters?id=eq.${chapter.id}`, { method: 'DELETE' })
    console.log(`✓ Supprimé : "${titre}"`)
    deleted++
  }

  console.log('\n--- Modules officiels (créés ou remplacés) ---')
  let orderIndex = 0
  let created = 0, replaced = 0
  for (const job of PLAN) {
    const monthRow = monthByLabel[job.month]
    const content = readModule(job.ms)

    if (job.mode === 'replace') {
      const [chapter] = await sb(`/rest/v1/chapters?subject_id=eq.${subject.id}&title=eq.${encodeURIComponent(job.existingTitle)}&select=id`)
      if (!chapter) { console.warn(`⚠ À remplacer introuvable : "${job.existingTitle}"`); orderIndex++; continue }
      if (DRY_RUN) {
        console.log(`[dry-run] "${job.existingTitle}" → "${job.titre}" (MS3.${job.ms}), order_index ${orderIndex}, mois ${job.month}, ${content.length} car.`)
      } else {
        await sb(`/rest/v1/chapters?id=eq.${chapter.id}`, { method: 'PATCH', body: JSON.stringify({ title: job.titre, order_index: orderIndex }) })
        const [lesson] = await sb(`/rest/v1/lessons?chapter_id=eq.${chapter.id}&type=eq.cours&select=id`)
        await sb(`/rest/v1/lessons?id=eq.${lesson.id}`, { method: 'PATCH', body: JSON.stringify({ content }) })
        const [item] = await sb(`/rest/v1/curriculum_items?chapter_id=eq.${chapter.id}&select=id`)
        await sb(`/rest/v1/curriculum_items?id=eq.${item.id}`, { method: 'PATCH', body: JSON.stringify({ school_month_id: monthRow.id, term_id: monthRow.term_id, order_index: orderIndex }) })
        console.log(`✓ "${job.existingTitle}" → "${job.titre}" (MS3.${job.ms}) → ${job.month}`)
      }
      replaced++
    } else {
      if (DRY_RUN) {
        console.log(`[dry-run] créerait "${job.titre}" (MS3.${job.ms}), order_index ${orderIndex}, mois ${job.month}, ${content.length} car.`)
      } else {
        const [chapter] = await sb('/rest/v1/chapters', { method: 'POST', body: JSON.stringify({ subject_id: subject.id, title: job.titre, order_index: orderIndex }) })
        await sb('/rest/v1/lessons', { method: 'POST', body: JSON.stringify({ chapter_id: chapter.id, type: 'cours', title: job.titre, content, order_index: 0, is_premium: false }) })
        await sb('/rest/v1/curriculum_items', { method: 'POST', body: JSON.stringify({ subject_id: subject.id, chapter_id: chapter.id, item_type: 'chapter', school_month_id: monthRow.id, term_id: monthRow.term_id, is_core: true, order_index: orderIndex }) })
        console.log(`✓ Créé : "${job.titre}" (MS3.${job.ms}) → ${job.month}`)
      }
      created++
    }
    orderIndex++
  }

  console.log('\n--- Chapitres conservés (non couverts par ce document), réordonnés ---')
  for (const { titre, month } of KEPT_AFTER) {
    const monthRow = monthByLabel[month]
    const [chapter] = await sb(`/rest/v1/chapters?subject_id=eq.${subject.id}&title=eq.${encodeURIComponent(titre)}&select=id`)
    if (!chapter) { console.warn(`⚠ Introuvable : "${titre}"`); orderIndex++; continue }
    if (DRY_RUN) {
      console.log(`[dry-run] "${titre}" : order_index → ${orderIndex}, mois → ${month}`)
    } else {
      await sb(`/rest/v1/chapters?id=eq.${chapter.id}`, { method: 'PATCH', body: JSON.stringify({ order_index: orderIndex }) })
      const [item] = await sb(`/rest/v1/curriculum_items?chapter_id=eq.${chapter.id}&select=id`)
      if (item) await sb(`/rest/v1/curriculum_items?id=eq.${item.id}`, { method: 'PATCH', body: JSON.stringify({ school_month_id: monthRow.id, term_id: monthRow.term_id, order_index: orderIndex }) })
      console.log(`✓ "${titre}" → ${month} (#${orderIndex})`)
    }
    orderIndex++
  }

  console.log(`\n${DRY_RUN ? '[dry-run]' : 'Terminé.'} ${deleted} supprimés, ${created} créés, ${replaced} remplacés.`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
