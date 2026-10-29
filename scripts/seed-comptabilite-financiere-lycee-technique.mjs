/**
 * Seed du cours de COMPTABILITÉ FINANCIÈRE — Terminales G2, G3 et BG.
 *
 * Source : polycopié « MES COURS A LA MAISON » du METPFQE (121 pages),
 * converti par `scripts/pdf-cours-to-markdown.mjs` puis figé dans
 * `scripts/content/comptabilite-financiere-lycee-technique.md`.
 *
 * ⚠ Séries visées : la couverture annonce « SERIE : G3 », mais les objectifs
 * des fiches parlent de « terminale G2, G3, BG et première BEP ». On retient
 * l'union — G2, G3, BG —, la première BEP n'étant pas une classe d'examen de
 * l'application. À confirmer avec l'enseignant.
 *
 * Idempotent : ne crée que ce qui manque, ne supprime jamais rien, et
 * sauvegarde dans `scripts/.backup-comptabilite-*.json` ce qu'il remplace.
 *
 * Usage :
 *   node scripts/seed-comptabilite-financiere-lycee-technique.mjs --dry-run
 *   node scripts/seed-comptabilite-financiere-lycee-technique.mjs
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

const SUBJECT = 'Comptabilité Financière'
const TARGETS = [
  { level: 'bac_g2', series: 'ef1a3bef-4d82-4f8a-a483-57c57a02248a' },
  { level: 'bac_g3', series: '73c62a1b-1df0-4080-a297-8cedb2f71a5a' },
  { level: 'bac_bg', series: 'b2a0a771-e218-48e8-a6f3-d79f468e9f3d' },
]

const TITLES = [
  { match: /TRAVAUX DE FIN/i, title: 'Chapitre I — Les travaux de fin d’exercice', description: 'Obligations légales et fiscales, grandes étapes de l’inventaire annuel.' },
  { match: /AMORTISSEMENTS/i, title: 'Chapitre II — Les amortissements', description: 'Modes linéaire et dégressif, plans d’amortissement, comptabilisation.' },
  { match: /DECOMPTABILISATION/i, title: 'Chapitre III — La décomptabilisation', description: 'Cessions d’immobilisations amortissables ou non, titres de placement.' },
  { match: /DEPRECIATIONS/i, title: 'Chapitre IV — Les dépréciations', description: 'Définition, objet et types de dépréciations d’actifs.' },
  { match: /PROVISIONS/i, title: 'Chapitre V — Les provisions pour risques et charges', description: 'Provisions pour risques, pour charges, et leur comptabilisation.' },
  { match: /AUTRES REGULARISATIONS/i, title: 'Chapitre VI — Les autres régularisations', description: 'Régularisation des comptes de bilan et des comptes de gestion.' },
]

/* ── Découpage ──────────────────────────────────────────────────────────── */

const source = readFileSync(join(__dirname, 'content', 'comptabilite-financiere-lycee-technique.md'), 'utf-8')
const parts = source.split(/^### FICHE N°.*$/m)
if (parts.length !== TITLES.length) throw new Error(`${parts.length} section(s), ${TITLES.length} attendues.`)

const chapters = parts.map((part, i) => {
  const meta = TITLES[i]
  const lines = part.split('\n')
  // La fiche pédagogique — objectifs, durée, plan — s'adresse au professeur.
  let start = lines.findIndex((l) => /^## CHAPITRE/i.test(l))
  if (start < 0) start = 0
  const body = lines.slice(start).join('\n').trim()
  if (!body) throw new Error(`Chapitre « ${meta.title} » vide après découpage.`)
  return { ...meta, order: i, content: `## ${meta.title.replace(/^Chapitre [IVX]+ — /, '')}\n\n${body}\n` }
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
  const file = join(__dirname, `.backup-comptabilite-${stamp}.json`)
  writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8')
  console.log(`Sauvegarde de l'état précédent : ${file}`)
}

console.log(DRY_RUN ? 'Dry-run terminé — aucune écriture.' : 'Terminé.')
