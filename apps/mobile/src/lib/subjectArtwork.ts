import type { ImageSourcePropType } from 'react-native'

/**
 * Image de fond par famille de matières (photos libres de droits, sans
 * personne) — remplace l'icône/emoji sur les cartes. Le mappage par mots-clés
 * est aligné sur celui du web (`apps/web/src/components/subject-artwork.tsx`) :
 * toute modification doit être reportée des deux côtés.
 *
 * Les images sont embarquées dans l'app (require statique obligatoire côté
 * React Native) ; elles sont donc disponibles hors-ligne, sans requête réseau.
 */

const ART = {
  sport: require('../../assets/subjects/sport.jpg'),
  mathematics: require('../../assets/subjects/mathematics.jpg'),
  sciences: require('../../assets/subjects/sciences.jpg'),
  life: require('../../assets/subjects/life-sciences.jpg'),
  literature: require('../../assets/subjects/literature.jpg'),
  civics: require('../../assets/subjects/civics.jpg'),
  humanities: require('../../assets/subjects/humanities.jpg'),
  languages: require('../../assets/subjects/languages.jpg'),
  economics: require('../../assets/subjects/economics.jpg'),
  technology: require('../../assets/subjects/technology.jpg'),
  general: require('../../assets/subjects/general.jpg'),
} as const

// L'ordre compte : la première famille dont un mot-clé est contenu dans le nom
// l'emporte (« EPS » avant « éducation civique », etc.).
const FAMILIES: Array<{ keywords: string[]; key: keyof typeof ART }> = [
  { keywords: ['sport', 'eps', 'éducation physique'], key: 'sport' },
  { keywords: ['math', 'calcul', 'numération', 'numérique', 'algèbre', 'géométrie', 'statistique', 'mesure', 'problème'], key: 'mathematics' },
  { keywords: ['physique', 'chimie', 'science'], key: 'sciences' },
  { keywords: ['svt', 'biolog', 'vie et de la terre', 'éveil', 'nature', 'anatomie'], key: 'life' },
  { keywords: ['français', 'litt', 'lecture', 'dictée', 'grammaire', 'conjugaison', 'orthographe', 'vocabulaire', 'expression'], key: 'literature' },
  { keywords: ['civique', 'citoyen', 'droit'], key: 'civics' },
  { keywords: ['histoire', 'géo', 'philo'], key: 'humanities' },
  { keywords: ['anglais', 'espagnol', 'latin', 'allemand', 'langue'], key: 'languages' },
  { keywords: ['économ', 'econom', 'gestion', 'comptab', 'production', 'entreprise', 'commerc', 'financ'], key: 'economics' },
  { keywords: ['info', 'technolog', 'informatique', 'électronique'], key: 'technology' },
]

export function subjectArtwork(name: string): ImageSourcePropType {
  const n = (name ?? '').toLocaleLowerCase('fr')
  const fam = FAMILIES.find(({ keywords }) => keywords.some((k) => n.includes(k)))
  return ART[fam?.key ?? 'general']
}
