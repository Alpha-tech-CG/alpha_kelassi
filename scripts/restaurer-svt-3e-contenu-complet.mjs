/**
 * L'utilisateur a demandé de garder le contenu SVT complet (pas de résumé),
 * comme pour les Maths. Restaure les 5 chapitres qui avaient été condensés
 * en résumé (resume-svt-3e-chapitres.mjs) avec leur version intégrale
 * d'origine (scratchpad/svt3e/lessons_final/finalNN.md, déjà nettoyée et
 * illustrée lors du premier import).
 *
 * Usage : node scripts/restaurer-svt-3e-contenu-complet.mjs [--dry-run]
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY_RUN = process.argv.includes('--dry-run')
const SRC_DIR = 'C:/Users/miche/AppData/Local/Temp/claude/D--alpha-kelassi-new/e14b1709-c92a-401a-a7b0-afd9aea3502d/scratchpad/svt3e/lessons_final'

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

// titre du chapitre -> fichier source (numéro de leçon d'origine)
const RESTORE = {
  "L'immunité et la réponse immunitaire": 'final07.md',
  'Le système immunitaire': 'final08.md',
  "Dysfonctionnement du système immunitaire : cas de l'infection au VIH/SIDA": 'final11.md',
  "Aide à l'immunité": 'final10.md',
  'Le fonctionnement du système nerveux': 'final01.md',
}

async function main() {
  console.log(DRY_RUN ? '=== DRY RUN ===' : '=== Écriture en base ===')
  const [subject] = await sb(`/rest/v1/subjects?level=eq.bepc&name=eq.SVT&select=id`)

  let updated = 0
  for (const [titre, file] of Object.entries(RESTORE)) {
    const content = readFileSync(join(SRC_DIR, file), 'utf8')
    const [chapter] = await sb(`/rest/v1/chapters?subject_id=eq.${subject.id}&title=eq.${encodeURIComponent(titre)}&select=id`)
    if (!chapter) { console.warn(`⚠ Chapitre introuvable : "${titre}"`); continue }
    if (DRY_RUN) {
      console.log(`[dry-run] restaurerait "${titre}" avec ${content.length} caractères (${(content.match(/!\[/g) || []).length} images)`)
    } else {
      const [lesson] = await sb(`/rest/v1/lessons?chapter_id=eq.${chapter.id}&type=eq.cours&select=id`)
      await sb(`/rest/v1/lessons?id=eq.${lesson.id}`, { method: 'PATCH', body: JSON.stringify({ content }) })
      console.log(`✓ Restauré : "${titre}" (${content.length} car.)`)
    }
    updated++
  }
  console.log(`\n${DRY_RUN ? '[dry-run]' : 'Terminé.'} ${updated} chapitres restaurés.`)
}

main().catch((e) => { console.error('✗', e); process.exit(1) })
