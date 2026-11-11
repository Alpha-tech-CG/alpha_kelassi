/**
 * Crée les chapitres du programme officiel BEPC (bepc_3e_programme_officiel_
 * complet.json, structure INRAP/MEPPSA) qui n'ont PAS d'équivalent parmi les
 * chapitres déjà en base — titre seulement, aucune leçon (le contenu sera
 * ajouté plus tard). Physique-Chimie et Histoire-Géographie sont exclues
 * (déjà traitées avec la même source, cf. scripts/remap-bepc-officiel.mjs).
 *
 * Règle appliquée : les chapitres purement "Révisions/Annales BEPC" ne sont
 * pas créés (même principe que pour le CEPE — rien de spécifique à enseigner,
 * juste une révision générale). Les chapitres officiels dont le contenu est
 * déjà substantiellement couvert par des chapitres existants (même sujet,
 * granularité différente) sont aussi sautés pour éviter les doublons.
 *
 * Usage : node scripts/create-official-bepc-chapters.mjs [--dry-run]
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
    headers: { 'Content-Type': 'application/json', apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, Prefer: 'return=representation', ...(init?.headers ?? {}) },
  })
  const text = await res.text()
  const json = text ? JSON.parse(text) : null
  if (!res.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> HTTP ${res.status}: ${JSON.stringify(json)}`)
  return json
}

// matière (nom exact en base) → chapitres à créer, avec le 1er mois de leur plage officielle.
const NEW_CHAPTERS = {
  'Mathématiques': [
    { code: 'M3E-1', titre: 'Activités numériques : nombres relatifs, fractions, puissances', month: 'Octobre 2025' },
    { code: 'M3E-2', titre: 'Calcul littéral : développer, factoriser, équations', month: 'Octobre 2025' },
    { code: 'M3E-5', titre: 'Trigonométrie dans le triangle rectangle', month: 'Janvier 2026' },
    { code: 'M3E-6', titre: 'Repérage dans le plan', month: 'Février 2026' },
  ],
  'Français': [
    { code: 'F3E-1', titre: 'Grammaire : phrase complexe', month: 'Octobre 2025' },
    { code: 'F3E-2', titre: 'Conjugaison : temps et modes', month: 'Octobre 2025' },
    { code: 'F3E-3', titre: 'Orthographe et vocabulaire', month: 'Octobre 2025' },
    { code: 'F3E-4', titre: 'Expression écrite', month: 'Octobre 2025' },
    { code: 'F3E-5', titre: 'Lecture et compréhension', month: 'Octobre 2025' },
  ],
  'Anglais': [
    { code: 'A3E-3', titre: 'Vocabulary : everyday topics', month: 'Octobre 2025' },
    { code: 'A3E-4', titre: 'Skills : reading and writing', month: 'Octobre 2025' },
  ],
  'SVT': [
    { code: 'S3E-1', titre: 'Reproduction humaine', month: 'Octobre 2025' },
    { code: 'S3E-2', titre: 'Génétique', month: 'Novembre 2025' },
    { code: 'S3E-3', titre: 'Système nerveux', month: 'Décembre 2025' },
    { code: 'S3E-4', titre: 'Immunité', month: 'Janvier 2026' },
    { code: 'S3E-5', titre: 'Écosystèmes et environnement', month: 'Février 2026' },
  ],
  'Éducation Civique': [
    { code: 'EC3E-1', titre: 'Institutions et pouvoir', month: 'Octobre 2025' },
    { code: 'EC3E-2', titre: 'Citoyenneté et démocratie', month: 'Novembre 2025' },
    { code: 'EC3E-3', titre: 'Problèmes de société', month: 'Janvier 2026' },
  ],
  'EPS': [
    { code: 'EPS3E-1', titre: 'Athlétisme', month: 'Octobre 2025' },
    { code: 'EPS3E-2', titre: 'Sports collectifs', month: 'Octobre 2025' },
    { code: 'EPS3E-3', titre: 'Gymnastique et danse', month: 'Novembre 2025' },
    { code: 'EPS3E-4', titre: 'Natation et pleine nature', month: 'Décembre 2025' },
  ],
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')

  const months = await sb(`/rest/v1/school_months?select=id,label,term_id`)
  const monthByLabel = Object.fromEntries(months.map((m) => [m.label, m]))

  let subjects = await sb(`/rest/v1/subjects?level=eq.bepc&select=id,name`)
  let subjectByName = Object.fromEntries(subjects.map((s) => [s.name, s]))

  // Éducation Civique n'existe pas encore comme matière BEPC → on la crée.
  if (!subjectByName['Éducation Civique']) {
    if (DRY_RUN) {
      console.log('[dry-run] créerait la matière "Éducation Civique" (bepc)')
      subjectByName['Éducation Civique'] = { id: 'dry-educ-civique', name: 'Éducation Civique' }
    } else {
      const [created] = await sb('/rest/v1/subjects', {
        method: 'POST',
        body: JSON.stringify({ name: 'Éducation Civique', level: 'bepc', country_code: 'CG', track_type: 'generale', display_order: 0 }),
      })
      subjectByName['Éducation Civique'] = created
      console.log('✓ Matière créée : Éducation Civique (bepc)')
    }
  } else {
    console.log('… matière déjà présente : Éducation Civique')
  }

  let totalCreated = 0
  for (const [subjectName, list] of Object.entries(NEW_CHAPTERS)) {
    const subject = subjectByName[subjectName]
    if (!subject) { console.warn(`⚠ Matière introuvable : "${subjectName}"`); continue }

    const existingChapters = DRY_RUN && subject.id.startsWith('dry-')
      ? []
      : await sb(`/rest/v1/chapters?subject_id=eq.${subject.id}&select=id,title,order_index&order=order_index`)
    let nextOrder = Math.max(0, ...existingChapters.map((c) => c.order_index)) + 1

    console.log(`\n--- ${subjectName} ---`)
    for (const spec of list) {
      const already = existingChapters.find((c) => c.title === spec.titre)
      if (already) { console.log(`… déjà présent : ${spec.titre}`); continue }

      const month = monthByLabel[spec.month]
      if (!month) { console.warn(`⚠ Mois introuvable : "${spec.month}"`); continue }

      if (DRY_RUN) { console.log(`[dry-run] créerait chapitre "${spec.titre}" (${spec.code}) → ${spec.month}`); continue }

      const [chapter] = await sb('/rest/v1/chapters', {
        method: 'POST',
        body: JSON.stringify({ subject_id: subject.id, title: spec.titre, order_index: nextOrder }),
      })
      nextOrder++
      await sb('/rest/v1/curriculum_items', {
        method: 'POST',
        body: JSON.stringify({ subject_id: subject.id, chapter_id: chapter.id, item_type: 'chapter', school_month_id: month.id, term_id: month.term_id, is_core: true, order_index: nextOrder }),
      })
      console.log(`✓ Chapitre créé : ${spec.titre} (${spec.code}) → ${spec.month}`)
      totalCreated++
    }
  }

  console.log(`\n${DRY_RUN ? '[dry-run]' : 'Terminé.'} ${DRY_RUN ? '' : totalCreated + ' '}chapitres créés.`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
