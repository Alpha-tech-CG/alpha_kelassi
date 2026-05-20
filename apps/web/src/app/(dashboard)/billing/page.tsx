'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const PLANS = [
  {
    id: 'monthly' as const,
    label: 'Mensuel',
    price: '2 000 FCFA',
    priceUSD: '3.50 $',
    period: '/mois',
    highlight: false,
  },
  {
    id: 'yearly' as const,
    label: 'Annuel',
    price: '20 000 FCFA',
    priceUSD: '33 $',
    period: '/an',
    highlight: true,
    badge: '-17%',
  },
]

function BillingContent() {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const [loading, setLoading] = useState<string | null>(null)
  const [payMethod, setPayMethod] = useState<'card' | 'mobile_money'>('mobile_money')
  const [phone, setPhone] = useState('')

  async function handleSubscribe(plan: 'monthly' | 'yearly') {
    setLoading(plan)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    const endpoint = payMethod === 'card' ? '/api/billing/checkout' : '/api/billing/cinetpay'
    const body = payMethod === 'card' ? { plan } : { plan, phone }

    const res = await fetch(`${process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001'}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    })

    const json = (await res.json()) as { data?: { url?: string } }
    if (json.data?.url) {
      window.location.href = json.data.url
    }
    setLoading(null)
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">Abonnement activé !</h2>
        <p className="text-gray-500">Bienvenue dans Kelassi Premium. Accès illimité à tous les cours et examens.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-2">Passe à Kelassi Premium</h1>
      <p className="text-gray-500 text-center mb-8">
        Questions IA illimitées · Tous les examens d'État · Mode hors-ligne
      </p>

      {/* Mode de paiement */}
      <div className="flex rounded-lg bg-gray-100 p-1 mb-8">
        {(['mobile_money', 'card'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setPayMethod(m)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              payMethod === m ? 'bg-white shadow text-gray-900' : 'text-gray-500'
            }`}
          >
            {m === 'mobile_money' ? '📱 Mobile Money (MTN / Orange)' : '💳 Carte bancaire'}
          </button>
        ))}
      </div>

      {payMethod === 'mobile_money' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Numéro Mobile Money
          </label>
          <div className="flex">
            <span className="px-4 py-3 bg-gray-100 border border-r-0 rounded-l-lg text-gray-600 text-sm">
              +242
            </span>
            <input
              type="tel"
              placeholder="06 XXX XX XX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Plans */}
      <div className="grid grid-cols-2 gap-4">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border-2 p-6 ${
              plan.highlight ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {plan.badge}
              </span>
            )}
            <div className="text-lg font-bold mb-1">{plan.label}</div>
            <div className="text-2xl font-extrabold text-blue-700">{plan.price}</div>
            <div className="text-xs text-gray-400 mb-4">{plan.priceUSD}{plan.period}</div>
            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={!!loading || (payMethod === 'mobile_money' && !phone)}
              className={`w-full py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 ${
                plan.highlight
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-900 text-white hover:bg-gray-700'
              }`}
            >
              {loading === plan.id ? 'Redirection...' : 'Choisir'}
            </button>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        Essai gratuit 14 jours · Annulation à tout moment
      </p>
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense>
      <BillingContent />
    </Suspense>
  )
}
