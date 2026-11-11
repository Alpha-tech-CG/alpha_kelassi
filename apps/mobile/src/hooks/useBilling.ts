import { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router'
import { api, type BillingMe } from '../lib/billing'

/**
 * Formule effective, quotas et abonnement de l'élève. Rechargé à chaque retour
 * sur l'écran : après un paiement, les droits sont immédiatement à jour.
 */
export function useBilling() {
  const [me, setMe] = useState<BillingMe | null>(null)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    const res = await api<BillingMe>('/api/billing/me')
    if (res.ok && res.json.data) setMe(res.json.data)
    setLoading(false)
  }, [])

  useFocusEffect(useCallback(() => { reload() }, [reload]))

  return {
    me,
    loading,
    reload,
    can: (feature: string) => me?.features?.[feature] === true,
  }
}
