import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'
import { colors } from '../../lib/theme'
import { SolarIcon } from '../../icons/solar'

function OfflineBanner() {
  const { isOnline } = useNetworkStatus()
  if (isOnline) return null
  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>📡 Mode hors-ligne</Text>
    </View>
  )
}

export default function TabsLayout() {
  return (
    <>
      <OfflineBanner />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: colors.cardBorder,
            borderTopWidth: 1,
            height: 66,
            paddingTop: 8,
            paddingBottom: 10,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
          },
          tabBarLabelStyle: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index"  options={{ title: 'Accueil', tabBarIcon: ({ color }) => <SolarIcon name="home" size={26} color={color} /> }} />
        <Tabs.Screen name="cours"  options={{ title: 'Cours',   tabBarIcon: ({ color }) => <SolarIcon name="play" size={26} color={color} /> }} />
        <Tabs.Screen name="tuteur" options={{ title: 'Cognix', tabBarIcon: ({ color }) => <SolarIcon name="chat" size={26} color={color} /> }} />
        <Tabs.Screen name="profil" options={{ title: 'Profil',  tabBarIcon: ({ color }) => <SolarIcon name="user" size={26} color={color} /> }} />
        {/* Examens : accessible via le raccourci Accueil, masqué de la barre (design = 4 onglets) */}
        <Tabs.Screen name="examens" options={{ href: null }} />
      </Tabs>
    </>
  )
}

const styles = StyleSheet.create({
  banner: { backgroundColor: colors.text, paddingTop: 40, paddingBottom: 6, alignItems: 'center' },
  bannerText: { color: '#fff', fontSize: 12, fontWeight: '700' },
})
