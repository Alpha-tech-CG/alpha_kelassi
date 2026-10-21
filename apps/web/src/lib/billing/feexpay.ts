import { mapProviderStatus, type PaymentStatus } from '@alpha-kelassi/types'

/**
 * Client FeexPay (Mobile Money). Reprend les deux appels de l'intégration
 * existante : demande de paiement « push » et lecture du statut d'une
 * transaction. FeexPay ne signe pas ses notifications : le statut fait foi
 * UNIQUEMENT lorsqu'il est relu ici, de serveur à serveur.
 */

const API = 'https://api.feexpay.me/api'

export function feexpayConfig() {
  const token = process.env['FEEXPAY_TOKEN']
  const shop = process.env['FEEXPAY_SHOP']
  const callbackUrl = process.env['FEEXPAY_CALLBACK_URL']
  return token && shop ? { token, shop, callbackUrl: callbackUrl ?? '' } : null
}

export interface PayRequest {
  amount: number
  phoneLocalDigits: string
  network: string
  reference: string
  description: string
  email: string
  firstName: string
}

export async function requestToPay(req: PayRequest): Promise<{ ok: boolean; status: string | null; providerReference: string | null; message: string | null }> {
  const cfg = feexpayConfig()
  if (!cfg) return { ok: false, status: null, providerReference: null, message: 'FEEXPAY_NOT_CONFIGURED' }

  try {
    const res = await fetch(`${API}/transactions/requesttopay/integration`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: `242${req.phoneLocalDigits}`,
        amount: req.amount,
        reseau: req.network,
        token: cfg.token,
        shop: cfg.shop,
        first_name: req.firstName,
        email: req.email,
        reference: req.reference,
        callback_info: req.reference,
        callback_url: cfg.callbackUrl,
        description: req.description,
      }),
      signal: AbortSignal.timeout(25_000),
    })
    const data = (await res.json().catch(() => ({}))) as { status?: string; message?: string; reference?: string }
    const failed = !res.ok || (data.status ?? '').toUpperCase() === 'FAILED'
    return {
      ok: !failed,
      status: data.status ?? null,
      providerReference: typeof data.reference === 'string' && data.reference !== req.reference ? data.reference : null,
      message: data.message ?? null,
    }
  } catch (err) {
    return { ok: false, status: null, providerReference: null, message: err instanceof Error ? err.message : 'Erreur réseau' }
  }
}

export interface ProviderTransaction {
  reachable: boolean
  status: PaymentStatus
  rawStatus: string | null
  amount: number | null
  currency: string | null
}

/** Relit le statut réel d'une transaction auprès de FeexPay. */
export async function fetchTransactionStatus(reference: string): Promise<ProviderTransaction> {
  const cfg = feexpayConfig()
  if (!cfg) return { reachable: false, status: 'pending', rawStatus: null, amount: null, currency: null }
  try {
    const res = await fetch(`${API}/transactions/public/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
      signal: AbortSignal.timeout(15_000),
    })
    if (!res.ok) return { reachable: false, status: 'pending', rawStatus: `HTTP ${res.status}`, amount: null, currency: null }
    const tx = (await res.json().catch(() => ({}))) as { status?: string; amount?: number | string; currency?: string }
    const amount = tx.amount === undefined || tx.amount === null ? null : Number(tx.amount)
    return {
      reachable: true,
      status: mapProviderStatus(tx.status),
      rawStatus: tx.status ?? null,
      amount: Number.isFinite(amount) ? amount : null,
      currency: tx.currency ?? null,
    }
  } catch {
    return { reachable: false, status: 'pending', rawStatus: null, amount: null, currency: null }
  }
}
