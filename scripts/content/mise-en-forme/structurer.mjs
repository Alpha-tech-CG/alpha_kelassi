/**
 * Transforme les « faux titres » d'un cours en vrais sous-titres Markdown, pour que
 * le sommaire repliable et le style des cours s'appliquent :
 *   « I- Définition », « 1) … », « A. … », « SECTION 2 — … », « INTRODUCTION »,
 *   ligne entière en gras « **II- Les microbes** », ligne en MAJUSCULES,
 *   question seule sur sa ligne (« Qu'est-ce que le thème ? »).
 * Niveaux : ordre canonique des numérotations présentes (SECTION > I > I.1 > A > 1 > a) :
 * la plus haute donne ##, la suivante ###, les autres ####. Ne touche ni aux listes
 * serrées, ni aux phrases, ni aux consignes d'exercice, ni aux tableaux, formules,
 * encadrés et blocs de code.
 */

// Ordre canonique : du plus haut niveau au plus bas.
const STYLES = {
  chapter: /^(CHAPITRE|CHAPTER)\s+[\dIVX]+\b/i,
  section: /^(SECTION|PARTIE|PART)\s+[\dIVX]+\b/i,
  roman: /^[IVX]{1,5}\s*[-–.)]\s*\S/,
  romanSub: /^[IVX]{1,5}[-.]\d{1,2}\.?\s*\S/,
  upper: /^[A-H]\s*[-–.)]\s+\S/,
  digit: /^\d{1,2}\s*[-–.)°]\s*\S/,
  lower: /^[a-h]\s*[-.)]\s+\S/,
}
const TOP_WORDS = /^(INTRODUCTION|CONCLUSION|FICHE DE R[ÉE]VISION|R[ÉE]SUM[ÉE]|L'ESSENTIEL|À RETENIR|BIBLIOGRAPHIE)\b/i
// Consigne d'exercice (« 1- Déterminer… ») : jamais un titre.
const INSTRUCTION = /^(?:[\dIVXa-hA-H]{1,4}(?:[-.]\d{1,2})?\s*[-–.)°/]+\s*)?(d[ée]termin|calcul|montr|donn|[ée]cri|expliqu|recopi|compl[èée]t|cite[rz]?\b|d[ée]finis(?:sez)?|d[ée]finir|pr[ée]cis|justifi|indiqu|trouv|r[ée]sou|repr[ée]sent|constru|v[ée]rifi|d[ée]dui|compar|analys|annot|l[ée]gend|nomm|identifi|plac|rang|reli|soulign|entour|colori|lis\b|li(?:re|sez)\b|observ|partant|on donne|au bout de)/i
// Une question ne devient un titre que si elle commence par un mot interrogatif.
const QUESTION_TITLE = /^(qu['’]|quel|quelle|quels|quelles|comment|pourquoi|d['’]où|où|que |qui |combien|en quoi|à quoi|dans quel|par quel|what|why|how|when|where|which|who)/i

const strip = (t) => t.replace(/^\*\*(.+?)\*\*\s*:?\s*$/, '$1').replace(/\*\*/g, '').replace(/\s*:\s*$/, '').trim()
const isCaps = (t) => { const letters = t.replace(/[^A-Za-zÀ-ÿ]/g, ''); return letters.length >= 6 && t === t.toUpperCase() && /[A-ZÀ-Ý]/.test(t) }

function styleOf(t) {
  for (const [name, re] of Object.entries(STYLES)) if (re.test(t)) return name
  return null
}

