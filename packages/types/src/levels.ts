/**
 * Classes — source de vérité partagée (web, mobile, API).
 *
 * Ces valeurs reflètent exactement l'enum PostgreSQL `study_level`. Toute
 * nouvelle classe doit être ajoutée ICI **et** par une migration : les deux
 * listes doivent rester alignées, sinon une classe existante en base serait
 * rejetée par la validation applicative (ou l'inverse).
 *
 * Les classes sont rangées en trois cycles, chacun conclu par un examen :
 * primaire → CEPE (CM2), collège → BEPC (3e), lycée → BAC (Terminales, préfixe
 * `bac_`). Les classes intermédiaires (migration 063) sont fermées aux élèves
 * tant que l'administration ne les a pas ouvertes (`study_level_settings`).
 */

export const STUDY_LEVELS = [
  // Primaire
  'cp1', 'cp2', 'ce1', 'ce2', 'cm1', 'cepe',
  // Collège
  'sixieme', 'cinquieme', 'quatrieme', 'bepc',
  // Lycée — Seconde, Première, Terminale
  'seconde_a', 'seconde_c', 'seconde_t',
  'premiere_a', 'premiere_c', 'premiere_d', 'premiere_e', 'premiere_f3',
  'premiere_g2', 'premiere_g3', 'premiere_h', 'premiere_bg', 'premiere_r',
  'bac_a', 'bac_c', 'bac_d', 'bac_e', 'bac_f3', 'bac_g2', 'bac_g3', 'bac_h', 'bac_bg', 'bac_r',
] as const

export type StudyLevel = (typeof STUDY_LEVELS)[number]

export type Cycle = 'primaire' | 'college' | 'lycee'

export interface CycleMeta {
  label: string
  /** Examen qui conclut le cycle. */
  exam: string
}

export const CYCLES: Record<Cycle, CycleMeta> = {
  primaire: { label: 'Cycle primaire', exam: 'CEPE' },
  college:  { label: 'Collège',        exam: 'BEPC' },
  lycee:    { label: 'Lycée',          exam: 'BAC' },
}
export const CYCLE_ORDER: Cycle[] = ['primaire', 'college', 'lycee']

export interface LevelMeta {
  /** Intitulé court affiché partout (onglets, badges). */
  label: string
  /** Classe scolaire correspondante, pour lever l'ambiguïté. */
  classe: string
  /** Enseignement général ou technique. */
  track: 'generale' | 'technique'
  /** Cycle d'enseignement. */
  cycle: Cycle
  /** Année dans le lycée (Seconde, Première, Terminale) — sert au rangement. */
  grade?: 'seconde' | 'premiere' | 'terminale'
  /** Vrai pour la classe qui passe l'examen du cycle. */
  exam?: boolean
  /** Intitulé complet de la série, quand il y en a un. */
  description?: string
}

