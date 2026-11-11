/**
 * Ajoute le cours d'Histoire de la série générale A aux séries techniques
 * BG, G2 et G3.
 *
 * Décisions (11/11/2026) :
 *  - Source : Histoire série A (5 chapitres, 12 leçons de cours) :
 *      2nde Guerre mondiale, ONU, Guerre froide, Décolonisation, Méthodologie.
 *  - Cibles : BG, G2, G3.
 *  - BG & G3 : aucune matière Histoire → création de la matière puis copie.
 *  - G2 : possède déjà 4 chapitres « ONU » maigres → on les GARDE et on
 *    AJOUTE les 5 chapitres de A à la suite (choix utilisateur « garder + ajouter »).
 *
 * Copies indépendantes (pas de source_chapter_id / source_id), comme la copie
 * Économie BG ← G2 de l'audit du 10/11. Idempotent, non destructif, backup avant.
 *
 *   node scripts/add-histoire-technique.mjs            (dry-run + backup)
 *   node scripts/add-histoire-technique.mjs --confirm
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CONFIRM = process.argv.includes('--confirm')
const env = Object.fromEntries(readFileSync(join(ROOT,'apps','web','.env.local'),'utf-8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.trimStart().startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^['"]|['"]$/g,'')]}))
const URL=env.NEXT_PUBLIC_SUPABASE_URL,KEY=env.SUPABASE_SERVICE_ROLE_KEY
async function sb(p,init={}){const r=await fetch(`${URL}/rest/v1${p}`,{...init,headers:{'Content-Type':'application/json',apikey:KEY,Authorization:`Bearer ${KEY}`,...(init.headers??{})}});const t=await r.text();const d=t?JSON.parse(t):null;if(!r.ok)throw new Error(`${init.method||'GET'} ${p} -> ${r.status}: ${JSON.stringify(d)}`);return d}

const SRC_A = '2be1e499-9327-4543-a22a-efef0957d32d' // Histoire bac_a
const TARGETS = ['bac_bg','bac_g2','bac_g3']
const backup = { created_at:new Date().toISOString(), note:'AVANT ajout Histoire (série A) en BG/G2/G3', items:[] }

async function sourceContent(){
  const chs = await sb(`/chapters?subject_id=eq.${SRC_A}&select=id,title,description,order_index&order=order_index`)
  const lss = chs.length ? await sb(`/lessons?chapter_id=in.(${chs.map(c=>c.id).join(',')})&select=*`) : []
  // On ne copie que les chapitres qui ont au moins une leçon.
  const kept = chs.filter(c=>lss.some(l=>l.chapter_id===c.id))
  return { chs:kept, lss }
}

async function ensureSubject(level){
  const existing = await sb(`/subjects?level=eq.${level}&name=eq.Histoire&select=id,display_order`)
  if(existing.length) return { id:existing[0].id, created:false }
  console.log(`  [${level}] matière Histoire absente → création`)
  if(!CONFIRM) return { id:null, created:true }
  const [row] = await sb('/subjects',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({
    name:'Histoire', level, country_code:'CG', track_type:'technique', display_order:0
  })})
  backup.items.push({ what:`subject-created`, level, subject_id:row.id })
  return { id:row.id, created:true }
}

async function run(){
  const { chs, lss } = await sourceContent()
  console.log(`Source (Histoire série A) : ${chs.length} chapitre(s), ${lss.filter(l=>chs.some(c=>c.id===l.chapter_id)).length} leçon(s)\n`)
  for(const c of chs){
    const n = lss.filter(l=>l.chapter_id===c.id).length
    console.log(`    • ${c.title} (${n} leçon${n>1?'s':''})`)
  }
  console.log('')

  for(const level of TARGETS){
    console.log(`=== ${level} ===`)
    const subj = await ensureSubject(level)
    const subjId = subj.id
    // En dry-run sur une matière à créer, on ne peut pas aller plus loin.
    if(!subjId){ console.log(`  (dry-run) matière à créer, ${chs.length} chapitres seraient ajoutés`); continue }

    const existingCh = await sb(`/chapters?subject_id=eq.${subjId}&select=id,title,order_index&order=order_index`)
    const have = new Set(existingCh.map(c=>c.title.trim().toLowerCase()))
    const maxOrder = existingCh.reduce((m,c)=>Math.max(m,c.order_index??0),0)
    const offset = existingCh.length ? maxOrder : 0 // on ajoute à la suite de l'existant

    let added = 0
    for(const c of chs){
      if(have.has(c.title.trim().toLowerCase())){ console.log(`  = déjà présent : ${c.title}`); continue }
      const newOrder = offset + c.order_index // source order_index démarre à 1
      console.log(`  + ${c.title} (order ${newOrder})`)
      if(!CONFIRM){ added++; continue }
      const [row] = await sb('/chapters',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({
        subject_id:subjId, title:c.title, description:c.description, order_index:newOrder
      })})
      backup.items.push({ what:'chapter-added', level, chapter_id:row.id, title:c.title })
      const own = lss.filter(l=>l.chapter_id===c.id).sort((a,b)=>a.order_index-b.order_index)
      if(own.length) await sb('/lessons',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(own.map(l=>({
        chapter_id:row.id, type:l.type, title:l.title, content:l.content,
        order_index:l.order_index, duration_min:l.duration_min??8,
        is_premium:l.is_premium??false, video_url:l.video_url??null
      })))})
      added++
    }
    console.log(`  → ${added} chapitre(s) ${CONFIRM?'ajouté(s)':'à ajouter'}\n`)
  }

  mkdirSync(join(ROOT,'backups'),{recursive:true})
  const bfile = join(ROOT,'backups',`add-histoire-technique-${new Date().toISOString().replace(/[:.]/g,'-')}.json`)
  writeFileSync(bfile, JSON.stringify(backup,null,2))
  console.log(`Sauvegarde : ${bfile}`)
  console.log(CONFIRM?'✓ Appliqué.':'[DRY-RUN] Ajoute --confirm pour appliquer.')
}
run().catch(e=>{console.error('✗',e);process.exit(1)})
