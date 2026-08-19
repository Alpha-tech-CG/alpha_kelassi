/**
 * Seed du contenu Physique Terminale C & D (programme commun) — source : manuel
 * "Annale de Physique Terminale C" (Chaambane). Insère, pour chaque chapitre déjà
 * créé dans les matières Physique-Chimie bac_c et bac_d, une leçon `cours`
 * (Markdown + LaTeX/KaTeX), et — quand fournis — des exercices + corrigés.
 *
 * Idempotent : ne réécrit pas une leçon `cours` déjà présente pour un chapitre.
 * Usage : node scripts/seed-physique-tc-td.mjs [--dry-run]
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

// Les deux matières Physique-Chimie (programme commun C/D)
const SUBJECTS = [
  'c49ea7e8-ea84-44d9-9c96-bbe8d1d808b7', // bac_c
  '8de4ee7e-493f-4955-a5db-4d0aad96e8f1', // bac_d
]

const SCRATCHPAD = 'C:/Users/miche/AppData/Local/Temp/claude/D--alpha-kelassi-new/d65a7a4b-e2b1-4aea-9d43-fd02752e61eb/scratchpad'
const { chapters } = await import(`file:///${SCRATCHPAD}/physique-tc-content.mjs`)

// Attache à chaque chapitre (par ordre) ses exercices extraits par Gemini (exos-<idx>.json).
import { readFileSync as _rf, existsSync as _ex } from 'fs'
chapters.forEach((ch, i) => {
  const p = `${SCRATCHPAD}/exos-${i}.json`
  if (_ex(p)) {
    try {
      const exos = JSON.parse(_rf(p, 'utf-8'))
      ch.exercices = exos.map((e) => ({ title: e.title, statement: e.statement, solution: e.solution, difficulty: 2 }))
    } catch { /* ignore */ }
  }
})

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')
  let coursN = 0, exoN = 0

  for (const subjectId of SUBJECTS) {
    for (const ch of chapters) {
      const [chapter] = await sb(`/rest/v1/chapters?subject_id=eq.${subjectId}&title=eq.${encodeURIComponent(ch.title)}&select=id`)
      if (!chapter) { console.log(`⚠ chapitre introuvable (${subjectId.slice(0,4)}) : ${ch.title}`); continue }

      // Leçon cours (idempotent)
      const existingCours = await sb(`/rest/v1/lessons?chapter_id=eq.${chapter.id}&type=eq.cours&select=id`)
      if (existingCours.length === 0 && ch.cours) {
        if (DRY_RUN) { console.log(`[dry-run] cours → ${ch.title}`) }
        else {
          await sb('/rest/v1/lessons', { method: 'POST', body: JSON.stringify({
            chapter_id: chapter.id, type: 'cours', title: ch.title, content: ch.cours, order_index: 0, is_premium: false,
          }) })
          coursN++
        }
      }

      // Exercices + corrigés (idempotent par titre)
      for (let i = 0; i < (ch.exercices ?? []).length; i++) {
        const ex = ch.exercices[i]
        const existingEx = await sb(`/rest/v1/exercises?chapter_id=eq.${chapter.id}&title=eq.${encodeURIComponent(ex.title)}&select=id`)
        if (existingEx.length > 0) continue
        if (DRY_RUN) { console.log(`[dry-run] exo → ${ch.title} / ${ex.title}`); continue }
        const [created] = await sb('/rest/v1/exercises', { method: 'POST', body: JSON.stringify({
          chapter_id: chapter.id, title: ex.title, statement: ex.statement,
          difficulty: ex.difficulty ?? 2, is_premium: false, order_index: i,
        }) })
        if (ex.solution) await sb('/rest/v1/exercise_solutions', { method: 'POST', body: JSON.stringify({ exercise_id: created.id, solution: ex.solution }) })
        exoN++
      }
      console.log(`✓ ${subjectId.slice(0,4)} / ${ch.title}`)
    }
  }
  console.log(`\n=== Terminé — ${coursN} cours, ${exoN} exercices insérés ===`)
}

main().catch((e) => { console.error('✗', e.message); process.exit(1) })
