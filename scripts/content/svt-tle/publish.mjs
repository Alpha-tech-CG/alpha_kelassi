/**
 * Publie le cours de SVT Terminale C & D (polycopié « Programme officiel INRAP »
 * réécrit à notre façon, avec encadrés et schémas) :
 *  - Tle C (matière vide) : 4 chapitres créés ;
 *  - Tle D : 6 chapitres créés, 3 chapitres existants dont la leçon de cours est
 *    remplacée (résumés, QCM et exercices déjà en place conservés), ordre du programme.
 * Les schémas ({{img:clé|légende}}) viennent de schemas.json (upload-schemas.mjs).
 * Les exercices corrigés (exercices.mjs) vont dans l'espace Exercices.
 * Sauvegarde dans backups/ de tout ce qui est modifié. Relançable sans doublon.
 *
 * Usage : node scripts/content/svt-tle/publish.mjs [--dry-run]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { syncExercises } from '../../lib/exercises.mjs'
import { EXERCISES } from './exercices.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY = process.argv.includes('--dry-run')
const env = Object.fromEntries(readFileSync(join(__dirname, '..', '..', '..', 'apps', 'web', '.env.local'), 'utf-8').split('\n').filter(l => l.includes('=') && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const URL = env.NEXT_PUBLIC_SUPABASE_URL, KEY = env.SUPABASE_SERVICE_ROLE_KEY
async function sb(path, init) {
  const r = await fetch(`${URL}/rest/v1${path}`, { ...init, headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}`, Prefer: 'return=representation', ...(init?.headers ?? {}) } })
  const t = await r.text(); const j = t ? JSON.parse(t) : null
  if (!r.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> ${r.status}: ${JSON.stringify(j).slice(0, 300)}`)
  return j
}

const SVT_C = '226d7765-dfeb-4e56-aefa-aec9cb467d79'
const SVT_D = 'a9987cc5-6d4c-4b9f-8dc7-2679cae32e59'
const TITLES = {
  'divisions-cellulaires': 'Les divisions cellulaires : mitose et méiose',
  'reproduction-animaux': 'La reproduction chez les animaux',
  'reproduction-homme': "La reproduction chez l'Homme",
  'reproduction-vegetaux': 'La reproduction chez les végétaux supérieurs',
  'systeme-nerveux': 'Le système nerveux et les fonctions de relation',
  'activite-cardiaque': "L'activité cardiaque",
  'genetique': 'La génétique',
  'immunologie': "L'immunologie",
  'cartographie-tectonique': 'Cartographie géologique et tectonique globale',
  'ressources-geologiques': "Les ressources géologiques et l'aménagement",
  'ecologie': "L'écologie",
}
const DESCRIPTIONS = {
  'divisions-cellulaires': 'Chromosomes, cycle cellulaire, mitose, méiose et brassage génétique.',
  'reproduction-animaux': 'Appareils génitaux, gamétogenèse, fécondation et développement embryonnaire.',
  'reproduction-homme': 'Puberté, cycles de la femme, commande hormonale, grossesse et maîtrise de la procréation.',
  'reproduction-vegetaux': 'La fleur, la pollinisation, la double fécondation, la graine et la germination.',
  'systeme-nerveux': 'Neurone, message nerveux, synapse, réflexes et intégration nerveuse.',
  'activite-cardiaque': 'Structure du cœur, révolution cardiaque, automatisme et régulation.',
  'genetique': 'Lois de Mendel, gènes liés, hérédité humaine et génétique des populations.',
  'immunologie': 'Soi et non-soi, immunité innée et acquise, VIH, vaccination.',
  'cartographie-tectonique': 'Cartes et coupes géologiques, structure de la Terre, tectonique des plaques.',
  'ressources-geologiques': 'Minerais, pétrole, géologie et aménagement, environnement.',
  'ecologie': 'Écosystèmes, facteurs écologiques, chaînes alimentaires, cycles de la matière.',
}

// Tle C : programme INRAP OG1 → OG4.
const PLAN_C = ['divisions-cellulaires', 'reproduction-animaux', 'systeme-nerveux', 'genetique']
// Tle D : OG1 → OG10, puis les annales. `existing` = chapitre déjà en place (on remplace sa leçon de cours).
const PLAN_D = [
  { slug: 'cartographie-tectonique' },
  { slug: 'ressources-geologiques', existing: '0d6e3b38-ff47-4112-b684-3bb042ed141d', lessonTitle: /^(Étude des connaissances géologiques|Les ressources géologiques)/ },
  { slug: 'ecologie' },
  { slug: 'divisions-cellulaires' },
  { slug: 'reproduction-homme', existing: '1aab3a10-89f8-4a9f-abf8-d391ba24fe88' },
  { slug: 'reproduction-vegetaux' },
  { slug: 'activite-cardiaque' },
  { slug: 'genetique', existing: '2b18fc0d-9212-4eef-97c0-6271797e37a5', rename: true },
  { slug: 'immunologie' },
  { slug: null, existing: '309a203a-6d67-4e9f-bce9-d268827bea15' }, // Annales SVT : en dernier
]

const SCHEMAS = JSON.parse(readFileSync(join(__dirname, 'schemas.json'), 'utf8'))
// Noms d'auteurs que le champ « Artist » de Commons ne permet pas d'extraire proprement.
const AUTHORS = { 'res-hydro': 'Savant-fou', 'nerf-synapse2': 'Christy Krames (NIH)' }
function credit(s, key) {
  // Nom d'auteur lisible à partir du champ « Artist » de Commons (souvent bavard).
  let a = s.author.replace(/&amp;/g, '&')
    .replace(/^(Courtesy:\s*|Par\s+|User:)/i, '')
    .replace(/^[^\s:]+\.(svg|png|jpe?g):\s*/i, '')
    .replace(/^The original uploader was (.+?) at .*$/i, '$1')
  a = a.split(/\n|derivative|Original|File:|Translation|translat/i)[0]
    .replace(/\s\d{1,2}:\d{2}.*$/, '')
    .replace(/[;:,.\s]+$/, '').trim()
  if (a.length > 60) a = a.split(/\),\s*|,\s*/)[0].replace(/\($/, '').trim() + (a.includes('(') && !a.split(/\),/)[0].includes(')') ? ')' : '') + ' et al.'
  if (!a || /machine-readable|unknown/i.test(a)) a = 'contributeurs de Wikimedia Commons'
  if (AUTHORS[key]) a = AUTHORS[key]
  return `Schéma : ${a} — ${s.license}, via [Wikimedia Commons](${s.page})`
}
function render(slug) {
  const md = readFileSync(join(__dirname, `${slug}.md`), 'utf8')
  return md.replace(/\{\{img:([a-z0-9-]+)\|([^}]+)\}\}/g, (_, key, caption) => {
    const s = SCHEMAS[key]
    if (!s) throw new Error(`Schéma inconnu : ${key} (${slug})`)
    return `![${caption.replace(/[[\]]/g, '')}](${s.url})\n\n*${caption}*  \n<small>${credit(s, key)}</small>`
  }).trim() + '\n'
}

