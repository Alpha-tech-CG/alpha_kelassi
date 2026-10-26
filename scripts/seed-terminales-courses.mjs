/**
 * Import the supplied Terminale English, French and Philosophy Markdown courses.
 *
 * Each top-level teaching section becomes a chapter with one Markdown `cours`
 * lesson. Shared C/D curricula are copied through the linked-chapter RPCs.
 *
 * Usage:
 *   node scripts/seed-terminales-courses.mjs --dry-run
 *   node scripts/seed-terminales-courses.mjs
 */
import { readFileSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split(/\r?\n/)
    .filter((line) => line.includes('=') && !line.trimStart().startsWith('#'))
    .map((line) => {
      const i = line.indexOf('=')
      return [
        line.slice(0, i).trim(),
        line
          .slice(i + 1)
          .trim()
          .replace(/^['"]|['"]$/g, ''),
      ]
    })
)

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error('Configuration Supabase incomplète dans apps/web/.env.local')
}

async function sb(path, init = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: 'return=representation',
      ...(init.headers ?? {}),
    },
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : null
  if (!response.ok) {
    throw new Error(
      `${init.method ?? 'GET'} ${path} -> HTTP ${response.status}: ${JSON.stringify(data)}`
    )
  }
  return data
}

const rpc = (name, args) => sb(`/rpc/${name}`, { method: 'POST', body: JSON.stringify(args) })
const readSource = (file) => readFileSync(join(__dirname, '..', file), 'utf-8')

function parseSections(source, matcher) {
  const lines = source.split(/\r?\n/)
  const marks = []
  lines.forEach((line, index) => {
    const match = line.match(matcher)
    if (match) marks.push({ index, title: match[1].trim() })
  })
  if (!marks.length) throw new Error(`Aucune section pédagogique trouvée (${matcher})`)

  return marks.map((mark, index) => {
    const end = marks[index + 1]?.index ?? lines.length
    const content = lines
      .slice(mark.index + 1, end)
      .join('\n')
      .trim()
    if (content.length < 100) {
      throw new Error(`Section trop courte : « ${mark.title} » (${content.length} caractères)`)
    }
    return { title: mark.title, content, order_index: index }
  })
}

