/**
 * Remappe le placement mensuel des chapitres Physique-Chimie et Histoire-
 * Géographie BEPC en s'appuyant sur bepc_3e_programme_officiel_complet.json
 * (structure officielle INRAP/MEPPSA — chapitres_officiels_3e avec contenus
 * précis et plages de mois), qui est plus fiable que les 2 premiers passages
 * de réalignement basés sur un fichier générique.
 *
 * Ne touche QUE Physique-Chimie et Histoire-Géographie (demande explicite) —
 * Mathématiques, Français, Anglais, SVT, Éducation Civique et EPS ne sont pas
 * concernés par ce script. Aucun contenu de leçon n'est créé ni modifié,
 * uniquement curriculum_items.school_month_id/term_id des chapitres déjà
 * en base.
 *
 * Usage : node scripts/remap-bepc-officiel.mjs [--dry-run]
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

// chapitre BEPC (titre exact en base) → mois cible, dérivé des "contenus" +
// plages de mois officielles (PC3E-1..5, HG3E-1..5).
const REALIGN = [
  // ── Physique-Chimie ──────────────────────────────────────────────────────
  // PC3E-1 Électricité (Octobre)
  { chapter: 'Courant electrique dans les metaux', month: 'Octobre 2025' },
  { chapter: 'Tension continue – tension alternative', month: 'Octobre 2025' },
  { chapter: 'Determination de la tension electrique en courant continu', month: 'Octobre 2025' },
  { chapter: 'Determination de l’intensite electrique en courant continu', month: 'Octobre 2025' },
  { chapter: 'Determination de la resistance electrique', month: 'Octobre 2025' },
  { chapter: 'Puissance et energie electrique', month: 'Octobre 2025' },
  { chapter: 'Transformateurs et rechersseurs', month: 'Octobre 2025' },
  { chapter: 'Utilite sociale de l’electricite', month: 'Octobre 2025' },
  // PC3E-2 Mécanique (Novembre : forces/poids/équilibre — Mars : travail/énergie)
  { chapter: 'Les effets d’une force', month: 'Novembre 2025' },
  { chapter: 'Le mouvement', month: 'Novembre 2025' },
  { chapter: 'Transmission d’une force et d’une puissance', month: 'Novembre 2025' },
  { chapter: 'Travail et puissance mecaniques', month: 'Mars 2026' },
  { chapter: 'Differentes formes d’energie', month: 'Mars 2026' },
  { chapter: 'Les sources d’energie', month: 'Mars 2026' },
  { chapter: 'Le moteur a piston', month: 'Mars 2026' },
  { chapter: 'Relation entre differentes formes d’energie', month: 'Mars 2026' },
  // PC3E-3 Optique (Décembre)
  { chapter: 'Construction geometrique des images', month: 'Décembre 2025' },
  { chapter: 'Appareils d’optiques', month: 'Décembre 2025' },
  { chapter: 'Image donnee par un miroir plan', month: 'Décembre 2025' },
  { chapter: 'Appareil photographique', month: 'Décembre 2025' },
  // PC3E-4 Chimie (Janvier : atomes/molécules/réactions — Février : combustion/acide-base)
  { chapter: 'La molecule d’eau', month: 'Janvier 2026' },
  { chapter: 'Structure des metaux', month: 'Janvier 2026' },
  { chapter: 'Caracteristiques des metaux', month: 'Janvier 2026' },
  { chapter: 'Obtention des metaux usuels et de leurs alliages', month: 'Janvier 2026' },
  { chapter: 'Obtention des derives du petrole', month: 'Janvier 2026' },
  { chapter: 'Produits de sythese des derives du petrole : les matieres plastiques', month: 'Janvier 2026' },
  { chapter: 'Notions d’acide, de base et de ph', month: 'Février 2026' },
  { chapter: 'Determination de l’acidite et de la basicite des solutions aqueuses', month: 'Février 2026' },
  { chapter: 'Importance des solutions acides et basiques', month: 'Février 2026' },
  { chapter: 'Determination du titre des solutions acides et basiques', month: 'Février 2026' },
  { chapter: 'Les hydrocarbures', month: 'Février 2026' },
  { chapter: 'Pollution par les derives du petrole et leurs produits de synthese', month: 'Février 2026' },
  { chapter: 'Proprietes des alcanes, des alcenes et des alcynes', month: 'Février 2026' },

  // ── Histoire-Géographie ──────────────────────────────────────────────────
  // HG3E-1 Colonisation/décolonisation (Oct : partage colonial — Nov : 1GM/1929/2GM — Déc : décolonisation/ONU/UA)
  { chapter: 'LA DOMINATION COLONIALE DE L’EUROPE DANS LE MONDE AU DEBUT DU XXE SIECLE', month: 'Octobre 2025' },
  { chapter: 'LA DOMINATION FRANÇAISE EN AFRIQUE EQUATORIALE FRANÇAISE (AEF)', month: 'Octobre 2025' },
  { chapter: 'LA DOMINATION FRANÇAISE AU MOYEN-CONGO', month: 'Octobre 2025' },
  { chapter: 'LES RESISTANCES  ET LES REVOLTES DES POPULATIONS CONTRE LA DOMINATION FRANÇAISE AU MOYEN-CONGO', month: 'Octobre 2025' },
  { chapter: 'LES CAUSES DE LA PREMIERE GUERRE MONDIALE', month: 'Novembre 2025' },
  { chapter: 'LES GRANDES ETAPES DE LA PREMIERE GUERRE MONDIALE', month: 'Novembre 2025' },
  { chapter: 'LES CONSEQUENCES DE LA PREMIERE GUERRE MONDIALE', month: 'Novembre 2025' },
  { chapter: 'LES CAUSES DE LA CRISE ECONOMIQUE DE 1929', month: 'Novembre 2025' },
  { chapter: 'LES MANIFESTATIONS ET LES CONSEQUENCES DE LA CRISE ECONOMIQUE DE 1929', month: 'Novembre 2025' },
  { chapter: 'LES DIFFERENTES SOLUTIONS A LA CRISE ECONOMIQUE DE 1929', month: 'Novembre 2025' },
  { chapter: 'LES CAUSES DE LA DEUXIEME GUERRE MONDIALE', month: 'Novembre 2025' },
  { chapter: 'LES GRANDES ETAPES DE LA DEUXIEME GURRE MONDIALE', month: 'Novembre 2025' },
  { chapter: 'LES CONSEQUENCES DE LA DEUXIEME GUERRE MONDIALE', month: 'Novembre 2025' },
  { chapter: 'LA DECOLONISATION DE L’AFRIQUE NOIRE FRANÇAISE', month: 'Décembre 2025' },
  { chapter: 'LES ORIGINES, LES BUTS ET LES PRINCIPES DE L’ORGANISATION DES NATIONS UNIES', month: 'Décembre 2025' },
  { chapter: 'LES REUSSITES ET LES PROBLEMES DE L’ONU', month: 'Décembre 2025' },
  { chapter: 'LES ORIGINES, BUTS ET PRINCIPES DE L’UNION AFRICAINE', month: 'Décembre 2025' },
  { chapter: 'LES REALISATIONS ET LES DIFFICULTES DE L’UNION AFRICAINE', month: 'Décembre 2025' },
  // HG3E-2 Congo depuis 1960 (Janvier)
  { chapter: 'LES PRINCIPALES ETAPES DE L’INDEPENDANCE DU  CONGO', month: 'Janvier 2026' },
  { chapter: 'Les activites agro-pastorales', month: 'Janvier 2026' },
  // HG3E-3 Géo population/ressources (Oct : population — Nov : ressources/échanges)
  { chapter: 'Le paysage humain', month: 'Octobre 2025' },
  { chapter: 'Les differents elements du milieu physiques', month: 'Novembre 2025' },
  { chapter: 'Les activites de service', month: 'Novembre 2025' },
  // HG3E-4 Géo du Congo (Février)
  { chapter: 'Les problemes de developpement du Congo', month: 'Février 2026' },
  { chapter: 'Les voies de communication et les telecommunications', month: 'Février 2026' },
  { chapter: 'Les differents etats de la sous-region', month: 'Février 2026' },
]

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===', `(${REALIGN.length} chapitres)`)

  const monthLabels = [...new Set(REALIGN.map((r) => r.month))]
  const months = await sb(`/rest/v1/school_months?label=in.(${monthLabels.map((l) => `"${l}"`).join(',')})&select=id,label,term_id`)
  const monthByLabel = Object.fromEntries(months.map((m) => [m.label, m]))

  const chapterTitles = REALIGN.map((r) => r.chapter)
  const chapters = await sb(`/rest/v1/chapters?title=in.(${chapterTitles.map((t) => `"${t.replace(/"/g, '')}"`).join(',')})&select=id,title`)
  const chapterByTitle = Object.fromEntries(chapters.map((c) => [c.title, c]))

  let done = 0, skipped = 0, missing = 0
  for (const r of REALIGN) {
    const chapter = chapterByTitle[r.chapter]
    const month = monthByLabel[r.month]
    if (!chapter) { console.warn(`⚠ Chapitre introuvable : "${r.chapter}"`); missing++; continue }
    if (!month) { console.warn(`⚠ Mois introuvable : "${r.month}"`); continue }

    const [item] = await sb(`/rest/v1/curriculum_items?chapter_id=eq.${chapter.id}&item_type=eq.chapter&select=id,school_month_id`)
    if (!item) { console.warn(`⚠ Pas de curriculum_item pour "${r.chapter}"`); continue }
    if (item.school_month_id === month.id) { skipped++; continue }

    if (DRY_RUN) { console.log(`[dry-run] "${r.chapter}" → ${r.month}`); continue }
    await sb(`/rest/v1/curriculum_items?id=eq.${item.id}`, { method: 'PATCH', body: JSON.stringify({ school_month_id: month.id, term_id: month.term_id }) })
    done++
  }
  console.log(`\n${DRY_RUN ? '[dry-run]' : 'Terminé.'} ${done} réalignés, ${skipped} déjà en place, ${missing} chapitres introuvables.`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
