import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildCsp, createNonce } from '../src/lib/csp.ts'

test('production : nonce, strict-dynamic, ni unsafe-inline ni unsafe-eval pour les scripts', () => {
  const csp = buildCsp('abc123', false)
  const scriptSrc = csp.split('; ').find((d) => d.startsWith('script-src'))!
  assert.equal(scriptSrc, "script-src 'self' 'nonce-abc123' 'strict-dynamic'")
  assert.match(csp, /frame-ancestors 'none'/)
  assert.match(csp, /object-src 'none'/)
})

test('développement : unsafe-eval autorisé pour le rechargement à chaud', () => {
  assert.match(buildCsp('n', true), /script-src [^;]*'unsafe-eval'/)
})

test('nonces aléatoires de 128 bits', () => {
  const a = createNonce()
  assert.equal(Buffer.from(a, 'base64').length, 16)
  assert.notEqual(a, createNonce())
})
