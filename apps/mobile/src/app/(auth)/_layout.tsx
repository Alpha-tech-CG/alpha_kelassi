import { Stack } from 'expo-router'

// Layout du groupe (auth) — sans lui, Expo Router n'expose pas "(auth)" comme
// écran de groupe (les routes deviennent "(auth)/login" / "(auth)/verify-otp"),
// ce qui rendait <Stack.Screen name="(auth)" /> invalide dans le layout racine.
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />
}
