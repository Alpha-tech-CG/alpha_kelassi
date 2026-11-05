/**
 * Tests du classement des réponses de virement FeexPay (retrait tuteur).
 * Exécution : `pnpm --filter @alpha-kelassi/web test` (Node ≥ 22.6 lit le TS).
 *
 * L'enjeu : ne recréditer le portefeuille que sur un refus CERTAIN. Une issue
 * inconnue (le virement est peut-être parti) doit rester « en attente ».
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { classifyPayoutResponse } from '../src/lib/billing/payout-outcome.ts'

describe('classifyPayoutResponse', () => {
  it('sans réponse (coupure réseau, délai dépassé) → inconnu', () => {
    assert.equal(classifyPayoutResponse(null, null), 'unknown')
  })

  it('erreur serveur FeexPay → inconnu, jamais refusé', () => {
    assert.equal(classifyPayoutResponse(500, { status: 'FAILED' }), 'unknown')
    assert.equal(classifyPayoutResponse(504, {}), 'unknown')
  })

  it('2xx sans statut lisible → inconnu', () => {
    assert.equal(classifyPayoutResponse(200, {}), 'unknown')
    assert.equal(classifyPayoutResponse(200, null), 'unknown')
    assert.equal(classifyPayoutResponse(200, { status: 42 }), 'unknown')
  })

  it('FAILED explicite ou requête rejetée (4xx) → refusé', () => {
    assert.equal(classifyPayoutResponse(200, { status: 'FAILED' }), 'refused')
    assert.equal(classifyPayoutResponse(200, { status: 'failed' }), 'refused')
    assert.equal(classifyPayoutResponse(400, {}), 'refused')
    assert.equal(classifyPayoutResponse(401, null), 'refused')
  })

  it('SUCCESSFUL ou PENDING → envoyé', () => {
    assert.equal(classifyPayoutResponse(200, { status: 'SUCCESSFUL' }), 'sent')
    assert.equal(classifyPayoutResponse(201, { status: 'PENDING' }), 'sent')
  })
})
