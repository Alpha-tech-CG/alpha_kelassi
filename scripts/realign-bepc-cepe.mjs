/**
 * Réaligne sur leur vrai mois les chapitres BEPC (Mathématiques, Histoire-
 * Géographie, Physique-Chimie) dont le sujet correspond à un créneau de
 * bepc_3e_programme_complet.md — même principe que le réalignement CEPE
 * (scripts/realign-nov-juin-cepe.mjs).
 *
 * Ne touche qu'à curriculum_items.school_month_id/term_id — le contenu des
 * chapitres (déjà rédigé par les profs) n'est ni créé ni modifié. Le fichier
 * BEPC n'a de contenu réel nulle part (Cours/Exercices/Tests sont tous des
 * squelettes génériques, y compris Octobre) : il ne sert donc qu'à recaler le
 * calendrier, jamais à créer du contenu.
 *
 * Français, SVT et Éducation Civique n'ont aucun chapitre en base et ne sont
 * délibérément pas traités ici (rien à réaligner, rien de réel à créer).
 *
 * Usage : node scripts/realign-bepc-cepe.mjs [--dry-run]
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

// chapitre BEPC → mois cible (correspondances trouvées avec bepc_3e_programme_complet.md)
const REALIGN = [
  // Mathématiques
  { chapter: 'Théorème de Thalès',                                    month: 'Novembre 2025' },
  { chapter: 'Statistiques',                                          month: 'Novembre 2025' },
  { chapter: 'Transformations du plan',                               month: 'Décembre 2025' },
  { chapter: 'Théorème des milieux',                                  month: 'Janvier 2026' },
  { chapter: 'Problèmes du 1er degré',                                month: 'Janvier 2026' },
  { chapter: "Systèmes d'équations du 1er degré à deux inconnues",    month: 'Mars 2026' },
  { chapter: 'Fonction affine',                                       month: 'Mars 2026' },
  { chapter: 'Pyramide et cône de révolution',                        month: 'Avril 2026' },

  // Histoire-Géographie
  { chapter: 'LA DOMINATION COLONIALE DE L’EUROPE DANS LE MONDE AU DEBUT DU XXE SIECLE', month: 'Octobre 2025' },
  { chapter: 'LES CAUSES DE LA DEUXIEME GUERRE MONDIALE',             month: 'Novembre 2025' },
  { chapter: 'LA DECOLONISATION DE L’AFRIQUE NOIRE FRANÇAISE',        month: 'Décembre 2025' },
  { chapter: 'LES REALISATIONS ET LES DIFFICULTES DE L’UNION AFRICAINE', month: 'Décembre 2025' },
  { chapter: 'LES PRINCIPALES ETAPES DE L’INDEPENDANCE DU  CONGO',    month: 'Janvier 2026' },
  { chapter: 'Les activites agro-pastorales',                        month: 'Janvier 2026' },
  { chapter: 'Les problemes de developpement du Congo',               month: 'Février 2026' },
  { chapter: 'Les voies de communication et les telecommunications',  month: 'Février 2026' },

  // Physique-Chimie
  { chapter: 'Puissance et energie electrique',                       month: 'Octobre 2025' },
  { chapter: 'Determination de la resistance electrique',             month: 'Octobre 2025' },
  { chapter: 'Les effets d’une force',                                month: 'Novembre 2025' },
  { chapter: 'Construction geometrique des images',                   month: 'Décembre 2025' },
  { chapter: 'La molecule d’eau',                                     month: 'Janvier 2026' },
  { chapter: 'Notions d’acide, de base et de ph',                     month: 'Février 2026' },
  { chapter: 'Travail et puissance mecaniques',                       month: 'Mars 2026' },
  { chapter: 'Differentes formes d’energie',                          month: 'Mars 2026' },
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
