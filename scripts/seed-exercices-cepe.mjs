/**
 * Exercices écrits à la main pour les chapitres du CEPE qui n'en avaient aucun.
 *
 * Même principe que partout ailleurs : l'élève lit l'énoncé, écrit sa réponse
 * dans l'application, et le corrigé ne s'affiche qu'après l'envoi (le corrigé
 * est verrouillé en base tant qu'il n'y a pas de tentative — migration 035).
 *
 * Idempotent : un exercice de même titre dans le même chapitre est ignoré.
 *
 * Usage :
 *   node scripts/seed-exercices-cepe.mjs --dry-run
 *   node scripts/seed-exercices-cepe.mjs
 */
import { readFileSync, readdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
const DIR = join(__dirname, 'content', 'exercices-cepe')

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

let crees = 0
let ignores = 0

for (const fichier of readdirSync(DIR).filter((f) => f.endsWith('.json')).sort()) {
  const fiches = JSON.parse(readFileSync(join(DIR, fichier), 'utf-8'))
  console.log(`\n=== ${fichier} (${fiches.length} chapitres) ===`)

  for (const fiche of fiches) {
    const existants = await sb(`/exercises?select=id,title,order_index&chapter_id=eq.${fiche.chapter_id}`)
    let ordre = Math.max(0, ...existants.map((e) => e.order_index + 1))

    for (const exercice of fiche.exercices) {
      if (!exercice.enonce?.trim() || !exercice.corrige?.trim()) {
        throw new Error(`${fiche.chapitre} / ${exercice.titre} : énoncé ou corrigé manquant`)
      }
      if (existants.some((e) => e.title === exercice.titre)) {
        console.log(`  = ${fiche.chapitre} / ${exercice.titre} — déjà en place`)
        ignores++
        continue
      }
      if (DRY_RUN) {
        console.log(`  + ${fiche.chapitre} / ${exercice.titre}`)
        crees++
        ordre++
        continue
      }
      const [cree] = await sb('/exercises', {
        method: 'POST',
        body: JSON.stringify({
          chapter_id: fiche.chapter_id,
          title: exercice.titre,
          statement: exercice.enonce,
          difficulty: exercice.difficulte ?? 1,
          is_premium: false,
          order_index: ordre,
        }),
      })
      await sb('/exercise_solutions', { method: 'POST', body: JSON.stringify({ exercise_id: cree.id, solution: exercice.corrige }) })
      console.log(`  + ${fiche.chapitre} / ${exercice.titre}`)
      crees++
      ordre++
    }
  }
}

console.log(`\n${DRY_RUN ? '[essai à blanc] ' : ''}exercices créés : ${crees} | déjà en place : ${ignores}`)
