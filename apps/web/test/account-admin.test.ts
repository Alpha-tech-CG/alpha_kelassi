import { test } from 'node:test'
import assert from 'node:assert/strict'
import { accountState, banRefusal, generateTempPassword, isSignupIncomplete } from '../src/lib/account-admin.ts'
import { isPasswordValid } from '../src/lib/password.ts'

test('mot de passe provisoire conforme aux règles de Supabase Auth, sans caractère ambigu', () => {
  const seen = new Set<string>()
  for (let i = 0; i < 300; i++) {
    const p = generateTempPassword()
    assert.equal(p.length, 10)
    assert.ok(isPasswordValid(p), p)
    assert.match(p, /[@#!+-]/, p)   // symbole exigé par Supabase Auth
    assert.doesNotMatch(p, /[0O1lI]/, p)
    seen.add(p)
  }
  assert.equal(seen.size, 300)   // pas de répétition
})

test('on ne bannit ni soi-même ni un administrateur', () => {
  assert.match(banRefusal({ id: 'a', role: 'admin' }, 'a')!, /propre compte/)
  assert.match(banRefusal({ id: 'b', role: 'admin' }, 'a')!, /administrateur/)
  assert.equal(banRefusal({ id: 'b', role: 'student' }, 'a'), null)
  assert.equal(banRefusal({ id: 'b', role: null }, 'a'), null)
})

test('état du compte lu dans Supabase Auth', () => {
  const now = new Date('2026-10-26T12:00:00Z')
  assert.deepEqual(accountState(undefined, now), { banned: false, banned_until: null, email_confirmed: false, last_sign_in_at: null })
  const banned = accountState({ banned_until: '2126-01-01T00:00:00Z', email_confirmed_at: '2026-10-01T00:00:00Z' }, now)
  assert.equal(banned.banned, true)
  assert.equal(banned.email_confirmed, true)
  // Un bannissement échu ne compte plus.
  assert.equal(accountState({ banned_until: '2026-10-01T00:00:00Z' }, now).banned, false)
})

test('inscription inachevée : e-mail non confirmé ou parcours non choisi', () => {
  const ok = accountState({ email_confirmed_at: '2026-10-01T00:00:00Z' })
  assert.equal(isSignupIncomplete(ok, true), false)
  assert.equal(isSignupIncomplete(ok, false), true)
  assert.equal(isSignupIncomplete(accountState({}), true), true)
})
