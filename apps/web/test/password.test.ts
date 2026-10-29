import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { PASSWORD_SYMBOLS, isPasswordValid } from '../src/lib/password.ts'
import { generateTempPassword } from '../src/lib/account-admin.ts'

test('un symbole est exigé, comme par Supabase Auth', () => {
  assert.equal(isPasswordValid('Cognix2026'), false)    // règles affichées avant le 27/10 : refusé par Supabase
  assert.equal(isPasswordValid('Cognix2026!'), true)
  assert.equal(isPasswordValid('Cg!2'), false)          // trop court
  assert.equal(isPasswordValid('cognix2026!'), false)   // pas de majuscule
})

test('chaque symbole accepté par Supabase Auth compte', () => {
  // Liste du réglage « Password requirements » de Supabase Auth.
  const supabase = '!@#$%^&*()_+-=[]{};\'\\:"|<>?,./`~'
  assert.equal(PASSWORD_SYMBOLS, supabase)
  for (const c of supabase) assert.ok(isPasswordValid(`Cognix26${c}`), c)
})

test('ni un accent ni une espace ne remplacent un symbole', () => {
  assert.equal(isPasswordValid('Cognix2026é'), false)
  assert.equal(isPasswordValid('Cognix 2026'), false)
})

test('les mots de passe provisoires de la console respectent les règles', () => {
  for (let i = 0; i < 200; i++) assert.ok(isPasswordValid(generateTempPassword()))
})

test('mêmes règles sur le site et dans l’app', () => {
  const strip = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8').replace(/^ \* Même liste côté.*$/m, '')
  assert.equal(strip('../src/lib/password.ts'), strip('../../mobile/src/lib/password.ts'))
})
