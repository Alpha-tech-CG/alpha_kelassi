'use client'

import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
// katex.min.css est chargé globalement via globals.css

interface Props {
  /** Contenu markdown (peut contenir $...$ et $$...$$) */
  content: string
  /** Classes CSS supplémentaires sur le wrapper */
  className?: string
  /** true = prose complète (documents), false = prose compacte (chat) */
  prose?: boolean
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
export function MarkdownRenderer({ content, className = '', prose = false }: Props) {
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
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h2: ({ children, ...props }) => (
            <h2 {...props} data-section-kind={sectionKind(children)}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 {...props} data-section-kind={sectionKind(children)}>
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p {...props} data-paragraph-kind={paragraphKind(children)}>
              {children}
            </p>
          ),
          strong: ({ children, ...props }) => (
            <strong {...props} className="course-keyword">
              {children}
            </strong>
          ),
          // Un tableau large défile dans son propre cadre plutôt que d'élargir la page.
          table: ({ ...props }) => (
            <div className="my-4 overflow-x-auto">
              <table {...props} />
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
