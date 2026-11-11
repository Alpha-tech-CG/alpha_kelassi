/**
 * Réécriture/mise en forme des cours de Français des Terminales A, C et D.
 *
 * Le bloc « Littérature / Étude du roman / Exercices littéraires » (série A, en
 * partie copié en C/D) était mal présenté : énumérations en paragraphes, aucun
 * encadré, titres incohérents, scories d'import. 14 leçons ont été réécrites au
 * format maison (listes, encadrés `**Définition :**`/`**Exemple :**`/`**À retenir :**`,
 * titres `##`/`###`). Les 4 fiches méthodo déjà propres (commentaire, résumé,
 * fonctions de la littérature, utilité du Pleurer-Rire) ne sont pas touchées.
 *
 * Fonctionnement : on identifie chaque leçon par l'empreinte md5 de son contenu
 * actuel (normalisé). Les nouvelles versions sont dans
 * scripts/content/francais-tle-reformat/<empreinte-d'origine>.md. Le remplacement
 * se propage donc automatiquement à toutes les copies A/C/D d'un même contenu.
 * Idempotent (après remplacement l'empreinte change), non destructif, backup avant.
 *
 *   node scripts/reformat-francais-tle.mjs            (dry-run + backup)
 *   node scripts/reformat-francais-tle.mjs --confirm
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { createHash } from 'crypto'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CONFIRM = process.argv.includes('--confirm')
const env = Object.fromEntries(readFileSync(join(ROOT,'apps','web','.env.local'),'utf-8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.trimStart().startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^['"]|['"]$/g,'')]}))
const URL=env.NEXT_PUBLIC_SUPABASE_URL,KEY=env.SUPABASE_SERVICE_ROLE_KEY
async function sb(p,init={}){const r=await fetch(`${URL}/rest/v1${p}`,{...init,headers:{'Content-Type':'application/json',apikey:KEY,Authorization:`Bearer ${KEY}`,...(init.headers??{})}});const t=await r.text();const d=t?JSON.parse(t):null;if(!r.ok)throw new Error(`${init.method||'GET'} ${p} -> ${r.status}: ${JSON.stringify(d)}`);return d}

const hash = s => createHash('md5').update((s||'').replace(/\s+/g,' ').trim()).digest('hex').slice(0,8)
const NEWDIR = join(__dirname,'content','francais-tle-reformat')
const NEW = {} // empreinte d'origine -> nouveau contenu
for(const f of readdirSync(NEWDIR).filter(f=>f.endsWith('.md'))){
  NEW[f.replace('.md','')] = readFileSync(join(NEWDIR,f),'utf-8').replace(/\s+$/,'')+'\n'
}

const backup = { created_at:new Date().toISOString(), note:'AVANT réécriture Français Tle A/C/D', items:[] }

async function run(){
  console.log(`${Object.keys(NEW).length} contenus réécrits chargés.\n`)
  const updated = {} // hash -> count
  for(const lv of ['bac_a','bac_c','bac_d']){
    const [s]=await sb(`/subjects?level=eq.${lv}&name=eq.Fran%C3%A7ais&select=id`)
    if(!s){console.log(`[${lv}] Français absente`);continue}
    const chs=await sb(`/chapters?subject_id=eq.${s.id}&select=id&order=order_index`)
    const lss=await sb(`/lessons?chapter_id=in.(${chs.map(c=>c.id).join(',')})&select=id,title,content`)
    for(const l of lss){
      const h=hash(l.content)
      if(!NEW[h]) continue
      console.log(`  [${lv}] ${l.title.slice(0,46).padEnd(46)} ${h} → ${NEW[h].length}c`)
      updated[h]=(updated[h]||0)+1
      if(!CONFIRM) continue
      backup.items.push({ lv, id:l.id, title:l.title, hash:h, before:l.content })
      await sb(`/lessons?id=eq.${l.id}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({content:NEW[h]})})
    }
  }
  console.log('')
  for(const h of Object.keys(NEW)){
    if(!updated[h]) console.log(`  ⚠ ${h} : aucune leçon correspondante (déjà réécrite ?)`)
  }
  const n=Object.values(updated).reduce((a,b)=>a+b,0)
  mkdirSync(join(ROOT,'backups'),{recursive:true})
  const bfile=join(ROOT,'backups',`reformat-francais-tle-${new Date().toISOString().replace(/[:.]/g,'-')}.json`)
  writeFileSync(bfile,JSON.stringify(backup,null,2))
  console.log(`\n${n} leçon(s) ${CONFIRM?'mises à jour':'à mettre à jour'} (${Object.keys(updated).length} contenus). Sauvegarde : ${bfile}`)
  console.log(CONFIRM?'✓ Appliqué.':'[DRY-RUN] Ajoute --confirm pour appliquer.')
}
run().catch(e=>{console.error('✗',e);process.exit(1)})
