import { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  ScrollView,
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
  lessons: {
    title: string
    chapters: { title: string; subjects: { name: string } | null } | null
  } | null
}

interface FlashcardSource {
  id: string
  title: string
  chapter_title: string
  subject_name: string
  has_cards: boolean
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
  const [loadError, setLoadError] = useState('')
  const [done, setDone] = useState(false)
  const [stats, setStats] = useState({ reviewed: 0, correct: 0 })
  const [reviewing, setReviewing] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [sources, setSources] = useState<FlashcardSource[]>([])
  const [sourcesLoading, setSourcesLoading] = useState(true)
  const [showGenerator, setShowGenerator] = useState(false)
  const [selectedSourceId, setSelectedSourceId] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generationError, setGenerationError] = useState('')
  const [generationMessage, setGenerationMessage] = useState('')
  const [remaining, setRemaining] = useState<number | null>(null)
  const [limit, setLimit] = useState<number | null>(null)
  const flipAnim = new Animated.Value(0)

  useEffect(() => {
    void loadCards()
    void loadSources()
  }, [])

  async function getToken() {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.access_token) throw new Error('Ta session a expiré. Reconnecte-toi.')
    return session?.access_token
  }

  async function loadCards() {
    setLoading(true)
    setLoadError('')
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/flashcards/due?limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!res.ok || !Array.isArray(json?.data))
        throw new Error(
          json?.error?.message ?? `Impossible de charger les cartes (HTTP ${res.status}).`
        )
      setCards(json.data)
      setIndex(0)
      setFlipped(false)
      setDone((json.data ?? []).length === 0)
      setStats({ reviewed: 0, correct: 0 })
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : 'Impossible de charger les cartes. Réessaie.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function loadSources() {
    setSourcesLoading(true)
    setGenerationError('')
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/flashcards/sources`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !Array.isArray(json?.data))
        throw new Error(
          json?.error?.message ?? `Impossible de charger les cours (HTTP ${res.status}).`
        )
      setSources(json.data)
      setRemaining(typeof json.remaining === 'number' ? json.remaining : null)
      setLimit(typeof json.limit === 'number' ? json.limit : null)
      setSelectedSourceId(
        (current) =>
          json.data.find((source: FlashcardSource) => source.id === current && !source.has_cards)
            ?.id ??
          json.data.find((source: FlashcardSource) => !source.has_cards)?.id ??
          json.data[0]?.id ??
          ''
      )
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : 'Impossible de charger les cours. Réessaie.'
      )
    } finally {
      setSourcesLoading(false)
    }
  }

  function flip() {
    const toValue = flipped ? 0 : 1
    Animated.spring(flipAnim, { toValue, useNativeDriver: true, friction: 8 }).start()
    setFlipped((f) => !f)
  }

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  })

  const review = useCallback(
    async (quality: number) => {
      if (!cards[index] || reviewing) return
      setReviewing(true)
      setReviewError('')
      try {
        const token = await getToken()
        const res = await fetch(`${API_URL}/api/flashcards/review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ flashcard_id: cards[index].id, quality }),
        })
        const json = await res.json().catch(() => null)
        if (!res.ok || !json?.data)
          throw new Error(
            json?.error?.message ?? `La révision n’a pas été enregistrée (HTTP ${res.status}).`
          )
        setStats((s) => ({ reviewed: s.reviewed + 1, correct: s.correct + (quality >= 3 ? 1 : 0) }))
        const next = index + 1
        if (next >= cards.length) {
          setDone(true)
        } else {
          setIndex(next)
          setFlipped(false)
          flipAnim.setValue(0)
        }
      } catch (error) {
        setReviewError(
          error instanceof Error ? error.message : 'La révision n’a pas été enregistrée. Réessaie.'
        )
      } finally {
        setReviewing(false)
      }
    },
    [cards, index, reviewing]
  )

  async function generateCards() {
    if (!selectedSourceId || generating) return
    setGenerating(true)
    setGenerationError('')
    setGenerationMessage('')
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/flashcards/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ lesson_id: selectedSourceId, count: 5 }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !Array.isArray(json?.data))
        throw new Error(json?.error?.message ?? `La génération a échoué (HTTP ${res.status}).`)
      setGenerationMessage(
        `${json.count ?? json.data.length} cartes créées. Elles sont prêtes à réviser.`
      )
      await Promise.all([loadCards(), loadSources()])
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : 'La génération a échoué. Réessaie.'
      )
    } finally {
      setGenerating(false)
    }
  }

  const generatorPanel = (
    <View style={styles.generator}>
      <TouchableOpacity
        style={styles.generatorHeader}
        onPress={() => setShowGenerator((value) => !value)}
        accessibilityRole="button"
        accessibilityState={{ expanded: showGenerator }}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.generatorTitle}>Créer des cartes depuis un cours</Text>
          <Text style={styles.generatorSub}>Choisis une leçon de ton parcours.</Text>
        </View>
        <Text style={styles.generatorToggle}>{showGenerator ? '−' : '+'}</Text>
      </TouchableOpacity>
      {showGenerator && (
        <View style={styles.generatorBody}>
          {limit !== null && (
            <Text style={styles.generatorSub}>
              {remaining} carte{remaining === 1 ? '' : 's'} restante{remaining === 1 ? '' : 's'} sur{' '}
              {limit} en formule gratuite.
            </Text>
          )}
          {sourcesLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : sources.length === 0 ? (
            <Text style={styles.generatorSub}>
              Aucun cours avec contenu n’est disponible pour ton parcours.
            </Text>
          ) : (
            <>
              <ScrollView style={styles.sourceList} nestedScrollEnabled>
                {sources.map((source) => (
                  <TouchableOpacity
                    key={source.id}
                    disabled={source.has_cards}
                    onPress={() => setSelectedSourceId(source.id)}
                    style={[
                      styles.sourceOption,
                      selectedSourceId === source.id && styles.sourceSelected,
                      source.has_cards && styles.sourceDisabled,
                    ]}
                  >
                    <Text style={styles.sourceTitle}>
                      {source.subject_name} · {source.chapter_title}
                    </Text>
                    <Text style={styles.sourceSub}>
                      {source.title}
                      {source.has_cards ? ' · Cartes déjà créées' : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[
                  styles.generateBtn,
                  (generating ||
                    !selectedSourceId ||
                    remaining === 0 ||
                    Boolean(sources.find((source) => source.id === selectedSourceId)?.has_cards)) &&
                    styles.disabledBtn,
                ]}
                onPress={() => void generateCards()}
                disabled={
                  generating ||
                  !selectedSourceId ||
                  remaining === 0 ||
                  Boolean(sources.find((source) => source.id === selectedSourceId)?.has_cards)
                }
              >
                {generating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.generateText}>Générer mes cartes</Text>
                )}
              </TouchableOpacity>
            </>
          )}
          {generationError ? (
            <View>
              <Text accessibilityRole="alert" style={styles.errorText}>
                {generationError}
              </Text>
              {sources.length === 0 && (
                <TouchableOpacity onPress={() => void loadSources()}>
                  <Text style={styles.retryText}>Recharger les cours</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
          {generationMessage ? <Text style={styles.successText}>{generationMessage}</Text> : null}
          {remaining === 0 ? (
            <Text style={styles.generatorSub}>
              Quota gratuit atteint. Passe à Starter pour créer plus de cartes.
            </Text>
          ) : null}
        </View>
      )}
    </View>
  )

  if (loading)
    return (
      <ActivityIndicator
        style={{ flex: 1, backgroundColor: colors.background }}
        color={colors.primary}
      />
    )

  if (loadError) {
    return (
      <View style={styles.center}>
        <Text accessibilityRole="alert" style={styles.errorText}>
          {loadError}
        </Text>
        <TouchableOpacity style={styles.restartBtn} onPress={() => void loadCards()}>
          <Text style={styles.restartText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (done) {
    const pct = stats.reviewed > 0 ? Math.round((stats.correct / stats.reviewed) * 100) : 0
    return (
      <ScrollView
        contentContainerStyle={styles.doneContainer}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <Text style={styles.doneEmoji}>{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</Text>
        <Text style={styles.doneTitle}>Session terminée !</Text>
        {stats.reviewed > 0 ? (
          <Text style={styles.doneScore}>{pct}% de réussite</Text>
        ) : (
          <Text style={styles.doneSub}>Aucune carte à réviser aujourd'hui.</Text>
        )}
        {generatorPanel}
        <TouchableOpacity
          style={styles.restartBtn}
          onPress={() => {
            setStats({ reviewed: 0, correct: 0 })
            loadCards()
          }}
        >
          <Text style={styles.restartText}>Recommencer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Retour</Text>
        </TouchableOpacity>
      </ScrollView>
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.activeContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.counter}>
          {index + 1} / {cards.length}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {card.lessons ? (
        <Text style={styles.context}>
          {card.lessons.chapters?.subjects?.name} · {card.lessons.chapters?.title} —{' '}
          {card.lessons.title}
        </Text>
      ) : card.documents ? (
        <Text style={styles.context}>
          {card.documents.subjects?.name} · {card.documents.title}
        </Text>
      ) : null}
      {generatorPanel}
      {reviewError ? (
        <Text accessibilityRole="alert" style={styles.errorText}>
          {reviewError}
        </Text>
      ) : null}

      {/* Carte animée */}
      <TouchableOpacity activeOpacity={0.9} onPress={flip} style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardFront,
            { transform: [{ rotateY: frontInterpolate }] },
          ]}
        >
          <Text style={styles.cardLabel}>Question</Text>
          <Text style={styles.cardText}>{card.front}</Text>
          <Text style={styles.tapHint}>Appuie pour voir la réponse</Text>
        </Animated.View>
        <Animated.View
          style={[styles.cardFace, styles.cardBack, { transform: [{ rotateY: backInterpolate }] }]}
        >
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
              <TouchableOpacity
                key={q}
                disabled={reviewing}
                style={[
                  styles.qualityBtn,
                  { backgroundColor: bg },
                  reviewing && styles.disabledBtn,
                ]}
                onPress={() => void review(q)}
              >
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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 56 },
  activeContainer: { paddingBottom: 40 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  back: { fontSize: 24, color: colors.text },
  counter: { fontSize: 14, color: colors.textMuted, fontWeight: '700' },
  progressBar: {
    height: 6,
    backgroundColor: colors.primaryTint,
    marginHorizontal: 20,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  context: { textAlign: 'center', fontSize: 12, color: colors.textMuted, marginBottom: 16 },
  cardContainer: { marginHorizontal: 20, height: 240, marginBottom: 24 },
  cardFace: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backfaceVisibility: 'hidden',
  },
  cardFront: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...cardShadow,
  },
  cardBack: { backgroundColor: '#EAF6EE', borderWidth: 1, borderColor: colors.primary },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 26,
  },
  tapHint: { position: 'absolute', bottom: 16, fontSize: 11, color: colors.outlineVariant },
  qualities: { paddingHorizontal: 20 },
  qualityHint: { textAlign: 'center', fontSize: 13, color: colors.textMuted, marginBottom: 10 },
  qualityRow: { flexDirection: 'row', gap: 8 },
  qualityBtn: { flex: 1, paddingVertical: 14, borderRadius: radius.md, alignItems: 'center' },
  qualityText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  flipBtn: {
    marginHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 16,
    alignItems: 'center',
    ...cardShadow,
  },
  flipBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  doneEmoji: { fontSize: 56, marginBottom: 16 },
  doneTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginBottom: 8 },
  doneScore: { fontSize: 30, fontWeight: '800', color: colors.primary, marginBottom: 24 },
  doneSub: { fontSize: 14, color: colors.textMuted, marginBottom: 24 },
  doneContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    paddingTop: 56,
    paddingBottom: 40,
  },
  generator: {
    width: '100%',
    marginBottom: 16,
    padding: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#E4D9F8',
    backgroundColor: colors.card,
  },
  generatorHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  generatorTitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  generatorSub: { fontSize: 12, lineHeight: 18, color: colors.textMuted, marginTop: 4 },
  generatorToggle: { fontSize: 24, fontWeight: '800', color: colors.primary, paddingHorizontal: 6 },
  generatorBody: { gap: 10, marginTop: 12 },
  sourceList: { maxHeight: 180 },
  sourceOption: {
    padding: 10,
    marginBottom: 6,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: '#fff',
  },
  sourceSelected: { borderColor: colors.primary, backgroundColor: '#EEF5FF' },
  sourceDisabled: { opacity: 0.5 },
  sourceTitle: { fontSize: 12, fontWeight: '800', color: colors.text },
  sourceSub: { fontSize: 11, color: colors.textMuted, marginTop: 3 },
  generateBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  generateText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  disabledBtn: { opacity: 0.5 },
  errorText: { color: colors.red, textAlign: 'center', fontSize: 13, marginBottom: 10 },
  retryText: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  successText: { color: colors.primary, textAlign: 'center', fontSize: 13 },
  restartBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 10,
  },
  restartText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  backBtn: { paddingVertical: 10 },
  backText: { color: colors.textMuted, fontSize: 14 },
})
