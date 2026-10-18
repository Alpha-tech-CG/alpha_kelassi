import { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Alert,
  ImageBackground,
  Image,
  type ImageSourcePropType,
} from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabase'
import { API_URL } from '../lib/config'
import { LEVEL_LABEL, colors, fonts, radius, cardShadow } from '../lib/theme'
import { BackButton } from '../components/BackButton'
import { CognixLoader, LoaderDots } from '../components/CognixLoader'

type Track = 'generale' | 'technique'
type Cycle = 'primaire' | 'college' | 'lycee'
interface Series {
  id: string
  code: string
  label: string
  level: string
  track: Track
}

/**
 * Choix du parcours, par cycle :
 * - Primaire → CP1, CP2, CE1, CE2, CM1, CEPE (CM2)
 * - Collège  → 6e, 5e, 4e, BEPC (3e)
 * - Lycée    → Enseignement général ou technique → Seconde, Première, Terminale
 * Seules les classes ouvertes aux élèves reviennent de la base (RLS sur
 * `series`, migration 064) : une classe fermée n'apparaît simplement pas.
 */
const CYCLE_LEVELS: Record<Exclude<Cycle, 'lycee'>, string[]> = {
  primaire: ['cp1', 'cp2', 'ce1', 'ce2', 'cm1', 'cepe'],
  college: ['sixieme', 'cinquieme', 'quatrieme', 'bepc'],
}
const CYCLES: { value: Cycle; title: string; range: string; desc: string; art: ImageSourcePropType }[] = [
  {
    value: 'primaire',
    title: 'Primaire',
    range: 'CP1 → CEPE',
    desc: "De la première année d'école au certificat d'études",
    art: require('../../assets/subjects/literature.jpg'),
  },
  {
    value: 'college',
    title: 'Collège',
    range: '6e → 3e · BEPC',
    desc: 'Les quatre années du collège jusqu’au BEPC',
    art: require('../../assets/subjects/mathematics.jpg'),
  },
  {
    value: 'lycee',
    title: 'Lycée',
    range: 'Seconde → Terminale',
    desc: 'Enseignement général ou technique, jusqu’au BAC',
    art: require('../../assets/subjects/sciences.jpg'),
  },
]
const TRACKS: { value: Track; title: string; desc: string; art: ImageSourcePropType }[] = [
  {
    value: 'generale',
    title: 'Enseignement général',
    desc: 'Séries A, C, D',
    art: require('../../assets/subjects/humanities.jpg'),
  },
  {
    value: 'technique',
    title: 'Enseignement technique',
    desc: 'Séries E, F3, G1, G2, G3, H, BG, R…',
    art: require('../../assets/subjects/technology.jpg'),
  },
]

/** Rang d'une classe de lycée : Seconde, Première, Terminale. */
function lyceeYear(level: string): 'Seconde' | 'Première' | 'Terminale' | null {
  if (level.startsWith('seconde')) return 'Seconde'
  if (level.startsWith('premiere')) return 'Première'
  if (level.startsWith('bac_')) return 'Terminale'
  return null
}
const LEVEL_ORDER: Record<string, number> = Object.fromEntries(
  Object.keys(LEVEL_LABEL).map((level, i) => [level, i])
)
const byLevelThenCode = (a: Series, b: Series) =>
  (LEVEL_ORDER[a.level] ?? 99) - (LEVEL_ORDER[b.level] ?? 99) || a.code.localeCompare(b.code)

const TIPS = [
  {
    n: '1',
    title: 'Sois précis',
    desc: 'Indique la matière et le sujet. Ex : « Explique la dérivée en Maths BAC C ».',
  },
  {
    n: '2',
    title: 'Demande des exemples',
    desc: '« Donne-moi un exemple avec des chiffres » : Cognix s’adapte à ton niveau.',
  },
  {
    n: '3',
    title: 'Reformule si besoin',
    desc: '« Je n’ai pas compris, explique autrement » : Cognix essaie une autre approche.',
  },
]

// Étapes : 0 cycle · 1 filière (lycée) · 2 classe · 3 matières · 4 conseils · 5 lancement
const STEPS = 6

