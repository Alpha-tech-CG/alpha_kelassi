'use client'

import { useRef, type ReactNode } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import { calloutKind, labelKind } from './callouts'
// katex.min.css est chargé globalement via globals.css

interface Props {
  /** Contenu markdown (peut contenir $...$ et $$...$$) */
  content: string
  /** Classes CSS supplémentaires sur le wrapper */
  className?: string
  /** true = prose complète (documents), false = prose compacte (chat) */
  prose?: boolean
  /**
   * Découpe le document en parties repliables d'après ses sous-titres : on arrive sur la
   * liste des sous-titres et on ouvre celui qu'on veut lire. Par défaut : comme `prose`.
   */
  sections?: boolean
}

/** Nœud HAST minimal (react-markdown passe le nœud source à chaque composant). */
interface HastNode {
  type: string
  tagName?: string
  value?: string
  children?: HastNode[]
}

function hastText(node: HastNode | undefined): string {
  if (!node) return ''
  if (node.type === 'text') return node.value ?? ''
  return (node.children ?? []).map(hastText).join('')
}

/** Type d'encadré d'un paragraphe qui commence par un intitulé en gras (« **Remarque :** … »). */
function labelledKind(node: HastNode | undefined) {
  const first = node?.children?.find((c) => c.type !== 'text' || (c.value ?? '').trim() !== '')
  if (first?.type !== 'element' || first.tagName !== 'strong') return undefined
  return labelKind(hastText(first).trim())
}

interface Section { title: string; body: string }

/**
 * Découpe en parties sur le plus haut niveau de titre présent au moins deux fois (« # », « ## » ou « ### »).
 * Le texte avant le premier titre (titre du cours, objectifs) reste toujours visible.
 * Renvoie `null` s'il n'y a pas au moins deux parties.
 */
