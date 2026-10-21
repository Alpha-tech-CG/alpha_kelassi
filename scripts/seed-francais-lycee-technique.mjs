/**
 * Seed du cours de FRANÇAIS — Terminales G2, G3, BG et R.
 *
 * Source : polycopié « MES COURS A LA MAISON » du METPFQE, converti par
 * `scripts/pdf-cours-to-markdown.mjs` puis figé dans
 * `scripts/content/francais-lycee-technique.md`. Couverture : « SERIE : G, BG
 * et R » — le G couvre G2 et G3, les seules séries G de l'application.
 *
 * ⚠ Une matière FRANÇAIS saisie à la main existe déjà en G2, avec les mêmes
 * dix chapitres numérotés autrement (« CHAPITRE 1 », « FICHE 10 »…). Le script
 * RETROUVE ces chapitres par leur numéro et met à jour leur leçon, au lieu
 * d'en créer dix doublons. Les titres sont normalisés au passage et l'ancien
 * contenu est sauvegardé avant écrasement.
 *
 * Usage :
 *   node scripts/seed-francais-lycee-technique.mjs --dry-run
 *   node scripts/seed-francais-lycee-technique.mjs
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

const SUBJECT = 'FRANÇAIS'
const TARGETS = [
  { level: 'bac_g2', series: 'ef1a3bef-4d82-4f8a-a483-57c57a02248a' },
  { level: 'bac_g3', series: '73c62a1b-1df0-4080-a297-8cedb2f71a5a' },
  { level: 'bac_bg', series: 'b2a0a771-e218-48e8-a6f3-d79f468e9f3d' },
  { level: 'bac_r',  series: '03cc93e4-abc3-46f4-9f39-2016b933e01d' },
]

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
const TITLES = [
  'L’argumentation', 'Les connecteurs logiques', 'Le paragraphe argumentatif',
  'Les types de plans en dissertation', 'Méthodologie de la dissertation française',
  'Analyse d’un sujet de dissertation', 'Le résumé et la discussion',
  'Les procédés de reformulation', 'L’accord du participe passé', 'Les figures de style',
]
const DESCRIPTIONS = [
  'Thème, thèse, argument et exemple : les éléments structurels de l’argumentation.',
  'Valeurs de cause, conséquence, opposition, addition, but, explication et conclusion.',
  'Définition et structure d’un paragraphe argumentatif.',
  'Plan dialectique, analytique et thématique.',
  'Les étapes de la dissertation, de l’introduction à la conclusion.',
  'Repérage du thème, de la thèse et de la consigne dans un sujet.',
  'Techniques du résumé de texte et de la discussion argumentée.',
  'Reformuler sans trahir : synonymie, nominalisation, périphrase.',
  'Règles d’accord avec avoir, être et les verbes pronominaux.',
  'Comparaison, métaphore, métonymie, hyperbole et les autres figures.',
]

/* ── Découpage ──────────────────────────────────────────────────────────── */

const source = readFileSync(join(__dirname, 'content', 'francais-lycee-technique.md'), 'utf-8')
const lines = source.split('\n')

