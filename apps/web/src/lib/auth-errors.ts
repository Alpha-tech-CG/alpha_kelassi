import { WEAK_PASSWORD_MESSAGE } from './password'

/**
 * Traduit les erreurs de Supabase Auth (en anglais) en messages pour l'élève.
 * Les codes (`error.code`) sont prioritaires ; le texte sert de repli pour les
 * versions de GoTrue qui n'en renvoient pas.
 */
export function authErrorMessage(error: { code?: string; message: string }): string {
  const code = error.code ?? ''
  const msg = error.message.toLowerCase()

  if (code === 'email_not_confirmed' || msg.includes('email not confirmed')) {
    return 'Confirme d’abord ton e-mail : clique sur le lien que nous t’avons envoyé (pense aux spams).'
  }
  if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
    return 'E-mail ou mot de passe incorrect.'
  }
  if (code === 'user_already_exists' || msg.includes('already registered')) {
    return 'Un compte existe déjà avec cet e-mail. Connecte-toi.'
  }
  if (code === 'weak_password' || msg.includes('password should')) {
    return WEAK_PASSWORD_MESSAGE
  }
  if (code === 'over_email_send_rate_limit' || msg.includes('rate limit')) {
    return 'Trop d’e-mails envoyés, réessaie dans quelques minutes.'
  }
  if (code === 'email_address_invalid' || msg.includes('invalid format') || msg.includes('is invalid')) {
    return 'Adresse e-mail invalide.'
  }
  if (code === 'signup_disabled') {
    return 'Les inscriptions sont momentanément fermées.'
  }
  return 'Une erreur est survenue, réessaie.'
}
