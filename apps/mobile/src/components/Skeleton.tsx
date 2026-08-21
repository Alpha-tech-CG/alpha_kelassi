import { useEffect, useRef } from 'react'
import { Animated, View, StyleSheet, Easing } from 'react-native'
import { colors, radius } from '../lib/theme'

/**
 * Bloc « squelette » avec animation de pulsation douce — utilisé pour donner
 * un aperçu flouté de la mise en page pendant un chargement, plutôt qu'un
 * cercle qui tourne sur une page blanche (règle UX : montrer la structure à
 * venir, pas seulement « patiente »).
 */
export function SkeletonBlock({ width, height, radius: r = radius.sm, style }: { width: number | `${number}%`; height: number; radius?: number; style?: object }) {
  const pulse = useRef(new Animated.Value(0.4)).current

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 650, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [pulse])

  return (
    <Animated.View
      style={[{ width, height, borderRadius: r, backgroundColor: colors.cardBorder, opacity: pulse }, style]}
    />
  )
}

/** Aperçu flouté d'un écran de chapitre (titre, onglets, cartes de cours) pendant le chargement. */
export function ChapterSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SkeletonBlock width={28} height={28} radius={14} />
        <View style={{ height: 10 }} />
        <SkeletonBlock width="70%" height={22} />
      </View>

      <View style={styles.tabs}>
        {[64, 78, 60, 56].map((w, i) => (
          <SkeletonBlock key={i} width={w} height={32} radius={radius.full} />
        ))}
      </View>

      <View style={styles.content}>
        {[0, 1].map((i) => (
          <View key={i} style={styles.card}>
            <SkeletonBlock width="55%" height={16} />
            <View style={{ height: 14 }} />
            <SkeletonBlock width="100%" height={12} />
            <View style={{ height: 8 }} />
            <SkeletonBlock width="92%" height={12} />
            <View style={{ height: 8 }} />
            <SkeletonBlock width="97%" height={12} />
            <View style={{ height: 8 }} />
            <SkeletonBlock width="60%" height={12} />
            <View style={{ height: 16 }} />
            <SkeletonBlock width="100%" height={130} radius={radius.md} />
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12 },
  tabs: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 8 },
  content: { padding: 16, gap: 14 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.cardBorder },
})
