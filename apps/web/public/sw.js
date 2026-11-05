// Service Worker — Cognix (v3, restreint)
//
// Hors connexion, seul le contenu PUBLIC reste consultable : une page d'un
// compte connecté (tableau de bord, portefeuille, suivi parent…) n'est jamais
// copiée, pour qu'un appareil partagé ne la montre pas au suivant. La
// déconnexion vide aussi ces caches (src/lib/offline-cache.ts).
//
// Marche arrière : copier public/sw-off.js sur public/sw.js puis déployer —
// le service worker se désinstalle et vide ses caches chez chaque élève.
const VERSION = 'v3'
const CACHE_STATIC = `kelassi-static-${VERSION}`
const CACHE_PAGES  = `kelassi-pages-${VERSION}`
const CACHE_IMAGES = `kelassi-images-${VERSION}`

const ALL_CACHES = [CACHE_STATIC, CACHE_PAGES, CACHE_IMAGES]

// Plafonds : les entrées les plus anciennes sont retirées au-delà.
const MAX_STATIC = 300
const MAX_PAGES  = 60
const MAX_IMAGES = 150

const OFFLINE_URL = '/offline'

// Pages publiques gardées pour la lecture hors connexion.
const PUBLIC_PAGES = ['/', '/cgu', '/confidentialite', OFFLINE_URL]
const PUBLIC_PREFIXES = ['/cours']

function isPublicPage(pathname) {
  return PUBLIC_PAGES.includes(pathname)
    || PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

/** Une réponse ne se garde que si elle est complète, directe et non personnelle. */
function isStorable(response) {
  return response.ok && !response.redirected && response.type === 'basic'
}

// ─── INSTALL ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_PAGES)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting())
  )
})

// ─── ACTIVATE ───────────────────────────────────────────────────────────────
// Supprime les caches des versions précédentes (v2 et avant).
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !ALL_CACHES.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

// ─── FETCH ──────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignore les non-GET et les requêtes cross-origin (Supabase, API externes)
  if (request.method !== 'GET') return
  if (url.origin !== self.location.origin) return

  // 1. Assets Next.js immutables (nom haché) → cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(CACHE_STATIC, MAX_STATIC, request))
    return
  }

  // 2. Images → cache puis rafraîchissement en arrière-plan
  if (url.pathname.startsWith('/_next/image') || /\.(png|jpg|jpeg|webp|svg|gif|ico)$/i.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(CACHE_IMAGES, MAX_IMAGES, request, event))
    return
  }

  // 3. Navigation → réseau d'abord ; copie seulement des pages publiques
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, isPublicPage(url.pathname)))
    return
  }

  // 4. Tout le reste (API, données RSC…) → réseau seul
})

// ─── HELPERS ────────────────────────────────────────────────────────────────

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  // cache.keys() suit l'ordre d'insertion : les premières sont les plus anciennes.
  await Promise.all(keys.slice(0, Math.max(0, keys.length - max)).map((k) => cache.delete(k)))
}

async function store(cacheName, max, request, response) {
  if (!isStorable(response)) return
  const cache = await caches.open(cacheName)
  await cache.put(request, response)
  await trim(cacheName, max)
}

async function cacheFirst(cacheName, max, request) {
  const cached = await caches.match(request, { cacheName })
  if (cached) return cached
  const response = await fetch(request)
  store(cacheName, max, request, response.clone())
  return response
}

async function staleWhileRevalidate(cacheName, max, request, event) {
  const cached = await caches.match(request, { cacheName })
  const network = fetch(request).then((response) => {
    store(cacheName, max, request, response.clone())
    return response
  })
  if (cached) {
    event.waitUntil(network.catch(() => {}))
    return cached
  }
  return network
}

async function networkFirst(request, keepCopy) {
  try {
    const response = await fetch(request)
    if (keepCopy) store(CACHE_PAGES, MAX_PAGES, request, response.clone())
    return response
  } catch {
    const cached = keepCopy ? await caches.match(request, { cacheName: CACHE_PAGES }) : undefined
    if (cached) return cached
    const offline = await caches.match(OFFLINE_URL, { cacheName: CACHE_PAGES })
    return offline ?? new Response('Hors-ligne', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }
}
