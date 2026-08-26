/**
 * Convertit un cours PDF du METPFQE en Markdown + LaTeX.
 *
 * Les polycopiés « MES COURS A LA MAISON » ont toutes leurs formules dans la
 * couche texte du PDF — aucune image. Mais une fraction y est écrite comme
 * deux groupes de glyphes empilés, et un tableau comme du texte posé entre des
 * filets. Une extraction classique aplatit tout : « A = Vo N = 12 696 240 5 ».
 *
 * La reconstruction ne repose pas sur des seuils de position, trop fragiles,
 * mais sur les tracés réellement peints par le PDF : **chaque fraction a une
 * barre dessinée** et **chaque tableau a ses filets**. On lit donc la liste
 * d'opérateurs graphiques, puis on range le texte de part et d'autre de ces
 * traits. Seuls les exposants et indices, qui ne dessinent rien, restent
 * déduits de la géométrie des glyphes.
 *
 * Usage :
 *   node scripts/pdf-cours-to-markdown.mjs <cours.pdf> <sortie.md> [pageDebut] [pageFin]
 */
import { createRequire } from 'module'
import { pathToFileURL } from 'url'
import { readFileSync, writeFileSync } from 'fs'

const require = createRequire('D:/alpha-kelassi-new/apps/web/package.json')
const pdfjs = await import(pathToFileURL(require.resolve('pdfjs-dist/legacy/build/pdf.mjs')).href)
const OPNAME = Object.fromEntries(Object.entries(pdfjs.OPS).map(([k, v]) => [v, k]))

/* ── Caractères ─────────────────────────────────────────────────────────── */

// Les ensembles de nombres perdraient leur sens avec une simple normalisation
// NFKD (ℝ deviendrait un R ordinaire) : on les traduit avant.
const BLACKBOARD = { 'ℝ': '\\mathbb{R}', 'ℕ': '\\mathbb{N}', 'ℤ': '\\mathbb{Z}', 'ℚ': '\\mathbb{Q}', 'ℂ': '\\mathbb{C}' }

const SYMBOLS = {
  '×': '\\times', '÷': '\\div', '≤': '\\leq', '≥': '\\geq', '≠': '\\neq',
  '≈': '\\approx', '∞': '\\infty', '∈': '\\in', '∉': '\\notin', '⊂': '\\subset',
  '∪': '\\cup', '∩': '\\cap', '∅': '\\emptyset', '∀': '\\forall', '∃': '\\exists',
  '√': '\\sqrt', '∑': '\\sum', '∏': '\\prod', '∫': '\\int', '→': '\\to',
  '⇒': '\\Rightarrow', '⇔': '\\Leftrightarrow', '⇛': '\\Rightarrow', '±': '\\pm',
  '∆': '\\Delta', '𝛴': '\\Sigma', 'Σ': '\\Sigma', 'Ω': '\\Omega', 'α': '\\alpha',
  'β': '\\beta', 'θ': '\\theta', 'π': '\\pi', '−': '-', '‐': '-', '⁄': '/',
  '′': '’', 'ε': '\\varepsilon', 'λ': '\\lambda', 'μ': '\\mu', '∘': '\\circ',
}

/** Noms de fonctions : des mots courts qui restent des mathématiques. */
const FUNCTIONS = /^(lim|log|ln|cos|sin|tan|cotan|exp|max|min|sup|inf|arg|Card|det|Ker|pgcd|ppcm)$/i

/** Le fragment contient-il des glyphes propres aux mathématiques ? */
const looksMath = (s) =>
  /[\u{1D400}-\u{1D7FF}]/u.test(s) || /[ℝℕℤℚℂ∑∏∫√∞∈∉⊂∪∩∅∀∃≤≥≠≈×÷→⇒⇔⁄±∆ΣΩ]/u.test(s)

/** Glyphes mathématiques Unicode → ASCII / commandes LaTeX. */
function toLatex(s) {
  let out = ''
  for (const ch of s) {
    if (BLACKBOARD[ch]) { out += BLACKBOARD[ch] + ' '; continue }
    if (SYMBOLS[ch]) { out += SYMBOLS[ch] + ' '; continue }
    // Les glyphes de la zone à usage privé (puces Wingdings, symboles propres
    // à une police) n'ont pas d'équivalent : KaTeX les rejette, on les retire.
    if (/[\u{E000}-\u{F8FF}]/u.test(ch)) continue
    // Les alphabets mathématiques (gras, italique…) se décomposent en ASCII.
    out += /[\u{1D400}-\u{1D7FF}]/u.test(ch) ? ch.normalize('NFKD') : ch
  }
  return out
}

