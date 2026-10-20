import { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, fonts, radius } from '../../lib/theme'
import { BackButton } from '../../components/BackButton'

const RESEND_DELAY = 60

/**
 * Confirmation du compte par code : l'e-mail « Confirm signup » de Supabase
 * contient {{ .Token }} (6 chiffres). verifyOtp() ouvre directement la
 * session ; le layout racine envoie alors vers l'onboarding.
 */
export default function VerifyEmailScreen() {
  const { email, name, fresh } = useLocalSearchParams<{ email: string; name?: string; fresh?: string }>()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  // Juste après l'inscription, un code vient de partir : on fait patienter avant
  // d'en redemander un. Depuis la connexion, le renvoi est possible tout de suite.
  const [wait, setWait] = useState(fresh ? RESEND_DELAY : 0)
  const input = useRef<TextInput>(null)

  useEffect(() => {
    if (wait <= 0) return
    const t = setTimeout(() => setWait((w) => w - 1), 1000)
    return () => clearTimeout(t)
  }, [wait])

  async function verify(token: string) {
    if (!email) return
    setLoading(true)
    setError(null)
    const { error: err } = await supabase.auth.verifyOtp({ email, token, type: 'signup' })
    setLoading(false)
    if (err) {
      setError(
        /expired/i.test(err.message)
          ? 'Ce code a expiré. Demande-en un nouveau.'
          : 'Code incorrect. Vérifie les chiffres et réessaie.'
      )
      setCode('')
      input.current?.focus()
    }
    // Succès : la session arrive, le layout racine prend la main.
  }

  function onChange(t: string) {
    const digits = t.replace(/\D/g, '').slice(0, 8)
    setCode(digits)
    setError(null)
    if (digits.length === 6) void verify(digits)
  }

  async function resend() {
    if (!email || wait > 0) return
    setError(null)
    const { error: err } = await supabase.auth.resend({ type: 'signup', email })
    if (err) {
      setError(/rate limit|seconds/i.test(err.message) ? 'Patiente un peu avant de redemander un code.' : 'Envoi impossible pour le moment.')
      return
    }
    setInfo('Nouveau code envoyé ✅')
    setWait(RESEND_DELAY)
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.header}>
        <BackButton label="Connexion" onPress={() => router.replace('/(auth)/login')} />
      </View>
      <View style={styles.body}>
        <Text style={styles.emoji}>📩</Text>
        <Text style={styles.title}>{name ? `Plus qu’une étape, ${name} !` : 'Confirme ton e-mail'}</Text>
        <Text style={styles.subtitle}>
          Entre le code à 6 chiffres envoyé à{'\n'}
          <Text style={styles.strong}>{email}</Text>
        </Text>

        <TextInput
          ref={input}
          style={styles.code}
          value={code}
          onChangeText={onChange}
          keyboardType="number-pad"
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          maxLength={8}
          autoFocus
          placeholder="••••••"
          placeholderTextColor={colors.outlineVariant}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {info && !error ? <Text style={styles.info}>{info}</Text> : null}

        <TouchableOpacity
          style={[styles.btn, (loading || code.length < 6) && styles.btnDisabled]}
          onPress={() => verify(code)}
          disabled={loading || code.length < 6}
        >
          {loading ? <ActivityIndicator color={colors.onPrimary} /> : <Text style={styles.btnText}>Valider</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={resend} disabled={wait > 0}>
          <Text style={[styles.link, wait > 0 && styles.linkOff]}>
            {wait > 0 ? `Renvoyer le code dans ${wait} s` : 'Renvoyer le code'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Pas reçu ? Regarde dans les spams ou « Promotions ».</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 52 },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  emoji: { fontSize: 52, marginBottom: 12 },
  title: { fontFamily: fonts.heading, fontSize: 26, color: colors.text, marginBottom: 6 },
  subtitle: { fontFamily: fonts.regular, fontSize: 15, color: colors.textMuted, lineHeight: 22, marginBottom: 24 },
  strong: { fontFamily: fonts.body, color: colors.text },
  code: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: radius.md,
    paddingVertical: 16,
    fontSize: 30,
    letterSpacing: 10,
    textAlign: 'center',
    fontFamily: fonts.heading,
    color: colors.text,
    marginBottom: 12,
  },
  error: {
    fontFamily: fonts.body,
    backgroundColor: '#FDECEC',
    color: '#B42318',
    borderRadius: radius.md,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  info: { fontFamily: fonts.body, color: '#0F8F4F', fontSize: 14, marginBottom: 12 },
  btn: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: 4, marginBottom: 18 },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontFamily: fonts.body, color: colors.onPrimary, fontSize: 16 },
  link: { fontFamily: fonts.body, textAlign: 'center', color: colors.primary, fontSize: 14 },
  linkOff: { color: colors.textMuted },
  hint: { fontFamily: fonts.regular, textAlign: 'center', color: colors.textMuted, fontSize: 12, marginTop: 10 },
})
