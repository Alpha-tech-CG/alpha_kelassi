/**
 * Masquer (supprimer) les matières vides Latin et Espagnol en Tle A — 10/11/2026.
 * Il n'existe pas de drapeau de visibilité par matière : on supprime les deux
 * matières, qui sont vides (0 chapitre). Vérifie d'abord les références
 * bloquantes (correction_missions en on delete restrict) et sauvegarde tout.
 *   node scripts/hide-latin-espagnol-tle-a.mjs            (dry-run + backup)
 *   node scripts/hide-latin-espagnol-tle-a.mjs --confirm
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CONFIRM = process.argv.includes('--confirm')
const env = Object.fromEntries(readFileSync(join(ROOT,'apps','web','.env.local'),'utf-8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.trimStart().startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^['"]|['"]$/g,'')]}))
const URL=env.NEXT_PUBLIC_SUPABASE_URL,KEY=env.SUPABASE_SERVICE_ROLE_KEY
async function sb(p,init={}){const r=await fetch(`${URL}/rest/v1${p}`,{...init,headers:{'Content-Type':'application/json',apikey:KEY,Authorization:`Bearer ${KEY}`,Prefer:init.method==='DELETE'?'return=representation':undefined,...(init.headers??{})}});const t=await r.text();const d=t?JSON.parse(t):null;if(!r.ok)throw new Error(`${init.method||'GET'} ${p} -> ${r.status}: ${JSON.stringify(d)}`);return d}
async function count(table,sid){try{const r=await sb(`/${table}?subject_id=eq.${sid}&select=id`);return r.length}catch{return '?'}}

const targets=[]
for(const name of ['Latin','Espagnol']){
  const [s]=await sb(`/subjects?level=eq.bac_a&name=eq.${encodeURIComponent(name)}&select=id,name,level,track_type,parent_subject_id,display_order`)
  if(s) targets.push(s); else console.log(`(${name} Tle A absente)`)
}
if(!targets.length){console.log('Rien à faire.');process.exit(0)}

const backup={created_at:new Date().toISOString(),note:'AVANT suppression Latin/Espagnol Tle A',subjects:targets,refs:{}}
let blocked=false
for(const s of targets){
  const chs=await sb(`/chapters?subject_id=eq.${s.id}&select=id`)
  const cm=await count('correction_missions',s.id)
  const up=await count('user_progress',s.id)
  console.log(`• ${s.name} [${s.id}] — chapitres:${chs.length} | correction_missions:${cm} | user_progress:${up}`)
  backup.refs[s.id]={chapters:chs.length,correction_missions:cm,user_progress:up}
  if(chs.length>0){console.log('  ⚠️ a des chapitres — PAS vide, on ne supprime pas');blocked=true}
  if(cm!=='?'&&cm>0){console.log('  ⚠️ référencée par correction_missions (restrict) — suppression bloquée');blocked=true}
}
mkdirSync(join(ROOT,'backups'),{recursive:true})
const bfile=join(ROOT,'backups',`hide-latin-espagnol-${new Date().toISOString().replace(/[:.]/g,'-')}.json`)
writeFileSync(bfile,JSON.stringify(backup,null,2))
console.log('\nSauvegarde :',bfile)
if(blocked){console.log('✗ Un blocage détecté — rien supprimé.');process.exit(1)}
if(!CONFIRM){console.log('[DRY-RUN] Ajoute --confirm pour supprimer.');process.exit(0)}
for(const s of targets){ await sb(`/subjects?id=eq.${s.id}`,{method:'DELETE'}); console.log('✓ supprimé',s.name) }
