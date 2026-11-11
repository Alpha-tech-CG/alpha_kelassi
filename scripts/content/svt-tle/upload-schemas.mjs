/**
 * Prépare et met en ligne les schémas des cours de SVT Terminale C & D.
 * Les images viennent de Wikimedia Commons (domaine public ou Creative Commons) :
 * on les aplatit sur fond blanc, on les limite à 1100 px de large, puis on les
 * dépose dans le bucket `course-images` (dossier `svt-tle/`).
 * Écrit `schemas.json` (clé → URL publique + crédit) utilisé par publish.mjs.
 *
 * Usage : node scripts/content/svt-tle/upload-schemas.mjs <dossier des images téléchargées>
 */
import { readFileSync, writeFileSync } from 'fs'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const sharp = require(join(__dirname, '..', '..', '..', 'node_modules', '.pnpm', 'sharp@0.34.5', 'node_modules', 'sharp'))
const env = Object.fromEntries(readFileSync(join(__dirname, '..', '..', '..', 'apps', 'web', '.env.local'), 'utf-8').split('\n').filter(l => l.includes('=') && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const URL = env.NEXT_PUBLIC_SUPABASE_URL, KEY = env.SUPABASE_SERVICE_ROLE_KEY

const SRC = process.argv[2]
if (!SRC) throw new Error('Dossier des images manquant')
const KEEP = [
  'div-cycle', 'div-chromosome', 'div-caryotype', 'div-mitose2', 'div-meiose', 'div-crossing',
  'rep-spermato', 'rep-ovo', 'rep-male', 'rep-femelle', 'rep-cycle2', 'rep-fecondation',
  'veg-fleur', 'veg-double', 'veg-cycle',
  'nerf-neurone2', 'nerf-moelle', 'nerf-pa', 'nerf-synapse2', 'nerf-reflexe', 'nerf-pavlov',
  'coeur-anat', 'coeur-nodal', 'coeur-innerv',
  'gen-punnett', 'gen-di', 'gen-xlie', 'gen-abo',
  'imm-phago', 'imm-ac', 'imm-vih',
  'geo-terre', 'geo-pangee', 'geo-plaques', 'geo-subduction', 'geo-dorsale', 'geo-failles', 'geo-coupe',
  'res-hydro', 'res-piege', 'res-anticlinal',
  'eco-chaine', 'eco-reseau', 'eco-carbone', 'eco-azote',
]
const credits = JSON.parse(readFileSync(join(SRC, 'credits.json'), 'utf8'))
const out = {}
for (const key of KEEP) {
  const c = credits[key]
  if (!c) throw new Error(`Crédit manquant pour ${key}`)
  const png = await sharp(readFileSync(join(SRC, c.file)))
    .resize({ width: 1100, withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer()
  const path = `svt-tle/${key}.png`
  const res = await fetch(`${URL}/storage/v1/object/course-images/${path}`, {
    method: 'POST',
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'image/png', 'x-upsert': 'true' },
    body: png,
  })
  if (!res.ok) throw new Error(`${key} -> HTTP ${res.status}: ${await res.text()}`)
  out[key] = { url: `${URL}/storage/v1/object/public/course-images/${path}`, author: c.author, license: c.license, page: c.page }
  console.log(key, Math.round(png.length / 1024) + ' Ko', c.license)
}
writeFileSync(join(__dirname, 'schemas.json'), JSON.stringify(out, null, 1))
console.log(`${KEEP.length} schémas en ligne → schemas.json`)
