import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'
import { LessonContent } from '../../components/LessonContent'
import { MathLessonView } from '../../components/MathLessonView'
import { BackButton } from '../../components/BackButton'
import { CognixLoader } from '../../components/CognixLoader'
import { originLabel, parseBareme, rayonMeta, PAPER_COLUMNS, type BaremeItem, type ExamKind, type Paper } from '../../lib/prepa'

/**
 * Sujet rédigé de la Prépa (migration 074) — même déroulé que le web
 * (`apps/web/.../examens/sujet/[id]/sujet-runner.tsx`) : consignes → épreuve
 * chronométrée (indicatif pour un ancien sujet) → « Rendre ma copie » enregistre
 * la tentative qui débloque le corrigé → auto-notation au barème (Bac rouge :
 * tout ou rien par partie) → note enregistrée dans `exam_results`.
 */

const needsRich = (s?: string | null) => !!s && (/\$[^$\n]+\$|\$\$|^[ \t]*\$[ \t]*$/m.test(s) || /^\|.+\|\s*$/m.test(s))
function Markdown({ content }: { content: string }) {
  return needsRich(content) ? <MathLessonView content={content} /> : <LessonContent content={content} />
}

const KINDS: ExamKind[] = ['bac_test', 'bac_blanc', 'bac_rouge', 'ancien_bac']
type Phase = 'intro' | 'running' | 'corrige' | 'saved'

