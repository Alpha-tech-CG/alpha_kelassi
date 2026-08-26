/**
 * Convertit un cours PDF du METPFQE en Markdown + LaTeX.
 *
 * Les polycopiés « MES COURS A LA MAISON » ont toutes leurs formules dans la
 * couche texte du PDF — aucune image. Mais une fraction y est écrite comme
 * trois groupes de glyphes empilés autour de la ligne de base, et un indice
 * comme un glyphe plus petit collé au précédent. Une extraction de texte
 * classique aplatit tout (« A = Vo N = 12 696 240 5 ») et perd le sens.
 *
 * Ce script relit la géométrie de chaque fragment (x, y, hauteur) pour
 * reconstruire les fractions, exposants et indices, et les réécrit en LaTeX
 * (`$...$`), que le site comme l'application mobile savent afficher (KaTeX).
 *
 * Usage :
 *   node scripts/pdf-cours-to-markdown.mjs <cours.pdf> <sortie.md> [pageDebut] [pageFin]
 */
import { createRequire } from 'module'
import { pathToFileURL } from 'url'
import { readFileSync, writeFileSync } from 'fs'

const require = createRequire('D:/alpha-kelassi-new/apps/web/package.json')
const pdfjs = await import(pathToFileURL(require.resolve('pdfjs-dist/legacy/build/pdf.mjs')).href)

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
  'β': '\\beta', '∝': '\\alpha', 'θ': '\\theta', 'π': '\\pi', '−': '-', '‐': '-',
  '⁄': '/', '∁': 'C', '′': '’', 'ε': '\\varepsilon', 'λ': '\\lambda', 'μ': '\\mu', '∘': '\\circ',
}

/** Noms de fonctions : des mots courts qui restent des mathématiques. */
const FUNCTIONS = /^(lim|log|ln|cos|sin|tan|cotan|exp|max|min|sup|inf|arg|Card|det|Ker|Im|pgcd|ppcm)$/i

/** Le fragment contient-il des glyphes propres aux mathématiques ? */
function looksMath(s) {
  return /[\u{1D400}-\u{1D7FF}]/u.test(s) || /[ℝℕℤℚℂ∑∏∫√∞∈∉⊂∪∩∅∀∃≤≥≠≈×÷→⇒⇔⁄±∆ΣΩ]/u.test(s)
}

/** Glyphes mathématiques Unicode → ASCII / commandes LaTeX. */
function toLatex(s) {
  let out = ''
  for (const ch of s) {
    if (BLACKBOARD[ch]) { out += BLACKBOARD[ch] + ' '; continue }
    if (SYMBOLS[ch]) { out += SYMBOLS[ch] + ' '; continue }
    // Les alphabets mathématiques (gras, italique…) se décomposent en ASCII.
    out += /[\u{1D400}-\u{1D7FF}]/u.test(ch) ? ch.normalize('NFKD') : ch
  }
  return out
}

/* ── Découpage géométrique ──────────────────────────────────────────────── */

/** Fragments d'une page, nettoyés et triés (haut → bas, gauche → droite). */
function readItems(content) {
  return content.items
    .filter((i) => i.str && i.str.trim() !== '' && i.height > 0)
    .map((i) => ({ x: i.transform[4], y: i.transform[5], h: i.height, w: i.width, s: i.str }))
    .sort((a, b) => b.y - a.y || a.x - b.x)
}

/** Regroupe les fragments partageant la même ligne de base. */
function toRows(items) {
  const rows = []
  for (const it of items) {
    const row = rows.find((r) => Math.abs(r.y - it.y) < 1.6)
    if (row) { row.items.push(it); row.y = (r0(row) * row.items.length + it.y) / (row.items.length + 1) }
    else rows.push({ y: it.y, items: [it] })
  }
  for (const r of rows) r.items.sort((a, b) => a.x - b.x)
  return rows.sort((a, b) => b.y - a.y)
}
const r0 = (row) => row.y

const rowWidth = (r) => r.items.reduce((n, i) => n + i.w, 0)
const rowLeft = (r) => Math.min(...r.items.map((i) => i.x))
const rowRight = (r) => Math.max(...r.items.map((i) => i.x + i.w))
const rowMaxH = (r) => Math.max(...r.items.map((i) => i.h))

/**
 * Rattache à chaque ligne de base ses satellites : numérateurs, dénominateurs,
 * exposants et indices, qui forment des lignes distinctes dans le PDF.
 */
