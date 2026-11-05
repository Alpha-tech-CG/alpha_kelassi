/**
 * Sort les exercices du texte des leçons du CEPE et les installe dans l'espace
 * « Exercices » (tables `exercises` + `exercise_solutions`).
 *
 * Dans les leçons importées, les exercices étaient écrits en bloc
 * (« ✏️ À toi de jouer : a) … b) … ») avec le corrigé juste en dessous
 * (« ✅ Réponses »). L'élève voyait donc les réponses avant d'avoir cherché.
 *
 * Après ce script, chaque question devient un exercice distinct : l'élève lit
 * l'énoncé, écrit sa réponse dans l'application, et le corrigé n'apparaît
 * qu'une fois sa réponse envoyée (migration 035 : le corrigé est verrouillé
 * tant qu'il n'y a pas de ligne dans `exercise_attempts`).
 *
 * La leçon conserve le cours et renvoie vers l'onglet Exercices.
 *
 * Idempotent : une leçon déjà nettoyée ne contient plus de bloc à extraire.
 * Une sauvegarde du texte d'origine est écrite avant toute modification.
 *
 * Usage :
 *   node scripts/extraire-exercices-cepe.mjs --dry-run
 *   node scripts/extraire-exercices-cepe.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
const MONTRER = process.argv.includes('--montrer')
const SAUVEGARDE = join(__dirname, 'content', 'cm2-cepe', 'sauvegarde-lecons-avant-extraction.json')

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }),
)

async function sb(path, init) {
  const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      Prefer: 'return=representation',
      Range: '0-4999',
      ...(init?.headers ?? {}),
    },
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : null
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> HTTP ${res.status}: ${JSON.stringify(json)}`)
  return json
}

/* ── Découpage du texte d'une leçon ────────────────────────────────────────── */

