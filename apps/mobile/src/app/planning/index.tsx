import { useEffect, useState, useCallback } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'

interface Plan { id: string; level: string; title: string; exam_date: string; days_remaining: number }
interface ExamEvent { id: string; level: string; label: string; exam_date: string }
interface Subject { id: string; name: string }
interface Session { id: string; title: string; scheduled_date: string; duration_min: number; is_done: boolean }

async function token() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
}
async function api(path: string, init?: RequestInit) {
  const t = await token()
  const res = await fetch(`${API_URL}/api/planning${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}`, ...(init?.headers ?? {}) },
  })
  return res.json()
}

export default function PlanningScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [level, setLevel] = useState<string | null>(null)
  const [plan, setPlan] = useState<Plan | null>(null)
  const [exams, setExams] = useState<ExamEvent[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [perDay, setPerDay] = useState(2)
  const [generating, setGenerating] = useState(false)

  const loadSessions = useCallback(async () => {
    const json = await api('/sessions?scope=upcoming')
    setSessions(json.data ?? [])
  }, [])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      const { data: profile } = await supabase.from('users').select('study_level_pref').eq('id', user.id).single()
      const lvl = (profile as unknown as { study_level_pref?: string } | null)?.study_level_pref ?? null
      setLevel(lvl)

      const planJson = await api('/plan')
      setPlan(planJson.data)
      const examJson = await api(`/exams${lvl ? `?level=${lvl}` : ''}`)
      setExams(examJson.data ?? [])

      let sq = supabase.from('subjects').select('id, name').order('name')
      if (lvl) sq = sq.eq('level', lvl)
      const { data: subs } = await sq
      setSubjects((subs ?? []) as Subject[])

      if (planJson.data) await loadSessions()
      setLoading(false)
    }
    load()
  }, [loadSessions])

  async function createPlan(exam: ExamEvent) {
    await api('/plan', { method: 'POST', body: JSON.stringify({ level: exam.level, title: exam.label, exam_date: exam.exam_date }) })
    const planJson = await api('/plan')
    setPlan(planJson.data)
  }

  async function generate() {
    if (!plan || picked.size === 0 || generating) return
    setGenerating(true)
    const json = await api('/generate', {
      method: 'POST',
      body: JSON.stringify({ plan_id: plan.id, subject_ids: [...picked], sessions_per_day: perDay, duration_min: 30 }),
    })
    if (json.error) Alert.alert('Erreur', json.error.message ?? 'Génération impossible')
    else await loadSessions()
    setGenerating(false)
  }

  async function toggle(s: Session) {
    setSessions((list) => list.map((x) => x.id === s.id ? { ...x, is_done: !x.is_done } : x))
    await api(`/sessions/${s.id}`, { method: 'PATCH', body: JSON.stringify({ is_done: !s.is_done }) })
  }

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#0F8F4F" />

  const today = new Date().toISOString().slice(0, 10)
  const todaySessions = sessions.filter((s) => s.scheduled_date === today)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Mon planning</Text>
        <View style={{ width: 20 }} />
      </View>

      {!plan ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🎯 Choisis ton examen</Text>
          {exams.length === 0
            ? <Text style={styles.empty}>Aucune date disponible pour ton niveau.</Text>
            : exams.map((e) => (
              <TouchableOpacity key={e.id} style={styles.examRow} onPress={() => createPlan(e)}>
                <Text style={styles.examLabel}>{e.label}</Text>
                <Text style={styles.examDate}>{new Date(e.exam_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
              </TouchableOpacity>
            ))}
        </View>
      ) : (
        <>
          <View style={styles.countdown}>
            <Text style={styles.cdTitle}>{plan.title}</Text>
            <Text style={styles.cdDays}>{plan.days_remaining}</Text>
            <Text style={styles.cdLabel}>jour{plan.days_remaining > 1 ? 's' : ''} avant l'examen</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>✨ Générer mon emploi du temps</Text>
            <View style={styles.chips}>
              {subjects.map((s) => {
                const on = picked.has(s.id)
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.chip, on && styles.chipOn]}
                    onPress={() => setPicked((p) => { const n = new Set(p); n.has(s.id) ? n.delete(s.id) : n.add(s.id); return n })}
                  >
                    <Text style={[styles.chipText, on && styles.chipTextOn]}>{s.name}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
            <View style={styles.perDayRow}>
              <Text style={styles.perDayLabel}>Séances/jour :</Text>
              {[1, 2, 3, 4].map((n) => (
                <TouchableOpacity key={n} style={[styles.perDayBtn, perDay === n && styles.perDayBtnOn]} onPress={() => setPerDay(n)}>
                  <Text style={[styles.perDayText, perDay === n && styles.perDayTextOn]}>{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[styles.genBtn, (picked.size === 0 || generating) && { opacity: 0.5 }]} onPress={generate} disabled={picked.size === 0 || generating}>
              <Text style={styles.genText}>{generating ? 'Génération…' : 'Générer'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Aujourd'hui</Text>
          {todaySessions.length === 0
            ? <Text style={styles.empty}>Aucune révision prévue aujourd'hui.</Text>
            : todaySessions.map((s) => (
              <TouchableOpacity key={s.id} style={styles.sessionRow} onPress={() => toggle(s)}>
                <Text style={styles.checkbox}>{s.is_done ? '✅' : '⬜'}</Text>
                <Text style={[styles.sessionTitle, s.is_done && styles.sessionDone]}>{s.title}</Text>
                <Text style={styles.sessionDur}>{s.duration_min} min</Text>
              </TouchableOpacity>
            ))}
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAF8' },
  content: { padding: 20, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  back: { fontSize: 22, color: '#6D7A72' },
  title: { fontSize: 18, fontWeight: '700', color: '#1F2A24' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#EEF8F4' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1F2A24', marginBottom: 12 },
  empty: { fontSize: 13, color: '#6D7A72' },
  examRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#EEF8F4' },
  examLabel: { fontSize: 14, fontWeight: '600', color: '#1F2A24' },
  examDate: { fontSize: 13, color: '#6D7A72' },
  countdown: { backgroundColor: '#0F8F4F', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16 },
  cdTitle: { fontSize: 13, color: '#EAF5EC' },
  cdDays: { fontSize: 52, fontWeight: '800', color: '#fff', marginVertical: 4 },
  cdLabel: { fontSize: 13, color: '#EAF5EC' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: '#DDE8E1' },
  chipOn: { backgroundColor: '#0F8F4F', borderColor: '#0F8F4F' },
  chipText: { fontSize: 13, color: '#6D7A72' },
  chipTextOn: { color: '#fff', fontWeight: '600' },
  perDayRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  perDayLabel: { fontSize: 13, color: '#6D7A72', marginRight: 4 },
  perDayBtn: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: '#DDE8E1', alignItems: 'center', justifyContent: 'center' },
  perDayBtnOn: { backgroundColor: '#1F2A24', borderColor: '#1F2A24' },
  perDayText: { fontSize: 14, color: '#6D7A72', fontWeight: '600' },
  perDayTextOn: { color: '#fff' },
  genBtn: { backgroundColor: '#0F8F4F', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  genText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1F2A24', marginBottom: 10 },
  sessionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#EEF8F4' },
  checkbox: { fontSize: 18, marginRight: 12 },
  sessionTitle: { flex: 1, fontSize: 14, color: '#1F2A24' },
  sessionDone: { textDecorationLine: 'line-through', color: '#6D7A72' },
  sessionDur: { fontSize: 12, color: '#6D7A72' },
})
