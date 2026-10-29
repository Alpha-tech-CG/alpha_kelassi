/**
 * Seed — HISTOIRE-GÉOGRAPHIE, Terminales A, C et D (programme INRAP).
 *
 * Sources : `scripts/content/histoire-geo-terminale/*.md` (h1…h7 : histoire,
 * g1…g7 : géographie), rédigées en fusionnant, leçon par leçon, les cours
 * fournis (J.-E. Samba, B. V. Balenda, « page de l'apprenant ») et le contenu
 * déjà en base, en gardant la version la plus complète. Le programme INRAP
 * fixe l'ordre : 7 objectifs généraux en histoire (20 leçons), 7 en géographie
 * (24 leçons).
 *
 * Organisation « parcours guidé », comme en 3e : un chapitre par leçon du
 * programme, dans l'ordre, avec en description « HISTOIRE · OG n — module ».
 *
 * Séries : la matière « Histoire-Géographie » de Terminale C reçoit les
 * chapitres originaux ; la D et la A en reçoivent des COPIES LIÉES (migration
 * 060), tenues à jour automatiquement depuis la console. Les leçons dispensées
 * aux séries C et D par le programme (rayonnement de l'Allemagne, module Brésil)
 * sont créées uniquement en Terminale A.
 *
 * Les anciens chapitres de ces matières (Terminale C : 2e Guerre mondiale, ONU,
 * guerre froide, décolonisation, milieu physique ; Terminale D : milieu
 * physique) sont remplacés : leur contenu a été intégré aux nouvelles leçons ;
 * le résumé et le quiz du milieu physique sont conservés (le quiz devient un
 * vrai QCM corrigé). Ils sont sauvegardés dans scripts/.backup-hg-terminale-*.json.
 *
 * Usage :
 *   node scripts/seed-histoire-geo-terminale.mjs --dry-run
 *   node scripts/seed-histoire-geo-terminale.mjs
 */
import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }),
)
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

async function sb(path, init) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
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
const rpc = (fn, args) => sb(`/rpc/${fn}`, { method: 'POST', body: JSON.stringify(args) })

/* ── Matières cibles (IDs vérifiés en base le 09/10/2026) ────────────────── */
const SUBJECTS = {
  bac_c: '4202d209-291e-4adf-88fd-b52af08c3a47', // original
  bac_d: '8386f566-931a-440d-a521-15100981090b', // copies liées
  bac_a: '8860f08b-7300-4c92-8f0a-5c317c86ce60', // copies liées + leçons propres à la série A
}

/* ── Lecture des sources ─────────────────────────────────────────────────── */
const DIR = join(__dirname, 'content', 'histoire-geo-terminale')
const files = readdirSync(DIR).filter((f) => f.endsWith('.md'))
  .sort((a, b) => (a[0] === b[0] ? a.localeCompare(b) : a[0] === 'h' ? -1 : 1)) // histoire puis géographie