function parseEnglish(source) {
  const lines = source.split(/\r?\n/)
  const part1 = lines.findIndex((line) => /^# PART 1\b/i.test(line))
  const part2 = lines.findIndex((line) => /^# PART 2\b/i.test(line))
  const part3 = lines.findIndex((line) => /^# PART 3\b/i.test(line))
  if (part1 < 0 || part2 < 0 || part3 < 0 || !(part1 < part2 && part2 < part3)) {
    throw new Error('Plan anglais invalide : les trois parties officielles sont requises.')
  }

  const contentUntil = (start, end) =>
    lines
      .slice(start + 1, end)
      .join('\n')
      .trim()
  const chapters = [
    {
      title: 'Objectifs généraux — Les six compétences',
      content: contentUntil(part1, part2),
    },
  ]
  const themes = parseSections(
    lines.slice(part2 + 1, part3).join('\n'),
    /^## (THEME \d+\s*[—–-]\s*.+)$/i
  )
  chapters.push(...themes)
  chapters.push({
    title: 'Référence et préparation à l’examen',
    content: lines
      .slice(part3 + 1)
      .join('\n')
      .trim(),
  })
  chapters.forEach((chapter, index) => {
    chapter.order_index = index
    if (chapter.content.length < 100) {
      throw new Error(`Section anglaise trop courte : « ${chapter.title} »`)
    }
  })
  if (themes.length !== 9 || chapters.length !== 11) {
    throw new Error(
      `Plan anglais incomplet : ${themes.length} thèmes, ${chapters.length} sections.`
    )
  }
  return chapters
}

const frenchChapters = parseSections(
  readSource('cours-francais-terminale-CD.md'),
  /^# ((?:CHAPITRE \d+|DOSSIER|MÉTHODES ET ENTRAÎNEMENT|10 SUJETS|10 TEXTES|BIBLIOGRAPHIE).*)$/i
)
const philosophyCd = parseSections(
  readSource('cours-philosophie-terminale-CD.md'),
  /^# ((?:LEÇON \d+|ANNEXES).+)$/i
)
const philosophyA = parseSections(
  readSource('cours-philosophie-terminale-A.md'),
  /^# ((?:LEÇON \d+|ANNEXES).+)$/i
)
const englishChapters = parseEnglish(readSource('cours-anglais-terminale-ACD_1.md'))

if (frenchChapters.length !== 9 || philosophyCd.length !== 7 || philosophyA.length !== 8) {
  throw new Error(
    `Plan source inattendu : français ${frenchChapters.length}, philosophie C/D ${philosophyCd.length}, philosophie A ${philosophyA.length}.`
  )
}

const legacyPhilosophyC = new Map([
  [0, /^thème 1\s*:\s*la problématique de la philosophie en afrique/i],
  [1, /^theme 2\s*:\s*les rapports de l'homme avec le monde/i],
  [2, /^thème 3\s*:\s*logique et connaissance/i],
  [6, /^méthodologie d'exercices philosophiques/i],
])

async function loadSubjects() {
  const subjects = await sb('/subjects?select=id,name,level&level=in.(bac_a,bac_c,bac_d)')
  const get = (name, level) => {
    const found = subjects.filter(
      (subject) =>
        subject.level === level &&
        subject.name.trim().toLocaleLowerCase('fr') === name.toLocaleLowerCase('fr')
    )
    if (found.length !== 1) {
      throw new Error(
        `Matière introuvable ou ambiguë : ${name}, ${level} (${found.length} résultats).`
      )
    }
    return found[0]
  }
  return {
    english: { a: get('Anglais', 'bac_a'), c: get('Anglais', 'bac_c'), d: get('Anglais', 'bac_d') },
    french: { c: get('Français', 'bac_c'), d: get('Français', 'bac_d') },
    philosophy: {
      a: get('Philosophie', 'bac_a'),
      c: get('Philosophie', 'bac_c'),
      d: get('Philosophie', 'bac_d'),
    },
  }
}

async function chaptersFor(subjectId) {
  return sb(`/chapters?subject_id=eq.${subjectId}&select=*,lessons(*)&order=order_index`)
}

function findChapter(chapters, wanted, legacyPattern) {
  return (
    chapters.find((chapter) => chapter.title.trim() === wanted.title) ??
    (legacyPattern
      ? chapters.find((chapter) => legacyPattern.test(chapter.title.trim()))
      : undefined)
  )
}

const importPlans = []

function planCourse(subject, chapters, description, aliases = new Map()) {
  importPlans.push({ subject, chapters, description, aliases })
}

function addSharedCourse(sourceSubject, copySubjects, chapters, label, aliases = new Map()) {
  planCourse(sourceSubject, chapters, label, aliases)
  for (const copySubject of copySubjects) {
    importPlans.push({
      subject: copySubject,
      sourceSubject,
      chapters,
      description: label,
      aliases: new Map(),
    })
  }
}

async function assertSafeLegacyCleanup(subject, aliases) {
  if (!aliases.size) return
  const existing = await chaptersFor(subject.id)
  const toRemove = []
  for (const pattern of aliases.values()) {
    const chapter = existing.find((candidate) => pattern.test(candidate.title.trim()))
    if (!chapter) continue
    const courses = (chapter.lessons ?? [])
      .filter((lesson) => lesson.type === 'cours')
      .sort((a, b) => a.order_index - b.order_index)
    toRemove.push(...courses.slice(1))
  }
  if (!toRemove.length) return

  const ids = toRemove.map((lesson) => lesson.id)
  const inFilter = `(${ids.join(',')})`
  const [progress, calendar] = await Promise.all([
    sb(`/lesson_progress?lesson_id=in.${inFilter}&select=lesson_id`),
    sb(`/curriculum_items?lesson_id=in.${inFilter}&select=lesson_id`),
  ])
  const referenced = new Set([...progress, ...calendar].map((row) => row.lesson_id))
  if (referenced.size) {
    throw new Error(
      `Mise à jour interrompue : des leçons anciennes à fusionner ont une progression ou un calendrier (${[...referenced].join(', ')}).`
    )
  }
}

async function snapshot(subjects) {
  const records = []
  for (const subject of subjects) {
    records.push({
      subject: { id: subject.id, name: subject.name, level: subject.level },
      chapters: await chaptersFor(subject.id),
    })
  }
  return records
}

async function upsertChapter(subject, section, description, existing, legacyPattern) {
  const chapter = findChapter(existing, section, legacyPattern)
  const fields = {
    title: section.title,
    description,
    order_index: section.order_index,
  }
  let chapterId
  let currentLessons = []

  if (chapter) {
    chapterId = chapter.id
    currentLessons = chapter.lessons ?? []
    await sb(`/chapters?id=eq.${chapterId}`, { method: 'PATCH', body: JSON.stringify(fields) })
  } else {
    const [created] = await sb('/chapters', {
      method: 'POST',
      body: JSON.stringify({ subject_id: subject.id, ...fields }),
    })
    chapterId = created.id
  }

  const courses = currentLessons
    .filter((lesson) => lesson.type === 'cours')
    .sort((a, b) => a.order_index - b.order_index)
  const content = section.content
  if (courses.length) {
    const primary = courses[0]
    await sb(`/lessons?id=eq.${primary.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: section.title,
        content,
        order_index: 0,
        is_premium: false,
      }),
    })
    if (legacyPattern) {
      for (const extra of courses.slice(1)) {
        await sb(`/lessons?id=eq.${extra.id}`, {
          method: 'DELETE',
          headers: { Prefer: 'return=minimal' },
        })
      }
    }
  } else {
    await sb('/lessons', {
      method: 'POST',
      body: JSON.stringify({
        chapter_id: chapterId,
        type: 'cours',
        title: section.title,
        content,
        order_index: 0,
        is_premium: false,
      }),
    })
  }
  return chapterId
}

async function main() {
  const subjects = await loadSubjects()

  addSharedCourse(
    subjects.english.c,
    [subjects.english.d, subjects.english.a],
    englishChapters,
    'Programme officiel INRAP — Anglais Terminale A, C et D.'
  )
  addSharedCourse(
    subjects.french.c,
    [subjects.french.d],
    frenchChapters,
    'Programme officiel INRAP — Français Terminale C et D.'
  )
  addSharedCourse(
    subjects.philosophy.c,
    [subjects.philosophy.d],
    philosophyCd,
    'Programme officiel INRAP — Philosophie Terminale C et D.',
    legacyPhilosophyC
  )
  planCourse(
    subjects.philosophy.a,
    philosophyA,
    'Programme officiel INRAP — Philosophie Terminale A.'
  )

  const affectedSubjects = [
    ...new Map(
      importPlans
        .flatMap((plan) => [plan.subject, plan.sourceSubject].filter(Boolean))
        .map((subject) => [subject.id, subject])
    ).values(),
  ]

  for (const plan of importPlans.filter((candidate) => candidate.aliases.size)) {
    await assertSafeLegacyCleanup(plan.subject, plan.aliases)
  }

  const before = await snapshot(affectedSubjects)
  console.log(`${DRY_RUN ? '[DRY-RUN] ' : ''}Sections pédagogiques préparées :`)
  for (const plan of importPlans.filter((candidate) => !candidate.sourceSubject)) {
    console.log(
      `\n■ ${plan.subject.name} — ${plan.subject.level} (${plan.chapters.length} chapitres)`
    )
    for (const section of plan.chapters) {
      const legacyPattern = plan.aliases.get(section.order_index)
      const existing = before.find((item) => item.subject.id === plan.subject.id)?.chapters ?? []
      const found = findChapter(existing, section, legacyPattern)
      console.log(
        `  ${found ? 'mise à jour' : 'création'} · ${section.title} (${section.content.length} caractères)`
      )
    }
  }
  if (DRY_RUN) {
    console.log('\n[DRY-RUN] Aucune donnée modifiée.')
    return
  }

  const backupFile = join(
    tmpdir(),
    `alpha-kelassi-terminales-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  )
  writeFileSync(backupFile, JSON.stringify(before, null, 2), 'utf-8')
  console.log(`\nSauvegarde préalable : ${backupFile}`)

  for (const plan of importPlans.filter((candidate) => !candidate.sourceSubject)) {
    const existing = await chaptersFor(plan.subject.id)
    const originalIds = []
    for (const section of plan.chapters) {
      const legacyPattern = plan.aliases.get(section.order_index)
      const chapterId = await upsertChapter(
        plan.subject,
        section,
        plan.description,
        existing,
        legacyPattern
      )
      originalIds.push({
        chapterId,
        order_index: section.order_index,
        description: plan.description,
      })
    }

    const copies = importPlans.filter(
      (candidate) => candidate.sourceSubject?.id === plan.subject.id
    )
    for (const copyPlan of copies) {
      for (const original of originalIds) {
        const copyId = await rpc('copy_chapter_to_subject', {
          p_chapter: original.chapterId,
          p_subject: copyPlan.subject.id,
        })
        await sb(`/chapters?id=eq.${copyId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            order_index: original.order_index,
            description: original.description,
          }),
        })
      }
    }
    for (const original of originalIds) {
      await rpc('sync_chapter_copies', { p_chapter: original.chapterId })
    }
  }

  for (const plan of importPlans) {
    const chapters = await chaptersFor(plan.subject.id)
    const missing = plan.chapters.filter(
      (section) =>
        !chapters.some(
          (chapter) =>
            chapter.title.trim() === section.title &&
            (chapter.lessons ?? []).some(
              (lesson) => lesson.type === 'cours' && lesson.content === section.content
            )
        )
    )
    if (missing.length) {
      throw new Error(
        `Vérification après import échouée pour ${plan.subject.name} ${plan.subject.level}: ${missing.map((section) => section.title).join(', ')}`
      )
    }
  }
  console.log('\nImport terminé et vérifié.')
}

main().catch((error) => {
  console.error('Échec de l’import des cours :', error.message)
  process.exit(1)
})
