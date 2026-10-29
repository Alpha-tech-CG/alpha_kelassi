/**
 * Importe le fascicule SVT 3e (643115080-FASCICULE-COURS-3-IEME-pdf.docx,
 * 15 leçons réparties sur 6 thèmes, Pr Cheikh Ah. Mbacké NDAO — Lycée de
 * Samécouta, Kédougou, Sénégal) en respectant l'ordre exact du document.
 *
 * Texte OCR'é via Gemini vision (le texte natif du docx, bien que non
 * corrompu, aplatissait les tableaux en listes de mots illisibles — l'OCR
 * préserve la structure des tableaux et permet un placement fiable des
 * figures). Cf. scratchpad/svt3e pour le détail du pipeline.
 *
 *  - Leçon 1 → remplace le chapitre "Système nerveux" (déjà présent,
 *    contenu placeholder).
 *  - Leçon 7 → remplace le chapitre "Immunité" (déjà présent, placeholder),
 *    renommé pour correspondre exactement au titre du livre.
 *  - Les 13 autres leçons → nouveaux chapitres.
 *  - "Reproduction humaine", "Génétique", "Écosystèmes et environnement"
 *    (déjà en base, hors sujet de ce livre) → non touchés, repositionnés
 *    en fin de séquence.
 *
 * Usage : node scripts/import-svt-3e-fascicule.mjs [--dry-run]
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
const SRC_DIR = 'C:/Users/miche/AppData/Local/Temp/claude/D--alpha-kelassi-new/e14b1709-c92a-401a-a7b0-afd9aea3502d/scratchpad/svt3e'
const IMG_DIR = join(SRC_DIR, 'page_images')

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
  const storagePath = `svt-3e-figures/${filename}`
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

function readLesson(num) {
  return readFileSync(join(SRC_DIR, 'lessons_final', `final${String(num).padStart(2, '0')}.md`), 'utf8')
}

async function resolveImages(text) {
  let n = 0
  const re = /!\[([^\]]*)\]\(IMG_PENDING:([^)]+)\)/g
  let out = text
  for (const m of [...text.matchAll(re)]) {
    n++
    const [full, label, filename] = m
    const url = DRY_RUN ? `DRY:${filename}` : await uploadImage(filename.replace(/\\/g, '/').split('/').pop())
    out = out.replace(full, `![${label}](${url})`)
  }
  return { text: out, imageCount: n }
}

// ─── Plan : leçon du livre → titre du chapitre BEPC + mois ─────────────────
const PLAN = [
  { book: 1, titre: 'Le fonctionnement du système nerveux', mode: 'replace', existingTitle: 'Système nerveux', month: 'Octobre 2025' },
  { book: 2, titre: 'Étude de la vision', mode: 'create', month: 'Octobre 2025' },
  { book: 3, titre: "La respiration chez l'espèce humaine", mode: 'create', month: 'Novembre 2025' },
  { book: 4, titre: 'Les phénomènes énergétiques accompagnant la respiration', mode: 'create', month: 'Novembre 2025' },
  { book: 5, titre: "La fermentation : un autre moyen de se procurer de l'énergie", mode: 'create', month: 'Décembre 2025' },
  { book: 6, titre: "Le rôle du rein dans l'excrétion urinaire et la régulation du milieu intérieur", mode: 'create', month: 'Décembre 2025' },
  { book: 7, titre: "L'immunité et la réponse immunitaire", mode: 'replace', existingTitle: 'Immunité', month: 'Janvier 2026' },
  { book: 8, titre: 'Le système immunitaire', mode: 'create', month: 'Janvier 2026' },
  { book: 9, titre: 'Un autre exemple de spécificité immunologique : les groupes sanguins', mode: 'create', month: 'Janvier 2026' },
  { book: 10, titre: "Aide à l'immunité", mode: 'create', month: 'Février 2026' },
  { book: 11, titre: "Dysfonctionnement du système immunitaire : cas de l'infection au VIH/SIDA", mode: 'create', month: 'Février 2026' },
  { book: 12, titre: 'La tectonique des plaques', mode: 'create', month: 'Mars 2026' },
  { book: 13, titre: 'La formation des roches métamorphiques', mode: 'create', month: 'Mars 2026' },
  { book: 14, titre: 'Le cycle des roches', mode: 'create', month: 'Avril 2026' },
  { book: 15, titre: 'La chronologie en géologie', mode: 'create', month: 'Avril 2026' },
]
const ORPHANS_ORDER = [
  { titre: 'Reproduction humaine', month: 'Mai 2026' },
  { titre: 'Génétique', month: 'Mai 2026' },
  { titre: 'Écosystèmes et environnement', month: 'Juin 2026' },
]

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')

  const [subject] = await sb(`/rest/v1/subjects?level=eq.bepc&name=eq.SVT&select=id`)
  const months = await sb('/rest/v1/school_months?select=id,label,term_id')
  const monthByLabel = Object.fromEntries(months.map((m) => [m.label, m]))

  let orderIndex = 0
  let created = 0, replaced = 0, images = 0

  for (const job of PLAN) {
    const monthRow = monthByLabel[job.month]
    if (!monthRow) { console.warn(`⚠ Mois introuvable : "${job.month}"`); continue }

    const raw = readLesson(job.book)
    const { text: content, imageCount } = await resolveImages(raw)
    images += imageCount

    let chapter
    if (job.mode === 'replace') {
      const chapters = await sb(`/rest/v1/chapters?subject_id=eq.${subject.id}&title=eq.${encodeURIComponent(job.existingTitle)}&select=id,title,order_index`)
      chapter = chapters[0]
      if (!chapter) { console.warn(`⚠ Chapitre à remplacer introuvable : "${job.existingTitle}"`); continue }
      if (DRY_RUN) {
        console.log(`[dry-run] renommerait "${job.existingTitle}" → "${job.titre}", order_index → ${orderIndex}, cours → ${content.length} car. (${imageCount} figures), mois → ${job.month}`)
      } else {
        await sb(`/rest/v1/chapters?id=eq.${chapter.id}`, { method: 'PATCH', body: JSON.stringify({ title: job.titre, order_index: orderIndex }) })
        const [lesson] = await sb(`/rest/v1/lessons?chapter_id=eq.${chapter.id}&type=eq.cours&select=id`)
        if (lesson) await sb(`/rest/v1/lessons?id=eq.${lesson.id}`, { method: 'PATCH', body: JSON.stringify({ content }) })
        else await sb('/rest/v1/lessons', { method: 'POST', body: JSON.stringify({ chapter_id: chapter.id, type: 'cours', title: job.titre, content, order_index: 0, is_premium: false }) })
        const [item] = await sb(`/rest/v1/curriculum_items?chapter_id=eq.${chapter.id}&select=id`)
        if (item) await sb(`/rest/v1/curriculum_items?id=eq.${item.id}`, { method: 'PATCH', body: JSON.stringify({ school_month_id: monthRow.id, term_id: monthRow.term_id, order_index: orderIndex }) })
        console.log(`✓ Remplacé : "${job.existingTitle}" → "${job.titre}" (${content.length} car., ${imageCount} figures) → ${job.month}`)
      }
      replaced++
    } else {
      if (DRY_RUN) {
        console.log(`[dry-run] créerait "${job.titre}" → ${job.month} (order_index ${orderIndex}, ${content.length} car., ${imageCount} figures)`)
      } else {
        const [createdCh] = await sb('/rest/v1/chapters', { method: 'POST', body: JSON.stringify({ subject_id: subject.id, title: job.titre, order_index: orderIndex }) })
        chapter = createdCh
        await sb('/rest/v1/lessons', { method: 'POST', body: JSON.stringify({ chapter_id: chapter.id, type: 'cours', title: job.titre, content, order_index: 0, is_premium: false }) })
        await sb('/rest/v1/curriculum_items', { method: 'POST', body: JSON.stringify({ subject_id: subject.id, chapter_id: chapter.id, item_type: 'chapter', school_month_id: monthRow.id, term_id: monthRow.term_id, is_core: true, order_index: orderIndex }) })
        console.log(`✓ Créé : "${job.titre}" (${content.length} car., ${imageCount} figures) → ${job.month}`)
      }
      created++
    }
    orderIndex++
  }

  // ── Repositionner les 3 chapitres hors-manuel en fin de séquence ──
  for (const orphan of ORPHANS_ORDER) {
    const monthRow = monthByLabel[orphan.month]
    const chapters = await sb(`/rest/v1/chapters?subject_id=eq.${subject.id}&title=eq.${encodeURIComponent(orphan.titre)}&select=id,order_index`)
    const chapter = chapters[0]
    if (!chapter) { console.warn(`⚠ Chapitre orphelin introuvable : "${orphan.titre}"`); orderIndex++; continue }
    if (DRY_RUN) {
      console.log(`[dry-run] repositionnerait "${orphan.titre}" : order_index → ${orderIndex}, mois → ${orphan.month}`)
    } else {
      await sb(`/rest/v1/chapters?id=eq.${chapter.id}`, { method: 'PATCH', body: JSON.stringify({ order_index: orderIndex }) })
      const [item] = await sb(`/rest/v1/curriculum_items?chapter_id=eq.${chapter.id}&select=id`)
      if (item) await sb(`/rest/v1/curriculum_items?id=eq.${item.id}`, { method: 'PATCH', body: JSON.stringify({ school_month_id: monthRow.id, term_id: monthRow.term_id, order_index: orderIndex }) })
      console.log(`✓ Repositionné : "${orphan.titre}" → ${orphan.month} (#${orderIndex})`)
    }
    orderIndex++
  }

  console.log(`\n${DRY_RUN ? '[dry-run]' : 'Terminé.'} ${created} chapitres créés, ${replaced} remplacés, ${images} figures ${DRY_RUN ? 'à uploader' : 'uploadées'}.`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
