import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { router } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { API_URL } from '../../lib/config'

/**
 * Inscription e-mail + mot de passe. La classe se choisit ensuite dans
 * l'onboarding (le layout racine y envoie tout compte sans parcours).
 *
 * Avec la confirmation d'e-mail active, signUp() ne renvoie pas de session :
 * le lien reçu ouvre le site, qui confirme puis invite à se connecter ici.
 */
export default function RegisterScreen() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)

  async function handleRegister() {
    const mail = email.trim().toLowerCase()
    if (!fullName.trim()) return setError('Entre ton nom complet.')
    if (!/^\S+@\S+\.\S+$/.test(mail)) return setError('Adresse e-mail invalide.')
    if (password.length < 8) return setError('Le mot de passe doit faire au moins 8 caractères.')

    setError(null)
    setLoading(true)
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: mail,
      password,
      options: {
        data: { full_name: fullName.trim() },
        emailRedirectTo: `${API_URL}/login?confirmed=1`,
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
    // Session immédiate (confirmation désactivée) : le layout racine redirige
    // vers l'onboarding de lui-même.
    if (!data.session) setSentTo(mail)
  }

  if (sentTo) {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.emoji}>📧</Text>
          <Text style={styles.heading}>Vérifie ta boîte mail</Text>
          <Text style={styles.body}>
            Un lien de confirmation a été envoyé à{'\n'}
            <Text style={styles.bold}>{sentTo}</Text>
          </Text>
          <Text style={styles.hint}>
            Clique sur le lien (regarde aussi dans les spams), puis reviens te connecter ici.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.buttonText}>Aller à la connexion</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Cognix</Text>
        <Text style={styles.subtitle}>Crée ton compte gratuit</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Nom complet"
          autoCapitalize="words"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe (8 caractères minimum)"
          secureTextEntry
          autoComplete="new-password"
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.legal}>
          En créant un compte, tu acceptes les CGU et la politique de confidentialité de Cognix.
        </Text>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Création du compte…' : 'Créer mon compte'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F8FE' },
  inner: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32 },
  title: { fontSize: 36, fontWeight: '800', textAlign: 'center', color: '#1E74E8', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#3E4A3E', textAlign: 'center', marginBottom: 32 },
  error: { backgroundColor: '#FDECEC', color: '#B42318', borderRadius: 10, padding: 12, fontSize: 14, marginBottom: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E3EADF', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, marginBottom: 12 },
  legal: { fontSize: 12, color: '#6B7280', marginBottom: 16, lineHeight: 17 },
  button: { backgroundColor: '#1E74E8', borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginBottom: 16 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { textAlign: 'center', color: '#1E74E8', fontSize: 14 },
  emoji: { fontSize: 56, textAlign: 'center', marginBottom: 16 },
  heading: { fontSize: 24, fontWeight: '800', textAlign: 'center', color: '#171D17', marginBottom: 12 },
  body: { fontSize: 15, color: '#3E4A3E', textAlign: 'center', lineHeight: 22, marginBottom: 12 },
  bold: { fontWeight: '700', color: '#171D17' },
  hint: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 28, lineHeight: 19 },
})