const fmt = (sec: number) => {
  const s = Math.max(0, Math.floor(sec))
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60
  return `${h > 0 ? `${h}:` : ''}${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}
const mention = (n: number) =>
  n >= 16 ? 'Très bien' : n >= 14 ? 'Bien' : n >= 12 ? 'Assez bien' : n >= 10 ? 'Passable' : 'Insuffisant'

export default function SujetScreen() {
  const params = useLocalSearchParams<{ id: string; mode?: string }>()
  const router = useRouter()
  const mode: ExamKind = KINDS.includes(params.mode as ExamKind) ? (params.mode as ExamKind) : 'ancien_bac'
  const meta = rayonMeta(mode, null)
  const strict = mode === 'bac_rouge'
  const timed = mode !== 'ancien_bac'

  const [loading, setLoading] = useState(true)
  const [paper, setPaper] = useState<(Paper & { statement: string }) | null>(null)
  const [phase, setPhase] = useState<Phase>('intro')
  const [startedAt, setStartedAt] = useState(0)
  const [now, setNow] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const [solution, setSolution] = useState<string | null>(null)
  const [scores, setScores] = useState<number[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data } = await supabase.from('exercises')
        .select(`${PAPER_COLUMNS}, statement`).eq('id', params.id).not('exam_kind', 'is', null).maybeSingle()
      if (!active) return
      if (data) {
        const p = data as any
        const bareme = parseBareme(p.bareme)
        setPaper({ ...p, bareme })
        setScores((bareme.length ? bareme : [{ label: '', points: 20 }]).map(() => 0))
      }
      setLoading(false)
    })()
    return () => { active = false }
  }, [params.id])

  useEffect(() => {
    if (phase !== 'running') return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [phase])

  if (loading) return <View style={styles.container}><View style={styles.header}><BackButton /></View><CognixLoader compact /></View>
  if (!paper) {
    return (
      <View style={styles.container}>
        <View style={styles.header}><BackButton /></View>
        <Text style={styles.empty}>Ce sujet n'est pas disponible avec ta formule.</Text>
        <TouchableOpacity style={[styles.primaryBtn, { marginHorizontal: 16 }]} onPress={() => router.push('/abonnement?plan=pro' as any)}>
          <Text style={styles.primaryText}>Voir les formules</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const bareme: BaremeItem[] = paper.bareme?.length ? paper.bareme : [{ label: 'Note globale', points: 20 }]
  const maxTotal = bareme.reduce((a, b) => a + b.points, 0)
  const spent = startedAt ? (now - startedAt) / 1000 : 0
  const remaining = paper.duration_min * 60 - spent
  const timeUp = timed && phase === 'running' && remaining <= 0
  const total = scores.reduce((a, b) => a + b, 0)
  const sur20 = maxTotal > 0 ? Math.round((total / maxTotal) * 200) / 10 : 0

  function start() {
    const t = Date.now()
    setStartedAt(t); setNow(t); setPhase('running')
  }

  async function rendre() {
    if (busy || !paper) return
    setBusy(true); setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Connecte-toi pour rendre ta copie.'); return }
      const { error: e1 } = await supabase.from('exercise_attempts')
        .upsert({ user_id: user.id, exercise_id: paper.id }, { onConflict: 'user_id,exercise_id', ignoreDuplicates: true })
      if (e1) { setError('Copie non rendue. Vérifie ta connexion et réessaie.'); return }
      const { data, error: e2 } = await supabase.from('exercise_solutions').select('solution').eq('exercise_id', paper.id).maybeSingle()
      if (e2) { setError('Impossible de charger le corrigé. Réessaie.'); return }
      setSolution((data as any)?.solution ?? 'Le corrigé de ce sujet n’est pas encore disponible.')
      setElapsed(Math.round(spent))
      setPhase('corrige')
    } finally { setBusy(false) }
  }

  function confirmRendre() {
    if (timeUp) { void rendre(); return }
    Alert.alert('Rendre ta copie ?', 'Tu verras ensuite le corrigé et tu te noteras avec le barème.', [
      { text: 'Continuer', style: 'cancel' },
      { text: 'Rendre', onPress: () => void rendre() },
    ])
  }

  async function enregistrer() {
    if (busy || !paper) return
    setBusy(true); setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Connecte-toi pour enregistrer ta note.'); return }
      const { error: e } = await supabase.from('exam_results').insert({
        user_id: user.id, exercise_id: paper.id, mode,
        scores: bareme.map((b, i) => ({ label: b.label, points: scores[i], max: b.points })),
        total, max_total: maxTotal, duration_sec: elapsed,
      })
      if (e) { setError('Note non enregistrée. Réessaie.'); return }
      setPhase('saved')
    } finally { setBusy(false) }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.kicker}>{meta.emoji}  {meta.label.toUpperCase()}</Text>
        <Text style={styles.title}>{paper.title}</Text>
        <Text style={styles.subtitle}>{originLabel(paper)} · durée {fmt(paper.duration_min * 60)}</Text>
      </View>

      {phase === 'running' && (
        <View style={[styles.timer, timeUp && { backgroundColor: colors.red }]}>
          <Text style={styles.timerText}>{timed ? (timeUp ? 'Temps écoulé' : fmt(remaining)) : fmt(spent)}</Text>
          <TouchableOpacity style={styles.timerBtn} onPress={confirmRendre} disabled={busy}>
            <Text style={styles.timerBtnText}>{busy ? '…' : 'Rendre ma copie'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {error && <Text style={styles.error}>{error}</Text>}

        {phase === 'intro' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Consignes</Text>
            <Text style={styles.li}>• Prépare des feuilles, ta calculatrice et ton matériel, comme le jour de l'examen.</Text>
            <Text style={styles.li}>• {timed ? `Le chrono démarre dès que tu ouvres le sujet : ${fmt(paper.duration_min * 60)}.` : "Ancien sujet : le chrono est indicatif, prends ton temps."}</Text>
            <Text style={styles.li}>• Après avoir rendu ta copie, tu verras le corrigé et tu te noteras avec le barème.</Text>
            {strict && <Text style={[styles.li, { color: colors.red }]}>• Bac rouge : correction stricte, une partie incomplète ou fausse vaut 0.</Text>}
            {paper.origin === 'genere' && <Text style={styles.li}>• Sujet inédit créé par Cognix sur le modèle des sujets officiels.</Text>}
            <Text style={[styles.cardTitle, { marginTop: 14 }]}>Barème</Text>
            {bareme.map((b) => (
              <View key={b.label} style={styles.row}><Text style={styles.rowLabel}>{b.label}</Text><Text style={styles.rowPts}>{b.points} pts</Text></View>
            ))}
            <TouchableOpacity style={[styles.primaryBtn, { marginTop: 16 }]} onPress={start}>
              <Text style={styles.primaryText}>Commencer l'épreuve</Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'running' && <View style={styles.card}><Markdown content={paper.statement} /></View>}

        {(phase === 'corrige' || phase === 'saved') && (
          <>
            <View style={[styles.card, { borderColor: colors.primary }]}>
              <Text style={styles.cardTitle}>Ta note</Text>
              <Text style={styles.li}>Compare ta copie au corrigé et attribue-toi les points{strict ? ' (tout ou rien)' : ''}. Temps passé : {fmt(elapsed)}.</Text>
              {bareme.map((b, i) => (
                <View key={b.label} style={styles.row}>
                  <Text style={[styles.rowLabel, { flex: 1 }]}>{b.label}</Text>
                  {strict ? (
                    <Switch value={scores[i] === b.points} disabled={phase === 'saved'}
                      onValueChange={(v) => setScores((s) => s.map((x, j) => (j === i ? (v ? b.points : 0) : x)))} />
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <TextInput style={styles.scoreInput} keyboardType="decimal-pad" editable={phase !== 'saved'}
                        defaultValue="0"
                        onChangeText={(t) => {
                          const v = Math.min(b.points, Math.max(0, Number(t.replace(',', '.')) || 0))
                          setScores((s) => s.map((x, j) => (j === i ? v : x)))
                        }} />
                      <Text style={styles.rowPts}>/ {b.points}</Text>
                    </View>
                  )}
                </View>
              ))}
              <Text style={styles.total}>{total} / {maxTotal}{maxTotal !== 20 ? ` — ${sur20}/20` : ''} · {mention(sur20)}</Text>
              {phase === 'corrige' ? (
                <TouchableOpacity style={[styles.primaryBtn, busy && { opacity: 0.5 }]} onPress={() => void enregistrer()} disabled={busy}>
                  <Text style={styles.primaryText}>{busy ? 'Enregistrement…' : 'Enregistrer ma note'}</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <Text style={[styles.li, { fontWeight: '800', color: colors.primary }]}>✓ Note enregistrée</Text>
                  <TouchableOpacity style={styles.primaryBtn} onPress={() => router.back()}>
                    <Text style={styles.primaryText}>Retour aux sujets</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            <View style={styles.card}>
              <Text style={styles.solutionLabel}>CORRIGÉ</Text>
              <Markdown content={solution ?? ''} />
            </View>
            <View style={styles.card}>
              <Text style={styles.solutionLabel}>ÉNONCÉ</Text>
              <Markdown content={paper.statement} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 8 },
  kicker: { fontSize: 12, fontWeight: '900', color: colors.primary, letterSpacing: 1 },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text, marginTop: 4 },
  subtitle: { fontSize: 13, color: colors.textMuted, marginTop: 4 },
  content: { padding: 16, paddingBottom: 60 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  cardTitle: { fontSize: 16, fontWeight: '900', color: colors.text, marginBottom: 8 },
  li: { fontSize: 14, color: colors.text, marginBottom: 6, lineHeight: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  rowLabel: { fontSize: 14, color: colors.text },
  rowPts: { fontSize: 14, fontWeight: '800', color: colors.text },
  scoreInput: { width: 64, borderWidth: 1, borderColor: colors.outlineVariant, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, textAlign: 'right', color: colors.text },
  total: { fontSize: 18, fontWeight: '900', color: colors.primary, marginVertical: 12 },
  primaryBtn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  primaryText: { color: colors.onPrimary, fontWeight: '900', fontSize: 15 },
  timer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.navy, marginHorizontal: 16, borderRadius: radius.lg, paddingHorizontal: 14, paddingVertical: 10 },
  timerText: { color: '#fff', fontSize: 22, fontWeight: '900', fontVariant: ['tabular-nums'] },
  timerBtn: { backgroundColor: '#fff', borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 8 },
  timerBtnText: { color: colors.text, fontWeight: '900' },
  solutionLabel: { fontSize: 12, fontWeight: '900', color: colors.primary, letterSpacing: 1, marginBottom: 8 },
  error: { backgroundColor: '#FDE2E1', color: colors.red, padding: 12, borderRadius: radius.md, marginBottom: 12, fontWeight: '700' },
  empty: { fontSize: 14, color: colors.textMuted, textAlign: 'center', paddingVertical: 40, paddingHorizontal: 20 },
})
