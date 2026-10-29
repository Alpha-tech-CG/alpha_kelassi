/**
 * Conversion LaTeX → texte Unicode lisible, pour les écrans qui affichent du
 * texte natif (QCM, flashcards, analyse) et ne peuvent pas charger KaTeX.
 * Les cours et exercices, eux, passent par MathLessonView (rendu KaTeX complet).
 *
 *   « $\frac{1}{2}$ »        → « 1/2 »
 *   « $x^2 + \sqrt{3}$ »     → « x² + √3 »
 *   « $\vec{AB}$ »           → « AB⃗ »
 */

const SUP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾', n: 'ⁿ', i: 'ⁱ', x: 'ˣ', '*': '*',
}
const SUB: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎', a: 'ₐ', e: 'ₑ', o: 'ₒ', x: 'ₓ', n: 'ₙ', i: 'ᵢ', k: 'ₖ', p: 'ₚ', t: 'ₜ', m: 'ₘ',
}

const SYMBOLS: Record<string, string> = {
  times: '×', cdot: '·', div: '÷', pm: '±', mp: '∓', leq: '≤', le: '≤', geq: '≥', ge: '≥', neq: '≠', ne: '≠',
  approx: '≈', simeq: '≃', equiv: '≡', infty: '∞', to: '→', rightarrow: '→', Rightarrow: '⇒', implies: '⇒',
  leftarrow: '←', Leftarrow: '⇐', Leftrightarrow: '⇔', iff: '⇔', mapsto: '↦', in: '∈', notin: '∉', subset: '⊂',
  cup: '∪', cap: '∩', emptyset: '∅', varnothing: '∅', forall: '∀', exists: '∃', partial: '∂', nabla: '∇',
  int: '∫', iint: '∬', oint: '∮', sum: '∑', prod: '∏', degree: '°', circ: '°', ldots: '…', cdots: '⋯', dots: '…',
  perp: '⊥', parallel: '∥', angle: '∠', wedge: '∧', vee: '∨', neg: '¬', lbrace: '{', rbrace: '}',
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ',
  vartheta: 'θ', iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', rho: 'ρ', sigma: 'σ',
  tau: 'τ', upsilon: 'υ', phi: 'φ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω', Gamma: 'Γ', Delta: 'Δ',
  Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
  lim: 'lim', ln: 'ln', log: 'log', exp: 'exp', sin: 'sin', cos: 'cos', tan: 'tan', min: 'min', max: 'max',
  quad: '  ', qquad: '   ',
}
const SETS: Record<string, string> = { R: 'ℝ', N: 'ℕ', Z: 'ℤ', Q: 'ℚ', C: 'ℂ' }

/** Argument entre accolades à partir de `i` (accolades imbriquées gérées). */
function group(s: string, i: number): [string, number] {
  while (s[i] === ' ') i++
  if (s[i] !== '{') return [s[i] ?? '', i + 1]
  let depth = 0
  for (let j = i; j < s.length; j++) {
    if (s[j] === '{') depth++
    else if (s[j] === '}' && --depth === 0) return [s.slice(i + 1, j), j + 1]
  }
  return [s.slice(i + 1), s.length]
}

const script = (txt: string, table: Record<string, string>, mark: string) => {
  const t = convert(txt)
  return [...t].every((ch) => table[ch]) ? [...t].map((ch) => table[ch]).join('') : `${mark}(${t})`
}
const wrap = (t: string) => (/^[\w.,²³√π]+$/.test(t) ? t : `(${t})`)

function convert(src: string): string {
  let out = ''
  for (let i = 0; i < src.length; ) {
    const ch = src[i]
    if (ch === '\\') {
      const m = /^\\([A-Za-z]+|.)/.exec(src.slice(i))
      if (!m) { i++; continue }
      const cmd = m[1] ?? ''
      i += m[0].length
      if (cmd === 'frac' || cmd === 'dfrac' || cmd === 'tfrac') {
        const [a, j] = group(src, i); const [b, k] = group(src, j); i = k
        out += `${wrap(convert(a))}/${wrap(convert(b))}`
        // « \frac{1}{2}mv^2 » → « 1/2 mv² » (sinon on lirait « 1/2mv² »)
        if (/[A-Za-z\\]/.test(src[i] ?? '')) out += ' '
      } else if (cmd === 'sqrt') {
        let idx = ''
        if (src[i] === '[') { const e = src.indexOf(']', i); idx = src.slice(i + 1, e); i = e + 1 }
        const [a, j] = group(src, i); i = j
        out += `${idx === '3' ? '∛' : idx === '4' ? '∜' : idx ? `${idx}√` : '√'}${wrap(convert(a))}`
      } else if (cmd === 'vec' || cmd === 'overrightarrow') {
        const [a, j] = group(src, i); i = j
        out += `${convert(a)}⃗`
      } else if (cmd === 'overline' || cmd === 'bar') {
        const [a, j] = group(src, i); i = j
        out += [...convert(a)].map((c) => c + '̅').join('')
      } else if (cmd === 'mathbb') {
        const [a, j] = group(src, i); i = j
        out += SETS[a] ?? a
      } else if (['text', 'mathrm', 'textbf', 'mathbf', 'mathit', 'textit', 'operatorname', 'boxed', 'hat', 'widehat', 'tilde'].includes(cmd)) {
        const [a, j] = group(src, i); i = j
        out += cmd === 'text' || cmd === 'textbf' || cmd === 'textit' ? a : convert(a)
      } else if (cmd === 'left' || cmd === 'right' || cmd === 'big' || cmd === 'Big' || cmd === 'displaystyle') {
        if (src[i] === '\\' && src[i + 1] === '{') { out += cmd === 'left' ? '{' : '}'; i += 2 }
        else if (src[i] === '.') i++
      } else if (cmd === ',' || cmd === ';' || cmd === ':' || cmd === ' ' || cmd === '!') {
        out += cmd === '!' ? '' : ' '
      } else if (cmd === '{' || cmd === '}' || cmd === '%' || cmd === '$' || cmd === '_' || cmd === '&' || cmd === '#') {
        out += cmd
      } else if (cmd === '\\') {
        out += ' ; '
      } else {
        out += SYMBOLS[cmd] ?? cmd
      }
    } else if (ch === '^' || ch === '_') {
      const [a, j] = group(src, i + 1); i = j
      out += ch === '^' ? script(a, SUP, '^') : script(a, SUB, '_')
    } else if (ch === '{' || ch === '}') {
      i++
    } else if (ch === '&') {
      out += ' '; i++
    } else {
      out += ch; i++
    }
  }
  return out.replace(/\{,\}/g, ',').replace(/[ \t]{2,}/g, ' ')
}

/** Remplace chaque formule $…$ ou $$…$$ d'un texte par sa version Unicode. */
export function latexToText(s: string | null | undefined): string {
  if (!s || !s.includes('$')) return s ?? ''
  return s
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, x: string) => convert(x).trim())
    .replace(/\$([^$\n]+?)\$/g, (_, x: string) => convert(x).trim())
}

export const hasLatex = (s?: string | null) => !!s && /\$[^$\n]+\$|\$\$/.test(s)