/* ── Lecture du PDF ─────────────────────────────────────────────────────── */

const readItems = (content) => content.items
  .filter((i) => i.str && i.str.trim() !== '' && i.height > 0)
  .map((i) => ({ x: i.transform[4], y: i.transform[5], h: i.height, w: i.width, s: i.str }))
  .sort((a, b) => b.y - a.y || a.x - b.x)

const PAINT = new Set(['stroke', 'closeStroke', 'fill', 'eoFill', 'fillStroke', 'eoFillStroke', 'closeFillStroke', 'closeEOFillStroke'])
const DROP = new Set(['endPath', 'clip', 'eoClip'])

/**
 * Segments réellement peints. Les chemins seulement utilisés pour rogner
 * (`clip`) sont écartés : ce sont des rectangles pleine page qui noieraient
 * les vrais traits.
 */
function readSegments(ops) {
  const apply = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]
  const mul = (a, b) => [
    a[0] * b[0] + a[1] * b[2], a[0] * b[1] + a[1] * b[3],
    a[2] * b[0] + a[3] * b[2], a[2] * b[1] + a[3] * b[3],
    a[4] * b[0] + a[5] * b[2] + b[4], a[4] * b[1] + a[5] * b[3] + b[5],
  ]
  let ctm = [1, 0, 0, 1, 0, 0]
  const stack = []
  const segs = []
  let pending = []

  for (let i = 0; i < ops.fnArray.length; i++) {
    const fn = OPNAME[ops.fnArray[i]], args = ops.argsArray[i]
    if (PAINT.has(fn)) { segs.push(...pending); pending = []; continue }
    if (DROP.has(fn)) { pending = []; continue }
    if (fn === 'save') stack.push([...ctm])
    else if (fn === 'restore') ctm = stack.pop() ?? ctm
    else if (fn === 'transform') ctm = mul(args, ctm)
    else if (fn === 'constructPath') {
      const [cmds, coords] = args
      let k = 0, cur = null
      for (const c of cmds) {
        const name = OPNAME[c]
        if (name === 'moveTo') { cur = apply(ctm, coords[k], coords[k + 1]); k += 2 }
        else if (name === 'lineTo') {
          const p = apply(ctm, coords[k], coords[k + 1]); k += 2
          if (cur) pending.push({ x1: cur[0], y1: cur[1], x2: p[0], y2: p[1] })
          cur = p
        } else if (name === 'rectangle') {
          const [x, y, w, h] = coords.slice(k, k + 4); k += 4
          const a = apply(ctm, x, y), b = apply(ctm, x + w, y + h)
          pending.push({ x1: a[0], y1: a[1], x2: b[0], y2: a[1] })
          pending.push({ x1: a[0], y1: b[1], x2: b[0], y2: b[1] })
          pending.push({ x1: a[0], y1: a[1], x2: a[0], y2: b[1] })
          pending.push({ x1: b[0], y1: a[1], x2: b[0], y2: b[1] })
        } else if (name === 'curveTo') k += 6
      }
    }
  }

  const H = [], V = []
  for (const s of segs) {
    const [xa, xb] = [Math.min(s.x1, s.x2), Math.max(s.x1, s.x2)]
    const [ya, yb] = [Math.min(s.y1, s.y2), Math.max(s.y1, s.y2)]
    if (yb - ya < 0.8 && xb - xa > 2) H.push({ y: (ya + yb) / 2, x1: xa, x2: xb })
    else if (xb - xa < 0.8 && yb - ya > 2) V.push({ x: (xa + xb) / 2, y1: ya, y2: yb })
  }
  // Un trait épais est peint comme un rectangle : ses deux bords donnent deux
  // segments quasi confondus, qu'on fusionne.
  const merge = (list, key, k1, k2) => {
    const out = []
    for (const s of list.sort((a, b) => a[key] - b[key] || a[k1] - b[k1])) {
      const prev = out.find((o) => Math.abs(o[key] - s[key]) < 2.2 && Math.abs(o[k1] - s[k1]) < 3 && Math.abs(o[k2] - s[k2]) < 3)
      if (!prev) out.push({ ...s })
    }
    return out
  }
  return { H: merge(H, 'y', 'x1', 'x2'), V: merge(V, 'x', 'y1', 'y2') }
}

/* ── Tableaux ───────────────────────────────────────────────────────────── */

