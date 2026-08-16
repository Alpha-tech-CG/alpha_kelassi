import { useState, useCallback } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Switch, RefreshControl } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'

interface Profile {
  user_id: string
  is_verified: boolean
  is_active: boolean
  score: number
  wallet_balance: number
  subjects?: { subject_id: string; subjects?: { name: string } | null }[]
}
interface Mission { id: string; subject_id: string; created_at: string; subjects?: { name: string } | null }

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
  return { ok: res.ok, json: await res.json().catch(() => ({})) }
}

export default function TuteurEspace() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [missions, setMissions] = useState<Mission[]>([])

  const load = useCallback(async () => {
    const { json } = await api('/me')
    const p: Profile | null = json.data ?? null
    setProfile(p)
    if (p?.is_verified) {
      const { json: mj } = await api('/missions')
      setMissions(mj.data ?? [])
    }
    setLoading(false)
    setRefreshing(false)
  }, [])
  useFocusEffect(useCallback(() => { load() }, [load]))

  async function toggleOnline(value: boolean) {
    setProfile((p) => p ? { ...p, is_active: value } : p)
    await api('/me', { method: 'PATCH', body: JSON.stringify({ is_active: value }) })
    if (value) load()
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load() }} tintColor={colors.primary} />}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Espace tuteur</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Non inscrit */}
      {!profile && (
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🧑‍🏫</Text>
          <Text style={styles.heroTitle}>Deviens tuteur Kelassi</Text>
          <Text style={styles.heroSub}>Corrige des exercices d’élèves et gagne de l’argent. 250 FCFA par correction validée.</Text>
          <TouchableOpacity style={styles.heroBtn} onPress={() => router.push('/tuteur-espace/inscription')}>
            <Text style={styles.heroBtnText}>Commencer l’inscription</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* En attente de validation */}
      {profile && !profile.is_verified && (
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>⏳</Text>
          <Text style={styles.heroTitle}>En attente de validation</Text>
          <Text style={styles.heroSub}>Ton dossier est en cours de vérification par l’équipe Cognix (sous 24h). Tu recevras une notification dès qu’il est validé.</Text>
        </View>
      )}

      {/* Dashboard tuteur vérifié */}
      {profile?.is_verified && (
        <>
          <View style={styles.statusCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>{profile.is_active ? 'En ligne' : 'Hors ligne'}</Text>
              <Text style={styles.statusSub}>{profile.is_active ? 'Tu reçois les nouvelles missions' : 'Active pour recevoir des missions'}</Text>
            </View>
            <Switch value={profile.is_active} onValueChange={toggleOnline} trackColor={{ true: colors.primary, false: '#CBD5C7' }} thumbColor="#fff" />
          </View>

          <View style={styles.kpis}>
            <TouchableOpacity style={styles.kpi} onPress={() => router.push('/tuteur-espace/wallet')}>
              <Text style={styles.kpiValue}>{profile.wallet_balance.toLocaleString('fr-FR')}</Text>
              <Text style={styles.kpiLabel}>FCFA · Portefeuille</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.kpi} onPress={() => router.push('/tuteur-espace/score')}>
              <Text style={styles.kpiValue}>{profile.score.toFixed(1)}<Text style={styles.kpiUnit}> /5</Text></Text>
              <Text style={styles.kpiLabel}>Score · Avis</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Missions disponibles</Text>
          {!profile.is_active ? (
            <Text style={styles.empty}>Passe en ligne pour voir les missions.</Text>
          ) : missions.length === 0 ? (
            <Text style={styles.empty}>Aucune mission pour l’instant. Reste en ligne, on te notifie dès qu’il y en a une.</Text>
          ) : (
            missions.map((m) => (
              <TouchableOpacity key={m.id} style={styles.missionCard} onPress={() => router.push(`/tuteur-espace/mission/${m.id}?subject=${encodeURIComponent(m.subjects?.name ?? '')}`)}>
                <View style={styles.missionIcon}><Text style={{ fontSize: 20 }}>✍️</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.missionSubject}>{m.subjects?.name ?? 'Exercice'}</Text>
                  <Text style={styles.missionDate}>Reçue {new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                <View style={styles.reward}><Text style={styles.rewardText}>250 FCFA</Text></View>
              </TouchableOpacity>
            ))
          )}
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 56, paddingBottom: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  hero: { backgroundColor: colors.card, borderRadius: radius.xl, padding: 26, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder, marginTop: 20, ...cardShadow },
  heroEmoji: { fontSize: 52, marginBottom: 14 },
  heroTitle: { fontSize: 19, fontWeight: '900', color: colors.text, marginBottom: 8, textAlign: 'center' },
  heroSub: { fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  heroBtn: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 15, paddingHorizontal: 28 },
  heroBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  statusCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.lg, padding: 18, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  statusTitle: { fontSize: 16, fontWeight: '900', color: colors.text },
  statusSub: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  kpis: { flexDirection: 'row', gap: 12, marginTop: 14 },
  kpi: { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  kpiValue: { fontSize: 24, fontWeight: '900', color: colors.primary },
  kpiUnit: { fontSize: 13, color: colors.textMuted, fontWeight: '700' },
  kpiLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '700', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '900', color: colors.text, marginTop: 26, marginBottom: 12 },
  empty: { fontSize: 13, color: colors.textMuted, lineHeight: 19 },
  missionCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  missionIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  missionSubject: { fontSize: 15, fontWeight: '800', color: colors.text },
  missionDate: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  reward: { backgroundColor: '#E6F7EE', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.full },
  rewardText: { color: '#0B8A46', fontSize: 12, fontWeight: '800' },
})
