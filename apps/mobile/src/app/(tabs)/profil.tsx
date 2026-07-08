import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'

interface Profile { full_name: string | null; plan: string }

export default function ProfilScreen() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email ?? '')
      const { data } = await supabase.from('users').select('full_name, plan').eq('id', user.id).single()
      setProfile(data)
    }
    load()
  }, [])

  async function signOut() {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnecter', style: 'destructive', onPress: async () => {
          await supabase.auth.signOut()
          router.replace('/(auth)/login')
        }
      },
    ])
  }

  if (!profile) return <ActivityIndicator style={{ flex: 1 }} color="#0F8F4F" />

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile.full_name?.[0]?.toUpperCase() ?? '?'}</Text>
        </View>
        <Text style={styles.name}>{profile.full_name ?? 'Élève'}</Text>
        <Text style={styles.email}>{email}</Text>
        <View style={[styles.planBadge, profile.plan === 'premium' && styles.planBadgePremium]}>
          <Text style={[styles.planText, profile.plan === 'premium' && styles.planTextPremium]}>
            {profile.plan === 'premium' ? '⭐ Premium' : 'Gratuit'}
          </Text>
        </View>
      </View>

      {profile.plan === 'free' && (
        <TouchableOpacity style={styles.upgradeBtn}>
          <Text style={styles.upgradeBtnText}>Passer à Premium — 2 000 FCFA/mois</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAF8', padding: 24 },
  header: { alignItems: 'center', paddingTop: 60, marginBottom: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#0F8F4F', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, color: '#fff', fontWeight: '700' },
  name: { fontSize: 20, fontWeight: '700', color: '#1F2A24' },
  email: { fontSize: 14, color: '#6D7A72', marginTop: 4, marginBottom: 8 },
  planBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, backgroundColor: '#EEF8F4' },
  planBadgePremium: { backgroundColor: '#FFF7CC' },
  planText: { fontSize: 13, color: '#6D7A72', fontWeight: '600' },
  planTextPremium: { color: '#0B6B3A' },
  upgradeBtn: { backgroundColor: '#0F8F4F', borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 12 },
  upgradeBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  logoutBtn: { borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#DDE8E1', backgroundColor: '#fff' },
  logoutText: { color: '#E53935', fontWeight: '600', fontSize: 15 },
})
