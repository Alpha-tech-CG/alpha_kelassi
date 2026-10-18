import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native'
import { colors, fonts } from '../lib/theme'
import { FadeIn } from './FadeIn'

/**
 * Chargement Cognix : remplace le cercle système qui tourne.
 *
 * L'emblème du logo (C + cerveau + livre) « respire », le cerveau s'allume
 * par impulsions et le livre feuillette ; des astuces défilent dessous.
 * Toucher l'emblème le fait rebondir avec une gerbe d'étincelles et change
 * l'astuce — de quoi patienter sans regarder une roue.
 *
 * - `<CognixLoader />` : écran de chargement (prend toute la place, `flex: 1`).
 * - `<CognixLoader compact />` : version réduite dans une section de page.
 * - `<LoaderDots />` : trois points qui sautent, pour un bouton ou une ligne.
 */

// Boîte de l'emblème dans la planche du splash (mêmes calques).
const BOX = { x: 403, y: 223, w: 448, h: 497 }
const PARTS = {
  ring: { x: 403, y: 223, w: 448, h: 497, src: require('../../assets/splash-layers/ring.png') },
  brain: { x: 486, y: 341, w: 166, h: 275, src: require('../../assets/splash-layers/brain.png') },
  book: { x: 651, y: 366, w: 199, h: 246, src: require('../../assets/splash-layers/book.png') },
}

const TIPS = [
  'Relis tes titres avant de commencer : ton cerveau prépare les tiroirs.',
  'Dix minutes chaque jour valent mieux qu’une nuit blanche.',
  'Explique la leçon à voix haute : si tu sais l’expliquer, tu la sais.',
  'Refais un exercice raté le lendemain : c’est là qu’on progresse.',
  'Une fiche courte et claire bat dix pages recopiées.',
  'Fais une pause de 5 minutes toutes les 25 minutes.',
  'Les flashcards marchent mieux un peu chaque jour.',
  'Note tes erreurs : ce sont tes meilleures révisions.',
]

const SPARKS = 8

