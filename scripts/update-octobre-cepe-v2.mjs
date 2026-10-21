/**
 * Met à jour le contenu d'Octobre avec la version enrichie de
 * cepe_programme_complet.md (2e envoi — mêmes 12 leçons/4 fiches/3 tests que
 * la v1 déjà importée, mais avec des corps de leçon plus détaillés).
 *
 * Contrairement à import-octobre-cepe.mjs (qui crée et ignore si déjà présent),
 * ce script MET À JOUR le contenu existant (lessons.content, exercises/
 * exercise_solutions, quiz_questions) au lieu de le sauter. La table de
 * correspondance leçon → chapitre et les 2 chapitres créés sont réutilisés
 * tels quels (déjà en place depuis le premier import).
 *
 * Usage : node scripts/update-octobre-cepe-v2.mjs [--dry-run]
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

// ── 1. Source : parse cepe_programme_complet.md v2 (corruption d'encodage nettoyée) ──
const SRC_PATH = process.env.CEPE_PROGRAMME_PATH ?? join(__dirname, '..', '..', 'cepe_programme_complet.md')
const RAW = readFileSync(SRC_PATH, 'utf8')
// v2 insère parfois "espace + point médian" (ex. "pé ·dagogiques") en plus du "··" collé de la v1.
const text = RAW.replace(/\s?[·²⁰]/g, '').replace(/—/g, '')

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
    if (curSection === 'cours' && line.match(/^#### /)) { flushLesson(); curLesson = { titre: line.replace(/^#### /, '').replace(/\s*\(Octobre\)\s*$/, ''), body: [] }; continue }
    if (curSection === 'exercices' && line.match(/^#### /)) { flushExercise(); curExercise = { titre: line.replace(/^#### /, '').replace(/\s*\(Octobre\)\s*$/, ''), body: [] }; continue }
    if (curLesson) curLesson.body.push(line)
    if (curExercise) curExercise.body.push(line)
    if (curTest) curTest.body.push(line)
  }
  return month
}

const oct = parseOctobre(text)

// ── 2. Même table de correspondance que l'import v1 (chapitres déjà créés) ──
const LESSON_TO_CHAPTER = {
  'Lecture‑compréhension – Texte narratif':          'Comprendre un texte : stratégies de compréhension',
  'Types et formes de phrases':                       'Les types de phrases',
  'Conjugaison – Présent des verbes du 1er groupe':   "Le présent de l'indicatif — 1er groupe",
  'Expression écrite – Le récit':                     "La structure d'un devoir de rédaction",
  "Les grands nombres (jusqu'au milliard)":           'La numération décimale — Rappels',
  'Addition / soustraction avec grands nombres':      'Addition et soustraction rapides',
  'Multiplication (1 ou 2 chiffres)':                 'Multiplication et division rapides',
  'Résolution de problèmes (4 opérations)':           "Méthode de résolution d'un problème",
  'Gégraphie – Localisation du Congo et régions naturelles': 'Le Congo : fleuve, relief et départements',
  'Sciences – Hygiène du corps et santé':              "L'hygiène et la prévention des maladies",
  'Histoire – Premiers habitants et royaumes traditionnels': 'Les premiers habitants et royaumes traditionnels',
  "Éducation civique – La famille et l'école":         "La famille et l'école",
}

function bodyToMarkdown(body) {
  const text = body.join('\n')
  const objectifsBlock = /\*\*Objectifs pédagogiques\*\* :\n((?:- .+\n?)+)/.exec(text)?.[1] ?? ''
  const aRetenirBlock = /\*\*À retenir\*\* :\n((?:- .+\n?)+)/.exec(text)?.[1] ?? ''
  const middle = text
    .replace(/\*\*Matière\*\*.+\n(\*\*Mois\*\*.+\n)?/, '')
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
  return md.trim() || "_Voir corrigé dans l'énoncé._"
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

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN (update v2) ===' : '=== Mise à jour en base (v2) ===')

  const subjects = await sb('/rest/v1/subjects?level=eq.cepe&select=id,name,parent_subject_id')
  const topByName = Object.fromEntries(subjects.filter((s) => !s.parent_subject_id).map((s) => [s.name, s]))
  const SUBJ_KEY_TO_TOP = { Francais: 'Français', Mathematiques: 'Mathématiques', Eveil: 'Éveil' }

  const allChapterIds = subjects.map((s) => s.id)
  const chapters = await sb(`/rest/v1/chapters?subject_id=in.(${allChapterIds.join(',')})&select=id,title`)
  const chapterByTitle = Object.fromEntries(chapters.map((c) => [c.title, c]))

  const lessonChapterId = {}
  for (const [lessonTitle, chapterTitle] of Object.entries(LESSON_TO_CHAPTER)) {
    const chapter = chapterByTitle[chapterTitle]
    if (!chapter) { console.warn(`⚠ Chapitre "${chapterTitle}" introuvable (attendu depuis l'import v1)`); continue }
    lessonChapterId[lessonTitle] = chapter.id
  }

  let lessonsUpdated = 0, exercisesTouched = 0, questionsUpdated = 0

  // ── Leçons : met à jour le contenu du résumé existant ──
  for (const [, subj] of Object.entries(oct.subjects)) {
    for (const lesson of subj.cours) {
      const chapterId = lessonChapterId[lesson.titre]
      if (!chapterId) { console.warn(`⚠ Pas de mapping pour la leçon "${lesson.titre}" — ignorée`); continue }
      const content = bodyToMarkdown(lesson.body)
      const [existing] = await sb(`/rest/v1/lessons?chapter_id=eq.${chapterId}&type=eq.resume&select=id,content`)
      if (!existing) { console.warn(`⚠ Pas de résumé existant pour "${lesson.titre}" — attendu depuis l'import v1`); continue }
      if (existing.content === content) { console.log(`… déjà à jour : ${lesson.titre}`); continue }
      if (DRY_RUN) { console.log(`[dry-run] mettrait à jour le résumé "${lesson.titre}" (${content.length} caractères)`); continue }
      await sb(`/rest/v1/lessons?id=eq.${existing.id}`, { method: 'PATCH', body: JSON.stringify({ content }) })
      console.log(`✓ Résumé mis à jour : ${lesson.titre}`)
      lessonsUpdated++
    }
  }

  // ── Exercices : met à jour statement/solution s'ils diffèrent ──
  for (const [, subj] of Object.entries(oct.subjects)) {
    for (const fiche of subj.exercices) {
      const lienMatch = fiche.body.join('\n').match(/\*\*Lien avec la leçon\*\* : (.+)/)
      const linkedLessonTitles = (lienMatch?.[1] ?? '').split(';').map((s) => s.trim()).filter(Boolean)
      const matchedTitle = linkedLessonTitles.length
        ? Object.keys(lessonChapterId).find((t) => t.startsWith(linkedLessonTitles[0]) || linkedLessonTitles[0].startsWith(t))
        : null
      const chapterId = matchedTitle ? lessonChapterId[matchedTitle] : null
      if (!chapterId) { console.warn(`⚠ Pas de chapitre pour la fiche "${fiche.titre}" — ignorée`); continue }

      // Titre du fichier parfois légèrement différent du v1 (ex. correction d'orthographe
      // "Gégraphie" → "Géographie") → on associe par chapitre + niveau (⭐), pas par titre exact.
      const chapterExercises = await sb(`/rest/v1/exercises?chapter_id=eq.${chapterId}&select=id,title,statement&order=order_index`)
      const items = parseExerciceFiche(fiche.body)
      for (const it of items) {
        const stars = '⭐'.repeat(it.level)
        const existing = chapterExercises.find((e) => e.title.includes(`niveau ${stars}`) || e.title.trim().endsWith(stars))
        const statement = exerciseToStatement(it)
        const solution = exerciseToSolution(it)
        if (!existing) { console.warn(`⚠ Exercice niveau ${stars} introuvable dans "${fiche.titre}" (chapitre ${chapterId}) — attendu depuis l'import v1`); continue }
        if (existing.statement === statement) { console.log(`… déjà à jour : ${existing.title}`); continue }
        if (DRY_RUN) { console.log(`[dry-run] mettrait à jour l'exercice "${existing.title}"`); continue }
        await sb(`/rest/v1/exercises?id=eq.${existing.id}`, { method: 'PATCH', body: JSON.stringify({ statement }) })
        await sb(`/rest/v1/exercise_solutions?exercise_id=eq.${existing.id}`, { method: 'PATCH', body: JSON.stringify({ solution }) })
        console.log(`✓ Exercice mis à jour : ${existing.title}`)
        exercisesTouched++
      }
    }
  }

  // ── Tests mensuels : met à jour prompt/explanation des questions si elles diffèrent ──
  for (const test of oct.tests) {
    const topName = SUBJ_KEY_TO_TOP[test.subject] ?? test.subject
    const title = `Test du mois — Octobre — ${topName}`
    const [quiz] = await sb(`/rest/v1/quizzes?title=eq.${encodeURIComponent(title)}&select=id`)
    if (!quiz) { console.warn(`⚠ Quiz "${title}" introuvable — attendu depuis l'import v1`); continue }
    const existingQuestions = await sb(`/rest/v1/quiz_questions?quiz_id=eq.${quiz.id}&select=id,position,prompt,explanation&order=position`)
    const newQuestions = parseQuizQuestions(test.body)
    for (let i = 0; i < newQuestions.length; i++) {
      const nq = newQuestions[i]
      const eq = existingQuestions[i]
      if (!eq) { console.warn(`⚠ Question ${i + 1} manquante en base pour "${title}"`); continue }
      if (eq.prompt === nq.prompt && eq.explanation === nq.explanation) continue
      if (DRY_RUN) { console.log(`[dry-run] mettrait à jour question ${i + 1} de "${title}"`); continue }
      await sb(`/rest/v1/quiz_questions?id=eq.${eq.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ prompt: nq.prompt, options: nq.options, correct_index: nq.correct_index, explanation: nq.explanation }),
      })
      console.log(`✓ Question ${i + 1} mise à jour : ${title}`)
      questionsUpdated++
    }
  }

  console.log(`\n${DRY_RUN ? '[dry-run]' : 'Terminé.'} ${lessonsUpdated} résumés, ${exercisesTouched} exercices, ${questionsUpdated} questions mis à jour.`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
