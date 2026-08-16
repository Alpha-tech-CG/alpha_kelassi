import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Share } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { colors, radius, cardShadow, fonts } from '../../lib/theme'

export default function InviterParent() {
  const router = useRouter()
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    const { data } = await supabase.rpc('generate_parent_code')
    setCode((data as string) ?? null)
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>←</Text></TouchableOpacity>
        <Text style={styles.title}>Inviter un parent</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.emoji}>👨‍👩‍👧</Text>
        <Text style={styles.intro}>Génère un code et donne-le à ton parent. Il pourra suivre ta progression (jamais tes messages privés).</Text>

        {code ? (
          <>
            <View style={styles.codeBox}><Text style={styles.code}>{code}</Text></View>
            <Text style={styles.expire}>Valable 24h — un seul usage</Text>
            <TouchableOpacity style={styles.shareBtn} onPress={() => Share.share({ message: `Mon code parent Cognix : ${code} (valable 24h). Ouvre l'app Cognix → Espace parent → saisis ce code.` })}>
              <Text style={styles.shareText}>Partager le code</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.genBtn} onPress={generate} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.genText}>Générer un code</Text>}
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 56, paddingHorizontal: 16, paddingBottom: 12 },
  back: { fontSize: 24, color: colors.text },
  title: { fontSize: 20, fontFamily: fonts.headingBlack, color: colors.text },
  body: { flex: 1, alignItems: 'center', paddingHorizontal: 28, paddingTop: 40 },
  emoji: { fontSize: 60, marginBottom: 16 },
  intro: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 21, marginBottom: 28 },
  codeBox: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 20, paddingHorizontal: 40, ...cardShadow },
  code: { fontSize: 40, fontWeight: '900', color: '#fff', letterSpacing: 8 },
  expire: { fontSize: 12, color: colors.textMuted, marginTop: 12 },
  shareBtn: { marginTop: 24, backgroundColor: colors.primaryTint, borderRadius: radius.lg, paddingVertical: 14, paddingHorizontal: 30 },
  shareText: { color: colors.primary, fontWeight: '800', fontSize: 15 },
  genBtn: { backgroundColor: colors.primary, borderRadius: radius.lg, paddingVertical: 16, paddingHorizontal: 40, ...cardShadow },
  genText: { color: '#fff', fontWeight: '800', fontSize: 16 },
})
