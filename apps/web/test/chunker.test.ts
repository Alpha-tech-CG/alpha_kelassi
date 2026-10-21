/**
 * Tests du chunking sémantique RAG (indexation des documents).
 * Exécution : `pnpm --filter @alpha-kelassi/web test` (Node ≥ 22.6 lit le TS).
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { chunkText } from '../src/lib/ai/chunker.ts'

describe('chunkText', () => {
  it('ne produit aucun chunk pour un texte vide ou trop court', () => {
    assert.equal(chunkText('').length, 0)
    assert.equal(chunkText('court').length, 0) // résidu < 50 chars ignoré
  })

  it('traite un énoncé d’exercice comme un chunk atomique', () => {
    const chunks = chunkText('Exercice 1\nRésoudre l’équation du second degré.')
    assert.equal(chunks.length, 1)
    assert.equal(chunks[0]?.isExercise, true)
    assert.match(chunks[0]?.content ?? '', /^Exercice 1/)
  })

  it('sépare un paragraphe de contexte de l’exercice qui suit', () => {
    const texte =
      'Voici une introduction suffisamment longue pour être conservée comme contexte.\n\n' +
      'Exercice 2\nCalculer la dérivée de la fonction donnée ci-dessus.'
    const chunks = chunkText(texte)
    assert.equal(chunks.length, 2)
    assert.equal(chunks[0]?.isExercise, false)
    assert.equal(chunks[1]?.isExercise, true)
  })

  it('ne coupe pas à l’intérieur d’un bloc LaTeX contenant une ligne vide', () => {
    const texte =
      'Formule importante : $$\\int_0^1 x\\,dx\n\n= \\frac{1}{2}$$ et voilà, ' +
      'un peu de texte supplémentaire pour dépasser aisément cinquante caractères.'
    const chunks = chunkText(texte)
    assert.equal(chunks.length, 1) // le \n\n dans le $$...$$ n’est pas un séparateur
  })

  it('numérote les chunks séquentiellement et propage la page', () => {
    const texte = Array.from({ length: 6 }, (_, i) =>
      `Exercice ${i + 1}\nÉnoncé numéro ${i + 1} avec assez de texte pour exister.`
    ).join('\n\n')
    const chunks = chunkText(texte, 3)
    assert.deepEqual(
      chunks.map((c) => c.chunkIndex),
      chunks.map((_, i) => i)
    )
    assert.ok(chunks.every((c) => c.pageNumber === 3))
  })
})