function splitSections(md: string): { intro: string; sections: Section[] } | null {
  // Certains cours écrivent leurs grandes parties en gras (« **II) APPLICATION AFFINE** ») :
  // on les traite comme des titres, au même niveau que la partie « I) » quand elle en est un.
  const romanHead = /^(#{1,4})\s+[IVX]+[).]\s/m.exec(md)
  const romanLevel = romanHead ? romanHead[1]!.length : 2
  const lines = md
    .split('\n')
    .map((l) => l.replace(/^\*\*([IVX]+[).]\s[^*]+?)\*\*\s*$/, (_, t: string) => `${'#'.repeat(romanLevel)} ${t}`))
  const inFence: boolean[] = []
  let fence = false
  for (const l of lines) {
    if (/^\s*(```|~~~)/.test(l)) fence = !fence
    inFence.push(fence)
  }
  const headLevel = (l: string, i: number) => (inFence[i] ? 0 : (/^(#{1,3})\s/.exec(l)?.[1]?.length ?? 0))
  // Le niveau de titre le plus haut qui revient au moins deux fois (un seul « # » = titre du cours).
  const level = [1, 2, 3].find((n) => lines.filter((l, i) => headLevel(l, i) === n).length >= 2) ?? 0
  if (!level) return null
  const isHead = (l: string, i: number) => {
    const h = headLevel(l, i)
    return h > 0 && h <= level && !(h === 1 && level > 1)
  }

  const intro: string[] = []
  const sections: Section[] = []
  lines.forEach((l, i) => {
    if (isHead(l, i)) sections.push({ title: l.replace(/^#+\s+/, '').replace(/\s+#+\s*$/, ''), body: '' })
    else if (sections.length) sections[sections.length - 1]!.body += l + '\n'
    else intro.push(l)
  })
  return sections.length >= 2 ? { intro: intro.join('\n'), sections } : null
}

function textContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textContent).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return textContent((node.props as { children?: ReactNode }).children as ReactNode)
  }
  return ''
}

function sectionKind(children: ReactNode) {
  const title = textContent(children).trim().toLocaleLowerCase('fr')
  if (/^introduction\b/.test(title)) return 'introduction'
  if (/notions?\s+cl[eé]s|d[eé]finitions?\s+des?\s+notions/.test(title)) return 'keywords'
  if (/^d[eé]veloppement\b/.test(title)) return 'development'
  if (/^conclusion\b/.test(title)) return 'conclusion'
  return undefined
}

function paragraphKind(children: ReactNode) {
  const text = textContent(children).trim()
  if (/^probl[eé]matique\s*:/i.test(text)) return 'question'
  if (
    /^(?:objectif(?:s)? p[eé]dagogiques?|[àa] retenir|exemple(?: concret)?|d[eé]finition(?:s)?)\s*:/i.test(
      text
    )
  ) {
    return 'note'
  }
  return undefined
}

/**
 * Composant universel de rendu Markdown + LaTeX.
 *
 * Gère automatiquement :
 *  - Formules inline   : $f(x) = ax + b$
 *  - Formules en bloc  : $$\int_0^1 x^2\,dx = \frac{1}{3}$$
 *  - Markdown standard : **gras**, *italique*, listes, titres…
 *
 * Utilisé dans :
 *  - Le tuteur IA (réponses de Kelassi)
 *  - DocumentReader (cours / examens texte)
 */
/**
 * Une ligne qui ne contient qu'une formule « $$…$$ » (éventuellement dans un encadré « > ») est
 * une formule à afficher en bloc, centrée. remark-math la prendrait pour une formule dans le
 * texte : on la remet en bloc « $$ / formule / $$ ». (L'appli mobile fait déjà ce choix.)
 */
function displayMathLines(md: string): string {
  return md.replace(/^((?:> ?)*)\$\$([^\n$]+)\$\$[ \t]*$/gm, (_, q: string, f: string) => `${q}$$\n${q}${f.trim()}\n${q}$$`)
}

const COMPONENTS: Components = {
  h2: ({ children, node: _node, ...props }) => (
    <h2 {...props} data-section-kind={sectionKind(children)}>
      {children}
    </h2>
  ),
  h3: ({ children, node: _node, ...props }) => (
    <h3 {...props} data-section-kind={sectionKind(children)}>
      {children}
    </h3>
  ),
  // « **💡 Je retiens :** … », « **Remarque :** … » : le paragraphe devient un encadré (cf. callouts.ts).
  p: ({ children, node, ...props }) => (
    <p {...props} data-paragraph-kind={paragraphKind(children)} data-callout={labelledKind(node as HastNode)}>
      {children}
    </p>
  ),
  strong: ({ children, node: _node, ...props }) => (
    <strong {...props} className="course-keyword">
      {children}
    </strong>
  ),
  // Encadrés de cours (📘 définition, 🏛️ théorème, 📐 formule…) : cf. callouts.ts.
  blockquote: ({ children, node, ...props }) => {
    const firstP = (node as HastNode | undefined)?.children?.find((c) => c.type === 'element')
    return (
      <blockquote {...props} data-callout={calloutKind(textContent(children)) ?? labelledKind(firstP)}>
        {children}
      </blockquote>
    )
  },
  // Un tableau large défile dans son propre cadre plutôt que d'élargir la page.
  table: ({ node: _node, ...props }) => (
    <div className="my-4 overflow-x-auto">
      <table {...props} />
    </div>
  ),
}

function Markdown({ md }: { md: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]} components={COMPONENTS}>
      {displayMathLines(md)}
    </ReactMarkdown>
  )
}

/** Titre d'une partie (peut contenir du gras ou une formule) rendu en ligne. */
function InlineMarkdown({ md }: { md: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{ p: ({ children }) => <>{children}</> }}
    >
      {/* « 6. Titre » ou « - Titre » ne doivent pas devenir une liste. */}
      {md.replace(/^(\d+)([.)])\s/, '$1\\$2 ').replace(/^([-+*])\s/, '\\$1 ')}
    </ReactMarkdown>
  )
}

/** Sommaire : chaque sous-titre est une ligne qu'on ouvre pour lire la partie. */
function SectionList({ sections }: { sections: Section[] }) {
  const listRef = useRef<HTMLDivElement>(null)
  const setAll = (open: boolean) =>
    listRef.current?.querySelectorAll('details').forEach((d) => { d.open = open })

  return (
    <div ref={listRef} className="md-sections not-prose">
      <div className="md-sections-head">
        <span>{sections.length} parties · touche un titre pour le lire</span>
        <span className="md-sections-actions">
          <button type="button" onClick={() => setAll(true)}>Tout ouvrir</button>
          <button type="button" onClick={() => setAll(false)}>Tout fermer</button>
        </span>
      </div>
      {sections.map((s, i) => (
        <details key={i} className="md-section">
          <summary>
            <span className="md-section-title"><InlineMarkdown md={s.title} /></span>
          </summary>
          <div className="md-section-body">
            <Markdown md={s.body} />
          </div>
        </details>
      ))}
    </div>
  )
}

export function MarkdownRenderer({ content, className = '', prose = false, sections }: Props) {
  const parts = (sections ?? prose) ? splitSections(content) : null
  const proseClasses = prose
    ? `prose prose-gray prose-sm sm:prose-base max-w-none
       prose-headings:font-bold prose-headings:text-gray-900
       prose-h2:text-xl prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-2 prose-h2:mt-8
       prose-h3:text-base prose-h3:text-blue-800
       prose-p:leading-7 prose-p:text-gray-700
       prose-strong:text-gray-900
       prose-blockquote:border-blue-400 prose-blockquote:bg-blue-50 prose-blockquote:rounded-r-lg prose-blockquote:py-1
       prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded
       prose-li:text-gray-700`
    : `prose prose-sm max-w-none
       prose-p:my-1 prose-p:leading-relaxed
       prose-headings:font-semibold prose-headings:my-2
       prose-strong:font-semibold
       prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded prose-code:text-xs
       prose-li:my-0.5
       prose-ul:my-1 prose-ol:my-1`

  return (
    // `md-content` porte le style des tableaux et des schémas (cf. globals.css) :
    // le plugin @tailwindcss/typography n'est pas installé, les classes `prose-*`
    // ci-dessus n'ont donc aucun effet tant qu'il ne l'est pas.
    <div className={`md-content ${proseClasses} ${className}`}>
      {parts ? (
        <>
          {parts.intro.trim() && <Markdown md={parts.intro} />}
          <SectionList sections={parts.sections} />
        </>
      ) : (
        <Markdown md={content} />
      )}
    </div>
  )
}
