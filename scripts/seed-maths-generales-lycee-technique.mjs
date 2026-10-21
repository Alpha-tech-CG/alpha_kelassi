/**
 * Seed du cours de MATHÉMATIQUES GÉNÉRALES — Terminales G2, G3, BG et R.
 *
 * Source : polycopié « MES COURS A LA MAISON » du METPFQE (222 pages),
 * converti par `scripts/pdf-cours-to-markdown.mjs` — fractions, radicaux,
 * exposants et tableaux reconstruits — puis figé dans
 * `scripts/content/maths-generales-lycee-technique.md`.
 *
 * Le programme vise quatre séries. Une matière étant rattachée à UN niveau,
 * le contenu est installé une fois par série ; c'est le seul moyen qu'un élève
 * de G3, de BG ou de R le voie.
 *
 * La série R n'existe qu'après la migration 055 : tant qu'elle n'est pas
 * appliquée, le script installe les trois autres et le signale, sans échouer.
 * Il suffit de le relancer ensuite pour compléter.
 *
 * Idempotent : ne crée que ce qui manque, ne supprime jamais rien, et
 * sauvegarde dans `scripts/.backup-maths-generales-*.json` ce qu'il remplace.
 *
 * Usage :
 *   node scripts/seed-maths-generales-lycee-technique.mjs --dry-run
 *   node scripts/seed-maths-generales-lycee-technique.mjs
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

const SUBJECT = 'Mathématiques Générales'
const TARGETS = [
  { level: 'bac_g2', series: 'ef1a3bef-4d82-4f8a-a483-57c57a02248a' },
  { level: 'bac_g3', series: '73c62a1b-1df0-4080-a297-8cedb2f71a5a' },
  { level: 'bac_bg', series: 'b2a0a771-e218-48e8-a6f3-d79f468e9f3d' },
  { level: 'bac_r',  series: '03cc93e4-abc3-46f4-9f39-2016b933e01d' }, // créée par la migration 055
]

/** Les dix fiches du polycopié, dans l'ordre, avec un intitulé lisible. */
const TITLES = [
  { match: /FONCTIONS NUMERIQUES|RAPPELS/i, title: 'Chapitre I — Rappels et compléments sur les fonctions numériques', description: 'Limites, formes indéterminées, continuité, dérivabilité et branches infinies.' },
  { match: /NOMBRES COMPLEXES/i, title: 'Chapitre II — Les nombres complexes', description: 'Forme algébrique, conjugué, module, forme trigonométrique et applications.' },
  { match: /PRIMITIVES|INTEGRAL/i, title: 'Chapitre III — Primitives et calcul intégral', description: 'Recherche de primitives, intégrale définie et méthodes de calcul.' },
  { match: /LOGARITHME/i, title: 'Chapitre IV — Fonctions logarithmes', description: 'Logarithme népérien, propriétés, étude et représentation graphique.' },
  { match: /EXPONENTIELLE/i, title: 'Chapitre V — Fonctions exponentielles et puissances', description: 'Exponentielle, fonctions puissances, croissances comparées.' },
  { match: /EQUATIONS DIFFERENTIELLES/i, title: 'Chapitre VI — Équations différentielles', description: 'Équations linéaires du premier et du second ordre, homogènes ou non.' },
  { match: /SUITES NUMERIQUES/i, title: 'Chapitre VII — Les suites numériques', description: 'Raisonnement par récurrence, limites, suites arithmétiques et géométriques.' },
  { match: /ANALYSE COMBINATOIRE/i, title: 'Chapitre VIII — Analyse combinatoire', description: 'Ensembles finis, p-listes, arrangements, permutations et combinaisons.' },
  { match: /PROBABILITES/i, title: 'Chapitre IX — Probabilités', description: 'Événements, probabilité conditionnelle, variable aléatoire et loi binomiale.' },
  { match: /ALGEBRE LINEAIRE/i, title: 'Chapitre X — Algèbre linéaire', description: 'Espaces vectoriels, applications linéaires, matrices et déterminants.' },
]

/* ── Découpage du polycopié ─────────────────────────────────────────────── */

const source = readFileSync(join(__dirname, 'content', 'maths-generales-lycee-technique.md'), 'utf-8')

// Chaque leçon du polycopié s'ouvre par une fiche pédagogique.
const parts = source.split(/^### FICHE N°.*$/m)
if (parts.length !== TITLES.length) {
  throw new Error(`${parts.length} section(s) découpée(s), ${TITLES.length} attendues.`)
}

const chapters = parts.map((part, i) => {
  const meta = TITLES[i]
  const lines = part.split('\n')
  // La fiche — objectifs, durée, plan du cours — s'adresse au professeur. Le
  // cours proprement dit commence au titre de chapitre ; les deux dernières
  // fiches n'en ont pas, leur plan sert alors de repère.
  let start = lines.findIndex((l) => /^## CHAPITRE/i.test(l))
  if (start < 0) start = lines.findIndex((l) => /^Plan du cours\s*$/i.test(l)) + 1
  if (start <= 0) start = 0
  const body = lines.slice(start).join('\n').trim()
  return { ...meta, order: i, content: `## ${meta.title.replace(/^Chapitre [IVX]+ — /, '')}\n\n${body}\n` }
})

console.log('Chapitres préparés :')
for (const c of chapters) console.log(`  ${String(c.order).padStart(2)}. ${c.title} — ${c.content.length} car.`)
console.log()

/* ── Installation, une matière par série ────────────────────────────────── */

const backup = []
const tag = DRY_RUN ? '[dry-run] ' : ''
const skipped = []

for (const target of TARGETS) {
  // La série R dépend de la migration 055 : on ne bloque pas tout pour elle.
  const known = await sb(`/subjects?select=id&level=eq.${target.level}&limit=1`).catch(() => null)
  if (known === null) {
    skipped.push(target.level)
    console.log(`■ ${target.level} — niveau inconnu de la base, ignoré (migration 055 à appliquer)\n`)
    continue
  }

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
  const file = join(__dirname, `.backup-maths-generales-${stamp}.json`)
  writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8')
  console.log(`Sauvegarde de l'état précédent : ${file}`)
}

if (skipped.length) {
  console.log(`\n⚠ Séries non traitées : ${skipped.join(', ')}. Applique la migration 055 (supabase db push), puis relance ce script.`)
}
console.log(DRY_RUN ? '\nDry-run terminé — aucune écriture.' : '\nTerminé.')
