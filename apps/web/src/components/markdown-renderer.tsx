'use client'

import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
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
    <div className={`${proseClasses} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
