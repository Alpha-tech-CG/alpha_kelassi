/**
 * Génère des flashcards à partir du texte d'une leçon, sans IA : aucun appel réseau,
 * aucun quota, même résultat à chaque fois. On lit la structure du cours :
 *   1. les encadrés (« > **📘 Définition — Vecteur** », théorème, formule, à retenir…) ;
 *   2. les paragraphes étiquetés (« **Définition :** … », « À retenir : … ») ;
 *   3. les listes « - **Terme** : explication » et les tableaux « terme | définition » ;
 *   4. les phrases de définition (« Un monomère est … », « On appelle X … ») ;
 *   5. les questions du cours suivies de leur réponse ;
 *   6. à défaut, l'essentiel de chaque partie (premier paragraphe sous un sous-titre).
 */

export interface ExtractedCard {
  front: string
  back: string
}

type Kind = 'definition' | 'theorem' | 'formula' | 'remember' | 'method' | 'warning' | 'section'

interface Candidate extends ExtractedCard {
  kind: Kind
  order: number
}

const PRIORITY: Record<Kind, number> = {
  definition: 0,
  theorem: 1,
  formula: 1,
  remember: 2,
  method: 3,
  warning: 3,
  section: 4,
}

const EMOJI_KIND: Array<[RegExp, Kind | null]> = [
  [/📘/u, 'definition'],
  [/🏛/u, 'theorem'],
  [/📐/u, 'formula'],
  [/🎯/u, 'remember'],
  [/🧭/u, 'method'],
  [/⚠/u, 'warning'],
  [/✏|💡/u, null], // exemples et « comprendre » : pas une carte
]

// \b ne marche pas après une lettre accentuée : on teste « pas de lettre derrière ».
const END = '(?![\\p{L}\\p{N}])'
const LABEL_KIND: Array<[RegExp, Kind]> = [
  [new RegExp(`^d[ée]finitions?${END}`, 'iu'), 'definition'],
  [new RegExp(`^(th[ée]or[èe]mes?|propri[ée]t[ée]s?|lois?|principes?|r[èe]gles?)${END}`, 'iu'), 'theorem'],
  [new RegExp(`^(formules?|relations?)${END}`, 'iu'), 'formula'],
  [new RegExp(`^((à|a) retenir|je retiens|l['’]essentiel|retenons|conclusion)${END}`, 'iu'), 'remember'],
  [new RegExp(`^(m[ée]thodes?|savoir[- ]faire)${END}`, 'iu'), 'method'],
  [new RegExp(`^(attention|pi[èe]ges?( à éviter)?|erreurs?( à éviter)?)${END}`, 'iu'), 'warning'],
]

// Parties qui ne font pas de bonnes cartes.
const SKIP_HEADING = new RegExp(
  `^(exercices?|exemples?|applications?|solutions?|corrig[ée]s?|corrections?|activit[ée]s?|r[ée]ponses?|objectifs?|au programme|introduction|sommaire|plan|consignes?|questions?|travaux|tests?|[ée]valuations?|bilan|pour aller plus loin|situations?|r[ée]solutions?|observe|m[ée]morisation|d[ée]monstrations?|entra[îi]nement|cours de math[ée]matiques)${END}`,
  'iu'
)
// Sous-titres trop vagues pour faire une question seuls (« Règle », « Remarque »…).
const GENERIC_HEADING = new RegExp(
  `^(r[èe]gles?|remarques?|propri[ée]t[ée]s?|d[ée]finitions?|pi[èe]ges?( à éviter)?|attention|(à|a) retenir|je retiens|retenons|l['’]essentiel|notions?|vocabulaire|rappels?|synth[èe]se|r[ée]sum[ée]|conclusion|important|notes?|nb)${END}`,
  'iu'
)

const MAX_BACK = 420

function cleanInline(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\{\{img:[^}]*\}\}/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1$2')
    .replace(/[ \t]+/g, ' ')
    .trim()
}

