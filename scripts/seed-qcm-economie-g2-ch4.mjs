/**
 * QCM de fin de chapitre — ÉCONOMIE Terminale G2, chapitre IV
 * « Genèse et développement du sous-développement ».
 *
 * Ce chapitre était le seul sans évaluation : le QCM qu'il portait était en
 * réalité celui du chapitre V, reclassé par `scripts/seed-economie-g2.mjs`.
 * Les 15 questions ci-dessous sont rédigées à partir du cours du chapitre IV
 * (définitions de Perroux / Rostow / Furtado, facteurs externes et internes,
 * mécanismes du sous-développement).
 *
 * Idempotent : si le chapitre porte déjà un QCM, le script s'arrête sans rien
 * écrire — un index unique n'autorise de toute façon qu'un QCM par chapitre
 * (migration 053).
 *
 * Usage :
 *   node scripts/seed-qcm-economie-g2-ch4.mjs --dry-run
 *   node scripts/seed-qcm-economie-g2-ch4.mjs
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }),
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

async function sb(path, init) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: 'return=representation',
      ...(init?.headers ?? {}),
    },
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : null
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> HTTP ${res.status}: ${JSON.stringify(json)}`)
  return json
}

const SUBJECT_ECO_G2 = '735ad634-4a71-4fe0-821b-38a58fb765a4'
const CHAPTER_IV = '8bff2a0f-a048-4edf-b174-817ec7376287'

const QUIZ = {
  title: 'QCM CHAPITRE IV — GENÈSE ET DÉVELOPPEMENT DU SOUS-DÉVELOPPEMENT',
  time_limit_sec: 600,
  is_premium: false,
}

const QUESTIONS = [
  {
    prompt: 'Pour François Perroux, le sous-développement est avant tout :',
    options: [
      'Une étape naturelle que tous les pays doivent traverser',
      'Un phénomène historique',
      'Une conséquence inévitable du climat',
      'Un simple retard technique passager',
    ],
    correct_index: 1,
    explanation: "Pour Perroux, le sous-développement est un phénomène historique : ce n'est pas une étape obligatoire avant le développement.",
  },
  {
    prompt: 'Selon Walt Whitman Rostow, le sous-développement correspond à :',
    options: [
      'Un retard pris dans le processus de croissance économique',
      'Une désarticulation volontaire des secteurs économiques',
      "L'absence totale de ressources naturelles",
      'Une conséquence directe de la colonisation',
    ],
    correct_index: 0,
    explanation: 'Rostow analyse le sous-développement comme un retard dans le processus de croissance économique.',
  },
  {
    prompt: 'Quel auteur présente le sous-développement comme un processus historique autonome, marqué par des blocages et une désarticulation des secteurs économiques ?',
    options: ['Walt Whitman Rostow', 'Ragnar Nurkse', 'Celso Furtado', 'Werner Sombart'],
    correct_index: 2,
    explanation: "Celso Furtado décrit le sous-développement comme un processus historique autonome, lié à la manière dont la révolution industrielle s'est développée.",
  },
  {
    prompt: 'Parmi les facteurs suivants, lequel est un facteur EXTERNE (exogène) du sous-développement ?',
    options: ['La dégradation des sols', 'La fuite des cerveaux', "L'instabilité politique", 'La colonisation'],
    correct_index: 3,
    explanation: 'La colonisation et la néocolonisation sont les principaux facteurs externes étudiés ; les trois autres propositions sont des facteurs internes.',
  },
  {
    prompt: "L'échange inégal est présenté dans le cours comme une manifestation de :",
    options: ['La néocolonisation', 'La coopération internationale', 'La planification économique', 'La demande solvable'],
    correct_index: 0,
    explanation: 'La néocolonisation se manifeste notamment par des relations économiques déséquilibrées, comme l’échange inégal.',
  },
  {
    prompt: "Pourquoi la colonisation ne suffit-elle pas à expliquer toutes les situations de sous-développement ?",
    options: [
      "Parce qu'elle n'a jamais transformé les économies colonisées",
      "Parce que certains pays jamais colonisés sont restés sous-développés et que d'anciennes colonies sont devenues développées",
      'Parce que tous les pays du monde ont été colonisés',
      "Parce qu'elle est un facteur interne et non externe",
    ],
    correct_index: 1,
    explanation: "La colonisation est un facteur explicatif mais non déterminant : des pays non colonisés sont restés sous-développés, et d'anciennes colonies sont aujourd'hui développées.",
  },
  {
    prompt: 'Quelles conséquences la dégradation des sols peut-elle provoquer ?',
    options: [
      'Une hausse automatique des rendements agricoles',
      'Une industrialisation accélérée',
      "Une baisse des rendements, l'érosion et la désertification",
      'Une augmentation de la demande solvable',
    ],
    correct_index: 2,
    explanation: "La dégradation des sols entraîne une diminution des rendements agricoles, l'érosion et la désertification.",
  },
  {
    prompt: 'Que désigne la fuite des cerveaux ?',
    options: [
      "L'arrivée de travailleurs étrangers dans un pays",
      'Le passage des travailleurs du secteur moderne au secteur traditionnel',
      "L'exode des populations rurales vers les villes",
      "Le départ vers l'étranger de personnes qualifiées à la recherche de meilleures conditions",
    ],
    correct_index: 3,
    explanation: "La fuite des cerveaux correspond au départ vers l'étranger de personnes qualifiées, à la recherche de meilleures conditions économiques et professionnelles.",
  },
  {
    prompt: "Pourquoi l'instabilité politique est-elle particulièrement défavorable au développement ?",
    options: [
      'Parce qu’elle augmente toujours la productivité du travail',
      'Parce que les conflits perturbent la production, découragent les investissements et mobilisent des ressources importantes',
      "Parce qu'elle supprime le secteur traditionnel",
      "Parce qu'elle réduit la population active",
    ],
    correct_index: 1,
    explanation: "Les conflits perturbent la production, découragent les investissements et détournent des ressources importantes du développement.",
  },
  {
    prompt: 'Parmi ces éléments, lequel constitue une condition FAVORABLE au développement ?',
    options: [
      'Un État fort, capable d’établir un cadre institutionnel adapté',
      "L'absence de classe moyenne",
      'La fuite des cerveaux',
      "L'étroitesse du marché intérieur",
    ],
    correct_index: 0,
    explanation: "Un État fort et un cadre institutionnel adapté, la stabilité politique, un surplus permettant l'investissement, des entrepreneurs nationaux dynamiques et la démocratie favorisent le développement.",
  },
  {
    prompt: 'À quel auteur la théorie du cercle vicieux de la pauvreté est-elle associée ?',
    options: ['Perroux', 'Furtado', 'Nurkse', 'Engels'],
    correct_index: 2,
    explanation: 'La théorie du cercle vicieux de la pauvreté est notamment associée à Nurkse.',
  },
  {
    prompt: 'Quel enchaînement correspond au cercle vicieux de la pauvreté ?',
    options: [
      'Forte productivité → fort revenu → forte épargne → fort investissement',
      'Faible productivité → faible revenu → faible épargne → faible investissement → faible productivité',
      'Faible revenu → forte épargne → fort investissement → forte productivité',
      'Faible investissement → forte productivité → faible revenu → forte épargne',
    ],
    correct_index: 1,
    explanation: "La faible productivité entraîne de faibles revenus, donc une faible épargne, donc une faible accumulation du capital et un faible investissement, ce qui bloque la productivité.",
  },
  {
    prompt: "Pourquoi l'étroitesse des marchés freine-t-elle l'investissement ?",
    options: [
      'Parce que les entreprises ne peuvent pas produire techniquement',
      "Parce que l'État interdit la création d'entreprises",
      'Parce que les prix internationaux sont trop élevés',
      'Parce que la demande solvable est insuffisante pour acheter les produits fabriqués',
    ],
    correct_index: 3,
    explanation: "Un entrepreneur hésite à investir si la population ne dispose pas de revenus suffisants pour acheter sa production : c'est l'insuffisance de la demande solvable.",
  },
  {
    prompt: 'Que désignent les effets de démonstration ?',
    options: [
      "L'influence des modes de consommation des pays développés sur les catégories les plus aisées des pays sous-développés",
      "La démonstration par l'État de ses capacités de production",
      "La présentation des nouvelles techniques aux agriculteurs",
      "L'imitation des techniques industrielles par les entreprises locales",
    ],
    correct_index: 0,
    explanation: "Les effets de démonstration poussent une partie du surplus de revenu vers une consommation élevée plutôt que vers l'épargne et l'investissement.",
  },
  {
    prompt: 'Le dualisme économique et social désigne :',
    options: [
      'La coexistence de deux monnaies dans un même pays',
      "L'opposition entre deux partis politiques",
      "La coexistence d'un secteur traditionnel et d'un secteur moderne",
      "L'existence de deux taux de change différents",
    ],
    correct_index: 2,
    explanation: "Le dualisme est la coexistence d'un secteur traditionnel et d'un secteur moderne ; le secteur moderne apparaît souvent comme une enclave, d'où la non-intégration économique.",
  },
]

/* ── Garde-fous ─────────────────────────────────────────────────────────── */
const [chapter] = await sb(`/chapters?select=id,title,subject_id&id=eq.${CHAPTER_IV}`)
if (!chapter) throw new Error(`Chapitre ${CHAPTER_IV} introuvable.`)
if (chapter.subject_id !== SUBJECT_ECO_G2) throw new Error("Le chapitre visé n'appartient pas à ÉCONOMIE bac_g2. Abandon.")
console.log(`Chapitre : ${chapter.title}`)

