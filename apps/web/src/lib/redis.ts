import { Redis } from '@upstash/redis'

// Nettoie une valeur d'env qui pourrait avoir des guillemets parasites
// ex: '"https://foo.upstash.io"' → 'https://foo.upstash.io'
function cleanEnv(v: string | undefined): string {
  return (v ?? '').replace(/^["']|["']$/g, '').trim()
}

const redisUrl   = cleanEnv(process.env['UPSTASH_REDIS_REST_URL'])
const redisToken = cleanEnv(process.env['UPSTASH_REDIS_REST_TOKEN'])

const isConfigured =
  redisUrl.startsWith('https://') &&
  redisToken.length > 0

// Singleton lazy — créé une seule fois au premier appel
let _redis: Redis | null = null

function getRedis(): Redis {
  if (_redis) return _redis

  if (!isConfigured) {
    // Mock no-op utilisé en dev / si Redis n'est pas configuré
    _redis = {
      get:    async (_k: string)                            => null,
      set:    async (_k: string, _v: unknown, _o?: unknown) => 'OK',
      del:    async (..._k: string[])                       => 0,
      incr:   async (_k: string)                            => 1,
      decr:   async (_k: string)                            => 0,
      expire: async (_k: string, _s: number)                => 1,
    } as unknown as Redis
    return _redis
  }

  _redis = new Redis({ url: redisUrl, token: redisToken })
  return _redis
}

// Valeurs de repli sûres si une commande Redis échoue (ex: quota Upstash
// dépassé, réseau) — pour ne JAMAIS casser l'appelant (quota IA, cache…).
function failOpen(prop: string): unknown {
  if (prop === 'incr')   return 1  // 1re requête → reste sous le quota
  if (prop === 'decr')   return 0
  if (prop === 'expire') return 1
  if (prop === 'del')    return 0
  return null                       // get (pas de cache), set, etc.
}

// Export proxy — se comporte comme un client Redis normal mais :
//  - n'instancie pas Redis au chargement du module (safe au build time)
//  - « fail-open » : si une commande échoue, on renvoie une valeur sûre au
//    lieu de propager l'erreur (Upstash indisponible ne casse pas l'IA).
export const redis = new Proxy({} as Redis, {
  get(_target, prop) {
    return async (...args: unknown[]) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return await (getRedis() as any)[String(prop)](...args)
      } catch (e) {
        console.error(`[redis] ${String(prop)} a échoué (fail-open):`, (e as Error)?.message)
        return failOpen(String(prop))
      }
    }
  },
})
