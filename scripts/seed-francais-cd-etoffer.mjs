/**
 * Étoffer le Français des Terminales C et D — 10/11/2026.
 *
 * Les Tle C et D n'avaient que 2 chapitres (Le Pleurer-Rire + méthodo), alors
 * que la Tle A est bien plus fournie. On ajoute à C et D deux chapitres :
 *   1. « Outils d'analyse littéraire » : leçons générales RÉUTILISÉES depuis la
 *      Tle A (énonciation, texte narratif, genres, propositions, connecteurs,
 *      engagement de l'écrivain, littérature congolaise).
 *   2. « Méthodologie du bac : dissertation, commentaire, résumé » : la
 *      dissertation littéraire (réutilisée de la Tle A) + deux fiches neuves
 *      (commentaire composé, résumé de texte).
 *
 * Les chapitres sont AJOUTÉS À LA SUITE des chapitres existants (non destructif).
 * Idempotent (ne refait pas si « Outils d'analyse littéraire » existe déjà).
 * Sauvegarde complète avant écriture.
 *
 *   node scripts/seed-francais-cd-etoffer.mjs            (dry-run + backup)
 *   node scripts/seed-francais-cd-etoffer.mjs --confirm
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC = join(__dirname, 'content', 'francais-terminale-cd')
const CONFIRM = process.argv.includes('--confirm')
const env = Object.fromEntries(readFileSync(join(ROOT,'apps','web','.env.local'),'utf-8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.trimStart().startsWith('#')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^['"]|['"]$/g,'')]}))
const URL=env.NEXT_PUBLIC_SUPABASE_URL,KEY=env.SUPABASE_SERVICE_ROLE_KEY
async function sb(p,init={}){const r=await fetch(`${URL}/rest/v1${p}`,{...init,headers:{'Content-Type':'application/json',apikey:KEY,Authorization:`Bearer ${KEY}`,...(init.headers??{})}});const t=await r.text();const d=t?JSON.parse(t):null;if(!r.ok)throw new Error(`${init.method||'GET'} ${p} -> ${r.status}: ${JSON.stringify(d)}`);return d}
const read=(f)=>readFileSync(join(SRC,f),'utf-8').trim()
const norm=(s)=>(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')

const A_ID='8f5b0229-3e07-4538-92a9-52317abfacd7'
const TARGETS=[
  { level:'bac_c', id:'08a44176-47f6-45af-aa4c-f69dd6c50847' },
  { level:'bac_d', id:'d31aede0-7812-464a-bd13-e51a130debc3' },
]
const MARKER="Outils d'analyse littéraire"
// Sous-chaînes (sans accents) pour retrouver les leçons de la Tle A à réutiliser, dans l'ordre.
const TOOLS=['nonciation','texte narratif','genres litt','les propositions','connecteurs','engagement','congolaise']

async function lessonsOf(subjectId){
  const chs=await sb(`/chapters?subject_id=eq.${subjectId}&select=id,title,order_index&order=order_index`)
  const lss=chs.length?await sb(`/lessons?chapter_id=in.(${chs.map(c=>c.id).join(',')})&select=chapter_id,title,type,order_index,content`):[]
  return {chs,lss}
}

async function main(){
  const A=await lessonsOf(A_ID)
  const pick=(sub)=>{ const l=A.lss.find(x=>norm(x.title).includes(sub)); if(!l) console.warn('  ! leçon A introuvable pour',sub); return l }
  const toolLessons=TOOLS.map(pick).filter(Boolean).map(l=>({type:'cours',title:l.title,content:l.content}))
  const dissert=pick('dissertation')
  const methodoLessons=[
    ...(dissert?[{type:'cours',title:dissert.title,content:dissert.content}]:[]),
    {type:'cours',title:'Le commentaire composé',content:read('commentaire-compose.md')},
    {type:'cours',title:'Le résumé de texte',content:read('resume-de-texte.md')},
  ]
  console.log(`Réutilisation Tle A : ${toolLessons.length} leçons-outils + dissertation=${dissert?'oui':'NON'}`)
  console.log(`Chapitres à ajouter par série : « ${MARKER} » (${toolLessons.length} leçons) + « Méthodologie du bac » (${methodoLessons.length} leçons)\n`)

  // Sauvegarde C + D
  const ids=TARGETS.map(t=>t.id)
  const chsAll=await sb(`/chapters?subject_id=in.(${ids.join(',')})&select=*`)
  const lssAll=chsAll.length?await sb(`/lessons?chapter_id=in.(${chsAll.map(c=>c.id).join(',')})&select=*`):[]
  mkdirSync(join(ROOT,'backups'),{recursive:true})
  const bfile=join(ROOT,'backups',`francais-cd-etoffer-${new Date().toISOString().replace(/[:.]/g,'-')}.json`)
  writeFileSync(bfile,JSON.stringify({created_at:new Date().toISOString(),chapters:chsAll,lessons:lssAll},null,2))
  console.log('Sauvegarde :',bfile,'\n')

  for(const tgt of TARGETS){
    const ex=chsAll.filter(c=>c.subject_id===tgt.id).sort((a,b)=>a.order_index-b.order_index)
    if(ex.some(c=>c.title===MARKER)){ console.log(`• ${tgt.level}: déjà fait — ignoré.`); continue }
    const base=ex.length?Math.max(...ex.map(c=>c.order_index))+1:0
    console.log(`• ${tgt.level}: ${ex.length} chapitre(s) → + « ${MARKER} » (#${base}) + « Méthodologie du bac » (#${base+1})`)
    if(!CONFIRM) continue
    const newChapters=[
      {title:MARKER,description:'Les notions pour analyser un texte : énonciation, genres, narration, connecteurs, engagement.',order_index:base,lessons:toolLessons},
      {title:'Méthodologie du bac : dissertation, commentaire, résumé',description:'Les trois exercices écrits du bac de français, expliqués pas à pas.',order_index:base+1,lessons:methodoLessons},
    ]
    for(const nc of newChapters){
      const [row]=await sb('/chapters',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({subject_id:tgt.id,title:nc.title,description:nc.description,order_index:nc.order_index})})
      await sb('/lessons',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(nc.lessons.map((l,j)=>({chapter_id:row.id,type:l.type,title:l.title,content:l.content,order_index:j,duration_min:8,is_premium:false})))})
    }
    console.log(`  ✓ ${tgt.level} fait.`)
  }
  console.log(CONFIRM?'\n✓ Appliqué.':'\n[DRY-RUN] Ajoute --confirm pour appliquer.')
}
main().catch(e=>{console.error('✗',e);process.exit(1)})