/**
 * Un tableau se repère à ses filets verticaux : deux au moins, reliés par des
 * filets horizontaux. On en déduit la grille, puis on range chaque fragment
 * de texte dans sa cellule.
 */
function detectTables({ H, V }, items) {
  const tall = V.filter((v) => v.y2 - v.y1 > 6)
  if (tall.length < 2) return []

  // Regroupe les verticales qui se recouvrent : un tableau à la fois.
  const clusters = []
  for (const v of tall.sort((a, b) => b.y2 - a.y2)) {
    const c = clusters.find((g) => Math.min(g.y2, v.y2) - Math.max(g.y1, v.y1) > -6)
    if (c) { c.y1 = Math.min(c.y1, v.y1); c.y2 = Math.max(c.y2, v.y2); c.xs.push(v.x) }
    else clusters.push({ y1: v.y1, y2: v.y2, xs: [v.x] })
  }

  const tables = []
  for (const c of clusters) {
    const cols = [...new Set(c.xs.map((x) => Math.round(x)))].sort((a, b) => a - b)
    // Trois filets verticaux au minimum, soit deux colonnes : un cadre isolé
    // n'est pas un tableau, c'est le contour d'un objet Equation.
    if (cols.length < 3) continue
    const rows = [...new Set(H
      .filter((h) => h.y >= c.y1 - 3 && h.y <= c.y2 + 3 && h.x2 - h.x1 > 8)
      .map((h) => Math.round(h.y)))].sort((a, b) => b - a)
    if (rows.length < 2) continue

    const box = { x1: cols[0] - 2, x2: cols[cols.length - 1] + 2, y1: c.y1 - 2, y2: c.y2 + 2 }
    const inside = items.filter((i) => i.x + i.w > box.x1 && i.x < box.x2 && i.y > box.y1 && i.y < box.y2)
    if (inside.length < 3) continue

    const grid = rows.slice(0, -1).map(() => cols.slice(0, -1).map(() => []))
    tables.push({ box, grid, rows, cols })
  }
  return tables
}

function tableToMarkdown(table) {
  // Les cellules reçoivent des atomes déjà convertis — fractions comprises.
  const cell = (list) => list.sort((a, b) => b.y - a.y || a.x - b.x).map((a) => a.text).join(' ')
    .replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim()
  let rows = table.grid.map((r) => r.map(cell))
  if (!rows.length || !rows[0].length) return ''
  // Les gabarits Word intercalent des colonnes et des lignes d'espacement,
  // vides de bout en bout : elles n'ont aucun sens en Markdown.
  const keep = rows[0].map((_, c) => rows.some((r) => (r[c] ?? '').trim() !== ''))
  rows = rows.filter((r) => r.some((v) => v.trim() !== '')).map((r) => r.filter((_, c) => keep[c]))
  if (rows.length < 2 || !rows[0].length) return ''
  const width = Math.max(...rows.map((r) => r.length))
  const line = (r) => `| ${Array.from({ length: width }, (_, i) => r[i] ?? '').join(' | ')} |`
  const sep = `| ${Array.from({ length: width }, () => '---').join(' | ')} |`
  // La première ligne d'un tableau de cours en est presque toujours l'en-tête.
  return ['', line(rows[0]), sep, ...rows.slice(1).map(line), ''].join('\n')
}

/* ── Fractions, exposants, indices ──────────────────────────────────────── */

/**
 * Assemble une suite de fragments en collant à chacun l'exposant ou l'indice
 * qui le suit. Un glyphe plus petit, décalé de moins d'un tiers de hauteur et
 * accolé à droite, est un script ; c'est le seul cas que le PDF ne dessine pas.
 */
