/**
 * Seed du cours de STATISTIQUES — Terminales G2, G3 et BG (lycée technique).
 *
 * Source : polycopié « MES COURS A LA MAISON » du METPFQE, converti depuis le
 * PDF par `scripts/pdf-cours-to-markdown.mjs` (fractions et tableaux
 * reconstruits) puis figé dans `scripts/content/statistiques-lycee-technique.md`.
 *
 * Le programme vise trois séries. Une matière étant rattachée à UN niveau
 * (`subjects.level`), le contenu est installé une fois par série : c'est le
 * seul moyen qu'un élève de G3 ou de BG le voie. `chapters.series_id` ne filtre
 * rien côté élève, il ne suffirait pas.
 *
 * Idempotent : ne crée que ce qui manque, ne supprime jamais rien. Tout contenu
 * remplacé est d'abord sauvegardé dans `scripts/.backup-statistiques-*.json`.
 *
 * Usage :
 *   node scripts/seed-statistiques-lycee-technique.mjs --dry-run
 *   node scripts/seed-statistiques-lycee-technique.mjs
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

const SUBJECT = 'Statistiques'
/** Séries visées par le polycopié : « SERIE : G2-G3-BG ». */
const TARGETS = [
  { level: 'bac_g2', series: 'ef1a3bef-4d82-4f8a-a483-57c57a02248a' },
  { level: 'bac_g3', series: '73c62a1b-1df0-4080-a297-8cedb2f71a5a' },
  { level: 'bac_bg', series: 'b2a0a771-e218-48e8-a6f3-d79f468e9f3d' },
]

/** Titres retenus, plus lisibles que ceux du polycopié. */
const TITLES = [
  { match: /INDICES/i, title: 'Chapitre I — Les indices statistiques', description: 'Indices simples, propriétés, indices synthétiques : Laspeyres, Paasche, Fisher et IVG.' },
  { match: /PROBABILIT/i, title: 'Chapitre II — Notions de probabilité', description: 'Analyse combinatoire, vocabulaire des événements et calcul des probabilités.' },
]

/* ── Découpage du polycopié en chapitres ────────────────────────────────── */

const source = readFileSync(join(__dirname, 'content', 'statistiques-lycee-technique.md'), 'utf-8')
const parts = source.split(/^## (?=CHAPITRE)/m).slice(1)
if (parts.length !== 2) throw new Error(`${parts.length} chapitre(s) trouvé(s) dans la source, 2 attendus.`)

const chapters = parts.map((part, i) => {
  const meta = TITLES.find((t) => t.match.test(part.split('\n')[0]))
  if (!meta) throw new Error(`Chapitre inattendu : « ${part.split('\n')[0]} »`)
  // La fiche pédagogique qui précède le chapitre suivant (objectifs, durée)
  // s'adresse au professeur : elle n'a pas sa place dans le cours de l'élève.
  const body = part.split(/\n### FICHE N°/)[0].split('\n').slice(1).join('\n').trim()
  return { ...meta, order: i, content: `## ${meta.title.replace(/^Chapitre [IVX]+ — /, '')}\n\n${body}\n` }
})

console.log('Chapitres préparés :')
for (const c of chapters) console.log(`  ${c.order}. ${c.title} — ${c.content.length} caractères`)
console.log()

/* ── Installation, une matière par série ────────────────────────────────── */

const backup = []
const tag = DRY_RUN ? '[dry-run] ' : ''

for (const target of TARGETS) {
  console.log(`■ ${target.level}`)

  const found = await sb(`/subjects?select=id,name,level&level=eq.${target.level}&name=eq.${encodeURIComponent(SUBJECT)}`)
  let subjectId = found[0]?.id
  if (subjectId) console.log(`${tag}  matière « ${SUBJECT} » déjà présente (${subjectId})`)
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
    if (!subjectId) { console.log(`${tag}  ${ch.title} : (matière non créée en dry-run)`); continue }

    const existing = await sb(`/chapters?select=id,title&subject_id=eq.${subjectId}&title=eq.${encodeURIComponent(ch.title)}`)
    let chapterId = existing[0]?.id
    if (chapterId) console.log(`${tag}  ${ch.title} : chapitre déjà présent`)
    else {
      console.log(`${tag}  ${ch.title} : création du chapitre`)
      if (!DRY_RUN) {
        const [created] = await sb('/chapters', {
          method: 'POST',
          body: JSON.stringify({
            subject_id: subjectId, series_id: target.series,
            title: ch.title, description: ch.description, order_index: ch.order,
          }),
        })
        chapterId = created.id
      }
    }
    if (!chapterId) continue

    const lessons = await sb(`/lessons?select=id,type,title,content&chapter_id=eq.${chapterId}&type=eq.cours`)
    if (lessons.length) {
      const l = lessons[0]
      if ((l.content ?? '') === ch.content) { console.log(`${tag}    · cours déjà à jour`); continue }
      backup.push({ table: 'lessons', id: l.id, before: l })
      console.log(`${tag}    · cours mis à jour (${(l.content ?? '').length} → ${ch.content.length} car.)`)
      if (!DRY_RUN) {
        await sb(`/lessons?id=eq.${l.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ title: ch.title, content: ch.content, order_index: 0 }),
        })
      }
    } else {
      console.log(`${tag}    · cours créé (${ch.content.length} car.)`)
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
  const file = join(__dirname, `.backup-statistiques-${stamp}.json`)
  writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8')
  console.log(`Sauvegarde de l'état précédent : ${file}`)
}

console.log(DRY_RUN ? 'Dry-run terminé — aucune écriture.' : 'Terminé.')
