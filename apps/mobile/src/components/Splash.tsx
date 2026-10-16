import { useEffect, useRef, useState } from 'react'
import { View, Image, StyleSheet, Animated, Easing, useWindowDimensions, AccessibilityInfo, type ImageSourcePropType } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg'

/**
 * Écran de démarrage animé (motion design) du logo Cognix.
 *
 * Le logo n'est pas redessiné : `assets/splash-layers/` contient ses morceaux
 * d'origine (anneau du C, cerveau, livre, chaque lettre, slogan), découpés en
 * PNG transparents. Chaque calque est replacé à sa position dans le logo
 * (repère 1254 × 1254) puis animé séparément.
 *
 * Déroulé (~2,5 s) : le C se trace → halo bleu → le cerveau éclot → le livre
 * s'ouvre → les lettres montent une à une → le X arrive en virgule → le slogan
 * et ses filets. L'écran ne s'efface qu'une fois l'animation finie ET l'appli
 * prête (`ready`), puis appelle `onDone`.
 */

/** Fond exact du logo, pour que les calques s'y fondent sans couture. */
export const SPLASH_BG = '#00030C'

const LOGO = 1254
// Positions des calques dans le logo d'origine (générées avec les PNG).
const L = {
  ring: { x: 403, y: 223, w: 448, h: 497 },
  brain: { x: 486, y: 341, w: 166, h: 275 },
  book: { x: 651, y: 366, w: 199, h: 246 },
  c: { x: 134, y: 758, w: 156, h: 139 },
  o: { x: 315, y: 758, w: 167, h: 140 },
  g: { x: 507, y: 758, w: 159, h: 139 },
  n: { x: 694, y: 758, w: 155, h: 140 },
  i: { x: 880, y: 758, w: 38, h: 140 },
  x: { x: 943, y: 734, w: 192, h: 164 },
  lineLeft: { x: 158, y: 934, w: 77, h: 13 },
  lineRight: { x: 1030, y: 934, w: 76, h: 13 },
  tagline: { x: 263, y: 919, w: 747, h: 43 },
}
const SRC = {
  ring: require('../../assets/splash-layers/ring.png'),
  brain: require('../../assets/splash-layers/brain.png'),
  book: require('../../assets/splash-layers/book.png'),
  c: require('../../assets/splash-layers/l-c.png'),
  o: require('../../assets/splash-layers/l-o.png'),
  g: require('../../assets/splash-layers/l-g.png'),
  n: require('../../assets/splash-layers/l-n.png'),
  i: require('../../assets/splash-layers/l-i.png'),
  x: require('../../assets/splash-layers/l-x.png'),
  lineLeft: require('../../assets/splash-layers/line-left.png'),
  lineRight: require('../../assets/splash-layers/line-right.png'),
  tagline: require('../../assets/splash-layers/tagline.png'),
}
const LETTERS = ['c', 'o', 'g', 'n', 'i'] as const

// Anneau du C : centre et rayon moyen dans le logo ; le tracé part de la pointe haute.
const RING = { cx: 645.5, cy: 471, r: 207.5, width: 100, startDeg: -42 }
const RING_LEN = 2 * Math.PI * RING.r
// Contenu visible du logo (y 223 → 962) : on le recentre verticalement.
const CONTENT_MID_Y = (223 + 962) / 2

const AnimatedCircle = Animated.createAnimatedComponent(Circle)
const out = (p = 3) => Easing.out(Easing.poly(p))
const NATIVE = true

