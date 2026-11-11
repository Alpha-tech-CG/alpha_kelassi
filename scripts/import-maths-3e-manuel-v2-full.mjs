/**
 * Remplace le contenu condensé (import-maths-3e-manuel-v2.mjs) par le texte
 * INTÉGRAL du manuel, à la demande explicite de l'utilisateur ("le contenu
 * exact du fichier... le livre est beaucoup plus riche"). Lit les fichiers
 * déjà nettoyés (OCR Gemini + corrections manuelles des derniers fragments
 * corrompus) dans scratchpad/maths3e-v2/cleaned_chNN.md, upload les figures
 * qui y sont référencées (IMG_PENDING:filename, dans l'ordre où elles
 * apparaissent réellement dans le texte final) et remplace le cours de
 * chaque chapitre correspondant.
 *
 * "Activités numériques" est un cas particulier : APPEND (pas replace) car
 * son contenu actuel (nombres relatifs/fractions/puissances de 10) et celui
 * du livre (ch01 intervalles/encadrements + ch04 racine carrée) sont
 * complémentaires, pas redondants.
 *
 * Usage : node scripts/import-maths-3e-manuel-v2-full.mjs [--dry-run]
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
const SRC_DIR = 'C:/Users/miche/AppData/Local/Temp/claude/D--alpha-kelassi-new/e14b1709-c92a-401a-a7b0-afd9aea3502d/scratchpad/maths3e-v2'
const IMG_DIR = join(SRC_DIR, 'chapter_images')

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split('\n').filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

async function sb(path, init) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, Prefer: 'return=representation', ...(init?.headers ?? {}) },
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : null
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> HTTP ${res.status}: ${JSON.stringify(json)}`)
  return json
}

const MIME = { png: 'image/png', jpeg: 'image/jpeg', jpg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' }
const uploadCache = new Map()
async function uploadImage(filename) {
  if (uploadCache.has(filename)) return uploadCache.get(filename)
  const ext = filename.split('.').pop().toLowerCase()
  const storagePath = `bepc-figures-v2/${filename}`
  const bytes = readFileSync(join(IMG_DIR, filename))
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/course-images/${encodeURIComponent(storagePath)}`, {
    method: 'POST',
    headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, 'Content-Type': MIME[ext] ?? 'application/octet-stream', 'x-upsert': 'true' },
    body: bytes,
  })
  if (!res.ok) throw new Error(`Upload ${filename} -> HTTP ${res.status}: ${await res.text()}`)
  const url = `${SUPABASE_URL}/storage/v1/object/public/course-images/${storagePath}`
  uploadCache.set(filename, url)
  return url
}

function readChapter(num) {
  return readFileSync(join(SRC_DIR, `cleaned_ch${String(num).padStart(2, '0')}.md`), 'utf8')
}

async function resolveImages(text) {
  let n = 0
  const re = /!\[([^\]]*)\]\(IMG_PENDING:([^)]+)\)/g
  let out = text
  const matches = [...text.matchAll(re)]
  for (const m of matches) {
    n++
    const [full, label, filename] = m
    const url = DRY_RUN ? `DRY:${filename}` : await uploadImage(filename)
    out = out.replace(full, `![${label}](${url})`)
  }
  return { text: out, imageCount: n }
}

// ─── Mapping livre → chapitre BEPC + opération ─────────────────────────────
const REPLACE_JOBS = [
  { book: 9, titre: 'Théorème de Pythagore' },
  { book: 10, titre: 'Théorème de Thalès' },
  { book: 11, titre: 'Repérage dans le plan' },
  { book: 15, titre: 'Trigonométrie dans le triangle rectangle' },
  { book: 16, titre: 'Fonction affine' },
  { book: 18, titre: 'Statistiques' },
  { book: 19, titre: 'Transformations du plan' },
  { book: 20, titre: 'Pyramide et cône de révolution' },
  { book: 6, titre: 'Calcul littéral : développer, factoriser, équations' },
  { book: 5, titre: 'Problèmes du 1er degré' },
  // Les 7 chapitres créés lors du premier passage (contenu condensé à remplacer)
  { book: 2, titre: 'Vecteurs : addition et multiplication par un réel' },
  { book: 3, titre: "Coordonnées d'un vecteur" },
  { book: 7, titre: 'Fonctions rationnelles' },
  { book: 8, titre: 'Rapport de projection' },
  { book: 12, titre: 'Droites et équations de droites' },
  { book: 14, titre: 'Angles inscrits' },
  { book: 17, titre: "Positions relatives d'une droite et d'un cercle" },
]

async function findChapter(subjectId, titre) {
  const rows = await sb(`/rest/v1/chapters?subject_id=eq.${subjectId}&select=id,title`)
  return rows.find((r) => r.title === titre)
}

async function setLessonContent(chapterId, titre, content) {
  if (DRY_RUN) { console.log(`[dry-run] remplacerait le cours de "${titre}" par ${content.length} caractères`); return }
  const [existing] = await sb(`/rest/v1/lessons?chapter_id=eq.${chapterId}&type=eq.cours&select=id`)
  if (existing) {
    await sb(`/rest/v1/lessons?id=eq.${existing.id}`, { method: 'PATCH', body: JSON.stringify({ content }) })
  } else {
    await sb('/rest/v1/lessons', { method: 'POST', body: JSON.stringify({ chapter_id: chapterId, type: 'cours', title: titre, content, order_index: 0, is_premium: false }) })
  }
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')

  const [subject] = await sb(`/rest/v1/subjects?level=eq.bepc&name=eq.${encodeURIComponent('Mathématiques')}&select=id`)

  let totalImages = 0, totalChapters = 0

  for (const job of REPLACE_JOBS) {
    const chapter = await findChapter(subject.id, job.titre)
    if (!chapter) { console.warn(`⚠ Chapitre introuvable : "${job.titre}"`); continue }

    const raw = readChapter(job.book)
    const { text, imageCount } = await resolveImages(raw)
    await setLessonContent(chapter.id, job.titre, text)
    console.log(`✓ ${job.titre} ← ch${job.book} du manuel (${text.length} car., ${imageCount} figures)`)
    totalImages += imageCount
    totalChapters++
  }

  // ── Cas spécial : Systèmes d'équations / d'inéquations (ch13 scindé) ──
  const ch13Raw = readChapter(13)
  const splitIdx = ch13Raw.indexOf("II) INÉQUATIONS ET SYSTÈMES D'INÉQUATIONS")
  const eqPart = ch13Raw.slice(0, splitIdx).trim()
  const ineqPart = ch13Raw.slice(splitIdx).trim()

  const eqChapter = await findChapter(subject.id, "Systèmes d'équations du 1er degré à deux inconnues")
  if (eqChapter) {
    const { text, imageCount } = await resolveImages(eqPart)
    await setLessonContent(eqChapter.id, "Systèmes d'équations...", text)
    console.log(`✓ Systèmes d'équations du 1er degré à deux inconnues ← ch13 (1ère partie) (${text.length} car., ${imageCount} figures)`)
    totalImages += imageCount; totalChapters++
  }
  const ineqChapter = await findChapter(subject.id, "Systèmes d'inéquations du 1er degré à deux inconnues")
  if (ineqChapter) {
    const { text, imageCount } = await resolveImages(ineqPart)
    await setLessonContent(ineqChapter.id, "Systèmes d'inéquations...", text)
    console.log(`✓ Systèmes d'inéquations du 1er degré à deux inconnues ← ch13 (2ème partie) (${text.length} car., ${imageCount} figures)`)
    totalImages += imageCount; totalChapters++
  }

  // ── Cas spécial : Activités numériques (append ch01 + ch04, pas replace) ──
  const activitesChapter = await findChapter(subject.id, 'Activités numériques : nombres relatifs, fractions, puissances')
  if (activitesChapter) {
    const [lesson] = await sb(`/rest/v1/lessons?chapter_id=eq.${activitesChapter.id}&type=eq.cours&select=id,content`)
    const ch01 = await resolveImages(readChapter(1))
    const ch04 = await resolveImages(readChapter(4))
    const appended = `${lesson.content}\n\n---\n\n## Intervalles, encadrements et valeur absolue\n\n${ch01.text}\n\n---\n\n## Racine carrée d'un réel positif\n\n${ch04.text}`
    if (DRY_RUN) {
      console.log(`[dry-run] compléterait "Activités numériques" avec ch01+ch04 (+${ch01.text.length + ch04.text.length} car., ${ch01.imageCount + ch04.imageCount} figures)`)
    } else {
      await sb(`/rest/v1/lessons?id=eq.${lesson.id}`, { method: 'PATCH', body: JSON.stringify({ content: appended }) })
      console.log(`✓ Activités numériques complété avec ch01+ch04 (total ${appended.length} car., ${ch01.imageCount + ch04.imageCount} figures ajoutées)`)
    }
    totalImages += ch01.imageCount + ch04.imageCount; totalChapters++
  }

  console.log(`\n${DRY_RUN ? '[dry-run]' : 'Terminé.'} ${totalChapters} chapitres mis à jour, ${totalImages} figures ${DRY_RUN ? 'à uploader' : 'uploadées'}.`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
