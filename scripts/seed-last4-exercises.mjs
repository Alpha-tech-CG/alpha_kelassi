/**
 * Priorité 5 du plan de migration CEPE (uniformisation Exercices) — lot 4 (dernier) :
 * ajoute 2 exercices guidés par chapitre pour Initiation à la production (11),
 * Technologie (6), Chimie (4) et Science-physique (3).
 *
 * Usage : node scripts/seed-last4-exercises.mjs [--dry-run]
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
const { exercisesByChapter } = await import(`file:///${SCRATCHPAD}/last4-exercises.mjs`)

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')
  let created = 0

  for (const [chapterId, exs] of Object.entries(exercisesByChapter)) {
    const existing = await sb(`/rest/v1/exercises?chapter_id=eq.${chapterId}&select=id`)
    if (existing.length > 0) { console.log(`… déjà des exercices pour ${chapterId}, ignoré`); continue }

    if (DRY_RUN) { console.log(`[dry-run] créerait ${exs.length} exercices pour chapitre ${chapterId}`); continue }

    for (let i = 0; i < exs.length; i++) {
      const ex = exs[i]
      const [ins] = await sb('/rest/v1/exercises', {
        method: 'POST',
        body: JSON.stringify({ chapter_id: chapterId, title: ex.title, statement: ex.statement, difficulty: 2, is_premium: false, order_index: i }),
      })
      await sb('/rest/v1/exercise_solutions', { method: 'POST', body: JSON.stringify({ exercise_id: ins.id, solution: ex.solution }) })
      created++
    }
    console.log(`✓ ${exs.length} exercices créés pour chapitre ${chapterId}`)
  }

  console.log(`\n=== Terminé — ${created} exercices créés ===`)
}

main().catch((e) => { console.error('✗', e.message); process.exit(1) })
