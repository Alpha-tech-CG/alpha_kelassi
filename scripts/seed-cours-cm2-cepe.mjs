/**
 * Cours CM2 — CEPE : complète et enrichit le contenu existant.
 *
 * Le cahier fourni par l'utilisateur (`scripts/content/cm2-cepe/cours-cm2-cepe-v2.md`)
 * est organisé en 24 semaines ; la plateforme, elle, range par matière puis par
 * chapitre. Ce script découpe le cahier en sections, puis applique la table de
 * correspondance `scripts/content/cm2-cepe/plan.json` :
 *
 *   - mode « new »     : crée le chapitre manquant et sa leçon ;
 *   - mode « improve » : ajoute une leçon au chapitre existant, placée juste
 *                        avant la leçon « Quiz de révision » quand il y en a une.
 *
 * Les corrigés de fin de semaine sont rattachés à la leçon qui porte les
 * exercices correspondants (clé `reponses` du plan).
 *
 * Idempotent : un chapitre déjà créé ou une leçon de même titre est ignoré.
 *
 * Usage :
 *   node scripts/seed-cours-cm2-cepe.mjs --dry-run
 *   node scripts/seed-cours-cm2-cepe.mjs --matiere="Numération"
 *   node scripts/seed-cours-cm2-cepe.mjs
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
const ONLY = (process.argv.find((a) => a.startsWith('--matiere=')) ?? '').split('=')[1]
const DIR = join(__dirname, 'content', 'cm2-cepe')

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
      Range: '0-1999',
      ...(init?.headers ?? {}),
    },
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : null
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> HTTP ${res.status}: ${JSON.stringify(json)}`)
  return json
}

/* ── Découpage du cahier ───────────────────────────────────────────────────── */

const source = readFileSync(join(DIR, 'cours-cm2-cepe-v2.md'), 'utf-8').replace(/\r\n/g, '\n')

