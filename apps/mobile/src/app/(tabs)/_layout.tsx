import { Tabs } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'

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
          tabBarActiveTintColor: '#0F8F4F',
          tabBarInactiveTintColor: '#6D7A72',
          tabBarStyle: { borderTopColor: '#DDE8E1', backgroundColor: '#FFFFFF' },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: 'Accueil', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏠</Text> }}
        />
        <Tabs.Screen
          name="cours"
          options={{ title: 'Cours', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📚</Text> }}
        />
        <Tabs.Screen
          name="examens"
          options={{ title: 'Examens', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📝</Text> }}
        />
        <Tabs.Screen
          name="tuteur"
          options={{ title: 'Kelassi IA', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🤖</Text> }}
        />
        <Tabs.Screen
          name="profil"
          options={{ title: 'Profil', tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text> }}
        />
      </Tabs>
    </>
  )
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#F7D64A',
    paddingVertical: 6,
    alignItems: 'center',
  },
  bannerText: {
    color: '#202624',
    fontSize: 13,
    fontWeight: '600',
  },
})
