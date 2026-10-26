/**
 * Tests de la redirection après connexion (audit sécurité du 26/10/2026, F1).
 * Exécution : `pnpm --filter @alpha-kelassi/web test` (Node ≥ 22.6 lit le TS).
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { safeNextPath } from '../src/lib/safe-redirect.ts'

const origin = 'https://alpha-kelassi-web.vercel.app'

describe('safeNextPath', () => {
  it('garde un chemin interne, avec sa requête', () => {
    assert.equal(safeNextPath('/cours/123?tab=quiz', origin), '/cours/123?tab=quiz')
    assert.equal(safeNextPath('/update-password', origin), '/update-password')
  })

  it('refuse tout ce qui mènerait vers un autre hôte', () => {
    for (const next of ['@evil.com', '.evil.com', '//evil.com', '/\\evil.com', '/\t/evil.com',
      'https://evil.com', 'javascript:alert(1)', '']) {
      const path = safeNextPath(next, origin)
      assert.equal(path, '/dashboard', `next=${JSON.stringify(next)}`)
      assert.equal(new URL(`${origin}${path}`).origin, origin)
    }
  })

  it('utilise la page de repli demandée', () => {
    assert.equal(safeNextPath(null, origin, '/update-password'), '/update-password')
  })
})