/** @returns {{ text: string, changed: number }} */
export function structurer(md) {
  const lines = md.split('\n')
  // Zones protégées : blocs de code, formules en bloc multi-lignes.
  const protectedLine = []
  let fence = false, math = false
  for (const l of lines) {
    const t = l.trim()
    if (/^(```|~~~)/.test(t)) { protectedLine.push(true); fence = !fence; continue }
    if (!fence && /^\$\$\s*$/.test(t)) { protectedLine.push(true); math = !math; continue }
    protectedLine.push(fence || math)
  }
  const blank = (i) => i < 0 || i >= lines.length || !lines[i].trim()

  // 1. Repérer les candidats.
  const cands = []
  let seenContent = false
  lines.forEach((l, i) => {
    const raw = l.trim()
    if (!raw || protectedLine[i] || /^(#|>|\||[-*+]\s|<|!\[|\$\$)/.test(raw)) { if (raw) seenContent = true; return }
    const bareBold = /^\*\*[^*]{2,90}\*\*\s*:?\s*$/.test(raw)
    const t = strip(raw)
    if (t.length > 100 || t.length < 2) { seenContent = true; return }
    const style = styleOf(t)
    const caps = isCaps(t) && !/[.;]$/.test(t)
    const top = TOP_WORDS.test(t) && t.length < 40
    // Un faux titre est isolé (ligne vide avant) ; pas une liste serrée de même style.
    const isolated = blank(i - 1)
    const sameStyleNeighbour = (j) => !blank(j) && !protectedLine[j] && styleOf(strip(lines[j].trim())) === style
    const inList = style && (sameStyleNeighbour(i - 1) || sameStyleNeighbour(i + 1))
    const sentence = /[.;!]$/.test(t) || t.split(/\s+/).length > 14 || INSTRUCTION.test(t) || /\$/.test(t)
    // Question seule sur sa ligne, entourée de lignes vides : titre (cours rédigés en questions).
    const question = !style && /\?$/.test(t) && QUESTION_TITLE.test(t) && isolated && blank(i + 1) && !sentence
    let kind = null
    if ((style === 'section' || style === 'chapter') && !sentence) kind = style
    else if (style && isolated && !inList && !sentence && t.length <= 90) kind = style
    else if (question) kind = 'question'
    else if (bareBold && isolated && !sentence) kind = style ?? 'bold'
    else if ((caps || top) && isolated && !sentence) kind = 'caps'
    if (!kind) { seenContent = true; return }
    // Le titre du chapitre (déjà affiché par la page) et les lignes d'en-tête avant tout
    // contenu restent une simple ligne en gras.
    if (kind === 'chapter' || (!seenContent && (kind === 'caps' || kind === 'bold') && !TOP_WORDS.test(t))) {
      cands.push({ i, t, kind: 'banner' }); return
    }
    seenContent = true
    cands.push({ i, t, kind: TOP_WORDS.test(t) && (kind === 'caps' || kind === 'bold') ? 'top' : kind })
  })
  const real = cands.filter((c) => c.kind !== 'banner')
  if (real.length < 2) return { text: md, changed: 0 }

  // 2. Niveaux, dans l'ordre canonique des styles numérotés présents :
  //    le plus haut → ##, le suivant → ###, les autres → ####.
  //    INTRODUCTION / CONCLUSION… → ## ; questions → ## (### s'il y a une numérotation) ;
  //    autres lignes en majuscules ou en gras seul : ## sans numérotation, sinon ####.
  const numbered = Object.keys(STYLES).filter((s) => s !== 'chapter' && real.some((c) => c.kind === s))
  const depth = (k) => {
    if (k === 'top') return 0
    if (k === 'caps' || k === 'bold') return numbered.length ? 2 : 0
    if (k === 'question') return numbered.length ? 1 : 0
    return Math.min(2, numbered.indexOf(k))
  }
  const out = lines.slice()
  for (const c of cands) {
    if (c.kind === 'banner') { out[c.i] = `**${c.t}**`; continue }
    const level = 2 + depth(c.kind)
    // « 1.4- Bronchioles : ce sont… » : le titre s'arrête aux deux-points, la suite devient un paragraphe.
    const m = /^(.{3,70}?)\s+:\s+(\S.*)$/.exec(c.t)
    const cut = m && c.kind !== 'section' && /^(ce sont|c['’]est|il s['’]agit|on (appelle|distingue|dit)|elles? (est|sont)|ils? (est|sont)|est |sont |d[ée]signe|repr[ée]sente|correspond)/i.test(m[2])
    const title = cut ? m[1] : c.t
    const rest = cut ? `\n\n${m[2].charAt(0).toUpperCase()}${m[2].slice(1)}` : ''
    out[c.i] = `${blank(c.i - 1) ? '' : '\n'}${'#'.repeat(level)} ${title}${rest}`
    if (!blank(c.i + 1) && !/^#/.test(out[c.i + 1] ?? '')) out[c.i] += '\n'
  }
  return { text: out.join('\n'), changed: real.length }
}
