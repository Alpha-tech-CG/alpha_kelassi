/**
 * Seed des SUJETS INÉDITS COGNIX de la Prépa (migration 074, origin = 'genere').
 *
 * Un sujet généré reprend la structure et les notions d'un sujet réel déjà en base
 * (`inspiredBy`, titre exact d'un exercice de la même matière) et pose les mêmes questions
 * autrement : autres données, autre contexte. Les simulations de la Prépa alternent sujet
 * réel et sujet généré (voir `pickSimulationPaper`, apps/web/src/lib/prepa.ts).
 *
 * Modules : scripts/content/sujets-generes/*.mjs, même format que les annales
 * (BLOCS = [{ subject, levels, chapterTitle, description, exercises }]) avec, par sujet,
 * `inspiredBy` (titre, ou { niveau: titre } quand le sujet sert à plusieurs séries) et
 * `exam: { exam_kind, duration_min, bareme }`.
 *
 * Les matières sont résolues par (niveau, nom exact) et ne sont jamais créées.
 * Idempotent (titre) ; rien n'est supprimé.
 *
 * Usage : node scripts/seed-sujets-generes.mjs [--dry-run] [--module=maths]
 */
import { readFileSync, readdirSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'
import { syncExercises } from './lib/exercises.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const CONTENT = join(__dirname, 'content', 'sujets-generes')
const DRY_RUN = process.argv.includes('--dry-run')
const ONLY = process.argv.find((a) => a.startsWith('--module='))?.slice('--module='.length)

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trimStart().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] }),
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) throw new Error('NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans apps/web/.env.local')

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

const tag = DRY_RUN ? '[dry-run] ' : ''

async function resolveSubject(name, level) {
  const found = await sb(`/subjects?select=id&level=eq.${level}&name=eq.${encodeURIComponent(name)}`)
  if (found.length !== 1) throw new Error(`Matière « ${name} » (${level}) : ${found.length} trouvée(s), attendu 1. Rien n'est créé.`)
  return found[0].id
}

async function resolveChapter(subjectId, title, description) {
  const existing = await sb(`/chapters?select=id&subject_id=eq.${subjectId}&title=eq.${encodeURIComponent(title)}`)
  if (existing[0]) return existing[0].id
  if (DRY_RUN) { console.log(`${tag}    chapitre « ${title} » : créerait`); return null }
  const [last] = await sb(`/chapters?subject_id=eq.${subjectId}&select=order_index&order=order_index.desc&limit=1`)
  const [created] = await sb('/chapters', {
    method: 'POST',
    body: JSON.stringify({ subject_id: subjectId, title, description: description ?? null, order_index: (last?.order_index ?? -1) + 1 }),
  })
  console.log(`    chapitre « ${title} » créé`)
  return created.id
}

/** Sujet réel de la même matière dont le sujet généré s'inspire (titre exact). */
async function resolveInspiration(subjectId, title) {
  const rows = await sb(`/exercises?select=id,chapters!inner(subject_id)&chapters.subject_id=eq.${subjectId}&title=eq.${encodeURIComponent(title)}&origin=eq.reel`)
  if (rows.length !== 1) throw new Error(`Sujet d'inspiration « ${title} » : ${rows.length} trouvé(s) dans la matière, attendu 1.`)
  return rows[0].id
}

const modules = readdirSync(CONTENT).filter((f) => f.endsWith('.mjs')).map((f) => f.slice(0, -4))
const selected = ONLY ? modules.filter((m) => m === ONLY) : modules
if (!selected.length) throw new Error(`Module inconnu : ${ONLY} (disponibles : ${modules.join(', ')}).`)

console.log(DRY_RUN ? '=== DRY RUN (aucune écriture) ===' : '=== Écriture en base ===')
let total = 0
const backup = []
for (const m of selected) {
  const { BLOCS } = await import(pathToFileURL(join(CONTENT, `${m}.mjs`)).href)
  console.log(`\n=== ${m} ===`)
  for (const b of BLOCS) {
    for (const level of b.levels) {
      console.log(`■ ${b.subject} — ${level} — « ${b.chapterTitle} » (${b.exercises.length} sujet(s))`)
      const subjectId = await resolveSubject(b.subject, level)
      const chapterId = await resolveChapter(subjectId, b.chapterTitle, b.description)
      const exercises = b.exercises.map((e, i) => ({
        title: e.title, statement: e.statement, solution: e.solution, difficulty: 3, order_index: (b.orderStart ?? 0) + i,
      }))
      // Vérifie les inspirations avant toute écriture.
      const inspirations = []
      for (const e of b.exercises) inspirations.push(await resolveInspiration(subjectId, typeof e.inspiredBy === 'string' ? e.inspiredBy : e.inspiredBy[level]))
      await syncExercises(sb, chapterId, exercises, { dryRun: DRY_RUN, backup })
      if (chapterId && !DRY_RUN) {
        for (const [i, e] of b.exercises.entries()) {
          // Les parties de physique-chimie (8 et 12 points) sont notées sur leur propre total.
          await sb(`/exercises?chapter_id=eq.${chapterId}&title=eq.${encodeURIComponent(e.title)}`, {
            method: 'PATCH',
            headers: { Prefer: 'return=minimal' },
            body: JSON.stringify({ ...e.exam, origin: 'genere', variant_of: inspirations[i], exam_year: null }),
          })
        }
        console.log(`      champs d'épreuve posés (origin = genere)`)
      }
      total += exercises.length
    }
  }
}
console.log(`\n=== Terminé : ${total} sujet(s) traité(s)${DRY_RUN ? ' (dry-run)' : ''}. ${backup.length} mise(s) à jour. ===`)