const backup = { chapters: [], lessons: [] }
const tag = DRY ? '[dry-run] ' : ''

async function ensureChapter(subject, slug, order) {
  const title = TITLES[slug]
  const [found] = await sb(`/chapters?select=id,title,order_index&subject_id=eq.${subject}&title=eq.${encodeURIComponent(title)}`)
  if (found) {
    if (found.order_index !== order && !DRY) await sb(`/chapters?id=eq.${found.id}`, { method: 'PATCH', body: JSON.stringify({ order_index: order }) })
    return found.id
  }
  console.log(`${tag}  + chapitre « ${title} »`)
  if (DRY) return null
  const [row] = await sb('/chapters', { method: 'POST', body: JSON.stringify({ subject_id: subject, title, order_index: order, description: DESCRIPTIONS[slug] }) })
  return row.id
}

async function upsertCourse(chapterId, slug, lessonTitle) {
  const content = render(slug)
  const duration = Math.max(15, Math.round(content.length / 900) * 5)
  if (!chapterId) { console.log(`${tag}    leçon « ${TITLES[slug]} » (${content.length} car.)`); return }
  const lessons = await sb(`/lessons?select=id,title,type,content,order_index&chapter_id=eq.${chapterId}&type=eq.cours&order=order_index`)
  const target = lessonTitle ? lessons.find((l) => lessonTitle.test(l.title)) : lessons[0]
  if (!target) {
    console.log(`${tag}    + leçon « ${TITLES[slug]} » (${content.length} car.)`)
    if (!DRY) await sb('/lessons', { method: 'POST', body: JSON.stringify({ chapter_id: chapterId, type: 'cours', title: TITLES[slug], content, order_index: 1, duration_min: duration, is_premium: false }) })
    return
  }
  if (target.content === content) { console.log(`    leçon à jour`); return }
  backup.lessons.push(target)
  console.log(`${tag}    leçon « ${target.title} » : ${target.content?.length ?? 0} → ${content.length} car.`)
  if (!DRY) await sb(`/lessons?id=eq.${target.id}`, { method: 'PATCH', body: JSON.stringify({ title: TITLES[slug], content, duration_min: duration }) })
}

async function exercises(chapterId, slug) {
  const list = (EXERCISES[slug] ?? []).map((e, i) => ({ ...e, order_index: 100 + i }))
  await syncExercises(sb, chapterId, list, { dryRun: DRY, backup: backup.lessons, indent: '    ' })
}

console.log(DRY ? '=== DRY RUN ===' : '=== PUBLICATION SVT Tle C & D ===')
console.log('Tle C')
for (const [i, slug] of PLAN_C.entries()) {
  const id = await ensureChapter(SVT_C, slug, i)
  console.log(`  ${i}. ${TITLES[slug]}`)
  await upsertCourse(id, slug)
  await exercises(id, slug)
}
console.log('Tle D')
for (const [i, step] of PLAN_D.entries()) {
  if (step.existing) {
    const [ch] = await sb(`/chapters?select=id,title,order_index&id=eq.${step.existing}`)
    if (!ch) throw new Error(`Chapitre D introuvable : ${step.existing}`)
    backup.chapters.push(ch)
    const patch = { order_index: i }
    if (step.rename) { patch.title = TITLES[step.slug]; patch.description = DESCRIPTIONS[step.slug] }
    console.log(`  ${i}. ${patch.title ?? ch.title.trim()} (existant)`)
    if (!DRY) await sb(`/chapters?id=eq.${ch.id}`, { method: 'PATCH', body: JSON.stringify(patch) })
    if (step.slug) { await upsertCourse(ch.id, step.slug, step.lessonTitle); await exercises(ch.id, step.slug) }
    continue
  }
  const id = await ensureChapter(SVT_D, step.slug, i)
  console.log(`  ${i}. ${TITLES[step.slug]}`)
  await upsertCourse(id, step.slug)
  await exercises(id, step.slug)
}

if (!DRY && (backup.lessons.length || backup.chapters.length)) {
  mkdirSync(join(__dirname, 'backups'), { recursive: true })
  const file = join(__dirname, 'backups', `avant-publication-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  writeFileSync(file, JSON.stringify(backup, null, 1))
  console.log(`Sauvegarde : ${file}`)
}
