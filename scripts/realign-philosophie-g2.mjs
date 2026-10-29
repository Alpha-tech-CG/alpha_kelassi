/**
 * Réalignement de la matière PHILOSOPHIE — Terminale G2.
 *
 * Les six chapitres du programme avaient été saisis comme six leçons « cours »
 * empilées dans un seul chapitre, « chapitre 1: qu'est ce que la philosophie? ».
 * Pour l'élève, cinq chapitres sur six étaient donc invisibles en tant que
 * chapitres : il fallait ouvrir le chapitre 1 pour les trouver.
 *
 * Ce script rend à chaque chapitre son existence propre :
 *   - renomme le chapitre 1 et lui laisse la leçon du chapitre I ;
 *   - crée les chapitres II à VI et y déplace la leçon correspondante ;
 *   - renumérote l'ensemble et rattache les chapitres à la série G2.
 *
 * Aucune leçon n'est dupliquée ni supprimée : elles changent de parent.
 * L'état précédent est sauvegardé dans `scripts/.backup-philosophie-g2-*.json`.
 *
 * Usage :
 *   node scripts/realign-philosophie-g2.mjs --dry-run
 *   node scripts/realign-philosophie-g2.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
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

const SUBJECT_PHILO_G2 = '60910560-ec2b-485f-82d0-2d587b71a39d'
const SERIES_G2 = 'ef1a3bef-4d82-4f8a-a483-57c57a02248a'
const CHAPTER_FOURRE_TOUT = '2ece8702-ae10-4c22-be90-85ded7aecfc8'

/** Chapitre « Les relations Nord-Sud » : contenu de géographie rangé ici par erreur. */
const CHAPTER_NORD_SUD_EGARE = 'a4585677-d058-45e6-bddd-bd7efa9116dd'

/**
 * Les six chapitres du programme, dans l'ordre. `lesson` est l'identifiant de
 * la leçon actuellement empilée dans le chapitre fourre-tout.
 */
const PROGRAMME = [
  { lesson: '1efe2203-a34d-4074-80ee-017635a268a0', title: 'Chapitre I — Qu’est-ce que la philosophie ?', keepInPlace: true },
  { lesson: 'c8c1b87f-6af8-4400-b7d9-0418d64f9ed9', title: 'Chapitre II — Le sujet et le monde' },
  { lesson: '3b8f49db-be86-402f-bf9e-5fc464b9a6c5', title: 'Chapitre III — La connaissance' },
  { lesson: 'dd5ed521-0f51-4fe8-b58d-8cb9766fa80b', title: 'Chapitre IV — La pratique et les fins' },
  { lesson: 'a92635c1-8c1f-4930-96fe-6fa096ba0a2c', title: 'Chapitre V — L’histoire' },
  { lesson: '6f573f96-4e00-4c48-808c-498f6764e04c', title: 'Chapitre VI — L’État et le pouvoir' },
]

const backup = []
const tag = DRY_RUN ? '[dry-run] ' : ''

/* ── Garde-fous ─────────────────────────────────────────────────────────── */
const [subject] = await sb(`/subjects?select=id,name,level&id=eq.${SUBJECT_PHILO_G2}`)
if (!subject) throw new Error('Matière introuvable.')
if (subject.level !== 'bac_g2' || !/philosoph/i.test(subject.name)) {
  throw new Error(`Matière inattendue : « ${subject.name} » (${subject.level}). Abandon.`)
}
console.log(`Matière : ${subject.name} — ${subject.level}\n`)

const stacked = await sb(`/lessons?select=id,chapter_id,type,title,content,order_index&chapter_id=eq.${CHAPTER_FOURRE_TOUT}&order=order_index`)
console.log(`Chapitre fourre-tout : ${stacked.length} leçon(s) empilée(s).`)
for (const step of PROGRAMME) {
  const l = stacked.find((x) => x.id === step.lesson)
  if (!l) throw new Error(`Leçon ${step.lesson} absente du chapitre fourre-tout. Structure inattendue, abandon.`)
  const head = (l.content || '').replace(/\s+/g, ' ').slice(0, 70)
  console.log(`  · « ${l.title} » → « ${step.title} »`)
  console.log(`      début du texte : ${head}…`)
}
const orphans = stacked.filter((l) => !PROGRAMME.some((s) => s.lesson === l.id))
if (orphans.length) {
  console.log(`\n⚠ ${orphans.length} leçon(s) non prévue(s) resteront dans le chapitre I :`)
  orphans.forEach((l) => console.log(`  · ${l.type} « ${l.title} »`))
}
console.log()

