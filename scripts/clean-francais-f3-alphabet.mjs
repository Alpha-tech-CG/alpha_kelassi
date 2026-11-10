/**
 * Nettoyage Français F3 (technique) — 10/11/2026.
 * Supprime le chapitre fantôme « alphabet » (0 leçon) de la Terminale F3.
 * Sauvegarde avant suppression. Idempotent.
 *   node scripts/clean-francais-f3-alphabet.mjs            (dry-run + backup)
 *   node scripts/clean-francais-f3-alphabet.mjs --confirm
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
const [s]=await sb('/subjects?level=eq.bac_f3&name=eq.Fran%C3%A7ais&select=id')
const chs=await sb(`/chapters?subject_id=eq.${s.id}&select=id,title,order_index`)
const lss=chs.length?await sb(`/lessons?chapter_id=in.(${chs.map(c=>c.id).join(',')})&select=*`):[]
const empties=[]
for(const c of chs){ const n=lss.filter(l=>l.chapter_id===c.id); if(c.title.trim().toLowerCase()==='alphabet'&&n.length===0) empties.push(c) }
mkdirSync(join(ROOT,'backups'),{recursive:true})
const bfile=join(ROOT,'backups',`francais-f3-clean-${new Date().toISOString().replace(/[:.]/g,'-')}.json`)
writeFileSync(bfile,JSON.stringify({created_at:new Date().toISOString(),subject:s,chapters:chs,lessons:lss},null,2))
console.log('Sauvegarde :',bfile)
console.log('Chapitres vides « alphabet » à supprimer :',empties.map(c=>c.id).join(', ')||'(aucun)')
if(!empties.length){console.log('Rien à faire.');process.exit(0)}
if(!CONFIRM){console.log('[DRY-RUN] Ajoute --confirm pour supprimer.');process.exit(0)}
for(const c of empties) await sb(`/chapters?id=eq.${c.id}`,{method:'DELETE'})
console.log('✓ Supprimé.')