const RE_ENONCES = /(?:^|\n)(?:###+\s*)?(?:\*\*)?✏️\s*(?:À toi de jouer|Exercices?)[^\n]*?(?:\*\*)?\s*:?\s*\n?([\s\S]*?)(?=\n#{2,}\s|\n---\s*\n|$)/
const RE_REPONSES = /(?:^|\n)(?:###+\s*)?(?:\*\*)?✅\s*Réponses?[^\n]*?(?:\*\*)?\s*\n?([\s\S]*?)(?=\n#{2,}\s|\n---\s*\n|$)/

/** Découpe « a) … b) … » ou « 1. … 2. … » en questions séparées. */
function decouper(texte) {
  const nettoye = texte.replace(/^\s*[-*]\s+/gm, '').trim()
  const lettres = [...nettoye.matchAll(/(?:^|[\s(])([a-h])\)\s+/g)]
  const chiffres = [...nettoye.matchAll(/(?:^|\s)(\d)[.)]\s+/g)]
  /** Les repères doivent se suivre (a, b, c… ou 1, 2, 3…), sinon c'est du texte ordinaire. */
  const suite = (liste, premier) =>
    liste.length >= 2 && liste.every((m, i) => m[1] === (typeof premier === 'number'
      ? String(premier + i)
      : String.fromCharCode(premier.charCodeAt(0) + i)))
  const marques = suite(lettres, 'a') ? lettres : suite(chiffres, 1) ? chiffres : []
  if (!marques.length) return [{ marque: null, texte: nettoye }]
  return marques.map((m, i) => ({
    marque: m[1].toLowerCase(),
    texte: nettoye.slice(m.index + m[0].length, i + 1 < marques.length ? marques[i + 1].index : undefined).trim(),
  }))
}

/** Retire les restes de mise en forme d'un énoncé isolé. */
const propre = (s) => s.replace(/^[:：]\s*/, '').replace(/\s*·\s*$/, '').replace(/\s+/g, ' ').trim()

/* ── Traitement ────────────────────────────────────────────────────────────── */

const subjects = await sb('/subjects?select=id,name&level=eq.cepe')
const chapters = await sb(`/chapters?select=id,title,subject_id&subject_id=in.(${subjects.map((s) => s.id).join(',')})`)
const nomMatiere = Object.fromEntries(subjects.map((s) => [s.id, s.name]))
const lessons = await sb(`/lessons?select=id,chapter_id,title,content,order_index&chapter_id=in.(${chapters.map((c) => c.id).join(',')})&order=order_index`)
const exercicesExistants = await sb(`/exercises?select=id,chapter_id,title,order_index&chapter_id=in.(${chapters.map((c) => c.id).join(',')})`)

const sauvegarde = []
let exercicesCrees = 0
let leconsNettoyees = 0
let sansCorrige = 0
let sansCorrigeNettoyes = 0
let aEcrire = 0

for (const chapitre of chapters) {
  const lecons = lessons.filter((l) => l.chapter_id === chapitre.id)
  let ordre = Math.max(0, ...exercicesExistants.filter((e) => e.chapter_id === chapitre.id).map((e) => e.order_index + 1))

  for (const lecon of lecons) {
    const contenu = lecon.content ?? ''
    const mEnonces = contenu.match(RE_ENONCES)
    if (!mEnonces) continue

    const mReponses = contenu.match(RE_REPONSES)
    const questions = decouper(mEnonces[1])
    const corriges = mReponses ? decouper(mReponses[1]) : []

    // Sans corrigé dans la leçon, l'exercice vient des imports d'origine : il est
    // déjà dans l'espace Exercices. On nettoie la leçon sans rien recréer.
    const dejaEnBase = exercicesExistants.some((e) => e.chapter_id === chapitre.id)
    if (!corriges.length) {
      if (!dejaEnBase) {
        console.log(`  ⚠ ${nomMatiere[chapitre.subject_id]} / ${chapitre.title} → « ${lecon.title} » : énoncés sans corrigé et aucun exercice en base, laissé tel quel`)
        aEcrire++
        continue
      }
      sansCorrigeNettoyes++
    }

    // On n'apparie que si les repères correspondent ; sinon un seul exercice.
    const appariable =
      corriges.length === questions.length &&
      questions.every((q, i) => q.marque === corriges[i].marque)
    const lots = appariable
      ? questions.map((q, i) => ({ enonce: q.texte, corrige: corriges[i].texte }))
      : [{
          enonce: questions.map((q) => (q.marque ? `${q.marque}) ${q.texte}` : q.texte)).join('\n'),
          corrige: corriges.map((c) => (c.marque ? `${c.marque}) ${c.texte}` : c.texte)).join('\n'),
        }]

    const lotsAcreer = corriges.length ? lots : []
    for (const [i, lot] of lotsAcreer.entries()) {
      const enonce = propre(lot.enonce)
      if (enonce.length < 8) continue
      const titre = lots.length > 1 ? `${lecon.title} — question ${i + 1}` : `${lecon.title} — exercice`
      const corrige = propre(lot.corrige ?? '')
      if (!corrige) sansCorrige++

      if (!DRY_RUN) {
        const [cree] = await sb('/exercises', {
          method: 'POST',
          body: JSON.stringify({
            chapter_id: chapitre.id,
            title: titre.slice(0, 120),
            statement: enonce,
            difficulty: 1,
            is_premium: false,
            order_index: ordre,
          }),
        })
        if (corrige) {
          await sb('/exercise_solutions', { method: 'POST', body: JSON.stringify({ exercise_id: cree.id, solution: corrige }) })
        }
      }
      if (MONTRER) console.log(`     · [${titre}]
       énoncé  : ${enonce}
       corrigé : ${corrige || '(aucun)'}`)
      ordre++
      exercicesCrees++
    }

    // La leçon perd les énoncés et le corrigé, et renvoie vers l'espace Exercices.
    let nettoye = contenu
    for (const m of [mEnonces, mReponses]) {
      if (m) nettoye = nettoye.replace(m[0], '\n')
    }
    nettoye = nettoye
      .replace(/\n{3,}/g, '\n\n')
      .replace(/(?:\n\s*---\s*)+\n*$/,'\n')
      .trim()
    nettoye += `\n\n---\n\n👉 **À toi de jouer :** les ${lots.length > 1 ? `${lots.length} questions` : 'exercices'} de cette leçon se trouvent dans l'onglet **Exercices** du chapitre. Tu y écris ta réponse, puis le corrigé s'affiche.`

    sauvegarde.push({ lesson_id: lecon.id, chapitre: chapitre.title, matiere: nomMatiere[chapitre.subject_id], titre: lecon.title, contenu })
    if (!DRY_RUN) {
      await sb(`/lessons?id=eq.${lecon.id}`, { method: 'PATCH', body: JSON.stringify({ content: nettoye }) })
    }
    leconsNettoyees++
    console.log(`  ${nomMatiere[chapitre.subject_id]} / ${chapitre.title} → « ${lecon.title} » : ${lotsAcreer.length ? `${lotsAcreer.length} exercice(s) créé(s)${appariable ? '' : ' (corrigé groupé)'}` : 'leçon nettoyée, exercices déjà en base'}`)
  }
}

if (sauvegarde.length && !DRY_RUN) {
  // On fusionne avec la sauvegarde existante : la plus ancienne version d'une
  // leçon est celle qu'il faut garder pour un éventuel retour arrière.
  mkdirSync(dirname(SAUVEGARDE), { recursive: true })
  let anciennes = []
  try { anciennes = JSON.parse(readFileSync(SAUVEGARDE, 'utf-8')) } catch { anciennes = [] }
  const connues = new Set(anciennes.map((l) => l.lesson_id))
  const fusion = [...anciennes, ...sauvegarde.filter((l) => !connues.has(l.lesson_id))]
  writeFileSync(SAUVEGARDE, JSON.stringify(fusion, null, 1))
  console.log(`sauvegarde : ${fusion.length} leçons (dont ${fusion.length - anciennes.length} ajoutées)`)
}

console.log(`\n${DRY_RUN ? '[essai à blanc] ' : ''}leçons nettoyées : ${leconsNettoyees} | exercices créés : ${exercicesCrees} | sans corrigé : ${sansCorrige}`)
console.log(`sauvegarde du texte d'origine : ${SAUVEGARDE}`)
