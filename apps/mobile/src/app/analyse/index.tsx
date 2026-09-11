import { useCallback, useState } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useFocusEffect, useRouter } from 'expo-router'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'
import { api, planErrorOf, type LockedInfo } from '../../lib/billing'
import { useBilling } from '../../hooks/useBilling'
import { LockedFeature } from '../../components/LockedFeature'

interface Reco { subject_id: string; subject_name: string; priority: 'haute' | 'moyenne' | 'basse'; reason: string; action: string }
interface SubjectError { subject_id: string; subject_name: string; answered: number; wrong: number; error_rate: number }
interface Missed { question_id: string; prompt: string; explanation: string | null; subject_name: string; chapter_title: string | null; times_wrong: number; times_answered: number }
interface Progress { subject_id: string; subject_name: string; lessons_total: number; lessons_done: number; completion: number; quiz_attempts: number; quiz_average: number | null; error_rate: number | null }
interface Insights {
  error_analysis: { by_subject: SubjectError[]; missed_questions: Missed[] }
  detailed_progress: Progress[] | null
  recommendations: Reco[]
  recurring_errors: { items: { pattern: string; subject: string; evidence: string; remedy: string }[] } | null
  subject_recommendations: { items: { subject_id: string; subject_name: string; diagnosis: string; steps: string[]; weekly_goal: string }[] } | null
  locked: Record<string, LockedInfo> | null
}
interface Report { id: string; period_start: string; period_end: string; summary: string | null }

const PRIORITY: Record<Reco['priority'], { bg: string; fg: string }> = {
  haute: { bg: '#FDECEA', fg: '#B71C1C' },
  moyenne: { bg: '#FFF8E6', fg: '#6B4B00' },
  basse: { bg: '#E6F7EE', fg: '#0B6E3A' },
}

const clip = (s: string, n = 160) => { const t = s.replace(/\$+/g, '').replace(/\s+/g, ' '); return t.length > n ? `${t.slice(0, n)}…` : t }

