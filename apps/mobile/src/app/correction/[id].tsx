import { useEffect, useState, useCallback } from 'react'
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert, Image, Linking } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'
import { STATUS } from './index'

interface Mission {
  id: string
  status: 'pending' | 'assigned' | 'submitted' | 'delivered' | 'failed' | 'disputed'
  attempts: number
  reward_fcfa: number
  due_at: string | null
  delivered_at: string | null
  ai_verdict: string | null
  created_at: string
  subjects?: { name: string } | null
  solution_url: string | null
}

async function token() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}
async function api(path: string, init?: RequestInit) {
  const t = await token()
  const res = await fetch(`${API_URL}/api/corrections${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}`, ...(init?.headers ?? {}) },
  })
  return { ok: res.ok, json: await res.json().catch(() => ({})) }
}

const STEPS: { key: Mission['status']; label: string }[] = [
  { key: 'pending', label: 'Envoyé' },
  { key: 'assigned', label: 'Pris en charge' },
  { key: 'delivered', label: 'Corrigé' },
]
const ORDER: Record<Mission['status'], number> = { pending: 0, assigned: 1, submitted: 1, delivered: 2, failed: 2, disputed: 2 }

export default function CorrectionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [m, setM] = useState<Mission | null>(null)
  const [loading, setLoading] = useState(true)
  const [rate, setRate] = useState({ open: false, clarity: 0, quality: 0, comment: '' })
  const [dispute, setDispute] = useState({ open: false, text: '' })
  const [sending, setSending] = useState(false)

  const load = useCallback(async () => {
    const { ok, json } = await api(`/${id}`)
    if (ok) setM(json.data)
    setLoading(false)
  }, [id])
  useEffect(() => { load() }, [load])

  async function submitRate() {
    if (!rate.clarity || !rate.quality || sending) return
    setSending(true)
    const { ok, json } = await api(`/${id}/rate`, { method: 'POST', body: JSON.stringify({ clarity: rate.clarity, quality: rate.quality, comment: rate.comment || undefined }) })
    setSending(false)
    if (!ok) return Alert.alert('Erreur', json.error?.message ?? 'Notation impossible.')
    setRate({ open: false, clarity: 0, quality: 0, comment: '' })
    Alert.alert('Merci !', 'Ta note aide les autres élèves.')
  }

  async function submitDispute() {
    if (dispute.text.trim().length < 10 || sending) return
    setSending(true)
    const { ok, json } = await api(`/${id}/dispute`, { method: 'POST', body: JSON.stringify({ description: dispute.text.trim() }) })
    setSending(false)
    if (!ok) return Alert.alert('Erreur', json.error?.message ?? 'Contestation impossible.')
    setDispute({ open: false, text: '' })
    await load()
    Alert.alert('Contestation envoyée', 'L’IA analyse ta correction et te répondra sous peu.')
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />
  if (!m) return (
    <View style={styles.center}><Text style={styles.muted}>Correction introuvable.</Text></View>
  )

  const step = ORDER[m.status]
  const s = STATUS[m.status]

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{m.subjects?.name ?? 'Correction'}</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Statut */}
      <View style={[styles.statusBadge, { backgroundColor: s.bg }]}><Text style={[styles.statusText, { color: s.fg }]}>{s.label}</Text></View>

      {/* Stepper */}
      <View style={styles.stepper}>
        {STEPS.map((st, i) => {
          const done = i <= step
          return (
            <View key={st.key} style={styles.stepItem}>
              <View style={[styles.dot, done && styles.dotOn]}><Text style={[styles.dotText, done && { color: '#fff' }]}>{i < step ? '✓' : i + 1}</Text></View>
              <Text style={[styles.stepLabel, done && { color: colors.text }]}>{st.label}</Text>
              {i < STEPS.length - 1 && <View style={[styles.stepLine, i < step && styles.stepLineOn]} />}
            </View>
          )
        })}
      </View>

      {m.status === 'assigned' && m.due_at && (
        <Text style={styles.eta}>⏱️ Rendu estimé avant {new Date(m.due_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</Text>
      )}

      {/* Résultat livré */}
      {(m.status === 'delivered' || m.status === 'disputed') && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>La correction</Text>
          {m.solution_url ? (
            <>
              <Image source={{ uri: m.solution_url }} style={styles.solution} resizeMode="contain" />
              <TouchableOpacity onPress={() => Linking.openURL(m.solution_url!)}><Text style={styles.link}>Ouvrir en grand</Text></TouchableOpacity>
            </>
          ) : m.ai_verdict ? (
            <View>
              <View style={styles.aiTag}><Text style={styles.aiTagText}>Corrigé par l’IA</Text></View>
              <Text style={styles.aiText}>{m.ai_verdict}</Text>
            </View>
          ) : (
            <Text style={styles.muted}>Correction en cours de livraison…</Text>
          )}
        </View>
      )}

      {/* Actions après livraison (uniquement si tuteur humain) */}
      {m.status === 'delivered' && m.solution_url && (
        <View style={styles.actions}>
          {!rate.open ? (
            <TouchableOpacity style={styles.actionOutline} onPress={() => setRate((r) => ({ ...r, open: true }))}>
              <Text style={styles.actionOutlineText}>★ Noter le tuteur</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Noter le tuteur</Text>
              <StarRow label="Clarté" value={rate.clarity} onChange={(v) => setRate((r) => ({ ...r, clarity: v }))} />
              <StarRow label="Qualité" value={rate.quality} onChange={(v) => setRate((r) => ({ ...r, quality: v }))} />
              <TextInput style={styles.input} placeholder="Commentaire (optionnel)" placeholderTextColor={colors.textMuted} value={rate.comment} onChangeText={(t) => setRate((r) => ({ ...r, comment: t }))} multiline maxLength={500} />
              <TouchableOpacity style={[styles.primaryBtn, (!rate.clarity || !rate.quality) && { opacity: 0.5 }]} onPress={submitRate} disabled={!rate.clarity || !rate.quality || sending}>
                <Text style={styles.primaryBtnText}>{sending ? '…' : 'Envoyer ma note'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {!dispute.open ? (
            <TouchableOpacity style={styles.actionGhost} onPress={() => setDispute((d) => ({ ...d, open: true }))}>
              <Text style={styles.actionGhostText}>Contester la correction</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Contester</Text>
              <TextInput style={styles.input} placeholder="Explique ce qui te semble incorrect (min. 10 caractères)…" placeholderTextColor={colors.textMuted} value={dispute.text} onChangeText={(t) => setDispute((d) => ({ ...d, text: t }))} multiline maxLength={1000} />
              <TouchableOpacity style={[styles.primaryBtn, dispute.text.trim().length < 10 && { opacity: 0.5 }]} onPress={submitDispute} disabled={dispute.text.trim().length < 10 || sending}>
                <Text style={styles.primaryBtnText}>{sending ? '…' : 'Envoyer la contestation'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  )
}

function StarRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <View style={styles.starRow}>
      <Text style={styles.starLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => onChange(n)}>
            <Text style={[styles.star, n <= value && styles.starOn]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 60 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  back: { fontSize: 24, color: colors.text },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontFamily: fonts.headingBlack, color: colors.text },
  muted: { color: colors.textMuted, fontSize: 13 },
  statusBadge: { alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.full, marginBottom: 22 },
  statusText: { fontSize: 12, fontWeight: '800' },
  stepper: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingHorizontal: 6 },
  stepItem: { flex: 1, alignItems: 'center', position: 'relative' },
  dot: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.cardBorder, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  dotOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  dotText: { fontSize: 12, fontWeight: '800', color: colors.textMuted },
  stepLabel: { fontSize: 11, color: colors.textMuted, marginTop: 6, fontWeight: '700' },
  stepLine: { position: 'absolute', top: 15, left: '60%', right: '-40%', height: 2, backgroundColor: colors.cardBorder, zIndex: 1 },
  stepLineOn: { backgroundColor: colors.primary },
  eta: { textAlign: 'center', fontSize: 12, color: colors.primary, fontWeight: '700', marginTop: 12 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, marginTop: 18, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.text, marginBottom: 12 },
  solution: { width: '100%', height: 320, borderRadius: radius.md, backgroundColor: colors.background },
  link: { color: colors.primary, fontSize: 13, fontWeight: '700', marginTop: 10, textAlign: 'center' },
  aiTag: { alignSelf: 'flex-start', backgroundColor: '#E6F7EE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full, marginBottom: 10 },
  aiTagText: { color: '#0B8A46', fontSize: 11, fontWeight: '800' },
  aiText: { fontSize: 14, color: colors.text, lineHeight: 21 },
  actions: { marginTop: 18, gap: 12 },
  actionOutline: { borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.lg, paddingVertical: 14, alignItems: 'center' },
  actionOutlineText: { color: colors.primary, fontSize: 14, fontWeight: '800' },
  actionGhost: { paddingVertical: 12, alignItems: 'center' },
  actionGhostText: { color: colors.textMuted, fontSize: 13, fontWeight: '700', textDecorationLine: 'underline' },
  starRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  starLabel: { fontSize: 14, color: colors.text, fontWeight: '700' },
  star: { fontSize: 28, color: colors.cardBorder },
  starOn: { color: colors.yellow },
  input: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.md, padding: 12, fontSize: 14, color: colors.text, minHeight: 60, marginTop: 8, marginBottom: 12, textAlignVertical: 'top' },
  primaryBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
})
