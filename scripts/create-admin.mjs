/**
 * Crée (ou promeut en admin) un compte utilisateur Supabase.
 * Usage : node scripts/create-admin.mjs <email> [password]
 * Si password est omis, un mot de passe aléatoire fort est généré et affiché.
 * Lit SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY depuis apps/api/.env.local.
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { randomBytes } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))

const [, , emailArg, passwordArg] = process.argv
if (!emailArg) {
  console.error('Usage : node scripts/create-admin.mjs <email> [password]')
  process.exit(1)
}

const env = Object.fromEntries(
  readFileSync(join(__dirname, '..', 'apps', 'api', '.env.local'), 'utf-8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] })
)

const SUPABASE_URL = env.SUPABASE_URL
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_ROLE_KEY || SUPABASE_URL.includes('xxxx')) {
  console.error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants ou non configurés dans apps/api/.env.local')
  process.exit(1)
}

const EMAIL = emailArg
const PASSWORD = passwordArg || randomBytes(12).toString('base64url')

async function adminFetch(path, init) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      ...(init?.headers ?? {}),
    },
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message || json.msg || `HTTP ${res.status}`)
  return json
}

async function main() {
  // 1. Cherche un compte Auth existant avec cet email
  const { users } = await adminFetch(`/auth/v1/admin/users?page=1&per_page=1&email=${encodeURIComponent(EMAIL)}`)
  let userId = users?.[0]?.id
  let created = false

  if (userId) {
    console.log(`✓ Compte Auth existant trouvé : ${userId}`)
  } else {
    const user = await adminFetch('/auth/v1/admin/users', {
      method: 'POST',
      body: JSON.stringify({ email: EMAIL, password: PASSWORD, email_confirm: true }),
    })
    userId = user.id
    created = true
    console.log(`✓ Compte Auth créé : ${userId}`)
  }

  // 2. Upsert le profil public.users avec role='admin'
  await adminFetch('/rest/v1/users', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({ id: userId, email: EMAIL, role: 'admin', plan: 'premium' }),
  })
  console.log(`✓ Rôle admin défini dans public.users pour ${EMAIL}`)

  console.log(`\nEmail    : ${EMAIL}`)
  if (created) {
    console.log(`Password : ${PASSWORD}`)
    console.log(`\n⚠  Ce mot de passe ne sera plus jamais affiché — note-le maintenant.`)
  } else {
    console.log(`Password : (compte existant, mot de passe inchangé)`)
  }
  process.exit(0)
}

main().catch((e) => { console.error('✗', e.message); process.exit(1) })
