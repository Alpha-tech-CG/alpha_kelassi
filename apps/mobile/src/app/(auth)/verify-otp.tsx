import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { supabase } from '../../lib/supabase'

export default function VerifyOTPScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleVerify() {
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({
      phone: phone ?? '',
      token: otp,
      type: 'sms',
    })

    if (error) {
      Alert.alert('Code invalide', 'Le code est invalide ou a expiré. Réessaie.')
    } else {
      router.replace('/(tabs)')
    }
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📱</Text>
      <Text style={styles.title}>Code SMS</Text>
      <Text style={styles.subtitle}>
        Entrez le code reçu au{'\n'}<Text style={styles.phone}>{phone}</Text>
      </Text>

      <TextInput
        style={styles.otpInput}
        placeholder="000000"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={(v) => setOtp(v.replace(/\D/g, ''))}
      />

      <TouchableOpacity
        style={[styles.button, (loading || otp.length < 6) && styles.buttonDisabled]}
        onPress={handleVerify}
        disabled={loading || otp.length < 6}
      >
        <Text style={styles.buttonText}>{loading ? 'Vérification...' : 'Confirmer'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAF8', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6D7A72', textAlign: 'center', marginBottom: 32 },
  phone: { fontWeight: '700', color: '#1F2A24' },
  otpInput: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#DDE8E1', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 16, fontSize: 28, letterSpacing: 12, fontFamily: 'monospace', textAlign: 'center', width: '100%', marginBottom: 20 },
  button: { backgroundColor: '#0F8F4F', borderRadius: 10, paddingVertical: 15, alignItems: 'center', width: '100%' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
