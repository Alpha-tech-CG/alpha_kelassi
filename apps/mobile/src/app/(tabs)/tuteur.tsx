import { useEffect, useRef, useState, useCallback } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, FlatList, Image, Animated,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native'
import { fetch as expoFetch } from 'expo/fetch'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { newRequestKey, planErrorOf } from '../../lib/billing'
import { colors, fonts, radius, cardShadow } from '../../lib/theme'
import { SolarIcon } from '../../icons/solar'

interface Message { id: string; role: 'user' | 'assistant'; content: string; streaming?: boolean }

export default function TuteurScreen() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [quotaRemaining, setQuotaRemaining] = useState<number | null>(null)
  const [quotaText, setQuotaText] = useState<string | null>(null)
  const [quotaReached, setQuotaReached] = useState(false)
  const listRef = useRef<FlatList>(null)

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100)
    }
  }, [messages])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return
    const question = input.trim()
    setInput('')
    setLoading(true)

    const userMsgId = Math.random().toString(36)
    const asstMsgId = Math.random().toString(36)
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, role: 'user', content: question },
      { id: asstMsgId, role: 'assistant', content: '', streaming: true },
    ])

    // Rafraîchit la session pour éviter d'envoyer un token expiré
    let token: string | undefined
    try {
      const { data } = await supabase.auth.getSession()
      token = data.session?.access_token
      if (!token) {
        const { data: refreshed } = await supabase.auth.refreshSession()
        token = refreshed.session?.access_token
      }
    } catch {}
    if (!token) {
      setMessages((prev) => prev.map((m) =>
        m.id === asstMsgId ? { ...m, content: '❌ Session expirée. Reconnecte-toi.', streaming: false } : m
      ))
      setLoading(false)
      return
    }

    let received = 0 // nb de caractères reçus (pour préserver le texte partiel)
    // Même clé pour la tentative et la nouvelle tentative : jamais décomptée deux fois.
    const requestKey = newRequestKey()

    // Applique une ligne SSE « data: {...} » au message en cours
    const applyLine = (line: string) => {
      if (!line.startsWith('data: ') || line.includes('"{}"}')) return
      try {
        const payload = JSON.parse(line.slice(6))
        if (payload.quota?.summary) {
          setQuotaText(`${payload.quota.summary} ${payload.quota.detail ?? ''}`.trim())
          setQuotaReached(false)
        }
        if (payload.text) {
          received += payload.text.length
          setMessages((prev) => prev.map((m) =>
            m.id === asstMsgId ? { ...m, content: m.content + payload.text } : m
          ))
        }
      } catch {}
    }

    // Une tentative complète : renvoie 'ok' | 'http' (erreur métier affichée) | throw (réseau)
    const runOnce = async (): Promise<'ok' | 'http'> => {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 45000)
      try {
        const res = await expoFetch(`${API_URL}/api/ai/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'Idempotency-Key': requestKey },
          body: JSON.stringify({ question, session_id: sessionId }),
          signal: controller.signal,
        })

        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          const planErr = planErrorOf(err)
          if (planErr?.code === 'QUOTA_EXCEEDED') {
            setQuotaRemaining(0)
            setQuotaReached(true)
            setQuotaText(planErr.message)
            setInput(question) // la question n'est pas perdue
          }
          setMessages((prev) => prev.map((m) =>
            m.id === asstMsgId ? { ...m, content: `❌ ${err.error?.message ?? 'Erreur'}`, streaming: false } : m
          ))
          return 'http'
        }

        const newSessionId = res.headers.get('X-Session-Id')
        const remaining = res.headers.get('X-Quota-Remaining')
        if (newSessionId && !sessionId) setSessionId(newSessionId)
        if (remaining) setQuotaRemaining(parseInt(remaining, 10))

        const reader = res.body?.getReader?.()
        if (reader) {
          const decoder = new TextDecoder()
          let buffer = ''
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? ''
            for (const line of lines) applyLine(line)
          }
          if (buffer) applyLine(buffer)
        } else {
          const full = await res.text()
          for (const line of full.split('\n')) applyLine(line)
        }
        return 'ok'
      } finally {
        clearTimeout(timer)
      }
    }

    try {
      await runOnce()
      setMessages((prev) => prev.map((m) =>
        m.id === asstMsgId ? { ...m, streaming: false } : m
      ))
    } catch {
      if (received > 0) {
        // La connexion a lâché en cours de route : on garde le texte déjà reçu
        setMessages((prev) => prev.map((m) =>
          m.id === asstMsgId ? { ...m, streaming: false } : m
        ))
      } else {
        // Rien reçu : on réessaie une fois avant d'abandonner
        try {
          await runOnce()
          setMessages((prev) => prev.map((m) =>
            m.id === asstMsgId ? { ...m, streaming: false } : m
          ))
        } catch {
          setMessages((prev) => prev.map((m) =>
            m.id === asstMsgId
              ? { ...m, content: received > 0 ? m.content : '❌ Connexion instable. Réessaie dans un instant.', streaming: false }
              : m
          ))
        }
      }
    } finally {
      setLoading(false)
    }
  }, [input, loading, sessionId])

  const SUGGESTIONS = [
    { subject: 'SVT', text: 'Explique la photosynthèse simplement' },
    { subject: 'Maths', text: 'Résous x² − 5x + 6 = 0 étape par étape' },
    { subject: 'Histoire', text: 'Raconte l’indépendance du Congo' },
    { subject: 'Français', text: 'Comment réussir un commentaire de texte ?' },
  ]

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* En-tête bleu arrondi, comme l'accueil */}
      <View style={styles.header}>
        <View style={styles.avatarRing}>
          <Image source={require('../../../assets/cognix-tutor-avatar.png')} style={styles.avatarImg} />
          <View style={styles.onlineDot} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Cognix</Text>
          <Text style={styles.headerSub}>Ton tuteur IA · disponible 24h/24</Text>
        </View>
        {quotaRemaining !== null && (
          <View
            style={[styles.quotaBadge, quotaRemaining <= 2 && styles.quotaBadgeLow]}
            accessible
            accessibilityLabel={quotaText ?? `${quotaRemaining} questions restantes aujourd’hui`}
          >
            <Text style={styles.quotaValue}>{quotaRemaining}</Text>
            <Text style={styles.quotaText}>question{quotaRemaining > 1 ? 's' : ''}</Text>
          </View>
        )}
      </View>

      {quotaReached && (
        <View style={styles.quotaNotice} accessibilityLiveRegion="polite">
          <Text style={styles.quotaNoticeText}>{quotaText ?? 'Ton quota quotidien Cognix IA est atteint. Il sera renouvelé demain.'}</Text>
          <TouchableOpacity onPress={() => router.push('/abonnement' as any)} accessibilityRole="button">
            <Text style={styles.quotaNoticeLink}>Voir les formules →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        contentContainerStyle={styles.messageContent}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.welcome}>
              <Image source={require('../../../assets/cognix-tutor.png')} style={styles.welcomeImg} resizeMode="contain" />
              <View style={styles.welcomeBubble}>
                <Text style={styles.welcomeTitle}>Salut ! Moi, c’est Cognix 👋</Text>
                <Text style={styles.welcomeText}>
                  Pose-moi une question sur tes cours : je t’explique pas à pas, avec des exemples, jusqu’à ce que ce soit clair.
                </Text>
              </View>
            </View>
            <Text style={styles.suggestTitle}>Pour commencer</Text>
            <View style={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <TouchableOpacity key={s.text} style={styles.suggestion} activeOpacity={0.85} onPress={() => setInput(s.text)}>
                  <Text style={styles.suggestionSubject}>{s.subject}</Text>
                  <Text style={styles.suggestionText}>{s.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.msgRow, item.role === 'user' && styles.msgRowUser]}>
            {item.role === 'assistant' && (
              <Image source={require('../../../assets/cognix-tutor-avatar.png')} style={styles.msgAvatar} />
            )}
            <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant]}>
              {item.role === 'assistant' && item.streaming && !item.content ? (
                <TypingDots />
              ) : (
                <Text style={[styles.bubbleText, item.role === 'user' && styles.bubbleTextUser]}>
                  {item.content}
                  {item.streaming && <Text style={styles.cursor}> ▍</Text>}
                </Text>
              )}
            </View>
          </View>
        )}
      />

      {/* Saisie */}
      <View style={styles.inputBar}>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            placeholder="Pose ta question à Cognix…"
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={2000}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
            onPress={sendMessage}
            disabled={!input.trim() || loading}
            accessibilityRole="button"
            accessibilityLabel="Envoyer"
          >
            {loading ? <ActivityIndicator size="small" color="#fff" /> : <SolarIcon name="send" size={20} color="#fff" />}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

/** Trois points qui ondulent pendant que Cognix prépare sa réponse. */
function TypingDots() {
  const dots = useRef([0, 1, 2].map(() => new Animated.Value(0))).current
  useEffect(() => {
    const loops = dots.map((d, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(d, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(d, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay((2 - i) * 150),
        ])
      )
    )
    loops.forEach((l) => l.start())
    return () => loops.forEach((l) => l.stop())
  }, [dots])
  return (
    <View style={styles.dots} accessibilityLabel="Cognix écrit…">
      {dots.map((d, i) => (
        <Animated.View
          key={i}
          style={[styles.dot, { opacity: d.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }), transform: [{ translateY: d.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }] }]}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.primary,
    paddingTop: 52, paddingHorizontal: 20, paddingBottom: 22, borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
  },
  avatarRing: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  avatarImg: { width: 50, height: 50, borderRadius: 25 },
  onlineDot: { position: 'absolute', right: 1, bottom: 2, width: 13, height: 13, borderRadius: 7, backgroundColor: '#22C55E', borderWidth: 2, borderColor: '#fff' },
  headerTitle: { fontSize: 20, fontFamily: fonts.headingBlack, color: '#fff' },
  headerSub: { fontSize: 12, color: '#ffffffd0', marginTop: 1 },
  quotaBadge: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
  quotaBadgeLow: { backgroundColor: 'rgba(229,57,53,0.9)' },
  quotaValue: { fontSize: 16, fontFamily: fonts.headingBlack, color: '#fff', lineHeight: 18 },
  quotaText: { fontSize: 9, color: '#fff' },
  quotaNotice: { backgroundColor: '#FFF8E6', marginHorizontal: 16, marginTop: 12, borderRadius: radius.lg, borderWidth: 1, borderColor: '#F2D48A', paddingHorizontal: 14, paddingVertical: 10 },
  quotaNoticeText: { fontSize: 13, color: '#5C4300' },
  quotaNoticeLink: { fontSize: 13, color: colors.text, fontFamily: fonts.body, marginTop: 4 },
  messageList: { flex: 1 },
  messageContent: { padding: 16, gap: 12, flexGrow: 1 },
  emptyState: { flex: 1, paddingTop: 4 },
  welcome: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 22 },
  welcomeImg: { width: 120, height: 120, marginLeft: -10 },
  welcomeBubble: {
    flex: 1, backgroundColor: colors.card, borderRadius: 20, borderBottomLeftRadius: 4, padding: 14,
    borderWidth: 1, borderColor: colors.cardBorder, marginBottom: 18, ...cardShadow,
  },
  welcomeTitle: { fontSize: 15, fontFamily: fonts.headingBlack, color: colors.text, marginBottom: 4 },
  welcomeText: { fontSize: 13, color: colors.textMuted, lineHeight: 19 },
  suggestTitle: { fontSize: 12, fontFamily: fonts.body, color: colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  suggestion: {
    width: '47%', flexGrow: 1, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder,
    borderRadius: 18, padding: 14, ...cardShadow,
  },
  suggestionSubject: { fontSize: 10, fontFamily: fonts.body, color: colors.primary, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 },
  suggestionText: { fontSize: 13, color: colors.text, lineHeight: 18 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowUser: { justifyContent: 'flex-end' },
  msgAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.cardBorder },
  bubble: { maxWidth: '82%', paddingHorizontal: 15, paddingVertical: 11, borderRadius: 20 },
  bubbleUser: { backgroundColor: colors.primary, borderBottomRightRadius: 6 },
  bubbleAssistant: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderBottomLeftRadius: 6, ...cardShadow },
  bubbleText: { fontSize: 14, color: colors.text, lineHeight: 21 },
  bubbleTextUser: { color: '#fff' },
  cursor: { color: colors.primary },
  dots: { flexDirection: 'row', gap: 5, paddingVertical: 6, paddingHorizontal: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  inputBar: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 12, backgroundColor: colors.background },
  inputWrap: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8, backgroundColor: colors.card, borderRadius: 26,
    borderWidth: 1, borderColor: colors.cardBorder, paddingLeft: 16, paddingRight: 6, paddingVertical: 6, ...cardShadow,
  },
  input: { flex: 1, fontSize: 14, color: colors.text, maxHeight: 120, paddingVertical: 8 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { opacity: 0.4 },
})