const REPLACE = process.argv.includes('--replace')

const already = await sb(`/quizzes?select=id,title&chapter_id=eq.${CHAPTER_IV}`)
if (already.length && !REPLACE) {
  console.log(`Ce chapitre porte déjà le QCM « ${already[0].title} » (${already[0].id}). Rien à faire.`)
  console.log('(--replace réécrit ses questions, uniquement si aucun élève ne l’a encore passé.)')
  process.exit(0)
}
if (already.length && REPLACE) {
  // On ne réécrit que tant que le QCM est vierge : les réponses déjà données
  // par un élève pointent sur les identifiants des questions actuelles.
  const attempts = await sb(`/quiz_attempts?select=id&quiz_id=eq.${already[0].id}&limit=1`)
  if (attempts.length) throw new Error('Ce QCM a déjà été passé par au moins un élève : réécriture refusée.')
  console.log(`--replace : réécriture des questions du QCM « ${already[0].title} ».`)
}

QUESTIONS.forEach((q, i) => {
  if (q.options.length !== 4) throw new Error(`Question ${i + 1} : ${q.options.length} options au lieu de 4.`)
  if (q.correct_index < 0 || q.correct_index > 3) throw new Error(`Question ${i + 1} : correct_index hors bornes.`)
})
console.log(`${QUESTIONS.length} questions validées (4 options chacune).`)

