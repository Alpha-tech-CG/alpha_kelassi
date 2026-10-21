/**
 * Priorité 3 du plan de migration CEPE — structuration fine du Français :
 * 1) déplace les 10 exercices de rédaction du chapitre fantôme
 *    "Sujets d'examen — Expression écrite (CEPE)" vers le vrai chapitre
 *    "Sujets traités et modèles de rédaction" (domaine Expression écrite),
 *    puis supprime le chapitre fantôme désormais vide ;
 * 2) crée le domaine "Lecture & Dictée" (enfant de Français) avec ses chapitres.
 *
 * Usage : node scripts/restructure-francais-content.mjs [--dry-run]
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

async function sb(path, init) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
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

const SCRATCHPAD = 'C:/Users/miche/AppData/Local/Temp/claude/D--alpha-kelassi-new/e14b1709-c92a-401a-a7b0-afd9aea3502d/scratchpad'
const { domain, chapters } = await import(`file:///${SCRATCHPAD}/lecture-dictee-content.mjs`)

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')

  // ── 1) Déplacer les 10 exercices puis supprimer le chapitre fantôme ──
  const [ee] = await sb(`/rest/v1/subjects?name=eq.Expression%20%C3%A9crite&level=eq.cepe&select=id`)
  const [targetChapter] = await sb(`/rest/v1/chapters?subject_id=eq.${ee.id}&title=eq.${encodeURIComponent('Sujets traités et modèles de rédaction')}&select=id`)
  const [francais] = await sb(`/rest/v1/subjects?name=eq.Fran%C3%A7ais&level=eq.cepe&select=id`)
  const [fakeChapter] = await sb(`/rest/v1/chapters?subject_id=eq.${francais.id}&title=eq.${encodeURIComponent("Sujets d'examen — Expression écrite (CEPE)")}&select=id`)

  if (!fakeChapter) {
    console.log('… chapitre fantôme déjà absent (étape 1 déjà faite)')
  } else {
    const toMove = await sb(`/rest/v1/exercises?chapter_id=eq.${fakeChapter.id}&select=id,title,order_index`)
    console.log(`Exercices à déplacer : ${toMove.length}`)
    if (DRY_RUN) {
      console.log(`[dry-run] déplacerait ${toMove.length} exercices vers "${targetChapter.id}", puis supprimerait le chapitre fantôme`)
    } else {
      // Renumérote order_index pour continuer après les leçons existantes du chapitre cible (pas de collision car order_index n'a pas de contrainte unique)
      for (const ex of toMove) {
        await sb(`/rest/v1/exercises?id=eq.${ex.id}`, { method: 'PATCH', body: JSON.stringify({ chapter_id: targetChapter.id }) })
      }
      console.log(`✓ ${toMove.length} exercices déplacés vers "Sujets traités et modèles de rédaction"`)
      await sb(`/rest/v1/chapters?id=eq.${fakeChapter.id}`, { method: 'DELETE' })
      console.log('✓ Chapitre fantôme supprimé')
    }
  }

  // ── 2) Créer le domaine Lecture & Dictée ──
  let domainId
  const existingDomain = await sb(`/rest/v1/subjects?name=eq.${encodeURIComponent(domain.name)}&level=eq.cepe&select=id`)
  if (existingDomain.length > 0) {
    domainId = existingDomain[0].id
    console.log(`… domaine déjà présent : ${domain.name}`)
  } else if (DRY_RUN) {
    console.log(`[dry-run] créerait domaine "${domain.name}"`)
    domainId = 'dry-domain'
  } else {
    const [created] = await sb('/rest/v1/subjects', {
      method: 'POST',
      body: JSON.stringify({ name: domain.name, level: 'cepe', country_code: 'CG', icon: domain.icon, parent_subject_id: francais.id, display_order: domain.display_order }),
    })
    domainId = created.id
    console.log(`✓ Domaine créé : ${domain.name}`)
  }

  for (const ch of chapters) {
    const existingCh = DRY_RUN ? [] : await sb(`/rest/v1/chapters?subject_id=eq.${domainId}&title=eq.${encodeURIComponent(ch.title)}&select=id`)
    if (existingCh.length > 0) { console.log(`… chapitre déjà présent : ${ch.title}`); continue }
    if (DRY_RUN) { console.log(`[dry-run] créerait chapitre "${ch.title}" — 2 leçons, ${ch.exercises.length} exercices`); continue }

    const [chapter] = await sb('/rest/v1/chapters', {
      method: 'POST',
      body: JSON.stringify({ subject_id: domainId, title: ch.title, order_index: ch.order_index, description: null }),
    })
    await sb('/rest/v1/lessons', {
      method: 'POST',
      body: JSON.stringify([
        { chapter_id: chapter.id, type: 'cours', title: ch.title, content: ch.cours, order_index: 0, is_premium: false },
        { chapter_id: chapter.id, type: 'quiz', title: 'Quiz de révision', content: ch.quiz, order_index: 1, is_premium: false },
      ]),
    })
    for (let i = 0; i < ch.exercises.length; i++) {
      const ex = ch.exercises[i]
      const [created] = await sb('/rest/v1/exercises', {
        method: 'POST',
        body: JSON.stringify({ chapter_id: chapter.id, title: ex.title, statement: ex.statement, difficulty: 2, is_premium: false, order_index: i }),
      })
      await sb('/rest/v1/exercise_solutions', { method: 'POST', body: JSON.stringify({ exercise_id: created.id, solution: ex.solution }) })
    }
    console.log(`✓ Chapitre créé : ${ch.title} (2 leçons, ${ch.exercises.length} exercices)`)
  }

  console.log('\n=== Terminé ===')
}

main().catch((e) => { console.error('✗', e.message); process.exit(1) })
