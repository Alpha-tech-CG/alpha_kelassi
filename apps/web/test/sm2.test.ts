/**
 * Tests de l'algorithme SM-2 (répétition espacée des flashcards).
 * Exécution : `pnpm --filter @alpha-kelassi/web test` (Node ≥ 22.6 lit le TS).
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { computeSM2 } from '../src/lib/sm2.ts'

const DAY = 86_400_000

describe('computeSM2', () => {
  it('rejette une qualité hors de [0, 5]', () => {
    assert.throws(() => computeSM2({ easeFactor: 2.5, interval: 0, reps: 0 }, -1))
    assert.throws(() => computeSM2({ easeFactor: 2.5, interval: 0, reps: 0 }, 6))
  })

  it('première réussite (reps 0) → intervalle 1 jour, reps 1', () => {
    const r = computeSM2({ easeFactor: 2.5, interval: 0, reps: 0 }, 5)
    assert.equal(r.interval, 1)
    assert.equal(r.reps, 1)
    assert.ok(Math.abs(r.easeFactor - 2.6) < 1e-9) // 2.5 + 0.1 pour q=5
  })

  it('deuxième réussite (reps 1) → intervalle 6 jours', () => {
    const r = computeSM2({ easeFactor: 2.6, interval: 1, reps: 1 }, 5)
    assert.equal(r.interval, 6)
    assert.equal(r.reps, 2)
  })

  it('réussites suivantes → intervalle = round(interval × easeFactor)', () => {
    const r = computeSM2({ easeFactor: 2.5, interval: 10, reps: 3 }, 4)
    assert.equal(r.interval, 25) // round(10 × 2.5)
    assert.equal(r.reps, 4)
    assert.ok(Math.abs(r.easeFactor - 2.5) < 1e-9) // q=4 laisse l'EF inchangé
  })

  it('échec (quality < 3) → intervalle 1, reps 0, EF inchangé', () => {
    const r = computeSM2({ easeFactor: 2.0, interval: 10, reps: 5 }, 1)
    assert.equal(r.interval, 1)
    assert.equal(r.reps, 0)
    assert.ok(Math.abs(r.easeFactor - 2.0) < 1e-9)
  })

  it("plancher de l'easeFactor à 1.3", () => {
    const r = computeSM2({ easeFactor: 1.3, interval: 5, reps: 2 }, 3)
    assert.ok(r.easeFactor >= 1.3)
    assert.ok(Math.abs(r.easeFactor - 1.3) < 1e-9)
  })

  it('nextReview = minuit, à `interval` jours de maintenant', () => {
    const r = computeSM2({ easeFactor: 2.5, interval: 0, reps: 0 }, 5)
    assert.ok(r.nextReview instanceof Date)
    assert.equal(r.nextReview.getHours(), 0)
    const base = new Date()
    base.setHours(0, 0, 0, 0)
    assert.equal(Math.round((r.nextReview.getTime() - base.getTime()) / DAY), r.interval)
  })
})
