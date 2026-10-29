// Mise en forme des cours réécrits (à lancer après chaque rédaction) :
//  1. une formule par ligne : les blocs $$ a \qquad b $$ sont éclatés (sinon ça déborde sur téléphone) ;
//  2. chaque formule en bloc ($$…$$), chaque « Solution. » et chaque titre d'encadré forment
//     leur propre paragraphe (ligne vide avant/après, y compris dans un encadré « > ») — sinon
//     le site les recolle à la phrase voisine.
// Usage : node scripts/content/cours-maths-tle/_tidy.mjs <fichier.md>…
import { readFileSync, writeFileSync } from 'fs'

const TITLE = /^> \*\*(📘|🏛|📐|💡|✏|🧭|⚠|🎯)/
const isQuote = (l) => l.startsWith('>')
const isBlankQuote = (l) => /^>\s*$/.test(l)
const isDisplay = (l) => /^(> )?\$\$.*\$\$\s*$/.test(l)
const isSolution = (l) => /^(> )?\*\*Solution/.test(l)

for (const f of process.argv.slice(2)) {
  // 1. éclater les \qquad
  const lines = []
  for (const line of readFileSync(f, 'utf8').split('\n')) {
    const m = /^(> )?\$\$(.*)\$\$\s*$/.exec(line)
    if (m && m[2].includes('\\qquad') && !m[2].includes('\\begin')) {
      for (const part of m[2].split('\\qquad').map((s) => s.trim()).filter(Boolean)) lines.push(`${m[1] ?? ''}$$${part}$$`)
    } else lines.push(line)
  }
  // 2. séparer les blocs
  const out = []
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]
    const block = isDisplay(l) || isSolution(l)
    const prev = out[out.length - 1]
    if (block && prev !== undefined && prev.trim() !== '' && !isBlankQuote(prev)) out.push(isQuote(l) ? '>' : '')
    out.push(l)
    const next = lines[i + 1]
    if ((block || TITLE.test(l)) && next !== undefined && next.trim() !== '' && !isBlankQuote(next)) {
      if (isQuote(l) && isQuote(next)) out.push('>')
      else if (!isQuote(l)) out.push('')
    }
  }
  // 3. on GARDE « $$formule$$ » sur une seule ligne : l'appli mobile (toutes versions) l'affiche
  //    centrée ; le site convertit lui-même ces lignes en bloc (markdown-renderer.tsx). Un bloc
  //    sur plusieurs lignes dans un encadré afficherait des « > » dans les anciennes versions mobiles.
  const final = []
  for (let i = 0; i < out.length; i++) {
    const open = /^(> )?\$\$\s*$/.exec(out[i])
    if (open && out[i + 2] !== undefined && /^(> )?\$\$\s*$/.test(out[i + 2]) && !/\$\$/.test(out[i + 1])) {
      final.push(`${open[1] ?? ''}$$${out[i + 1].replace(/^> /, '').trim()}$$`); i += 2
    } else final.push(out[i])
  }
  writeFileSync(f, final.join('\n'))
  console.log(f, ':', out.length - readFileSync(f, 'utf8').split('\n').length + (out.length - lines.length), 'ligne(s) ajoutée(s)')
}
