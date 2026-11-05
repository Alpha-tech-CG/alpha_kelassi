import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { colors, fonts } from '../lib/theme'
import { SolarIcon } from '../icons/solar'

/** Largeur réservée par le bouton : sert aux en-têtes qui centrent un titre entre deux colonnes. */
export const BACK_BUTTON_WIDTH = 96

/**
 * Bouton retour commun : une pastille blanche « ← Retour » au lieu d'une simple
 * flèche, pour que l'élève voie clairement comment revenir en arrière.
 *
 * - `label` : texte affiché (« Retour » par défaut, ou la destination : « Matières »…).
 * - `onPress` : action personnalisée ; sinon retour à l'écran précédent, ou à
 *   l'accueil s'il n'y en a pas (ouverture directe d'un lien, par exemple).
 * - `tone="light"` : version claire pour les en-têtes sur fond coloré.
 */
export function BackButton({
  label = 'Retour',
  onPress,
  tone = 'default',
}: {
  label?: string
  onPress?: (() => void) | undefined
  tone?: 'default' | 'light'
}) {
  const router = useRouter()
  const light = tone === 'light'
  const go = onPress ?? (() => (router.canGoBack() ? router.back() : router.replace('/(tabs)')))
  return (
    <TouchableOpacity
      onPress={go}
      hitSlop={10}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.pill, light && styles.pillLight]}
    >
      <View style={[styles.iconWrap, light && styles.iconWrapLight]}>
        <SolarIcon name="arrowLeft" size={20} color={light ? '#fff' : colors.primary} />
      </View>
      <Text style={[styles.label, light && styles.labelLight]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    minWidth: BACK_BUTTON_WIDTH,
    paddingLeft: 4,
    paddingRight: 14,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#0F1B2D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  pillLight: { backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.35)', elevation: 0, shadowOpacity: 0 },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryTint,
  },
  iconWrapLight: { backgroundColor: 'rgba(255,255,255,0.18)' },
  label: { fontSize: 13, fontFamily: fonts.body, color: colors.text },
  labelLight: { color: '#fff' },
})
