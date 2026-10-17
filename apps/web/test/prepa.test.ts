/**
 * Tests des rayons « Prépa » (libellés adaptés à la classe + modes imposés).
 * Exécution : `pnpm --filter @alpha-kelassi/web test`.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { isExamKind, isRayon, examName, rayonMeta, RAYONS } from '../src/lib/prepa.ts'

describe('isExamKind / isRayon', () => {
  it('reconnaît les types d’épreuve', () => {
    assert.equal(isExamKind('bac_test'), true)
    assert.equal(isExamKind('td'), false) // td n'est pas une épreuve
    assert.equal(isExamKind('autre'), false)
    assert.equal(isExamKind(42), false)
  })
  it('reconnaît les rayons (épreuves + td)', () => {
    assert.equal(isRayon('td'), true)
    assert.equal(isRayon('bac_rouge'), true)
    assert.equal(isRayon('nope'), false)
  })
  it('RAYONS est dans l’ordre d’affichage attendu', () => {
    assert.deepEqual(RAYONS, ['bac_test', 'bac_blanc', 'bac_rouge', 'ancien_bac', 'td'])
  })
})

describe('examName', () => {
  it('mappe le niveau vers le nom d’examen', () => {
    assert.equal(examName('cepe'), 'CEPE')
    assert.equal(examName('bepc'), 'BEPC')
    assert.equal(examName('bac_d'), 'Bac')
    assert.equal(examName(null), 'Bac')
    assert.equal(examName(undefined), 'Bac')
  })
})

describe('rayonMeta', () => {
  it('adapte le libellé à la classe et impose le mode', () => {
    const blanc = rayonMeta('bac_blanc', 'cepe')
    assert.equal(blanc?.label, 'CEPE blanc')
    assert.equal(blanc?.mode, 'bac_blanc')
    assert.equal(blanc?.plan, 'pro')
  })
  it('ancien bac : mode libre (null), plan starter', () => {
    const ancien = rayonMeta('ancien_bac', 'bepc')
    assert.equal(ancien?.label, 'Anciens BEPC')
    assert.equal(ancien?.mode, null)
    assert.equal(ancien?.plan, 'starter')
  })
  it('td : pas d’examen, pas de mode ni de plan', () => {
    const td = rayonMeta('td', null)
    assert.equal(td?.label, 'TD')
    assert.equal(td?.mode, null)
    assert.equal(td?.plan, null)
  })
})
