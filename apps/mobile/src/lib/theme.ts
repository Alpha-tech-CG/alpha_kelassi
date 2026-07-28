// Système de design « L'Élan National » — tokens exacts des maquettes Stitch.
// Thème vert Congo, cartes blanches, badges de niveau, accents par matière.

// Palette EXACTE du design final Alpha Kelassi (maquettes « designe final »).
export const colors = {
  primary: '#0F8F4F',            // primary
  primaryContainer: '#0B6B3A',   // secondary
  onPrimary: '#FFFFFF',          // primary-foreground
  primaryTint: '#EAF5EC',        // fond vert très clair (icônes matières, pistes)

  background: '#F7FAF8',         // background
  card: '#FFFFFF',               // card
  cardBorder: '#E2E8F0',         // border

  text: '#1F2A24',               // foreground
  textMuted: '#6D7A72',          // muted-foreground
  outline: '#6D7A72',
  outlineVariant: '#C7D2CC',

  yellow: '#F7D64A',             // accent
  onYellow: '#1F2A24',           // accent-foreground
  red: '#E53935',                // destructive
  onRed: '#FFFFFF',
  blue: '#2980B9',               // chart-2
} as const

export const radius = { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 } as const

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
