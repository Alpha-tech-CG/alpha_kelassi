/**
 * Ajoute un premier contenu (résumé structuré) aux 23 chapitres BEPC créés
 * dans create-official-bepc-chapters.mjs, à partir des "contenus" du
 * programme officiel (bepc_3e_programme_officiel_complet.json). Ce n'est pas
 * une leçon complète rédigée — juste la liste structurée des points au
 * programme pour ce chapitre, en attendant un vrai cours détaillé.
 *
 * Crée une leçon type='cours'. Idempotent (skip si déjà présente).
 *
 * Usage : node scripts/seed-bepc-officiel-contenus.mjs [--dry-run]
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

// matière → { titre du chapitre : [contenus officiels] } — accents restaurés depuis le JSON source.
const CONTENUS = {
  'Mathématiques': {
    'Activités numériques : nombres relatifs, fractions, puissances': [
      'Nombres relatifs (rappels de 4e)', 'Opérations sur les relatifs', 'Fractions (réductions, opérations)', 'Puissances de 10, notation scientifique',
    ],
    'Calcul littéral : développer, factoriser, équations': [
      'Développer k(a+b), k(a-b), (a+b)(c+d)', 'Factoriser ka+kb', 'Équations du 1er degré à une inconnue', 'Équations-produits (ax+b)(cx+d)=0',
    ],
    'Trigonométrie dans le triangle rectangle': [
      "Sinus, cosinus, tangente d'un angle aigu", 'Relations trigonométriques', "Calcul de longueurs et d'angles", 'Applications (hauteurs, distances)',
    ],
    'Repérage dans le plan': [
      "Coordonnées d'un point", 'Distance entre deux points', "Milieu d'un segment", 'Repérage et vecteurs',
    ],
  },
  'Français': {
    'Grammaire : phrase complexe': [
      'Propositions indépendantes, juxtaposées, coordonnées', 'Subordonnées relatives (fonctions, antécédent)', 'Subordonnées conjonctives (complétives, circonstancielles)', 'Discours rapporté (direct/indirect)',
    ],
    'Conjugaison : temps et modes': [
      'Révision des temps du récit (imparfait, passé simple, passé composé)', 'Subjonctif présent (formation, emplois)', 'Conditionnel présent (souhait, hypothèse)', 'Temps composés (plus-que-parfait, futur antérieur, passé antérieur)', 'Concordance des temps',
    ],
    'Orthographe et vocabulaire': [
      'Accords (sujet-verbe, participe passé, adjectif)', 'Homophones grammaticaux (a/à, ce/se, etc.)', 'Enrichissement du vocabulaire (champs lexicaux, synonymes, antonymes)', 'Formation des mots (préfixes, suffixes)',
    ],
    'Expression écrite': [
      'Le récit (situation initiale, événement, résolution)', 'La description (lieu, personnage, objet)', 'La lettre (familiale, administrative)', 'Le texte argumentatif (thèse, arguments, exemples)', 'Le résumé de texte',
    ],
    'Lecture et compréhension': [
      'Textes narratifs (nouvelles, extraits de romans)', 'Textes descriptifs et injonctifs', 'Textes argumentatifs', 'Poésie (analyse de poèmes)', 'Documents mixtes (texte + tableau, graphique)',
    ],
  },
  'Anglais': {
    'Vocabulary : everyday topics': [
      'Family, school, daily routine', 'City, transport, directions', 'Travel, holidays', 'Health, body, illnesses', 'Environment, technology',
    ],
    'Skills : reading and writing': [
      'Reading comprehension (short texts, authentic documents)', 'Writing paragraphs, letters, emails', 'Dialogues and conversations', 'Summarizing texts',
    ],
  },
  'SVT': {
    'Reproduction humaine': [
      'Puberté et organes reproducteurs', 'Cycle menstruel', 'Fécondation, grossesse, accouchement', 'Contraception et santé de la reproduction',
    ],
    'Génétique': [
      'Chromosomes, ADN, cellule', "Transmission d'un gène", 'Groupes sanguins et hérédité',
    ],
    'Système nerveux': [
      'Organisation du système nerveux cérébro-spinal', 'Tissu nerveux et neurone', 'Mouvement volontaire et réflexe', 'Maladies du système nerveux',
    ],
    'Immunité': [
      "Défenses de l'organisme (barrières, phagocytose)", "VIH/SIDA : mode d'action, prévention", 'Vaccination et renforcement des défenses',
    ],
    'Écosystèmes et environnement': [
      'Écosystèmes, chaînes alimentaires', 'Relations trophiques', 'Pollution, déforestation', 'Changement climatique et solutions',
    ],
  },
  'Éducation Civique': {
    'Institutions et pouvoir': [
      'Présidence, Gouvernement, Assemblée nationale', 'Pouvoir judiciaire', 'Séparation des pouvoirs',
    ],
    'Citoyenneté et démocratie': [
      'Droits et devoirs du citoyen', 'Démocratie, élections, partis politiques', 'Participation citoyenne',
    ],
    'Problèmes de société': [
      'Drogues, alcool, tabagisme : prévention', 'VIH/SIDA, IST : prévention et lutte contre la stigmatisation', 'Environnement et citoyenneté',
    ],
  },
  'EPS': {
    'Athlétisme': [
      'Course de vitesse et relais', 'Saut en hauteur, lancer de poids', 'Endurance',
    ],
    'Sports collectifs': [
      'Football, basket-ball (règles, techniques)', 'Handball, volley-ball (tactiques)',
    ],
    'Gymnastique et danse': [
      'Gymnastique au sol (figures simples)', 'Danse et expression corporelle (chorégraphies)',
    ],
    'Natation et pleine nature': [
      'Natation (techniques de nage)', "Course d'endurance, orientation",
    ],
  },
}

function toMarkdown(chapterTitle, contenus) {
  let md = `### Au programme de ce chapitre\n\n`
  md += contenus.map((c) => `- ${c}`).join('\n')
  md += `\n\n*Programme officiel BEPC (INRAP/MEPPSA) — points à couvrir pour "${chapterTitle}". Cours détaillé à venir.*`
  return md
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')

  const subjects = await sb(`/rest/v1/subjects?level=eq.bepc&select=id,name`)
  const subjectByName = Object.fromEntries(subjects.map((s) => [s.name, s]))

  let created = 0, skipped = 0
  for (const [subjectName, chapters] of Object.entries(CONTENUS)) {
    const subject = subjectByName[subjectName]
    if (!subject) { console.warn(`⚠ Matière introuvable : "${subjectName}"`); continue }

    console.log(`\n--- ${subjectName} ---`)
    for (const [chapterTitle, contenus] of Object.entries(chapters)) {
      const [chapter] = await sb(`/rest/v1/chapters?subject_id=eq.${subject.id}&title=eq.${encodeURIComponent(chapterTitle)}&select=id`)
      if (!chapter) { console.warn(`⚠ Chapitre introuvable : "${chapterTitle}"`); continue }

      const [existing] = await sb(`/rest/v1/lessons?chapter_id=eq.${chapter.id}&type=eq.cours&select=id`)
      if (existing) { console.log(`… déjà présent : ${chapterTitle}`); skipped++; continue }

      const content = toMarkdown(chapterTitle, contenus)
      if (DRY_RUN) { console.log(`[dry-run] créerait cours "${chapterTitle}" (${content.length} caractères)`); continue }

      await sb('/rest/v1/lessons', {
        method: 'POST',
        body: JSON.stringify({ chapter_id: chapter.id, type: 'cours', title: chapterTitle, content, order_index: 0, is_premium: false }),
      })
      console.log(`✓ Cours créé : ${chapterTitle}`)
      created++
    }
  }

  console.log(`\n${DRY_RUN ? '[dry-run]' : 'Terminé.'} ${created} cours créés, ${skipped} déjà présents.`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
