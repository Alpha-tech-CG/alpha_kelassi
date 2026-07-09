// Système de design « L'Élan National » — tokens exacts des maquettes Stitch.
// Thème vert Congo, cartes blanches, badges de niveau, accents par matière.

export const colors = {
  primary: '#006B2E',            // vert Congo (actions, progression)
  primaryContainer: '#00873C',
  onPrimary: '#FFFFFF',
  primaryTint: '#EFF6EB',        // fond vert très clair (chips, pistes de barre)

  background: '#F5FBF0',         // fond de page
  card: '#FFFFFF',
  cardBorder: '#E3EADF',

  text: '#171D17',               // on-surface
  textMuted: '#3E4A3E',          // on-surface-variant
  outline: '#6E7A6D',
  outlineVariant: '#BDCABA',

  yellow: '#FCDF4B',             // secondary container (badge BEPC)
  onYellow: '#524600',
  red: '#E12822',                // tertiary (badge BAC / mode examen)
  onRed: '#FFFFFF',
  blue: '#3B82F6',               // bleu académique (matière littéraire)
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

// Palette d'accents par matière (barre latérale + icône). Déterministe par nom.
const ACCENTS = ['#006B2E', '#3B82F6', '#B7791F', '#9333EA', '#DB2777', '#0891B2', '#DC2626']

export function subjectAccent(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return ACCENTS[h % ACCENTS.length]!
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
