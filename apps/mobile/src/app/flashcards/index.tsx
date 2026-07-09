import { useEffect, useState, useCallback } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Animated,
} from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { colors, radius, cardShadow } from '../../lib/theme'

interface Flashcard {
  id: string
  front: string
  back: string
  ease_factor: number
  interval: number
  reps: number
  documents: { title: string; subjects: { name: string } | null } | null
}

const QUALITIES = [
  { q: 0, label: 'Oublié', bg: colors.red },
  { q: 2, label: 'Difficile', bg: '#F97316' },
  { q: 3, label: 'Correct', bg: '#B7791F' },
  { q: 5, label: 'Parfait', bg: colors.primary },
]

export default function FlashcardsScreen() {
  const router = useRouter()
  const [cards, setCards] = useState<Flashcard[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)
  const [stats, setStats] = useState({ reviewed: 0, correct: 0 })
  const flipAnim = new Animated.Value(0)

  useEffect(() => { loadCards() }, [])

  async function getToken() {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token
  }

  async function loadCards() {
    setLoading(true)
    const token = await getToken()
    const res = await fetch(`${API_URL}/api/flashcards/due?limit=20`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const json = await res.json()
    setCards(json.data ?? [])
    setIndex(0)
    setFlipped(false)
    setDone((json.data ?? []).length === 0)
    setLoading(false)
  }

  function flip() {
    const toValue = flipped ? 0 : 1
    Animated.spring(flipAnim, { toValue, useNativeDriver: true, friction: 8 }).start()
    setFlipped((f) => !f)
  }

  const frontInterpolate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] })
  const backInterpolate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] })

  const review = useCallback(async (quality: number) => {
    if (!cards[index]) return
    const token = await getToken()
    await fetch(`${API_URL}/api/flashcards/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ flashcard_id: cards[index].id, quality }),
    })
    setStats((s) => ({ reviewed: s.reviewed + 1, correct: s.correct + (quality >= 3 ? 1 : 0) }))
    const next = index + 1
    if (next >= cards.length) { setDone(true) } else {
      setIndex(next)
      setFlipped(false)
      flipAnim.setValue(0)
    }
  }, [cards, index])

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  if (done) {
    const pct = stats.reviewed > 0 ? Math.round((stats.correct / stats.reviewed) * 100) : 0
    return (
      <View style={styles.center}>
        <Text style={styles.doneEmoji}>{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</Text>
        <Text style={styles.doneTitle}>Session terminée !</Text>
        {stats.reviewed > 0
          ? <Text style={styles.doneScore}>{pct}% de réussite</Text>
          : <Text style={styles.doneSub}>Aucune carte à réviser aujourd'hui.</Text>}
        <TouchableOpacity style={styles.restartBtn} onPress={() => { setStats({ reviewed: 0, correct: 0 }); loadCards() }}>
          <Text style={styles.restartText}>Recommencer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const card = cards[index]
  if (!card) {
    return (
      <View style={styles.center}>
        <Text style={styles.doneSub}>Aucune carte à afficher.</Text>
      </View>
    )
  }
  const progress = index / cards.length

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.counter}>{index + 1} / {cards.length}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {card.documents && (
        <Text style={styles.context}>{card.documents.subjects?.name} · {card.documents.title}</Text>
      )}

      {/* Carte animée */}
      <TouchableOpacity activeOpacity={0.9} onPress={flip} style={styles.cardContainer}>
        <Animated.View style={[styles.cardFace, styles.cardFront, { transform: [{ rotateY: frontInterpolate }] }]}>
          <Text style={styles.cardLabel}>Question</Text>
          <Text style={styles.cardText}>{card.front}</Text>
          <Text style={styles.tapHint}>Appuie pour voir la réponse</Text>
        </Animated.View>
        <Animated.View style={[styles.cardFace, styles.cardBack, { transform: [{ rotateY: backInterpolate }] }]}>
          <Text style={[styles.cardLabel, { color: colors.primary }]}>Réponse</Text>
          <Text style={styles.cardText}>{card.back}</Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Boutons qualité */}
      {flipped ? (
        <View style={styles.qualities}>
          <Text style={styles.qualityHint}>Comment tu as répondu ?</Text>
          <View style={styles.qualityRow}>
            {QUALITIES.map(({ q, label, bg }) => (
              <TouchableOpacity key={q} style={[styles.qualityBtn, { backgroundColor: bg }]} onPress={() => review(q)}>
                <Text style={styles.qualityText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.flipBtn} onPress={flip}>
          <Text style={styles.flipBtnText}>Voir la réponse</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 56 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  back: { fontSize: 24, color: colors.text },
  counter: { fontSize: 14, color: colors.textMuted, fontWeight: '700' },
  progressBar: { height: 6, backgroundColor: colors.primaryTint, marginHorizontal: 20, borderRadius: radius.full, overflow: 'hidden', marginBottom: 12 },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  context: { textAlign: 'center', fontSize: 12, color: colors.textMuted, marginBottom: 16 },
  cardContainer: { marginHorizontal: 20, height: 240, marginBottom: 24 },
  cardFace: { position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center', padding: 24, backfaceVisibility: 'hidden' },
  cardFront: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  cardBack: { backgroundColor: '#EAF6EE', borderWidth: 1, borderColor: colors.primary },
  cardLabel: { fontSize: 11, fontWeight: '800', color: colors.outline, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  cardText: { fontSize: 18, fontWeight: '600', color: colors.text, textAlign: 'center', lineHeight: 26 },
  tapHint: { position: 'absolute', bottom: 16, fontSize: 11, color: colors.outlineVariant },
  qualities: { paddingHorizontal: 20 },
  qualityHint: { textAlign: 'center', fontSize: 13, color: colors.textMuted, marginBottom: 10 },
  qualityRow: { flexDirection: 'row', gap: 8 },
  qualityBtn: { flex: 1, paddingVertical: 14, borderRadius: radius.md, alignItems: 'center' },
  qualityText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  flipBtn: { marginHorizontal: 20, backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center', ...cardShadow },
  flipBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  doneEmoji: { fontSize: 56, marginBottom: 16 },
  doneTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 8 },
  doneScore: { fontSize: 30, fontWeight: '800', color: colors.primary, marginBottom: 24 },
  doneSub: { fontSize: 14, color: colors.textMuted, marginBottom: 24 },
  restartBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 14, paddingHorizontal: 32, marginBottom: 10 },
  restartText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  backBtn: { paddingVertical: 10 },
  backText: { color: colors.textMuted, fontSize: 14 },
})
