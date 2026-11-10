/**
 * Français 3e — remplace le stub d'intro du chapitre « Lecture et compréhension »
 * par une vraie leçon de méthode (10/11/2026). Les 6 fiches de textes qui
 * suivent ne sont PAS touchées. Idempotent (ne réécrit que si le contenu est
 * encore le court stub « Au programme »). Sauvegarde avant écriture.
 *   node scripts/seed-francais-3e-lecture-intro.mjs            (dry-run + backup)
 *   node scripts/seed-francais-3e-lecture-intro.mjs --confirm
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
const content = readFileSync(join(__dirname,'content','francais-3e','05-lecture-methode.md'),'utf-8').trim()

const [s]=await sb('/subjects?level=eq.bepc&name=eq.Fran%C3%A7ais&select=id')
const chs=await sb(`/chapters?subject_id=eq.${s.id}&select=id,title,order_index`)
const chap=chs.find(c=>c.title.toLowerCase().startsWith('lecture'))
if(!chap){console.error('✗ chapitre Lecture introuvable');process.exit(1)}
const lss=await sb(`/lessons?chapter_id=eq.${chap.id}&select=id,title,type,order_index,content&order=order_index`)
const intro=lss.find(l=>l.type==='cours' && l.title.toLowerCase().startsWith('lecture et compr'))
mkdirSync(join(ROOT,'backups'),{recursive:true})
const bfile=join(ROOT,'backups',`francais-3e-lecture-intro-${new Date().toISOString().replace(/[:.]/g,'-')}.json`)
writeFileSync(bfile,JSON.stringify({created_at:new Date().toISOString(),chapter:chap,lessons:lss},null,2))
console.log('Sauvegarde :',bfile)
if(!intro){console.error('✗ leçon intro introuvable');process.exit(1)}
console.log(`Leçon intro : « ${intro.title} » (${(intro.content||'').length}c → ${content.length}c)`)
if((intro.content||'').length>600){ console.log('⤷ Déjà étoffée (>600c) — rien à faire (idempotent).'); process.exit(0) }
if(!CONFIRM){console.log('[DRY-RUN] Ajoute --confirm pour appliquer.');process.exit(0)}
await sb(`/lessons?id=eq.${intro.id}`,{method:'PATCH',body:JSON.stringify({content})})
console.log('✓ Intro Lecture mise à jour.')
