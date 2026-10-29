import { useEffect, useState } from 'react'
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'
import { readCachedLesson, writeCachedLesson } from '../../lib/lessonCache'
import { enfiler, viderLaFile } from '../../lib/outbox'
import { LessonContent } from '../../components/LessonContent'
import { MathLessonView } from '../../components/MathLessonView'
import { BackButton } from '../../components/BackButton'
import { CognixLoader } from '../../components/CognixLoader'

// Formules LaTeX ou tableaux → rendu riche ; le rendu léger ne gère ni l'un ni l'autre.
const needsRich = (s?: string | null) => !!s && (/\$[^$\n]+\$|\$\$|^[ \t]*\$[ \t]*$/m.test(s) || /^\|.+\|\s*$/m.test(s))

interface Exercise { id: string; title: string; statement: string; difficulty: number; order_index: number }
const DIFF: Record<number, { label: string; bg: string; fg: string }> = {
  1: { label: 'Facile',    bg: '#E6F7EE', fg: '#0B8A46' },
  2: { label: 'Moyen',     bg: '#FFF3E0', fg: '#C77700' },
  3: { label: 'Difficile', bg: '#FDE2E1', fg: '#C62828' },
}
const MIN_ANSWER = 2

function Markdown({ content }: { content: string }) {
  return needsRich(content) ? <MathLessonView content={content} /> : <LessonContent content={content} />
}