if (DRY_RUN) {
  QUESTIONS.forEach((q, i) => {
    console.log(`\n${i + 1}. ${q.prompt}`)
    q.options.forEach((o, j) => console.log(`   ${j === q.correct_index ? '✓' : ' '} ${String.fromCharCode(65 + j)}. ${o}`))
  })
  console.log('\nDry-run terminé — aucune écriture.')
  process.exit(0)
}

/* ── Création (ou réécriture) ───────────────────────────────────────────── */
let quiz
if (already.length) {
  quiz = already[0]
  await sb(`/quiz_questions?quiz_id=eq.${quiz.id}`, { method: 'DELETE' })
  await sb(`/quizzes?id=eq.${quiz.id}`, {
    method: 'PATCH',
    body: JSON.stringify({ title: QUIZ.title, time_limit_sec: QUIZ.time_limit_sec, is_premium: QUIZ.is_premium }),
  })
  console.log(`Anciennes questions supprimées sur ${quiz.id}.`)
} else {
  ;[quiz] = await sb('/quizzes', {
    method: 'POST',
    body: JSON.stringify({
      subject_id: SUBJECT_ECO_G2,
      chapter_id: CHAPTER_IV,
      title: QUIZ.title,
      level: 'bac_g2',
      time_limit_sec: QUIZ.time_limit_sec,
      is_premium: QUIZ.is_premium,
    }),
  })
  console.log(`QCM créé : ${quiz.id}`)
}

const rows = QUESTIONS.map((q, i) => ({
  quiz_id: quiz.id,
  position: i + 1,
  prompt: q.prompt,
  options: q.options,
  correct_index: q.correct_index,
  explanation: q.explanation,
}))
const inserted = await sb('/quiz_questions', { method: 'POST', body: JSON.stringify(rows) })
console.log(`${inserted.length} questions insérées.`)