function attachSatellites(rows, H) {
  const used = new Set()
  const lines = []

  // On part des lignes les plus larges : une ligne de base porte toujours plus
  // de texte que son numérateur ou son indice. Prendre les lignes de haut en
  // bas ferait au contraire du numérateur une ligne à part entière.
  const byWidth = rows.map((r, i) => ({ r, i })).sort((a, b) => rowWidth(b.r) - rowWidth(a.r))

  for (const { r: anchor, i } of byWidth) {
    if (used.has(i)) continue
    used.add(i)
    const satellites = []
    for (let j = 0; j < rows.length; j++) {
      if (j === i || used.has(j)) continue
      const other = rows[j]
      const dy = other.y - anchor.y
      // Un numérateur est à environ +0,8 H et un dénominateur à −0,7 H, tandis
      // que l'interligne courant dépasse 1,1 H : le seuil sépare les deux.
      // Une fraction « affichée », plus aérée, dépasse ce seuil : on l'accepte
      // jusqu'à 1,45 H, mais seulement si une autre ligne courte lui fait face
      // de l'autre côté au même endroit — la signature d'un quotient, qu'une
      // simple ligne de texte voisine n'a pas.
      const faced = rows.some((o) => o !== other && o !== anchor
        && Math.sign(o.y - anchor.y) === -Math.sign(dy)
        && Math.abs(o.y - anchor.y) <= 1.45 * H
        && rowWidth(o) <= 0.5 * rowWidth(anchor)
        && Math.min(rowRight(o), rowRight(other)) - Math.max(rowLeft(o), rowLeft(other)) > 0)
      if (dy === 0 || Math.abs(dy) > (faced ? 1.45 : 1.0) * H) continue
      if (rowWidth(other) > 0.5 * rowWidth(anchor)) continue
      // Le satellite doit tenir dans l'emprise horizontale de sa ligne de base.
      if (rowLeft(other) < rowLeft(anchor) - 3 || rowRight(other) > rowRight(anchor) + 3) continue
      satellites.push({ row: other, dy, index: j })
    }
    satellites.forEach((s) => used.add(s.index))
    lines.push({ anchor, satellites })
  }
  // Rendu dans l'ordre de lecture, et non par largeur.
  return lines.sort((a, b) => b.anchor.y - a.anchor.y)
}

/* ── Reconstruction d'une ligne ─────────────────────────────────────────── */

