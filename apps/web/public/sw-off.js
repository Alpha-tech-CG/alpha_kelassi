// Service Worker de retrait — marche arrière du service worker Cognix.
//
// En cas de problème : copier ce fichier sur public/sw.js puis déployer. À la
// prochaine visite, chaque navigateur installe cette version, qui vide tous
// les caches et se désinstalle. Rien d'autre à faire côté élèves.
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys.map((k) => caches.delete(k)))
    await self.registration.unregister()
  })())
})