/** Supprime la syntaxe propre à Obsidian, que l'application n'affiche pas. */
function nettoyer(texte) {
  return texte
    .replace(/^>\s*\[!(?:info|tip|success|warning|note)\][^\n]*\n/gm, '')
    .replace(/\[\[#([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\n-{3,}\n/g, '\n')
    .trim()
}

const sections = new Map()
const reponses = new Map() // `semaine` -> texte du bloc de corrigés
{
  let semaine = null
  let courante = null
  const pousser = () => {
    if (!courante) return
    const texte = nettoyer(courante.lignes.join('\n'))
    if (/^✅ Réponses/.test(courante.titre)) reponses.set(courante.semaine, texte)
    else sections.set(courante.titre, texte)
  }
  for (const ligne of source.split('\n')) {
    const mSemaine = ligne.match(/^## Semaine (\d+)/)
    const mTitre = ligne.match(/^### (.+)$/)
    // Un titre de mois ou d'annexe ferme la section en cours.
    if (/^# [^#]/.test(ligne)) { pousser(); courante = null; continue }
    if (mSemaine) { pousser(); courante = null; semaine = Number(mSemaine[1]); continue }
    if (mTitre) { pousser(); courante = { semaine, titre: mTitre[1].trim(), lignes: [] }; continue }
    if (courante) courante.lignes.push(ligne)
  }
  pousser()
}

/** Bloc entier du cahier, de ce titre jusqu'au prochain titre de même niveau. */
function bloc(debut) {
  const i = source.indexOf(debut)
  if (i === -1) throw new Error(`Bloc introuvable : ${debut}`)
  const reste = source.slice(i + debut.length)
  const fin = reste.search(/\n# [^#]/)
  return nettoyer(debut + (fin === -1 ? reste : reste.slice(0, fin)))
}

/** Corrigé d'une matière dans le bloc de réponses d'une semaine. */
function corrige(semaine, cle) {
  const bloc = reponses.get(semaine)
  if (!bloc) throw new Error(`Pas de réponses pour la semaine ${semaine}`)
  const re = new RegExp(`(?:^|\\n)\\s*-?\\s*${cle}\\s*:\\s*|\\.\\s+${cle}\\s*:\\s*`, 'i')
  const m = bloc.match(re)
  if (!m) throw new Error(`Corrigé « ${cle} » absent de la semaine ${semaine}`)
  const apres = bloc.slice(m.index + m[0].length)
  const finLigne = apres.search(/\n\s*-\s|\n\n/)
  const texte = (finLigne === -1 ? apres : apres.slice(0, finLigne)).trim()
  const coupe = texte.search(/\.\s+[A-ZÉÈÀÇ][\wÉÈÀÇ' ]{2,20}\s*:\s/)
  return (coupe === -1 ? texte : texte.slice(0, coupe + 1)).trim()
}

/* ── Application du plan ───────────────────────────────────────────────────── */

const plan = JSON.parse(readFileSync(join(DIR, 'plan.json'), 'utf-8'))
const matieres = await sb('/subjects?select=id,name&level=eq.cepe')
const parNom = Object.fromEntries(matieres.map((m) => [m.name, m.id]))

let chapitresCrees = 0
let leconsAjoutees = 0
let ignores = 0

for (const entree of plan) {
  if (ONLY && entree.matiere !== ONLY) continue
  const subjectId = parNom[entree.matiere]
  if (!subjectId) throw new Error(`Matière inconnue : ${entree.matiere}`)

  // Corps de la leçon : les sections du cahier, puis le corrigé éventuel.
  const morceaux = []
  // Le titre de la leçon suffit quand elle ne reprend qu'une seule section.
  const titrerSections = (entree.sections?.length ?? 0) > 1 || Boolean(entree.bloc)
  for (const titre of entree.sections ?? []) {
    const texte = sections.get(titre)
    if (texte === undefined) throw new Error(`Section introuvable : ${titre}`)
    const sansEmoji = titre.replace(/^[^\p{L}]+/u, '').replace(/^[^–]*–\s*/, '').trim()
    morceaux.push(titrerSections ? `### ${sansEmoji}\n\n${texte}` : texte)
  }
  if (entree.bloc) morceaux.push(bloc(entree.bloc))
  // Complément rédigé pour la plateforme, quand la section du cahier tient en une ligne.
  if (entree.complement) morceaux.push(readFileSync(join(DIR, 'complements', entree.complement), 'utf-8').trim())
  for (const r of entree.reponses ?? []) {
    morceaux.push(`### ✅ Réponses (semaine ${r.semaine})\n\n${corrige(r.semaine, r.cle)}`)
  }
  const contenu = morceaux.join('\n\n---\n\n')

  const chapitres = await sb(`/chapters?select=id,title,order_index&subject_id=eq.${subjectId}&order=order_index`)
  let chapitre = chapitres.find((c) => c.title === entree.chapitre)

  if (entree.mode === 'new' && !chapitre) {
    const ordre = Math.max(-1, ...chapitres.map((c) => c.order_index)) + 1
    if (DRY_RUN) {
      console.log(`  + ${entree.matiere} / ${entree.chapitre} (nouveau chapitre, position ${ordre}, ${Math.round(contenu.length / 100) / 10} Ko)`)
      chapitresCrees++; leconsAjoutees++
      continue
    }
    const [cree] = await sb('/chapters', {
      method: 'POST',
      body: JSON.stringify({ subject_id: subjectId, title: entree.chapitre, order_index: ordre, description: entree.description ?? null }),
    })
    chapitre = cree
    chapitresCrees++
  } else if (!chapitre) {
    throw new Error(`Chapitre à enrichir introuvable : ${entree.matiere} / ${entree.chapitre}`)
  }

  const titreLecon = entree.lecon
  const lecons = DRY_RUN && entree.mode === 'new'
    ? []
    : await sb(`/lessons?select=id,title,order_index,type&chapter_id=eq.${chapitre.id}&order=order_index`)
  if (lecons.some((l) => l.title === titreLecon)) {
    console.log(`  = ${entree.matiere} / ${entree.chapitre} — leçon « ${titreLecon} » déjà présente`)
    ignores++
    continue
  }

  // La leçon se place avant le quiz Markdown de fin de chapitre, s'il existe.
  const quiz = lecons.find((l) => l.type === 'quiz' || /quiz|qcm/i.test(l.title))
  const ordreLecon = quiz ? quiz.order_index : Math.max(-1, ...lecons.map((l) => l.order_index)) + 1

  if (DRY_RUN) {
    console.log(`  ${entree.mode === 'new' ? '+' : '↑'} ${entree.matiere} / ${entree.chapitre} → « ${titreLecon} » (${Math.round(contenu.length / 100) / 10} Ko)`)
    leconsAjoutees++
    continue
  }

  if (quiz) {
    await sb(`/lessons?id=eq.${quiz.id}`, { method: 'PATCH', body: JSON.stringify({ order_index: quiz.order_index + 1 }) })
  }
  await sb('/lessons', {
    method: 'POST',
    body: JSON.stringify({
      chapter_id: chapitre.id,
      type: 'cours',
      title: titreLecon,
      content: contenu,
      order_index: ordreLecon,
      is_premium: false,
    }),
  })
  console.log(`  ${entree.mode === 'new' ? '+' : '↑'} ${entree.matiere} / ${entree.chapitre} → « ${titreLecon} »`)
  leconsAjoutees++
}

console.log(`\n${DRY_RUN ? '[essai à blanc] ' : ''}chapitres créés : ${chapitresCrees} | leçons ajoutées : ${leconsAjoutees} | déjà en place : ${ignores}`)
