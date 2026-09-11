import { useEffect, useState, useRef, useCallback } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { colors, radius, fonts } from '../../lib/theme'
import { newRequestKey, planErrorOf } from '../../lib/billing'
import { useBilling } from '../../hooks/useBilling'

interface Msg { id: string; sender_id: string; content: string; created_at: string; is_priority?: boolean }

async function getToken() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [groupName, setGroupName] = useState('Groupe')
  const [messages, setMessages] = useState<Msg[]>([])
  const [names, setNames] = useState<Record<string, string>>({})
  const [meId, setMeId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [priority, setPriority] = useState(false)
  const { me, can } = useBilling()
  const canWrite = !me || can('study_groups')
  const listRef = useRef<FlatList>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setMeId(user?.id ?? null)
      const { data: g } = await supabase.from('study_groups').select('name').eq('id', id).maybeSingle()
      setGroupName((g as { name?: string } | null)?.name ?? 'Groupe')

      const { data: msgs } = await supabase.from('group_messages')
        .select('*').eq('group_id', id)
        .order('created_at', { ascending: true }).limit(100)
      setMessages((msgs ?? []) as Msg[])

      const { data: members } = await supabase.from('group_members').select('user_id').eq('group_id', id)
      const ids = (members ?? []).map((m: any) => m.user_id)
      if (ids.length) {
        const { data: profs } = await supabase.from('public_profiles').select('id, full_name').in('id', ids)
        const map: Record<string, string> = {}
        for (const p of (profs ?? []) as { id: string; full_name: string | null }[]) map[p.id] = p.full_name ?? 'Membre'
        setNames(map)
      }
      setLoading(false)
    }
    load()
  }, [id])

  // Temps réel : nouveaux messages du groupe (RLS filtre déjà les bloqués).
  useEffect(() => {
    const ch = supabase.channel(`group:${id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'group_messages', filter: `group_id=eq.${id}` },
        (payload) => {
          const m = payload.new as Msg & { ai_blocked?: boolean }
          if (m.ai_blocked) return
          setMessages((prev) => prev.some((x) => x.id === m.id) ? prev : [...prev, m])
        })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [id])

  useEffect(() => {
    if (messages.length) setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80)
  }, [messages])

  const send = useCallback(async () => {
    const content = input.trim()
    if (!content || sending) return
    setSending(true)
    const token = await getToken()
    const res = await fetch(`${API_URL}/api/groups/${id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'Idempotency-Key': newRequestKey() },
      body: JSON.stringify({ content, priority }),
    })
    const json = await res.json().catch(() => ({}))
    setSending(false)
    const planErr = planErrorOf(json)
    if (planErr) {
      // Le message saisi est conservé.
      Alert.alert(
        planErr.code === 'QUOTA_EXCEEDED' ? 'Quota atteint' : 'Formule requise',
        planErr.info ? `${planErr.info.title} ${planErr.info.body}` : planErr.message,
        planErr.info
          ? [{ text: 'Voir les formules', onPress: () => router.push(`/abonnement?plan=${planErr.info!.requiredPlan}` as any) }, { text: 'Plus tard', style: 'cancel' }]
          : [{ text: 'OK' }],
      )
      if (planErr.code === 'QUOTA_EXCEEDED') setPriority(false)
      return
    }
    if (res.ok) {
      setInput('')
      setPriority(false)
      // Repli si le temps réel n'a pas encore livré le message.
      if (json.data) setMessages((prev) => prev.some((x) => x.id === json.data.id) ? prev : [...prev, json.data])
    } else if (json.error?.code === 'BLOCKED') {
      Alert.alert('Message bloqué 🛡️', json.error.message ?? 'Ce message enfreint les règles de la communauté.')
    } else {
      Alert.alert('Erreur', json.error?.message ?? 'Envoi impossible.')
    }
  }, [input, sending, id, priority, router])

  async function flag(m: Msg) {
    if (m.sender_id === meId) return
    Alert.alert('Signaler ce message ?', 'Un modérateur Cognix l\'examinera.', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Signaler', style: 'destructive', onPress: async () => {
        if (!meId) return
        await supabase.from('moderation_flags').insert({
          message_id: m.id, flagged_user_id: m.sender_id, reporter_id: meId, reason: 'Signalé par un membre',
        })
        Alert.alert('Merci', 'Le signalement a été envoyé.')
      } },
    ])
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{groupName}</Text>
        <View style={{ width: 20 }} />
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Aucun message. Lance la discussion !</Text>}
        renderItem={({ item }) => {
          const mine = item.sender_id === meId
          return (
            <TouchableOpacity activeOpacity={0.8} onLongPress={() => flag(item)} style={[styles.row, mine && styles.rowMine]}>
              <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther, item.is_priority && styles.bubblePriority]}>
                {item.is_priority && <Text style={[styles.priorityTag, mine && { color: '#fff' }]}>⚡ Question prioritaire</Text>}
                {!mine && <Text style={styles.sender}>{names[item.sender_id] ?? 'Membre'}</Text>}
                <Text style={[styles.msgText, mine && { color: '#fff' }]}>{item.content}</Text>
              </View>
            </TouchableOpacity>
          )
        }}
      />

      {!canWrite && (
        <TouchableOpacity style={styles.readOnly} onPress={() => router.push('/abonnement?plan=starter' as any)} accessibilityRole="button">
          <Text style={styles.readOnlyText}>Lecture seule avec la formule Gratuit. Participe aux discussions dès Starter (4 000 FCFA / mois) →</Text>
        </TouchableOpacity>
      )}
      {canWrite && (
        <TouchableOpacity
          style={styles.priorityRow}
          onPress={() => {
            if (me && !can('priority_study_groups')) {
              Alert.alert('Questions prioritaires', 'Mettre une question en avant pour les enseignants et tuteurs du groupe est inclus dans Pro (3 par jour) et illimité en Pro Max.', [
                { text: 'Voir les formules', onPress: () => router.push('/abonnement?plan=pro' as any) }, { text: 'Plus tard', style: 'cancel' },
              ])
              return
            }
            setPriority((p) => !p)
          }}
          accessibilityRole="switch"
          accessibilityState={{ checked: priority }}
        >
          <Text style={styles.priorityText}>{priority ? '⚡ Question prioritaire activée' : '⚡ Marquer comme question prioritaire'}{me && !can('priority_study_groups') ? ' · Pro' : ''}</Text>
        </TouchableOpacity>
      )}
      <View style={styles.inputBar}>
        <TextInput style={styles.input} placeholder={canWrite ? 'Écris un message…' : 'Lecture seule'} placeholderTextColor={colors.textMuted}
          value={input} onChangeText={setInput} multiline maxLength={2000} editable={canWrite} accessibilityLabel="Message" />
        <TouchableOpacity style={[styles.sendBtn, (!input.trim() || sending || !canWrite) && { opacity: 0.4 }]} onPress={send} disabled={!input.trim() || sending || !canWrite} accessibilityRole="button" accessibilityLabel="Envoyer">
          {sending ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.sendText}>↑</Text>}
        </TouchableOpacity>
      </View>
      <Text style={styles.modHint}>🛡️ Messages modérés par IA · appui long pour signaler</Text>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.card, paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  back: { fontSize: 24, color: colors.text },
  title: { flex: 1, textAlign: 'center', fontSize: 17, fontFamily: fonts.headingBlack, color: colors.text },
  list: { padding: 14, gap: 8, flexGrow: 1 },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 40, fontSize: 13 },
  row: { flexDirection: 'row' },
  rowMine: { justifyContent: 'flex-end' },
  bubble: { maxWidth: '82%', paddingHorizontal: 13, paddingVertical: 9, borderRadius: 16 },
  bubbleMine: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.cardBorder, borderBottomLeftRadius: 4 },
  sender: { fontSize: 11, fontWeight: '800', color: colors.primary, marginBottom: 2 },
  msgText: { fontSize: 14, color: colors.text, lineHeight: 19 },
  bubblePriority: { borderWidth: 2, borderColor: '#F2B705' },
  priorityTag: { fontSize: 10, fontWeight: '900', color: '#8A5A00', marginBottom: 2 },
  readOnly: { backgroundColor: '#FFF8E6', paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F2D48A' },
  readOnlyText: { fontSize: 12, color: '#5C4300', fontWeight: '700' },
  priorityRow: { backgroundColor: colors.card, paddingHorizontal: 14, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.cardBorder },
  priorityText: { fontSize: 12, fontWeight: '800', color: colors.textMuted },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.cardBorder, paddingHorizontal: 12, paddingTop: 10 },
  input: { flex: 1, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9, fontSize: 14, color: colors.text, maxHeight: 110 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  modHint: { fontSize: 10, color: colors.textMuted, textAlign: 'center', paddingVertical: 6, backgroundColor: colors.card },
})
