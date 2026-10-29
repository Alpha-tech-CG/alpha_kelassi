/**
 * Cohérence des titres (chapitres + leçons) en Terminale A/C/D — 29/10/2026.
 * Corrige : MAJUSCULES abusives (Philosophie, Chimie, Français, Géographie),
 * coquilles (SEPECTRE→spectre, ACQUEUSES→aqueuses, execrcices→exercices,
 * reussites→réussites, Detente→Détente, LITERATURE→Littérature…), séparateurs
 * et numérotation (Chimie : ch. estérification numéroté), espaces en trop.
 *
 * Deux mécanismes :
 *   - MAP explicite (sûr : pas de minusculisation automatique qui casserait
 *     accents et noms propres) appliquée par titre exact, sur les 3 séries
 *     d'un coup → copies liées cohérentes.
 *   - Nettoyage générique des espaces (trim + espaces multiples) sur tout titre.
 *
 * Usage :
 *   node scripts/fix-titres-terminale.mjs            (dry-run)
 *   node scripts/fix-titres-terminale.mjs --confirm
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
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
const tidy = (s) => s.replace(/\s+/g, ' ').trim()

// ── MAP des titres de CHAPITRES (clé = titre actuel, après tidy) ──────────────
const CH = {
  // Philosophie
  'LEÇON 1 — LA PROBLÉMATIQUE DE LA PHILOSOPHIE EN AFRIQUE': 'Leçon 1 — La problématique de la philosophie en Afrique',
  "LEÇON 2 — L'HOMME ET LE MONDE : CONSCIENCE, INCONSCIENT ET AUTRUI": "Leçon 2 — L'homme et le monde : conscience, inconscient et autrui",
  "LEÇON 2 — L'HOMME ET LE MONDE : CONSCIENCE ET INCONSCIENT": "Leçon 2 — L'homme et le monde : conscience et inconscient",
  'LEÇON 3 — LOGIQUE ET CONNAISSANCE': 'Leçon 3 — Logique et connaissance',
  'LEÇON 4 — NATURE, CULTURE, TRAVAIL ET ART': 'Leçon 4 — Nature, culture, travail et art',
  'LEÇON 4 — NATURE, CULTURE ET TRAVAIL': 'Leçon 4 — Nature, culture et travail',
  "LEÇON 5 — LES CONCEPTIONS PHILOSOPHIQUES DE L'HISTOIRE": "Leçon 5 — Les conceptions philosophiques de l'histoire",
  "LEÇON 6 — L'ÉTAT ET LE POUVOIR POLITIQUE (DROIT, JUSTICE, CITOYENNETÉ)": "Leçon 6 — L'État et le pouvoir politique (droit, justice, citoyenneté)",
  "LEÇON 6 — L'ÉTAT ET LE POUVOIR POLITIQUE": "Leçon 6 — L'État et le pouvoir politique",
  "LEÇON 7 — L'EXISTENCE ET SES PROBLÈMES : DIEU, LA LIBERTÉ, LA MORT": "Leçon 7 — L'existence et ses problèmes : Dieu, la liberté, la mort",
  'ANNEXES — RÉVISION ET MÉTHODOLOGIE (SÉRIE A)': 'Annexes — Révision et méthodologie (série A)',
  'ANNEXES — RÉVISION ET MÉTHODOLOGIE': 'Annexes — Révision et méthodologie',
  // Chimie (numérotation : estérification devient ch.6, solutions ch.7)
  'Chapitre 1: LOIS RELATIVES AUX MASSES MOLAIRES ET MÉTHODES DE SÉPARATION DES ISOTOPES': 'Chapitre 1 — Lois relatives aux masses molaires et méthodes de séparation des isotopes',
  "Chapitre 2: Le SEPECTRE DE L'ATOME D'HYDROGÈNE": "Chapitre 2 — Le spectre de l'atome d'hydrogène",
  'Chapitre 3: PROPRIÉTÉS DES RÉACTIONS NUCLÉAIRES': 'Chapitre 3 — Propriétés des réactions nucléaires',
  'Chapitre 4: CINÉTIQUE CHIMIQUE': 'Chapitre 4 — Cinétique chimique',
  'Chapitre 5: EQUILIBRES CHIMIQUES': 'Chapitre 5 — Équilibres chimiques',
  "RÉACTIONS D'ESTÉRIFICATION, D'HYDROLYSE ET DE SAPONIFICATION": "Chapitre 6 — Réactions d'estérification, d'hydrolyse et de saponification",
  'Chapitre 6: SOLUTIONS ACQUEUSES DES ACIDES ET DES BASES': 'Chapitre 7 — Solutions aqueuses des acides et des bases',
  // Français bac_a
  'Partie 1: LITERATURE': 'Partie 1 — Littérature',
  'Partie 2: Etude du Roman': 'Partie 2 — Étude du roman',
  'Partie 3: execrcices littéraires': 'Partie 3 — Exercices littéraires',
  // Géographie bac_a (OG) — on garde le codage officiel « OGn: »
  "OG1: COMPRENDRE L'ORGANISATION DES SYSTÈMES ÉCONOMIQUES DU MONDE ACTUEL": "OG1 : Comprendre l'organisation des systèmes économiques du monde actuel",
  'OG2: COMPRENDRE LES DIFFÉRENTS ASPECTS PHYSIQUES DU CONGO': 'OG2 : Comprendre les différents aspects physiques du Congo',
  'OG3: COMPRENDRE LES DIVERS ASPECTS HUMAINS ET URBAINS DU CONGO': 'OG3 : Comprendre les divers aspects humains et urbains du Congo',
  "OG4: COMPRENDRE L'ORGANISATION ADMINISTRATIVE DU CONGO": "OG4 : Comprendre l'organisation administrative du Congo",
  'OG5: COMPRENDRE LES COMPOSANTES DE L’ÉCONOMIE CONGOLAISE ET LEURS PROBLÈMES': 'OG5 : Comprendre les composantes de l’économie congolaise et leurs problèmes',
  "OG5: COMPRENDRE LES COMPOSANTES DE L'ÉCONOMIE CONGOLAISE ET LEURS PROBLÈMES": "OG5 : Comprendre les composantes de l'économie congolaise et leurs problèmes",
  // Portugais
  'Capítulo um: OS MODOS': 'Capítulo 1 — Os modos',
}

// ── MAP des titres de LEÇONS ──────────────────────────────────────────────────
const LS = {
  // Philosophie : la leçon reprend le titre du chapitre
  'LEÇON 1 — LA PROBLÉMATIQUE DE LA PHILOSOPHIE EN AFRIQUE': 'Leçon 1 — La problématique de la philosophie en Afrique',
  "LEÇON 2 — L'HOMME ET LE MONDE : CONSCIENCE, INCONSCIENT ET AUTRUI": "Leçon 2 — L'homme et le monde : conscience, inconscient et autrui",
  "LEÇON 2 — L'HOMME ET LE MONDE : CONSCIENCE ET INCONSCIENT": "Leçon 2 — L'homme et le monde : conscience et inconscient",
  'LEÇON 3 — LOGIQUE ET CONNAISSANCE': 'Leçon 3 — Logique et connaissance',
  'LEÇON 4 — NATURE, CULTURE, TRAVAIL ET ART': 'Leçon 4 — Nature, culture, travail et art',
  'LEÇON 4 — NATURE, CULTURE ET TRAVAIL': 'Leçon 4 — Nature, culture et travail',
  "LEÇON 5 — LES CONCEPTIONS PHILOSOPHIQUES DE L'HISTOIRE": "Leçon 5 — Les conceptions philosophiques de l'histoire",
  "LEÇON 6 — L'ÉTAT ET LE POUVOIR POLITIQUE (DROIT, JUSTICE, CITOYENNETÉ)": "Leçon 6 — L'État et le pouvoir politique (droit, justice, citoyenneté)",
  "LEÇON 6 — L'ÉTAT ET LE POUVOIR POLITIQUE": "Leçon 6 — L'État et le pouvoir politique",
  "LEÇON 7 — L'EXISTENCE ET SES PROBLÈMES : DIEU, LA LIBERTÉ, LA MORT": "Leçon 7 — L'existence et ses problèmes : Dieu, la liberté, la mort",
  'ANNEXES — RÉVISION ET MÉTHODOLOGIE (SÉRIE A)': 'Annexes — Révision et méthodologie (série A)',
  'ANNEXES — RÉVISION ET MÉTHODOLOGIE': 'Annexes — Révision et méthodologie',
  // Chimie
  'GÉNÉRALITÉS': 'Généralités',
  'RÉACTIONS ACIDE - BASE': 'Réactions acide-base',
  'DOSAGE ACIDO - BASIQUE': 'Dosage acido-basique',
  // Français bac_a
  'ÉNONCIATION ET POINT DE VUE': 'Énonciation et point de vue',
  'LE TEXTE NARRATIF': 'Le texte narratif',
  'LES GENRES LITTÉRAIRES': 'Les genres littéraires',
  'LES PROPOSITIONS': 'Les propositions',
  'LES CONNECTEURS LOGIQUES': 'Les connecteurs logiques',
  "L'ENGAGEMENT DE L'ECRIVAIN": "L'engagement de l'écrivain",
  'LA LITTÉRATURE CONGOLAISE': 'La littérature congolaise',
  'Etudes du roman le Pleurer-Rire de Henri Lopes': 'Étude du roman Le Pleurer-Rire de Henri Lopes',
  'ETUDE THÉMATIQUE': 'Étude thématique',
  // Géographie bac_a (OS) — on garde « OSn: », fix casse + CONGO→Congo
  'OS2-1: Les différents Aspects physiques du CONGO': 'OS2-1 : Les différents aspects physiques du Congo',
  'OS2-2: Relations entre le milieu physique et la population au CONGO': 'OS2-2 : Relations entre le milieu physique et la population au Congo',
  "OS4-2: L'organisation Administrative du CONGO": "OS4-2 : L'organisation administrative du Congo",
  // Histoire (leçons, copies a/c/d)
  'Les causes de la Deuxième Guerre Mondiale (1939-1945)': 'Les causes de la Deuxième Guerre mondiale (1939-1945)',
  'Les grandes étapes de la deuxième guerre mondiale (1939 - 1945)': 'Les grandes étapes de la Deuxième Guerre mondiale (1939-1945)',
  'Les conséquences de la Deuxième Guerre Mondiale': 'Les conséquences de la Deuxième Guerre mondiale',
  'Les reussites et les difficultés de l\'ONU': "Les réussites et les difficultés de l'ONU",
  'Les causes de la Guerre Froide 1947- 1953': 'Les causes de la Guerre froide (1947-1953)',
  'Les manifestations de la guerre froide en Europe et en Asie (1947-1953)': 'Les manifestations de la Guerre froide en Europe et en Asie (1947-1953)',
  'La coexistence pacifique 1953-1962': 'La coexistence pacifique (1953-1962)',
  'Les relations Est-Ouest pendant la Detente de 1962-1975': 'Les relations Est-Ouest pendant la Détente (1962-1975)',
  'Les principales causes de la DÉCOLONISATION': 'Les principales causes de la décolonisation',
  'Les types de Décolonisation': 'Les types de décolonisation',
}

const LEVELS = ['bac_a', 'bac_c', 'bac_d']
let nCh = 0, nLs = 0
for (const lv of LEVELS) {
  const subs = await sb(`/subjects?select=id,name&level=eq.${lv}`)
  for (const s of subs) {
    const chs = await sb(`/chapters?subject_id=eq.${s.id}&select=id,title,lessons(id,title)`)
    for (const c of chs) {
      const cur = tidy(c.title)
      const next = CH[cur] ?? cur
      if (next !== c.title) {
        console.log(`CH [${lv}/${s.name}] « ${c.title} » → « ${next} »`)
        nCh++
        if (CONFIRM) await sb(`/chapters?id=eq.${c.id}`, { method: 'PATCH', body: JSON.stringify({ title: next }) })
      }
      for (const l of c.lessons || []) {
        const lc = tidy(l.title)
        const ln = LS[lc] ?? lc
        if (ln !== l.title) {
          console.log(`   LS « ${l.title} » → « ${ln} »`)
          nLs++
          if (CONFIRM) await sb(`/lessons?id=eq.${l.id}`, { method: 'PATCH', body: JSON.stringify({ title: ln }) })
        }
      }
    }
  }
}
console.log(`\n${CONFIRM ? 'Appliqué' : '[DRY-RUN]'} : ${nCh} chapitres, ${nLs} leçons.`)
if (!CONFIRM) console.log('Ajoute --confirm pour appliquer.')
