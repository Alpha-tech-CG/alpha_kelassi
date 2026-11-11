/**
 * Correctifs issus de l'audit contenu du 10/11/2026.
 *
 *  1. Géographie Tle A & C : le chapitre « Le milieu physique du Congo » n'avait
 *     qu'un quiz → ajout d'une leçon de cours (en tête). Source : geo-tle/.
 *  2. Physique-Chimie 3e : la leçon « Utilité sociale de l'électricité » (273c)
 *     est étoffée. Source : physique-3e/utilite-electricite.md.
 *  3. Économie BG (vide) : copie des 5 chapitres + leçons de l'Économie G2.
 *  4. Français F3 (vide) : copie des chapitres + leçons du Français Tle C.
 *
 * Idempotent, non destructif, sauvegarde avant écriture.
 *   node scripts/fix-audit-2026-11-10.mjs            (dry-run + backup)
 *   node scripts/fix-audit-2026-11-10.mjs --confirm
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
const read=(...f)=>readFileSync(join(__dirname,'content',...f),'utf-8').trim()
const backup={created_at:new Date().toISOString(),note:'AVANT correctifs audit 10/11',items:[]}

async function lessonsOf(subjectId){
  const chs=await sb(`/chapters?subject_id=eq.${subjectId}&select=id,title,description,order_index&order=order_index`)
  const lss=chs.length?await sb(`/lessons?chapter_id=in.(${chs.map(c=>c.id).join(',')})&select=*`):[]
  return {chs,lss}
}

// 1) Géo A & C — milieu physique : ajouter un cours
async function fixGeo(){
  const geoText=read('geo-tle','milieu-physique-congo.md')
  for(const lvl of ['bac_a','bac_c']){
    const [g]=await sb(`/subjects?level=eq.${lvl}&name=eq.G%C3%A9ographie&select=id`)
    if(!g){console.log(`  Géo ${lvl}: absente`);continue}
    const chs=await sb(`/chapters?subject_id=eq.${g.id}&select=id,title`)
    const mp=chs.find(c=>c.title.toLowerCase().includes('milieu physique'))
    if(!mp){console.log(`  Géo ${lvl}: chapitre milieu physique absent`);continue}
    const ls=await sb(`/lessons?chapter_id=eq.${mp.id}&select=id,type,title,order_index&order=order_index`)
    if(ls.some(l=>l.type==='cours')){console.log(`  Géo ${lvl}: cours déjà présent — ignoré`);continue}
    console.log(`  Géo ${lvl}: + cours « Le milieu physique du Congo » (${geoText.length}c), décale ${ls.length} leçon(s)`)
    if(!CONFIRM) continue
    backup.items.push({what:`geo-${lvl}`,chapter:mp.id,lessons:ls})
    for(const l of [...ls].sort((a,b)=>b.order_index-a.order_index)) await sb(`/lessons?id=eq.${l.id}`,{method:'PATCH',body:JSON.stringify({order_index:l.order_index+1})})
    await sb('/lessons',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({chapter_id:mp.id,type:'cours',title:'Le milieu physique du Congo',content:geoText,order_index:0,duration_min:8,is_premium:false})})
  }
}

// 2) Utilité sociale de l'électricité (3e) : étoffer
async function fixElec(){
  const txt=read('physique-3e','utilite-electricite.md')
  const ls=await sb(`/lessons?title=ilike.*Utilit%C3%A9%20sociale%20de%20l*&select=id,content,chapter_id`)
  const l=ls.find(x=>(x.content||'').length<600)
  if(!l){console.log('  Utilité électricité: déjà étoffée ou introuvable — ignoré');return}
  console.log(`  Utilité électricité: ${l.content.length}c → ${txt.length}c`)
  if(!CONFIRM) return
  backup.items.push({what:'elec',lesson:l.id,before:l.content})
  await sb(`/lessons?id=eq.${l.id}`,{method:'PATCH',body:JSON.stringify({content:txt})})
}

// Copier les chapitres+leçons d'une matière source vers une matière cible (si cible vide)
async function copyCourse(srcId,dstId,label){
  const dstCh=await sb(`/chapters?subject_id=eq.${dstId}&select=id&limit=1`)
  if(dstCh.length){console.log(`  ${label}: la cible a déjà des chapitres — ignoré`);return}
  const {chs,lss}=await lessonsOf(srcId)
  console.log(`  ${label}: copie de ${chs.length} chapitre(s), ${lss.length} leçon(s)`)
  if(!CONFIRM) return
  backup.items.push({what:label,target:dstId})
  for(const c of chs){
    const [row]=await sb('/chapters',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({subject_id:dstId,title:c.title,description:c.description,order_index:c.order_index})})
    const own=lss.filter(l=>l.chapter_id===c.id).sort((a,b)=>a.order_index-b.order_index)
    if(own.length) await sb('/lessons',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(own.map(l=>({chapter_id:row.id,type:l.type,title:l.title,content:l.content,order_index:l.order_index,duration_min:l.duration_min??8,is_premium:l.is_premium??false,video_url:l.video_url??null})))})
  }
}

async function main(){
  console.log('1) Géographie A/C — milieu physique'); await fixGeo()
  console.log('2) Physique-Chimie 3e — utilité électricité'); await fixElec()
  console.log('3) Économie BG ← Économie G2')
  const [eg2]=await sb('/subjects?level=eq.bac_g2&name=ilike.*conomie*&select=id')
  const [ebg]=await sb('/subjects?level=eq.bac_bg&name=ilike.*conomie*&select=id')
  if(eg2&&ebg) await copyCourse(eg2.id,ebg.id,'Économie BG'); else console.log('  Économie G2 ou BG absente')
  console.log('4) Français F3 ← Français Tle C')
  const [fc]=await sb('/subjects?level=eq.bac_c&name=eq.Fran%C3%A7ais&select=id')
  const [ff3]=await sb('/subjects?level=eq.bac_f3&name=eq.Fran%C3%A7ais&select=id')
  if(fc&&ff3) await copyCourse(fc.id,ff3.id,'Français F3'); else console.log('  Français C ou F3 absente')

  mkdirSync(join(ROOT,'backups'),{recursive:true})
  const bfile=join(ROOT,'backups',`fix-audit-${new Date().toISOString().replace(/[:.]/g,'-')}.json`)
  writeFileSync(bfile,JSON.stringify(backup,null,2))
  console.log(`\nSauvegarde : ${bfile}`)
  console.log(CONFIRM?'✓ Appliqué.':'[DRY-RUN] Ajoute --confirm pour appliquer.')
}
main().catch(e=>{console.error('✗',e);process.exit(1)})