export const LEVEL_META: Record<StudyLevel, LevelMeta> = {
  cp1:  { label: 'CP1', classe: 'CP1', track: 'generale', cycle: 'primaire' },
  cp2:  { label: 'CP2', classe: 'CP2', track: 'generale', cycle: 'primaire' },
  ce1:  { label: 'CE1', classe: 'CE1', track: 'generale', cycle: 'primaire' },
  ce2:  { label: 'CE2', classe: 'CE2', track: 'generale', cycle: 'primaire' },
  cm1:  { label: 'CM1', classe: 'CM1', track: 'generale', cycle: 'primaire' },
  cepe: { label: 'CEPE', classe: 'CM2', track: 'generale', cycle: 'primaire', exam: true },

  sixieme:   { label: '6e', classe: '6e', track: 'generale', cycle: 'college' },
  cinquieme: { label: '5e', classe: '5e', track: 'generale', cycle: 'college' },
  quatrieme: { label: '4e', classe: '4e', track: 'generale', cycle: 'college' },
  bepc:      { label: 'BEPC', classe: '3e', track: 'generale', cycle: 'college', exam: true },

  seconde_a: { label: '2nde A', classe: 'Seconde A', track: 'generale',  cycle: 'lycee', grade: 'seconde', description: 'Littéraire' },
  seconde_c: { label: '2nde C', classe: 'Seconde C', track: 'generale',  cycle: 'lycee', grade: 'seconde', description: 'Scientifique' },
  seconde_t: { label: '2nde T', classe: 'Seconde technique', track: 'technique', cycle: 'lycee', grade: 'seconde', description: 'Enseignement technique' },

  premiere_a:  { label: '1ère A',  classe: 'Première A',  track: 'generale',  cycle: 'lycee', grade: 'premiere', description: 'Lettres et Sciences Humaines' },
  premiere_c:  { label: '1ère C',  classe: 'Première C',  track: 'generale',  cycle: 'lycee', grade: 'premiere', description: 'Mathématiques et Sciences Physiques' },
  premiere_d:  { label: '1ère D',  classe: 'Première D',  track: 'generale',  cycle: 'lycee', grade: 'premiere', description: 'Sciences de la Vie et de la Terre' },
  premiere_e:  { label: '1ère E',  classe: 'Première E',  track: 'technique', cycle: 'lycee', grade: 'premiere', description: 'Mathématiques et Technique' },
  premiere_f3: { label: '1ère F3', classe: 'Première F3', track: 'technique', cycle: 'lycee', grade: 'premiere', description: 'Génie Civil' },
  premiere_g2: { label: '1ère G2', classe: 'Première G2', track: 'technique', cycle: 'lycee', grade: 'premiere', description: 'Techniques Administratives' },
  premiere_g3: { label: '1ère G3', classe: 'Première G3', track: 'technique', cycle: 'lycee', grade: 'premiere', description: 'Techniques Commerciales' },
  premiere_h:  { label: '1ère H',  classe: 'Première H',  track: 'technique', cycle: 'lycee', grade: 'premiere', description: 'Techniques Informatiques' },
  premiere_bg: { label: '1ère BG', classe: 'Première BG', track: 'technique', cycle: 'lycee', grade: 'premiere' },
  premiere_r:  { label: '1ère R',  classe: 'Première R',  track: 'technique', cycle: 'lycee', grade: 'premiere' },

  bac_a:  { label: 'BAC A',  classe: 'Terminale A',  track: 'generale',  cycle: 'lycee', grade: 'terminale', exam: true, description: 'Lettres et Sciences Humaines' },
  bac_c:  { label: 'BAC C',  classe: 'Terminale C',  track: 'generale',  cycle: 'lycee', grade: 'terminale', exam: true, description: 'Mathématiques et Sciences Physiques' },
  bac_d:  { label: 'BAC D',  classe: 'Terminale D',  track: 'generale',  cycle: 'lycee', grade: 'terminale', exam: true, description: 'Sciences de la Vie et de la Terre' },
  bac_e:  { label: 'BAC E',  classe: 'Terminale E',  track: 'technique', cycle: 'lycee', grade: 'terminale', exam: true, description: 'Mathématiques et Technique' },
  bac_f3: { label: 'BAC F3', classe: 'Terminale F3', track: 'technique', cycle: 'lycee', grade: 'terminale', exam: true, description: 'Électrotechnique' },
  bac_g2: { label: 'BAC G2', classe: 'Terminale G2', track: 'technique', cycle: 'lycee', grade: 'terminale', exam: true, description: 'Techniques Quantitatives de Gestion' },
  bac_g3: { label: 'BAC G3', classe: 'Terminale G3', track: 'technique', cycle: 'lycee', grade: 'terminale', exam: true, description: 'Techniques Commerciales' },
  bac_h:  { label: 'BAC H',  classe: 'Terminale H',  track: 'technique', cycle: 'lycee', grade: 'terminale', exam: true, description: 'Techniques Informatiques' },
  bac_bg: { label: 'BAC BG', classe: 'Terminale BG', track: 'technique', cycle: 'lycee', grade: 'terminale', exam: true },
  bac_r:  { label: 'BAC R',  classe: 'Terminale R',  track: 'technique', cycle: 'lycee', grade: 'terminale', exam: true },
}

/**
 * Classes d'examen (CM2, 3e, Terminales) — les seules ouvertes aux élèves avant
 * la migration 064. Les écrans élèves qui listent les classes « en dur »
 * (annales, catalogue) s'en tiennent à elles.
 */
export const EXAM_LEVELS = STUDY_LEVELS.filter((l) => LEVEL_META[l].exam)

/** Classes d'un cycle, dans l'ordre scolaire. */
export function levelsOfCycle(cycle: Cycle): StudyLevel[] {
  return STUDY_LEVELS.filter((l) => LEVEL_META[l].cycle === cycle)
}

/** Cette chaîne correspond-elle à une classe connue ? */
export function isStudyLevel(value: string | null | undefined): value is StudyLevel {
  return typeof value === 'string' && (STUDY_LEVELS as readonly string[]).includes(value)
}

/** Intitulé court d'une classe, avec repli lisible sur une valeur inconnue. */
export function levelLabel(value: string): string {
  return isStudyLevel(value) ? LEVEL_META[value].label : value.replaceAll('_', ' ').toUpperCase()
}