/* ── Réalignement ───────────────────────────────────────────────────────── */
for (const [i, step] of PROGRAMME.entries()) {
  let chapterId

  if (step.keepInPlace) {
    const [ch] = await sb(`/chapters?select=id,title,order_index&id=eq.${CHAPTER_FOURRE_TOUT}`)
    backup.push({ table: 'chapters', id: ch.id, before: { title: ch.title, order_index: ch.order_index } })
    console.log(`${tag}chapitre : « ${ch.title} » → « ${step.title} » (ordre ${ch.order_index} → ${i})`)
    if (!DRY_RUN) {
      await sb(`/chapters?id=eq.${CHAPTER_FOURRE_TOUT}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: step.title, order_index: i, series_id: SERIES_G2 }),
      })
    }
    chapterId = CHAPTER_FOURRE_TOUT
  } else {
    const found = await sb(`/chapters?select=id&subject_id=eq.${SUBJECT_PHILO_G2}&title=eq.${encodeURIComponent(step.title)}`)
    if (found.length) {
      chapterId = found[0].id
      console.log(`${tag}chapitre : « ${step.title} » existe déjà (${chapterId})`)
    } else {
      console.log(`${tag}chapitre : CRÉATION « ${step.title} » (ordre ${i})`)
      if (!DRY_RUN) {
        const [created] = await sb('/chapters', {
          method: 'POST',
          body: JSON.stringify({ subject_id: SUBJECT_PHILO_G2, series_id: SERIES_G2, title: step.title, order_index: i }),
        })
        chapterId = created.id
        console.log(`            → ${chapterId}`)
      }
    }
  }

  // La leçon suit son chapitre, et prend son titre.
  const [lesson] = await sb(`/lessons?select=id,chapter_id,title,order_index&id=eq.${step.lesson}`)
  backup.push({ table: 'lessons', id: lesson.id, before: { chapter_id: lesson.chapter_id, title: lesson.title, order_index: lesson.order_index } })
  console.log(`${tag}  leçon « ${lesson.title} » → chapitre ${chapterId ?? '(non créé en dry-run)'}`)
  if (!DRY_RUN && chapterId) {
    await sb(`/lessons?id=eq.${step.lesson}`, {
      method: 'PATCH',
      body: JSON.stringify({ chapter_id: chapterId, title: step.title, order_index: 0 }),
    })
  }
}

/* ── Le chapitre de géographie égaré passe en fin de liste ──────────────── */
const [egare] = await sb(`/chapters?select=id,title,order_index&id=eq.${CHAPTER_NORD_SUD_EGARE}`)
if (egare) {
  const last = PROGRAMME.length
  backup.push({ table: 'chapters', id: egare.id, before: { order_index: egare.order_index } })
  console.log(`\n${tag}« ${egare.title} » (contenu de géographie) : ordre ${egare.order_index} → ${last}, placé en fin de liste.`)
  console.log('   Il n’est PAS supprimé : géographie possède déjà ce chapitre, à toi de trancher.')
  if (!DRY_RUN) {
    await sb(`/chapters?id=eq.${egare.id}`, { method: 'PATCH', body: JSON.stringify({ order_index: last }) })
  }
}

/* ── Sauvegarde ─────────────────────────────────────────────────────────── */
if (!DRY_RUN && backup.length) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const file = join(__dirname, `.backup-philosophie-g2-${stamp}.json`)
  writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8')
  console.log(`\nSauvegarde de l'état précédent : ${file}`)
}

console.log(DRY_RUN ? '\nDry-run terminé — aucune écriture.' : '\nTerminé.')
