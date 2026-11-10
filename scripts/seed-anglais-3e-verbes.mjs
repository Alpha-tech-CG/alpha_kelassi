/**
 * Ajout des auxiliaires « to be » et « to have » — Anglais 3e (BEPC), 10/11/2026.
 *
 * Le cours d'anglais 3e couvrait la voix passive, les comparatifs, les temps,
 * les verbes irréguliers… mais pas les verbes de base « to be » et « to have ».
 * On ajoute UN chapitre « Les auxiliaires : to be et to have », placé EN TÊTE
 * (order_index 0 ; les 12 chapitres existants sont décalés de +1), avec :
 *   - cours #0 : Le verbe to be (être)
 *   - cours #1 : Le verbe to have / to have got (avoir)
 *   - quiz  #2 : Exercice — to be et to have
 *
 * Source : scripts/content/anglais-3e/12-to-be.md, 13-to-have.md + cahier de
 * l'élève (cours_physique_technologie.md, partie Anglais).
 * Non destructif, idempotent (ne recrée pas si le chapitre existe déjà),
 * sauvegarde complète avant écriture.
 *
 * Usage :
 *   node scripts/seed-anglais-3e-verbes.mjs            (dry-run + backup)
 *   node scripts/seed-anglais-3e-verbes.mjs --confirm
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC = join(__dirname, 'content', 'anglais-3e')
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
const read = (f) => readFileSync(join(SRC, f), 'utf-8').trim()

const CHAPTER_TITLE = 'Les auxiliaires : to be et to have (Auxiliary verbs)'
const CHAPTER_DESC = 'Les deux verbes de base de l’anglais : to be (être) et to have (avoir) — affirmation, négation, question, contractions et expressions idiomatiques.'

const QUIZ = `Complete with the correct form of **to be** (am / is / are) or **to have** (have / has), then check your answers.

1. I ___ a student. (to be)
2. She ___ two brothers. (to have)
3. They ___ at school now. (to be)
4. We ___ a new teacher. (to have)
5. He ___ afraid of dogs. (to be)
6. My parents ___ got a car. (to have)
7. ___ you hungry? (to be)
8. ___ she got a pen? (to have)

### Corrigé
1. I **am** a student.
2. She **has** two brothers.
3. They **are** at school now.
4. We **have** a new teacher.
5. He **is** afraid of dogs.
6. My parents **have** got a car.
7. **Are** you hungry?
8. **Has** she got a pen?`

async function main() {
  const [subject] = await sb('/subjects?level=eq.bepc&name=eq.Anglais&select=id,name')
  if (!subject) throw new Error('Matière Anglais (bepc) introuvable')
  const chs = await sb(`/chapters?subject_id=eq.${subject.id}&select=id,title,order_index&order=order_index`)
  const lss = chs.length ? await sb(`/lessons?chapter_id=in.(${chs.map((c) => c.id).join(',')})&select=*`) : []

  // Sauvegarde
  const backup = { created_at: new Date().toISOString(), note: 'État AVANT ajout to be / to have (Anglais 3e)', subject, chapters: chs, lessons: lss }
  mkdirSync(join(ROOT, 'backups'), { recursive: true })
  const bfile = join(ROOT, 'backups', `anglais-3e-verbes-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  writeFileSync(bfile, JSON.stringify(backup, null, 2), 'utf-8')
  console.log(`Sauvegarde : ${bfile}\n`)

  if (chs.some((c) => c.title === CHAPTER_TITLE)) {
    console.log('⤷ Le chapitre « to be / to have » existe déjà — rien à faire (idempotent).')
    return
  }

  const toBe = read('12-to-be.md')
  const toHave = read('13-to-have.md')
  console.log(`Chapitre à créer : « ${CHAPTER_TITLE} » en tête (order_index 0)`)
  console.log(`  cours #0  Le verbe to be (être)                 ${toBe.length}c`)
  console.log(`  cours #1  Le verbe to have / to have got (avoir) ${toHave.length}c`)
  console.log(`  quiz  #2  Exercice — to be et to have            ${QUIZ.length}c`)
  console.log(`Décalage des ${chs.length} chapitres existants : order_index +1\n`)

  if (!CONFIRM) { console.log('[DRY-RUN] Ajoute --confirm pour appliquer.'); return }

  // 1) Décaler les chapitres existants (ordre décroissant pour éviter toute collision)
  for (const c of [...chs].sort((a, b) => b.order_index - a.order_index)) {
    await sb(`/chapters?id=eq.${c.id}`, { method: 'PATCH', body: JSON.stringify({ order_index: c.order_index + 1 }) })
  }

  // 2) Créer le nouveau chapitre en tête
  const [chap] = await sb('/chapters', {
    method: 'POST', headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ subject_id: subject.id, title: CHAPTER_TITLE, description: CHAPTER_DESC, order_index: 0 }),
  })

  // 3) Insérer les leçons
  await sb('/lessons', {
    method: 'POST', headers: { Prefer: 'return=minimal' },
    body: JSON.stringify([
      { chapter_id: chap.id, type: 'cours', title: 'Le verbe to be (être)', content: toBe, order_index: 0, duration_min: 8, is_premium: false },
      { chapter_id: chap.id, type: 'cours', title: 'Le verbe to have / to have got (avoir)', content: toHave, order_index: 1, duration_min: 8, is_premium: false },
      { chapter_id: chap.id, type: 'quiz', title: 'Exercice — to be et to have', content: QUIZ, order_index: 2, duration_min: 5, is_premium: false },
    ]),
  })

  console.log('✓ Appliqué : chapitre + 3 leçons créés, chapitres existants décalés.')
}
main().catch((e) => { console.error('✗', e); process.exit(1) })