function assemble(atoms) {
  const list = atoms.slice().sort((a, b) => a.x - b.x)

  // Les glyphes d'indice voisins forment un seul indice : « t », « / », « 0 »
  // doivent donner _{t/0}. Sans ce regroupement, « / » et « 0 » ne trouvent
  // aucun hôte — ils suivent un indice, pas un glyphe de base.
  const groups = []
  for (const s of list.filter((a) => a.script)) {
    const g = groups[groups.length - 1]
    if (g && Math.abs(g.y - s.y) < 1.6 && s.x < g.x + g.w + 2.5) {
      g.w = Math.max(g.x + g.w, s.x + s.w) - g.x
      g.text += s.text
      g.members.push(s)
    } else groups.push({ x: s.x, y: s.y, w: s.w, h: s.h, text: s.text, script: true, members: [s] })
  }

  const out = []
  for (const a of list) {
    if (a.script) continue
    let text = a.text
    for (const s of groups) {
      if (s.used) continue
      if (s.x < a.x + a.w - 1.5 || s.x > a.x + a.w + 4) continue
      if (Math.abs(s.y - a.y) > 0.4 * a.h) continue
      s.used = true
      s.members.forEach((m) => { m.used = true })
      const body = s.text.replace(/\s+/g, '').trim()
      if (!body) continue
      // Une apostrophe française est composée petite et surélevée : ce n'est
      // pas un exposant.
      if (/^['′’]+$/.test(body)) { text += '’'; continue }
      text += `${s.y > a.y ? '^' : '_'}{${body}}`
    }
    out.push({ ...a, text })
  }
  // Les scripts orphelins ne doivent pas disparaître.
  for (const s of list) if (s.script && !s.used) out.push(s)
  return out.sort((a, b) => a.x - b.x)
}

const joinAtoms = (atoms) => assemble(atoms).map((a) => a.text).join(' ').replace(/\s+/g, ' ').trim()

/**
 * Transforme les fragments en « atomes » : les fractions dessinées deviennent
 * un atome unique portant leur code LaTeX, les autres restent tels quels.
 */
function foldFractions(items, bars, H) {
  const pool = items.map((i) => ({
    x: i.x, y: i.y, w: i.w, h: i.h, text: toLatex(i.s), raw: i.s,
    math: looksMath(i.s), script: false,
  }))
  // Les barres les plus courtes sont les plus imbriquées : on les résout
  // d'abord pour que leur résultat serve de numérateur à la suivante.
  for (const bar of bars.slice().sort((a, b) => (a.x2 - a.x1) - (b.x2 - b.x1))) {
    // Le fragment doit tenir SOUS la barre, pas seulement la croiser : sans
    // cette condition, une ligne de texte qui passe au-dessus deviendrait le
    // numérateur.
    const span = (a) => a.x >= bar.x1 - 3 && a.x + a.w <= bar.x2 + 3
    const near = (a) => Math.abs(a.y - bar.y) < 1.5 * H
    const above = pool.filter((a) => span(a) && near(a) && a.y > bar.y + 0.5)
    const below = pool.filter((a) => span(a) && near(a) && a.y < bar.y - 0.5)
    // Une vraie fraction a ses deux moitiés. Un trait isolé — soulignement,
    // reste de mise en page — n'en est pas une : on le laisse tranquille.
    if (!above.length || !below.length) continue

    // Un glyphe nettement plus petit accolé à un autre reste son indice.
    for (const group of [above, below]) {
      for (const a of group) {
        a.script = group.some((o) => o !== a && a.h < o.h - 0.5
          && a.x >= o.x + o.w - 1.5 && a.x <= o.x + o.w + 4 && Math.abs(a.y - o.y) <= 0.4 * o.h)
      }
    }
    const num = joinAtoms(above), den = joinAtoms(below)
    for (const a of [...above, ...below]) pool.splice(pool.indexOf(a), 1)
    pool.push({
      x: bar.x1, y: bar.y, w: bar.x2 - bar.x1, h: H,
      text: `\\frac{${num || '?'}}{${den || '?'}}`, math: true, structured: true, script: false,
    })
  }
  return pool
}

/**
 * Colle chaque exposant ou indice à son glyphe, à l'échelle de la page. Ces
 * deux-là sont les seuls éléments que le PDF ne dessine pas : ils se déduisent
 * de la taille du glyphe et de son accolage au précédent.
 */
function mergeScripts(atoms, H) {
  const sorted = atoms.slice().sort((a, b) => a.x - b.x)
  for (const a of sorted) {
    if (a.structured) { a.script = false; continue }
    a.script = sorted.some((o) => o !== a && !o.structured && a.h < o.h - 0.5
      && a.x >= o.x + o.w - 1.5 && a.x <= o.x + o.w + 4
      && Math.abs(a.y - o.y) > 0.05 * o.h && Math.abs(a.y - o.y) <= 0.4 * o.h)
  }

  // Un indice composé — « t », « ⁄ », « 0 » — n'a qu'un seul de ses glyphes
  // accolé à la base : les suivants suivent un indice, de même taille qu'eux.
  // On propage donc la marque de proche en proche.
  for (let pass = 0; pass < 4; pass++) {
    let grew = false
    for (const a of sorted) {
      if (a.script || a.structured || a.h > H - 0.5) continue
      const chained = sorted.some((o) => o !== a && o.script
        && Math.abs(a.h - o.h) < 1 && Math.abs(a.y - o.y) < 1.8
        && a.x >= o.x + o.w - 1.5 && a.x <= o.x + o.w + 3)
      if (chained) { a.script = true; grew = true }
    }
    if (!grew) break
  }
  return assemble(sorted)
}

/* ── Assemblage d'une ligne ─────────────────────────────────────────────── */

function buildLine(atoms, H) {
  const tokens = atoms.slice().sort((a, b) => a.x - b.x).map((a) => {
    const structured = a.structured || /\\|[\^_]\{/.test(a.text)
    const word = a.text.replace(/[^A-Za-zÀ-ÿ]/g, '')
    const isWord = word.length >= 3 && !FUNCTIONS.test(word)
    return { ...a, structured, math: structured || ((a.math || a.text !== a.raw) && !isWord) }
  })

  // Un opérateur ou un nombre isolé entre deux fragments mathématiques fait
  // partie de la même formule.
  for (let k = 1; k < tokens.length - 1; k++) {
    if (tokens[k].math || !tokens[k - 1].math || !tokens[k + 1].math) continue
    if (/^[=+\-×/*(),.:;’\d\s]{1,4}$/.test(tokens[k].raw ?? tokens[k].text)) tokens[k].math = true
  }

  // Décision au niveau de la ligne : dès qu'elle porte plusieurs vrais mots,
  // les fragments italiques restants en font partie. Les traiter isolément
  // découperait la phrase en « $de b$ase ».
  if (tokens.filter((t) => !t.math).length >= 2) {
    for (let k = 0; k < tokens.length; k++) {
      const t = tokens[k]
      if (!t.math || t.structured) continue
      if (tokens[k - 1]?.structured || tokens[k + 1]?.structured) continue
      if (/^[A-Za-zÀ-ÿ0-9’'.,()=<>+\-\s]+$/.test(t.text)) t.math = false
    }
  }

  let out = '', prev = null, run = []
  const flush = () => {
    if (!run.length) return
    let body = run.join(' ').replace(/\s+/g, ' ').trim()
    // Le radical du PDF couvre tout ce qui le suit ; en LaTeX il faut le dire,
    // sans quoi « \sqrt L \times P » ne met que le L sous la racine.
    body = body.replace(/\\sqrt\s+(.+)$/, (_, rest) => `\\sqrt{${rest.trim()}}`)
    // Un radical sans radicande — la formule se poursuit à la ligne suivante —
    // ferait échouer tout le rendu KaTeX.
    body = body.replace(/\\sqrt\s*$/, '\\sqrt{\\;}')
    if (body) out += `$${body}$`
    run = []
  }
  for (const t of tokens) {
    const space = prev && t.x - (prev.x + prev.w) > 0.15 * H
    if (t.math) { if (!run.length && out && space && !out.endsWith(' ')) out += ' '; run.push(t.text) }
    else { flush(); if (out && space && !out.endsWith(' ')) out += ' '; out += t.text }
    prev = t
  }
  flush()
  return out
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*’\s*/g, '’')
    // La ponctuation recolle parfois au mot suivant faute d'espace mesurable.
    .replace(/([,;:)])(?=[A-Za-zÀ-ÿ])/g, '$1 ')
    .trim()
}

/* ── Mise en forme Markdown ─────────────────────────────────────────────── */

const HEADING = [
  [/^CHAPITRE\s+[IVX\d]+\s*[:\-–]/i, '##'],
  [/^(FICHE|THEME|TABLES? DES MATIERES|PREFACE|CONCLUSION|INTRODUCTION|SOLUTION|EXERCICE|TD)\b/i, '###'],
  [/^[IVX]+\s*[-–.)]\s+\S/, '###'],
  [/^\d+\s*[-–.)]\s+\S/, '####'],
  [/^[a-z]\s*[-–.)]\s+\S/, '#####'],
]

function markdownise(lines) {
  const out = []
  for (const raw of lines) {
    const t = typeof raw === 'string' ? raw.trim() : raw
    if (typeof t !== 'string') { out.push(t.markdown); continue }
    if (!t) { out.push(''); continue }
    if (/^\d{1,3}$/.test(t)) continue // numéro de page

    // Les puces des polycopiés sont des glyphes Wingdings, rangés par la
    // police dans la zone à usage privé d'Unicode.
    const bullet = t.match(/^[•▪◦‣·\u{E000}-\u{F8FF}]\s*(.*)$/u)
    if (bullet) { out.push(`- ${bullet[1]}`); continue }

    // « 1) Calcule l'indice… ; » est une question d'exercice, pas un titre :
    // un intitulé de section ne se termine pas par une ponctuation de phrase
    // et reste court.
    const looksQuestion = /[;?!,]$/.test(t) || t.length > 60
    const h = HEADING.find(([re]) => re.test(t))
    if (h && !looksQuestion) { out.push('', `${h[1]} ${t.replace(/\s+/g, ' ')}`, ''); continue }
    if (h && looksQuestion) { out.push(`- ${t}`); continue }
    out.push(t)
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}

/* ── Programme ──────────────────────────────────────────────────────────── */

const [file, dest, from = '1', to = '9999'] = process.argv.slice(2)
if (!file || !dest) {
  console.error('usage : node scripts/pdf-cours-to-markdown.mjs <cours.pdf> <sortie.md> [pageDebut] [pageFin]')
  process.exit(1)
}

const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(file)), useSystemFonts: true }).promise
const first = Number(from), last = Math.min(Number(to), doc.numPages)
console.log(`${file} — ${doc.numPages} pages, conversion ${first} → ${last}`)

