/**
 * Seed du cours de COMPTABILITÉ GÉNÉRALE — Terminale BG.
 *
 * Source : cahier de cours manuscrit (100 pages photographiées, année
 * 2023-2024), transcrit, relu puis figé dans
 * `scripts/content/comptabilite-generale-bg.md`. La relecture a refait les
 * calculs et corrigé les erreurs de recopie du cahier ; les écritures et
 * tableaux laissés en blanc ont été complétés selon les règles du cours.
 *
 * Le cahier ne couvre que deux des sept chapitres du programme. La matière
 * « Comptabilité Financière » (polycopié METPFQE) existe déjà en BG : ce cours
 * est installé dans une matière distincte, sans y toucher.
 *
 * Idempotent : ne crée que ce qui manque, ne supprime rien, et sauvegarde
 * dans `scripts/.backup-comptabilite-generale-bg-*.json` ce qu'il remplace.
 *
 * Usage :
 *   node scripts/seed-comptabilite-generale-bg.mjs --dry-run
 *   node scripts/seed-comptabilite-generale-bg.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { splitExercises, syncExercises } from './lib/exercises.mjs'

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

const SUBJECT = 'COMPTABILITÉ GÉNÉRALE'
const TARGET = { level: 'bac_bg', series: 'b2a0a771-e218-48e8-a6f3-d79f468e9f3d' }

const TITLES = [
  { title: 'Chapitre I — Acquisition et production d’immobilisations', description: 'Catégories d’immobilisations, coût d’achat et de production, acquisitions à titre onéreux ou gratuit, immobilisations en cours.' },
  { title: 'Chapitre II — Les amortissements', description: 'Amortissement linéaire, méthode SOFTY et dégressif fiscal : formules, plans d’amortissement et exercices corrigés.' },
]

/* ── Découpage ──────────────────────────────────────────────────────────── */

const source = readFileSync(join(__dirname, 'content', 'comptabilite-generale-bg.md'), 'utf-8')
const parts = source.split(/^## Chapitre \d+ — (.+)$/m)
// parts = [préambule, titre1, corps1, titre2, corps2, …]
const chapters = []
for (let k = 1; k < parts.length; k += 2) chapters.push({ heading: parts[k].trim(), body: parts[k + 1].trim() })
if (chapters.length !== TITLES.length) throw new Error(`${chapters.length} chapitre(s), ${TITLES.length} attendus.`)

const prepared = chapters.map((c, i) => {
  if (c.body.length < 1000) throw new Error(`Chapitre « ${c.heading} » suspicieusement court (${c.body.length} car.).`)
  // Le cours garde définitions, formules et méthodes ; les exercices vont dans l'espace Exercices.
  const { course, exercises } = splitExercises(c.body)
  return { ...TITLES[i], order: i, content: `## ${c.heading}\n\n${course.trim()}\n`, exercises }
})

console.log('Chapitres préparés :')
for (const c of prepared) console.log(`  ${c.order}. ${c.title} — ${c.content.length} car., ${c.exercises.length} exercice(s)`)
console.log()

/* ── Installation ───────────────────────────────────────────────────────── */

const backup = []
const tag = DRY_RUN ? '[dry-run] ' : ''

console.log(`■ ${TARGET.level}`)
// Tolère les variantes de saisie (casse, accents) d'une matière créée depuis la console.
const found = await sb(`/subjects?select=id,name&level=eq.${TARGET.level}&name=ilike.${encodeURIComponent('comptabilit* g*n*rale')}`)
if (found.length > 1) throw new Error(`${found.length} matières « comptabilité générale » en ${TARGET.level} : à dédoublonner d'abord.`)
let subjectId = found[0]?.id
if (subjectId) console.log(`${tag}  matière déjà présente : « ${found[0].name} » (${subjectId})`)
else {
  console.log(`${tag}  matière « ${SUBJECT} » : CRÉATION`)
  if (!DRY_RUN) {
    const [created] = await sb('/subjects', {
      method: 'POST',
      body: JSON.stringify({
        name: SUBJECT, level: TARGET.level, track_type: 'technique',
        country_code: 'CG', display_order: 0,
      }),
    })
    subjectId = created.id
    console.log(`      → ${subjectId}`)
  }
}

for (const ch of prepared) {
  if (!subjectId) {
    console.log(`${tag}  ${ch.title} : création`)
    await syncExercises(sb, null, ch.exercises, { dryRun: DRY_RUN, backup })
    continue
  }
  const existing = await sb(`/chapters?select=id&subject_id=eq.${subjectId}&title=eq.${encodeURIComponent(ch.title)}`)
  let chapterId = existing[0]?.id
  if (!chapterId) {
    console.log(`${tag}  ${ch.title} : chapitre créé`)
    if (DRY_RUN) { await syncExercises(sb, null, ch.exercises, { dryRun: DRY_RUN, backup }); continue }
    const [created] = await sb('/chapters', {
      method: 'POST',
      body: JSON.stringify({
        subject_id: subjectId, series_id: TARGET.series,
        title: ch.title, description: ch.description, order_index: ch.order,
      }),
    })
    chapterId = created.id
  }
  await syncExercises(sb, chapterId, ch.exercises, { dryRun: DRY_RUN, backup })

  const lessons = await sb(`/lessons?select=id,type,title,content&chapter_id=eq.${chapterId}&type=eq.cours`)
  if (lessons.length) {
    const l = lessons[0]
    if ((l.content ?? '') === ch.content) { console.log(`  ${ch.title} : à jour`); continue }
    backup.push({ table: 'lessons', id: l.id, before: l })
    console.log(`${tag}  ${ch.title} : cours mis à jour`)
    if (!DRY_RUN) {
      await sb(`/lessons?id=eq.${l.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: ch.title, content: ch.content, order_index: 0 }),
      })
    }
  } else {
    console.log(`${tag}  ${ch.title} : cours créé (${ch.content.length} car.)`)
    if (!DRY_RUN) {
      await sb('/lessons', {
        method: 'POST',
        body: JSON.stringify({
          chapter_id: chapterId, type: 'cours', title: ch.title,
          content: ch.content, order_index: 0, is_premium: false,
        }),
      })
    }
  }
}
console.log()

if (!DRY_RUN && backup.length) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const file = join(__dirname, `.backup-comptabilite-generale-bg-${stamp}.json`)
  writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8')
  console.log(`Sauvegarde de l'état précédent : ${file}`)
}

console.log(DRY_RUN ? 'Dry-run terminé — aucune écriture.' : 'Terminé.')
