/**
 * Tests du tirage des 15 cartes d'une séance de flashcards de chapitre.
 * Exécution : `pnpm --filter @alpha-kelassi/web test`.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { drawCards, SESSION_SIZE } from '../src/lib/flashcards/deck.ts'

const deck = Array.from({ length: 50 }, (_, i) => ({ id: `c${i}`, front: `Q${i}`, back: `R${i}` }))

describe('drawCards', () => {
  it('tire 15 cartes distinctes du paquet', () => {
    const s = drawCards(deck)
    assert.equal(s.length, SESSION_SIZE)
    assert.equal(new Set(s.map((c) => c.id)).size, SESSION_SIZE)
    for (const c of s) assert.ok(deck.includes(c))
  })
  it('rend tout le paquet, mélangé, quand il a moins de 15 cartes', () => {
    assert.equal(drawCards(deck.slice(0, 9)).length, 9)
    assert.deepEqual(drawCards([]), [])
  })
  it('évite les cartes de la séance précédente quand il en reste assez', () => {
    const first = drawCards(deck)
    const next = drawCards(deck, SESSION_SIZE, new Set(first.map((c) => c.id)))
    assert.ok(next.every((c) => !first.some((f) => f.id === c.id)))
  })
  it('ne modifie pas le paquet et varie d’un tirage à l’autre', () => {
    const copy = deck.map((c) => c.id).join()
    const a = drawCards(deck, 15, new Set(), () => 0).map((c) => c.id).join()
    const b = drawCards(deck, 15, new Set(), () => 0.999).map((c) => c.id).join()
    assert.notEqual(a, b)
    assert.equal(deck.map((c) => c.id).join(), copy)
  })
})
