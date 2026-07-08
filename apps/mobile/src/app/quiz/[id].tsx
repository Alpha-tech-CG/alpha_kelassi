import { useEffect, useState, useRef, useCallback } from 'react'
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'

interface Question { id: string; position: number; prompt: string; options: string[] }
interface Quiz { id: string; title: string; time_limit_sec: number; questions: Question[] }
interface Correction { question_id: string; correct_index: number; explanation: string | null }
interface Result { attempt_id: string; score: number; total: number; corrections: Correction[] }

const API_URL = process.env['EXPO_PUBLIC_API_URL'] ?? 'http://localhost:3001'

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function QuizTakeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [current, setCurrent] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const startRef = useRef(Date.now())

  async function getToken() {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token
  }

  useEffect(() => {
    async function load() {
      const token = await getToken()
      const res = await fetch(`${API_URL}/api/quiz/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      const json = await res.json()
      if (json.data) {
        setQuiz(json.data)
        setRemaining(json.data.time_limit_sec)
        startRef.current = Date.now()
      }
      setLoading(false)
    }
    load()
  }, [id])

  const submit = useCallback(async () => {
    if (!quiz || submitting || result) return
    setSubmitting(true)
    const token = await getToken()
    const duration_sec = Math.round((Date.now() - startRef.current) / 1000)
    const payload = quiz.questions.map((q) => ({
      question_id:    q.id,
      selected_index: q.id in answers ? answers[q.id] : null,
    }))
    const res = await fetch(`${API_URL}/api/quiz/${id}/submit`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body:    JSON.stringify({ answers: payload, duration_sec }),
    })
    const json = await res.json()
    if (json.data) setResult(json.data)
    setSubmitting(false)
  }, [quiz, submitting, result, answers, id])

  // Chrono
  useEffect(() => {
    if (loading || result || !quiz) return
    if (remaining <= 0) { submit(); return }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining, loading, result, quiz, submit])

  if (loading) return <ActivityIndicator style={{ flex: 1 }} color="#2563eb" />
  if (!quiz) return <View style={styles.center}><Text>QCM introuvable.</Text></View>

  // ---------- Résultat ----------
  if (result) {
    const pct = result.total > 0 ? Math.round((100 * result.score) / result.total) : 0
    const byId = new Map(result.corrections.map((c) => [c.question_id, c]))
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.resultCard}>
          <Text style={styles.resultEmoji}>{pct >= 50 ? '🏆' : '💪'}</Text>
          <Text style={styles.resultScore}>{result.score}/{result.total}</Text>
          <Text style={styles.resultPct}>{pct}% de bonnes réponses</Text>
          {result.score > 0 && <Text style={styles.xp}>+{result.score * 5} XP</Text>}
        </View>

        {quiz.questions.map((q) => {
          const corr = byId.get(q.id)
          const picked = answers[q.id]
          const ok = corr && picked === corr.correct_index
          return (
            <View key={q.id} style={styles.reviewCard}>
              <Text style={styles.reviewPrompt}>{ok ? '✅' : '❌'} {q.position}. {q.prompt}</Text>
              {q.options.map((opt, i) => {
                const isRight = corr?.correct_index === i
                const isPicked = picked === i
                return (
                  <Text
                    key={i}
                    style={[styles.reviewOpt, isRight && styles.reviewRight, isPicked && !isRight && styles.reviewWrong]}
                  >
                    {opt}
                  </Text>
                )
              })}
              {corr?.explanation && <Text style={styles.explanation}>💡 {corr.explanation}</Text>}
            </View>
          )
        })}

        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/quiz/index' as any)}>
          <Text style={styles.primaryBtnText}>Retour aux QCM</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }

  // ---------- Passage ----------
  const q = quiz.questions[current]
  const answeredCount = Object.keys(answers).length
  const lowTime = remaining <= 30

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.counter}>Question {current + 1}/{quiz.questions.length}</Text>
        <Text style={[styles.timer, lowTime && styles.timerLow]}>⏱ {fmt(remaining)}</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(answeredCount / quiz.questions.length) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.qContent}>
        <Text style={styles.prompt}>{q.prompt}</Text>
        {q.options.map((opt, i) => {
          const selected = answers[q.id] === i
          return (
            <TouchableOpacity
              key={i}
              style={[styles.option, selected && styles.optionSelected]}
              onPress={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
            >
              <Text style={[styles.optionLetter, selected && styles.optionLetterSelected]}>
                {String.fromCharCode(65 + i)}
              </Text>
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{opt}</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity
          disabled={current === 0}
          onPress={() => setCurrent((c) => Math.max(0, c - 1))}
          style={styles.navPrev}
        >
          <Text style={[styles.navPrevText, current === 0 && { opacity: 0.4 }]}>← Précédent</Text>
        </TouchableOpacity>

        {current < quiz.questions.length - 1 ? (
          <TouchableOpacity style={styles.navNext} onPress={() => setCurrent((c) => c + 1)}>
            <Text style={styles.navNextText}>Suivant →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.finishBtn} onPress={submit} disabled={submitting}>
            <Text style={styles.finishText}>{submitting ? 'Correction…' : 'Terminer'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  content: { padding: 20, paddingTop: 60 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, marginBottom: 10 },
  counter: { fontSize: 13, color: '#6b7280' },
  timer: { fontSize: 15, fontWeight: '700', color: '#111827' },
  timerLow: { color: '#dc2626' },
  progressBar: { height: 4, backgroundColor: '#e5e7eb', marginHorizontal: 20, borderRadius: 2, overflow: 'hidden', marginBottom: 16 },
  progressFill: { height: '100%', backgroundColor: '#2563eb' },
  qContent: { padding: 20 },
  prompt: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 20, lineHeight: 26 },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, padding: 14, marginBottom: 10 },
  optionSelected: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  optionLetter: { width: 26, height: 26, borderRadius: 13, borderWidth: 1, borderColor: '#d1d5db', textAlign: 'center', lineHeight: 26, fontWeight: '700', fontSize: 12, color: '#6b7280', marginRight: 12 },
  optionLetterSelected: { borderColor: '#2563eb', color: '#2563eb' },
  optionText: { flex: 1, fontSize: 15, color: '#374151' },
  optionTextSelected: { color: '#1e3a8a', fontWeight: '500' },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  navPrev: { paddingVertical: 10 },
  navPrevText: { color: '#6b7280', fontSize: 14 },
  navNext: { backgroundColor: '#111827', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 },
  navNextText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  finishBtn: { backgroundColor: '#16a34a', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 28 },
  finishText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  resultCard: { backgroundColor: '#fff', borderRadius: 20, padding: 28, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#f3f4f6' },
  resultEmoji: { fontSize: 48, marginBottom: 8 },
  resultScore: { fontSize: 34, fontWeight: '800', color: '#111827' },
  resultPct: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  xp: { fontSize: 14, fontWeight: '700', color: '#16a34a', marginTop: 8 },
  reviewCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#f3f4f6' },
  reviewPrompt: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 10 },
  reviewOpt: { fontSize: 13, color: '#6b7280', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, marginBottom: 4 },
  reviewRight: { backgroundColor: '#ecfdf5', color: '#047857', fontWeight: '600' },
  reviewWrong: { backgroundColor: '#fef2f2', color: '#b91c1c' },
  explanation: { fontSize: 13, color: '#9ca3af', fontStyle: 'italic', marginTop: 6 },
  primaryBtn: { backgroundColor: '#2563eb', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
