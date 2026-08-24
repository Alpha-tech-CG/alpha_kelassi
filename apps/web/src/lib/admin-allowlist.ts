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

/**
 * La double authentification est-elle exigée pour ouvrir le back office ?
 *
 * Désactivée par défaut, sur décision explicite : l'accès reste protégé par la
 * liste blanche d'adresses ET le rôle `admin` en base. Le compromis assumé est
 * qu'un mot de passe administrateur volé suffirait alors à entrer — la page
 * /compte/securite reste disponible pour activer le TOTP quand souhaité.
 *
 * Pour re-verrouiller : `ADMIN_REQUIRE_MFA=true` dans les variables
 * d'environnement, sans modification de code.
 */
export function adminMfaRequired(): boolean {
  return process.env['ADMIN_REQUIRE_MFA'] === 'true'
}
