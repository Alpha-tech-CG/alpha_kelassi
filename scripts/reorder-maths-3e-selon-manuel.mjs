/**
 * Réordonne les chapitres Maths BEPC pour respecter l'ordre réel du manuel
 * (746308254-Cours-de-Maths-3eme.docx, 20 chapitres) au lieu de l'ordre
 * accidentel issu des imports successifs (les 7 nouveaux chapitres avaient
 * été ajoutés à la fin, et le placement par mois ne suivait pas la
 * progression logique du livre).
 *
 * Corrige : chapters.order_index (ordre d'affichage dans la liste) ET
 * curriculum_items.school_month_id + order_index (ordre de déblocage dans
 * la progression mensuelle).
 *
 * "Théorème des milieux" (hors manuel) est placé juste après Thalès (lien
 * pédagogique direct). "Révisions générales et annales BEPC" (hors manuel)
 * reste en tout dernier.
 *
 * Usage : node scripts/reorder-maths-3e-selon-manuel.mjs [--dry-run]
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

// Ordre final (= ordre du manuel), groupé par mois de la même façon dont un
// professeur découperait naturellement une année scolaire de 9 mois.
const PLAN = [
  { month: 'Octobre 2025', titres: [
    'Activités numériques : nombres relatifs, fractions, puissances',
    'Vecteurs : addition et multiplication par un réel',
  ]},
  { month: 'Novembre 2025', titres: [
    "Coordonnées d'un vecteur",
    'Problèmes du 1er degré',
    'Calcul littéral : développer, factoriser, équations',
  ]},
  { month: 'Décembre 2025', titres: [
    'Fonctions rationnelles',
    'Rapport de projection',
  ]},
  { month: 'Janvier 2026', titres: [
    'Théorème de Pythagore',
    'Théorème de Thalès',
    'Théorème des milieux',
  ]},
  { month: 'Février 2026', titres: [
    'Repérage dans le plan',
    'Droites et équations de droites',
  ]},
  { month: 'Mars 2026', titres: [
    "Systèmes d'équations du 1er degré à deux inconnues",
    "Systèmes d'inéquations du 1er degré à deux inconnues",
    'Angles inscrits',
  ]},
  { month: 'Avril 2026', titres: [
    'Trigonométrie dans le triangle rectangle',
    'Fonction affine',
  ]},
  { month: 'Mai 2026', titres: [
    "Positions relatives d'une droite et d'un cercle",
    'Statistiques',
    'Transformations du plan',
  ]},
  { month: 'Juin 2026', titres: [
    'Pyramide et cône de révolution',
    'Révisions générales et annales BEPC',
  ]},
]

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')

  const [subject] = await sb(`/rest/v1/subjects?level=eq.bepc&name=eq.${encodeURIComponent('Mathématiques')}&select=id`)
  const chapters = await sb(`/rest/v1/chapters?subject_id=eq.${subject.id}&select=id,title,order_index`)
  const chapterByTitle = Object.fromEntries(chapters.map((c) => [c.title, c]))
  const months = await sb('/rest/v1/school_months?select=id,label,term_id')
  const monthByLabel = Object.fromEntries(months.map((m) => [m.label, m]))
  const items = await sb(`/rest/v1/curriculum_items?subject_id=eq.${subject.id}&select=id,chapter_id`)
  const itemByChapterId = Object.fromEntries(items.map((it) => [it.chapter_id, it]))

  const flat = PLAN.flatMap((m) => m.titres.map((titre) => ({ titre, month: m.month })))
  console.log(`Chapitres dans le plan : ${flat.length} / chapitres en base : ${chapters.length}`)

  const seen = new Set()
  let orderIndex = 0
  for (const { titre, month } of flat) {
    seen.add(titre)
    const chapter = chapterByTitle[titre]
    if (!chapter) { console.warn(`⚠ Chapitre introuvable : "${titre}"`); continue }
    const monthRow = monthByLabel[month]
    if (!monthRow) { console.warn(`⚠ Mois introuvable : "${month}"`); continue }
    const item = itemByChapterId[chapter.id]

    const changes = []
    if (chapter.order_index !== orderIndex) changes.push(`order_index ${chapter.order_index} → ${orderIndex}`)
    if (item) changes.push(`mois/place → ${month} (#${orderIndex})`)

    if (changes.length === 0) {
      console.log(`… déjà correct : ${titre}`)
    } else if (DRY_RUN) {
      console.log(`[dry-run] ${titre} : ${changes.join(', ')}`)
    } else {
      await sb(`/rest/v1/chapters?id=eq.${chapter.id}`, { method: 'PATCH', body: JSON.stringify({ order_index: orderIndex }) })
      if (item) {
        await sb(`/rest/v1/curriculum_items?id=eq.${item.id}`, { method: 'PATCH', body: JSON.stringify({ school_month_id: monthRow.id, term_id: monthRow.term_id, order_index: orderIndex }) })
      }
      console.log(`✓ ${titre} : ${changes.join(', ')}`)
    }
    orderIndex++
  }

  const missing = chapters.filter((c) => !seen.has(c.title))
  if (missing.length) {
    console.log('\n⚠ Chapitres en base absents du plan (non touchés) :')
    for (const c of missing) console.log(`  - ${c.title}`)
  }

  console.log(`\n${DRY_RUN ? '[dry-run]' : 'Terminé.'}`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
