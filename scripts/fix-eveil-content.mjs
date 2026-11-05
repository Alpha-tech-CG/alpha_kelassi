/**
 * Remplace le contenu QCM "Éveil" (Questions de cours CEPE) inséré précédemment
 * (basé sur une recherche web) par le corrigé OFFICIEL trouvé dans
 * exercecognix01.md, et ajoute le sujet CEPE 2005 qui manquait.
 *
 * Usage : node scripts/fix-eveil-content.mjs [--dry-run]
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
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

async function sb(path, init) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
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

const SCRATCHPAD = 'C:/Users/miche/AppData/Local/Temp/claude/D--alpha-kelassi-new/e14b1709-c92a-401a-a7b0-afd9aea3502d/scratchpad'
const { eveilQuizzes } = await import(`file:///${SCRATCHPAD}/eveil-corrected.mjs`)

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')

  const subj = await sb(`/rest/v1/subjects?name=eq.%C3%89veil&level=eq.cepe&select=id`)
  if (subj.length === 0) throw new Error('Matière "Éveil" introuvable — le premier seed doit avoir déjà tourné.')
  const subjectId = subj[0].id

  const existing = await sb(`/rest/v1/quizzes?subject_id=eq.${subjectId}&is_exam=eq.true&select=id,title`)
  console.log(`Anciens quiz "Éveil" trouvés : ${existing.length}`)
  for (const q of existing) {
    if (DRY_RUN) { console.log(`[dry-run] supprimerait "${q.title}"`); continue }
    await sb(`/rest/v1/quizzes?id=eq.${q.id}`, { method: 'DELETE' })
    console.log(`✗ Supprimé (ancien) : ${q.title}`)
  }

  for (const quiz of eveilQuizzes) {
    if (DRY_RUN) { console.log(`[dry-run] créerait "${quiz.title}" (${quiz.questions.length} questions)`); continue }
    const [created] = await sb('/rest/v1/quizzes', {
      method: 'POST',
      body: JSON.stringify({
        subject_id: subjectId,
        title: quiz.title,
        description: null,
        level: quiz.level,
        time_limit_sec: quiz.time_limit_sec,
        is_premium: false,
        is_exam: true,
        year: quiz.year ?? null,
      }),
    })
    const rows = quiz.questions.map((q, i) => ({
      quiz_id: created.id,
      position: i + 1,
      prompt: q.prompt,
      options: q.options,
      correct_index: q.correct_index,
      explanation: q.explanation ?? null,
    }))
    await sb('/rest/v1/quiz_questions', { method: 'POST', body: JSON.stringify(rows) })
    console.log(`✓ Créé : ${quiz.title} (${rows.length} questions)`)
  }

  console.log('\n=== Terminé ===')
}

main().catch((e) => { console.error('✗', e.message); process.exit(1) })