export function CognixLoader({ compact = false, label }: { compact?: boolean; label?: string }) {
  const size = compact ? 76 : 124
  const k = (size * 0.74) / BOX.h // l'emblème occupe ~74 % de la tuile
  const ox = (size - BOX.w * k) / 2
  const oy = (size - BOX.h * k) / 2

  const breath = useRef(new Animated.Value(0)).current
  const pulse = useRef(new Animated.Value(0)).current
  const page = useRef(new Animated.Value(0)).current
  const bounce = useRef(new Animated.Value(1)).current
  const burst = useRef(new Animated.Value(0)).current
  const [tip, setTip] = useState(() => Math.floor(Math.random() * TIPS.length))

  useEffect(() => {
    const loop = (v: Animated.Value, ms: number, delay = 0) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, { toValue: 1, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: ms, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      )
    const anims = [loop(breath, 1300), loop(pulse, 650, 200), loop(page, 900, 400)]
    anims.forEach((a) => a.start())
    return () => anims.forEach((a) => a.stop())
  }, [breath, pulse, page])

  // Chaque astuce est remontée (key) et apparaît en fondu via FadeIn.
  const nextTip = () => setTip((t) => (t + 1) % TIPS.length)

  useEffect(() => {
    if (compact) return
    const id = setInterval(nextTip, 3200)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compact])

  const onTap = () => {
    bounce.setValue(0.82)
    Animated.spring(bounce, { toValue: 1, friction: 3, tension: 160, useNativeDriver: true }).start()
    burst.setValue(0)
    Animated.timing(burst, { toValue: 1, duration: 650, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start()
    if (!compact) nextTip()
  }

  const part = (name: keyof typeof PARTS, style: object) => {
    const p = PARTS[name]
    return (
      <Animated.Image
        source={p.src}
        resizeMode="contain"
        style={[
          { position: 'absolute', left: ox + (p.x - BOX.x) * k, top: oy + (p.y - BOX.y) * k, width: p.w * k, height: p.h * k },
          style,
        ]}
      />
    )
  }

  return (
    <View style={[styles.wrap, compact ? styles.wrapCompact : styles.wrapFull]}>
      <Pressable onPress={onTap} hitSlop={20} accessibilityRole="button" accessibilityLabel="Chargement en cours">
        <View style={{ width: size * 1.7, height: size * 1.7, alignItems: 'center', justifyContent: 'center' }}>
          {/* Halo */}
          <Animated.View
            style={[
              styles.halo,
              {
                width: size * 1.35,
                height: size * 1.35,
                borderRadius: size,
                opacity: breath.interpolate({ inputRange: [0, 1], outputRange: [0.18, 0.42] }),
                transform: [{ scale: breath.interpolate({ inputRange: [0, 1], outputRange: [0.86, 1.08] }) }],
              },
            ]}
          />
          {/* Étincelles (au toucher) */}
          {Array.from({ length: SPARKS }, (_, i) => {
            const a = (i / SPARKS) * Math.PI * 2
            const r = size * 0.85
            return (
              <Animated.View
                key={i}
                style={[
                  styles.spark,
                  {
                    backgroundColor: i % 2 ? colors.yellow : colors.primary,
                    opacity: burst.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0, 1, 0] }),
                    transform: [
                      { translateX: burst.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(a) * r] }) },
                      { translateY: burst.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(a) * r] }) },
                      { scale: burst.interpolate({ inputRange: [0, 1], outputRange: [1.4, 0.4] }) },
                    ],
                  },
                ]}
              />
            )
          })}
          {/* Tuile + emblème */}
          <Animated.View
            style={[
              styles.tile,
              {
                width: size,
                height: size,
                borderRadius: size * 0.28,
                transform: [
                  { scale: Animated.multiply(bounce, breath.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1.03] })) },
                ],
              },
            ]}
          >
            {part('ring', {})}
            {part('brain', {
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }),
              transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1.06] }) }],
            })}
            {part('book', {
              transform: [{ scaleX: page.interpolate({ inputRange: [0, 1], outputRange: [1, 0.72] }) }],
            })}
          </Animated.View>
        </View>
      </Pressable>

      <LoaderDots color={colors.primary} />

      {compact ? (
        label ? <Text style={styles.label}>{label}</Text> : null
      ) : (
        <>
          <FadeIn key={tip} distance={8}>
            <Text style={styles.tip}>{label ?? TIPS[tip]}</Text>
          </FadeIn>
          <Text style={styles.hint}>Touche le logo pour une autre astuce</Text>
        </>
      )}
    </View>
  )
}

/** Trois points qui sautent l'un après l'autre (boutons, lignes de liste). */
export function LoaderDots({ color = colors.primary, size = 8 }: { color?: string; size?: number }) {
  const vals = useRef([0, 1, 2].map(() => new Animated.Value(0))).current
  useEffect(() => {
    const anims = vals.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 140),
          Animated.timing(v, { toValue: 1, duration: 280, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: 280, easing: Easing.in(Easing.quad), useNativeDriver: true }),
          Animated.delay((2 - i) * 140 + 160),
        ])
      )
    )
    anims.forEach((a) => a.start())
    return () => anims.forEach((a) => a.stop())
  }, [vals])
  return (
    <View style={styles.dots} accessibilityLabel="Chargement">
      {vals.map((v, i) => (
        <Animated.View
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            marginHorizontal: size * 0.35,
            backgroundColor: color,
            opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] }),
            transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -size * 0.9] }) }],
          }}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  wrapFull: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 32 },
  wrapCompact: { paddingVertical: 28 },
  halo: { position: 'absolute', backgroundColor: colors.yellow },
  spark: { position: 'absolute', width: 9, height: 9, borderRadius: 5 },
  tile: { backgroundColor: colors.navy, overflow: 'hidden', shadowColor: colors.primary, shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  dots: { flexDirection: 'row', alignItems: 'flex-end', height: 22, paddingTop: 8 },
  tip: { marginTop: 18, maxWidth: 300, textAlign: 'center', fontFamily: fonts.body, fontSize: 15, lineHeight: 21, color: colors.text },
  hint: { marginTop: 10, fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  label: { marginTop: 10, fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted },
})
