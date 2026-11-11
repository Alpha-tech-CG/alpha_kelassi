/**
 * Polissage présentation — Physique-Chimie 3e (BEPC), 06/11/2026.
 *
 * Le contenu Physique-Chimie en base est déjà correct et, pour la partie
 * physique, richement illustré (171 figures). Les originaux du cahier ne
 * couvrent pas les chapitres de chimie (hydrocarbures, acides/pH…) et feraient
 * perdre les figures : on ne réécrit donc PAS le contenu. On corrige seulement
 * la présentation :
 *   1. Titres de chapitres : accents et casse remis (mecaniques → mécaniques…).
 *   2. Contenu des leçons : on retire le gros titre en MAJUSCULES répété en tête
 *      (doublon du titre du chapitre), déjà affiché par ailleurs.
 *
 * Non destructif : sauvegarde complète avant écriture.
 *
 * Usage :
 *   node scripts/polish-physique-chimie-3e.mjs            (dry-run + backup)
 *   node scripts/polish-physique-chimie-3e.mjs --confirm
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CONFIRM = process.argv.includes('--confirm')
const env = Object.fromEntries(
  readFileSync(join(ROOT, 'apps', 'web', '.env.local'), 'utf-8')
    .split(/\r?\n/).filter((l) => l.includes('=') && !l.trimStart().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const URL = env.NEXT_PUBLIC_SUPABASE_URL, KEY = env.SUPABASE_SERVICE_ROLE_KEY
async function sb(path, init = {}) {
  const r = await fetch(`${URL}/rest/v1${path}`, { ...init, headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}`, ...(init.headers ?? {}) } })
  const t = await r.text(); const d = t ? JSON.parse(t) : null
  if (!r.ok) throw new Error(`${init.method || 'GET'} ${path} -> ${r.status}: ${JSON.stringify(d)}`)
  return d
}

// Titres corrigés par order_index (accents + casse). ’ = U+2019 pour rester cohérent.
const TITLES = {
  2: 'Travail et puissance mécaniques',
  4: 'Différentes formes d’énergie',
  5: 'Les sources d’énergie',
  6: 'Le moteur à piston',
  7: 'Relation entre différentes formes d’énergie',
  8: 'Courant électrique dans les métaux',
  10: 'Détermination de la tension électrique en courant continu',
  11: 'Détermination de l’intensité électrique en courant continu',
  12: 'Détermination de la résistance électrique',
  13: 'Puissance et énergie électrique',
  14: 'Transformateurs et redresseurs',
  15: 'Utilité sociale de l’électricité',
  16: 'Appareils d’optique',
  17: 'Construction géométrique des images',
  18: 'Image donnée par un miroir plan',
  21: 'La molécule d’eau',
  22: 'Pollution par les dérivés du pétrole et leurs produits de synthèse',
  23: 'Notions d’acide, de base et de pH',
  24: 'Détermination de l’acidité et de la basicité des solutions aqueuses',
  25: 'Structure des métaux',
  27: 'Caractéristiques des métaux',
  28: 'Obtention des métaux usuels et de leurs alliages',
  29: 'Détermination du titre des solutions acides et basiques',
  30: 'Propriétés des alcanes, des alcènes et des alcynes',
  31: 'Obtention des dérivés du pétrole',
  32: 'Produits de synthèse des dérivés du pétrole : les matières plastiques',
}

/** Retire un titre H1 unique (# ...) en tête de contenu, s'il duplique le titre. */
function stripLeadingH1(content) {
  const lines = content.split(/\r?\n/)
  let i = 0
  while (i < lines.length && lines[i].trim() === '') i++
  if (i < lines.length && /^#\s+\S/.test(lines[i])) {
    lines.splice(i, 1)
    while (i < lines.length && lines[i].trim() === '') { lines.splice(i, 1) }
    return lines.join('\n').trim()
  }
  return content
}

async function main() {
  const [s] = await sb('/subjects?level=eq.bepc&name=eq.Physique-Chimie&select=id')
  const chs = await sb(`/chapters?subject_id=eq.${s.id}&select=id,title,order_index&order=order_index`)
  const lss = await sb(`/lessons?chapter_id=in.(${chs.map((c) => c.id).join(',')})&select=*`)

  // Sauvegarde
  const backup = { created_at: new Date().toISOString(), note: 'État AVANT polissage Physique-Chimie 3e', chapters: chs, lessons: lss }
  mkdirSync(join(ROOT, 'backups'), { recursive: true })
  const bfile = join(ROOT, 'backups', `physique-chimie-3e-polish-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  writeFileSync(bfile, JSON.stringify(backup, null, 2), 'utf-8')
  console.log(`Sauvegarde : ${bfile}\n`)

  const byChapter = new Map()
  for (const l of lss) { const a = byChapter.get(l.chapter_id) ?? []; a.push(l); byChapter.set(l.chapter_id, a) }

  let titlesChanged = 0, contentsStripped = 0
  for (const c of chs) {
    const newTitle = TITLES[c.order_index]
    if (newTitle && newTitle !== c.title) {
      console.log(`[${c.order_index}] titre: « ${c.title} » → « ${newTitle} »`)
      titlesChanged++
      if (CONFIRM) await sb(`/chapters?id=eq.${c.id}`, { method: 'PATCH', body: JSON.stringify({ title: newTitle }) })
    }
    const finalTitle = newTitle ?? c.title
    for (const l of byChapter.get(c.id) ?? []) {
      const stripped = stripLeadingH1(l.content ?? '')
      const titleFix = (l.type === 'cours' && newTitle && l.title !== newTitle)
      if (stripped !== (l.content ?? '')) contentsStripped++
      if (CONFIRM && (stripped !== (l.content ?? '') || titleFix)) {
        const body = {}
        if (stripped !== (l.content ?? '')) body.content = stripped
        if (titleFix) body.title = finalTitle
        await sb(`/lessons?id=eq.${l.id}`, { method: 'PATCH', body: JSON.stringify(body) })
      }
    }
  }
  console.log(`\n${CONFIRM ? '✓ Appliqué' : '[DRY-RUN]'} — titres corrigés: ${titlesChanged}, leçons dont le H1 en doublon est retiré: ${contentsStripped}`)
  if (!CONFIRM) console.log('Ajoute --confirm pour appliquer.')
}
main().catch((e) => { console.error('✗', e); process.exit(1) })
