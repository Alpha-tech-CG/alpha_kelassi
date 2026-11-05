/**
 * Tests des rayons « Prépa » (libellés adaptés à la classe + modes imposés).
 * Exécution : `pnpm --filter @alpha-kelassi/web test`.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { isExamKind, isRayon, examName, rayonMeta, RAYONS, pickSimulationPaper, parseBareme, originLabel } from '../src/lib/prepa.ts'

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

describe('sujets rédigés', () => {
  const papers = [
    { id: 'r1', origin: 'reel' as const },
    { id: 'r2', origin: 'reel' as const },
    { id: 'g1', origin: 'genere' as const },
  ]
  const first = () => 0

  it('commence par un sujet réel', () => {
    assert.equal(pickSimulationPaper(papers, [], first), 'r1')
  })
  it('alterne : après un sujet réel, un sujet généré', () => {
    assert.equal(pickSimulationPaper(papers, [{ exercise_id: 'r1', created_at: '2026-10-26T10:00:00Z' }], first), 'g1')
  })
  it('après un sujet généré, le sujet réel le moins fait', () => {
    const res = [
      { exercise_id: 'r1', created_at: '2026-10-25T10:00:00Z' },
      { exercise_id: 'g1', created_at: '2026-10-26T10:00:00Z' },
    ]
    assert.equal(pickSimulationPaper(papers, res, first), 'r2')
  })
  it("prend l'autre origine quand la voulue manque, et rien sans sujet", () => {
    assert.equal(pickSimulationPaper([{ id: 'r1', origin: 'reel' }], [{ exercise_id: 'r1', created_at: '2026-10-26T10:00:00Z' }], first), 'r1')
    assert.equal(pickSimulationPaper([], [], first), null)
  })
  it('ignore les lignes de barème invalides', () => {
    assert.deepEqual(parseBareme([{ label: 'Ex. 1', points: 4 }, { label: 'x' }, null, { label: 'Ex. 2', points: 0 }]), [{ label: 'Ex. 1', points: 4 }])
    assert.deepEqual(parseBareme(null), [])
  })
  it('libelle l’origine', () => {
    assert.equal(originLabel({ origin: 'reel', exam_year: 2019 }), 'Sujet officiel 2019')
    assert.equal(originLabel({ origin: 'genere', exam_year: null }), 'Sujet Cognix (inédit)')
  })
})
