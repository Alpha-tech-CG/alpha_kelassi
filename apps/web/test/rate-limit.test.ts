/**
 * Tests du décompte des limites de débit (audit sécurité du 26/10/2026, M3).
 * Exécution : `pnpm --filter @alpha-kelassi/web test` (Node ≥ 22.6 lit le TS).
 *
 * L'enjeu : en mode strict, une panne ou une absence de Redis doit REFUSER la
 * requête au lieu de laisser passer toutes les tentatives.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { checkLimit, type Counter } from '../src/lib/rate-limit-core.ts'

function memoryCounter(): Counter & { ttl: Map<string, number> } {
  const counts = new Map<string, number>()
  const ttl = new Map<string, number>()
  return {
    ttl,
    async incr(k) { const n = (counts.get(k) ?? 0) + 1; counts.set(k, n); return n },
    async expire(k, s) { ttl.set(k, s); return 1 },
  }
}

const broken: Counter = {
  async incr() { throw new Error('quota Upstash dépassé') },
  async expire() { throw new Error('quota Upstash dépassé') },
}

describe('checkLimit', () => {
  it('laisse passer jusqu’à la limite, refuse au-delà', async () => {
    const c = memoryCounter()
    for (let i = 1; i <= 5; i++) assert.equal(await checkLimit(c, 'login:x', 5, 900, true), true)
    assert.equal(await checkLimit(c, 'login:x', 5, 900, true), false)
  })

  it('pose l’expiration à la première requête de la fenêtre', async () => {
    const c = memoryCounter()
    await checkLimit(c, 'otp:y', 5, 900, true)
    assert.equal(c.ttl.get('rl:otp:y'), 900)
  })

  it('les clés sont indépendantes', async () => {
    const c = memoryCounter()
    await checkLimit(c, 'a', 1, 60, true)
    assert.equal(await checkLimit(c, 'a', 1, 60, true), false)
    assert.equal(await checkLimit(c, 'b', 1, 60, true), true)
  })

  it('Redis absent : refus en mode strict, passage sinon', async () => {
    assert.equal(await checkLimit(null, 'k', 5, 60, true), false)
    assert.equal(await checkLimit(null, 'k', 5, 60, false), true)
  })

  it('Redis en erreur : refus en mode strict, passage sinon', async () => {
    assert.equal(await checkLimit(broken, 'k', 5, 60, true), false)
    assert.equal(await checkLimit(broken, 'k', 5, 60, false), true)
  })
})
