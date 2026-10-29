/**
 * Seed du cours de COMPTABILITÉ ANALYTIQUE DE GESTION — Terminales G2 et G3.
 *
 * Source : polycopié « MES COURS A LA MAISON » du METPFQE (90 pages),
 * converti par `scripts/pdf-cours-to-markdown.mjs` puis figé dans
 * `scripts/content/comptabilite-analytique-lycee-technique.md`.
 *
 * Séries : la couverture annonce « SERIE : G2 » et les objectifs des fiches
 * parlent de « terminale G2, G3 et première BEP » — d'où G2 et G3. BG n'est
 * jamais cité ici, contrairement à la Comptabilité Financière.
 *
 * La numérotation du polycopié est fautive (deux « CHAPITRE N° 6 ») : on lui
 * substitue une numérotation propre, I à VII.
 *
 * Idempotent : ne crée que ce qui manque, ne supprime rien, et sauvegarde
 * dans `scripts/.backup-cage-*.json` ce qu'il remplace.
 *
 * Usage :
 *   node scripts/seed-comptabilite-analytique-lycee-technique.mjs --dry-run
 *   node scripts/seed-comptabilite-analytique-lycee-technique.mjs
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

const SUBJECT = 'Comptabilité Analytique de Gestion'
const TARGETS = [
  { level: 'bac_g2', series: 'ef1a3bef-4d82-4f8a-a483-57c57a02248a' },
  { level: 'bac_g3', series: '73c62a1b-1df0-4080-a297-8cedb2f71a5a' },
]

const TITLES = [
  { title: 'Chapitre I — Introduction à la comptabilité analytique de gestion', description: 'Différences avec la comptabilité financière, charges directes et indirectes, sections homogènes.' },
  { title: 'Chapitre II — Les fondements de la comptabilité analytique', description: 'Notion de coût, hiérarchisation, éléments constitutifs et calcul des coûts.' },
  { title: 'Chapitre III — Le tableau d’exploitation', description: 'Tableau d’exploitation fonctionnel et différentiel.' },
  { title: 'Chapitre IV — La production aux coûts complets', description: 'Coût d’achat, coût de production, coût de revient et résultat analytique.' },
  { title: 'Chapitre V — L’imputation rationnelle des charges fixes', description: 'Niveau d’activité normale, coefficient d’imputation, boni et mali de suractivité.' },
  { title: 'Chapitre VI — La fabrication sur commande', description: 'Calcul des coûts par commande et suivi des travaux en cours.' },
  { title: 'Chapitre VII — La gestion prévisionnelle', description: 'Notion de budget, coûts préétablis et analyse des écarts.' },
]

/* ── Découpage ──────────────────────────────────────────────────────────── */

const source = readFileSync(join(__dirname, 'content', 'comptabilite-analytique-lycee-technique.md'), 'utf-8')
const parts = source.split(/^### FICHE N°.*$/m).filter((p, i) => i > 0 || p.trim())
if (parts.length !== TITLES.length) throw new Error(`${parts.length} section(s), ${TITLES.length} attendues.`)

const chapters = parts.map((part, i) => {
  const lines = part.split('\n')
  // La fiche pédagogique — objectifs, durée, plan du cours — se termine
  // toujours par sa CONCLUSION ; le cours de l'élève commence après. Ce repère
  // vaut mieux que le titre de chapitre, que le plan cite lui aussi.
  const head = lines.slice(0, 60)
  let start = head.map((l, k) => (/^### CONCLUSION/i.test(l) ? k : -1)).filter((k) => k >= 0).pop()
  start = start != null ? start + 1 : Math.max(0, lines.findIndex((l) => /^## CHAPITRE/i.test(l)))
  const body = lines.slice(start).join('\n').trim()
  if (body.length < 500) throw new Error(`Chapitre « ${TITLES[i].title} » suspicieusement court (${body.length} car.).`)
  return { ...TITLES[i], order: i, content: `## ${TITLES[i].title.replace(/^Chapitre [IVX]+ — /, '')}\n\n${body}\n` }
})

console.log('Chapitres préparés :')
for (const c of chapters) console.log(`  ${c.order}. ${c.title} — ${c.content.length} car.`)
console.log()

/* ── Installation ───────────────────────────────────────────────────────── */

const backup = []
const tag = DRY_RUN ? '[dry-run] ' : ''

for (const target of TARGETS) {
  console.log(`■ ${target.level}`)
  const found = await sb(`/subjects?select=id&level=eq.${target.level}&name=eq.${encodeURIComponent(SUBJECT)}`)
  let subjectId = found[0]?.id
  if (subjectId) console.log(`${tag}  matière déjà présente (${subjectId})`)
  else {
    console.log(`${tag}  matière « ${SUBJECT} » : CRÉATION`)
    if (!DRY_RUN) {
      const [created] = await sb('/subjects', {
        method: 'POST',
        body: JSON.stringify({
          name: SUBJECT, level: target.level, track_type: 'technique',
          country_code: 'CG', display_order: 0,
        }),
      })
      subjectId = created.id
      console.log(`      → ${subjectId}`)
    }
  }

  for (const ch of chapters) {
    if (!subjectId) break
    const existing = await sb(`/chapters?select=id&subject_id=eq.${subjectId}&title=eq.${encodeURIComponent(ch.title)}`)
    let chapterId = existing[0]?.id
    if (!chapterId) {
      if (DRY_RUN) { console.log(`${tag}  ${ch.title} : création`); continue }
      const [created] = await sb('/chapters', {
        method: 'POST',
        body: JSON.stringify({
          subject_id: subjectId, series_id: target.series,
          title: ch.title, description: ch.description, order_index: ch.order,
        }),
      })
      chapterId = created.id
    }

    const lessons = await sb(`/lessons?select=id,type,title,content&chapter_id=eq.${chapterId}&type=eq.cours`)
    if (lessons.length) {
      const l = lessons[0]
      if ((l.content ?? '') === ch.content) continue
      backup.push({ table: 'lessons', id: l.id, before: l })
      console.log(`${tag}  ${ch.title} : cours mis à jour`)
      if (!DRY_RUN) {
        await sb(`/lessons?id=eq.${l.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ title: ch.title, content: ch.content, order_index: 0 }),
        })
      }
    } else {
      console.log(`${tag}  ${ch.title} : cours créé (${ch.content.length} car.)`)
      if (!DRY_RUN) {
        await sb('/lessons', {
          method: 'POST',
          body: JSON.stringify({
            chapter_id: chapterId, type: 'cours', title: ch.title,
            content: ch.content, order_index: 0, is_premium: false,
          }),
        })
      }
    }
  }
  console.log()
}

if (!DRY_RUN && backup.length) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const file = join(__dirname, `.backup-cage-${stamp}.json`)
  writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8')
  console.log(`Sauvegarde de l'état précédent : ${file}`)
}

console.log(DRY_RUN ? 'Dry-run terminé — aucune écriture.' : 'Terminé.')
