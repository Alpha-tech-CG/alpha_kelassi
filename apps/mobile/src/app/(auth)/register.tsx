import { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  ActivityIndicator,
  Linking,
} from 'react-native'
import { router } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'
import { LEVEL_LABEL, colors, fonts, radius, cardShadow } from '../../lib/theme'
import { BackButton } from '../../components/BackButton'
import { PASSWORD_RULES, isPasswordValid } from '../../lib/password'
import { track } from '../../lib/analytics'

/**
 * Inscription en questionnaire : une question par écran, ~45 secondes.
 * Prénom → Nom → Naissance → Classe → Établissement → Ville → Objectif → E-mail.
 *
 * Les réponses partent en métadonnées de signUp() ; le trigger
 * handle_new_user (migrations 066-067) les recopie dans public.users. La classe
 * choisie ici évite à l'onboarding de la redemander (il passe aux matières).
 */

type Cycle = 'primaire' | 'college' | 'lycee'
type Goal = 'examen' | 'notes' | 'retard' | 'rythme'
interface Series {
  id: string
  code: string
  label: string
  level: string
  track: 'generale' | 'technique'
}

const CYCLE_LEVELS: Record<Exclude<Cycle, 'lycee'>, string[]> = {
  primaire: ['cp1', 'cp2', 'ce1', 'ce2', 'cm1', 'cepe'],
  college: ['sixieme', 'cinquieme', 'quatrieme', 'bepc'],
}
const isLycee = (level: string) =>
  level.startsWith('seconde') || level.startsWith('premiere') || level.startsWith('bac_')
const LEVEL_ORDER: Record<string, number> = Object.fromEntries(
  Object.keys(LEVEL_LABEL).map((level, i) => [level, i])
)

/** « Terminale C » + « Mathématiques et Sciences Physiques » à partir d'une série. */
function classTitle(s: Series): string {
  if (s.level.startsWith('bac_')) return `Terminale ${s.code}`
  return LEVEL_LABEL[s.level] ?? s.code
}
function classDetail(s: Series): string {
  const i = s.label.indexOf('—')
  return i >= 0 ? s.label.slice(i + 1).trim() : ''
}

const CITIES = ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Ouesso', 'Owando', 'Impfondo', 'Madingou']
const GOALS: { value: Goal; emoji: string; title: string }[] = [
  { value: 'examen', emoji: '🎓', title: 'Réussir mon examen' },
  { value: 'notes', emoji: '📈', title: 'Améliorer mes notes' },
  { value: 'retard', emoji: '⏱️', title: 'Rattraper mon retard' },
  { value: 'rythme', emoji: '🌱', title: 'Apprendre à mon rythme' },
]

const STEPS = ['prenom', 'nom', 'naissance', 'classe', 'ecole', 'ville', 'objectif', 'compte'] as const
type Step = (typeof STEPS)[number]

/** « 14032008 » → « 14/03/2008 » pendant la frappe. */
function formatDate(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 2) return d
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}
/** « 14/03/2008 » → « 2008-03-14 », ou null si la date n'existe pas / est hors bornes. */
function parseDate(text: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text)
  if (!m) return null
  const [, dd, mm, yyyy] = m
  const date = new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd)))
  if (date.getUTCDate() !== Number(dd) || date.getUTCMonth() !== Number(mm) - 1) return null
  const age = (Date.now() - date.getTime()) / (365.25 * 24 * 3600 * 1000)
  if (age < 4 || age > 70) return null
  return `${yyyy}-${mm}-${dd}`
}