export default function ExercicesScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>()
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('Exercices')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [drafts, setDrafts] = useState<Record<string, string>>({})        // réponse en cours de rédaction
  const [answers, setAnswers] = useState<Record<string, string>>({})      // réponses validées (gardées sur l'appareil)
  const [attempted, setAttempted] = useState<Record<string, boolean>>({}) // tentative enregistrée → corrigé ouvrable
  const [solutions, setSolutions] = useState<Record<string, string>>({})  // corrigés ouverts par l'élève
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fromCache, setFromCache] = useState(false)   // contenu servi depuis l'appareil

  const answersKey = `exercise-answers:${chapterId}`
  // Copies locales : énoncés, tentatives et corrigés déjà consultés restent
  // lisibles sans connexion (cf. lib/lessonCache.ts et lib/offlineSync.ts).
  const listKey = `exercises:${chapterId}`
  const attemptsKey = `exercise-attempts:${chapterId}`
  const solutionsKey = `exercise-solutions:${chapterId}`

  useEffect(() => {
    let cancelled = false

    async function load() {
      // 1) Copies locales d'abord : affichage immédiat, même sans réseau ou
      //    sur une connexion lente (une requête qui met dix secondes à échouer
      //    ne doit pas retarder des exercices déjà téléchargés).
      let affiche = false
      try {
        const copie = await readCachedLesson(listKey)
        if (copie && !cancelled) {
          const parsed = JSON.parse(copie) as { title?: string; exercises?: Exercise[] }
          if (parsed.exercises?.length) {
            setTitle(parsed.title ?? 'Exercices')
            setExercises(parsed.exercises)
            setFromCache(true)
            setLoading(false)
            affiche = true
          }
        }
      } catch { /* aucune copie locale pour ce chapitre */ }

      for (const [cle, applique] of [
        [answersKey, (v: unknown) => setAnswers(v as Record<string, string>)],
        [attemptsKey, (v: unknown) => setAttempted(v as Record<string, boolean>)],
        [solutionsKey, (v: unknown) => setSolutions(v as Record<string, string>)],
      ] as const) {
        try {
          const brut = await readCachedLesson(cle)
          if (brut && !cancelled) applique(JSON.parse(brut))
        } catch { /* rien de gardé sur cet appareil pour cette clé */ }
      }

      // 2) Réseau ensuite, avec délai maximal : il rafraîchit ce qui est
      //    affiché, mais ne le remplace jamais par du vide.
      try {
        const limite = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), affiche ? 4000 : 8000),
        )
        const requete = (async () => {
          const [{ data: chapter }, { data: rows }, { data: { user } }] = await Promise.all([
            supabase.from('chapters').select('title').eq('id', chapterId).maybeSingle(),
            supabase.from('exercises').select('id, title, statement, difficulty, order_index')
              .eq('chapter_id', chapterId).order('order_index'),
            supabase.auth.getUser(),
          ])
          return { chapter, rows, user }
        })()

        const { chapter, rows, user } = await Promise.race([requete, limite])
        if (cancelled) return

        const list = (rows ?? []) as Exercise[]
        const chapterTitle = (chapter as { title?: string } | null)?.title ?? 'Exercices'
        if (list.length > 0) {
          setTitle(chapterTitle)
          setExercises(list)
          setFromCache(false)
          writeCachedLesson(listKey, 'chapter', JSON.stringify({ title: chapterTitle, exercises: list }))

          if (user) {
            const { data: att } = await supabase.from('exercise_attempts').select('exercise_id')
              .eq('user_id', user.id).in('exercise_id', list.map((e) => e.id))
            if (att && !cancelled) {
              const tentatives: Record<string, boolean> = {}
              for (const a of att as { exercise_id: string }[]) tentatives[a.exercise_id] = true
              setAttempted((prev) => ({ ...prev, ...tentatives }))
              writeCachedLesson(attemptsKey, 'chapter', JSON.stringify(tentatives))
            }
          }
        }
      } catch {
        /* réseau absent ou trop lent : on garde ce que l'appareil contient */
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    setLoading(true)
    load()
    viderLaFile()        // réponses validées hors connexion : on tente l'envoi
    return () => { cancelled = true }
  }, [chapterId, answersKey, listKey, attemptsKey, solutionsKey])

  /** Valide la réponse de l'élève : c'est la tentative qui rend le corrigé ouvrable (RLS). Le corrigé ne s'affiche pas pour autant. */
  async function submit(ex: Exercise) {
    const answer = (drafts[ex.id] ?? '').trim()
    if (answer.length < MIN_ANSWER || busy) return
    setBusy(ex.id); setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setError('Connecte-toi pour enregistrer ta réponse.'); return }
      const { error: err } = await supabase.from('exercise_attempts').upsert(
        { user_id: user.id, exercise_id: ex.id }, { onConflict: 'user_id,exercise_id', ignoreDuplicates: true },
      )
      // Hors connexion, la tentative part en file d'attente : la réponse est
      // gardée sur l'appareil et envoyée dès que le réseau revient.
      if (err) await enfiler({ type: 'exercise_attempt', exerciseId: ex.id, at: Date.now() })
      const next = { ...answers, [ex.id]: answer }
      setAnswers(next)
      setAttempted((prev) => {
        const suivant = { ...prev, [ex.id]: true }
        writeCachedLesson(attemptsKey, 'chapter', JSON.stringify(suivant))
        return suivant
      })
      writeCachedLesson(answersKey, 'chapter', JSON.stringify(next))
    } catch {
      setError('Réponse non enregistrée. Vérifie ta connexion et réessaie.')
    } finally {
      setBusy(null)
    }
  }

  /** Ouvre le corrigé — seulement à la demande de l'élève, jamais automatiquement. */
  async function reveal(ex: Exercise) {
    if (solutions[ex.id] || busy) return
    setBusy(ex.id); setError(null)
    try {
      const { data: sol } = await supabase.from('exercise_solutions').select('solution').eq('exercise_id', ex.id).maybeSingle()
      const texte = (sol as { solution?: string } | null)?.solution
      if (!texte) {
        setError("Ce corrigé n'a pas encore été téléchargé sur cet appareil. Reconnecte-toi une fois pour l'ouvrir.")
        return
      }
      setSolutions((prev) => {
        const next = { ...prev, [ex.id]: texte }
        writeCachedLesson(solutionsKey, 'chapter', JSON.stringify(next))   // relisible hors connexion
        return next
      })
    } catch {
      setError('Corrigé indisponible. Vérifie ta connexion et réessaie.')
    } finally {
      setBusy(null)
    }
  }

  /** Rouvre la zone de réponse pour retenter l'exercice avant de regarder le corrigé. */
  function retry(ex: Exercise) {
    setDrafts((prev) => ({ ...prev, [ex.id]: answers[ex.id] ?? '' }))
    const next = { ...answers }
    delete next[ex.id]
    setAnswers(next)
    writeCachedLesson(answersKey, 'chapter', JSON.stringify(next))
  }

  if (loading) return <CognixLoader />

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <BackButton />
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={2}>Exercices — {title}</Text>
          {fromCache && <Text style={styles.offline}>⤓ Version hors-ligne</Text>}
        </View>
      </View>

      {exercises.length === 0 ? (
        <View style={styles.empty}><Text style={styles.emptyText}>Aucun exercice pour ce chapitre.</Text></View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.hint}>Écris ta réponse et valide-la. Le corrigé ne s'ouvre que lorsque tu le demandes.</Text>
          {error && <Text style={styles.error}>{error}</Text>}

          {exercises.map((ex, i) => {
            const d = DIFF[ex.difficulty] ?? DIFF[1]!
            const solution = solutions[ex.id]
            const answer = answers[ex.id]
            const draft = drafts[ex.id] ?? ''
            // Tentative déjà enregistrée (ici ou sur un autre appareil) et pas de nouvelle rédaction en cours.
            const answered = attempted[ex.id] && (answer !== undefined || drafts[ex.id] === undefined)
            return (
              <View key={ex.id} style={styles.card}>
                <View style={styles.cardHead}>
                  <Text style={styles.exNum}>Exercice {i + 1}</Text>
                  <View style={[styles.badge, { backgroundColor: d.bg }]}><Text style={[styles.badgeText, { color: d.fg }]}>{d.label}</Text></View>
                </View>
                {ex.title ? <Text style={styles.exTitle}>{ex.title}</Text> : null}
                <View style={{ marginTop: 6 }}><Markdown content={ex.statement} /></View>

                {!answered ? (
                  <>
                    <Text style={styles.fieldLabel}>Ta réponse</Text>
                    <TextInput
                      style={styles.input} multiline textAlignVertical="top"
                      placeholder="Écris ici ta démarche et ton résultat…" placeholderTextColor={colors.outline}
                      value={draft} onChangeText={(v) => setDrafts((prev) => ({ ...prev, [ex.id]: v }))}
                    />
                    <TouchableOpacity
                      style={[styles.submitBtn, (draft.trim().length < MIN_ANSWER || busy === ex.id) && styles.btnDisabled]}
                      disabled={draft.trim().length < MIN_ANSWER || busy === ex.id} onPress={() => submit(ex)}
                    >
                      <Text style={styles.submitText}>{busy === ex.id ? '…' : 'Valider ma réponse'}</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.answer}>
                      <Text style={styles.answerLabel}>Ta réponse</Text>
                      <Text style={styles.answerText}>{answer ?? 'Tu as déjà travaillé cet exercice.'}</Text>
                    </View>
                    {solution ? (
                      <View style={styles.solution}>
                        <Text style={styles.solutionLabel}>Corrigé détaillé</Text>
                        <Markdown content={solution} />
                      </View>
                    ) : (
                      <View style={styles.actions}>
                        <TouchableOpacity style={styles.retryBtn} onPress={() => retry(ex)} disabled={busy === ex.id}>
                          <Text style={styles.retryText}>Réessayer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.revealBtn, busy === ex.id && styles.btnDisabled]} onPress={() => reveal(ex)} disabled={busy === ex.id}>
                          <Text style={styles.revealText}>{busy === ex.id ? '…' : 'Voir le corrigé'}</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                )}
              </View>
            )
          })}
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12 },
  back: { fontSize: 24, color: colors.text, marginBottom: 8 },
  offline: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: colors.cardBorder, ...cardShadow },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  exNum: { fontSize: 13, fontWeight: '900', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  badgeText: { fontSize: 11, fontWeight: '800' },
  exTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 2 },
  fieldLabel: { marginTop: 14, fontSize: 13, fontWeight: '800', color: colors.textMuted },
  input: { marginTop: 6, minHeight: 110, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.md, padding: 12, fontSize: 15, lineHeight: 21, color: colors.text, backgroundColor: colors.background },
  submitBtn: { marginTop: 12, backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '800', fontSize: 15 },
  btnDisabled: { opacity: 0.5 },
  answer: { marginTop: 14, backgroundColor: colors.primaryTint, borderRadius: radius.md, padding: 12 },
  answerLabel: { fontSize: 12, fontWeight: '800', color: colors.primary, marginBottom: 4 },
  answerText: { fontSize: 14, lineHeight: 20, color: colors.text },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  retryBtn: { flex: 1, borderWidth: 1.5, borderColor: colors.cardBorder, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' },
  retryText: { color: colors.textMuted, fontWeight: '800', fontSize: 15 },
  revealBtn: { flex: 1, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.md, paddingVertical: 12, alignItems: 'center' },
  revealText: { color: colors.primary, fontWeight: '800', fontSize: 15 },
  solution: { marginTop: 14, backgroundColor: '#F0FBF5', borderRadius: radius.md, padding: 14, borderWidth: 1, borderColor: '#CBEBD9' },
  solutionLabel: { fontSize: 13, fontWeight: '800', color: '#0B8A46', marginBottom: 8 },
  hint: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  error: { fontSize: 13, color: '#C62828', fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 14, color: colors.textMuted },
})
