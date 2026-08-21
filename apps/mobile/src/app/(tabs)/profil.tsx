import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Switch, Share } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { useLevel } from '../../hooks/useLevel'
import { colors, radius, cardShadow, LEVEL_LABEL } from '../../lib/theme'
import { syncAllForOffline, type SyncProgress } from '../../lib/offlineSync'

export default function ProfilScreen() {
  const router = useRouter()
  const { level, track } = useLevel()
  const [name, setName] = useState('Élève')
  const [plan, setPlan] = useState('free')
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [badges, setBadges] = useState(0)
  const [notif, setNotif] = useState(false)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const [{ data: me }, { data: prog }, { count: badgeCount }] = await Promise.all([
        supabase.from('users').select('full_name, plan, xp, whatsapp_opt_in').eq('id', user.id).single(),
        supabase.from('user_progress').select('streak_days').eq('user_id', user.id),
        supabase.from('user_badges').select('badge_code', { count: 'exact', head: true }).eq('user_id', user.id),
      ])
      setName((me as { full_name?: string })?.full_name?.split(' ')[0] ?? 'Élève')
      setPlan((me as { plan?: string })?.plan ?? 'free')
      setXp((me as { xp?: number })?.xp ?? 0)
      setNotif(!!(me as { whatsapp_opt_in?: boolean })?.whatsapp_opt_in)
      setStreak(Math.max(0, ...((prog ?? []) as { streak_days: number }[]).map((p) => p.streak_days)))
      setBadges(badgeCount ?? 0)
      setLoading(false)
    }
    load()
  }, [])

  async function toggleNotif(value: boolean) {
    setNotif(value)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await supabase.from('users').update({ whatsapp_opt_in: value }).eq('id', user.id)
  }
  async function downloadForOffline() {
    if (syncing) return
    if (!level) { Alert.alert('Niveau manquant', 'Définis d\'abord ton niveau d\'examen (ci-dessus) avant de télécharger tes cours.'); return }
    setSyncing(true)
    setSyncProgress({ done: 0, total: 0, label: '' })
    try {
      const { synced, failed, total } = await syncAllForOffline(level, track, (p) => setSyncProgress(p))
      Alert.alert(
        'Téléchargement terminé',
        failed > 0
          ? `${synced}/${total} chapitres téléchargés pour hors-ligne. ${failed} chapitre(s) n'ont pas pu être téléchargés (vérifie ta connexion et réessaie).`
          : `Les ${synced} chapitres de ton programme sont maintenant disponibles hors-ligne, images comprises.`
      )
    } catch {
      Alert.alert('Erreur', 'Le téléchargement a été interrompu. Vérifie ta connexion et réessaie.')
    } finally {
      setSyncing(false)
      setSyncProgress(null)
    }
  }

  async function share() {
    await Share.share({ message: 'Je révise pour mon examen d\'État avec Cognix 🎓 — cours, QCM et IA. Rejoins-moi !' }).catch(() => null)
  }
  function signOut() {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnecter', style: 'destructive', onPress: async () => { await supabase.auth.signOut(); router.replace('/(auth)/login') } },
    ])
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />
  const niveau = Math.max(1, Math.floor(xp / 100) + 1)

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      {/* Header vert */}
      <View style={styles.header}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{name[0]?.toUpperCase()}</Text></View>
          <View style={styles.crown}><Text style={{ fontSize: 16 }}>👑</Text></View>
        </View>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.pill}><Text style={styles.pillText}>🎖️ Élève {level ? `· ${LEVEL_LABEL[level]}` : ''} · Niveau {niveau}</Text></View>
      </View>

      <View style={styles.body}>
        {/* Stats */}
        <View style={styles.stats}>
          {[
            { icon: '🔥', v: String(streak), l: 'Jours série' },
            { icon: '⭐', v: xp >= 1000 ? (xp / 1000).toFixed(1) + 'k' : String(xp), l: 'XP Total' },
            { icon: '🏆', v: String(badges), l: 'Badges' },
          ].map((s) => (
            <View key={s.l} style={styles.stat}>
              <Text style={{ fontSize: 26 }}>{s.icon}</Text>
              <Text style={styles.statV}>{s.v}</Text>
              <Text style={styles.statL}>{s.l}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Paramètres & Abonnement</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primaryTint }]}><Text style={{ fontSize: 18 }}>🔔</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingSub}>Rappels de révision</Text>
            </View>
            <Switch value={notif} onValueChange={toggleNotif} trackColor={{ true: colors.primary, false: '#CBD5C7' }} thumbColor="#fff" />
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/onboarding' as any)}>
            <View style={[styles.settingIcon, { backgroundColor: '#FEF9E7' }]}><Text style={{ fontSize: 18 }}>🎓</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Niveau d'examen</Text>
              <Text style={styles.settingSub}>Actuel : {level ? LEVEL_LABEL[level] : 'non défini'}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} onPress={downloadForOffline} disabled={syncing}>
            <View style={[styles.settingIcon, { backgroundColor: '#E0F2FE' }]}>
              <Text style={{ fontSize: 18 }}>⤓</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Télécharger pour hors-ligne</Text>
              <Text style={styles.settingSub}>
                {syncing
                  ? syncProgress && syncProgress.total > 0
                    ? `Téléchargement… ${syncProgress.done}/${syncProgress.total}`
                    : 'Préparation…'
                  : 'Tout ton programme, cours et images'}
              </Text>
            </View>
            {syncing ? <ActivityIndicator color={colors.primary} /> : <Text style={styles.chevron}>›</Text>}
          </TouchableOpacity>
          {plan === 'free' && (
            <>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/planning' as any)}>
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

        <TouchableOpacity style={styles.shareBtn} onPress={share}><Text style={styles.shareText}>🔗  Partager avec des amis</Text></TouchableOpacity>
        <TouchableOpacity style={styles.logoutBtn} onPress={signOut}><Text style={styles.logoutText}>Se déconnecter</Text></TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, paddingTop: 56, paddingBottom: 60, alignItems: 'center', borderBottomLeftRadius: 44, borderBottomRightRadius: 44 },
  avatarWrap: { marginBottom: 14 },
  avatar: { width: 100, height: 100, borderRadius: 34, backgroundColor: '#ffffff33', borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 42, color: '#fff', fontWeight: '900' },
  crown: { position: 'absolute', bottom: -6, right: -6, width: 38, height: 38, borderRadius: 14, backgroundColor: colors.yellow, borderWidth: 4, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 24, fontWeight: '900', color: '#fff' },
  pill: { flexDirection: 'row', backgroundColor: '#ffffff2e', paddingHorizontal: 16, paddingVertical: 7, borderRadius: radius.full, marginTop: 10 },
  pillText: { color: '#fff', fontSize: 11, fontWeight: '900', letterSpacing: 0.5, textTransform: 'uppercase' },
  body: { paddingHorizontal: 20, marginTop: -34 },
  stats: { flexDirection: 'row', gap: 12 },
  stat: { flex: 1, backgroundColor: '#fff', borderRadius: 26, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  statV: { fontSize: 18, fontWeight: '900', color: colors.text, marginTop: 4 },
  statL: { fontSize: 8, fontWeight: '900', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.text, marginTop: 30, marginBottom: 14 },
  settingsCard: { backgroundColor: '#fff', borderRadius: 28, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  settingIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  settingTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  settingSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.cardBorder, marginLeft: 72 },
  chevron: { fontSize: 24, color: colors.outlineVariant },
  shareBtn: { backgroundColor: colors.primary, borderRadius: 20, paddingVertical: 16, alignItems: 'center', marginTop: 18, ...cardShadow },
  shareText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  logoutBtn: { borderRadius: 20, paddingVertical: 15, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder, backgroundColor: '#fff', marginTop: 12 },
  logoutText: { color: colors.red, fontWeight: '900', fontSize: 15 },
})
