/**
 * Restructuration des Terminales (A, C, D) — 29/10/2026, demande utilisateur :
 *   1. Scinder « Histoire-Géographie » en deux matières : « Histoire » et « Géographie ».
 *   2. Normaliser la casse des noms de matières (GÉOGRAPHIE → Géographie, CHIMIE → Chimie).
 *   3. Nettoyer les titres de chapitres d'histoire (cohérence).
 *
 * Mécanique : un chapitre est déplacé en changeant `chapters.subject_id` ; ses
 * leçons suivent (elles portent chapter_id) et les copies liées (source_chapter_id,
 * migration 060) restent valides. Les « quiz » sont des LEÇONS (modèle 4 blocs),
 * pas des lignes de la table quizzes ; aucune table annexe ne pointe sur la matière.
 *
 * Classement : seul « Le milieu physique du Congo » va en Géographie ; tout le
 * reste (Deuxième Guerre, ONU, Guerre froide, Décolonisation, Méthodologie,
 * Annales) va en Histoire.
 *
 * Usage :
 *   node scripts/restructure-terminale-hg.mjs            (dry-run + backup)
 *   node scripts/restructure-terminale-hg.mjs --confirm
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
  const r = await fetch(`${URL}/rest/v1${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}`, ...(init.headers ?? {}) },
  })
  const t = await r.text(); const d = t ? JSON.parse(t) : null
  if (!r.ok) throw new Error(`${init.method || 'GET'} ${path} -> ${r.status}: ${JSON.stringify(d)}`)
  return d
}

// Matières par série : HG à dissoudre + GÉO existante à réutiliser (ou null = créer) + CHIMIE à renommer.
const SERIES = {
  bac_a: { hg: '8860f08b-7300-4c92-8f0a-5c317c86ce60', geo: '31b27322-14ad-4379-93ce-28d11808bb9c', chimie: null },
  bac_c: { hg: '4202d209-291e-4adf-88fd-b52af08c3a47', geo: '1edb1110-6546-4e8a-a252-be8b59bafc6b', chimie: '786e46b1-6633-4291-81d1-e2db13240487' },
  bac_d: { hg: '8386f566-931a-440d-a521-15100981090b', geo: null, chimie: '40e981ca-b9b9-4616-bff9-bfcc09afb4d3' },
}

// Classement + renommage d'un chapitre HG.
function classify(title) {
  const t = title.trim()
  if (/milieu physique/i.test(t)) return { dest: 'geo', title: 'Le milieu physique du Congo', order: 50 }
  if (/^histoire$/i.test(t))                 return { dest: 'hist', title: 'La Deuxième Guerre mondiale (1939-1945)', order: 1 }
  if (/onu/i.test(t))                        return { dest: 'hist', title: "L'ONU", order: 2 }
  if (/guerre\s*froide/i.test(t))            return { dest: 'hist', title: 'La Guerre froide', order: 3 }
  if (/d[ée]colonisation/i.test(t))          return { dest: 'hist', title: 'La décolonisation', order: 4 }
  if (/m[ée]thodologie/i.test(t))            return { dest: 'hist', title: 'Méthodologie : commentaire de document et dissertation', order: 5 }
  if (/annales/i.test(t))                    return { dest: 'hist', title: 'Annales et sujets type bac — Histoire-Géographie', order: 6 }
  return { dest: 'hist', title: t, order: 9 } // par défaut en histoire, titre inchangé
}

const backup = { created_at: new Date().toISOString(), note: 'État AVANT restructuration Terminale HG (A/C/D)', subjects: [], chapters: [] }

async function ensureSubject(level, name, icon, display_order, existingId) {
  if (existingId) {
    if (!CONFIRM) { console.log(`   [${level}] renommer matière ${existingId.slice(0, 8)} → « ${name} »`); return existingId }
    await sb(`/subjects?id=eq.${existingId}`, { method: 'PATCH', body: JSON.stringify({ name, icon }) })
    return existingId
  }
  if (!CONFIRM) { console.log(`   [${level}] créer matière « ${name} »`); return `__NEW_${level}_${name}__` }
  const [row] = await sb('/subjects', {
    method: 'POST', headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ name, level, country_code: 'CG', icon, track_type: 'generale', display_order }),
  })
  return row.id
}

for (const [level, cfg] of Object.entries(SERIES)) {
  console.log(`\n=== ${level} ===`)
  // Sauvegarde de l'état des matières touchées + de leurs chapitres.
  const touchedSubjectIds = [cfg.hg, cfg.geo, cfg.chimie].filter(Boolean)
  const subs = await sb(`/subjects?id=in.(${touchedSubjectIds.join(',')})&select=*`)
  backup.subjects.push(...subs)
  const hgRow = subs.find((s) => s.id === cfg.hg)
  const baseOrder = hgRow?.display_order ?? 10

  const hgChapters = await sb(`/chapters?subject_id=eq.${cfg.hg}&select=id,title,order_index,source_chapter_id&order=order_index`)
  backup.chapters.push(...hgChapters.map((c) => ({ ...c, _subject_id: cfg.hg })))

  // 1) Matières cibles
  const histId = await ensureSubject(level, 'Histoire', '📜', baseOrder, null)
  const geoId  = await ensureSubject(level, 'Géographie', '🌍', baseOrder + 1, cfg.geo)

  // 2) Renommage CHIMIE → Chimie
  if (cfg.chimie) {
    if (!CONFIRM) console.log(`   renommer CHIMIE → Chimie (${cfg.chimie.slice(0, 8)})`)
    else await sb(`/subjects?id=eq.${cfg.chimie}`, { method: 'PATCH', body: JSON.stringify({ name: 'Chimie' }) })
  }

  // 3) Déplacement + renommage des chapitres HG
  let geoMax = 0
  if (cfg.geo) {
    const geoCh = await sb(`/chapters?subject_id=eq.${cfg.geo}&select=order_index`)
    geoMax = geoCh.reduce((m, c) => Math.max(m, c.order_index ?? 0), 0)
  }
  for (const ch of hgChapters) {
    const { dest, title, order } = classify(ch.title)
    const targetId = dest === 'geo' ? geoId : histId
    const newOrder = dest === 'geo' ? geoMax + 1 + order : order
    console.log(`   • « ${ch.title} » → ${dest === 'geo' ? 'Géographie' : 'Histoire'}${title !== ch.title.trim() ? ` (renommé « ${title} »)` : ''}`)
    if (CONFIRM) {
      await sb(`/chapters?id=eq.${ch.id}`, { method: 'PATCH', body: JSON.stringify({ subject_id: targetId, title, order_index: newOrder }) })
    }
  }

  // 4) Suppression de la matière HG désormais vide
  if (CONFIRM) {
    const left = await sb(`/chapters?subject_id=eq.${cfg.hg}&select=id`)
    if (left.length) throw new Error(`${level}: ${left.length} chapitre(s) encore dans HG — suppression annulée.`)
    await sb(`/subjects?id=eq.${cfg.hg}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } })
    console.log(`   matière Histoire-Géographie supprimée (vide).`)
  } else {
    console.log(`   [dry-run] supprimerait la matière Histoire-Géographie (vide).`)
  }
}

// Écrit le backup au premier passage (dry-run comme confirm).
mkdirSync(join(ROOT, 'backups'), { recursive: true })
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const file = join(ROOT, 'backups', `terminale-hg-restructure-${stamp}.json`)
writeFileSync(file, JSON.stringify(backup, null, 2), 'utf-8')
console.log(`\nSauvegarde (état avant) : ${file}`)
if (!CONFIRM) console.log('\n[DRY-RUN] Ajoute --confirm pour appliquer.')
else console.log('\nRestructuration appliquée.')
