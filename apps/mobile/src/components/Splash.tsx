import { View, Text, Image, StyleSheet } from 'react-native'
import { colors, fonts } from '../lib/theme'

/** Écran de démarrage (boot) — design final avec le personnage Kelassi. */
export function Splash() {
  return (
    <View style={styles.container}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <View style={styles.center}>
        <View style={styles.card}>
          <Image source={require('../../assets/kelassi-mascot.png')} style={styles.mascot} resizeMode="contain" />
        </View>
        <Text style={styles.title}>Alpha Kelassi</Text>
        <Text style={styles.tag}>
          Ton tuteur IA pour réussir le <Text style={styles.cepe}>CEPE</Text>
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={[styles.dot, { opacity: 1 }]} />
          <View style={[styles.dot, { opacity: 0.6 }]} />
          <View style={[styles.dot, { opacity: 0.3 }]} />
        </View>
        <Text style={styles.loading}>Chargement en cours</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  glowTop: { position: 'absolute', top: -80, left: -80, width: 240, height: 240, borderRadius: 120, backgroundColor: '#ffffff14' },
  glowBottom: { position: 'absolute', bottom: -100, right: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: '#F7D64A22' },
  center: { alignItems: 'center', paddingHorizontal: 32 },
  card: { width: 200, height: 200, borderRadius: 40, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 36, overflow: 'hidden', transform: [{ rotate: '-2deg' }], shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 12 },
  mascot: { width: '112%', height: '112%' },
  title: { fontFamily: fonts.headingBlack, fontSize: 42, color: '#fff', textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
  tag: { fontFamily: fonts.body, fontSize: 18, color: '#ffffffe6', textAlign: 'center', lineHeight: 26, maxWidth: 280 },
  cepe: { color: colors.yellow, fontFamily: fonts.headingBlack },
  footer: { position: 'absolute', bottom: 70, alignItems: 'center', gap: 14 },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  loading: { color: '#ffffffcc', fontFamily: fonts.body, fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' },
})