export default function RegisterScreen() {
  const [stepIndex, setStepIndex] = useState(0)
  const step: Step = STEPS[stepIndex]!

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birth, setBirth] = useState('')
  const [cycle, setCycle] = useState<Cycle | null>(null)
  const [klass, setKlass] = useState<Series | null>(null)
  const [school, setSchool] = useState('')
  const [city, setCity] = useState('')
  const [otherCity, setOtherCity] = useState(false)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [series, setSeries] = useState<Series[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const progress = useRef(new Animated.Value(1 / STEPS.length)).current
  const fade = useRef(new Animated.Value(1)).current

  // Entonnoir d'inscription : une trace par écran affiché (aucune réponse envoyée).
  useEffect(() => {
    track('register_step', { index: stepIndex, step })
  }, [stepIndex, step])

  // Classes ouvertes aux élèves (RLS sur `series`, lisible sans compte).
  useEffect(() => {
    supabase
      .from('series')
      .select('id, code, label, level, track')
      .then(({ data }) =>
        setSeries(
          ((data ?? []) as Series[])
            .slice()
            .sort((a, b) => (LEVEL_ORDER[a.level] ?? 99) - (LEVEL_ORDER[b.level] ?? 99) || a.code.localeCompare(b.code))
        )
      )
  }, [])

  function go(to: number) {
    setError(null)
    Animated.timing(fade, { toValue: 0, duration: 110, useNativeDriver: true }).start(() => {
      setStepIndex(to)
      Animated.timing(fade, { toValue: 1, duration: 180, useNativeDriver: true }).start()
    })
    Animated.timing(progress, { toValue: (to + 1) / STEPS.length, duration: 250, useNativeDriver: false }).start()
  }
  const next = () => go(stepIndex + 1)
  const back = () => (stepIndex === 0 ? router.back() : go(stepIndex - 1))

  /** Valide l'écran courant ; renvoie un message d'erreur ou null. */
  function check(): string | null {
    switch (step) {
      case 'prenom':
        return firstName.trim().length >= 2 ? null : 'Écris ton prénom.'
      case 'nom':
        return lastName.trim().length >= 2 ? null : 'Écris ton nom.'
      case 'naissance':
        return parseDate(birth) ? null : 'Date invalide : écris-la comme 14/03/2008.'
      case 'classe':
        return klass ? null : 'Choisis ta classe.'
      case 'ville':
        return city.trim() ? null : 'Choisis ta ville.'
      case 'objectif':
        return goal ? null : 'Choisis ton objectif.'
      default:
        return null
    }
  }
  function onContinue() {
    const err = check()
    if (err) return setError(err)
    if (step === 'compte') return submit()
    next()
  }

  async function submit() {
    const mail = email.trim().toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(mail)) return setError('Adresse e-mail invalide.')
    if (!isPasswordValid(password)) {
      return setError('Mot de passe trop faible : 8 caractères avec une minuscule, une majuscule et un chiffre.')
    }
    if (password !== password2) return setError('Les deux mots de passe ne sont pas identiques.')
    setError(null)
    setLoading(true)
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: mail,
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          birthdate: parseDate(birth),
          study_level: klass?.level,
          track_type: klass?.track,
          school: school.trim() || undefined,
          city: city.trim(),
          goal,
        },
        emailRedirectTo: `${API_URL}/login?confirmed=1`, // repli si le modèle d'e-mail garde un lien
      },
    })
    setLoading(false)
    if (signUpError) {
      setError(
        /already registered|already exists/i.test(signUpError.message)
          ? 'Un compte existe déjà avec cet e-mail. Connecte-toi.'
          : /rate limit/i.test(signUpError.message)
            ? 'Trop d’essais, réessaie dans quelques minutes.'
            : 'Inscription impossible pour le moment. Vérifie ta connexion et réessaie.'
      )
      return
    }
    track('register_submitted', { level: klass?.level ?? null })
    if (data.session) track('register_completed')
    // Session immédiate (confirmation désactivée) : le layout racine envoie à
    // l'onboarding de lui-même. Sinon : saisie du code reçu par e-mail.
    if (!data.session) {
      router.replace({
        pathname: '/(auth)/verify-email',
        params: { email: mail, name: firstName.trim(), fresh: '1' },
      } as any)
    }
  }

  const classes = (series ?? []).filter((s) =>
    !cycle ? false : cycle === 'lycee' ? isLycee(s.level) : CYCLE_LEVELS[cycle].includes(s.level)
  )
  const canSkip = step === 'ecole'

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.header}>
        <BackButton label={stepIndex === 0 ? 'Connexion' : 'Retour'} onPress={back} />
        <Text style={styles.counter}>
          {stepIndex + 1}/{STEPS.length}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[styles.bar, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}
        />
      </View>

      <Animated.View style={[styles.flex, { opacity: fade }]}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {step === 'prenom' && (
            <>
              <Text style={styles.kicker}>BIENVENUE SUR COGNIX</Text>
              <Text style={styles.title}>Comment tu t’appelles ?</Text>
              <Text style={styles.subtitle}>Ton prénom</Text>
              <TextInput
                placeholderTextColor={colors.outlineVariant}
                style={styles.input}
                placeholder="Ex : Merveille"
                autoFocus
                autoCapitalize="words"
                autoComplete="given-name"
                returnKeyType="next"
                value={firstName}
                onChangeText={setFirstName}
                onSubmitEditing={onContinue}
              />
            </>
          )}

          {step === 'nom' && (
            <>
              <Text style={styles.title}>Enchanté, {firstName.trim()} 👋</Text>
              <Text style={styles.subtitle}>Et ton nom de famille ?</Text>
              <TextInput
                placeholderTextColor={colors.outlineVariant}
                style={styles.input}
                placeholder="Ex : Obambi"
                autoFocus
                autoCapitalize="words"
                autoComplete="family-name"
                returnKeyType="next"
                value={lastName}
                onChangeText={setLastName}
                onSubmitEditing={onContinue}
              />
            </>
          )}

          {step === 'naissance' && (
            <>
              <Text style={styles.title}>Ta date de naissance</Text>
              <Text style={styles.subtitle}>Jour / mois / année</Text>
              <TextInput
                placeholderTextColor={colors.outlineVariant}
                style={[styles.input, styles.dateInput]}
                placeholder="14/03/2008"
                autoFocus
                keyboardType="number-pad"
                maxLength={10}
                value={birth}
                onChangeText={(t) => setBirth(formatDate(t))}
                onSubmitEditing={onContinue}
              />
            </>
          )}

          {step === 'classe' && (
            <>
              <Text style={styles.title}>Tu es en quelle classe ?</Text>
              <Text style={styles.subtitle}>On adapte les cours à ton programme.</Text>
              <View style={styles.chips}>
                {(['primaire', 'college', 'lycee'] as Cycle[]).map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.chip, cycle === c && styles.chipOn]}
                    onPress={() => {
                      setCycle(c)
                      setKlass(null)
                      setError(null)
                    }}
                  >
                    <Text style={[styles.chipText, cycle === c && styles.chipTextOn]}>
                      {c === 'primaire' ? 'Primaire' : c === 'college' ? 'Collège' : 'Lycée'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {!series && <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />}
              {cycle && series && classes.length === 0 && (
                <Text style={styles.hint}>Aucune classe de ce cycle n’est encore ouverte.</Text>
              )}
              {(['generale', 'technique'] as const).map((t) => {
                const list = classes.filter((s) => cycle !== 'lycee' || s.track === t)
                if (list.length === 0 || (cycle !== 'lycee' && t === 'technique')) return null
                return (
                  <View key={t}>
                    {cycle === 'lycee' && (
                      <Text style={styles.groupLabel}>{t === 'generale' ? 'Enseignement général' : 'Enseignement technique'}</Text>
                    )}
                    <View style={styles.grid}>
                      {list.map((s) => (
                        <TouchableOpacity
                          key={s.id}
                          style={[styles.option, styles.optionHalf, klass?.id === s.id && styles.optionOn]}
                          onPress={() => {
                            setKlass(s)
                            setError(null)
                          }}
                        >
                          <Text style={[styles.optionTitle, klass?.id === s.id && styles.optionTitleOn]}>
                            {classTitle(s)}
                          </Text>
                          {classDetail(s) ? (
                            <Text style={styles.optionDetail} numberOfLines={2}>
                              {classDetail(s)}
                            </Text>
                          ) : null}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )
              })}
            </>
          )}

          {step === 'ecole' && (
            <>
              <Text style={styles.title}>Ton établissement</Text>
              <Text style={styles.subtitle}>École, collège ou lycée (facultatif)</Text>
              <TextInput
                placeholderTextColor={colors.outlineVariant}
                style={styles.input}
                placeholder="Ex : Lycée Savorgnan de Brazza"
                autoFocus
                autoCapitalize="words"
                returnKeyType="next"
                maxLength={120}
                value={school}
                onChangeText={setSchool}
                onSubmitEditing={onContinue}
              />
            </>
          )}

          {step === 'ville' && (
            <>
              <Text style={styles.title}>Tu habites où ?</Text>
              <Text style={styles.subtitle}>Ta ville</Text>
              <View style={styles.chips}>
                {CITIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.chip, !otherCity && city === c && styles.chipOn]}
                    onPress={() => {
                      setOtherCity(false)
                      setCity(c)
                      setError(null)
                    }}
                  >
                    <Text style={[styles.chipText, !otherCity && city === c && styles.chipTextOn]}>{c}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.chip, otherCity && styles.chipOn]}
                  onPress={() => {
                    setOtherCity(true)
                    setCity('')
                  }}
                >
                  <Text style={[styles.chipText, otherCity && styles.chipTextOn]}>Autre…</Text>
                </TouchableOpacity>
              </View>
              {otherCity && (
                <TextInput
                placeholderTextColor={colors.outlineVariant}
                  style={styles.input}
                  placeholder="Nom de ta ville"
                  autoFocus
                  autoCapitalize="words"
                  maxLength={80}
                  value={city}
                  onChangeText={setCity}
                  onSubmitEditing={onContinue}
                />
              )}
            </>
          )}

          {step === 'objectif' && (
            <>
              <Text style={styles.title}>Ton objectif cette année ?</Text>
              <Text style={styles.subtitle}>Cognix t’accompagne dans ce sens.</Text>
              {GOALS.map((g) => (
                <TouchableOpacity
                  key={g.value}
                  style={[styles.option, styles.goal, goal === g.value && styles.optionOn]}
                  onPress={() => {
                    setGoal(g.value)
                    setError(null)
                  }}
                >
                  <Text style={styles.goalEmoji}>{g.emoji}</Text>
                  <Text style={[styles.optionTitle, goal === g.value && styles.optionTitleOn]}>{g.title}</Text>
                </TouchableOpacity>
              ))}
            </>
          )}

          {step === 'compte' && (
            <>
              <Text style={styles.title}>Dernière étape 🚀</Text>
              <Text style={styles.subtitle}>Ton e-mail et un mot de passe pour te connecter.</Text>
              <TextInput
                placeholderTextColor={colors.outlineVariant}
                style={styles.input}
                placeholder="ton@email.com"
                autoFocus
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
                value={email}
                onChangeText={setEmail}
              />
              <View>
                <TextInput
                placeholderTextColor={colors.outlineVariant}
                  style={[styles.input, { paddingRight: 70 }]}
                  placeholder="Mot de passe"
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.eye} onPress={() => setShowPassword((v) => !v)}>
                  <Text style={styles.eyeText}>{showPassword ? 'Cacher' : 'Voir'}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.rules}>
                {PASSWORD_RULES.map((r) => {
                  const ok = r.test(password)
                  return (
                    <Text key={r.label} style={[styles.rule, ok && styles.ruleOk]}>
                      {ok ? '✓' : '•'} {r.label}
                    </Text>
                  )
                })}
              </View>
              <TextInput
                placeholderTextColor={colors.outlineVariant}
                style={styles.input}
                placeholder="Confirme le mot de passe"
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                value={password2}
                onChangeText={setPassword2}
                onSubmitEditing={onContinue}
              />
              {password2.length > 0 && password2 !== password ? (
                <Text style={styles.rule}>Les deux mots de passe ne correspondent pas.</Text>
              ) : null}
              <Text style={styles.legal}>
                En créant ton compte, tu acceptes les{' '}
                <Text style={styles.legalLink} onPress={() => Linking.openURL(`${API_URL}/cgu`)}>CGU</Text>
                {' '}et la{' '}
                <Text style={styles.legalLink} onPress={() => Linking.openURL(`${API_URL}/confidentialite`)}>politique de confidentialité</Text>
                {' '}de Cognix.
              </Text>
            </>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </ScrollView>
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={onContinue} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.onPrimary} />
          ) : (
            <Text style={styles.btnText}>{step === 'compte' ? 'Créer mon compte' : 'Continuer'}</Text>
          )}
        </TouchableOpacity>
        {canSkip && !school.trim() ? (
          <TouchableOpacity onPress={next}>
            <Text style={styles.skip}>Passer cette question</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 12,
  },
  counter: { fontFamily: fonts.body, color: colors.textMuted, fontSize: 14 },
  track: { height: 6, marginHorizontal: 20, borderRadius: radius.full, backgroundColor: colors.primaryTint, overflow: 'hidden' },
  bar: { height: 6, borderRadius: radius.full, backgroundColor: colors.primary },
  scroll: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24 },
  kicker: { fontFamily: fonts.body, fontSize: 12, letterSpacing: 1.2, color: colors.primary, marginBottom: 8 },
  title: { fontFamily: fonts.heading, fontSize: 26, color: colors.text, marginBottom: 6 },
  subtitle: { fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted, marginBottom: 22, lineHeight: 21 },
  strong: { fontFamily: fonts.body, color: colors.text },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginTop: 4, marginBottom: 24, lineHeight: 19 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 18,
    fontFamily: fonts.body,
    color: colors.text,
    marginBottom: 12,
  },
  dateInput: { letterSpacing: 2, fontSize: 22 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: fonts.body, fontSize: 14, color: colors.text },
  chipTextOn: { color: colors.onPrimary },
  groupLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted, marginTop: 8, marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  option: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 10,
    ...cardShadow,
  },
  optionHalf: { width: '48.5%', minHeight: 64, justifyContent: 'center' },
  optionOn: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  optionTitle: { fontFamily: fonts.body, fontSize: 15, color: colors.text },
  optionTitleOn: { color: colors.primaryContainer },
  optionDetail: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 3, lineHeight: 16 },
  goal: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 18 },
  goalEmoji: { fontSize: 24 },
  eye: { position: 'absolute', right: 14, top: 0, bottom: 12, justifyContent: 'center' },
  eyeText: { fontFamily: fonts.body, color: colors.primary, fontSize: 14 },
  rules: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, rowGap: 4, marginTop: -4, marginBottom: 12 },
  rule: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted },
  ruleOk: { color: '#0F8F4F' },
  legal: { fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 4, lineHeight: 17 },
  legalLink: { color: colors.primary, textDecorationLine: 'underline' },
  error: {
    fontFamily: fonts.body,
    backgroundColor: '#FDECEC',
    color: '#B42318',
    borderRadius: radius.md,
    padding: 12,
    fontSize: 14,
    marginTop: 8,
  },
  footer: { paddingHorizontal: 24, paddingBottom: 28, paddingTop: 8 },
  btn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: fonts.body, color: colors.onPrimary, fontSize: 16 },
  skip: { fontFamily: fonts.body, textAlign: 'center', color: colors.textMuted, fontSize: 14, marginTop: 14 },
})
