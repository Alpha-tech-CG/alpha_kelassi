/**
 * Calendrier scolaire BEPC 2025-2026 (même schéma que CEPE, migration 045) :
 * année/trimestres/9 mois + distribution de base des chapitres BEPC déjà en
 * base (Anglais/Histoire-Géographie/Mathématiques/Physique-Chimie — Français/
 * SVT/EPS n'ont aucun chapitre pour l'instant) répartis dans l'ordre existant
 * sur les 9 mois. Le réalignement fin (scripts/realign-bepc-cepe.mjs) vient
 * ensuite corriger les chapitres qui correspondent à bepc_3e_programme_complet.md.
 *
 * Usage : node scripts/seed-bepc-calendar.mjs [--dry-run]
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

const TERMS = [
  { number: 1, label: 'Trimestre 1', start: '2025-10-01', end: '2025-12-19' },
  { number: 2, label: 'Trimestre 2', start: '2026-01-05', end: '2026-03-27' },
  { number: 3, label: 'Trimestre 3', start: '2026-04-13', end: '2026-06-30' },
]
const MONTHS = [
  { label: 'Octobre 2025',  start: '2025-10-01', end: '2025-10-31', term: 1 },
  { label: 'Novembre 2025', start: '2025-11-01', end: '2025-11-30', term: 1 },
  { label: 'Décembre 2025', start: '2025-12-01', end: '2025-12-19', term: 1 },
  { label: 'Janvier 2026',  start: '2026-01-05', end: '2026-01-31', term: 2 },
  { label: 'Février 2026',  start: '2026-02-01', end: '2026-02-28', term: 2 },
  { label: 'Mars 2026',     start: '2026-03-01', end: '2026-03-27', term: 2 },
  { label: 'Avril 2026',    start: '2026-04-13', end: '2026-04-30', term: 3 },
  { label: 'Mai 2026',      start: '2026-05-01', end: '2026-05-31', term: 3 },
  { label: 'Juin 2026',     start: '2026-06-01', end: '2026-06-30', term: 3 },
]

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')

  let [year] = await sb(`/rest/v1/academic_years?level=eq.bepc&country_code=eq.CG&label=eq.2025-2026&select=id`)
  if (!year) {
    if (DRY_RUN) { console.log('[dry-run] créerait academic_years 2025-2026 (bepc)'); year = { id: 'dry-year' } }
    else {
      year = (await sb('/rest/v1/academic_years', { method: 'POST', body: JSON.stringify({ level: 'bepc', country_code: 'CG', label: '2025-2026', start_date: '2025-10-01', end_date: '2026-06-30' }) }))[0]
      console.log('✓ academic_years 2025-2026 (bepc) créée')
    }
  } else console.log('… academic_years 2025-2026 (bepc) déjà présente')

  const termIds = {}
  for (const t of TERMS) {
    let row = (await sb(`/rest/v1/terms?academic_year_id=eq.${year.id}&term_number=eq.${t.number}&select=id`))[0]
    if (!row) {
      if (DRY_RUN) { console.log(`[dry-run] créerait ${t.label}`); row = { id: `dry-term-${t.number}` } }
      else { row = (await sb('/rest/v1/terms', { method: 'POST', body: JSON.stringify({ academic_year_id: year.id, term_number: t.number, label: t.label, start_date: t.start, end_date: t.end }) }))[0]; console.log(`✓ ${t.label} créé`) }
    } else console.log(`… ${t.label} déjà présent`)
    termIds[t.number] = row.id
  }

  const monthRows = []
  for (let i = 0; i < MONTHS.length; i++) {
    const m = MONTHS[i]
    const termId = termIds[m.term]
    let row = (await sb(`/rest/v1/school_months?term_id=eq.${termId}&order_index=eq.${i + 1}&select=id,label`))[0]
    if (!row) {
      if (DRY_RUN) { console.log(`[dry-run] créerait mois "${m.label}"`); row = { id: `dry-month-${i + 1}`, label: m.label } }
      else { row = (await sb('/rest/v1/school_months', { method: 'POST', body: JSON.stringify({ term_id: termId, label: m.label, start_date: m.start, end_date: m.end, order_index: i + 1 }) }))[0]; console.log(`✓ mois "${m.label}" créé`) }
    } else console.log(`… mois "${m.label}" déjà présent`)
    monthRows.push({ ...row, termId })
  }

  // ── curriculum_items — distribution de base des chapitres BEPC existants ──
  const subjects = await sb('/rest/v1/subjects?level=eq.bepc&select=id,name')
  const subjectIds = subjects.map((s) => s.id)
  const chapters = await sb(`/rest/v1/chapters?subject_id=in.(${subjectIds.join(',')})&select=id,subject_id,title,order_index&order=order_index`)
  const existingItems = await sb(`/rest/v1/curriculum_items?item_type=eq.chapter&select=chapter_id`)
  const alreadyPlaced = new Set(existingItems.map((r) => r.chapter_id))

  let created = 0
  for (const subj of subjects) {
    const chs = chapters.filter((c) => c.subject_id === subj.id).sort((a, b) => a.order_index - b.order_index)
    const n = chs.length
    if (n === 0) { console.log(`… ${subj.name} : aucun chapitre, rien à distribuer`); continue }
    console.log(`\n--- ${subj.name} : ${n} chapitres à répartir sur 9 mois ---`)
    for (let i = 0; i < n; i++) {
      const ch = chs[i]
      if (alreadyPlaced.has(ch.id)) continue
      const monthIndex = Math.floor((i * 9) / n)
      const month = monthRows[monthIndex]
      if (DRY_RUN) { console.log(`[dry-run] ${ch.title} → ${month.label}`); continue }
      await sb('/rest/v1/curriculum_items', {
        method: 'POST',
        body: JSON.stringify({ subject_id: subj.id, chapter_id: ch.id, item_type: 'chapter', school_month_id: month.id, term_id: month.termId, is_core: true, order_index: i }),
      })
      created++
    }
  }
  console.log(`\n${DRY_RUN ? '[dry-run] créerait' : '✓ créé'} ${DRY_RUN ? '' : created + ' '}curriculum_items (chapitres BEPC).`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
