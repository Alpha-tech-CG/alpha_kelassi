import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { supabase } from './supabase'

// Décodage base64 → Uint8Array sans dépendance externe (Supabase Storage RN
// accepte un ArrayBuffer/Uint8Array ; le passage par base64 évite les soucis
// de Blob sous React Native).
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
function base64ToBytes(b64: string): Uint8Array {
  const clean = b64.replace(/=+$/, '')
  const out = new Uint8Array((clean.length * 3) >> 2)
  let bits = 0, acc = 0, p = 0
  for (let i = 0; i < clean.length; i++) {
    const v = B64.indexOf(clean[i]!)
    if (v < 0) continue
    acc = (acc << 6) | v; bits += 6
    if (bits >= 8) { bits -= 8; out[p++] = (acc >> bits) & 0xff }
  }
  return out
}

export type UploadResult = { path: string; uri: string }

/** Ouvre la galerie ou l'appareil photo et téléverse l'image dans un bucket privé. */
export async function pickAndUpload(
  bucket: string,
  source: 'camera' | 'library',
): Promise<UploadResult | null> {
  // 1) Permissions + sélection
  const picker = source === 'camera'
    ? { req: ImagePicker.requestCameraPermissionsAsync, launch: ImagePicker.launchCameraAsync }
    : { req: ImagePicker.requestMediaLibraryPermissionsAsync, launch: ImagePicker.launchImageLibraryAsync }

  const perm = await picker.req()
  if (!perm.granted) throw new Error('Autorisation refusée. Active l’accès dans les réglages.')

  const res = await picker.launch({ mediaTypes: ['images'], quality: 0.6, allowsEditing: false })
  if (res.canceled || !res.assets?.[0]) return null
  const asset = res.assets[0]

  // 2) Utilisateur courant (le chemin doit commencer par son UID — validé par l'API)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Session expirée.')

  // 3) Lecture base64 → octets
  const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 })
  const bytes = base64ToBytes(base64)

  // 4) Téléversement
  const ext = (asset.mimeType?.includes('png') || asset.uri.toLowerCase().endsWith('.png')) ? 'png' : 'jpg'
  const contentType = ext === 'png' ? 'image/png' : 'image/jpeg'
  const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, bytes, { contentType, upsert: false })
  if (error) throw new Error(error.message)

  return { path, uri: asset.uri }
}
