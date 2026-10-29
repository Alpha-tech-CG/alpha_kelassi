/**
 * Seed du programme d'ÉCONOMIE — Terminale G2 (Techniques Administratives).
 *
 * Les chapitres I à IV existaient déjà en base, saisis à la main depuis la
 * console admin, mais de façon incomplète : deux chapitres sans aucune leçon,
 * un cours rangé par erreur dans un bloc « quiz », un chapitre resté nommé
 * « nlojnk », le chapitre V absent et son QCM accroché au chapitre IV.
 *
 * Ce script remet l'ensemble d'aplomb et y installe les cours + résumés
 * (`scripts/economie-g2-content.mjs`) :
 *
 *   - renomme et renumérote les chapitres I → V ;
 *   - crée le chapitre V s'il manque ;
 *   - insère (ou met à jour) une leçon `cours` et une leçon `resume` par
 *     chapitre ;
 *   - reclasse en `cours` la leçon du chapitre III mal typée `quiz` ;
 *   - rattache au chapitre V le QCM « CHAPITRE V » posé sur le chapitre IV.
 *
 * Rien n'est jamais supprimé. Tout contenu écrasé est d'abord sauvegardé dans
 * `scripts/.backup-economie-g2-<horodatage>.json`.
 *
 * Usage :
 *   node scripts/seed-economie-g2.mjs --dry-run   (n'écrit rien, montre le plan)
 *   node scripts/seed-economie-g2.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { chapters as CONTENT } from './economie-g2-content.mjs'

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
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) throw new Error('NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants dans apps/web/.env.local')

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

// ── Cibles vérifiées avant écriture (cf. mémoire « IDs matières Terminale ») ──
const SUBJECT_ECO_G2 = '735ad634-4a71-4fe0-821b-38a58fb765a4'
const SERIES_G2 = 'ef1a3bef-4d82-4f8a-a483-57c57a02248a'

/** Chapitres déjà en base, rattachés à leur contenu par clé. */
const EXISTING = {
  ch1: 'bef42a88-857c-4c29-938d-2e8ce59caf15', // « SYSTÈME ÉCONOMIQUE »
  ch2: 'dee58529-e49b-4546-a36e-f4c7022a0d4c', // « chapitre II LE SYSTÈME ÉCONOMIQUE ANCIENS »
  ch3: '20f965bc-177f-4421-b67f-6811cf25a39f', // « les systèmes économiques actuels »
  ch4: '8bff2a0f-a048-4edf-b174-817ec7376287', // « nlojnk »
  // ch5 : absent, créé par ce script
}

/** QCM intitulé « CHAPITRE V » mais rattaché au chapitre IV. */
const QUIZ_CH5 = 'f0f785c6-a433-4021-8936-9d9002fe98f8'

const backup = []
const log = (s) => console.log(s)
const tag = DRY_RUN ? '[dry-run] ' : ''

/* ── Garde-fou : la matière visée est bien ÉCONOMIE en bac_g2 ────────────── */
const [subject] = await sb(`/subjects?select=id,name,level&id=eq.${SUBJECT_ECO_G2}`)
if (!subject) throw new Error(`Matière ${SUBJECT_ECO_G2} introuvable.`)
if (subject.level !== 'bac_g2' || !/économie/i.test(subject.name)) {
  throw new Error(`Matière inattendue : « ${subject.name} » (${subject.level}). Abandon pour ne rien écraser.`)
}
log(`Matière : ${subject.name} — ${subject.level}\n`)

/* ── 1. Chapitres : titre, description, ordre ───────────────────────────── */
const chapterIds = {}

