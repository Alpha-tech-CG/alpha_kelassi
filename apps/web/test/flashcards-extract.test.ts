/**
 * Tests du générateur de flashcards sans IA (lib/flashcards/extract.ts).
 * Exécution : `pnpm --filter @alpha-kelassi/web test` (Node ≥ 22.6 lit le TS).
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { extractFlashcards } from '../src/lib/flashcards/extract.ts'

describe('extractFlashcards', () => {
  it('transforme les encadrés en cartes', () => {
    const md = [
      '## I. Les vecteurs',
      '',
      '> **📘 Définition — Vecteur**',
      '>',
      '> Un vecteur est défini par une direction, un sens et une longueur.',
      '',
      '> **📐 Relation de Chasles**',
      '>',
      '> $\\vec{AB} + \\vec{BC} = \\vec{AC}$',
      '',
      '> **✏ Exemple**',
      '>',
      '> Un exemple qui ne doit pas devenir une carte.',
    ].join('\n')
    const cards = extractFlashcards(md)
    assert.deepEqual(
      cards.map((c) => c.front),
      ['Définis : Vecteur', 'Quelle est la formule : relation de Chasles ?']
    )
    assert.match(cards[1]!.back, /\\vec\{AC\}/)
  })

  it('reconnaît les phrases de définition avec leur article', () => {
    const md = '### 1.2) Monomère\n\nUn monomère est un composé constitué de molécules simples.\n\n### Digestion\n\nLa digestion est la transformation des aliments.'
    assert.deepEqual(
      extractFlashcards(md).map((c) => c.front),
      ['Qu’est-ce qu’un monomère ?', 'Qu’est-ce que la digestion ?']
    )
  })

  it('lit les listes « **terme** : explication » et les tableaux terme | définition', () => {
    const md = [
      '### Les organes',
      '- **Estomac** : digère les aliments grâce aux sucs gastriques',
      '',
      '| Couche | Définition |',
      '|---|---|',
      '| La terre arable | Couche superficielle travaillée |',
      '| Le sous-sol | Couche profonde |',
    ].join('\n')
    const cards = extractFlashcards(md)
    assert.deepEqual(cards.map((c) => c.front), ['Définis : Estomac', 'Définis : La terre arable', 'Définis : Le sous-sol'])
    assert.equal(cards[0]!.back, 'Digère les aliments grâce aux sucs gastriques')
  })

  it('ignore les parties exercices et respecte le nombre demandé', () => {
    const md = '## Exercices\n\nUne fonction est une relation qui associe un réel à chaque réel.\n\n## Cours\n\n' +
      Array.from({ length: 15 }, (_, i) => `### Partie ${i}\n\nCeci est le paragraphe essentiel de la partie numéro ${i}.`).join('\n\n')
    const cards = extractFlashcards(md, 5)
    assert.equal(cards.length, 5)
    assert.ok(cards.every((c) => !/fonction/.test(c.front)))
  })

  it('ne coupe jamais une réponse au milieu d’une formule', () => {
    const long = `La loi s'écrit $${'x+'.repeat(150)}y$ et elle est importante. ` + 'Suite du texte. '.repeat(30)
    const [card] = extractFlashcards(`### Loi\n\n${long}`)
    const dollars = (card!.back.match(/\$/g) ?? []).length
    assert.equal(dollars % 2, 0)
  })

  it('renvoie une liste vide pour un texte sans contenu', () => {
    assert.deepEqual(extractFlashcards(''), [])
  })
})
