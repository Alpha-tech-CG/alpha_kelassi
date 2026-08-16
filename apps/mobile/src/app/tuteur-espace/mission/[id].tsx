import { useEffect, useState, useCallback } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, Linking } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../../lib/supabase'
import { API_URL } from '../../../lib/config'
import { colors, radius, cardShadow, fonts } from '../../../lib/theme'
import { pickAndUpload } from '../../../lib/uploads'

interface Detail {
  id: string
  status: 'assigned' | 'submitted' | 'delivered' | 'failed' | 'disputed' | 'pending'
  due_at: string | null
  attempts: number
  exercise_url: string | null
  work_url: string | null
  last_solution: { attempt: number; ai_status: 'pending' | 'ok' | 'error'; ai_feedback: string | null } | null
}

async function token() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}
async function api(path: string, init?: RequestInit) {
  const t = await token()
  const res = await fetch(`${API_URL}/api/tutor${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}`, ...(init?.headers ?? {}) },
  })
  return { ok: res.ok, status: res.status, json: await res.json().catch(() => ({})) }
}

export default function MissionScreen() {
  const { id, subject } = useLocalSearchParams<{ id: string; subject?: string }>()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<Detail | null>(null)   // null = mission pas encore acceptée (offre)
  const [accepting, setAccepting] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    const { ok, json } = await api(`/missions/${id}`)
    setDetail(ok ? json.data : null)   // 404 → encore une simple offre
    setLoading(false)
  }, [id])
  useEffect(() => { load() }, [load])

  async function accept() {
    setAccepting(true)
    const { ok, status, json } = await api(`/missions/${id}/accept`, { method: 'POST' })
    setAccepting(false)
    if (!ok) {
      if (status === 409) Alert.alert('Trop tard', 'Cette mission vient d’être prise par un autre tuteur.', [{ text: 'OK', onPress: () => router.back() }])
      else Alert.alert('Erreur', json.error?.message ?? 'Acceptation impossible.')
      return
    }
    await load()
  }

  async function submitSolution() {
    Alert.alert('Photo de ta correction', 'Prends une photo nette de ta correction manuscrite.', [
      { text: 'Prendre une photo', onPress: () => runSubmit('camera') },
      { text: 'Depuis la galerie', onPress: () => runSubmit('library') },
      { text: 'Annuler', style: 'cancel' },
    ])
  }
  async function runSubmit(source: 'camera' | 'library') {
    setSubmitting(true)
    try {
      const up = await pickAndUpload('tutor-solutions', source)
      if (!up) { setSubmitting(false); return }
      const { ok, json } = await api(`/missions/${id}/submit`, { method: 'POST', body: JSON.stringify({ photo_url: up.path }) })
      if (!ok) throw new Error(json.error?.message ?? 'Envoi impossible.')
      await load()
      Alert.alert('Envoyée ✅', 'Ta correction est en cours de vérification par l’IA.')
    } catch (e: any) {
      Alert.alert('Oups', e?.message ?? 'Envoi impossible.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>{subject ?? 'Mission'}</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Offre : pas encore acceptée */}
      {!detail && (
        <View style={styles.offer}>
          <Text style={styles.offerEmoji}>⚡</Text>
          <Text style={styles.offerTitle}>Nouvelle mission de correction</Text>
          <Text style={styles.offerSub}>En acceptant, tu as <Text style={{ fontWeight: '900', color: colors.text }}>1h30</Text> pour envoyer ta correction manuscrite. Récompense : <Text style={{ fontWeight: '900', color: '#0B8A46' }}>250 FCFA</Text>.</Text>
          <TouchableOpacity style={[styles.acceptBtn, accepting && { opacity: 0.6 }]} onPress={accept} disabled={accepting}>
            <Text style={styles.acceptText}>{accepting ? '…' : 'Accepter la mission'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Mission acceptée : contenu + soumission */}
      {detail && (
        <>
          {detail.due_at && detail.status === 'assigned' && (
            <View style={styles.dueBanner}><Text style={styles.dueText}>⏱️ À rendre avant {new Date(detail.due_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</Text></View>
          )}

          <Photo title="Énoncé de l’exercice" url={detail.exercise_url} />
          <Photo title="Travail de l’élève" url={detail.work_url} />

          {/* Retour IA (échec 1re tentative) */}
          {detail.last_solution?.ai_status === 'error' && (
            <View style={styles.feedback}>
              <Text style={styles.feedbackTitle}>⚠️ Correction à revoir (tentative {detail.last_solution.attempt}/2)</Text>
              <Text style={styles.feedbackText}>{detail.last_solution.ai_feedback}</Text>
            </View>
          )}

          {(detail.status === 'assigned') && (
            <TouchableOpacity style={[styles.submitBtn, submitting && { opacity: 0.6 }]} onPress={submitSolution} disabled={submitting}>
              <Text style={styles.submitText}>{submitting ? 'Envoi…' : detail.last_solution?.ai_status === 'error' ? 'Renvoyer ma correction' : '📷  Envoyer ma correction'}</Text>
            </TouchableOpacity>
          )}

          {detail.status === 'submitted' && (
            <View style={styles.waiting}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.waitingText}>Vérification IA en cours…</Text>
            </View>
          )}

          {(detail.status === 'delivered') && (
            <View style={styles.done}><Text style={styles.doneText}>✅ Correction validée et livrée à l’élève. 250 FCFA crédités.</Text></View>
          )}
        </>
      )}
    </ScrollView>
  )
}

function Photo({ title, url }: { title: string; url: string | null }) {
  if (!url) return null
  return (
    <View style={styles.photoCard}>
      <Text style={styles.photoTitle}>{title}</Text>
      <Image source={{ uri: url }} style={styles.photo} resizeMode="contain" />
      <TouchableOpacity onPress={() => Linking.openURL(url)}><Text style={styles.link}>Ouvrir en grand</Text></TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  back: { fontSize: 24, color: colors.text },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontFamily: fonts.headingBlack, color: colors.text },
  offer: { backgroundColor: colors.card, borderRadius: radius.xl, padding: 26, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder, marginTop: 20, ...cardShadow },
  offerEmoji: { fontSize: 46, marginBottom: 12 },
  offerTitle: { fontSize: 18, fontWeight: '900', color: colors.text, marginBottom: 8, textAlign: 'center' },
  offerSub: { fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 21, marginBottom: 22 },
  acceptBtn: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 15, paddingHorizontal: 30 },
  acceptText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  dueBanner: { backgroundColor: colors.primaryTint, borderRadius: radius.md, padding: 12, marginBottom: 16, alignItems: 'center' },
  dueText: { color: colors.primary, fontSize: 13, fontWeight: '800' },
  photoCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  photoTitle: { fontSize: 14, fontWeight: '800', color: colors.text, marginBottom: 10 },
  photo: { width: '100%', height: 260, borderRadius: radius.md, backgroundColor: colors.background },
  link: { color: colors.primary, fontSize: 13, fontWeight: '700', marginTop: 10, textAlign: 'center' },
  feedback: { backgroundColor: '#FFF3E0', borderRadius: radius.md, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#F5D9A8' },
  feedbackTitle: { fontSize: 13, fontWeight: '800', color: '#C77700', marginBottom: 6 },
  feedbackText: { fontSize: 13, color: '#8A5A00', lineHeight: 19 },
  submitBtn: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center', marginTop: 6, ...cardShadow },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  waiting: { flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center', padding: 18 },
  waitingText: { color: colors.textMuted, fontSize: 14, fontWeight: '700' },
  done: { backgroundColor: '#E6F7EE', borderRadius: radius.md, padding: 16, alignItems: 'center' },
  doneText: { color: '#0B8A46', fontSize: 14, fontWeight: '800', textAlign: 'center' },
})
