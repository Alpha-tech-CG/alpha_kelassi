import { useState, useCallback } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Switch, Alert } from 'react-native'
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'
import { planLabel } from '../../lib/billing'

/**
 * Niveau de suivi (selon la formule de l'ENFANT, calculé par la base) :
 *   basic    (Gratuit)  : dernière activité et XP
 *   standard (Starter)  : + activité de la semaine, groupes, signalements
 *   enriched (Pro)      : + progression par matière, moyenne et points faibles
 *   reports  (Pro Max)  : + dernier rapport de progression
 */
type TrackingLevel = 'basic' | 'standard' | 'enriched' | 'reports'

interface Dashboard {
  child_name: string
  child_plan?: string
  tracking_level?: TrackingLevel
  last_active: string | null
  xp: number
  active_days_week?: number
  lessons_week?: number
  quizzes_week?: number
  groups?: string[]
  flags_count?: number
  subjects?: { subject_id: string; subject_name: string; lessons_total: number; lessons_done: number }[]
  quiz_average?: number | null
  weak_areas?: { subject_name: string; answered: number; error_rate: number }[]
  latest_report?: { period_start: string; period_end: string; summary: string | null } | null
  settings: { dm_enabled: boolean; daily_limit_minutes: number | null; weekly_report_email: boolean }
}

