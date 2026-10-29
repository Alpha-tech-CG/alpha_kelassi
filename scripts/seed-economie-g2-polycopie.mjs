/**
 * Remplace le cours d'ÉCONOMIE — Terminale G2 — par la version du polycopié
 * METPFQE.
 *
 * La matière existait déjà, montée à partir du texte fourni par l'enseignant
 * (cf. `scripts/seed-economie-g2.mjs`). Sur demande, on lui substitue le texte
 * officiel du ministère, converti depuis son PDF.
 *
 * ⚠ Seules les leçons de type `cours` sont remplacées. Les **résumés** et les
 * **QCM** — cinq QCM, 71 questions — sont rattachés respectivement aux leçons
 * `resume` et aux chapitres : ils sont conservés intacts.
 *
 * Le titre du chapitre III est fautif dans le polycopié (« LES SYSTEMES
 * ECONOMIQUES ANCIENS » alors qu'il traite du capitalisme et du socialisme) :
 * les chapitres sont donc retrouvés par leur NUMÉRO, pas par leur intitulé.
 *
 * Tout contenu remplacé est sauvegardé dans `scripts/.backup-economie-poly-*.json`.
 *
 * Usage :
 *   node scripts/seed-economie-g2-polycopie.mjs --dry-run
 *   node scripts/seed-economie-g2-polycopie.mjs
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

const SUBJECT_ECO_G2 = '735ad634-4a71-4fe0-821b-38a58fb765a4'
const ROMAN = ['I', 'II', 'III', 'IV', 'V']

/* ── Découpage ──────────────────────────────────────────────────────────── */

const source = readFileSync(join(__dirname, 'content', 'economie-g2-polycopie.md'), 'utf-8')
const lines = source.split('\n')

// Le polycopié annonce chaque chapitre dans son plan avant de le développer :
// le titre apparaît deux fois. On garde l'occurrence suivie du plus de texte.
const marks = []
lines.forEach((l, i) => {
  const m = l.match(/^##\s+CHAPITRE\s*[-–]?\s*([IVX]+)\s*[-–:]/i)
  if (m) marks.push({ i, roman: m[1].toUpperCase() })
})

const chapters = ROMAN.map((roman, k) => {
  const candidates = marks.filter((m) => m.roman === roman)
  if (!candidates.length) throw new Error(`Chapitre ${roman} introuvable.`)
  const best = candidates
    .map((c) => {
      const next = marks.find((m) => m.i > c.i)
      return { ...c, len: lines.slice(c.i + 1, next ? next.i : lines.length).join('\n').trim().length }
    })
    .sort((a, b) => b.len - a.len)[0]
  const next = marks.find((m) => m.i > best.i)
  const body = lines.slice(best.i + 1, next ? next.i : lines.length).join('\n').trim()
  if (body.length < 1500) throw new Error(`Chapitre ${roman} suspicieusement court (${body.length} car.).`)
  return { number: k + 1, roman, body }
})

/* ── Remplacement ───────────────────────────────────────────────────────── */

const [subject] = await sb(`/subjects?select=id,name,level&id=eq.${SUBJECT_ECO_G2}`)
if (!subject || subject.level !== 'bac_g2' || !/économie/i.test(subject.name)) {
  throw new Error(`Matière inattendue : ${JSON.stringify(subject)}. Abandon.`)
}
console.log(`Matière : ${subject.name} — ${subject.level}\n`)

const existing = await sb(`/chapters?select=id,title,order_index&subject_id=eq.${SUBJECT_ECO_G2}&order=order_index`)
const numberOf = (t) => {
  const m = t.match(/\bChapitre\s+([IVX]+)\b/i)
  return m ? ROMAN.indexOf(m[1].toUpperCase()) + 1 : null
}

const backup = []
const tag = DRY_RUN ? '[dry-run] ' : ''

for (const ch of chapters) {
  const target = existing.find((e) => numberOf(e.title) === ch.number)
  if (!target) { console.log(`⚠ chapitre ${ch.roman} : aucun chapitre correspondant en base, ignoré`); continue }

  const lessons = await sb(`/lessons?select=id,type,title,content&chapter_id=eq.${target.id}&order=order_index`)
  const cours = lessons.find((l) => l.type === 'cours')
  const resume = lessons.find((l) => l.type === 'resume')
  // Le titre du chapitre reste celui déjà en base : il est correct, alors que
  // celui du polycopié se trompe pour le chapitre III.
  const content = `## ${target.title.replace(/^Chapitre [IVX]+ — /, '')}\n\n${ch.body}\n`

  console.log(`${tag}${target.title}`)
  if (cours) {
    backup.push({ table: 'lessons', id: cours.id, before: cours })
    console.log(`${tag}   cours : ${cours.content.length} → ${content.length} car. (résumé de ${(resume?.content ?? '').length} car. conservé)`)
    if (!DRY_RUN) {
      await sb(`/lessons?id=eq.${cours.id}`, { method: 'PATCH', body: JSON.stringify({ content }) })
    }
  } else {
    console.log(`${tag}   cours créé (${content.length} car.)`)
    if (!DRY_RUN) {
      await sb('/lessons', {
        method: 'POST',
        body: JSON.stringify({
          chapter_id: target.id, type: 'cours', title: target.title,
          content, order_index: 0, is_premium: false,
        }),
      })
    }
  }
}

if (!DRY_RUN && backup.length) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const file = join(__dirname, `.backup-economie-poly-${stamp}.json`)
  writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8')
  console.log(`\nSauvegarde de la version précédente : ${file}`)
}

console.log(DRY_RUN ? '\nDry-run terminé — aucune écriture.' : '\nTerminé.')