const A_ONLY = /\s*\[série A\]\s*$/
const lessons = []
for (const file of files) {
  const partie = file.startsWith('h') ? 'HISTOIRE' : 'GÉOGRAPHIE'
  const raw = readFileSync(join(DIR, file), 'utf-8').replace(/<!--[\s\S]*?-->/g, '')
  const mod = raw.match(/^# (.+)$/m)
  if (!mod) throw new Error(`${file} : titre de module « # OG … » manquant`)
  const moduleAOnly = A_ONLY.test(mod[1])
  const moduleTitle = mod[1].replace(A_ONLY, '').trim()
  const parts = raw.split(/^## Leçon (\d+) — (.+)$/m)
  for (let i = 1; i < parts.length; i += 3) {
    const n = Number(parts[i])
    const heading = parts[i + 1].trim()
    const content = parts[i + 2].trim()
    if (content.length < 500) throw new Error(`${file} leçon ${n} : contenu suspect (${content.length} car.)`)
    lessons.push({
      partie, n, file,
      title: heading.replace(A_ONLY, '').trim(),
      aOnly: moduleAOnly || A_ONLY.test(heading),
      description: `${partie} · ${moduleTitle}`,
      content,
    })
  }
}
lessons.forEach((l, i) => { l.order = i })
const nH = lessons.filter((l) => l.partie === 'HISTOIRE').length
if (nH !== 20 || lessons.length !== 44) throw new Error(`Attendu 20 + 24 leçons, trouvé ${nH} + ${lessons.length - nH}`)

/* ── Compléments repris de l'ancien chapitre « Le milieu physique du Congo » ── */
const MILIEU_TITLE = 'Les différents aspects physiques du Congo'
const RESUME = `### À retenir

- **Position** : Afrique centrale, à cheval sur l'équateur ; **342 000 km²** ; façade maritime de 170 km ; voisins : Cameroun, RCA, RDC, Cabinda (Angola), Gabon, océan Atlantique.
- **Relief** : 3 plaines (côtière, vallée du Niari, Cuvette congolaise), des plateaux (Bembé et Dondo, Cataractes, Batéké, Nord-Ouest, Oubanguiens) et 2 ensembles montagneux (Mayombe ≈ 930 m, Chaillu ≈ 950 m). Point culminant : **mont Nabemba (≈ 1 000 m)**.
- **Climat** : chaud et humide, 3 types — **équatorial** (nord), **subéquatorial** (centre), **tropical humide** (sud) ; les saisons dépendent du déplacement du **FIT**.
- **Sols** : ferralitiques (typiques, lessivés, faiblement ferralitiques) et hydromorphes ; peu fertiles mais amendables.
- **Végétation** : forêt **≈ 65 %** (terre ferme, inondée, galeries, secondaire, plantations), savane **≈ 35 %**.
- **Hydrographie** : bassin du **Congo** (fleuve de 4 700 km, ≈ 40 000 m³/s) et bassin du **Kouilou-Niari** ; petits bassins côtiers ; lac Télé, lac Cayo, lagune de Conkouati.`

const QCM = {
  title: 'QCM — Le milieu physique du Congo',
  time_limit_sec: 300,
  questions: [
    { prompt: 'Quelle est la superficie du Congo ?', options: ['132 000 km²', '342 000 km²', '500 000 km²', '240 000 km²'], correct_index: 1, explanation: '342 000 km².' },
    { prompt: 'Quel est le point culminant du Congo ?', options: ['Le mont Birougou', 'Le mont Foungouti', 'Le mont Nabemba', 'Le mont Lékéti'], correct_index: 2, explanation: 'Le mont Nabemba (≈ 1 000 m), dans la Sangha occidentale.' },
    { prompt: 'La Cuvette congolaise couvre environ :', options: ['60 000 km²', '150 000 km²', '230 000 km²', '342 000 km²'], correct_index: 1, explanation: 'Environ 150 000 km², près du tiers du pays.' },
    { prompt: 'Quel climat règne au nord (Likouala, Sangha) ?', options: ['Tropical humide', 'Subéquatorial', 'Équatorial (guinéen forestier)', 'Désertique'], correct_index: 2, explanation: 'Le climat équatorial : pluies abondantes toute l\'année.' },
    { prompt: 'Le débit moyen du fleuve Congo est d\'environ :', options: ['700 m³/s', '4 700 m³/s', '40 000 m³/s', '1 200 m³/s'], correct_index: 2, explanation: '≈ 40 000 m³/s, 2e débit du monde après l\'Amazone.' },
    { prompt: 'La forêt occupe quelle part du territoire ?', options: ['35 %', '50 %', '65 %', '80 %'], correct_index: 2, explanation: 'Environ 65 % (la savane occupe 35 %).' },
  ],
}

/* ── Exécution ───────────────────────────────────────────────────────────── */
const log = (...a) => console.log(...a)
log(`${DRY_RUN ? '[DRY-RUN] ' : ''}${lessons.length} leçons : ${nH} d'histoire, ${lessons.length - nH} de géographie ; ${lessons.filter((l) => l.aOnly).length} propres à la série A.`)
for (const l of lessons) log(`  ${String(l.order).padStart(2)}  ${l.aOnly ? 'A    ' : 'A C D'}  ${l.partie === 'HISTOIRE' ? 'H' : 'G'}${l.n}  ${l.title}  (${l.content.length} car.)`)

// 1. Sauvegarde puis retrait des anciens chapitres (hors chapitres créés par ce seed).
const ourTitles = new Set(lessons.map((l) => l.title))
const backup = {}
const stale = []
for (const [level, sid] of Object.entries(SUBJECTS)) {
  const chs = await sb(`/chapters?subject_id=eq.${sid}&select=id,title,description,order_index,source_chapter_id,lessons(*),exercises(*),quizzes(*)`)
  backup[level] = chs
  for (const c of chs) if (!ourTitles.has(c.title)) stale.push({ level, id: c.id, title: c.title })
}
log(`\nAnciens chapitres remplacés (${stale.length}) :`)
for (const s of stale) log(`  - ${s.level} : ${s.title}`)

if (DRY_RUN) { log('\n[DRY-RUN] Rien n\'a été écrit.'); process.exit(0) }

const backupFile = join(__dirname, `.backup-hg-terminale-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
writeFileSync(backupFile, JSON.stringify(backup, null, 2))
log(`\nSauvegarde : ${backupFile}`)
for (const s of stale) await sb(`/chapters?id=eq.${s.id}`, { method: 'DELETE' })

// 2. Chapitres originaux : Terminale C (communs) et Terminale A (propres à la série A).
async function upsertChapter(subjectId, l) {
  const [existing] = await sb(`/chapters?subject_id=eq.${subjectId}&title=eq.${encodeURIComponent(l.title)}&select=id`)
  const fields = { title: l.title, description: l.description, order_index: l.order }
  const chapter = existing
    ? (await sb(`/chapters?id=eq.${existing.id}`, { method: 'PATCH', body: JSON.stringify(fields) }))[0]
    : (await sb('/chapters', { method: 'POST', body: JSON.stringify({ subject_id: subjectId, ...fields }) }))[0]

  const want = [{ type: 'cours', title: l.title, content: l.content, order_index: 0 }]
  if (l.title === MILIEU_TITLE) want.push({ type: 'resume', title: 'L\'essentiel — Le milieu physique du Congo', content: RESUME, order_index: 1 })
  const have = await sb(`/lessons?chapter_id=eq.${chapter.id}&select=id,type,title`)
  for (const w of want) {
    const h = have.find((x) => x.type === w.type && x.title === w.title)
    if (h) await sb(`/lessons?id=eq.${h.id}`, { method: 'PATCH', body: JSON.stringify({ content: w.content, order_index: w.order_index }) })
    else await sb('/lessons', { method: 'POST', body: JSON.stringify({ chapter_id: chapter.id, is_premium: false, ...w }) })
  }

  if (l.title === MILIEU_TITLE) {
    const [subject] = await sb(`/subjects?id=eq.${subjectId}&select=level`)
    let [quiz] = await sb(`/quizzes?chapter_id=eq.${chapter.id}&deleted_at=is.null&select=id`)
    if (!quiz) [quiz] = await sb('/quizzes', { method: 'POST', body: JSON.stringify({ chapter_id: chapter.id, subject_id: subjectId, level: subject.level, title: QCM.title, time_limit_sec: QCM.time_limit_sec, is_premium: false }) })
    const qs = await sb(`/quiz_questions?quiz_id=eq.${quiz.id}&select=id`)
    if (qs.length === 0) {
      await sb('/quiz_questions', { method: 'POST', body: JSON.stringify(QCM.questions.map((q, i) => ({ quiz_id: quiz.id, position: i + 1, ...q }))) })
    }
  }
  return chapter.id
}

const originals = new Map()
for (const l of lessons) {
  const subjectId = l.aOnly ? SUBJECTS.bac_a : SUBJECTS.bac_c
  originals.set(l.title, await upsertChapter(subjectId, l))
}
log(`\n${originals.size} chapitres originaux écrits.`)

// 3. Copies liées en Terminale D et A, puis ordre du parcours guidé.
for (const level of ['bac_d', 'bac_a']) {
  for (const l of lessons) {
    if (l.aOnly) continue
    const copyId = await rpc('copy_chapter_to_subject', { p_chapter: originals.get(l.title), p_subject: SUBJECTS[level] })
    await sb(`/chapters?id=eq.${copyId}`, { method: 'PATCH', body: JSON.stringify({ order_index: l.order, description: l.description }) })
  }
}
for (const l of lessons) if (!l.aOnly) await rpc('sync_chapter_copies', { p_chapter: originals.get(l.title) })
log('Copies liées en Terminale D et A créées et synchronisées.')

// 4. Contrôle.
for (const [level, sid] of Object.entries(SUBJECTS)) {
  const chs = await sb(`/chapters?subject_id=eq.${sid}&select=id,source_chapter_id,lessons(count)&order=order_index`)
  const linked = chs.filter((c) => c.source_chapter_id).length
  log(`  ${level} : ${chs.length} chapitres (${linked} copies liées), ${chs.reduce((n, c) => n + (c.lessons?.[0]?.count ?? 0), 0)} leçons`)
}
