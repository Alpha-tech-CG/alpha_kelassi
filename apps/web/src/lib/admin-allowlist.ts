/**
 * Liste blanche des comptes autorisés à ouvrir la console d'administration.
 *
 * C'est un second verrou, en plus du rôle `admin` stocké en base : les deux
 * doivent passer. Le rôle seul ne suffit donc pas — si un compte se retrouvait
 * promu par erreur (ou par une faille de la table `users`), il resterait
 * bloqué à la porte du back office.
 *
 * Surchargeable par la variable d'environnement `ADMIN_EMAILS` (adresses
 * séparées par des virgules) pour ajouter un administrateur sans redéployer.
 */

const DEFAULT_ADMIN_EMAILS = ['fresneilm139@gmail.com']

function allowlist(): string[] {
  const fromEnv = process.env['ADMIN_EMAILS']
  const list = fromEnv
    ? fromEnv.split(',').map((e) => e.trim()).filter(Boolean)
    : DEFAULT_ADMIN_EMAILS
  return list.map((e) => e.toLowerCase())
}

/** Ce compte figure-t-il parmi les administrateurs autorisés ? */
export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return allowlist().includes(email.toLowerCase())
}
