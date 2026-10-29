import { useState } from 'react'
import { View, Text, Pressable, StyleSheet, Image } from 'react-native'
import { colors, fonts, radius } from '../lib/theme'

/**
 * Écran de verrouillage plein cadre affiché par-dessus l'app quand un
 * déverrouillage est requis (retour au premier plan après > 5 min en
 * arrière-plan). Tente la biométrie via expo-local-authentication ; si le
 * matériel est absent ou qu'aucune biométrie n'est enrôlée, dégrade
 * proprement avec un bouton "Continuer" plutôt que de bloquer l'utilisateur.
 *
 * Import de expo-local-authentication fait de façon paresseuse/défensive :
 * si le module natif n'est pas disponible (ex. Expo Go sans le bon build),
 * on considère qu'il n'y a pas de biométrie et on propose direct "Continuer".
 */
export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [noBiometrics, setNoBiometrics] = useState(false)

  async function handleUnlock() {
    setError(null)
    setChecking(true)
    try {
      const LocalAuthentication = await import('expo-local-authentication')

      const hasHardware = await LocalAuthentication.hasHardwareAsync().catch(() => false)
      const isEnrolled = hasHardware
        ? await LocalAuthentication.isEnrolledAsync().catch(() => false)
        : false

      if (!hasHardware || !isEnrolled) {
        setNoBiometrics(true)
        setChecking(false)
        return
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Déverrouille Cognix',
        cancelLabel: 'Annuler',
        disableDeviceFallback: false,
      })

      if (result.success) {
        onUnlock()
      } else {
        setError('Authentification annulée ou échouée. Réessaie.')
      }
    } catch {
      // Module natif indisponible ou erreur inattendue : on ne bloque pas
      // l'utilisateur, on lui propose de continuer sans biométrie.
      setNoBiometrics(true)
    } finally {
      setChecking(false)
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/cognix-logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Application verrouillée</Text>
      <Text style={styles.subtitle}>
        Pour protéger ton compte (paiements, espace tuteur), déverrouille pour continuer.
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {noBiometrics ? (
        <>
          <Text style={styles.info}>
            Aucune biométrie configurée sur cet appareil. Tu peux continuer sans vérification
            supplémentaire — pense à activer une empreinte/Face ID dans les réglages du téléphone
            pour plus de sécurité.
          </Text>
          <Pressable style={styles.button} onPress={onUnlock}>
            <Text style={styles.buttonText}>Continuer</Text>
          </Pressable>
        </>
      ) : (
        <Pressable style={styles.button} onPress={handleUnlock} disabled={checking}>
          <Text style={styles.buttonText}>{checking ? 'Vérification…' : 'Déverrouiller'}</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logo: { width: 120, height: 120, marginBottom: 24 },
  title: { fontFamily: fonts.heading, fontSize: 20, color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: '#C3D2E8', textAlign: 'center', marginBottom: 24 },
  info: { fontFamily: fonts.regular, fontSize: 13, color: '#C3D2E8', textAlign: 'center', marginBottom: 20 },
  error: { fontFamily: fonts.regular, fontSize: 13, color: colors.red, textAlign: 'center', marginBottom: 12 },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: radius.lg,
    minWidth: 220,
    alignItems: 'center',
  },
  buttonText: { fontFamily: fonts.body, fontSize: 16, color: colors.onPrimary },
})