export function Splash({ ready = true, onDone }: { ready?: boolean; onDone?: () => void }) {
  const { width, height } = useWindowDimensions()
  const side = Math.min(width * 1.04, height * 0.66)
  const k = side / LOGO

  const v = useRef({
    glow: new Animated.Value(0),
    ring: new Animated.Value(0),
    draw: new Animated.Value(0),   // tracé du C — propriété SVG, donc pilote JS
    brain: new Animated.Value(0),
    book: new Animated.Value(0),
    letters: LETTERS.map(() => new Animated.Value(0)),
    x: new Animated.Value(0),
    lines: new Animated.Value(0),
    tagline: new Animated.Value(0),
    exit: new Animated.Value(0),
  }).current
  const [introDone, setIntroDone] = useState(false)
  const exiting = useRef(false)

  useEffect(() => {
    let cancelled = false
    const t = (val: Animated.Value, duration: number, delay: number, easing = out(), native = NATIVE) =>
      Animated.timing(val, { toValue: 1, duration, delay, easing, useNativeDriver: native })

    const intro = Animated.parallel([
      // Le halo attend la fin du tracé : sous le cache du C, il laisserait voir un anneau sombre.
      t(v.glow, 800, 950, out(2)),
      t(v.ring, 700, 100, out(3)),
      t(v.draw, 900, 100, Easing.inOut(Easing.cubic), false),
      t(v.brain, 650, 700, Easing.out(Easing.back(1.7))),
      t(v.book, 650, 850, Easing.out(Easing.back(1.4))),
      Animated.stagger(70, v.letters.map((l) => t(l, 480, 1150, out(3)))),
      t(v.x, 650, 1480, Easing.out(Easing.back(2))),
      t(v.lines, 500, 1850, out(3)),
      t(v.tagline, 550, 1900, out(2)),
    ])

    // Accessibilité : si l'élève a réduit les animations, on affiche le logo tel quel.
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduce) => {
        if (cancelled) return
        if (reduce) {
          ;[v.glow, v.ring, v.draw, v.brain, v.book, ...v.letters, v.x, v.lines, v.tagline].forEach((a) => a.setValue(1))
          setTimeout(() => !cancelled && setIntroDone(true), 700)
          return
        }
        intro.start(({ finished }) => { if (finished && !cancelled) setIntroDone(true) })
      })
    return () => { cancelled = true; intro.stop() }
  }, [v])

  // Sortie : seulement quand l'intro est finie et l'appli prête derrière.
  useEffect(() => {
    if (!introDone || !ready || exiting.current) return
    exiting.current = true
    Animated.sequence([
      // Pulsation du halo, puis le logo s'efface en avançant légèrement.
      Animated.timing(v.glow, { toValue: 1.6, duration: 260, easing: out(2), useNativeDriver: NATIVE }),
      Animated.timing(v.exit, { toValue: 1, duration: 420, easing: Easing.in(Easing.cubic), useNativeDriver: NATIVE }),
    ]).start(() => onDone?.())
  }, [introDone, ready, v, onDone])

  /** Calque positionné à sa place dans le logo, à l'échelle de l'écran. */
  const layer = (name: keyof typeof L, style: object, source: ImageSourcePropType = SRC[name]) => {
    const b = L[name]
    return (
      <Animated.View key={name} style={[{ position: 'absolute', left: b.x * k, top: b.y * k, width: b.w * k, height: b.h * k }, style]}>
        <Image source={source} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />
      </Animated.View>
    )
  }
  const lerp = (a: Animated.Value, from: number, to: number) => a.interpolate({ inputRange: [0, 1], outputRange: [from, to] })
  const fadeIn = (a: Animated.Value, until = 0.35) => a.interpolate({ inputRange: [0, until, 1], outputRange: [0, 1, 1], extrapolate: 'clamp' })

  const book = L.book
  const lineL = L.lineLeft
  const lineR = L.lineRight

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Animated.View
        style={{
          width: side, height: side,
          transform: [
            { translateY: (LOGO / 2 - CONTENT_MID_Y) * k },
            { scale: lerp(v.exit, 1, 1.08) },
          ],
          opacity: lerp(v.exit, 1, 0),
        }}
      >
        {/* Halo bleu derrière le C */}
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: v.glow.interpolate({ inputRange: [0, 1, 1.6], outputRange: [0, 0.55, 0.9] }) }]}>
          <Svg width={side} height={side} viewBox={`0 0 ${LOGO} ${LOGO}`}>
            <Defs>
              <RadialGradient id="halo" cx={RING.cx} cy={RING.cy} r={420} gradientUnits="userSpaceOnUse">
                <Stop offset="0" stopColor="#1E74E8" stopOpacity="0.55" />
                <Stop offset="0.55" stopColor="#1E74E8" stopOpacity="0.14" />
                <Stop offset="1" stopColor="#1E74E8" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx={RING.cx} cy={RING.cy} r={420} fill="url(#halo)" />
          </Svg>
        </Animated.View>

        {/* Le C : se trace depuis sa pointe haute (un cache couleur fond se retire),
            en avançant légèrement. Anneau et cache bougent ensemble pour rester alignés. */}
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale: lerp(v.ring, 0.9, 1) }] }]}>
        {layer('ring', {})}
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: v.draw.interpolate({ inputRange: [0, 0.97, 1], outputRange: [1, 1, 0] }) }]}>
          <Svg width={side} height={side} viewBox={`0 0 ${LOGO} ${LOGO}`}>
            <AnimatedCircle
              cx={RING.cx} cy={RING.cy} r={RING.r}
              stroke={SPLASH_BG} strokeWidth={RING.width} fill="none"
              strokeDasharray={[RING_LEN, RING_LEN]}
              strokeDashoffset={lerp(v.draw, 0, RING_LEN * 0.9)}
              transform={`rotate(${RING.startDeg} ${RING.cx} ${RING.cy})`}
            />
          </Svg>
        </Animated.View>
        </Animated.View>

        {/* Le cerveau éclot depuis son centre */}
        {layer('brain', {
          opacity: fadeIn(v.brain, 0.3),
          transform: [{ scale: lerp(v.brain, 0.35, 1) }],
        })}
        {/* Le livre s'ouvre depuis sa reliure (bord gauche) */}
        {layer('book', {
          opacity: fadeIn(v.book, 0.25),
          transform: [
            { translateX: v.book.interpolate({ inputRange: [0, 1], outputRange: [(-book.w * k) / 2, 0] }) },
            { scaleX: v.book.interpolate({ inputRange: [0, 1], outputRange: [0.02, 1] }) },
            { translateX: v.book.interpolate({ inputRange: [0, 1], outputRange: [(book.w * k) / 2, 0] }) },
          ],
        })}

        {/* COGNI : les lettres montent une à une */}
        {LETTERS.map((name, idx) => layer(name, {
          opacity: fadeIn(v.letters[idx]!, 0.5),
          transform: [{ translateY: lerp(v.letters[idx]!, 70 * k, 0) }],
        }))}
        {/* X : arrive en virgule, avec un léger rebond */}
        {layer('x', {
          opacity: fadeIn(v.x, 0.3),
          transform: [
            { translateX: lerp(v.x, 90 * k, 0) },
            { rotate: v.x.interpolate({ inputRange: [0, 1], outputRange: ['-30deg', '0deg'] }) },
            { scale: lerp(v.x, 1.5, 1) },
          ],
        })}

        {/* Slogan : les filets s'étirent vers l'extérieur, le texte apparaît */}
        {layer('lineLeft', {
          transform: [
            { translateX: lerp(v.lines, (lineL.w * k) / 2, 0) },
            { scaleX: lerp(v.lines, 0.01, 1) },
          ],
        })}
        {layer('lineRight', {
          transform: [
            { translateX: lerp(v.lines, (-lineR.w * k) / 2, 0) },
            { scaleX: lerp(v.lines, 0.01, 1) },
          ],
        })}
        {layer('tagline', {
          opacity: fadeIn(v.tagline, 0.7),
          transform: [{ translateY: lerp(v.tagline, 28 * k, 0) }],
        })}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: SPLASH_BG, alignItems: 'center', justifyContent: 'center' },
})
