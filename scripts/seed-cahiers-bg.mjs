/**
 * Seed des cours tirés des cahiers manuscrits — Terminale BG.
 *
 * Source : photos de cahiers de cours (WhatsApp), transcrites, remises en
 * ordre, relues puis figées dans `scripts/content/`. La relecture a refait les
 * calculs, corrigé les erreurs de recopie et complété les solutions laissées
 * en blanc.
 *
 *  - MATHÉMATIQUE FINANCIÈRE : matière vide déjà créée depuis la console, on la
 *    remplit (chapitre I seulement, le cahier s'arrête là).
 *  - Statistiques : les chapitres I et II viennent du polycopié METPFQE ; on
 *    ajoute un chapitre III (formulaire et applications du cahier) sans y toucher.
 *
 * La comptabilité générale a son propre seed (`seed-comptabilite-generale-bg.mjs`)
 * et la vie d'entreprise est fusionnée dans `vie-entreprise-lycee-technique.md`.
 *
 * Idempotent : ne crée que ce qui manque, ne supprime rien, et sauvegarde
 * dans `scripts/.backup-cahiers-bg-*.json` ce qu'il remplace.
 *
 * Usage :
 *   node scripts/seed-cahiers-bg.mjs --dry-run
 *   node scripts/seed-cahiers-bg.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { splitExercises, syncExercises } from './lib/exercises.mjs'

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

const TARGET = { level: 'bac_bg', series: 'b2a0a771-e218-48e8-a6f3-d79f468e9f3d' }

// `number` = numéro du « ## Chapitre N » dans la source ; `order` = position dans la matière.
const COURSES = [
  {
    subject: 'MATHÉMATIQUE FINANCIÈRE',
    // Tolère singulier/pluriel, casse et accents de la matière créée depuis la console.
    pattern: 'math*matique*financi*re*',
    file: 'mathematiques-financieres-bg.md',
    chapters: [
      { number: 1, order: 0, title: 'Chapitre I — Les intérêts simples', description: 'Intérêt, taux, durée ; formules selon l’unité de temps, valeur acquise, valeur actuelle ; cinq exercices corrigés.' },
    ],
  },
  {
    subject: 'Statistiques',
    pattern: 'statistique*',
    file: 'statistiques-bg-complements.md',
    chapters: [
      { number: 3, order: 2, title: 'Chapitre III — Les indices composés : formulaire et applications', description: 'IMAS, IMAP, MAIS, MAPIS, Laspeyres, Paasche, Fisher, valeur globale, pouvoir d’achat ; trois applications résolues.' },
    ],
  },
]

/* ── Découpage ──────────────────────────────────────────────────────────── */

for (const course of COURSES) {
  const source = readFileSync(join(__dirname, 'content', course.file), 'utf-8')
  const parts = source.split(/^## Chapitre (\d+) — (.+)$/m)
  // parts = [préambule, n°1, titre1, corps1, n°2, titre2, corps2, …]
  const found = new Map()
  for (let k = 1; k < parts.length; k += 3) found.set(Number(parts[k]), { heading: parts[k + 1].trim(), body: parts[k + 2].trim() })
  if (found.size !== course.chapters.length) throw new Error(`${course.file} : ${found.size} chapitre(s), ${course.chapters.length} attendus.`)
  for (const ch of course.chapters) {
    const c = found.get(ch.number)
    if (!c) throw new Error(`${course.file} : « ## Chapitre ${ch.number} » introuvable.`)
    if (c.body.length < 1000) throw new Error(`Chapitre « ${c.heading} » suspicieusement court (${c.body.length} car.).`)
    // Le cours garde définitions, formules et méthodes ; les exercices vont dans l'espace Exercices.
    const { course, exercises } = splitExercises(c.body)
    ch.content = `## ${c.heading}\n\n${course.trim()}\n`
    ch.exercises = exercises
  }
}

/* ── Installation ───────────────────────────────────────────────────────── */

const backup = []
const tag = DRY_RUN ? '[dry-run] ' : ''

for (const course of COURSES) {
  console.log(`■ ${course.subject} — ${TARGET.level}`)
  const found = await sb(`/subjects?select=id,name&level=eq.${TARGET.level}&name=ilike.${encodeURIComponent(course.pattern)}`)
  if (found.length > 1) throw new Error(`${found.length} matières « ${course.subject} » en ${TARGET.level} : à dédoublonner d'abord.`)
  let subjectId = found[0]?.id
  if (subjectId) console.log(`${tag}  matière déjà présente : « ${found[0].name} » (${subjectId})`)
  else {
    console.log(`${tag}  matière « ${course.subject} » : CRÉATION`)
    if (!DRY_RUN) {
      const [created] = await sb('/subjects', {
        method: 'POST',
        body: JSON.stringify({
          name: course.subject, level: TARGET.level, track_type: 'technique',
          country_code: 'CG', display_order: 0,
        }),
      })
      subjectId = created.id
      console.log(`      → ${subjectId}`)
    }
  }

  for (const ch of course.chapters) {
    if (!subjectId) {
      console.log(`${tag}  ${ch.title} : création`)
      await syncExercises(sb, null, ch.exercises, { dryRun: DRY_RUN, backup })
      continue
    }
    const existing = await sb(`/chapters?select=id&subject_id=eq.${subjectId}&title=eq.${encodeURIComponent(ch.title)}`)
    let chapterId = existing[0]?.id
    if (!chapterId) {
      console.log(`${tag}  ${ch.title} : chapitre créé`)
      if (DRY_RUN) { await syncExercises(sb, null, ch.exercises, { dryRun: DRY_RUN, backup }); continue }
      const [created] = await sb('/chapters', {
        method: 'POST',
        body: JSON.stringify({
          subject_id: subjectId, series_id: TARGET.series,
          title: ch.title, description: ch.description, order_index: ch.order,
        }),
      })
      chapterId = created.id
    }
    await syncExercises(sb, chapterId, ch.exercises, { dryRun: DRY_RUN, backup })

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
  const file = join(__dirname, `.backup-cahiers-bg-${stamp}.json`)
  writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8')
  console.log(`Sauvegarde de l'état précédent : ${file}`)
}

console.log(DRY_RUN ? 'Dry-run terminé — aucune écriture.' : 'Terminé.')
