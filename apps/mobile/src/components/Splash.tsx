import { View, Image, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { colors } from '../lib/theme'

/** Écran de démarrage Cognix — logo sur fond navy (visible ~3s à l'ouverture). */
export function Splash() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image source={require('../../assets/cognix-logo.png')} style={styles.logo} resizeMode="contain" />
      <View style={styles.dots}>
        <View style={[styles.dot, { opacity: 1 }]} />
        <View style={[styles.dot, { opacity: 0.6 }]} />
        <View style={[styles.dot, { opacity: 0.3 }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  logo: { width: '88%', height: '72%' },
  dots: { position: 'absolute', bottom: 64, flexDirection: 'row', gap: 7 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
})
