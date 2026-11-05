/**
 * Seed du contenu CEPE — Éveil, priorité 2 du plan de migration :
 * crée les domaines "Histoire-Géographie" et "Éducation civique & santé" (enfants
 * d'Éveil via parent_subject_id, migration 044), avec de vrais chapitres
 * (cours + quiz + exercices guidés), en réutilisant les faits déjà vérifiés pour
 * les 130 questions "Questions de cours" des simulations.
 *
 * Usage : node scripts/seed-eveil-content.mjs [--dry-run]
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
const { domains, chapters } = await import(`file:///${SCRATCHPAD}/eveil-domains-content.mjs`)

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')

  const [eveil] = await sb(`/rest/v1/subjects?name=eq.%C3%89veil&level=eq.cepe&select=id`)
  if (!eveil) throw new Error('Matière "Éveil" (cepe) introuvable.')

  const domainIds = {}
  for (const d of domains) {
    const existing = await sb(`/rest/v1/subjects?name=eq.${encodeURIComponent(d.name)}&level=eq.cepe&select=id`)
    if (existing.length > 0) {
      domainIds[d.name] = existing[0].id
      console.log(`… domaine déjà présent : ${d.name}`)
      continue
    }
    if (DRY_RUN) { console.log(`[dry-run] créerait domaine "${d.name}"`); domainIds[d.name] = `dry-${d.name}`; continue }
    const [created] = await sb('/rest/v1/subjects', {
      method: 'POST',
      body: JSON.stringify({ name: d.name, level: 'cepe', country_code: 'CG', icon: d.icon, parent_subject_id: eveil.id, display_order: d.display_order }),
    })
    domainIds[d.name] = created.id
    console.log(`✓ Domaine créé : ${d.name}`)
  }

  for (const ch of chapters) {
    const subjectId = domainIds[ch.domain]
    const existingCh = DRY_RUN ? [] : await sb(`/rest/v1/chapters?subject_id=eq.${subjectId}&title=eq.${encodeURIComponent(ch.title)}&select=id`)
    if (existingCh.length > 0) { console.log(`… chapitre déjà présent : ${ch.domain} / ${ch.title}`); continue }

    if (DRY_RUN) { console.log(`[dry-run] créerait chapitre "${ch.title}" (${ch.domain}) — 2 leçons, ${ch.exercises.length} exercices`); continue }

    const [chapter] = await sb('/rest/v1/chapters', {
      method: 'POST',
      body: JSON.stringify({ subject_id: subjectId, title: ch.title, order_index: ch.order_index, description: null }),
    })

    await sb('/rest/v1/lessons', {
      method: 'POST',
      body: JSON.stringify([
        { chapter_id: chapter.id, type: 'cours', title: ch.title, content: ch.cours, order_index: 0, is_premium: false },
        { chapter_id: chapter.id, type: 'quiz', title: 'Quiz de révision', content: ch.quiz, order_index: 1, is_premium: false },
      ]),
    })

    for (let i = 0; i < ch.exercises.length; i++) {
      const ex = ch.exercises[i]
      const [created] = await sb('/rest/v1/exercises', {
        method: 'POST',
        body: JSON.stringify({ chapter_id: chapter.id, title: ex.title, statement: ex.statement, difficulty: 2, is_premium: false, order_index: i }),
      })
      await sb('/rest/v1/exercise_solutions', { method: 'POST', body: JSON.stringify({ exercise_id: created.id, solution: ex.solution }) })
    }

    console.log(`✓ Chapitre créé : ${ch.domain} / ${ch.title} (2 leçons, ${ch.exercises.length} exercices)`)
  }

  console.log('\n=== Terminé ===')
}

main().catch((e) => { console.error('✗', e.message); process.exit(1) })
