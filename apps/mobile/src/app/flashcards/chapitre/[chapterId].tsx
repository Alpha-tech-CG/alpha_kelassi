import { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../../lib/supabase'
import { latexToText } from '../../../lib/latexText'
import { drawCards, SESSION_SIZE, type DeckCard } from '../../../lib/flashcardDeck'
import { colors, radius, cardShadow, fonts } from '../../../lib/theme'
import { BackButton } from '../../../components/BackButton'
import { CognixLoader } from '../../../components/CognixLoader'
import { useBilling } from '../../../hooks/useBilling'

/**
 * Flashcards d'un chapitre (migration 075) — même séance que le web
 * (`apps/web/.../[chapterId]/flashcards`) : 15 cartes tirées au hasard dans le paquet
 * préparé du chapitre, « Je savais » / « À revoir », puis score, erreurs à revoir
 * ou 15 autres cartes. Rien n'est généré : le paquet est déjà en base.
 */
export default function ChapterFlashcardsScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>()
  const router = useRouter()
  const { me } = useBilling()
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('Flashcards')
  const [deck, setDeck] = useState<DeckCard[]>([])
  const [session, setSession] = useState<DeckCard[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [missed, setMissed] = useState<DeckCard[]>([])
  const [known, setKnown] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const flipAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    let active = true
    ;(async () => {
      const [{ data: ch }, { data, error: e }] = await Promise.all([
        supabase.from('chapters').select('title').eq('id', chapterId).maybeSingle(),
        supabase.from('chapter_flashcards').select('id, front, back').eq('chapter_id', chapterId).order('order_index'),
      ])
      if (!active) return
      if (e) setError('Impossible de charger les flashcards. Vérifie ta connexion.')
      const cards = (data ?? []) as DeckCard[]
      if (ch?.title) setTitle(ch.title)
      setDeck(cards)
      setSession(drawCards(cards))
      setLoading(false)
    })()
    return () => { active = false }
  }, [chapterId])

  function resetFlip() { setFlipped(false); flipAnim.setValue(0) }
  function start(cards: DeckCard[]) { setSession(cards); setIndex(0); setMissed([]); setKnown(0); resetFlip() }
  function flip() {
    Animated.spring(flipAnim, { toValue: flipped ? 0 : 1, useNativeDriver: true, friction: 8 }).start()
    setFlipped((f) => !f)
  }
  function answer(ok: boolean) {
    const card = session[index]!
    if (ok) setKnown((k) => k + 1)
    else setMissed((m) => [...m, card])
    setIndex((i) => i + 1)
    resetFlip()
  }

  const front = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })
  const back = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] })

  const header = (
    <View style={styles.header}>
      <BackButton />
      <Text style={styles.kicker}>🃏  FLASHCARDS</Text>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
    </View>
  )

  if (loading) return <View style={styles.container}>{header}<CognixLoader compact /></View>
  if (deck.length === 0) {
    return (
      <View style={styles.container}>
        {header}
        {/* Paquet vide en Gratuit : le chapitre est sans doute fermé (RLS, comme ses leçons). */}
        {!error && me?.plan === 'free' ? (
          <View style={styles.content}>
            <Text style={styles.empty}>🔒 Les flashcards de ce chapitre sont incluses dès la formule Starter.</Text>
            <TouchableOpacity style={styles.btn} onPress={() => router.push('/abonnement?plan=starter' as any)}>
              <Text style={styles.btnText}>Voir les formules</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.empty}>{error ?? 'Les flashcards de ce chapitre arrivent bientôt.'}</Text>
        )}
      </View>
    )
  }

  const card = session[index]
  if (!card) {
    const total = session.length
    return (
      <View style={styles.container}>
        {header}
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.doneHero}>
            <Text style={styles.doneKicker}>SÉANCE TERMINÉE</Text>
            <Text style={styles.doneScore}>{known} / {total}</Text>
            <Text style={styles.doneSub}>
              {known === total ? 'Parfait, tu maîtrises ces notions !' : `${total - known} carte${total - known > 1 ? 's' : ''} à revoir.`}
            </Text>
          </View>
          {missed.length > 0 && (
            <TouchableOpacity style={[styles.btn, { backgroundColor: '#F59E0B' }]} onPress={() => start(drawCards(missed, missed.length))}>
              <Text style={styles.btnText}>Revoir mes erreurs ({missed.length})</Text>
            </TouchableOpacity>
          )}
          {deck.length > SESSION_SIZE && (
            <TouchableOpacity style={styles.btn} onPress={() => start(drawCards(deck, SESSION_SIZE, new Set(session.map((c) => c.id))))}>
              <Text style={styles.btnText}>{SESSION_SIZE} autres cartes</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={() => router.back()}>
            <Text style={[styles.btnText, { color: colors.text }]}>Retour au chapitre</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {header}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.counter}>{index + 1} / {session.length}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(index / session.length) * 100}%` }]} />
        </View>

        <TouchableOpacity activeOpacity={0.95} onPress={flip} style={styles.cardContainer}>
          <Animated.View style={[styles.face, styles.faceFront, { transform: [{ perspective: 1000 }, { rotateY: front }] }]}>
            <Text style={styles.label}>Question</Text>
            <Text style={styles.cardText}>{latexToText(card.front)}</Text>
            <Text style={styles.tapHint}>Touche la carte pour voir la réponse</Text>
          </Animated.View>
          <Animated.View style={[styles.face, styles.faceBack, { transform: [{ perspective: 1000 }, { rotateY: back }] }]}>
            <Text style={[styles.label, { color: '#ffffffcc' }]}>Réponse</Text>
            <Text style={[styles.cardText, { color: '#fff' }]}>{latexToText(card.back)}</Text>
          </Animated.View>
        </TouchableOpacity>

        {flipped ? (
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.half, { backgroundColor: '#F59E0B' }]} onPress={() => answer(false)}>
              <Text style={styles.btnText}>À revoir</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.half, { backgroundColor: '#0F8F4F' }]} onPress={() => answer(true)}>
              <Text style={styles.btnText}>Je savais</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.btn} onPress={flip}>
            <Text style={styles.btnText}>Voir la réponse</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 8 },
  kicker: { fontSize: 12, fontWeight: '900', color: colors.primary, letterSpacing: 1 },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text, marginTop: 4 },
  content: { padding: 20, paddingBottom: 48 },
  counter: { textAlign: 'right', fontSize: 14, fontWeight: '700', color: colors.textMuted, marginBottom: 8 },
  progressBar: { height: 6, backgroundColor: colors.primaryTint, borderRadius: radius.full, overflow: 'hidden', marginBottom: 18 },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  cardContainer: { height: 280, marginBottom: 22 },
  face: {
    position: 'absolute', width: '100%', height: '100%', borderRadius: radius.xl, alignItems: 'center',
    justifyContent: 'center', padding: 24, backfaceVisibility: 'hidden',
  },
  faceFront: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  faceBack: { backgroundColor: colors.primary, ...cardShadow },
  label: { position: 'absolute', top: 16, fontSize: 11, fontWeight: '900', letterSpacing: 1.2, color: colors.primary, textTransform: 'uppercase' },
  cardText: { fontSize: 17, lineHeight: 25, fontWeight: '700', color: colors.text, textAlign: 'center' },
  tapHint: { position: 'absolute', bottom: 16, fontSize: 11, color: colors.outlineVariant },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  btn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  btnGhost: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 15 },
  doneHero: { backgroundColor: colors.primary, borderRadius: 26, padding: 22, marginBottom: 16, ...cardShadow },
  doneKicker: { color: '#ffffffcc', fontSize: 10, fontFamily: fonts.body, letterSpacing: 1.2, marginBottom: 6 },
  doneScore: { fontSize: 44, fontFamily: fonts.headingBlack, color: colors.yellow },
  doneSub: { color: '#ffffffe0', fontSize: 14, marginTop: 4 },
  empty: { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingVertical: 40, paddingHorizontal: 20 },
})