/** « I- 1.2) Monomère : » → « Monomère » */
function cleanHeading(text: string): string {
  let t = cleanInline(text)
    .replace(/^[\p{Extended_Pictographic}️\s]+/u, '')
    .replace(/^((chapitre|chapter|section|partie)\s+[\dIVX]+\s*[-–—:.]?\s*)/i, '')
  for (let k = 0; k < 2; k++) t = t.replace(/^([IVX]{1,5}|\d{1,2}(\.\d{1,2})*|[A-Ha-h])\s*[-–.)°/]+\s*/, '')
  t = t.replace(/[\s*]*:\s*$/, '').replace(/\*+$/, '').trim()
  return t || cleanInline(text).replace(/\s*:\s*$/, '')
}

/** Coupe proprement un verso trop long : fin de phrase, jamais au milieu d'une formule. */
function clip(text: string, max = MAX_BACK): string {
  const t = text.trim()
  if (t.length <= max) return t
  const ends: number[] = []
  let dollars = 0
  for (let i = 0; i < t.length && i < max; i++) {
    if (t[i] === '$') dollars++
    if (dollars % 2 === 0 && /[.;!?\n]/.test(t[i]!) && (t[i + 1] === ' ' || t[i + 1] === '\n' || t[i] === '\n'))
      ends.push(i + 1)
  }
  const cut = ends.filter((e) => e >= max * 0.4).pop()
  if (cut) return t.slice(0, cut).trim()
  // Pas de fin de phrase : on coupe à un espace hors formule.
  dollars = 0
  let lastSpace = -1
  for (let i = 0; i < max; i++) {
    if (t[i] === '$') dollars++
    if (t[i] === ' ' && dollars % 2 === 0) lastSpace = i
  }
  return lastSpace > 0 ? `${t.slice(0, lastSpace).trim()}…` : t.slice(0, max)
}

function lowerFirst(s: string): string {
  return /^[A-ZÀ-Ý][a-zà-ÿ]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s
}
function upperFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** « Que faut-il retenir : X ? » — ou la question elle-même si X en est déjà une. */
function retain(subject: string): string {
  const s = subject.trim()
  return /\?$/.test(s) ? upperFirst(s) : `Que faut-il retenir : ${lowerFirst(s)} ?`
}

