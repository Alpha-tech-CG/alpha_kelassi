import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { router } from 'expo-router'
import { supabase } from '../../lib/supabase'

type Tab = 'email' | 'phone'

export default function LoginScreen() {
  const [tab, setTab] = useState<Tab>('phone')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleEmailLogin() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) Alert.alert('Erreur', error.message)
    else router.replace('/(tabs)')
    setLoading(false)
  }

  async function handlePhoneLogin() {
    setLoading(true)
    const formattedPhone = phone.startsWith('+') ? phone : `+242${phone}`
    const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone })
    if (error) {
      Alert.alert('Erreur', error.message)
    } else {
      router.push({ pathname: '/(auth)/verify-otp', params: { phone: formattedPhone } })
    }
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Kelassi</Text>
        <Text style={styles.subtitle}>Prépare ton examen avec l'IA</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['phone', 'email'] as Tab[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'phone' ? 'SMS' : 'Email'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {tab === 'phone' ? (
          <>
            <View style={styles.phoneRow}>
              <View style={styles.prefix}>
                <Text style={styles.prefixText}>+242</Text>
              </View>
              <TextInput
                style={[styles.input, styles.phoneInput]}
                placeholder="06 XXX XX XX"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handlePhoneLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Envoi SMS...' : 'Recevoir le code SMS'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleEmailLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.link}>Pas de compte ? S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5FBF0' },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 36, fontWeight: '800', textAlign: 'center', color: '#006B2E', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#3E4A3E', textAlign: 'center', marginBottom: 32 },
  tabs: { flexDirection: 'row', backgroundColor: '#E3EADF', borderRadius: 10, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, color: '#3E4A3E' },
  tabTextActive: { color: '#171D17', fontWeight: '600' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E3EADF', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, marginBottom: 12 },
  phoneRow: { flexDirection: 'row', marginBottom: 12 },
  prefix: { backgroundColor: '#EFF6EB', borderWidth: 1, borderColor: '#E3EADF', borderRightWidth: 0, borderTopLeftRadius: 10, borderBottomLeftRadius: 10, paddingHorizontal: 14, justifyContent: 'center' },
  prefixText: { fontSize: 15, color: '#171D17' },
  phoneInput: { flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginBottom: 0 },
  button: { backgroundColor: '#006B2E', borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginBottom: 16 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { textAlign: 'center', color: '#006B2E', fontSize: 14 },
})
