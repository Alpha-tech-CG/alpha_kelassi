import type { CSSProperties, ReactNode } from 'react'

// Une image par famille de matières (photos libres de droits, sans personne).
// L'ordre compte : la première famille dont un mot-clé est contenu dans le nom
// l'emporte. « EPS / éducation physique » est testé avant « éducation civique »
// pour éviter que « éducation » ne parte vers le mauvais visuel.
const ARTWORKS: Array<{ keywords: string[]; src: string }> = [
  { keywords: ['sport', 'eps', 'éducation physique'], src: '/subjects/sport.jpg' },
  {
    keywords: ['math', 'calcul', 'numération', 'numérique', 'algèbre', 'géométrie', 'statistique', 'mesure', 'problème'],
    src: '/subjects/mathematics.jpg',
  },
  { keywords: ['physique', 'chimie', 'science'], src: '/subjects/sciences.jpg' },
  {
    keywords: ['svt', 'biolog', 'vie et de la terre', 'éveil', 'nature', 'anatomie'],
    src: '/subjects/life-sciences.jpg',
  },
  {
    keywords: [
      'français',
      'litt',
      'lecture',
      'dictée',
      'grammaire',
      'conjugaison',
      'orthographe',
      'vocabulaire',
      'expression',
    ],
    src: '/subjects/literature.jpg',
  },
  { keywords: ['civique', 'citoyen', 'droit'], src: '/subjects/civics.jpg' },
  { keywords: ['histoire', 'géo', 'philo'], src: '/subjects/humanities.jpg' },
  { keywords: ['anglais', 'espagnol', 'latin', 'allemand', 'langue'], src: '/subjects/languages.jpg' },
  {
    keywords: ['économ', 'econom', 'gestion', 'comptab', 'production', 'entreprise', 'commerc', 'financ'],
    src: '/subjects/economics.jpg',
  },
  {
    keywords: ['info', 'technolog', 'informatique', 'électronique'],
    src: '/subjects/technology.jpg',
  },
]

export function getSubjectArtwork(name: string): string {
  const normalized = name.toLocaleLowerCase('fr')
  return (
    ARTWORKS.find(({ keywords }) => keywords.some((keyword) => normalized.includes(keyword)))
      ?.src ?? '/subjects/general.jpg'
  )
}

export function SubjectArtwork({
  name,
  className,
  children,
}: {
  name: string
  className: string
  children?: ReactNode
}) {
  const style: CSSProperties = { backgroundImage: `url("${getSubjectArtwork(name)}")` }

  return (
    <div
      className={`relative isolate overflow-hidden bg-cover bg-center ${className}`}
      style={style}
      aria-hidden={children ? undefined : true}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />
      {children ? (
        <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">{children}</div>
      ) : null}
    </div>
  )
}
