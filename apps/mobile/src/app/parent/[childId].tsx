import { useState, useCallback } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Switch, Alert } from 'react-native'
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'

interface Dashboard {
  child_name: string; last_active: string | null; active_days_week: number
  lessons_week: number; quizzes_week: number; xp: number
  groups: string[]; flags_count: number
  settings: { dm_enabled: boolean; daily_limit_minutes: number | null; weekly_report_email: boolean }
}

export default function ChildDashboard() {
  const { childId } = useLocalSearchParams<{ childId: string }>()
  const router = useRouter()
  const [d, setD] = useState<Dashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [limit, setLimit] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const { data, error } = await supabase.rpc('parent_dashboard', { p_child_id: childId })
    if (!error && data) {
      const dash = data as Dashboard
      setD(dash)
      setLimit(dash.settings.daily_limit_minutes != null ? String(dash.settings.daily_limit_minutes) : '')
    }
    setLoading(false)
  }, [childId])
  useFocusEffect(useCallback(() => { load() }, [load]))

  async function saveSettings(next: Partial<Dashboard['settings']>) {
    if (!d) return
    const s = { ...d.settings, ...next }
    setD({ ...d, settings: s })
    setSaving(true)
    await supabase.rpc('update_parental_settings', {
      p_child_id: childId, p_dm_enabled: s.dm_enabled,
      p_daily_limit: s.daily_limit_minutes, p_weekly_email: s.weekly_report_email,
    })
    setSaving(false)
  }

  function saveLimit() {
    const n = limit.trim() === '' ? null : Math.max(0, parseInt(limit, 10) || 0)
    saveSettings({ daily_limit_minutes: n })
    Alert.alert('Enregistré', n ? `Limite fixée à ${n} min/jour.` : 'Limite retirée.')
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />
  if (!d) return <View style={styles.center}><Text style={styles.muted}>Impossible de charger ce profil.</Text></View>

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{d.child_name}</Text>
        <View style={{ width: 20 }} />
      </View>

      {d.flags_count > 0 && (
        <View style={styles.alert}><Text style={styles.alertText}>⚠️ {d.flags_count} signalement{d.flags_count > 1 ? 's' : ''} lié{d.flags_count > 1 ? 's' : ''} à ce compte.</Text></View>
      )}

      <Text style={styles.section}>Activité (7 jours)</Text>
      <View style={styles.stats}>
        <Stat value={String(d.active_days_week)} label="Jours actifs" />
        <Stat value={String(d.lessons_week)} label="Leçons" />
        <Stat value={String(d.quizzes_week)} label="Quiz" />
      </View>
      <View style={styles.metaCard}>
        <Text style={styles.metaRow}>⭐ {d.xp.toLocaleString('fr-FR')} XP au total</Text>
        <Text style={styles.metaRow}>🕓 Dernière activité : {d.last_active ? new Date(d.last_active).toLocaleDateString('fr-FR') : '—'}</Text>
      </View>

      <Text style={styles.section}>Groupes rejoints</Text>
      {d.groups.length === 0 ? <Text style={styles.muted}>Aucun groupe.</Text> : (
        <View style={styles.metaCard}>
          {d.groups.map((g, i) => <Text key={i} style={styles.groupRow}>👥 {g}</Text>)}
        </View>
      )}

      <Text style={styles.section}>Contrôle parental</Text>
      <View style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Messages directs autorisés</Text>
            <Text style={styles.settingSub}>Discussions privées de ton enfant</Text>
          </View>
          <Switch value={d.settings.dm_enabled} onValueChange={(v) => saveSettings({ dm_enabled: v })} trackColor={{ true: colors.primary, false: '#CBD5C7' }} thumbColor="#fff" />
        </View>
        <View style={styles.divider} />
        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Limite de temps / jour</Text>
            <Text style={styles.settingSub}>En minutes (vide = illimité)</Text>
          </View>
          <TextInput style={styles.limitInput} keyboardType="number-pad" value={limit} onChangeText={(v) => setLimit(v.replace(/[^0-9]/g, ''))} onBlur={saveLimit} placeholder="—" placeholderTextColor={colors.textMuted} maxLength={3} />
        </View>
        <View style={styles.divider} />
        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Rapport hebdomadaire</Text>
            <Text style={styles.settingSub}>Reçois un résumé par email</Text>
          </View>
          <Switch value={d.settings.weekly_report_email} onValueChange={(v) => saveSettings({ weekly_report_email: v })} trackColor={{ true: colors.primary, false: '#CBD5C7' }} thumbColor="#fff" />
        </View>
      </View>
      <Text style={styles.privacy}>🔒 Tu ne peux jamais lire les messages privés de ton enfant — sa vie privée est respectée.</Text>
      {saving && <Text style={styles.saving}>Enregistrement…</Text>}
    </ScrollView>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56, paddingBottom: 50 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  back: { fontSize: 24, color: colors.text },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontFamily: fonts.headingBlack, color: colors.text },
  muted: { color: colors.textMuted, fontSize: 13 },
  alert: { backgroundColor: '#FDE2E1', borderRadius: radius.md, padding: 12, marginBottom: 8 },
  alertText: { color: '#C62828', fontSize: 13, fontWeight: '700' },
  section: { fontSize: 16, fontWeight: '900', color: colors.text, marginTop: 20, marginBottom: 10 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  statValue: { fontSize: 26, fontWeight: '900', color: colors.primary },
  statLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '700', marginTop: 3 },
  metaCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.cardBorder, gap: 8, ...cardShadow },
  metaRow: { fontSize: 14, color: colors.text, fontWeight: '600' },
  groupRow: { fontSize: 14, color: colors.text, fontWeight: '600' },
  settingsCard: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.cardBorder, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  settingTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  settingSub: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.cardBorder },
  limitInput: { width: 64, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.sm, paddingHorizontal: 10, paddingVertical: 8, fontSize: 15, color: colors.text, textAlign: 'center', fontWeight: '800' },
  privacy: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 16, lineHeight: 17, paddingHorizontal: 10 },
  saving: { fontSize: 12, color: colors.primary, textAlign: 'center', marginTop: 8 },
})
