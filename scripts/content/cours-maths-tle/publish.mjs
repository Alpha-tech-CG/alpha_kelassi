/**
 * Publie les cours de Maths Terminale C & D réécrits « à notre façon » (encadrés
 * définition / théorème / formule / exemple…) : remplace le contenu de la leçon de
 * chaque chapitre, en Tle C et en Tle D (chapitres retrouvés par leur titre).
 *
 * Sauvegarde d'abord l'ancien contenu dans backups/ (restaurable avec --restore <fichier>).
 * Usage : node scripts/content/cours-maths-tle/publish.mjs [--dry-run]
 *         node scripts/content/cours-maths-tle/publish.mjs --restore backups/<fichier>.json
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY = process.argv.includes('--dry-run')
const RESTORE = process.argv.includes('--restore') ? process.argv[process.argv.indexOf('--restore') + 1] : null
const env = Object.fromEntries(readFileSync(join(__dirname, '..', '..', '..', 'apps', 'web', '.env.local'), 'utf-8').split('\n').filter(l => l.includes('=') && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const URL = env.NEXT_PUBLIC_SUPABASE_URL, KEY = env.SUPABASE_SERVICE_ROLE_KEY
async function sb(path, init) { const r = await fetch(`${URL}${path}`, { ...init, headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}`, Prefer: 'return=representation', ...(init?.headers ?? {}) } }); const t = await r.text(); const j = t ? JSON.parse(t) : null; if (!r.ok) throw new Error(`${init?.method ?? 'GET'} ${path} -> ${r.status}: ${JSON.stringify(j).slice(0, 200)}`); return j }

const SUBJECTS = { C: '9de57219-0d1c-46be-a134-8e7388ccbe16', D: 'f5be9db1-f435-4cb6-873d-6d813dadbd58' } // Maths bac_c, bac_d
const FILES = {
  'Fonctions numériques': 'fonctions-numeriques', 'Suites numériques': 'suites',
  'Fonction logarithme népérien': 'logarithme', 'Fonction exponentielle': 'exponentielle',
  "Intégrale d'une fonction continue": 'integrale', 'Équations différentielles': 'equations-differentielles',
  'Courbes paramétrées': 'courbes-parametrees', 'Nombres complexes': 'complexes', 'Arithmétique': 'arithmetique',
  'Algèbre linéaire': 'algebre-lineaire', 'Angles orientés': 'angles-orientes', 'Transformations planes': 'transformations-planes',
  'Isométries du plan': 'isometries', 'Homothéties': 'homotheties', 'Statistique': 'statistique',
  'Dénombrement': 'denombrement', 'Probabilités': 'probabilites',
}

async function lessonsToUpdate() {
  const out = []
  for (const [serie, subject] of Object.entries(SUBJECTS)) {
    const chapters = await sb(`/rest/v1/chapters?select=id,title,lessons(id,title,content)&subject_id=eq.${subject}&order=order_index`)
    for (const c of chapters) {
      const slug = FILES[c.title]
      if (!slug) { console.warn(`  ? chapitre sans fichier : ${serie} « ${c.title} »`); continue }
      if (c.lessons.length !== 1) throw new Error(`${serie} « ${c.title} » : ${c.lessons.length} leçons (1 attendue)`)
      out.push({ serie, chapter: c.title, chapterId: c.id, lesson: c.lessons[0], slug })
    }
  }
  return out
}

async function main() {
  if (RESTORE) {
    const backup = JSON.parse(readFileSync(join(__dirname, RESTORE), 'utf-8'))
    for (const b of backup) await sb(`/rest/v1/lessons?id=eq.${b.lessonId}`, { method: 'PATCH', body: JSON.stringify({ content: b.content }) })
    console.log(`Restauré : ${backup.length} leçons.`)
    return
  }
  const items = await lessonsToUpdate()
  const copies = await sb(`/rest/v1/chapters?select=id,title,subject_id&source_chapter_id=in.(${items.map(i => i.chapterId).join(',')})`)
  if (copies.length) console.warn(`  ! ${copies.length} copie(s) liée(s) à synchroniser :`, copies.map(c => c.title).join(', '))

  const stamp = new Date().toISOString().slice(0, 10)
  mkdirSync(join(__dirname, 'backups'), { recursive: true })
  const backupFile = join(__dirname, 'backups', `lecons-avant-reecriture-${stamp}.json`)
  writeFileSync(backupFile, JSON.stringify(items.map(i => ({ serie: i.serie, chapter: i.chapter, lessonId: i.lesson.id, content: i.lesson.content })), null, 1))
  console.log(`Sauvegarde : ${backupFile}`)

  for (const i of items) {
    const content = readFileSync(join(__dirname, `${i.slug}.md`), 'utf-8').trim() + '\n'
    console.log(`${DRY ? '[dry] ' : ''}Tle ${i.serie} · ${i.chapter} : ${i.lesson.content.length} → ${content.length} car.`)
    if (!DRY) await sb(`/rest/v1/lessons?id=eq.${i.lesson.id}`, { method: 'PATCH', body: JSON.stringify({ content }) })
  }

  if (!DRY) {
    const check = await lessonsToUpdate()
    const bad = check.filter(i => i.lesson.content !== readFileSync(join(__dirname, `${i.slug}.md`), 'utf-8').trim() + '\n')
    console.log(bad.length ? `ÉCHEC : ${bad.length} leçon(s) différente(s)` : `Vérifié : ${check.length} leçons à jour.`)
  }
}
main().catch(e => { console.error(e); process.exit(1) })
