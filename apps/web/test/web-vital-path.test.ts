import { test } from 'node:test'
import assert from 'node:assert/strict'
import { webVitalPath } from '../src/lib/web-vital-path.ts'

test('les identifiants sont regroupés pour comparer les pages d\'un même type', () => {
  assert.equal(
    webVitalPath('/cours/matiere/5dd263a4-1d0e-4e6b-be02-aa74902bc941/AC68ACDB-9b5e-4015-bb63-bd16a9a03e3d'),
    '/cours/matiere/:id/:id',
  )
  assert.equal(webVitalPath('/examens/42/resultat'), '/examens/:id/resultat')
  assert.equal(webVitalPath('/dashboard/'), '/dashboard')
  assert.equal(webVitalPath('/'), '/')
})

test('console admin et API ne sont pas mesurées', () => {
  assert.equal(webVitalPath('/admin/suivi'), null)
  assert.equal(webVitalPath('/api/ai/chat'), null)
})

test('chemin borné à 120 caractères', () => {
  assert.equal(webVitalPath(`/${'a'.repeat(300)}`)!.length, 120)
})
