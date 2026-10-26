/**
 * Content-Security-Policy à nonce (audit sécurité du 26/10/2026, F6).
 *
 * Seuls les scripts portant le nonce de la requête s'exécutent ; 'strict-dynamic'
 * étend la confiance aux chunks qu'ils chargent. Next.js lit l'en-tête de la
 * requête et pose lui-même le nonce sur ses scripts. 'unsafe-eval' ne reste
 * qu'en développement (rechargement à chaud).
 */
export function buildCsp(nonce: string, dev: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.supabase.co",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://generativelanguage.googleapis.com",
    "worker-src 'self' blob:",    // service worker (public/sw.js) + pdfjs worker
    "frame-src 'none'",
    "frame-ancestors 'none'",   // équivalent moderne de X-Frame-Options: DENY
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; ')
}

/** Nonce aléatoire de 128 bits, en base64. */
export function createNonce(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return btoa(String.fromCharCode(...bytes))
}
