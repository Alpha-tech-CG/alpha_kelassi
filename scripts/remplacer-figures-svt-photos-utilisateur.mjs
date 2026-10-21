/**
 * Remplace les figures SVT (recadrées à la main depuis des pages scannées,
 * watermarkées et de résolution moyenne) par de vraies images propres et
 * haute qualité fournies par l'utilisateur (Documents/photo/).
 *
 * Usage : node scripts/remplacer-figures-svt-photos-utilisateur.mjs [--dry-run]
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

const MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' }
async function uploadPhoto(filename, storageFilename) {
  const ext = filename.split('.').pop().toLowerCase()
  const bytes = readFileSync(join(PHOTO_DIR, filename))
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/course-images/svt-3e-officiel-figures/${storageFilename}`, {
    method: 'POST',
    headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, 'Content-Type': MIME[ext] ?? 'application/octet-stream', 'x-upsert': 'true' },
    body: bytes,
  })
  if (!res.ok) throw new Error(`Upload ${filename} -> HTTP ${res.status}: ${await res.text()}`)
  return `${SUPABASE_URL}/storage/v1/object/public/course-images/svt-3e-officiel-figures/${storageFilename}`
}

// titre du chapitre -> [{ oldFile (nom de stockage existant à remplacer), newPhoto (fichier dans Documents/photo) }]
const PLAN = {
  'Structure interne du globe terrestre': [
    { oldFile: 'ms01_fig1.png', newPhoto: 'couche de la tere.jpg' },
  ],
  'Fonctionnement de la dorsale océanique et ses conséquences': [
    { oldFile: 'ms03_fig1.png', newPhoto: 'fond oceanique.jpg' },
    { oldFile: 'ms03_fig2.png', newPhoto: 'schema de la fosse oceanique.png' },
  ],
  'Fonctionnement de la fosse océanique et ses conséquences': [
    { oldFile: 'ms04_fig1.png', newPhoto: 'fosse oceanique.jpg' },
  ],
  'Déformations des terrains liées aux forces de compression et de distension': [
    { oldFile: 'ms05_fig1.png', newPhoto: 'faille inverse.jpg' },
    { oldFile: 'ms05_fig2.png', newPhoto: "schema d'un pli.png" },
  ],
  'Structure de la cellule': [
    { oldFile: 'ms08_fig1.png', newPhoto: 'celulle animale.png' },
    { oldFile: 'ms08_fig2.png', newPhoto: 'gnis-pedagogie-amelioration-plantes-cellule-vegetale-1140x806.png' },
  ],
  'Programme génétique': [
    { oldFile: 'ms09_fig1.png', newPhoto: 'celulle en division.jpg' },
    { oldFile: 'ms09_fig2.png', newPhoto: 'chromosome.jpg' },
  ],
  Digestion: [
    { oldFile: 'ms11_fig1.png', newPhoto: 'appareil digestif.webp' },
    { oldFile: 'ms11_fig2.png', newPhoto: 'villosité intestinal.PNG' },
  ],
  "Mécanismes d'approvisionnement des cellules en nutriments": [
    { oldFile: 'ms12_fig1.png', newPhoto: 'absorbtion intestinale.png' },
  ],
  "Mécanisme d'approvisionnement des cellules en dioxygène": [
    { oldFile: 'ms13_fig1.png', newPhoto: 'echange gazeux.jpg' },
  ],
  'Excrétion urinaire': [
    { oldFile: 'ms17_fig1.png', newPhoto: 'appareil urinaire.jpg' },
    { oldFile: 'ms17_fig2.png', newPhoto: 'rein.jpg' },
  ],
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')
  const [subject] = await sb(`/rest/v1/subjects?level=eq.bepc&name=eq.SVT&select=id`)

  let totalReplaced = 0
  for (const [titre, items] of Object.entries(PLAN)) {
    const [chapter] = await sb(`/rest/v1/chapters?subject_id=eq.${subject.id}&title=eq.${encodeURIComponent(titre)}&select=id`)
    if (!chapter) { console.warn(`⚠ Chapitre introuvable : "${titre}"`); continue }
    const [lesson] = await sb(`/rest/v1/lessons?chapter_id=eq.${chapter.id}&type=eq.cours&select=id,content`)
    let content = lesson.content

    for (const { oldFile, newPhoto } of items) {
      // Nouveau nom de stockage : garde le radical ms0X_figY mais avec l'extension d'origine de la photo
      const ext = newPhoto.split('.').pop().toLowerCase()
      const storageFilename = oldFile.replace(/\.png$/, `.${ext}`)

      const oldUrlPattern = new RegExp(`https:\\/\\/[^)]*svt-3e-officiel-figures\\/${oldFile.replace('.', '\\.')}`)
      if (!oldUrlPattern.test(content)) { console.warn(`⚠ Ancienne image "${oldFile}" introuvable dans "${titre}"`); continue }

      if (DRY_RUN) {
        console.log(`[dry-run] "${titre}": remplacerait ${oldFile} par ${newPhoto} (-> ${storageFilename})`)
        continue
      }
      const newUrl = await uploadPhoto(newPhoto, storageFilename)
      content = content.replace(oldUrlPattern, newUrl)
      console.log(`✓ "${titre}": ${oldFile} → ${newPhoto}`)
      totalReplaced++
    }

    if (!DRY_RUN && content !== lesson.content) {
      await sb(`/rest/v1/lessons?id=eq.${lesson.id}`, { method: 'PATCH', body: JSON.stringify({ content }) })
    }
  }

  console.log(`\n${DRY_RUN ? '[dry-run]' : 'Terminé.'} ${totalReplaced} figures remplacées.`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
