import { useState, useCallback } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'

interface Challenge {
  id: string; title: string; description: string | null; type: string
  metric: string; target: number; xp_reward: number; ends_at: string
  joined: boolean; completed: boolean; progress: number
}

const METRICS = [
  { key: 'lessons', label: 'Leçons à terminer' },
  { key: 'quizzes', label: 'Quiz à passer' },
] as const

export default function DefisScreen() {
  const router = useRouter()
  const [items, setItems] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [metric, setMetric] = useState<string>('lessons')
  const [target, setTarget] = useState('3')

  const load = useCallback(async () => {
    const { data } = await supabase.rpc('list_challenges')
    setItems((data ?? []) as Challenge[])
    setLoading(false)
  }, [])
  useFocusEffect(useCallback(() => { load() }, [load]))

  async function join(c: Challenge) {
    setBusy(c.id)
    await supabase.rpc('join_challenge', { p_id: c.id })
    await load()
    setBusy(null)
  }

  async function createSolo() {
    const t = parseInt(target, 10)
    if (title.trim().length < 3 || !t || t < 1) return
    setBusy('create')
    await supabase.rpc('create_solo_challenge', { p_title: title.trim(), p_metric: metric, p_target: t })
    setTitle(''); setTarget('3'); setShowForm(false)
    await load()
    setBusy(null)
  }

  if (loading) return <ActivityIndicator style={{ flex: 1, backgroundColor: colors.background }} color={colors.primary} />

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Défis</Text>
        <TouchableOpacity onPress={() => setShowForm((s) => !s)}><Text style={styles.plus}>{showForm ? '×' : '＋'}</Text></TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Nouveau défi personnel</Text>
          <TextInput style={styles.input} placeholder="Ex : Finir le chapitre des complexes" placeholderTextColor={colors.textMuted} value={title} onChangeText={setTitle} maxLength={100} />
          <View style={styles.metricRow}>
            {METRICS.map((m) => (
              <TouchableOpacity key={m.key} style={[styles.metricChip, metric === m.key && styles.metricChipOn]} onPress={() => setMetric(m.key)}>
                <Text style={[styles.metricText, metric === m.key && styles.metricTextOn]}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.targetRow}>
            <Text style={styles.targetLabel}>Objectif :</Text>
            <TextInput style={styles.targetInput} keyboardType="number-pad" value={target} onChangeText={(v) => setTarget(v.replace(/[^0-9]/g, ''))} maxLength={2} />
          </View>
          <TouchableOpacity style={[styles.createBtn, (title.trim().length < 3 || busy === 'create') && { opacity: 0.5 }]} onPress={createSolo} disabled={title.trim().length < 3 || busy === 'create'}>
            <Text style={styles.createText}>{busy === 'create' ? 'Création…' : 'Lancer le défi (+30 XP)'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {items.length === 0 ? (
        <Text style={styles.empty}>Aucun défi actif. Crée-en un ou reviens lundi pour le défi de la semaine !</Text>
      ) : items.map((c) => {
        const pct = Math.min(100, Math.round((c.progress / c.target) * 100))
        const isHebdo = c.type === 'hebdo'
        return (
          <View key={c.id} style={[styles.card, isHebdo && styles.cardHebdo]}>
            <View style={styles.cardHead}>
              <View style={[styles.typeBadge, isHebdo ? styles.badgeHebdo : styles.badgeSolo]}>
                <Text style={[styles.typeBadgeText, { color: isHebdo ? '#C77700' : colors.primary }]}>{isHebdo ? '🏆 Défi Cognix' : '🎯 Perso'}</Text>
              </View>
              <Text style={styles.reward}>+{c.xp_reward} XP</Text>
            </View>
            <Text style={styles.cardTitle}>{c.title}</Text>
            {c.description ? <Text style={styles.cardDesc}>{c.description}</Text> : null}

            <View style={styles.progressRow}>
              <View style={styles.track}><View style={[styles.fill, { width: `${pct}%` }, c.completed && { backgroundColor: '#0B8A46' }]} /></View>
              <Text style={styles.progressText}>{c.progress}/{c.target}</Text>
            </View>

            {c.completed ? (
              <Text style={styles.doneText}>✅ Défi réussi ! +{c.xp_reward} XP</Text>
            ) : c.joined ? (
              <Text style={styles.joinedText}>En cours — {c.metric === 'lessons' ? 'termine des leçons' : 'passe des quiz'}</Text>
            ) : (
              <TouchableOpacity style={[styles.joinBtn, busy === c.id && { opacity: 0.6 }]} onPress={() => join(c)} disabled={busy === c.id}>
                <Text style={styles.joinText}>{busy === c.id ? '…' : 'Relever le défi'}</Text>
              </TouchableOpacity>
            )}
          </View>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  plus: { fontSize: 26, color: colors.primary, fontWeight: '800' },
  form: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, marginBottom: 18, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  formTitle: { fontSize: 15, fontWeight: '800', color: colors.text, marginBottom: 12 },
  input: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.text, marginBottom: 12 },
  metricRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  metricChip: { flex: 1, paddingVertical: 9, borderRadius: radius.md, borderWidth: 1, borderColor: colors.cardBorder, alignItems: 'center' },
  metricChipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  metricText: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  metricTextOn: { color: '#fff' },
  targetRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  targetLabel: { fontSize: 14, color: colors.textMuted, fontWeight: '700' },
  targetInput: { width: 60, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.sm, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15, color: colors.text, textAlign: 'center', fontWeight: '800' },
  createBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 13, alignItems: 'center' },
  createText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 40, fontSize: 13, paddingHorizontal: 30, lineHeight: 19 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  cardHebdo: { borderColor: '#F5D9A8', backgroundColor: '#FFFDF7' },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  badgeHebdo: { backgroundColor: '#FFF3E0' },
  badgeSolo: { backgroundColor: colors.primaryTint },
  typeBadgeText: { fontSize: 11, fontWeight: '800' },
  reward: { fontSize: 13, fontWeight: '900', color: colors.primary },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  cardDesc: { fontSize: 13, color: colors.textMuted, marginTop: 3 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  track: { flex: 1, height: 10, backgroundColor: colors.primaryTint, borderRadius: radius.full, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.full },
  progressText: { fontSize: 13, fontWeight: '900', color: colors.text },
  doneText: { marginTop: 12, color: '#0B8A46', fontWeight: '800', fontSize: 14 },
  joinedText: { marginTop: 12, color: colors.textMuted, fontWeight: '700', fontSize: 13 },
  joinBtn: { marginTop: 14, backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' },
  joinText: { color: '#fff', fontWeight: '800', fontSize: 14 },
})
