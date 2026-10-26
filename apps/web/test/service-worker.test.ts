import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

// public/sw.js est un script de navigateur : on l'exécute dans un contexte isolé
// pour en lire les fonctions de décision, sans ses écouteurs d'événements.
const sw = runInNewContext(
  `${readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8')}
   ;({ isPublicPage, isStorable, VERSION })`,
  { self: { addEventListener() {}, location: { origin: 'https://exemple.test' } }, URL },
) as { isPublicPage: (p: string) => boolean; isStorable: (r: object) => boolean; VERSION: string }

test('seules les pages publiques sont copiées pour le hors-ligne', () => {
  for (const p of ['/', '/cours', '/cours/matiere/abc', '/cgu', '/confidentialite', '/offline']) {
    assert.equal(sw.isPublicPage(p), true, p)
  }
  for (const p of ['/dashboard', '/tuteur/portefeuille', '/parent', '/admin', '/compte', '/login', '/coursx', '/examens/1']) {
    assert.equal(sw.isPublicPage(p), false, p)
  }
})

test('ni redirection, ni erreur, ni réponse opaque dans le cache', () => {
  assert.equal(sw.isStorable({ ok: true, redirected: false, type: 'basic' }), true)
  assert.equal(sw.isStorable({ ok: true, redirected: true, type: 'basic' }), false)
  assert.equal(sw.isStorable({ ok: false, redirected: false, type: 'basic' }), false)
  assert.equal(sw.isStorable({ ok: false, redirected: false, type: 'opaqueredirect' }), false)
})

test('version v3 : les caches v2 sont purgés à l\'activation', () => {
  assert.equal(sw.VERSION, 'v3')
})