// Le polycopié annonce ses chapitres dans un plan de trimestre avant de les
// développer : le même titre apparaît donc deux fois. On garde l'occurrence
// suivie du plus de texte — le cours, pas le sommaire.
const marks = []
lines.forEach((l, i) => {
  const m = l.match(/^##\s+chapitre\s+([IVX]+)\s*:/i)
  if (m) marks.push({ i, roman: m[1].toUpperCase() })
})

const chapters = ROMAN.map((roman, k) => {
  const candidates = marks.filter((m) => m.roman === roman)
  if (!candidates.length) throw new Error(`Chapitre ${roman} introuvable dans la source.`)
  const withLength = candidates.map((c) => {
    const next = marks.find((m) => m.i > c.i)
    return { ...c, len: lines.slice(c.i + 1, next ? next.i : lines.length).join('\n').trim().length }
  })
  const best = withLength.sort((a, b) => b.len - a.len)[0]
  const next = marks.find((m) => m.i > best.i)
  const body = lines.slice(best.i + 1, next ? next.i : lines.length).join('\n').trim()
  if (body.length < 800) throw new Error(`Chapitre ${roman} suspicieusement court (${body.length} car.).`)
  return {
    number: k + 1, roman,
    title: `Chapitre ${roman} — ${TITLES[k]}`,
    description: DESCRIPTIONS[k],
    order: k,
    content: `## ${TITLES[k]}\n\n${body}\n`,
  }
})

console.log('Chapitres préparés :')
for (const c of chapters) console.log(`  ${String(c.number).padStart(2)}. ${c.title} — ${c.content.length} car.`)
console.log()

/* ── Installation ───────────────────────────────────────────────────────── */

const backup = []
const tag = DRY_RUN ? '[dry-run] ' : ''

/**
 * En G2 le cours a été saisi à la main et tient la comparaison avec le
 * polycopié — plus long sur sept chapitres sur dix. On n'y remplace donc rien
 * par défaut : seuls les titres sont normalisés. `--remplacer-g2` force le
 * remplacement, l'ancien contenu restant sauvegardé.
 */
const REPLACE_G2 = process.argv.includes('--remplacer-g2')

/** Numéro de chapitre lu dans un intitulé libre : « CHAPITREE 3 », « FICHE 10 »… */
function numberOf(title) {
  const arabic = title.match(/\b(\d{1,2})\b/)
  if (arabic) return Number(arabic[1])
  const roman = title.match(/\b(I{1,3}|IV|VI{0,3}|IX|X)\b/i)
  return roman ? ROMAN.indexOf(roman[1].toUpperCase()) + 1 : null
}

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
  if (!subjectId) { console.log(); continue }

  const existing = await sb(`/chapters?select=id,title,order_index&subject_id=eq.${subjectId}&order=order_index`)

  for (const ch of chapters) {
    // On retrouve le chapitre par son NUMÉRO, jamais par son titre : la saisie
    // manuelle les nomme autrement (« CHAPITREE 3 », « FICHE 10 »).
    const match = existing.find((e) => numberOf(e.title) === ch.number)
    let chapterId = match?.id

    if (match) {
      if (match.title !== ch.title) {
        backup.push({ table: 'chapters', id: match.id, before: { title: match.title, order_index: match.order_index } })
        console.log(`${tag}  [${ch.number}] « ${match.title.trim()} » → « ${ch.title} »`)
        if (!DRY_RUN) {
          await sb(`/chapters?id=eq.${match.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ title: ch.title, description: ch.description, order_index: ch.order, series_id: target.series }),
          })
        }
      }
    } else {
      console.log(`${tag}  [${ch.number}] création du chapitre`)
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
    if (!chapterId) continue

    const lessons = await sb(`/lessons?select=id,type,title,content&chapter_id=eq.${chapterId}&type=eq.cours`)
    if (lessons.length) {
      const l = lessons[0]
      if ((l.content ?? '') === ch.content) continue
      if (target.level === 'bac_g2' && !REPLACE_G2) {
        const diff = ch.content.length - (l.content ?? '').length
        console.log(`${tag}      cours conservé (saisie manuelle, ${(l.content ?? '').length} car. ; le polycopié en ferait ${diff > 0 ? '+' : ''}${diff})`)
        continue
      }
      backup.push({ table: 'lessons', id: l.id, before: l })
      console.log(`${tag}      cours remplacé (${(l.content ?? '').length} → ${ch.content.length} car.)`)
      if (!DRY_RUN) {
        await sb(`/lessons?id=eq.${l.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ title: ch.title, content: ch.content, order_index: 0 }),
        })
      }
    } else {
      console.log(`${tag}      cours créé (${ch.content.length} car.)`)
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
  const file = join(__dirname, `.backup-francais-${stamp}.json`)
  writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8')
  console.log(`Sauvegarde de l'état précédent : ${file}`)
}

console.log(DRY_RUN ? 'Dry-run terminé — aucune écriture.' : 'Terminé.')
