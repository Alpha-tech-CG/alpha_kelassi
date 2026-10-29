import { ImageBackground, View, Text, StyleSheet, type ImageSourcePropType } from 'react-native'
import { colors, fonts } from '../lib/theme'

/**
 * Vignette image d'un chapitre ou d'un domaine (remplace les icônes/émojis) :
 * la photo de la matière, assombrie, avec le numéro du chapitre en grand et
 * une petite jauge d'avancement en bas. Un chapitre terminé porte une pastille ✓.
 */
export function ImageTile({
  source,
  label,
  pct = 0,
  done = false,
  locked = false,
  size = 58,
}: {
  source: ImageSourcePropType
  label: string
  pct?: number
  done?: boolean
  locked?: boolean
  size?: number
}) {
  return (
    <ImageBackground
      source={source}
      style={[styles.tile, { width: size, height: size, borderRadius: size * 0.28 }]}
      imageStyle={{ borderRadius: size * 0.28 }}
    >
      <View style={[StyleSheet.absoluteFill, styles.shade, { borderRadius: size * 0.28 }, locked && styles.shadeLocked]} />
      <Text style={[styles.label, { fontSize: size * 0.36 }]}>{locked ? '•' : label}</Text>
      {!locked && pct > 0 && !done ? (
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.min(100, pct)}%` }]} />
        </View>
      ) : null}
      {done ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✓</Text>
        </View>
      ) : null}
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  tile: { alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
  shade: { backgroundColor: 'rgba(10,30,70,0.55)' },
  shadeLocked: { backgroundColor: 'rgba(90,100,120,0.75)' },
  label: { color: '#fff', fontFamily: fonts.headingBlack },
  track: { position: 'absolute', left: 7, right: 7, bottom: 6, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.yellow },
  badge: {
    position: 'absolute', right: -5, top: -5, width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.primary, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 11, fontFamily: fonts.body },
})