function frontFor(kind: Kind, title: string, topic: string): string {
  const subject = title || topic
  switch (kind) {
    case 'definition': {
      const term = subject.replace(/^d[ée]finitions?\s*(?:[-–—:]\s*|de |du |des |d['’])?/i, '').trim()
      return `Définis : ${term && !GENERIC_HEADING.test(term) ? term : topic}`
    }
    case 'theorem': {
      const t = subject.replace(/^(th[ée]or[èe]me|propri[ée]t[ée]|r[èe]gle|loi|principe)\s*[-–—:]?\s*/i, '').trim()
      return `Énonce ${/^(r[èe]gle)/i.test(subject) ? 'la règle' : 'la propriété'} : ${t && !GENERIC_HEADING.test(t) ? t : topic}`
    }
    case 'formula': {
      const t = subject.replace(/^formules?\s*[-–—:]?\s*/i, '').trim()
      return `Quelle est la formule : ${lowerFirst(t && !GENERIC_HEADING.test(t) ? t : topic)} ?`
    }
    case 'remember':
      return retain(topic || subject)
    case 'method': {
      const t = subject.replace(/^m[ée]thode\s*[-–—:]?\s*/i, '').trim()
      return `Quelle méthode : ${lowerFirst(t && !GENERIC_HEADING.test(t) ? t : topic)} ?`
    }
    case 'warning':
      return `Quel piège éviter : ${lowerFirst(topic || subject)} ?`
    default:
      return retain(subject)
  }
}

// « Un monomère est un composé… », « La photosynthèse est … »
const DEF_SENTENCE =
  /^(?:(une|un|les|le|la)\s+|(l['’])\s*)([^.,;:!?$()«»]{2,45}?)\s+(?:est|sont|désigne|désignent|représente|correspond)\s+(?:une?\b|les?\b|la\b|l['’]|des\b|du\b|ce\b|cette\b|ces\b|celui|celle|tout|chaque|appel|défini|constitu|compos|form[ée]|obtenu|caractéris|issu|situ|égal|à\b|au\b|aux\b)/i
// « On appelle X … »
const CALLED = /^on (?:appelle|nomme|désigne par)\s+(.{2,60}?)\s*(?:,|:|\s(?:le|la|les|l['’]|un|une|tout|toute)\s)/i
const BAD_TERM = /^(il|elle|ils|elles|ce|cela|ceci|on|qui|cette|cet|exercices?|corrig|bouton|page|réponse|phrase|texte)\b/i

function definitionFront(article: string, term: string): string {
  const a = article.toLowerCase().replace('’', "'")
  if (a === 'les') return `Que sont les ${term} ?`
  if (a === 'un' || a === 'une') return `Qu’est-ce qu’${a} ${term} ?`
  return `Qu’est-ce que ${a === "l'" ? 'l’' : `${a} `}${term} ?`
}

const SPECIAL = /^(#|>|\||[-*+•]\s|\d+[.)]\s|!\[|<|\$\$|```|~~~|\{\{img)/

/** Recolle les paragraphes coupés en plusieurs lignes (texte copié d'un PDF). */
function joinWrappedLines(src: string[]): string[] {
  const out: string[] = []
  let fence = false
  for (const raw of src) {
    const t = raw.trim()
    // Blocs de code et formules sur plusieurs lignes : on n'y recolle rien.
    if (/^(```|~~~)/.test(t) || t === '$$') fence = !fence
    const prev = out[out.length - 1]?.trim() ?? ''
    if (
      !fence && t && prev &&
      !SPECIAL.test(t) && !SPECIAL.test(prev) &&
      !/[.!?:;]$|\$\$$/.test(prev) &&
      prev.length >= 50 &&
      /^[a-zà-ÿ(«"“0-9]/.test(t)
    ) {
      out[out.length - 1] = `${prev} ${t}`
      continue
    }
    out.push(raw)
  }
  return out
}

/** @param count nombre de cartes voulu (les meilleures, remises dans l'ordre du cours) */
export function extractFlashcards(markdown: string, count = 10, lessonTitle = ''): ExtractedCard[] {
  const lines = joinWrappedLines(markdown.replace(/\r/g, '').split('\n'))
  const cands: Candidate[] = []
  const stack: string[] = [] // sous-titres par niveau
  let heading = ''
  let headingKept = true
  let order = 0
  let fence = false
  const usedHeading = new Set<string>()

  // Sujet d'une carte : le sous-titre, ou son parent s'il est trop vague (« Règle »).
  const topic = () => {
    const chain = stack.filter(Boolean)
    for (let k = chain.length - 1; k >= 0; k--) if (!GENERIC_HEADING.test(chain[k]!)) return chain[k]!
    return cleanHeading(lessonTitle) || heading
  }

  const push = (kind: Kind, front: string, back: string) => {
    const b = upperFirst(clip(back))
    const f = front.replace(/\s+/g, ' ').replace(/\s*\?\s*\?$/, ' ?').trim()
    if (f.length < 6 || f.length > 170 || b.length < 12) return
    if (/:\s*(ce sont|c['’]est|il|elle|ils|elles)\s/i.test(f)) return
    cands.push({ kind, front: f, back: b, order: order++ })
  }

  // Une phrase qui annonce une suite (« … deux voies : ») emporte les lignes qui suivent.
  const withFollowing = (text: string, from: number): [string, number] => {
    let body = text
    let j = from + 1
    if (!/:\s*$/.test(text) && text.length >= 60) return [body, from]
    while (j < lines.length && body.length < MAX_BACK) {
      const t = lines[j]!.trim()
      if (!t) { if (body !== text) break; j++; continue }
      if (/^(#|>|\||!\[|<)/.test(t)) break
      body += `\n${cleanInline(t.replace(/^[-*+]\s+/, '• '))}`
      j++
    }
    return [body, j - 1]
  }

  // stack[n] = sous-titre de niveau n+1 en cours (le dernier est `heading`).
  // Une partie est ignorée si elle ou l'une de ses parties parentes (hors titre de niveau 1)
  // est une partie d'exercices, d'exemples…
  let realLevel = 1
  const setHeading = (text: string, level: number) => {
    heading = cleanHeading(text)
    stack.length = level - 1
    stack[level - 1] = heading
    headingKept = !stack.some((s, n) => n >= 1 && s && SKIP_HEADING.test(s))
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim()
    if (/^(```|~~~)/.test(line)) { fence = !fence; continue }
    if (fence || !line) continue

    // Sous-titre
    const h = /^(#{1,4})\s+(.+)$/.exec(line)
    if (h) {
      realLevel = h[1]!.length
      setHeading(h[2]!, realLevel)
      continue
    }

    // Encadré : « > **📘 Titre** » puis le corps de la citation.
    if (line.startsWith('>')) {
      const block: string[] = []
      let j = i
      while (j < lines.length && lines[j]!.trim().startsWith('>')) {
        block.push(lines[j]!.trim().replace(/^>\s?/, ''))
        j++
      }
      i = j - 1
      const head = /^\*\*(.+?)\*\*\s*:?\s*(.*)$/.exec(block[0] ?? '')
      if (!head || !headingKept) continue
      let kind: Kind | null | undefined
      for (const [re, k] of EMOJI_KIND) if (re.test(head[1]!)) { kind = k; break }
      const title = cleanHeading(head[1]!)
      if (kind === undefined) kind = LABEL_KIND.find(([re]) => re.test(title))?.[1]
      if (!kind) continue
      const body = [head[2] ?? '', ...block.slice(1)]
        .map((l) => l.replace(/^[-*+]\s+/, '• '))
        .filter((l) => l.trim())
        .join('\n')
      push(kind, frontFor(kind, title, topic()), cleanInline(body))
      continue
    }

    // Tableau à deux colonnes « terme | définition » : une carte par ligne.
    if (line.startsWith('|')) {
      const rows: string[][] = []
      let j = i
      while (j < lines.length && lines[j]!.trim().startsWith('|')) {
        const cells = lines[j]!.trim().replace(/^\||\|$/g, '').split('|').map((c) => cleanInline(c))
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells)
        j++
      }
      i = j - 1
      const [headRow, ...body] = rows
      if (headingKept && headRow?.length === 2 && body.length >= 2 && body.length <= 12) {
        const isDef = /d[ée]finition|signification|sens|r[ôo]le|explication|caract[ée]ristiques?|description/i.test(headRow[1]!)
        for (const [a, b] of body) {
          if (!a || !b || a.length > 60 || /\$/.test(a)) continue
          push('definition', isDef ? `Définis : ${a}` : `${a} — ${lowerFirst(headRow[1]!)} ?`, b)
        }
      }
      continue
    }

    // Liste « - **Terme** : explication »
    const item = /^(?:[-*+•]|\d+[.)])\s+\*\*([^*]{2,60})\*\*\s*(?:\([^)]*\)\s*)?[:–—-]\s*(.{8,})$/.exec(line)
    if (item) {
      const term = cleanInline(item[1]!).replace(/\s*:$/, '')
      if (headingKept && !/\$/.test(term)) push('definition', `Définis : ${term}`, cleanInline(item[2]!))
      continue
    }

    if (/^(!\[|<|\$\$|\{\{img)/.test(line)) continue

    // Paragraphe étiqueté : « **Définition :** texte » ou « Définition : texte »
    const label =
      /^\*\*([^*]{3,60}?)\s*:?\s*\*\*\s*:?\s*(.*)$/.exec(line) ??
      /^([A-Za-zÀ-ÿ' ]{3,30})\s*:\s+(.{12,})$/.exec(line)
    if (label) {
      const lab = cleanHeading(label[1]!)
      const found = LABEL_KIND.find(([re]) => re.test(lab))
      if (found && headingKept) {
        let body = label[2]!.trim()
        let j = i + 1
        while (j < lines.length && body.length < MAX_BACK) {
          const t = lines[j]!.trim()
          if (!t) { if (body) break; j++; continue }
          if (/^(#|>|\*\*[^*]+\*\*\s*:?\s*$)/.test(t)) break
          body += `\n${t.replace(/^[-*+]\s+/, '• ')}`
          j++
        }
        i = j - 1
        const title = lab.replace(found[0], '').replace(/^\s*[-–—:*]\s*/, '').trim()
        push(found[1], frontFor(found[1], title, topic()), cleanInline(body))
        continue
      }
    }

    if (/^[-*+]\s|^\d+[.)]\s|^\|/.test(line)) continue
    const text = cleanInline(line).replace(/^[(«"“\s]+/, '').replace(/[)»"”]+$/, '')

    // Question seule sur sa ligne (cours rédigés en questions) : la réponse suit.
    if (/\?$/.test(text) && text.length <= 140 && !/\$/.test(text)) {
      const answer: string[] = []
      let j = i + 1
      while (j < lines.length && answer.join(' ').length < MAX_BACK) {
        const t = lines[j]!.trim()
        if (/^#/.test(t) || (answer.length && !t)) break
        if (t && !/^(!\[|\||<)/.test(t)) answer.push(cleanInline(t.replace(/^[-*+]\s+/, '• ')))
        j++
      }
      const q = cleanHeading(text)
      if (headingKept && answer.join(' ').length >= 30) {
        push('remember', upperFirst(q), answer.join('\n'))
        setHeading(q, Math.max(realLevel + 1, 2))
        usedHeading.add(q)
        i = j - 1
        continue
      }
    }

    // Ligne courte isolée suivie d'un paragraphe : un sous-titre non balisé (« a/ - Sels acides »).
    if (
      text.length <= 70 &&
      !/[.:;,!?]$|\$| : /.test(text) &&
      (i === 0 || !lines[i - 1]!.trim()) &&
      /^[A-ZÀ-Ýa-h0-9IVX]/.test(text)
    ) {
      let j = i + 1
      while (j < lines.length && !lines[j]!.trim()) j++
      const next = cleanInline(lines[j] ?? '')
      if (next.length >= 40 && !/^(#|\||>|[-*+]\s)/.test((lines[j] ?? '').trim())) {
        setHeading(text, Math.max(realLevel + 1, 2))
        continue
      }
    }

    if (!headingKept || text.length < 25) continue

    // Phrase de définition
    const called = CALLED.exec(text)
    const def = DEF_SENTENCE.exec(text)
    if (called && called[1]!.split(/\s+/).length <= 6 && !/\$/.test(called[1]!)) {
      const [back, end] = withFollowing(text, i)
      i = end
      push('definition', `Qu’appelle-t-on ${cleanInline(called[1]!)} ?`, back)
      usedHeading.add(heading)
      continue
    }
    if (def && def[3]!.split(/\s+/).length <= 6 && !BAD_TERM.test(def[3]!) && !/\$/.test(def[3]!)) {
      const [back, end] = withFollowing(text, i)
      i = end
      push('definition', definitionFront((def[1] ?? def[2])!, def[3]!.trim()), back)
      usedHeading.add(heading)
      continue
    }

    // L'essentiel d'une partie : premier vrai paragraphe sous le sous-titre.
    if (heading && !usedHeading.has(heading) && text.length >= 40 && heading.length <= 90) {
      usedHeading.add(heading)
      const [back, end] = withFollowing(text, i)
      i = end
      const t = topic()
      push('section', retain(GENERIC_HEADING.test(heading) && t !== heading ? `${heading} — ${t}` : heading), back)
    }
  }

  // Dédoublonnage, puis les meilleures cartes, remises dans l'ordre du cours.
  const seen = new Set<string>()
  const unique = cands.filter((c) => {
    const k = c.front.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
  return unique
    .sort((a, b) => PRIORITY[a.kind] - PRIORITY[b.kind] || a.order - b.order)
    .slice(0, count)
    .sort((a, b) => a.order - b.order)
    .map(({ front, back }) => ({ front, back }))
}