for (const [i, ch] of CONTENT.entries()) {
  const id = EXISTING[ch.key]

  if (id) {
    const [row] = await sb(`/chapters?select=id,title,order_index,subject_id&id=eq.${id}`)
    if (!row) throw new Error(`Chapitre ${id} (${ch.key}) introuvable.`)
    if (row.subject_id !== SUBJECT_ECO_G2) throw new Error(`Chapitre ${id} n'appartient pas à ÉCONOMIE bac_g2. Abandon.`)
    backup.push({ table: 'chapters', id, before: { title: row.title, order_index: row.order_index } })
    log(`${tag}chapitre ${ch.key} : « ${row.title} » → « ${ch.title} » (ordre ${row.order_index} → ${i})`)
    if (!DRY_RUN) {
      await sb(`/chapters?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: ch.title, description: ch.description, order_index: i, series_id: SERIES_G2 }),
      })
    }
    chapterIds[ch.key] = id
  } else {
    // Le chapitre n'existe pas encore : on le crée (ou on le retrouve s'il a
    // déjà été créé par un passage précédent de ce script).
    const found = await sb(`/chapters?select=id&subject_id=eq.${SUBJECT_ECO_G2}&title=eq.${encodeURIComponent(ch.title)}`)
    if (found.length) {
      chapterIds[ch.key] = found[0].id
      log(`${tag}chapitre ${ch.key} : déjà créé (${found[0].id})`)
    } else {
      log(`${tag}chapitre ${ch.key} : CRÉATION « ${ch.title} » (ordre ${i})`)
      if (DRY_RUN) { chapterIds[ch.key] = null; continue }
      const [created] = await sb('/chapters', {
        method: 'POST',
        body: JSON.stringify({
          subject_id: SUBJECT_ECO_G2, series_id: SERIES_G2,
          title: ch.title, description: ch.description, order_index: i,
        }),
      })
      chapterIds[ch.key] = created.id
      log(`          → ${created.id}`)
    }
  }
}

/* ── 2. Leçons : un `cours` et un `resume` par chapitre ─────────────────── */
async function upsertLesson(chapterId, chKey, type, title, content, orderIndex) {
  if (!chapterId) { log(`${tag}  · ${type} : (chapitre non créé en dry-run)`); return }

  const lessons = await sb(`/lessons?select=id,type,title,content,order_index&chapter_id=eq.${chapterId}&order=order_index`)

  // Une leçon `cours` peut avoir été saisie sous un autre type : le chapitre III
  // portait son cours dans un bloc « quiz ». On récupère cette leçon plutôt que
  // d'en créer une seconde, pour ne pas laisser de doublon à l'élève.
  const existing =
    lessons.find((l) => l.type === type) ??
    (type === 'cours' ? lessons.find((l) => l.type === 'quiz' && (l.content || '').length > 2000) : undefined)

  if (existing) {
    const retyped = existing.type !== type ? ` [type ${existing.type} → ${type}]` : ''
    backup.push({ table: 'lessons', id: existing.id, before: existing })
    log(`${tag}  · ${type} : mise à jour de « ${existing.title} »${retyped} (${(existing.content || '').length} → ${content.length} car.)`)
    if (!DRY_RUN) {
      await sb(`/lessons?id=eq.${existing.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ type, title, content, order_index: orderIndex }),
      })
    }
    return
  }

  log(`${tag}  · ${type} : création de « ${title} » (${content.length} car.)`)
  if (DRY_RUN) return
  await sb('/lessons', {
    method: 'POST',
    body: JSON.stringify({
      chapter_id: chapterId, type, title, content,
      order_index: orderIndex, is_premium: false,
    }),
  })
}

log('')
for (const ch of CONTENT) {
  log(`${ch.title}`)
  await upsertLesson(chapterIds[ch.key], ch.key, 'cours', ch.title, ch.cours, 0)
  await upsertLesson(chapterIds[ch.key], ch.key, 'resume', `Résumé — ${ch.title.replace(/^Chapitre [IVX]+ — /, '')}`, ch.resume, 1)
}

/* ── 3. Le QCM « CHAPITRE V » est rattaché au chapitre IV : on le reclasse ─ */
log('')
const [quiz] = await sb(`/quizzes?select=id,title,chapter_id&id=eq.${QUIZ_CH5}`)
if (!quiz) {
  log('QCM chapitre V : introuvable, rien à faire.')
} else if (quiz.chapter_id === chapterIds.ch5) {
  log('QCM chapitre V : déjà rattaché au bon chapitre.')
} else if (!/chapitre\s*v\b/i.test(quiz.title)) {
  log(`QCM ${QUIZ_CH5} : titre inattendu « ${quiz.title} », déplacement annulé par précaution.`)
} else {
  log(`${tag}QCM « ${quiz.title} » : chapitre ${quiz.chapter_id} → ${chapterIds.ch5}`)
  backup.push({ table: 'quizzes', id: quiz.id, before: { chapter_id: quiz.chapter_id } })
  if (!DRY_RUN) {
    await sb(`/quizzes?id=eq.${quiz.id}`, { method: 'PATCH', body: JSON.stringify({ chapter_id: chapterIds.ch5 }) })
  }
}

/* ── Sauvegarde de ce qui a été remplacé ────────────────────────────────── */
if (!DRY_RUN && backup.length) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const file = join(__dirname, `.backup-economie-g2-${stamp}.json`)
  writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8')
  log(`\nSauvegarde de l'état précédent : ${file}`)
}

log(DRY_RUN ? '\nDry-run terminé — aucune écriture.' : '\nTerminé.')
