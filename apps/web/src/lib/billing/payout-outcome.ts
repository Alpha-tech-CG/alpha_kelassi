/**
 * Issue d'une demande de virement (payout) FeexPay.
 *
 *   • `sent`    : FeexPay a accepté le virement (SUCCESSFUL ou PENDING).
 *   • `refused` : FeexPay a répondu et l'a refusé (FAILED explicite, ou 4xx :
 *                 requête rejetée avant tout mouvement d'argent).
 *   • `unknown` : aucune réponse exploitable (coupure réseau, délai dépassé,
 *                 5xx, corps illisible). Le virement a PEUT-ÊTRE été exécuté :
 *                 il ne faut surtout pas recréditer le portefeuille, sous peine
 *                 de payer deux fois (audit sécurité du 26/10/2026, M2).
 *
 * `httpStatus` vaut null quand la requête n'a obtenu aucune réponse.
 */
export type PayoutOutcome = 'sent' | 'refused' | 'unknown'

export function classifyPayoutResponse(httpStatus: number | null, body: unknown): PayoutOutcome {
  if (httpStatus === null || httpStatus >= 500) return 'unknown'
  if (httpStatus >= 400) return 'refused'

  const status = typeof body === 'object' && body !== null && typeof (body as { status?: unknown }).status === 'string'
    ? ((body as { status: string }).status).toUpperCase()
    : null
  if (status === 'FAILED') return 'refused'
  if (status === 'SUCCESSFUL' || status === 'PENDING') return 'sent'
  // 2xx sans statut lisible : on ne sait pas si l'argent est parti.
  return 'unknown'
}