const lines = []
let nFrac = 0, nTable = 0
for (let p = first; p <= last; p++) {
  const page = await doc.getPage(p)
  const items = readItems(await page.getTextContent())
  if (!items.length) continue
  const segs = readSegments(await page.getOperatorList())

  // Hauteur de corps de texte = hauteur la plus fréquente sur la page.
  const tally = {}
  for (const i of items) { const k = Math.round(i.h); tally[k] = (tally[k] ?? 0) + i.s.length }
  const H = Number(Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0]) || 12

  const tables = detectTables(segs, items)
  nTable += tables.length
  const inTable = (i) => tables.some((t) => i.x + i.w > t.box.x1 && i.x < t.box.x2 && i.y > t.box.y1 && i.y < t.box.y2)

  // Les filets de tableau ne sont pas des barres de fraction.
  // Seuls les filets du tableau sont écartés : une fraction écrite DANS une
  // cellule garde sa barre, et donc sa reconstruction.
  const bars = segs.H.filter((h) => {
    const len = h.x2 - h.x1
    if (len < 5 || len > 300) return false
    return !tables.some((t) => t.rows.some((y) => Math.abs(h.y - y) < 2.5)
      && h.x2 > t.box.x1 && h.x1 < t.box.x2)
  })
  nFrac += bars.length

  // Les exposants et indices sont absorbés par leur glyphe AVANT le découpage
  // en lignes : posés plus bas que leur ligne de base, ils formeraient sinon
  // une ligne à eux seuls (« $t / 0$ » sous la formule).
  const atoms = mergeScripts(foldFractions(items, bars, H), H)

  // Chaque atome part dans sa cellule, ou dans le fil du texte.
  const flow = []
  for (const a of atoms) {
    const t = tables.find((tb) => a.x + a.w > tb.box.x1 && a.x < tb.box.x2 && a.y > tb.box.y1 && a.y < tb.box.y2)
    if (!t) { flow.push(a); continue }
    const cx = a.x + a.w / 2, cy = a.y + a.h * 0.3
    const r = t.rows.findIndex((y, k) => k < t.rows.length - 1 && cy <= y + 1 && cy > t.rows[k + 1] - 1)
    const col = t.cols.findIndex((x, k) => k < t.cols.length - 1 && cx >= x - 1 && cx < t.cols[k + 1] + 1)
    if (r >= 0 && col >= 0) t.grid[r][col].push(a)
    else flow.push(a)
  }

  // Regroupement en lignes de lecture, puis rendu.
  const rows = []
  for (const a of flow.sort((x, y) => y.y - x.y || x.x - y.x)) {
    const row = rows.find((r) => Math.abs(r.y - a.y) < 0.55 * H)
    if (row) row.atoms.push(a)
    else rows.push({ y: a.y, atoms: [a] })
  }

  const blocks = [
    ...rows.map((r) => ({ y: r.y, text: buildLine(r.atoms, H) })),
    ...tables.map((t) => ({ y: t.box.y2, markdown: tableToMarkdown(t) })),
  ].sort((a, b) => b.y - a.y)

  for (const b of blocks) {
    if (b.markdown) lines.push({ markdown: b.markdown })
    else if (b.text) lines.push(b.text)
  }
  lines.push('')
}

writeFileSync(dest, markdownise(lines), 'utf-8')
console.log(`→ ${dest}  (${nFrac} barres de fraction, ${nTable} tableaux)`)
