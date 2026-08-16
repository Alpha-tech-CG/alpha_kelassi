import { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'

interface Mission {
  id: string
  status: 'pending' | 'assigned' | 'submitted' | 'delivered' | 'failed' | 'disputed'
  reward_fcfa: number
  created_at: string
  subjects?: { name: string } | null
}

export const STATUS: Record<Mission['status'], { label: string; bg: string; fg: string }> = {
  pending:   { label: 'En attente d’un tuteur', bg: '#EEF1F6', fg: colors.textMuted },
  assigned:  { label: 'Correction en cours',    bg: colors.primaryTint, fg: colors.primary },
  submitted: { label: 'Vérification…',          bg: colors.primaryTint, fg: colors.primary },
  delivered: { label: 'Corrigé ✅',             bg: '#E6F7EE', fg: '#0B8A46' },
  failed:    { label: 'Corrigé par l’IA',       bg: '#E6F7EE', fg: '#0B8A46' },
  disputed:  { label: 'Contestation en cours',  bg: '#FFF3E0', fg: '#C77700' },
}

async function token() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}

export default function CorrectionsScreen() {
  const router = useRouter()
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    const t = await token()
    const res = await fetch(`${API_URL}/api/corrections`, { headers: { Authorization: `Bearer ${t}` } })
    const json = await res.json().catch(() => ({}))
    setMissions(json.data ?? [])
    setLoading(false)
    setRefreshing(false)
  }, [])

  useFocusEffect(useCallback(() => { load() }, [load]))

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Mes corrections</Text>
        <View style={{ width: 20 }} />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={missions}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load() }} tintColor={colors.primary} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyTitle}>Aucune correction</Text>
              <Text style={styles.emptySub}>Envoie la photo d’un exercice et un tuteur te le corrige à la main.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const s = STATUS[item.status]
            return (
              <TouchableOpacity style={styles.card} onPress={() => router.push(`/correction/${item.id}`)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subject}>{item.subjects?.name ?? 'Exercice'}</Text>
                  <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                {item.status === 'delivered' && item.reward_fcfa > 0 && (
                  <View style={styles.reward}><Text style={styles.rewardText}>{item.reward_fcfa} FCFA</Text></View>
                )}
                <View style={[styles.badge, { backgroundColor: s.bg }]}><Text style={[styles.badgeText, { color: s.fg }]}>{s.label}</Text></View>
              </TouchableOpacity>
            )
          }}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/correction/nouveau')} activeOpacity={0.9}>
        <Text style={styles.fabText}>＋  Nouvelle demande</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 56, paddingHorizontal: 20, paddingBottom: 12 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  list: { padding: 20, paddingBottom: 120, gap: 12, flexGrow: 1 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  subject: { fontSize: 15, fontWeight: '800', color: colors.text },
  date: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  reward: { backgroundColor: '#E6F7EE', paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.full },
  rewardText: { color: '#0B8A46', fontSize: 11, fontWeight: '800' },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.full, maxWidth: 130 },
  badgeText: { fontSize: 10, fontWeight: '800', textAlign: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 46, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 6 },
  emptySub: { fontSize: 13, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 40, lineHeight: 19 },
  fab: { position: 'absolute', left: 20, right: 20, bottom: 28, backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center', ...cardShadow },
  fabText: { color: '#fff', fontSize: 15, fontWeight: '800' },
})
