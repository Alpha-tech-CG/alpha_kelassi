/**
 * Cours d'anglais — base de grammaire pour les Terminales, 10/11/2026.
 *
 * Demande : donner aux Terminales un vrai socle de grammaire anglaise bien
 * expliqué (grammaire de base + conjugaison + WH-questions + autres règles),
 * en reprenant le cours de 3e et en l'étoffant.
 *
 * Cible :
 *   - bac_a / bac_c / bac_d (anglais VIDE) → le cours devient leur programme.
 *   - bac_g2 / bac_g3 (11 chapitres d'anglais commercial) → les 13 chapitres de
 *     grammaire sont AJOUTÉS EN TÊTE (order_index 0..12), les chapitres
 *     existants décalés après (+13).
 *
 * 13 chapitres, chacun = 1+ leçon « cours » + 1 « quiz ». Contenu :
 *   - chapitre 1 : scripts/content/anglais-3e/12-to-be.md, 13-to-have.md (réemploi)
 *   - chapitres 2..13 : scripts/content/anglais-terminale/0X-*.md
 *
 * Idempotent (ne refait pas un sujet qui a déjà le chapitre WH-questions),
 * non destructif, sauvegarde complète avant écriture.
 *
 * Usage :
 *   node scripts/seed-anglais-terminale-grammaire.mjs            (dry-run + backup)
 *   node scripts/seed-anglais-terminale-grammaire.mjs --confirm
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
const read = (dir, f) => readFileSync(join(__dirname, 'content', dir, f), 'utf-8').trim()

const MARKER = 'Les questions interrogatives (WH-questions)'

// Un chapitre : { title, desc, lessons: [{type,title,content}] }
function buildChapters() {
  const t = (f) => read('anglais-terminale', f)
  const b3 = (f) => read('anglais-3e', f)
  return [
    {
      title: 'Les auxiliaires : to be et to have (Auxiliary verbs)',
      desc: 'Les deux verbes de base : to be (être) et to have (avoir).',
      lessons: [
        { type: 'cours', title: 'Le verbe to be (être)', content: b3('12-to-be.md') },
        { type: 'cours', title: 'Le verbe to have / to have got (avoir)', content: b3('13-to-have.md') },
        { type: 'quiz', title: 'Exercice — to be et to have', content:
`Complete with **to be** (am/is/are) or **to have** (have/has), then check.

1. I ___ a student.  2. She ___ two brothers.  3. They ___ at school.
4. We ___ a new car.  5. He ___ afraid of dogs.  6. ___ you hungry?

### Corrigé
1. am  2. has  3. are  4. have  5. is  6. Are` },
      ],
    },
    { title: MARKER, desc: 'Les questions ouvertes avec what, who, where, when, why, how…', file: '02-wh-questions.md', quiz:
`Complete each question with the right WH-word (what, where, when, why, who, how old, how many).

1. ___ is your name?  2. ___ do you live?  3. ___ are you late?
4. ___ is your teacher?  5. ___ are you? (age)  6. ___ books do you have?

### Corrigé
1. What  2. Where  3. Why  4. Who  5. How old  6. How many` },
    { title: 'Le présent simple (Present Simple)', desc: 'Habitudes et vérités générales ; le -s à la 3ᵉ personne.', file: '03-present-simple.md', quiz:
`Put the verb in the present simple.

1. She (go) ___ to school every day.  2. They (not/like) ___ coffee.
3. (you/speak) ___ English?  4. He (study) ___ hard.  5. Water (boil) ___ at 100°C.

### Corrigé
1. goes  2. don't like  3. Do you speak  4. studies  5. boils` },
    { title: 'Le présent continu (Present Continuous)', desc: 'Action en cours : to be + verbe-ing.', file: '04-present-continuous.md', quiz:
`Put the verb in the present continuous.

1. Look! It (rain) ___ .  2. I (read) ___ a book now.  3. (they/play) ___ ?
4. He (not/sleep) ___ .  5. She (write) ___ a letter.

### Corrigé
1. is raining  2. am reading  3. Are they playing  4. isn't sleeping  5. is writing` },
    { title: 'Le prétérit (Simple Past)', desc: 'Passé révolu ; verbes réguliers (-ed) et irréguliers ; did.', file: '05-simple-past.md', quiz:
`Put the verb in the simple past.

1. She (go) ___ to Paris last year.  2. I (not/see) ___ him yesterday.
3. (you/finish) ___ your work?  4. They (play) ___ football.  5. He (be) ___ happy.

### Corrigé
1. went  2. didn't see  3. Did you finish  4. played  5. was` },
    { title: 'Le present perfect', desc: 'Lien passé-présent ; have/has + participe passé ; since/for/ago.', file: '06-present-perfect.md', quiz:
`Choose present perfect or simple past.

1. I ___ (lose) my keys — I can't find them. 2. She ___ (arrive) two days ago.
3. ___ you ever ___ (be) to London? 4. We ___ (live) here since 2010.

### Corrigé
1. have lost  2. arrived  3. Have / been  4. have lived` },
    { title: 'Le futur : will et be going to (Future)', desc: 'Décision, prédiction, intention.', file: '07-future.md', quiz:
`Will or be going to?

1. The phone is ringing — I ___ answer it. 2. Look at those clouds — it ___ rain.
3. I ___ study medicine (my plan). 4. I promise I ___ help you.

### Corrigé
1. will  2. is going to  3. am going to  4. will` },
    { title: 'Les verbes modaux (Modal Verbs)', desc: 'Capacité, permission, obligation, conseil, probabilité.', file: '08-modals.md', quiz:
`Choose the right modal (can, must, should, mustn't, might).

1. I ___ swim very well. 2. You ___ study for the exam (obligation).
3. You ___ smoke here (interdit). 4. You ___ see a doctor (conseil). 5. She ___ be late (possibilité).

### Corrigé
1. can  2. must  3. mustn't  4. should  5. might` },
    { title: 'Comparatifs et superlatifs (Comparatives & Superlatives)', desc: 'Plus/moins que ; le plus/le moins ; irréguliers.', file: '09-comparatives-superlatives.md', quiz:
`Complete (comparative or superlative).

1. Tom is ___ (tall) than Sam. 2. This is the ___ (interesting) book. 3. She is ___ (good) than me.
4. It's the ___ (big) city. 5. He is as ___ (strong) as his brother.

### Corrigé
1. taller  2. most interesting  3. better  4. biggest  5. strong` },
    { title: 'La voix passive (Passive Voice)', desc: 'Le sujet subit l’action : to be + participe passé.', file: '10-passive.md', quiz:
`Turn into the passive voice.

1. The teacher corrects the exam. 2. Shakespeare wrote this play. 3. They will finish the project.

### Corrigé
1. The exam is corrected by the teacher.
2. This play was written by Shakespeare.
3. The project will be finished (by them).` },
    { title: 'Le discours indirect (Reported Speech)', desc: 'Rapporter des paroles ; recul des temps.', file: '11-reported-speech.md', quiz:
`Report the sentences.

1. She said, "I am tired." 2. He said, "I will call you." 3. "Where do you live?" she asked.

### Corrigé
1. She said (that) she was tired.
2. He said (that) he would call me.
3. She asked where I lived.` },
    { title: 'Noms : articles, pluriels et quantifieurs (Nouns)', desc: 'a/an/the ; pluriels ; some/any/much/many.', file: '12-nouns-articles-quantifiers.md', quiz:
`Complete (a/an, plural, or some/any/much/many).

1. I eat ___ apple every day. 2. One child, two ___ . 3. How ___ water do you drink?
4. How ___ books do you have? 5. I don't have ___ money.

### Corrigé
1. an  2. children  3. much  4. many  5. any` },
    { title: 'Les prépositions (Prepositions)', desc: 'Lieu, temps (at/in/on) et mouvement.', file: '13-prepositions.md', quiz:
`Complete with at, in or on.

1. ___ 7 o'clock  2. ___ Monday  3. ___ July  4. ___ night  5. ___ 2026  6. ___ July 14th

### Corrigé
1. at  2. on  3. in  4. at  5. in  6. on` },
  ].map((c) => {
    if (c.file) {
      c.lessons = [
        { type: 'cours', title: c.title.replace(/\s*\(.*\)$/, ''), content: t(c.file) },
        { type: 'quiz', title: 'Exercice — ' + c.title.replace(/\s*\(.*\)$/, ''), content: c.quiz },
      ]
    }
    return c
  })
}

const TARGETS = [
  { level: 'bac_a', mode: 'fill' },
  { level: 'bac_c', mode: 'fill' },
  { level: 'bac_d', mode: 'fill' },
  { level: 'bac_g2', mode: 'prepend' },
  { level: 'bac_g3', mode: 'prepend' },
]

async function main() {
  const chapters = buildChapters()
  const N = chapters.length
  console.log(`Cours à poser : ${N} chapitres (${chapters.reduce((a, c) => a + c.lessons.length, 0)} leçons).`)

  // Backup global de l'anglais Terminale (tous les niveaux cibles) avant écriture
  const subsAll = await sb(`/subjects?name=eq.Anglais&level=in.(${TARGETS.map((t) => t.level).join(',')})&select=id,name,level`)
  const ids = subsAll.map((s) => s.id)
  const chsAll = ids.length ? await sb(`/chapters?subject_id=in.(${ids.join(',')})&select=*`) : []
  const chIds = chsAll.map((c) => c.id)
  const lssAll = chIds.length ? await sb(`/lessons?chapter_id=in.(${chIds.join(',')})&select=*`) : []
  const backup = { created_at: new Date().toISOString(), note: 'État AVANT cours grammaire Anglais Terminale', subjects: subsAll, chapters: chsAll, lessons: lssAll }
  mkdirSync(join(ROOT, 'backups'), { recursive: true })
  const bfile = join(ROOT, 'backups', `anglais-terminale-grammaire-${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  writeFileSync(bfile, JSON.stringify(backup, null, 2), 'utf-8')
  console.log(`Sauvegarde : ${bfile}\n`)

  for (const tgt of TARGETS) {
    const s = subsAll.find((x) => x.level === tgt.level)
    if (!s) { console.log(`• ${tgt.level}: matière Anglais introuvable — ignoré.`); continue }
    const existing = chsAll.filter((c) => c.subject_id === s.id).sort((a, b) => a.order_index - b.order_index)
    if (existing.some((c) => c.title === MARKER)) { console.log(`• ${tgt.level}: déjà fait (idempotent) — ignoré.`); continue }

    console.log(`• ${tgt.level} (${tgt.mode}) : ${existing.length} chapitre(s) existant(s) → +${N} chapitres de grammaire`)
    if (!CONFIRM) continue

    // prepend : décaler les chapitres existants de +N (ordre décroissant)
    if (tgt.mode === 'prepend') {
      for (const c of [...existing].sort((a, b) => b.order_index - a.order_index)) {
        await sb(`/chapters?id=eq.${c.id}`, { method: 'PATCH', body: JSON.stringify({ order_index: c.order_index + N }) })
      }
    }

    // créer les chapitres 0..N-1 + leurs leçons
    for (let i = 0; i < N; i++) {
      const ch = chapters[i]
      const [row] = await sb('/chapters', {
        method: 'POST', headers: { Prefer: 'return=representation' },
        body: JSON.stringify({ subject_id: s.id, title: ch.title, description: ch.desc, order_index: i }),
      })
      await sb('/lessons', {
        method: 'POST', headers: { Prefer: 'return=minimal' },
        body: JSON.stringify(ch.lessons.map((l, j) => ({
          chapter_id: row.id, type: l.type, title: l.title, content: l.content,
          order_index: j, duration_min: l.type === 'quiz' ? 5 : 8, is_premium: false,
        }))),
      })
    }
    console.log(`  ✓ ${tgt.level} fait.`)
  }
  console.log(CONFIRM ? '\n✓ Appliqué.' : '\n[DRY-RUN] Ajoute --confirm pour appliquer.')
}
main().catch((e) => { console.error('✗', e); process.exit(1) })
