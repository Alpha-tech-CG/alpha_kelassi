/**
 * Restructuration du BEPC (3e) — 06/11/2026, demande utilisateur :
 *   Scinder « Histoire-Géographie » en deux matières : « Histoire » et « Géographie ».
 *
 * Même mécanique que scripts/restructure-terminale-hg.mjs : un chapitre change
 * de matière via `chapters.subject_id` ; ses leçons suivent (chapter_id) et les
 * éventuelles copies liées (source_chapter_id, migr 060) restent valides.
 *
 * Classement (d'après les titres existants en base) :
 *   → Géographie : activités agro-pastorales, activités de service, problèmes de
 *     développement du Congo, états de la sous-région, éléments du milieu
 *     physique, paysage humain, voies de communication et télécommunications.
 *   → Histoire : tout le reste (domination coloniale, AEF, Moyen-Congo,
 *     résistances, 1re/2e Guerres mondiales, crise de 1929, ONU, décolonisation,
 *     indépendance du Congo, Union Africaine).
 *
 * Fin de course : « Histoire-Géographie » est renommée « Histoire » (elle garde
 * ses chapitres d'histoire) ; une nouvelle matière « Géographie » reçoit les
 * chapitres de géographie. Aucun contenu supprimé. Les titres NE sont PAS
 * retouchés ici (la remise en forme est traitée séparément).
 *
 * Usage :
 *   node scripts/restructure-bepc-hg.mjs            (dry-run + backup)
 *   node scripts/restructure-bepc-hg.mjs --confirm
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
  const r = await fetch(`${URL}/rest/v1${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}`, ...(init.headers ?? {}) },
  })
  const t = await r.text(); const d = t ? JSON.parse(t) : null
  if (!r.ok) throw new Error(`${init.method || 'GET'} ${path} -> ${r.status}: ${JSON.stringify(d)}`)
  return d
}

const HG_ID = '40265c11-718c-4670-b84d-938cbdf18fd8' // Histoire-Géographie (BEPC)

/** true = ce chapitre part en Géographie ; false = reste en Histoire. */
function isGeo(title) {
  const t = title.trim()
  return (
    /agro-pastoral/i.test(t) ||
    /activit[ée]s?\s+de\s+service/i.test(t) ||
    /probl[èe]mes?\s+de\s+d[ée]veloppement/i.test(t) ||
    /[ée]tats?\s+de\s+la\s+sous-?r[ée]gion/i.test(t) ||
    /milieu\s+physique/i.test(t) ||
    /paysage\s+humain/i.test(t) ||
    /voies?\s+de\s+communication/i.test(t)
  )
}

const backup = { created_at: new Date().toISOString(), note: 'État AVANT scission BEPC Histoire-Géographie', subjects: [], chapters: [] }

async function main() {
  const [hg] = await sb(`/subjects?id=eq.${HG_ID}&select=*`)
  if (!hg) throw new Error('Matière Histoire-Géographie (BEPC) introuvable.')
  backup.subjects.push(hg)

  const chapters = await sb(`/chapters?subject_id=eq.${HG_ID}&select=id,title,order_index,source_chapter_id&order=order_index`)
  backup.chapters.push(...chapters.map((c) => ({ ...c, _subject_id: HG_ID })))

  const geo = chapters.filter((c) => isGeo(c.title))
  const hist = chapters.filter((c) => !isGeo(c.title))
  console.log(`Histoire-Géographie : ${chapters.length} chapitres → ${geo.length} Géographie / ${hist.length} Histoire`)
  console.log('\n-- Géographie --'); geo.forEach((c, i) => console.log(`  ${i}. ${c.title}`))
  console.log('\n-- Histoire --'); hist.forEach((c, i) => console.log(`  ${i}. ${c.title}`))

  // 1) Renommer Histoire-Géographie → Histoire (garde ses chapitres d'histoire)
  // 2) Créer la matière Géographie
  let geoId = `__NEW_GEO__`
  if (CONFIRM) {
    await sb(`/subjects?id=eq.${HG_ID}`, { method: 'PATCH', body: JSON.stringify({ name: 'Histoire', icon: '📜' }) })
    const [row] = await sb('/subjects', {
      method: 'POST', headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        name: 'Géographie', level: 'bepc', country_code: hg.country_code ?? 'CG',
        icon: '🌍', track_type: hg.track_type ?? 'generale', display_order: hg.display_order ?? 0,
        parent_subject_id: null,
      }),
    })
    geoId = row.id
    console.log(`\n✓ « Histoire-Géographie » renommée « Histoire » ; « Géographie » créée (${geoId.slice(0, 8)})`)
  } else {
    console.log('\n[dry-run] renommerait « Histoire-Géographie » → « Histoire » et créerait « Géographie »')
  }

  // 3) Déplacer les chapitres de géo vers Géographie, réindexés 0..n
  for (let i = 0; i < geo.length; i++) {
    const ch = geo[i]
    if (CONFIRM) await sb(`/chapters?id=eq.${ch.id}`, { method: 'PATCH', body: JSON.stringify({ subject_id: geoId, order_index: i }) })
  }
  // 4) Réindexer les chapitres d'histoire restants 0..m (ordre conservé)
  for (let i = 0; i < hist.length; i++) {
    const ch = hist[i]
    if (ch.order_index !== i && CONFIRM) await sb(`/chapters?id=eq.${ch.id}`, { method: 'PATCH', body: JSON.stringify({ order_index: i }) })
  }
  if (CONFIRM) console.log(`✓ ${geo.length} chapitres déplacés en Géographie ; ${hist.length} réindexés en Histoire`)

  mkdirSync(join(ROOT, 'backups'), { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const file = join(ROOT, 'backups', `bepc-hg-restructure-${stamp}.json`)
  writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8')
  console.log(`\nSauvegarde (état avant) : ${file}`)
  console.log(CONFIRM ? '\nScission appliquée.' : '\n[DRY-RUN] Ajoute --confirm pour appliquer.')
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
