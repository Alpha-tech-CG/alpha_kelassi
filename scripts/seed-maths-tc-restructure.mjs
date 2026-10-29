/**
 * Restructuration Maths Terminale C & D (programme commun) d'après le cours Achille.
 * Remplace le contenu désorganisé actuel par 17 chapitres propres (ordre des 4 parties),
 * chacun avec sa leçon `cours` structurée par section/objectif (Markdown + LaTeX).
 *
 * ⚠️ DESTRUCTIF : supprime tous les chapitres actuels des matières Maths bac_c/bac_d
 * (cascade : leçons, exercices, corrigés, progression) puis réinsère.
 * Usage : node scripts/seed-maths-tc-restructure.mjs [--dry-run]
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
const DRY = process.argv.includes('--dry-run')
const env = Object.fromEntries(readFileSync(join(__dirname,'..','apps','web','.env.local'),'utf-8').split('\n').filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>{const i=l.indexOf('=');return[l.slice(0,i).trim(),l.slice(i+1).trim()]}))
const URL = env.NEXT_PUBLIC_SUPABASE_URL, KEY = env.SUPABASE_SERVICE_ROLE_KEY
async function sb(path, init){ const r = await fetch(`${URL}${path}`,{...init,headers:{'Content-Type':'application/json',apikey:KEY,Authorization:`Bearer ${KEY}`,Prefer:'return=representation',...(init?.headers??{})}}); const t=await r.text(); const j=t?JSON.parse(t):null; if(!r.ok) throw new Error(`${init?.method??'GET'} ${path} -> ${r.status}: ${JSON.stringify(j).slice(0,200)}`); return j }

const SCRATCH = 'C:/Users/miche/AppData/Local/Temp/claude/D--alpha-kelassi-new/d65a7a4b-e2b1-4aea-9d43-fd02752e61eb/scratchpad'
const SUBJECTS = ['9de57219-0d1c-46be-a134-8e7388ccbe16','f5be9db1-f435-4cb6-873d-6d813dadbd58'] // Maths bac_c, bac_d
// Titres propres (ordre = index d'extraction cours-<i>.json)
const TITLES = ['Fonctions numériques','Suites numériques','Fonction logarithme népérien','Fonction exponentielle',
  "Intégrale d'une fonction continue",'Équations différentielles','Courbes paramétrées','Nombres complexes',
  'Arithmétique','Algèbre linéaire','Angles orientés','Transformations planes','Isométries du plan','Homothéties',
  'Statistique','Dénombrement','Probabilités']

const cours = TITLES.map((_,i)=>JSON.parse(readFileSync(`${SCRATCH}/cours-${i}.json`,'utf-8')).cours)

async function main(){
  console.log(DRY?'=== DRY RUN ===':'=== RESTRUCTURATION ===')
  for(const sid of SUBJECTS){
    const existing = await sb(`/rest/v1/chapters?subject_id=eq.${sid}&select=id`)
    console.log(`\nMatière ${sid.slice(0,4)} — ${existing.length} chapitres actuels à supprimer`)
    if(!DRY && existing.length){ await sb(`/rest/v1/chapters?subject_id=eq.${sid}`,{method:'DELETE',headers:{Prefer:'return=minimal'}}) }
    for(let i=0;i<TITLES.length;i++){
      if(DRY){ console.log(`[dry] ${i}. ${TITLES[i]} (${cours[i].length}c)`); continue }
      const [ch] = await sb('/rest/v1/chapters',{method:'POST',body:JSON.stringify({subject_id:sid,title:TITLES[i],order_index:i})})
      await sb('/rest/v1/lessons',{method:'POST',body:JSON.stringify({chapter_id:ch.id,type:'cours',title:TITLES[i],content:cours[i],order_index:0,is_premium:false})})
      console.log(`✓ ${sid.slice(0,4)} ${i}. ${TITLES[i]}`)
    }
  }
  console.log('\n=== Terminé ===')
}
main().catch(e=>{console.error('✗',e.message);process.exit(1)})
