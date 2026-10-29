/**
 * Philosophie C et D : ne garder que les 4 premiers chapitres (Leçons 1-4) —
 * demande utilisateur du 29/10/2026. Les chapitres suivants (Leçon 5, Leçon 6,
 * Annexes, Sujets de dissertation) sont spécifiques à la série A et retirés de C/D.
 *
 * Cible : chapitres `order_index >= 4` des matières Philosophie bac_c et bac_d.
 * Suppression par chapitre (cascade : leçons, progression…). La série A n'est
 * pas touchée. `source_chapter_id` est ON DELETE SET NULL : la copie « Sujets »
 * de A perd son lien de synchro (contenu conservé), sans autre effet.
 *
 * Usage :
 *   node scripts/trim-philo-cd.mjs            (dry-run + backup)
 *   node scripts/trim-philo-cd.mjs --confirm
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CONFIRM = process.argv.includes('--confirm')

const env = Object.fromEntries(
  readFileSync(join(ROOT, 'apps', 'web', '.env.local'), 'utf-8')
    .split(/\r?\n/).filter((l) => l.includes('=') && !l.trimStart().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const URL = env.NEXT_PUBLIC_SUPABASE_URL, KEY = env.SUPABASE_SERVICE_ROLE_KEY
async function sb(path, init = {}) {
  const r = await fetch(`${URL}/rest/v1${path}`, { ...init, headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}`, ...(init.headers ?? {}) } })
  const t = await r.text(); const d = t ? JSON.parse(t) : null
  if (!r.ok) throw new Error(`${init.method || 'GET'} ${path} -> ${r.status}: ${JSON.stringify(d)}`)
  return d
}
const inList = (ids) => `(${ids.join(',')})`

const backup = { created_at: new Date().toISOString(), note: 'Philo C/D : chapitres order>=4 retirés (spécifiques série A)', chapters: [], lessons: [] }
const targetIds = []

for (const lv of ['bac_c', 'bac_d']) {
  const [subj] = await sb(`/subjects?select=id&name=eq.Philosophie&level=eq.${lv}`)
  const chs = await sb(`/chapters?subject_id=eq.${subj.id}&select=*&order=order_index`)
  const toRemove = chs.filter((c) => c.order_index >= 4)
  console.log(`\nPhilo ${lv} : ${chs.length} chapitres, ${toRemove.length} à retirer (garde ${chs.length - toRemove.length}) :`)
  for (const c of toRemove) console.log(`   - [${c.order_index}] ${c.title}`)
  backup.chapters.push(...toRemove.map((c) => ({ ...c, _level: lv })))
  targetIds.push(...toRemove.map((c) => c.id))
}

if (targetIds.length) {
  const lessons = await sb(`/lessons?chapter_id=in.${inList(targetIds)}&select=*`)
  backup.lessons.push(...lessons)
}

mkdirSync(join(ROOT, 'backups'), { recursive: true })
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const file = join(ROOT, 'backups', `philo-cd-trim-${stamp}.json`)
writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8')
console.log(`\nSauvegarde : ${file} (${backup.chapters.length} chapitres, ${backup.lessons.length} leçons)`)

if (!CONFIRM) { console.log('\n[DRY-RUN] Ajoute --confirm pour supprimer.'); process.exit(0) }

await sb(`/chapters?id=in.${inList(targetIds)}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } })

for (const lv of ['bac_c', 'bac_d']) {
  const [subj] = await sb(`/subjects?select=id&name=eq.Philosophie&level=eq.${lv}`)
  const left = await sb(`/chapters?subject_id=eq.${subj.id}&select=id`)
  console.log(`Philo ${lv} : ${left.length} chapitres restants.`)
}
console.log('\nSuppression effectuée.')
