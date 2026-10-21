/**
 * Insère les figures réelles (recadrées à la main depuis les pages scannées
 * du document officiel congolais) dans les chapitres SVT 3e correspondants,
 * en remplaçant les balises [FIGURE: ...] restées en texte.
 *
 * Usage : node scripts/ajouter-figures-svt-officiel.mjs [--dry-run]
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
const FIG_DIR = 'C:/Users/miche/AppData/Local/Temp/claude/D--alpha-kelassi-new/e14b1709-c92a-401a-a7b0-afd9aea3502d/scratchpad/svt3e-v2/figures'

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

async function uploadImage(filename) {
  const storagePath = `svt-3e-officiel-figures/${filename}`
  const bytes = readFileSync(join(FIG_DIR, filename))
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/course-images/${encodeURIComponent(storagePath)}`, {
    method: 'POST',
    headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, 'Content-Type': 'image/png', 'x-upsert': 'true' },
    body: bytes,
  })
  if (!res.ok) throw new Error(`Upload ${filename} -> HTTP ${res.status}: ${await res.text()}`)
  return `${SUPABASE_URL}/storage/v1/object/public/course-images/${storagePath}`
}

// titre du chapitre -> liste ordonnée de { fichier, légende } correspondant
// à l'ordre d'apparition des balises [FIGURE: ...] dans le cours.
const PLAN = {
  'Structure interne du globe terrestre': [
    { file: 'ms01_fig1.png', label: 'Structure interne du globe terrestre et de la lithosphère' },
  ],
  'Plaques lithosphériques': [
    { file: 'ms02_fig1.png', label: 'Schéma de subduction (fosse océanique)' },
  ],
  'Fonctionnement de la dorsale océanique et ses conséquences': [
    { file: 'ms03_fig1.png', label: 'Morphologie du fond océanique' },
    { file: 'ms03_fig2.png', label: 'Fonctionnement de la dorsale océanique' },
  ],
  'Fonctionnement de la fosse océanique et ses conséquences': [
    { file: 'ms04_fig1.png', label: 'Schéma de la fosse océanique' },
  ],
  'Déformations des terrains liées aux forces de compression et de distension': [
    { file: 'ms05_fig1.png', label: "Schéma d'une faille inverse" },
    { file: 'ms05_fig2.png', label: "Schéma d'un pli" },
  ],
  'Structure de la cellule': [
    { file: 'ms08_fig1.png', label: "Schéma d'une cellule animale" },
    { file: 'ms08_fig2.png', label: "Schéma d'une cellule végétale" },
  ],
  'Programme génétique': [
    { file: 'ms09_fig1.png', label: "Schéma simplifié d'une cellule en division" },
    { file: 'ms09_fig2.png', label: "Schéma d'un chromosome" },
  ],
  Digestion: [
    { file: 'ms11_fig1.png', label: "Appareil digestif" },
    { file: 'ms11_fig2.png', label: "Schéma d'une villosité intestinale" },
  ],
  "Mécanismes d'approvisionnement des cellules en nutriments": [
    { file: 'ms12_fig1.png', label: "Les deux voies de l'absorption intestinale" },
  ],
  "Mécanisme d'approvisionnement des cellules en dioxygène": [
    { file: 'ms13_fig1.png', label: "Échanges gazeux au niveau d'une alvéole pulmonaire" },
  ],
  'Excrétion urinaire': [
    { file: 'ms17_fig1.png', label: 'Appareil urinaire' },
    { file: 'ms17_fig2.png', label: "Coupe d'un rein" },
  ],
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')
  const [subject] = await sb(`/rest/v1/subjects?level=eq.bepc&name=eq.SVT&select=id`)

  let totalImages = 0
  for (const [titre, figures] of Object.entries(PLAN)) {
    const [chapter] = await sb(`/rest/v1/chapters?subject_id=eq.${subject.id}&title=eq.${encodeURIComponent(titre)}&select=id`)
    if (!chapter) { console.warn(`⚠ Chapitre introuvable : "${titre}"`); continue }
    const [lesson] = await sb(`/rest/v1/lessons?chapter_id=eq.${chapter.id}&type=eq.cours&select=id,content`)
    let content = lesson.content
    let replaced = 0
    for (const fig of figures) {
      const idx = content.indexOf('[FIGURE:')
      if (idx === -1) { console.warn(`⚠ Plus de balise [FIGURE:] dans "${titre}" pour ${fig.file}`); continue }
      const end = content.indexOf(']', idx) + 1
      const tag = content.slice(idx, end)
      if (DRY_RUN) {
        console.log(`[dry-run] "${titre}": remplacerait "${tag}" par l'image ${fig.file}`)
        content = content.slice(0, idx) + `![${fig.label}](DRY:${fig.file})` + content.slice(end)
      } else {
        const url = await uploadImage(fig.file)
        content = content.slice(0, idx) + `![${fig.label}](${url})` + content.slice(end)
      }
      replaced++
      totalImages++
    }
    // Retire les balises [FIGURE:] restantes sans image correspondante (ex: échiquiers de croisement déjà en tableau)
    const before = content
    content = content.replace(/\n?\[FIGURE:[^\]]*\]\n?/g, '\n')
    if (content !== before) console.log(`  (balises [FIGURE:] restantes retirées dans "${titre}")`)

    if (!DRY_RUN) {
      await sb(`/rest/v1/lessons?id=eq.${lesson.id}`, { method: 'PATCH', body: JSON.stringify({ content }) })
    }
    console.log(`✓ "${titre}": ${replaced} figure(s) insérée(s)`)
  }

  console.log(`\n${DRY_RUN ? '[dry-run]' : 'Terminé.'} ${totalImages} figures ${DRY_RUN ? 'à insérer' : 'insérées'}.`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
