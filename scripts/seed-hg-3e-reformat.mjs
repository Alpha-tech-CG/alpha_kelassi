/**
 * Remise en forme des cours d'Histoire et de Géographie 3e (BEPC) — 06/11/2026,
 * demande utilisateur : reconstruire chaque leçon fidèlement à partir du document
 * original « Histoire-Géographie 3e prêt à imprimer » (Fréderic MAHOUELE), en
 * remplaçant le contenu OCR mal présenté (titres en MAJUSCULES, phrases coupées).
 *
 * Source : scripts/content/hg-3e/NN.md (33 leçons nettoyées + _manifest.json).
 *
 * Effets :
 *   - Histoire (19 chapitres) : titre normalisé + contenu du cours remplacé.
 *       Le chapitre « Origines/buts/principes de l'ONU » reçoit aussi la leçon
 *       « rôle des organes et institutions » (15) à la suite.
 *   - Géographie : les 7 chapitres existants sont mis à jour + réordonnés, et 6
 *       nouveaux chapitres du programme original sont ajoutés (forestière,
 *       industrie, activités informelles, traits de l'économie, industrie
 *       d'Afrique centrale, grands ensembles sous-régionaux) → 13 chapitres.
 *
 * Non destructif : sauvegarde complète (chapitres + leçons) avant toute écriture.
 * Les figures scannées ne sont PAS traitées ici (2e passe).
 *
 * Usage :
 *   node scripts/seed-hg-3e-reformat.mjs            (dry-run + backup)
 *   node scripts/seed-hg-3e-reformat.mjs --confirm
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC = join(__dirname, 'content', 'hg-3e')
const CONFIRM = process.argv.includes('--confirm')

const env = Object.fromEntries(
  readFileSync(join(ROOT, 'apps', 'web', '.env.local'), 'utf-8')
    .split(/\r?\n/).filter((l) => l.includes('=') && !l.trimStart().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')] })
)
const URL = env.NEXT_PUBLIC_SUPABASE_URL, KEY = env.SUPABASE_SERVICE_ROLE_KEY

async function sb(path, init = {}) {
  const r = await fetch(`${URL}/rest/v1${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}`, ...(init.headers ?? {}) },
  })
  const t = await r.text(); const d = t ? JSON.parse(t) : null
  if (!r.ok) throw new Error(`${init.method || 'GET'} ${path} -> ${r.status}: ${JSON.stringify(d)}`)
  return d
}

const HIST = '40265c11-718c-4670-b84d-938cbdf18fd8'
const GEO = 'e1bdbe8d-b365-4953-9c8b-458e79e03cdd'
const read = (nn) => readFileSync(join(SRC, `${nn}.md`), 'utf-8').trim()

// ── Histoire : chapitre existant → titre propre + fichier(s) source ──
const HIST_CH = [
  { id: 'f1ec9ab1-078e-401c-986b-dd48dd3ed292', title: 'La domination coloniale de l’Europe dans le monde au début du XXe siècle', files: ['01'] },
  { id: '9239c404-a352-413d-bb94-c6f6e2634be8', title: 'La domination française en Afrique Équatoriale Française (AEF)', files: ['02'] },
  { id: '6d6c119f-e1a5-4fde-b72f-e868aab49b89', title: 'La domination française au Moyen-Congo', files: ['03'] },
  { id: '2fa72227-62b4-4e28-9b4f-60a7648ed798', title: 'Les résistances et les révoltes des populations contre la domination française au Moyen-Congo', files: ['04'] },
  { id: 'a357af23-35b1-4461-af58-53be1e9e557a', title: 'Les causes de la Première Guerre mondiale', files: ['05'] },
  { id: '5752b8e8-83ae-4ccd-9d20-1281e10b5a3d', title: 'Les grandes étapes de la Première Guerre mondiale', files: ['06'] },
  { id: '11574fc8-28da-4732-b874-6b070ec8305a', title: 'Les conséquences de la Première Guerre mondiale', files: ['07'] },
  { id: 'a62a5ff4-be73-4aae-aa00-d4485f31e955', title: 'Les causes de la crise économique de 1929', files: ['08'] },
  { id: 'c34e399e-23ac-47fb-a345-835b46bcd001', title: 'Les manifestations et les conséquences de la crise économique de 1929', files: ['09'] },
  { id: '2a4dc250-8977-4f80-9185-210572b47e14', title: 'Les différentes solutions à la crise économique de 1929', files: ['10'] },
  { id: '916873da-6a2d-45b3-abfb-275b94cbba8b', title: 'Les causes de la Deuxième Guerre mondiale', files: ['11'] },
  { id: '3e0bdb36-66db-48ff-95d4-42532b9b657e', title: 'Les grandes étapes de la Deuxième Guerre mondiale', files: ['12'] },
  { id: '7d376eb7-97f2-4699-8957-03b9fe9e7f93', title: 'Les conséquences de la Deuxième Guerre mondiale', files: ['13'] },
  { id: '77509f6c-ed6d-4fd3-888b-875506477268', title: 'Les origines, les buts et les principes de l’Organisation des Nations Unies', files: ['14', '15'] },
  { id: 'b9b5a705-6443-48f4-9b08-64ef3418a264', title: 'Les réussites et les problèmes de l’ONU', files: ['16'] },
  { id: 'e6206f4e-2b85-4a1b-8de7-8a7c05573ee4', title: 'La décolonisation de l’Afrique noire française', files: ['17'] },
  { id: 'ed1a17a5-e1b9-4c16-ae62-47e2853a22f9', title: 'Les principales étapes de l’indépendance du Congo', files: ['18'] },
  { id: '632c1d8c-8046-4274-81c6-eb092203c27e', title: 'Les origines, les buts et les principes de l’Union africaine', files: ['19'] },
  { id: '4f5dab21-fb72-4253-9a7e-4531bda246b4', title: 'Les réalisations et les difficultés de l’Union africaine', files: ['20'] },
]

// ── Géographie : ordre final 0..12 (id présent = chapitre existant ; sinon création) ──
const GEO_CH = [
  { id: '0e279947-9d02-4c94-ab00-3c56fea22289', title: 'Les activités agro-pastorales', file: '21' },
  { id: null, title: 'L’importance de l’exploitation forestière, son impact sur l’environnement et les mesures de conservation', file: '22' },
  { id: null, title: 'Les bases, les types d’industrie et l’impact de l’activité industrielle sur l’environnement', file: '23' },
  { id: 'eb9d8bd4-b64a-47bc-bd12-553ea9d1c7a5', title: 'Les activités de service', file: '24' },
  { id: null, title: 'L’importance des activités informelles', file: '25' },
  { id: 'cabd204e-cc0f-4b78-b90b-9ac34d8c7ce2', title: 'Les problèmes de développement du Congo', file: '26' },
  { id: '206eb550-611e-4df2-9489-2cf6bc8c7277', title: 'Les différents États de la sous-région', file: '27' },
  { id: '0c451900-4a52-4fd7-88e4-88c0d13d4864', title: 'Les différents éléments du milieu physique', file: '28' },
  { id: '7181666a-1ad3-46ea-838d-6c9bb1f32653', title: 'Le paysage humain', file: '29' },
  { id: null, title: 'Les traits fondamentaux de l’économie de l’Afrique centrale', file: '30' },
  { id: null, title: 'L’industrie de l’Afrique centrale', file: '31' },
  { id: '33fa8670-d68e-4373-b252-d5c928150ae5', title: 'Les voies de communication et les télécommunications en Afrique centrale', file: '32' },
  { id: null, title: 'Les grands ensembles sous-régionaux de l’Afrique centrale', file: '33' },
]

async function coursLessonId(chapterId) {
  const ls = await sb(`/lessons?chapter_id=eq.${chapterId}&type=eq.cours&select=id&order=order_index&limit=1`)
  return ls[0]?.id ?? null
}

async function upsertCours(chapterId, title, content) {
  const id = await coursLessonId(chapterId)
  if (id) {
    await sb(`/lessons?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ title, content }) })
  } else {
    await sb('/lessons', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ chapter_id: chapterId, type: 'cours', title, content, order_index: 0, is_premium: false }) })
  }
}

async function main() {
  // ── Sauvegarde ──
  const backup = { created_at: new Date().toISOString(), note: 'État AVANT remise en forme Histoire+Géographie 3e', subjects: {}, }
  for (const [name, sid] of [['Histoire', HIST], ['Géographie', GEO]]) {
    const chs = await sb(`/chapters?subject_id=eq.${sid}&select=*&order=order_index`)
    const lss = await sb(`/lessons?chapter_id=in.(${chs.map((c) => c.id).join(',')})&select=*`)
    backup.subjects[name] = { chapters: chs, lessons: lss }
  }
  mkdirSync(join(ROOT, 'backups'), { recursive: true })
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const bfile = join(ROOT, 'backups', `hg-3e-reformat-${stamp}.json`)
  writeFileSync(bfile, JSON.stringify(backup, null, 2), 'utf-8')
  console.log(`Sauvegarde : ${bfile}`)

  // ── Histoire ──
  console.log('\n=== HISTOIRE ===')
  for (const ch of HIST_CH) {
    const content = ch.files.map(read).join('\n\n')
    console.log(`• ${ch.title}  (${ch.files.join('+')}, ${content.length}c)`)
    if (CONFIRM) {
      await sb(`/chapters?id=eq.${ch.id}`, { method: 'PATCH', body: JSON.stringify({ title: ch.title }) })
      await upsertCours(ch.id, ch.title, content)
    }
  }

  // ── Géographie ──
  console.log('\n=== GÉOGRAPHIE ===')
  for (let i = 0; i < GEO_CH.length; i++) {
    const ch = GEO_CH[i]
    const content = read(ch.file)
    if (ch.id) {
      console.log(`• [${i}] (maj) ${ch.title}  (${ch.file}, ${content.length}c)`)
      if (CONFIRM) {
        await sb(`/chapters?id=eq.${ch.id}`, { method: 'PATCH', body: JSON.stringify({ title: ch.title, order_index: i }) })
        await upsertCours(ch.id, ch.title, content)
      }
    } else {
      console.log(`• [${i}] (NOUVEAU) ${ch.title}  (${ch.file}, ${content.length}c)`)
      if (CONFIRM) {
        const [row] = await sb('/chapters', {
          method: 'POST', headers: { Prefer: 'return=representation' },
          body: JSON.stringify({ subject_id: GEO, title: ch.title, order_index: i, description: 'PARTIE GÉOGRAPHIE · L’AFRIQUE CENTRALE ET LE CONGO' }),
        })
        await upsertCours(row.id, ch.title, content)
      }
    }
  }

  console.log(CONFIRM ? '\n✓ Remise en forme appliquée.' : '\n[DRY-RUN] Ajoute --confirm pour appliquer.')
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