export default function AnalyseScreen() {
  const router = useRouter()
  const { me, can } = useBilling()
  const [data, setData] = useState<Insights | null>(null)
  const [locked, setLocked] = useState<LockedInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState<Report[]>([])
  const [generating, setGenerating] = useState(false)

  const load = useCallback(async () => {
    const res = await api<Insights>('/api/insights')
    const planErr = planErrorOf(res.json)
    if (planErr?.info) setLocked(planErr.info)
    else if (!res.ok) setError(res.json.error?.message ?? 'L’analyse n’a pas pu être chargée.')
    else { setData(res.json.data ?? null); setLocked(null); setError(null) }
    const rep = await api<Report[]>('/api/reports/progress')
    if (rep.ok) setReports(rep.json.data ?? [])
    setLoading(false)
  }, [])
  useFocusEffect(useCallback(() => { load() }, [load]))

  async function generateReport() {
    setGenerating(true)
    const res = await api('/api/reports/progress', { method: 'POST' })
    setGenerating(false)
    if (res.ok) await load()
    else setError(res.json.error?.message ?? 'Le rapport n’a pas pu être généré.')
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Retour"><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title} accessibilityRole="header">Mon analyse</Text>
        <View style={{ width: 20 }} />
      </View>

      {loading && <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />}
      {!!error && <Text style={styles.error}>{error}</Text>}
      {locked && <LockedFeature info={locked} />}

      {data && (
        <>
          <Text style={styles.section} accessibilityRole="header">Quoi réviser en priorité</Text>
          {data.recommendations.length === 0 ? <Text style={styles.muted}>Passe quelques QCM pour obtenir des recommandations.</Text> : (
            data.recommendations.slice(0, 5).map((r) => (
              <View key={r.subject_id} style={[styles.reco, { backgroundColor: PRIORITY[r.priority].bg }]} accessible
                accessibilityLabel={`${r.subject_name}, priorité ${r.priority}. ${r.reason}. ${r.action}`}>
                <Text style={[styles.recoTitle, { color: PRIORITY[r.priority].fg }]}>{r.subject_name} · priorité {r.priority}</Text>
                <Text style={styles.body}>Constat : {r.reason}.</Text>
                <Text style={styles.body}>À faire : {r.action}</Text>
              </View>
            ))
          )}

          <Text style={styles.section} accessibilityRole="header">Analyse des erreurs</Text>
          {data.error_analysis.by_subject.length === 0 ? <Text style={styles.muted}>Aucune réponse de QCM sur les 90 derniers jours.</Text> : (
            <View style={styles.card}>
              {data.error_analysis.by_subject.map((s) => (
                <Text key={s.subject_id} style={styles.row}>{s.subject_name} : {s.error_rate} % d’erreurs ({s.wrong}/{s.answered})</Text>
              ))}
            </View>
          )}
          {data.error_analysis.missed_questions.slice(0, 6).map((m) => (
            <View key={m.question_id} style={styles.card}>
              <Text style={styles.meta}>{m.subject_name}{m.chapter_title ? ` — ${m.chapter_title}` : ''} · ratée {m.times_wrong} fois</Text>
              <Text style={styles.body}>{clip(m.prompt)}</Text>
              {!!m.explanation && <Text style={styles.explanation}>💡 {clip(m.explanation, 220)}</Text>}
            </View>
          ))}

          {data.detailed_progress && (
            <>
              <Text style={styles.section} accessibilityRole="header">Progression par matière</Text>
              {data.detailed_progress.map((p) => (
                <View key={p.subject_id} style={styles.card} accessible accessibilityLabel={`${p.subject_name} : ${p.completion} pour cent du programme`}>
                  <Text style={styles.recoTitle}>{p.subject_name}</Text>
                  <Text style={styles.body}>{p.lessons_done}/{p.lessons_total} leçons · QCM {p.quiz_attempts} · moyenne {p.quiz_average ?? '—'} %</Text>
                  <View style={styles.track}><View style={[styles.fill, { width: `${p.completion}%` }]} /></View>
                </View>
              ))}
            </>
          )}

          <Text style={styles.section} accessibilityRole="header">Erreurs récurrentes et coaching</Text>
          {data.locked ? (
            <LockedFeature info={data.locked['recurring_errors'] ?? null} compact fallbackTitle="Disponible avec la formule Pro Max." />
          ) : (
            <>
              {!data.recurring_errors?.items.length && <Text style={styles.muted}>Pas encore assez d’erreurs répétées pour dégager une tendance.</Text>}
              {data.recurring_errors?.items.map((r, i) => (
                <View key={i} style={styles.card}>
                  <Text style={styles.recoTitle}>{r.pattern}</Text>
                  <Text style={styles.meta}>{r.subject} · {r.evidence}</Text>
                  <Text style={styles.body}>{r.remedy}</Text>
                </View>
              ))}
              {data.subject_recommendations?.items.map((c) => (
                <View key={c.subject_id} style={styles.card}>
                  <Text style={styles.recoTitle}>{c.subject_name}</Text>
                  <Text style={styles.body}>{c.diagnosis}</Text>
                  {c.steps.map((s, i) => <Text key={i} style={styles.body}>{i + 1}. {s}</Text>)}
                  <Text style={[styles.body, { fontWeight: '800' }]}>Objectif de la semaine : {c.weekly_goal}</Text>
                </View>
              ))}
            </>
          )}
        </>
      )}

      {me && (
        <>
          <Text style={styles.section} accessibilityRole="header">Rapports de progression</Text>
          {!can('progress_reports') ? (
            <LockedFeature compact info={{
              feature: 'progress_reports', requiredPlan: 'pro_max',
              title: 'Les rapports de progression sont disponibles avec la formule Pro Max.',
              body: 'Un bilan chaque semaine, visible aussi par ton parent.', price: '10 000 FCFA / mois',
            }} />
          ) : (
            <>
              <TouchableOpacity style={[styles.cta, generating && { opacity: 0.5 }]} onPress={generateReport} disabled={generating} accessibilityRole="button">
                <Text style={styles.ctaText}>{generating ? 'Rédaction du rapport…' : 'Générer le rapport de la semaine'}</Text>
              </TouchableOpacity>
              {reports.length === 0 ? <Text style={styles.muted}>Aucun rapport pour l’instant. Ton parent lié le verra aussi.</Text> : reports.map((r) => (
                <View key={r.id} style={styles.card}>
                  <Text style={styles.meta}>Du {new Date(r.period_start).toLocaleDateString('fr-FR')} au {new Date(r.period_end).toLocaleDateString('fr-FR')}</Text>
                  <Text style={styles.body}>{r.summary}</Text>
                </View>
              ))}
            </>
          )}

          {can('early_access') && (
            <>
              <Text style={styles.section} accessibilityRole="header">Accès anticipé</Text>
              <Text style={styles.muted}>Aucune nouveauté en avant-première en ce moment. Tu seras parmi les premiers prévenus.</Text>
            </>
          )}
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingTop: 56, paddingBottom: 50 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  section: { fontSize: 16, fontWeight: '900', color: colors.text, marginTop: 22, marginBottom: 10 },
  muted: { fontSize: 13, color: colors.textMuted, marginBottom: 6 },
  error: { color: colors.red, textAlign: 'center', marginVertical: 12 },
  reco: { borderRadius: radius.md, padding: 12, marginBottom: 8 },
  recoTitle: { fontSize: 14, fontWeight: '900', color: colors.text, marginBottom: 4 },
  body: { fontSize: 13, color: colors.text, lineHeight: 19 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.cardBorder, marginBottom: 8, ...cardShadow },
  row: { fontSize: 13, color: colors.text, fontWeight: '600', paddingVertical: 2 },
  meta: { fontSize: 12, color: colors.textMuted, fontWeight: '700', marginBottom: 4 },
  explanation: { fontSize: 12, color: colors.textMuted, marginTop: 6, lineHeight: 17 },
  track: { height: 6, backgroundColor: colors.primaryTint, borderRadius: radius.full, overflow: 'hidden', marginTop: 8 },
  fill: { height: '100%', backgroundColor: colors.primary },
  cta: { backgroundColor: colors.text, borderRadius: radius.md, paddingVertical: 13, alignItems: 'center', marginBottom: 10 },
  ctaText: { color: '#fff', fontSize: 14, fontWeight: '800' },
})