function buildLine(line, H) {
  const { anchor, satellites } = line

  // Un glyphe plus petit que le corps du texte est toujours un exposant ou un
  // indice ; à taille égale, c'est une moitié de fraction. La taille tranche
  // mieux que le décalage vertical : dans « I_{t/0} », la barre oblique de
  // l'indice est posée plus haut que le t et serait prise pour un numérateur.
  const sats = satellites.flatMap((sat) => sat.row.items.map((it) => ({ ...it, dy: sat.dy })))

  // Une moitié de fraction a toujours un vis-à-vis de l'autre côté de la barre,
  // à la même abscisse. C'est le seul critère fiable : ni la taille ni le
  // décalage vertical ne distinguent « p_t / p_o » (fraction en petits
  // caractères) de l'indice « p » de I, posé au même niveau.
  const overlaps = (a, b) => Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) > 0.4 * Math.min(a.w, b.w)

  // Première passe : un glyphe plus petit, collé à la droite d'un autre et
  // décalé de peu, est son indice ou son exposant. Elle passe AVANT la règle
  // du vis-à-vis, sinon l'indice du numérateur et celui du dénominateur,
  // verticalement alignés, se prendraient l'un l'autre pour une fraction.
  const hosts = [...anchor.items.map((i) => ({ ...i, dy: 0 })), ...sats]
  // Le seuil vertical se mesure sur la hauteur de l'hôte, pas sur celle du
  // corps de la page : un indice de petite fraction est proche de son propre
  // glyphe, jamais de la ligne de base. La marge est étroite — un indice
  // descend d'environ 0,23 hauteur et un dénominateur de 0,44 — d'où ce seuil
  // à 0,35 qui passe exactement entre les deux.
  const isScript = (it) => hosts.some((h) => h !== it
    && it.h <= h.h + 0.5
    && Math.abs(h.dy - it.dy) > 0.05 * h.h && Math.abs(h.dy - it.dy) <= 0.35 * h.h
    && it.x >= h.x + h.w - 1.5 && it.x <= h.x + h.w + 4)

  const fracParts = [], scripts = []
  for (const it of sats) {
    if (isScript(it)) { scripts.push(it); continue }
    // Une moitié de fraction a un vis-à-vis de l'autre côté de la barre.
    const vis = sats.some((o) => o !== it && !isScript(o) && Math.sign(o.dy) === -Math.sign(it.dy) && overlaps(it, o))
    ;(vis ? fracParts : scripts).push(it)
  }

  // Les moitiés qui se chevauchent horizontalement forment un même quotient.
  const fracs = []
  for (const part of fracParts.sort((a, b) => a.x - b.x)) {
    const side = part.dy > 0 ? 'num' : 'den'
    const f = fracs.find((g) => part.x < g.right + 6 && part.x + part.w > g.left - 6)
    if (f) { f.left = Math.min(f.left, part.x); f.right = Math.max(f.right, part.x + part.w); f[side].push(part) }
    else fracs.push({ left: part.x, right: part.x + part.w, num: side === 'num' ? [part] : [], den: side === 'den' ? [part] : [] })
  }

  // Les glyphes d'indice voisins forment un seul indice : « t », « / », « 0 »
  // doivent donner _{t/0} et non _{t}_{/}_{0}.
  const groups = []
  for (const sc of scripts.sort((a, b) => a.x - b.x)) {
    const g = groups[groups.length - 1]
    if (g && Math.sign(g.dy) === Math.sign(sc.dy) && sc.x < g.right + 2.5) {
      g.right = Math.max(g.right, sc.x + sc.w); g.parts.push(sc)
    } else groups.push({ dy: sc.dy, left: sc.x, right: sc.x + sc.w, parts: [sc] })
  }

  /** Colle à un glyphe hôte les indices/exposants qui le suivent immédiatement. */
  const withScripts = (host, baseDy = 0) => {
    let text = toLatex(host.s)
    const hostDy = host.dy ?? 0
    for (const g of groups) {
      if (g.taken) continue
      if (g.left < host.x + host.w - 1.5 || g.left > host.x + host.w + 4) continue
      // L'indice doit etre au niveau de SON glyphe : sans ce controle, celui du
      // denominateur remonterait se coller au numerateur, juste au-dessus.
      if (Math.abs(g.dy - hostDy) > 0.35 * host.h) continue
      const body = g.parts.map((p) => toLatex(p.s)).join('').replace(/\s+/g, '').trim()
      g.taken = true
      if (!body) continue
      // Une apostrophe française (l’indice, d’affaires) est composée dans une
      // police plus petite et surélevée : ce n'est pas un exposant.
      if (/^['′’]+$/.test(body)) { text += '’'; continue }
      text += `${g.dy > baseDy ? '^' : '_'}{${body}}`
    }
    return text
  }

  const glue = (parts) => {
    if (!parts.length) return ''
    const base = parts.reduce((m, p) => Math.max(m, p.dy), -Infinity)
    return parts.sort((a, b) => a.x - b.x)
      .map((p) => withScripts(p, p.dy < base ? p.dy - 1 : base - 1))
      .join('').trim()
  }

  // Assemblage : les éléments de la ligne de base, avec les fractions insérées
  // à leur abscisse et les exposants/indices collés à leur glyphe.
  const tokens = []
  // Les fractions sont composées EN PREMIER : leurs numérateurs et
  // dénominateurs doivent s'approprier leurs propres indices avant que la
  // ligne de base ne les réclame.
  for (const f of fracs) { f.numText = glue(f.num); f.denText = glue(f.den) }

  const pending = [...fracs]
  // L'abscisse est conservée : elle sert au tri final et à l'espacement.
  const emitFrac = (f) => tokens.push({
    math: true, text: `\\frac{${f.numText || '?'}}{${f.denText || '?'}}`,
    x: f.left, w: f.right - f.left,
  })

  for (const it of anchor.items) {
    while (pending.length && pending[0].left < it.x) emitFrac(pending.shift())
    let text = withScripts(it)
    // Ces polycopiés composent aussi des mots ordinaires en italique
    // mathématique (« base », « Grandeur »). Un mot de trois lettres ou plus
    // sans structure de formule reste donc du texte : l'encadrer en $…$ le
    // ferait rendre lettre par lettre par KaTeX.
    const structured = /\\|[\^_]\{/.test(text)
    const word = text.replace(/[^A-Za-zÀ-ÿ]/g, '')
    const isWord = word.length >= 3 && !FUNCTIONS.test(word)
    tokens.push({
      math: structured || ((looksMath(it.s) || text !== it.s) && !isWord),
      text, x: it.x, w: it.w, raw: it.s,
    })
  }
  for (const f of pending) emitFrac(f)

  // Rien ne doit disparaître : un groupe qui n'a trouvé aucun glyphe hôte
  // — typiquement une apostrophe posée entre deux mots — est rendu tel quel.
  for (const g of groups) {
    if (g.taken) continue
    const body = g.parts.map((q) => toLatex(q.s)).join('').trim()
    if (body) tokens.push({ math: false, text: body, x: g.left, w: g.right - g.left, raw: body })
  }
  tokens.sort((a, b) => (a.x ?? 0) - (b.x ?? 0))

  // Un opérateur ou un nombre isolé entre deux fragments mathématiques fait
  // partie de la même formule (« G_t = 5 × G_0 »).
  for (let k = 1; k < tokens.length - 1; k++) {
    if (tokens[k].math || !tokens[k - 1].math || !tokens[k + 1].math) continue
    if (/^[=+\-×/*(),.:;’\d\s]{1,4}$/.test(tokens[k].raw ?? '')) tokens[k].math = true
  }

  // Décision au niveau de la ligne : dès qu'elle porte plusieurs vrais mots,
  // les fragments italiques restants (« de », « la », « P ») en font partie.
  // Les traiter isolément découperait la phrase en « $de b$ase ».
  const structured = (t) => t && /\\|[\^_]\{/.test(t.text)
  if (tokens.filter((t) => !t.math).length >= 2) {
    for (let k = 0; k < tokens.length; k++) {
      const t = tokens[k]
      if (!t.math || structured(t)) continue
      // Un fragment voisin d'une vraie formule lui appartient (« \times 100 »).
      if (structured(tokens[k - 1]) || structured(tokens[k + 1])) continue
      if (/^[A-Za-zÀ-ÿ0-9’'.,()=<>+\-\s]+$/.test(t.text)) t.math = false
    }
  }

  // Espacement : on rétablit un blanc quand l'écart horizontal le justifie —
  // un écart nul signale un glyphe accentué posé dans une autre police.
  let out = ''
  let prev = null
  let mathRun = []
  const flush = () => {
    if (!mathRun.length) return
    const body = mathRun.join(' ').replace(/\s+/g, ' ').trim()
    // Ces polycopiés composent des phrases entières en italique mathématique
    // (« Période courante »). Sans repère de formule — fraction, exposant,
    // indice, commande — c'est de la prose : l'encadrer en $…$ la rendrait
    // illisible et casserait le rendu KaTeX.
    const isFormula = /\\|[\^_]\{|[=<>≤≥+×÷]/.test(body)
    const words = body.match(/[A-Za-zÀ-ÿ]{4,}/g) ?? []
    if (body) out += !isFormula && words.length >= 1 ? body : `$${body}$`
    mathRun = []
  }
  for (const t of tokens) {
    const gap = prev && t.x != null ? t.x - (prev.x + prev.w) : 0
    const space = prev && gap > 0.15 * H
    if (t.math) {
      if (!mathRun.length && out && space && !out.endsWith(' ')) out += ' '
      mathRun.push(t.text)
    } else {
      flush()
      if (out && space && !out.endsWith(' ')) out += ' '
      out += t.text
    }
    if (t.x != null) prev = t
  }
  flush()
  return out.replace(/[ \t]+/g, ' ').replace(/\s*’\s*/g, '’').trim()
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
    const t = raw.trim()
    if (!t) { out.push(''); continue }
    if (/^\d{1,3}$/.test(t)) continue // numéro de page

    // Les puces des polycopiés sont des glyphes Wingdings, rangés par la
    // police dans la zone à usage privé d'Unicode.
    const bullet = t.match(/^[•▪◦‣·\u{E000}-\u{F8FF}]\s*(.*)$/u)
    if (bullet) { out.push(`- ${bullet[1]}`); continue }

    const h = HEADING.find(([re]) => re.test(t))
    if (h && t.length < 90) { out.push('', `${h[1]} ${t.replace(/\s+/g, ' ')}`, ''); continue }

    out.push(t)
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}

/* ── Programme ──────────────────────────────────────────────────────────── */

const [file, dest, from = '1', to = '9999'] = process.argv.slice(2)
if (!file || !dest) { console.error('usage : node scripts/pdf-cours-to-markdown.mjs <cours.pdf> <sortie.md> [pageDebut] [pageFin]'); process.exit(1) }

const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(file)), useSystemFonts: true }).promise
const first = Number(from), last = Math.min(Number(to), doc.numPages)
console.log(`${file} — ${doc.numPages} pages, conversion ${first} → ${last}`)

const lines = []
for (let p = first; p <= last; p++) {
  const page = await doc.getPage(p)
  const items = readItems(await page.getTextContent())
  if (!items.length) continue

  // Hauteur de corps de texte = hauteur la plus fréquente sur la page.
  const tally = {}
  for (const i of items) { const k = Math.round(i.h); tally[k] = (tally[k] ?? 0) + i.s.length }
  const H = Number(Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0]) || 12

  const rows = toRows(items)
  for (const line of attachSatellites(rows, H)) {
    const text = buildLine(line, H)
    if (text) lines.push(text)
  }
  lines.push('')
}

writeFileSync(dest, markdownise(lines), 'utf-8')
console.log(`→ ${dest}`)
