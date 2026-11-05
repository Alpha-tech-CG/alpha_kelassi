/**
 * Seed des ANNALES ET SUJETS TYPE BAC — Terminales techniques G2, G3 et BG.
 *
 * Source : sujets d'examens officiels photographiés (bacs, bacs blancs, prépa-bacs,
 * compositions et travaux dirigés — République du Congo), transcrits puis répartis par
 * matière. Les énoncés sont fidèles ; les corrigés sont « méthode détaillée + calculs
 * quand l'énoncé est complet », et signalent (⚠️) les données manquantes sur la photo.
 *
 * Chaque sujet est publié dans l'espace « Exercices » de la matière concernée, dans un
 * chapitre « Annales et sujets type bac ». Le TYPE d'épreuve est porté par le titre :
 *   - « Bac rouge … »  = annale officielle (examen du baccalauréat) ;
 *   - « Bac blanc … »  = simulation (bac blanc / prépa-bac) ;
 *   - « Test … »       = composition, devoir, évaluation ou travail dirigé.
 *
 * Les matières sont résolues par (niveau, nom) et créées si absentes (track_type
 * « technique »). Les chapitres sont rattachés à la série du niveau. Idempotent : un
 * exercice dont le titre existe déjà dans le chapitre n'est pas recréé ; rien n'est
 * supprimé.
 *
 * Usage :
 *   node scripts/seed-annales-bac-g.mjs --dry-run
 *   node scripts/seed-annales-bac-g.mjs
 *   node scripts/seed-annales-bac-g.mjs --matiere=maths-financieres     (un seul module)
 *   node scripts/seed-annales-bac-g.mjs --level=bac_g3                   (une seule série)
 */
import { readFileSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'
import { syncExercises } from './lib/exercises.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
const ONLY_LEVEL = process.argv.find((a) => a.startsWith('--level='))?.slice('--level='.length)
const ONLY_MAT = process.argv.find((a) => a.startsWith('--matiere='))?.slice('--matiere='.length)

const MODULES = ['maths-financieres', 'comptabilite', 'techniques-commerciales', 'vie-entreprise']
const SERIES = {
  bac_g2: 'ef1a3bef-4d82-4f8a-a483-57c57a02248a',
  bac_g3: '73c62a1b-1df0-4080-a297-8cedb2f71a5a',
  bac_bg: 'b2a0a771-e218-48e8-a6f3-d79f468e9f3d',
}

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }),
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

/** Résout (ou crée) une matière pour un niveau donné. Renvoie son id (ou null en dry-run si absente). */
async function resolveSubject({ subject, match, level }) {
  const found = await sb(`/subjects?select=id,name&level=eq.${level}&name=ilike.${encodeURIComponent(match)}`)
  if (found.length > 1) throw new Error(`${found.length} matières « ${subject} » en ${level} : à dédoublonner d'abord (${found.map((f) => f.name).join(', ')}).`)
  if (found[0]) { console.log(`${tag}    matière « ${found[0].name} » (${found[0].id})`); return found[0].id }
  console.log(`${tag}    matière « ${subject} » : CRÉATION`)
  if (DRY_RUN) return null
  const [created] = await sb('/subjects', {
    method: 'POST',
    body: JSON.stringify({ name: subject, level, track_type: 'technique', country_code: 'CG', display_order: 0 }),
  })
  console.log(`      → ${created.id}`)
  return created.id
}

/** Résout (ou crée) le chapitre d'annales d'une matière/niveau. */
async function resolveChapter(subjectId, level, chapterTitle, description) {
  const existing = await sb(`/chapters?select=id&subject_id=eq.${subjectId}&title=eq.${encodeURIComponent(chapterTitle)}`)
  if (existing[0]) return existing[0].id
  if (DRY_RUN) { console.log(`${tag}    chapitre « ${chapterTitle} » : créerait`); return null }
  const [last] = await sb(`/chapters?subject_id=eq.${subjectId}&select=order_index&order=order_index.desc&limit=1`)
  const [created] = await sb('/chapters', {
    method: 'POST',
    body: JSON.stringify({
      subject_id: subjectId, series_id: SERIES[level],
      title: chapterTitle, description: description ?? null, order_index: (last?.order_index ?? 0) + 1,
    }),
  })
  console.log(`${tag}    chapitre « ${chapterTitle} » créé`)
  return created.id
}

let total = 0
const backup = []

async function run() {
  const mods = ONLY_MAT ? MODULES.filter((m) => m === ONLY_MAT) : MODULES
  if (!mods.length) throw new Error(`Module inconnu : ${ONLY_MAT} (attendu : ${MODULES.join(', ')}).`)

  for (const m of mods) {
    const { BLOCS } = await import(pathToFileURL(join(__dirname, 'content', 'annales-bac-g', `${m}.mjs`)).href)
    console.log(`\n=== ${m} (${BLOCS.length} bloc(s)) ===`)
    for (const b of BLOCS) {
      const levels = (ONLY_LEVEL ? b.levels.filter((l) => l === ONLY_LEVEL) : b.levels)
      for (const level of levels) {
        if (!SERIES[level]) throw new Error(`Niveau inconnu : ${level}`)
        console.log(`\n■ ${b.subject} — ${level} — « ${b.chapterTitle} » (${b.exercises.length} sujet(s))`)
        const subjectId = await resolveSubject({ subject: b.subject, match: b.match, level })
        const chapterId = subjectId ? await resolveChapter(subjectId, level, b.chapterTitle, b.description) : null
        const exercises = b.exercises.map((e, i) => ({ difficulty: e.difficulty ?? 3, order_index: i, ...e }))
        await syncExercises(sb, chapterId, exercises, { dryRun: DRY_RUN, backup })
        total += exercises.length
      }
    }
  }
}

console.log(DRY_RUN ? '=== DRY RUN (aucune écriture) ===' : '=== Écriture en base ===')
await run()
console.log(`\n=== Terminé : ${total} sujet(s) traité(s)${DRY_RUN ? ' (dry-run)' : ''}. ===`)
