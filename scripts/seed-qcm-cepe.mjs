/**
 * QCM de fin de chapitre — CEPE (toutes les matières).
 *
 * Les questions vivent dans `scripts/content/qcm-cepe/<matiere>.json`, écrites
 * à partir du contenu des leçons de chaque chapitre. Ce script les charge et
 * crée, pour chaque chapitre, le QCM corrigé automatiquement que la page de
 * chapitre affiche déjà (migration 053 : un seul QCM par chapitre).
 *
 * L'élève répond question par question dans le moteur de quiz : chaque question
 * est suivie de ses propositions, et le corrigé n'apparaît qu'après l'envoi.
 *
 * Idempotent : un chapitre qui porte déjà un QCM est laissé intact (l'index
 * unique `idx_quizzes_one_per_chapter` l'interdirait de toute façon).
 *
 * Usage :
 *   node scripts/seed-qcm-cepe.mjs --dry-run              # tout vérifier sans écrire
 *   node scripts/seed-qcm-cepe.mjs --matiere=numeration   # une seule matière
 *   node scripts/seed-qcm-cepe.mjs
 */
import { readFileSync, readdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
const ONLY = (process.argv.find((a) => a.startsWith('--matiere=')) ?? '').split('=')[1]
const DATA_DIR = join(__dirname, 'content', 'qcm-cepe')

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }),
)

async function sb(path, init) {
  const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: 'return=representation',
      ...(init?.headers ?? {}),
    },
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : null
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> HTTP ${res.status}: ${JSON.stringify(json)}`)
  return json
}

/** Refuse une fiche mal formée plutôt que d'écrire un QCM bancal. */
function verifier(matiere, chapitre) {
  const où = `${matiere} / ${chapitre.titre}`
  if (!chapitre.chapter_id) throw new Error(`${où} : chapter_id manquant`)
  if (!Array.isArray(chapitre.questions) || chapitre.questions.length < 5) {
    throw new Error(`${où} : ${chapitre.questions?.length ?? 0} question(s), minimum 5`)
  }
  chapitre.questions.forEach((q, i) => {
    const n = `${où} / question ${i + 1}`
    if (!q.prompt?.trim()) throw new Error(`${n} : énoncé vide`)
    if (!Array.isArray(q.options) || q.options.length !== 4) throw new Error(`${n} : il faut 4 propositions`)
    if (new Set(q.options).size !== 4) throw new Error(`${n} : deux propositions identiques`)
    if (q.options.some((o) => !String(o).trim())) throw new Error(`${n} : proposition vide`)
    if (!Number.isInteger(q.correct_index) || q.correct_index < 0 || q.correct_index > 3) {
      throw new Error(`${n} : correct_index hors des propositions`)
    }
    if (!q.explanation?.trim()) throw new Error(`${n} : corrigé manquant`)
  })
}

const fichiers = readdirSync(DATA_DIR)
  .filter((f) => f.endsWith('.json'))
  .filter((f) => !ONLY || f === `${ONLY}.json`)
  .sort()

if (!fichiers.length) {
  console.error(ONLY ? `Aucune fiche pour « ${ONLY} » dans ${DATA_DIR}` : `Aucune fiche dans ${DATA_DIR}`)
  process.exit(1)
}

let créés = 0
let ignorés = 0
let questionsÉcrites = 0

for (const fichier of fichiers) {
  const data = JSON.parse(readFileSync(join(DATA_DIR, fichier), 'utf-8'))
  console.log(`\n=== ${data.matiere} (${data.chapitres.length} chapitre${data.chapitres.length > 1 ? 's' : ''}) ===`)

  for (const chapitre of data.chapitres) {
    verifier(data.matiere, chapitre)

    const existant = await sb(`/quizzes?select=id,title&chapter_id=eq.${chapitre.chapter_id}`)
    if (existant.length) {
      console.log(`  = ${chapitre.titre} — QCM déjà en place, ignoré`)
      ignorés++
      continue
    }

    const titre = `QCM — ${chapitre.titre}`
    if (DRY_RUN) {
      console.log(`  + ${titre} (${chapitre.questions.length} questions, ${Math.round((chapitre.time_limit_sec ?? 600) / 60)} min)`)
      créés++
      questionsÉcrites += chapitre.questions.length
      continue
    }

    const [quiz] = await sb('/quizzes', {
      method: 'POST',
      body: JSON.stringify({
        // Une fiche peut regrouper plusieurs matières : chaque chapitre porte alors son `subject_id`.
        subject_id: chapitre.subject_id ?? data.subject_id,
        chapter_id: chapitre.chapter_id,
        title: titre,
        description: chapitre.description ?? null,
        level: 'cepe',
        time_limit_sec: chapitre.time_limit_sec ?? 600,
        is_premium: false,
      }),
    })

    await sb('/quiz_questions', {
      method: 'POST',
      body: JSON.stringify(chapitre.questions.map((q, i) => ({
        quiz_id: quiz.id,
        position: i + 1,
        prompt: q.prompt,
        options: q.options,
        correct_index: q.correct_index,
        explanation: q.explanation,
      }))),
    })

    console.log(`  + ${titre} (${chapitre.questions.length} questions)`)
    créés++
    questionsÉcrites += chapitre.questions.length
  }
}

console.log(`\n${DRY_RUN ? '[essai à blanc] ' : ''}QCM créés : ${créés} | déjà en place : ${ignorés} | questions : ${questionsÉcrites}`)
