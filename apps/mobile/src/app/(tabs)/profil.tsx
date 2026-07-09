import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Switch, Share } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useLevel } from '../../hooks/useLevel'
import { colors, radius, cardShadow, LEVEL_LABEL } from '../../lib/theme'

function startOfWeek(): Date {
  const d = new Date()
  const day = (d.getDay() + 6) % 7 // lundi = 0
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - day)
  return d
}

export default function ProfilScreen() {
  const router = useRouter()
  const { level } = useLevel()
  const [name, setName] = useState('Élève')
  const [plan, setPlan] = useState('free')
  const [rank, setRank] = useState<number | null>(null)
  const [total, setTotal] = useState(0)
  const [hours, setHours] = useState(0)
  const [quizDone, setQuizDone] = useState(0)
  const [quizWeek, setQuizWeek] = useState(0)
  const [notif, setNotif] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: me } = await supabase.from('users').select('full_name, plan, xp, whatsapp_opt_in').eq('id', user.id).single()
      const myXp = (me as { xp?: number })?.xp ?? 0
      setName((me as { full_name?: string })?.full_name?.split(' ')[0] ?? 'Élève')
      setPlan((me as { plan?: string })?.plan ?? 'free')
      setNotif(!!(me as { whatsapp_opt_in?: boolean })?.whatsapp_opt_in)

      const weekStart = startOfWeek().toISOString()
      const [{ count: better }, { count: totalUsers }, { data: sessions }, { data: attempts }, { count: weekCount }] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }).gt('xp', myXp),
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('revision_sessions').select('duration_min').eq('user_id', user.id).eq('is_done', true),
        supabase.from('quiz_attempts').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('quiz_attempts').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('completed_at', weekStart),
      ])
      setRank((better ?? 0) + 1)
      setTotal(totalUsers ?? 0)
      setHours(Math.round((sessions ?? []).reduce((s: number, x: any) => s + (x.duration_min ?? 0), 0) / 60))
      setQuizDone((attempts as any)?.length != null ? (attempts as any).length : 0)
      // count via head returns null data; use count
      setQuizWeek(weekCount ?? 0)
      setLoading(false)
    }
    load()
  }, [])

  async function toggleNotif(value: boolean) {
    setNotif(value)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await supabase.from('users').update({ whatsapp_opt_in: value }).eq('id', user.id)
  }

  async function share() {
    await Share.share({
      message: 'Je révise pour mon examen d\'État avec Kelassi 🎓 — cours, QCM et IA pour réussir. Rejoins-moi !',
    }).catch(() => null)
  }

  function signOut() {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnecter', style: 'destructive', onPress: async () => {
        await supabase.auth.signOut()
        router.replace('/(auth)/login')
      } },
    ])
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Avatar + nom */}
      <View style={styles.profileCard}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{name[0]?.toUpperCase()}</Text></View>
        </View>
        <Text style={styles.name}>{name}</Text>
        {level && (
          <View style={styles.candidatBadge}>
            <Text style={styles.candidatText}>Candidat au {LEVEL_LABEL[level]}</Text>
          </View>
        )}
      </View>

      {/* Rang national */}
      <View style={styles.rankCard}>
        <Text style={styles.rankIcon}>🏅</Text>
        <View>
          <Text style={styles.rankLabel}>Rang National</Text>
          <Text style={styles.rankValue}>#{rank}<Text style={styles.rankTotal}> / {total.toLocaleString('fr')}</Text></Text>
        </View>
      </View>

      {/* Double compteurs */}
      <View style={styles.countersRow}>
        <View style={[styles.counter, { borderLeftColor: '#B7791F' }]}>
          <Text style={styles.counterLabel}>Révision</Text>
          <Text style={[styles.counterValue, { color: '#B7791F' }]}>{hours}h</Text>
        </View>
        <View style={[styles.counter, { borderLeftColor: colors.red }]}>
          <Text style={styles.counterLabel}>Quiz réussis</Text>
          <Text style={[styles.counterValue, { color: colors.red }]}>{quizDone}</Text>
          {quizWeek > 0 && <Text style={styles.counterSub}>📈 +{quizWeek} cette semaine</Text>}
        </View>
      </View>

      {/* Partager */}
      <TouchableOpacity style={styles.shareBtn} onPress={share}>
        <Text style={styles.shareText}>🔗  Partager avec des amis</Text>
      </TouchableOpacity>

      {/* Paramètres */}
      <Text style={styles.sectionTitle}>PARAMÈTRES</Text>
      <View style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <View style={[styles.settingIcon, { backgroundColor: colors.primaryTint }]}><Text style={{ fontSize: 18 }}>🔔</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Notifications</Text>
            <Text style={styles.settingSub}>Rappels de révision et alertes</Text>
          </View>
          <Switch value={notif} onValueChange={toggleNotif} trackColor={{ true: colors.primary, false: '#CBD5C7' }} thumbColor="#fff" />
        </View>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/onboarding' as any)}>
          <View style={[styles.settingIcon, { backgroundColor: '#FCEFC7' }]}><Text style={{ fontSize: 18 }}>🎓</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Niveau d'examen</Text>
            <Text style={styles.settingSub}>Actuel : {level ? LEVEL_LABEL[level] : 'non défini'}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        {plan === 'free' && (
          <>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/planning/index' as any)}>
              <View style={[styles.settingIcon, { backgroundColor: '#FDE2E1' }]}><Text style={{ fontSize: 18 }}>⭐</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.settingTitle}>Passer à Premium</Text>
                <Text style={styles.settingSub}>2 000 FCFA/mois</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56 },
  profileCard: { backgroundColor: colors.card, borderRadius: radius.lg, alignItems: 'center', padding: 22, borderTopWidth: 4, borderTopColor: colors.primary, ...cardShadow },
  avatarRing: { width: 104, height: 104, borderRadius: 52, borderWidth: 3, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 36, color: '#fff', fontWeight: '800' },
  name: { fontSize: 24, fontWeight: '800', color: colors.text },
  candidatBadge: { backgroundColor: colors.red, paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.full, marginTop: 8 },
  candidatText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  rankCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.md, padding: 16, marginTop: 14, borderLeftWidth: 4, borderLeftColor: colors.primary, borderWidth: 1, borderColor: colors.cardBorder },
  rankIcon: { fontSize: 28 },
  rankLabel: { fontSize: 13, color: colors.textMuted },
  rankValue: { fontSize: 24, fontWeight: '800', color: colors.primary, marginTop: 2 },
  rankTotal: { fontSize: 15, fontWeight: '600', color: colors.outline },
  countersRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  counter: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, padding: 16, borderLeftWidth: 4, borderWidth: 1, borderColor: colors.cardBorder },
  counterLabel: { fontSize: 13, color: colors.textMuted },
  counterValue: { fontSize: 26, fontWeight: '800', marginTop: 4 },
  counterSub: { fontSize: 11, color: colors.primary, fontWeight: '700', marginTop: 4 },
  shareBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 16, ...cardShadow },
  shareText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: colors.outline, letterSpacing: 1, marginTop: 22, marginBottom: 8 },
  settingsCard: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  settingIcon: { width: 40, height: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  settingTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  settingSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.background, marginLeft: 66 },
  chevron: { fontSize: 22, color: colors.outlineVariant },
  logoutBtn: { borderRadius: radius.md, paddingVertical: 15, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: colors.card, marginTop: 16, marginBottom: 30 },
  logoutText: { color: colors.red, fontWeight: '700', fontSize: 15 },
})
