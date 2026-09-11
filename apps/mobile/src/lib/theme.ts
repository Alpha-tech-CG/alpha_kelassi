// Système de design « L'Élan National » — tokens exacts des maquettes Stitch.
// Thème vert Congo, cartes blanches, badges de niveau, accents par matière.

// Palette EXACTE du logo Cognix (bleu / blanc, fond navy).
export const colors = {
  primary: '#1E74E8',            // bleu Cognix (C du logo)
  primaryContainer: '#145CC0',   // bleu foncé
  onPrimary: '#FFFFFF',
  primaryTint: '#E7F0FD',        // bleu très clair (icônes, pistes)

  background: '#F4F8FE',         // fond blanc bleuté
  card: '#FFFFFF',
  cardBorder: '#DCE6F5',

  text: '#0F1B2D',               // navy (texte)
  textMuted: '#5B6B82',
  outline: '#5B6B82',
  outlineVariant: '#C3D2E8',

  navy: '#0A0F1C',               // fond du logo / splash
  yellow: '#35C0F0',             // accent = cyan Cognix (nom conservé pour compat)
  onYellow: '#0A2A3D',           // texte sur accent cyan
  red: '#E53935',                // destructive
  onRed: '#FFFFFF',
  blue: '#1E74E8',
} as const

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 } as const

// Polices du design final : Nunito (corps) + Poppins (titres).
export const fonts = {
  body: 'Nunito_700Bold',
  regular: 'Nunito_600SemiBold',
  heading: 'Poppins_800ExtraBold',
  headingBlack: 'Poppins_900Black',
} as const

export const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,
  shadowRadius: 12,
  elevation: 2,
} as const

export const LEVEL_LABEL: Record<string, string> = {
  cepe: 'CEPE',
  bepc: 'BEPC',
  bac_a: 'BAC A',
  bac_c: 'BAC C',
  bac_d: 'BAC D',
  // Séries techniques (migrations 054 et 055)
  bac_e: 'BAC E',
  bac_f3: 'BAC F3',
  bac_g2: 'BAC G2',
  bac_g3: 'BAC G3',
  bac_h: 'BAC H',
  bac_bg: 'BAC BG',
  bac_r: 'BAC R',
}

/** Couleur du badge de niveau : BEPC en jaune, tous les BAC en rouge (comme les maquettes). */
export function levelBadgeStyle(level: string): { bg: string; fg: string } {
  if (level === 'bepc') return { bg: colors.yellow, fg: colors.onYellow }
  return { bg: colors.red, fg: colors.onRed }
}

// Design final : les icônes matières sont en vert primary sur fond vert clair
// (une seule matière peut être mise en accent jaune, gérée au cas par cas).
export function subjectAccent(_name: string): string {
  return colors.primary
}

/** Émoji d'icône par matière (fallback si la colonne icon est vide). */
export function subjectIcon(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('math')) return '🧮'
  if (n.includes('phys') || n.includes('chim')) return '⚗️'
  if (n.includes('svt') || n.includes('bio') || n.includes('natur')) return '🧬'
  if (n.includes('franç') || n.includes('franc')) return '📖'
  if (n.includes('angl')) return '🗣️'
  if (n.includes('philo')) return '💭'
  if (n.includes('hist') || n.includes('géo') || n.includes('geo')) return '🌍'
  if (n.includes('info')) return '💻'
  return '📚'
}
