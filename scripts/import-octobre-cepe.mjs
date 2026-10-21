/**
 * Import du contenu réel d'Octobre depuis cepe_programme_complet.md (fourni par
 * l'utilisateur) — seul mois entièrement rédigé du fichier (Nov-Juin ne sont que
 * des squelettes placeholder, volontairement exclus).
 *
 * Mappe les 12 leçons/4 fiches d'exercices/3 tests mensuels d'Octobre sur les
 * chapitres CEPE déjà en base (migration 044/045). Crée 2 chapitres manquants
 * (Éveil) quand aucun chapitre existant ne correspond au sujet. Réaligne aussi
 * curriculum_items.school_month_id sur Octobre pour les chapitres concernés,
 * pour que calendrier et contenu restent cohérents.
 *
 * Usage : node scripts/import-octobre-cepe.mjs [--dry-run]
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split('\n').filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

async function sb(path, init) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json', apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      Prefer: 'return=representation', ...(init?.headers ?? {}),
    },
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : null
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> HTTP ${res.status}: ${JSON.stringify(json)}`)
  return json
}

// ── 1. Source : parse cepe_programme_complet.md (corruption d'encodage nettoyée) ──
const SRC_PATH = process.argv.find((a) => a.endsWith('.md')) ?? join(__dirname, '..', '..', 'cepe_programme_complet.md')
const RAW = readFileSync(process.env.CEPE_PROGRAMME_PATH ?? SRC_PATH, 'utf8')
const text = RAW.replace(/[·²⁰—]/g, '') // strip corruption noise (·, ², ⁰, —)

function parseOctobre(text) {
  const lines = text.split('\n')
  const month = { subjects: {}, tests: [] }
  let curSubject = null, curSection = null, curLesson = null, curExercise = null, curTest = null
  let inOctobre = false, done = false

  const flushLesson = () => { if (curLesson) { curSubject.cours.push(curLesson); curLesson = null } }
  const flushExercise = () => { if (curExercise) { curSubject.exercices.push(curExercise); curExercise = null } }
  const flushTest = () => { if (curTest) { month.tests.push(curTest); curTest = null } }

  for (const line of lines) {
    if (done) break
    let m
    if ((m = line.match(/^## (\S+) [–-] (T\d)/))) {
      if (inOctobre) { flushLesson(); flushExercise(); flushTest(); done = true; break }
      inOctobre = m[1] === 'Octobre'
      continue
    }
    if (!inOctobre) continue
    if ((m = line.match(/^### (Francais|Mathematiques|Eveil)$/))) {
      flushLesson(); flushExercise()
      curSubject = { name: m[1], cours: [], exercices: [] }
      month.subjects[m[1]] = curSubject
      curSection = null; continue
    }
    if (line.match(/^### Test de fin de mois$/)) { flushLesson(); flushExercise(); curSubject = null; continue }
    if ((m = line.match(/^### Test de fin de mois [–-] \S+ [–-] (\S+)$/))) { flushTest(); curTest = { subject: m[1], body: [] }; continue }
    if (line === '#### Cours') { flushLesson(); curSection = 'cours'; continue }
    if (line === '#### Exercices') { flushLesson(); flushExercise(); curSection = 'exercices'; continue }
    if (curSection === 'cours' && line.match(/^#### /)) { flushLesson(); curLesson = { titre: line.replace(/^#### /, ''), body: [] }; continue }
    if (curSection === 'exercices' && line.match(/^#### /)) { flushExercise(); curExercise = { titre: line.replace(/^#### /, ''), body: [] }; continue }
    if (curLesson) curLesson.body.push(line)
    if (curExercise) curExercise.body.push(line)
    if (curTest) curTest.body.push(line)
  }
  return month
}

const oct = parseOctobre(text)

// ── 2. Table de correspondance leçon → chapitre (décidée manuellement, cf. résumé fourni à l'utilisateur) ──
const LESSON_TO_CHAPTER = {
  'Lecture‑compréhension – Texte narratif':          'Comprendre un texte : stratégies de compréhension',
  'Types et formes de phrases':                       'Les types de phrases',
  'Conjugaison – Présent des verbes du 1er groupe':   "Le présent de l'indicatif — 1er groupe",
  'Expression écrite – Le récit':                     'La structure d\'un devoir de rédaction',
  "Les grands nombres (jusqu'au milliard)":           'La numération décimale — Rappels',
  'Addition / soustraction avec grands nombres':      'Addition et soustraction rapides',
  'Multiplication (1 ou 2 chiffres)':                 'Multiplication et division rapides',
  'Résolution de problèmes (4 opérations)':           "Méthode de résolution d'un problème",
  'Gégraphie – Localisation du Congo':                'Le Congo : fleuve, relief et départements',
  'Sciences – Hygiène du corps':                       "L'hygiène et la prévention des maladies",
  // Pas de chapitre existant pour ces 2 sujets → nouveaux chapitres créés ci-dessous.
  'Histoire – Premiers habitants et royaumes traditionnels': null,
  'Éducation civique – Famille et école':              null,
}
const NEW_CHAPTERS = {
  'Histoire – Premiers habitants et royaumes traditionnels': { domain: 'Histoire-Géographie', title: 'Les premiers habitants et royaumes traditionnels' },
  'Éducation civique – Famille et école':                     { domain: 'Éducation civique & santé', title: 'La famille et l\'école' },
}

function bodyToMarkdown(body) {
  const text = body.join('\n')
  const objectifs = [...text.matchAll(/^- (.+)$/gm)]
  const objectifsBlock = /\*\*Objectifs pédagogiques\*\* :\n((?:- .+\n?)+)/.exec(text)?.[1] ?? ''
  const aRetenirBlock = /\*\*À retenir\*\* :\n((?:- .+\n?)+)/.exec(text)?.[1] ?? ''
  const middle = text
    .replace(/\*\*Matière\*\*.+\n/, '')
    .replace(/\*\*Objectifs pédagogiques\*\* :\n(?:- .+\n?)+/, '')
    .replace(/\*\*À retenir\*\* :\n(?:- .+\n?)+/, '')
    .trim()
  let md = ''
  if (objectifsBlock) md += `### Objectifs\n${objectifsBlock}\n`
  if (middle) md += `${middle}\n\n`
  if (aRetenirBlock) md += `### À retenir\n${aRetenirBlock}`
  return md.trim()
}

function parseExerciceFiche(body) {
  const text = body.join('\n')
  const blocks = text.split(/\n\*\*Niveau\*\* : /).slice(1)
  return blocks.map((b) => {
    const level = (b.match(/^(⭐+)/)?.[1] ?? '⭐').length
    const rest = b.replace(/^⭐+\n/, '')
    const consigne = rest.match(/\*\*Consigne\*\* : (.+)/)?.[1] ?? ''
    const exemple = rest.match(/\*Exemple\* : (.+)/)?.[1]
    const items = [...rest.matchAll(/- \*\*(.+?)\*\*\n(?:\s*(?:Propositions|Réponse attendue) : (.+)\n)?\s*(?:Explication|Bonne réponse) ?: ?(.+)?/g)]
    const questionsBlock = rest.match(/\*\*Questions\*\* :\n((?:\d+\..+\n?)+)/)
    const corrigeBlock = rest.match(/\*\*Corrigé\*\* :\n((?:\d+\..+\n?)+)/)
    const explication = rest.match(/\*Explication\* : (.+)/)?.[1]
    return { level, consigne, exemple, items, questionsBlock: questionsBlock?.[1], corrigeBlock: corrigeBlock?.[1], explication }
  })
}

function exerciseToStatement(fiche) {
  let md = `**${fiche.consigne}**\n\n`
  if (fiche.exemple) md += `${fiche.exemple}\n\n`
  if (fiche.questionsBlock) md += fiche.questionsBlock
  if (fiche.items.length) fiche.items.forEach((it) => { md += `- ${it[1]}\n` })
  return md.trim()
}
function exerciseToSolution(fiche) {
  let md = ''
  if (fiche.corrigeBlock) md += fiche.corrigeBlock + '\n'
  if (fiche.explication) md += `\n*${fiche.explication}*`
  if (fiche.items.length) fiche.items.forEach((it) => { md += `- ${it[1]} → ${it[2] ?? ''} ${it[3] ? `(${it[3]})` : ''}\n` })
  return md.trim() || '_Voir corrigé dans l\'énoncé._'
}

function parseQuizQuestions(body) {
  const text = body.join('\n')
  const matches = [...text.matchAll(/^\d+\.\s(.+)\n\s*Propositions\s?:\s?(.+)\n\s*Bonne réponse\s?:\s?(.+?)\s?[–-]\s?(.+)$/gm)]
  return matches.map(([, prompt, propsRaw, answer, explanation]) => {
    const options = propsRaw.split('|').map((s) => s.trim())
    const correct_index = options.findIndex((o) => o === answer.trim())
    return { prompt: prompt.trim(), options, correct_index: correct_index >= 0 ? correct_index : 0, explanation: explanation.trim() }
  })
}

// ── 3. Exécution ──
async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')

  const [month] = await sb(`/rest/v1/school_months?label=eq.Octobre%202025&select=id,term_id`)
  if (!month) throw new Error('Mois "Octobre 2025" introuvable — migration 045 + seed calendrier requis au préalable.')

  const subjects = await sb('/rest/v1/subjects?level=eq.cepe&select=id,name,parent_subject_id')
  const topByName = Object.fromEntries(subjects.filter((s) => !s.parent_subject_id).map((s) => [s.name, s]))
  const domainByName = Object.fromEntries(subjects.filter((s) => s.parent_subject_id).map((s) => [s.name, s]))

  const SUBJ_KEY_TO_TOP = { Francais: 'Français', Mathematiques: 'Mathématiques', Eveil: 'Éveil' }

  // Chapitres candidats (par titre)
  const allChapterIds = subjects.map((s) => s.id)
  const chapters = await sb(`/rest/v1/chapters?subject_id=in.(${allChapterIds.join(',')})&select=id,title,subject_id,order_index`)
  const chapterByTitle = Object.fromEntries(chapters.map((c) => [c.title, c]))

  // Crée les 2 chapitres manquants (Éveil)
  const lessonChapterId = { ...LESSON_TO_CHAPTER }
  for (const [lessonTitle, target] of Object.entries(LESSON_TO_CHAPTER)) {
    if (target !== null) { lessonChapterId[lessonTitle] = chapterByTitle[target]?.id; continue }
    const spec = NEW_CHAPTERS[lessonTitle]
    const domain = domainByName[spec.domain]
    let existing = chapterByTitle[spec.title]
    if (existing) { lessonChapterId[lessonTitle] = existing.id; console.log(`… chapitre déjà présent : ${spec.title}`); continue }
    if (DRY_RUN) { console.log(`[dry-run] créerait chapitre "${spec.title}" (${spec.domain})`); lessonChapterId[lessonTitle] = `dry-${spec.title}`; continue }
    const domainChapters = chapters.filter((c) => c.subject_id === domain.id)
    const nextOrder = Math.max(0, ...domainChapters.map((c) => c.order_index)) + 1
    const [created] = await sb('/rest/v1/chapters', {
      method: 'POST', body: JSON.stringify({ subject_id: domain.id, title: spec.title, order_index: nextOrder }),
    })
    lessonChapterId[lessonTitle] = created.id
    chapters.push(created); chapterByTitle[spec.title] = created
    console.log(`✓ Chapitre créé : ${spec.title} (${spec.domain})`)
  }

  // ── Leçons (type='resume') ──
  for (const [subjKey, subj] of Object.entries(oct.subjects)) {
    for (const lesson of subj.cours) {
      const chapterId = lessonChapterId[lesson.titre]
      if (!chapterId) { console.warn(`⚠ Pas de chapitre pour la leçon "${lesson.titre}" — ignorée`); continue }
      const existing = DRY_RUN ? [] : await sb(`/rest/v1/lessons?chapter_id=eq.${chapterId}&type=eq.resume&select=id`)
      if (existing.length > 0) { console.log(`… résumé déjà présent pour "${lesson.titre}"`); continue }
      const content = bodyToMarkdown(lesson.body)
      if (DRY_RUN) { console.log(`[dry-run] créerait résumé "${lesson.titre}" → chapitre ${chapterId}`); continue }
      await sb('/rest/v1/lessons', {
        method: 'POST',
        body: JSON.stringify({ chapter_id: chapterId, type: 'resume', title: lesson.titre, content, order_index: 1, is_premium: false }),
      })
      console.log(`✓ Résumé créé : ${lesson.titre}`)
    }
  }

  // ── Exercices (fiches → exercises + exercise_solutions) ──
  for (const [subjKey, subj] of Object.entries(oct.subjects)) {
    for (const fiche of subj.exercices) {
      const lienMatch = fiche.body.join('\n').match(/\*\*Lien avec la leçon\*\* : (.+)/)
      const linkedLessonTitles = (lienMatch?.[1] ?? '').split(';').map((s) => s.trim()).filter(Boolean)
      // Le champ "Lien avec la leçon" tronque parfois le titre exact de la leçon (ex. fiche Éveil
      // d'Octobre) — on tolère un préfixe partiel plutôt qu'une correspondance exacte.
      const matchedTitle = linkedLessonTitles.length
        ? Object.keys(lessonChapterId).find((t) => t.startsWith(linkedLessonTitles[0]) || linkedLessonTitles[0].startsWith(t))
        : null
      const chapterId = matchedTitle ? lessonChapterId[matchedTitle] : null
      if (!chapterId) { console.warn(`⚠ Pas de chapitre pour la fiche "${fiche.titre}" — ignorée`); continue }

      const items = parseExerciceFiche(fiche.body)
      for (const it of items) {
        const title = `${fiche.titre} (niveau ${'⭐'.repeat(it.level)})`
        const existing = DRY_RUN ? [] : await sb(`/rest/v1/exercises?chapter_id=eq.${chapterId}&title=eq.${encodeURIComponent(title)}&select=id`)
        if (existing.length > 0) { console.log(`… exercice déjà présent : ${title}`); continue }
        const statement = exerciseToStatement(it)
        const solution = exerciseToSolution(it)
        if (DRY_RUN) { console.log(`[dry-run] créerait exercice "${title}" → chapitre ${chapterId}`); continue }
        const [created] = await sb('/rest/v1/exercises', {
          method: 'POST',
          body: JSON.stringify({ chapter_id: chapterId, title, statement, difficulty: Math.min(it.level, 3), order_index: it.level, is_premium: false }),
        })
        await sb('/rest/v1/exercise_solutions', { method: 'POST', body: JSON.stringify({ exercise_id: created.id, solution }) })
        console.log(`✓ Exercice créé : ${title}`)
      }
    }
  }

  // ── Tests mensuels (quizzes is_monthly_test=true + quiz_questions) ──
  for (const test of oct.tests) {
    const topName = SUBJ_KEY_TO_TOP[test.subject] ?? test.subject
    const top = topByName[topName]
    if (!top) { console.warn(`⚠ Matière top-level introuvable pour le test "${test.subject}"`); continue }
    const title = `Test du mois — Octobre — ${topName}`
    const existing = DRY_RUN ? [] : await sb(`/rest/v1/quizzes?title=eq.${encodeURIComponent(title)}&select=id`)
    const questions = parseQuizQuestions(test.body)
    if (existing.length > 0) { console.log(`… test mensuel déjà présent : ${title}`); continue }
    if (DRY_RUN) { console.log(`[dry-run] créerait quiz "${title}" avec ${questions.length} questions`); continue }
    const [quiz] = await sb('/rest/v1/quizzes', {
      method: 'POST',
      body: JSON.stringify({
        subject_id: top.id, title, description: `Test de fin de mois — Octobre (${topName})`,
        level: 'cepe', time_limit_sec: 1800, is_monthly_test: true, default_month_id: month.id, is_premium: false,
      }),
    })
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      await sb('/rest/v1/quiz_questions', {
        method: 'POST',
        body: JSON.stringify({ quiz_id: quiz.id, position: i + 1, prompt: q.prompt, options: q.options, correct_index: q.correct_index, explanation: q.explanation }),
      })
    }
    console.log(`✓ Test mensuel créé : ${title} (${questions.length} questions)`)
  }

  // ── Réalignement curriculum_items : les chapitres concernés basculent sur Octobre ──
  const chapterIdsToRealign = Object.values(lessonChapterId).filter((id) => id && !DRY_RUN)
  for (const chapterId of new Set(chapterIdsToRealign)) {
    const [item] = await sb(`/rest/v1/curriculum_items?chapter_id=eq.${chapterId}&item_type=eq.chapter&select=id,school_month_id`)
    if (!item) { console.warn(`⚠ Pas de curriculum_item pour le chapitre ${chapterId} (devrait déjà exister depuis la migration 045)`); continue }
    if (item.school_month_id === month.id) continue
    await sb(`/rest/v1/curriculum_items?id=eq.${item.id}`, { method: 'PATCH', body: JSON.stringify({ school_month_id: month.id, term_id: month.term_id }) })
    console.log(`✓ curriculum_item réaligné sur Octobre pour le chapitre ${chapterId}`)
  }
  // Nouveaux chapitres : curriculum_item à créer
  for (const [lessonTitle, spec] of Object.entries(NEW_CHAPTERS)) {
    const chapterId = lessonChapterId[lessonTitle]
    if (!chapterId || DRY_RUN) continue
    const subjectId = domainByName[spec.domain].id
    const existing = await sb(`/rest/v1/curriculum_items?chapter_id=eq.${chapterId}&select=id`)
    if (existing.length > 0) continue
    await sb('/rest/v1/curriculum_items', {
      method: 'POST',
      body: JSON.stringify({ subject_id: subjectId, chapter_id: chapterId, item_type: 'chapter', school_month_id: month.id, term_id: month.term_id, is_core: true, order_index: 99 }),
    })
    console.log(`✓ curriculum_item créé pour le nouveau chapitre "${spec.title}"`)
  }

  console.log('\nTerminé.')
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