export default function OnboardingScreen() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [cycle, setCycle] = useState<Cycle | null>(null)
  const [track, setTrack] = useState<Track | null>(null)
  const [allSeries, setAllSeries] = useState<Series[] | null>(null)
  const [level, setLevel] = useState<string | null>(null)
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [stepLoading, setStepLoading] = useState(false)
  const anim = useRef(new Animated.Value(1)).current

  // Toutes les classes ouvertes, chargées une fois (une trentaine de lignes).
  useEffect(() => {
    supabase
      .from('series')
      .select('id, code, label, level, track')
      .then(({ data }) => setAllSeries(((data ?? []) as Series[]).slice().sort(byLevelThenCode)))
  }, [])

  // Apparition de chaque étape : fondu + légère montée.
  function goStep(n: number) {
    Animated.timing(anim, { toValue: 0, duration: 140, useNativeDriver: true }).start(() => {
      setStep(n)
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 8, tension: 70 }).start()
    })
  }

  function pickCycle(c: Cycle) {
    setCycle(c)
    if (c === 'lycee') goStep(1)
    else {
      setTrack('generale')
      goStep(2)
    }
  }

  function pickTrack(t: Track) {
    setTrack(t)
    goStep(2)
  }

  const classes: Series[] = (allSeries ?? []).filter((s) => {
    if (!cycle) return false
    if (cycle === 'lycee') return s.track === track && lyceeYear(s.level) !== null
    return CYCLE_LEVELS[cycle].includes(s.level)
  })

  async function pickClass(s: Series) {
    setLevel(s.level)
    setTrack(s.track)
    setStepLoading(true)
    const { data } = await supabase
      .from('subjects')
      .select('id, name')
      .eq('level', s.level)
      .eq('track_type', s.track)
      .is('parent_subject_id', null)
      .order('name')
    setSubjects(data ?? [])
    setSelectedSubjects([])
    setStepLoading(false)
    goStep(3)
  }

  function toggleSubject(id: string) {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  async function handleComplete() {
    if (!track || !level) return
    setLoading(true)
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) throw new Error('Non connecté')
      const res = await fetch(`${API_URL}/api/onboarding/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ track_type: track, level, subject_ids: selectedSubjects }),
      })
      // Un refus du serveur doit se voir : avant, l'élève repartait sur l'accueil
      // comme si son parcours était enregistré.
      const json = await res.json().catch(() => null)
      if (!res.ok) throw new Error(json?.error?.message ?? json?.error ?? `HTTP ${res.status}`)
      router.replace('/(tabs)')
    } catch {
      Alert.alert('Erreur', 'Impossible de sauvegarder. Réessaie.')
    } finally {
      setLoading(false)
    }
  }

  const stepStyle = {
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }],
  }
  // Le lycée a une étape de plus (filière) : on ne montre pas de point « vide ».
  const visibleSteps = cycle && cycle !== 'lycee' ? STEPS - 1 : STEPS
  const dotIndex = cycle && cycle !== 'lycee' && step >= 2 ? step - 1 : step

  const cycleTitle = CYCLES.find((c) => c.value === cycle)?.title

  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {Array.from({ length: visibleSteps }, (_, i) => (
          <View key={i} style={[styles.dot, i <= dotIndex && styles.dotDone, i === dotIndex && styles.dotActive]} />
        ))}
      </View>

      <Animated.View style={[styles.content, stepStyle]}>
        {/* Étape 0 — Cycle */}
        {step === 0 && (
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.kicker}>BIENVENUE SUR COGNIX</Text>
            <Text style={styles.title}>Où en es-tu dans ta scolarité ?</Text>
            <Text style={styles.subtitle}>Choisis ton cycle, puis ta classe.</Text>
            <View style={{ gap: 14 }}>
              {CYCLES.map((c) => (
                <TouchableOpacity key={c.value} activeOpacity={0.9} onPress={() => pickCycle(c.value)} disabled={!allSeries}>
                  <ImageBackground source={c.art} style={styles.bigCard} imageStyle={styles.bigCardImg}>
                    <View style={styles.bigCardShade} />
                    <Text style={styles.bigCardRange}>{c.range}</Text>
                    <Text style={styles.bigCardTitle}>{c.title}</Text>
                    <Text style={styles.bigCardDesc}>{c.desc}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
            {!allSeries && <CognixLoader compact />}
          </ScrollView>
        )}

        {/* Étape 1 — Filière (lycée) */}
        {step === 1 && (
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <BackButton label="Cycles" onPress={() => goStep(0)} />
            <Text style={[styles.kicker, styles.kickerAfterBack]}>LYCÉE</Text>
            <Text style={styles.title}>Quel enseignement suis-tu ?</Text>
            <Text style={styles.subtitle}>Chacun a ses classes, de la Seconde à la Terminale.</Text>
            <View style={{ gap: 14 }}>
              {TRACKS.map((t) => (
                <TouchableOpacity key={t.value} activeOpacity={0.9} onPress={() => pickTrack(t.value)}>
                  <ImageBackground source={t.art} style={styles.bigCard} imageStyle={styles.bigCardImg}>
                    <View style={styles.bigCardShade} />
                    <Text style={styles.bigCardTitle}>{t.title}</Text>
                    <Text style={styles.bigCardDesc}>{t.desc}</Text>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Étape 2 — Classe */}
        {step === 2 && (
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <BackButton
              label={cycle === 'lycee' ? 'Enseignement' : 'Cycles'}
              onPress={() => goStep(cycle === 'lycee' ? 1 : 0)}
            />
            <Text style={[styles.kicker, styles.kickerAfterBack]}>
              {(cycleTitle ?? '').toUpperCase()}
              {cycle === 'lycee' ? ` · ${track === 'technique' ? 'TECHNIQUE' : 'GÉNÉRAL'}` : ''}
            </Text>
            <Text style={styles.title}>Ta classe</Text>
            <Text style={styles.subtitle}>Sélectionne la classe que tu fréquentes cette année.</Text>
            {stepLoading ? (
              <CognixLoader compact />
            ) : classes.length === 0 ? (
              <View style={styles.soon}>
                <Text style={styles.soonTitle}>Bientôt disponible</Text>
                <Text style={styles.soonText}>
                  Les classes de ce cycle ne sont pas encore ouvertes. Reviens très vite !
                </Text>
              </View>
            ) : cycle === 'lycee' ? (
              (['Seconde', 'Première', 'Terminale'] as const).map((year) => {
                const rows = classes.filter((s) => lyceeYear(s.level) === year)
                if (!rows.length) return null
                return (
                  <View key={year} style={{ marginBottom: 18 }}>
                    <Text style={styles.groupTitle}>{year}</Text>
                    <View style={styles.classGrid}>
                      {rows.map((s) => (
                        <ClassCard key={s.id} s={s} onPress={() => pickClass(s)} />
                      ))}
                    </View>
                  </View>
                )
              })
            ) : (
              <View style={styles.classGrid}>
                {classes.map((s) => (
                  <ClassCard key={s.id} s={s} onPress={() => pickClass(s)} />
                ))}
              </View>
            )}
          </ScrollView>
        )}

        {/* Étape 3 — Matières */}
        {step === 3 && (
          <View style={styles.flexStep}>
            <BackButton label="Classes" onPress={() => goStep(2)} />
            <Text style={[styles.kicker, styles.kickerAfterBack]}>{level ? LEVEL_LABEL[level] ?? level : ''}</Text>
            <Text style={styles.title}>Tes matières principales</Text>
            <Text style={styles.subtitle}>Sélectionne celles à réviser en priorité (optionnel).</Text>
            {subjects.length === 0 ? (
              <Text style={styles.soonText}>Les matières de cette classe arrivent bientôt. Tu peux continuer.</Text>
            ) : (
              <ScrollView style={styles.subjectList} showsVerticalScrollIndicator={false}>
                <View style={styles.subjectChips}>
                  {subjects.map((s) => {
                    const sel = selectedSubjects.includes(s.id)
                    return (
                      <TouchableOpacity
                        key={s.id}
                        style={[styles.chip, sel && styles.chipActive]}
                        onPress={() => toggleSubject(s.id)}
                      >
                        <Text style={[styles.chipText, sel && styles.chipTextActive]}>{s.name}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </ScrollView>
            )}
            <TouchableOpacity style={styles.btn} onPress={() => goStep(4)}>
              <Text style={styles.btnText}>
                Continuer{selectedSubjects.length > 0 ? ` (${selectedSubjects.length})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Étape 4 — Conseils */}
        {step === 4 && (
          <View style={styles.flexStep}>
            <Image source={require('../../assets/cognix-tutor.png')} style={styles.mascot} resizeMode="contain" />
            <Text style={styles.title}>Comment parler à Cognix ?</Text>
            <View style={styles.tips}>
              {TIPS.map((t) => (
                <View key={t.title} style={styles.tip}>
                  <View style={styles.tipNum}><Text style={styles.tipNumText}>{t.n}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tipTitle}>{t.title}</Text>
                    <Text style={styles.tipDesc}>{t.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.btn} onPress={() => goStep(5)}>
              <Text style={styles.btnText}>J'ai compris</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Étape 5 — Lancement */}
        {step === 5 && (
          <View style={styles.flexStep}>
            <Text style={[styles.kicker, { marginTop: 30 }]}>C'EST PRÊT</Text>
            <Text style={styles.title}>Ton espace {level ? LEVEL_LABEL[level] ?? '' : ''} est configuré</Text>
            <Text style={styles.subtitle}>Bonne révision avec Cognix !</Text>
            <View style={styles.featureList}>
              {[
                'Cours et exercices de ta classe',
                'Répétition espacée pour mémoriser',
                'Cognix IA et des tuteurs pour t’aider',
              ].map((f) => (
                <View key={f} style={styles.featureRow}>
                  <View style={styles.check}><Text style={styles.checkText}>✓</Text></View>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleComplete}
              disabled={loading}
            >
              {loading ? <LoaderDots color={"#fff"} size={6} /> : <Text style={styles.btnText}>C'est parti !</Text>}
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  )
}

function ClassCard({ s, onPress }: { s: Series; onPress: () => void }) {
  // « Série A — Lettres… » → « Lettres et Sciences Humaines »
  const detail = s.label.includes('—') ? s.label.split('—').slice(1).join('—').trim() : s.label
  return (
    <TouchableOpacity style={styles.classCard} activeOpacity={0.85} onPress={onPress}>
      <Text style={styles.classLevel}>{LEVEL_LABEL[s.level] ?? s.code}</Text>
      <Text style={styles.classDetail} numberOfLines={2}>{detail}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 56 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.cardBorder },
  dotDone: { backgroundColor: colors.primary + '66' },
  dotActive: { backgroundColor: colors.primary, width: 26 },
  content: { flex: 1, paddingHorizontal: 20 },
  scroll: { paddingBottom: 40 },
  flexStep: { flex: 1 },
  kicker: { fontSize: 11, fontFamily: fonts.body, color: colors.primary, letterSpacing: 1.4, marginBottom: 6 },
  kickerAfterBack: { marginTop: 18 },
  title: { fontSize: 26, lineHeight: 32, fontFamily: fonts.headingBlack, color: colors.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 22, lineHeight: 20 },
  bigCard: { height: 132, borderRadius: radius.xl, overflow: 'hidden', justifyContent: 'flex-end', padding: 18, ...cardShadow },
  bigCardImg: { borderRadius: radius.xl },
  bigCardShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,30,70,0.58)' },
  bigCardRange: {
    position: 'absolute', top: 14, right: 14, color: colors.onYellow, backgroundColor: colors.yellow,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: 'hidden', fontSize: 11, fontFamily: fonts.body,
  },
  bigCardTitle: { color: '#fff', fontSize: 24, fontFamily: fonts.headingBlack },
  bigCardDesc: { color: '#ffffffd9', fontSize: 12, marginTop: 2 },
  groupTitle: { fontSize: 13, fontFamily: fonts.body, color: colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  classGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  classCard: {
    width: '47%', flexGrow: 1, backgroundColor: colors.card, borderRadius: radius.lg, paddingVertical: 16, paddingHorizontal: 14,
    borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow,
  },
  classLevel: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.primary },
  classDetail: { fontSize: 11, color: colors.textMuted, marginTop: 3, lineHeight: 15 },
  soon: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 20, borderWidth: 1, borderColor: colors.cardBorder },
  soonTitle: { fontSize: 16, fontFamily: fonts.heading, color: colors.text, marginBottom: 4 },
  soonText: { fontSize: 13, color: colors.textMuted, lineHeight: 19 },
  subjectList: { flex: 1, marginBottom: 12 },
  subjectChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, borderWidth: 1.5, borderColor: colors.cardBorder, backgroundColor: colors.card },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.text },
  chipTextActive: { color: '#fff' },
  mascot: { width: 120, height: 120, alignSelf: 'center', marginBottom: 8 },
  tips: { gap: 12, marginTop: 10, marginBottom: 24 },
  tip: { flexDirection: 'row', gap: 12, backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.cardBorder },
  tipNum: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  tipNumText: { color: colors.primary, fontFamily: fonts.heading, fontSize: 14 },
  tipTitle: { fontSize: 14, fontFamily: fonts.body, color: colors.text, marginBottom: 2 },
  tipDesc: { fontSize: 12, color: colors.textMuted, lineHeight: 18 },
  featureList: { gap: 12, marginBottom: 40 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  check: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  checkText: { color: '#fff', fontSize: 13, fontFamily: fonts.body },
  featureText: { fontSize: 14, color: colors.text },
  btn: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center', marginTop: 'auto', marginBottom: 32, ...cardShadow },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontSize: 16, fontFamily: fonts.body },
})
