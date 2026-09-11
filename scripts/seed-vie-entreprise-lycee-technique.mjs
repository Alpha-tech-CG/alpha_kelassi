/**
 * Seed du cours de VIE D'ENTREPRISE — Terminales G2, G3 et BG.
 *
 * Source : cours manuscrit transcrit (`vieentrepriseterminaleg.md`), relu puis
 * figé dans `scripts/content/vie-entreprise-lycee-technique.md`. La relecture
 * a rétabli les passages illisibles ou contradictoires de la transcription et
 * résolu entièrement l'exemple des gâteaux.
 *
 * Une matière étant rattachée à UN niveau, le cours est installé une fois par
 * série. En BG, une matière « VIE D'ENTREPRISE » vide existait déjà (créée depuis
 * la console) : on la remplit au lieu d'en créer une seconde.
 *
 * Idempotent : ne crée que ce qui manque, ne supprime rien, et sauvegarde
 * dans `scripts/.backup-vie-entreprise-*.json` ce qu'il remplace.
 *
 * Usage :
 *   node scripts/seed-vie-entreprise-lycee-technique.mjs --dry-run
 *   node scripts/seed-vie-entreprise-lycee-technique.mjs
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

const SUBJECT = "VIE D'ENTREPRISE"
const TARGETS = [
  { level: 'bac_g2', series: 'ef1a3bef-4d82-4f8a-a483-57c57a02248a' },
  { level: 'bac_g3', series: '73c62a1b-1df0-4080-a297-8cedb2f71a5a' },
  { level: 'bac_bg', series: 'b2a0a771-e218-48e8-a6f3-d79f468e9f3d' },
]

const TITLES = [
  { title: 'Chapitre I — Le pilotage de l’entreprise', description: 'Tableau de bord, modules pilote, opérationnel et de contrôle, pilotage social.' },
  { title: 'Chapitre II — Le processus de décision', description: 'Étapes de la décision et classification selon le temps, le niveau et le risque.' },
  { title: 'Chapitre III — Les pouvoirs et les niveaux de décision', description: 'Niveaux de décision, délégation de pouvoirs et décentralisation.' },
  { title: 'Chapitre IV — La programmation linéaire', description: 'Formalisation, résolution graphique et algébrique, plein emploi ; exemple résolu.' },
  { title: 'Chapitre V — Les graphes et l’ordonnancement des tâches', description: 'Chemin critique, tâches fictives, méthode PERT, dates et marges.' },
  { title: 'Chapitre VI — Les coûts de production', description: 'Coûts fixes, variables, totaux, moyens et marginal ; seuils et optimum.' },
  { title: 'Chapitre VII — Le marché', description: 'Études de marché, structures de marché, concurrence pure et parfaite, équilibre.' },
]

/* ── Découpage ──────────────────────────────────────────────────────────── */

const source = readFileSync(join(__dirname, 'content', 'vie-entreprise-lycee-technique.md'), 'utf-8')
const parts = source.split(/^## Chapitre \d+ — (.+)$/m)
// parts = [préambule, titre1, corps1, titre2, corps2, …]
const chapters = []
for (let k = 1; k < parts.length; k += 2) chapters.push({ heading: parts[k].trim(), body: parts[k + 1].trim() })
if (chapters.length !== TITLES.length) throw new Error(`${chapters.length} chapitre(s), ${TITLES.length} attendus.`)

const prepared = chapters.map((c, i) => {
  if (c.body.length < 1000) throw new Error(`Chapitre « ${c.heading} » suspicieusement court (${c.body.length} car.).`)
  return { ...TITLES[i], order: i, content: `## ${c.heading}\n\n${c.body}\n` }
})

console.log('Chapitres préparés :')
for (const c of prepared) console.log(`  ${c.order}. ${c.title} — ${c.content.length} car.`)
console.log()

/* ── Installation ───────────────────────────────────────────────────────── */

const backup = []
const tag = DRY_RUN ? '[dry-run] ' : ''

for (const target of TARGETS) {
  console.log(`■ ${target.level}`)
  // Tolère les variantes de saisie (« Vie d'entreprise », apostrophe typographique…).
  const found = await sb(`/subjects?select=id,name&level=eq.${target.level}&name=ilike.${encodeURIComponent('vie d*entreprise')}`)
  if (found.length > 1) throw new Error(`${found.length} matières « vie d'entreprise » en ${target.level} : à dédoublonner d'abord.`)
  let subjectId = found[0]?.id
  if (subjectId) console.log(`${tag}  matière déjà présente : « ${found[0].name} » (${subjectId})`)
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

  for (const ch of prepared) {
    if (!subjectId) { console.log(`${tag}  ${ch.title} : création`); continue }
    const existing = await sb(`/chapters?select=id&subject_id=eq.${subjectId}&title=eq.${encodeURIComponent(ch.title)}`)
    let chapterId = existing[0]?.id
    if (!chapterId) {
      console.log(`${tag}  ${ch.title} : chapitre créé`)
      if (DRY_RUN) continue
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
      if ((l.content ?? '') === ch.content) { console.log(`  ${ch.title} : à jour`); continue }
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
  const file = join(__dirname, `.backup-vie-entreprise-${stamp}.json`)
  writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8')
  console.log(`Sauvegarde de l'état précédent : ${file}`)
}

console.log(DRY_RUN ? 'Dry-run terminé — aucune écriture.' : 'Terminé.')
