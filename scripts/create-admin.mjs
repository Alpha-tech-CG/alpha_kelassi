/**
 * Script one-shot : crée le compte admin et le profil Firestore
 * Usage : node scripts/create-admin.mjs
 */
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Charge les vars depuis apps/web/.env.local
const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'web', '.env.local'), 'utf-8')
    .split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const app = getApps().length === 0
  ? initializeApp({
      credential: cert({
        projectId:   env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey:  (env.FIREBASE_PRIVATE_KEY || '').replace(/^"|"$/g, '').replace(/\\n/g, '\n'),
      }),
    })
  : getApps()[0]

const adminAuth = getAuth(app)
const adminDb   = getFirestore(app)

const EMAIL    = 'fresneilm139@gmail.com'
const PASSWORD = 'Admin@Kelassi2025!'
const NAME     = 'Admin Kelassi'

async function main() {
  let uid

  try {
    const existing = await adminAuth.getUserByEmail(EMAIL)
    uid = existing.uid
    console.log(`✓ Compte existant trouvé : ${uid}`)
  } catch {
    const user = await adminAuth.createUser({ email: EMAIL, password: PASSWORD, displayName: NAME })
    uid = user.uid
    console.log(`✓ Compte créé : ${uid}`)
  }

  await adminDb.collection('users').doc(uid).set({
    uid,
    email: EMAIL,
    full_name: NAME,
    role: 'admin',
    level: 'bac_c',
    created_at: new Date(),
  }, { merge: true })

  console.log(`✓ Rôle admin défini dans Firestore pour ${EMAIL}`)
  console.log(`\nEmail    : ${EMAIL}`)
  console.log(`Password : ${PASSWORD}`)
  console.log(`\n⚠  Change le mot de passe après ta première connexion !`)
  process.exit(0)
}

main().catch(e => { console.error('✗', e.message); process.exit(1) })
