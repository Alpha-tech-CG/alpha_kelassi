/**
 * Classes d'examen — source de vérité partagée (web, mobile, API).
 *
 * Ces valeurs reflètent exactement l'enum PostgreSQL `study_level`. Toute
 * nouvelle classe doit être ajoutée ICI **et** par une migration : les deux
 * listes doivent rester alignées, sinon une classe existante en base serait
 * rejetée par la validation applicative (ou l'inverse).
 *
 * Le préfixe `bac_` marque les séries du baccalauréat (général comme
 * technique) ; `cepe` et `bepc` sont des examens distincts.
 */

export const STUDY_LEVELS = [
  'cepe',
  'bepc',
  'bac_bg',
  'bac_a',
  'bac_c',
  'bac_d',
  'bac_e',
  'bac_f3',
  'bac_g2',
  'bac_g3',
  'bac_h',
  'bac_r',
] as const

export type StudyLevel = (typeof STUDY_LEVELS)[number]

export interface LevelMeta {
  /** Intitulé court affiché partout (onglets, badges). */
  label: string
  /** Classe scolaire correspondante, pour lever l'ambiguïté. */
  classe: string
  /** Enseignement général ou technique. */
  track: 'generale' | 'technique'
  /** Intitulé complet de la série, quand il y en a un. */
  description?: string
}

export const LEVEL_META: Record<StudyLevel, LevelMeta> = {
  cepe:   { label: 'CEPE',   classe: 'CM2',         track: 'generale' },
  bepc:   { label: 'BEPC',   classe: '3e',          track: 'generale' },
  bac_a:  { label: 'BAC A',  classe: 'Terminale A', track: 'generale',  description: 'Lettres et Sciences Humaines' },
  bac_c:  { label: 'BAC C',  classe: 'Terminale C', track: 'generale',  description: 'Mathématiques et Sciences Physiques' },
  bac_d:  { label: 'BAC D',  classe: 'Terminale D', track: 'generale',  description: 'Sciences de la Vie et de la Terre' },
  bac_e:  { label: 'BAC E',  classe: 'Terminale E', track: 'technique', description: 'Mathématiques et Technique' },
  bac_f3: { label: 'BAC F3', classe: 'Terminale F3', track: 'technique', description: 'Électrotechnique' },
  bac_g2: { label: 'BAC G2', classe: 'Terminale G2', track: 'technique', description: 'Techniques Quantitatives de Gestion' },
  bac_g3: { label: 'BAC G3', classe: 'Terminale G3', track: 'technique', description: 'Techniques Commerciales' },
  bac_h:  { label: 'BAC H',  classe: 'Terminale H', track: 'technique', description: 'Techniques Informatiques' },
  bac_bg: { label: 'BAC BG', classe: 'Terminale BG', track: 'technique' },
  bac_r:  { label: 'BAC R',  classe: 'Terminale R', track: 'technique' },
}

/** Cette chaîne correspond-elle à une classe connue ? */
export function isStudyLevel(value: string | null | undefined): value is StudyLevel {
  return typeof value === 'string' && (STUDY_LEVELS as readonly string[]).includes(value)
}

/** Intitulé court d'une classe, avec repli lisible sur une valeur inconnue. */
export function levelLabel(value: string): string {
  return isStudyLevel(value) ? LEVEL_META[value].label : value.replaceAll('_', ' ').toUpperCase()
}
