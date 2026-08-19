/**
 * Ajoute les figures manquantes aux cours de Mathématiques BEPC, à partir des
 * images fournies dans Documents/photo. N'insère QUE dans les chapitres où
 * la figure correspond clairement à un passage du texte déjà présent — les
 * images sans section de texte correspondante ne sont pas insérées (mieux
 * vaut ne rien mettre qu'un mauvais raccord image/texte).
 *
 * Upload vers le bucket Storage "course-images" (même bucket que les figures
 * du manuel Maths TC déjà en place), dossier "bepc-figures/".
 *
 * Usage : node scripts/add-maths-figures.mjs [--dry-run]
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
const PHOTO_DIR = 'C:/Users/miche/Documents/photo'

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

const MIME = { png: 'image/png', webp: 'image/webp', gif: 'image/gif', jpeg: 'image/jpeg', jpg: 'image/jpeg' }

async function uploadImage(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  const storagePath = `bepc-figures/${filename}`
  const bytes = readFileSync(join(PHOTO_DIR, filename))
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/course-images/${encodeURIComponent(storagePath)}`, {
    method: 'POST',
    headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, 'Content-Type': MIME[ext] ?? 'application/octet-stream', 'x-upsert': 'true' },
    body: bytes,
  })
  if (!res.ok) throw new Error(`Upload ${filename} -> HTTP ${res.status}: ${await res.text()}`)
  return `${SUPABASE_URL}/storage/v1/object/public/course-images/${storagePath}`
}

// { titre du chapitre : [{ file, anchor (texte après lequel insérer), label }] }
const PLACEMENTS = {
  'Théorème de Thalès': [
    { file: 'configthales.png', anchor: "sont placés dans le même ordre sur les côtés et si **AM / AB = AN / AC**, alors **(MN) // (BC)**.", label: 'Configuration de Thalès' },
  ],
  'Transformations du plan': [
    { file: 'translation.png', anchor: "La figure garde **même direction, même sens, même longueur** : elle est seulement « glissée ».", label: 'Translation' },
  ],
  'Pyramide et cône de révolution': [
    { file: 'pyramide.png', anchor: "Si la base est un carré de côté c : V = (c² × h) / 3.", label: 'La pyramide' },
    { file: 'mathematical-proof-volume-cone-sphere-equal-to-cylinder-same-radius-height-pyramid-twice-387951106.webp', anchor: '**Volume :** V = (π × r² × h) / 3', label: 'Volume du cône' },
  ],
  'Repérage dans le plan': [
    { file: 'repere ortonorme.gif', anchor: "**Exemple**\n- A(2;3), B(-1;4). Placer A et B → A : 2 sur l'axe x, 3 sur l'axe y. B : -1 sur x, 4 sur y.", label: 'Repère orthonormé' },
  ],
  'Trigonométrie dans le triangle rectangle': [
    { file: 'brevet-maths-schema-trigonometrie-triangle-rectangle.webp', anchor: "**Moyen mnémotechnique** : CAH SOH TOA — Cos = Adjacent/Hypoténuse, Sin = Opposé/Hypoténuse, Tan = Opposé/Adjacent.", label: 'Triangle rectangle : cos, sin, tan' },
  ],
}

const SKIPPED = [
  '2.-vecteursvecteurs-égaux-4.2.png', 'vercteur opposer.png', // pas de section "vecteurs égaux/opposés" dans le cours actuel
  'cercle circonci.webp', 'hauteur1_3aigus.png', 'medianes.gif', 'mediatrice.png', // droites remarquables du triangle : aucun chapitre BEPC ne couvre ce sujet actuellement
  'prisme.png', 'png-transparent-cylinder-geometry-volume-prism-area-circle-angle-symmetry-solid-geometry.png', // prisme seul non couvert par le texte du chapitre (qui ne traite que pyramide+cône)
  'plane solide.png', // "sections planes" mentionné dans le programme officiel mais absent du texte actuel du chapitre
]

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')
  console.log(`Images ignorées (pas de section correspondante dans le texte actuel) : ${SKIPPED.length}`)
  for (const f of SKIPPED) console.log(`  - ${f}`)

  let inserted = 0
  for (const [chapterTitle, placements] of Object.entries(PLACEMENTS)) {
    const [chapter] = await sb(`/rest/v1/chapters?title=eq.${encodeURIComponent(chapterTitle)}&select=id`)
    if (!chapter) { console.warn(`⚠ Chapitre introuvable : "${chapterTitle}"`); continue }
    const [lesson] = await sb(`/rest/v1/lessons?chapter_id=eq.${chapter.id}&type=eq.cours&select=id,content`)
    if (!lesson) { console.warn(`⚠ Cours introuvable pour "${chapterTitle}"`); continue }

    let content = lesson.content
    console.log(`\n--- ${chapterTitle} ---`)
    for (const p of placements) {
      if (content.includes(`bepc-figures/${encodeURIComponent(p.file)}`) || content.includes(`bepc-figures/${p.file}`)) {
        console.log(`… figure déjà présente : ${p.label}`)
        continue
      }
      if (!content.includes(p.anchor)) {
        console.warn(`⚠ Ancrage introuvable pour "${p.label}" dans "${chapterTitle}" — figure non insérée`)
        continue
      }
      if (DRY_RUN) { console.log(`[dry-run] insérerait "${p.file}" (${p.label}) après l'ancrage`); continue }

      const url = await uploadImage(p.file)
      content = content.replace(p.anchor, `${p.anchor}\n\n![${p.label}](${url})`)
      console.log(`✓ Figure insérée : ${p.label} (${p.file})`)
      inserted++
    }

    if (!DRY_RUN && content !== lesson.content) {
      await sb(`/rest/v1/lessons?id=eq.${lesson.id}`, { method: 'PATCH', body: JSON.stringify({ content }) })
    }
  }

  console.log(`\n${DRY_RUN ? '[dry-run]' : 'Terminé.'} ${inserted} figures insérées, ${SKIPPED.length} images sans section correspondante.`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