const RANK: Record<TrackingLevel, number> = { basic: 0, standard: 1, enriched: 2, reports: 3 }
const NEXT: Record<Exclude<TrackingLevel, 'reports'>, { plan: string; text: string }> = {
  basic: { plan: 'starter', text: 'Avec la formule Starter de ton enfant, tu suis son activité de la semaine, ses leçons et ses quiz.' },
  standard: { plan: 'pro', text: 'Avec la formule Pro, tu vois sa progression par matière, sa moyenne aux QCM et ses points faibles.' },
  enriched: { plan: 'pro_max', text: 'Avec la formule Pro Max, tu reçois ses rapports de progression détaillés.' },
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

  // Base antérieure à la migration 057 : pas de niveau renvoyé → suivi standard.
  const level: TrackingLevel = d.tracking_level ?? 'standard'
  const upsell = level !== 'reports' ? NEXT[level] : null

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Retour"><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title} numberOfLines={1} accessibilityRole="header">{d.child_name}</Text>
        <View style={{ width: 20 }} />
      </View>
      {!!d.child_plan && <Text style={styles.planLine}>Formule de ton enfant : {planLabel(d.child_plan)}</Text>}

      {(d.flags_count ?? 0) > 0 && (
        <View style={styles.alert}><Text style={styles.alertText}>⚠️ {d.flags_count} signalement{d.flags_count! > 1 ? 's' : ''} lié{d.flags_count! > 1 ? 's' : ''} à ce compte.</Text></View>
      )}

      {RANK[level] >= 1 && (
        <>
          <Text style={styles.section} accessibilityRole="header">Activité (7 jours)</Text>
          <View style={styles.stats}>
            <Stat value={String(d.active_days_week ?? 0)} label="Jours actifs" />
            <Stat value={String(d.lessons_week ?? 0)} label="Leçons" />
            <Stat value={String(d.quizzes_week ?? 0)} label="Quiz" />
          </View>
        </>
      )}
      <View style={[styles.metaCard, { marginTop: 12 }]}>
        <Text style={styles.metaRow}>⭐ {d.xp.toLocaleString('fr-FR')} XP au total</Text>
        <Text style={styles.metaRow}>🕓 Dernière activité : {d.last_active ? new Date(d.last_active).toLocaleDateString('fr-FR') : '—'}</Text>
      </View>

      {RANK[level] >= 2 && (
        <>
          <Text style={styles.section} accessibilityRole="header">Progression par matière</Text>
          {d.quiz_average != null && <Text style={styles.muted}>Moyenne aux QCM sur 30 jours : {d.quiz_average} %</Text>}
          {!d.subjects?.length ? <Text style={styles.muted}>Pas encore de leçon commencée.</Text> : (
            <View style={styles.metaCard}>
              {d.subjects.map((s) => {
                const pct = s.lessons_total ? Math.round((100 * s.lessons_done) / s.lessons_total) : 0
                return (
                  <View key={s.subject_id} accessible accessibilityLabel={`${s.subject_name} : ${s.lessons_done} leçons sur ${s.lessons_total}, ${pct} pour cent`}>
                    <Text style={styles.metaRow}>{s.subject_name} — {s.lessons_done}/{s.lessons_total} leçons ({pct} %)</Text>
                    <View style={styles.track}><View style={[styles.fill, { width: `${pct}%` }]} /></View>
                  </View>
                )
              })}
            </View>
          )}
          {!!d.weak_areas?.length && (
            <>
              <Text style={styles.section} accessibilityRole="header">Points à travailler</Text>
              <View style={styles.metaCard}>
                {d.weak_areas.map((w) => <Text key={w.subject_name} style={styles.metaRow}>📌 {w.subject_name} : {w.error_rate} % d’erreurs ({w.answered} réponses)</Text>)}
              </View>
            </>
          )}
        </>
      )}

      {RANK[level] >= 3 && (
        <>
          <Text style={styles.section} accessibilityRole="header">Dernier rapport de progression</Text>
          {d.latest_report ? (
            <View style={styles.metaCard}>
              <Text style={styles.muted}>Du {new Date(d.latest_report.period_start).toLocaleDateString('fr-FR')} au {new Date(d.latest_report.period_end).toLocaleDateString('fr-FR')}</Text>
              <Text style={styles.reportText}>{d.latest_report.summary}</Text>
            </View>
          ) : <Text style={styles.muted}>Aucun rapport pour l’instant : ton enfant peut le générer depuis « Mon analyse ».</Text>}
        </>
      )}

      {upsell && (
        <View style={styles.upsell}>
          <Text style={styles.upsellText}>{upsell.text}</Text>
        </View>
      )}

      {RANK[level] >= 1 && (
        <>
          <Text style={styles.section} accessibilityRole="header">Groupes rejoints</Text>
          {!d.groups?.length ? <Text style={styles.muted}>Aucun groupe.</Text> : (
            <View style={styles.metaCard}>
              {d.groups.map((g, i) => <Text key={i} style={styles.groupRow}>👥 {g}</Text>)}
            </View>
          )}
        </>
      )}

      <Text style={styles.section} accessibilityRole="header">Contrôle parental</Text>
      <View style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Messages directs autorisés</Text>
            <Text style={styles.settingSub}>Discussions privées de ton enfant</Text>
          </View>
          <Switch value={d.settings.dm_enabled} onValueChange={(v) => saveSettings({ dm_enabled: v })} trackColor={{ true: colors.primary, false: '#CBD5C7' }} thumbColor="#fff" accessibilityLabel="Messages directs autorisés" />
        </View>
        <View style={styles.divider} />
        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Limite de temps / jour</Text>
            <Text style={styles.settingSub}>En minutes (vide = illimité)</Text>
          </View>
          <TextInput style={styles.limitInput} keyboardType="number-pad" value={limit} onChangeText={(v) => setLimit(v.replace(/[^0-9]/g, ''))} onBlur={saveLimit} placeholder="—" placeholderTextColor={colors.textMuted} maxLength={3} accessibilityLabel="Limite de temps par jour, en minutes" />
        </View>
        <View style={styles.divider} />
        <View style={styles.settingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Rapport hebdomadaire</Text>
            <Text style={styles.settingSub}>Reçois un résumé par email</Text>
          </View>
          <Switch value={d.settings.weekly_report_email} onValueChange={(v) => saveSettings({ weekly_report_email: v })} trackColor={{ true: colors.primary, false: '#CBD5C7' }} thumbColor="#fff" accessibilityLabel="Rapport hebdomadaire par email" />
        </View>
      </View>
      <Text style={styles.privacy}>🔒 Tu ne peux jamais lire les messages privés de ton enfant — sa vie privée est respectée.</Text>
      {saving && <Text style={styles.saving}>Enregistrement…</Text>}
    </ScrollView>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return <View style={styles.stat} accessible accessibilityLabel={`${label} : ${value}`}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56, paddingBottom: 50 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  back: { fontSize: 24, color: colors.text },
  title: { flex: 1, textAlign: 'center', fontSize: 18, fontFamily: fonts.headingBlack, color: colors.text },
  planLine: { textAlign: 'center', fontSize: 12, color: colors.textMuted, marginBottom: 8 },
  muted: { color: colors.textMuted, fontSize: 13, marginBottom: 6 },
  alert: { backgroundColor: '#FDE2E1', borderRadius: radius.md, padding: 12, marginBottom: 8 },
  alertText: { color: '#C62828', fontSize: 13, fontWeight: '700' },
  section: { fontSize: 16, fontWeight: '900', color: colors.text, marginTop: 20, marginBottom: 10 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  statValue: { fontSize: 26, fontWeight: '900', color: colors.primary },
  statLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '700', marginTop: 3 },
  metaCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.cardBorder, gap: 8, ...cardShadow },
  metaRow: { fontSize: 14, color: colors.text, fontWeight: '600' },
  track: { height: 6, backgroundColor: colors.primaryTint, borderRadius: radius.full, overflow: 'hidden', marginTop: 4 },
  fill: { height: '100%', backgroundColor: colors.primary },
  reportText: { fontSize: 14, color: colors.text, lineHeight: 21, marginTop: 6 },
  upsell: { backgroundColor: '#FFF8E6', borderColor: '#F2D48A', borderWidth: 1, borderRadius: radius.md, padding: 12, marginTop: 16 },
  upsellText: { fontSize: 13, color: '#5C4300', lineHeight: 19 },
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
