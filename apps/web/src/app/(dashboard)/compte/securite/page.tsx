'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Factor {
  id: string
  status: string
  friendly_name?: string | null
}

function SecuriteContent() {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const required = searchParams.get('required') === 'admin'

  const [loading, setLoading] = useState(true)
  const [factors, setFactors] = useState<Factor[]>([])
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [factorId, setFactorId] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadFactors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadFactors() {
    setLoading(true)
    const { data } = await supabase.auth.mfa.listFactors()
    setFactors((data?.totp ?? []) as Factor[])
    setLoading(false)
  }

  const verifiedFactor = factors.find((f) => f.status === 'verified')

  async function startEnroll() {
    setError(null)
    setBusy(true)
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' })
    setBusy(false)
    if (error) {
      setError(error.message)
      return
    }
    setQrCode(data.totp.qr_code)
    setFactorId(data.id)
  }

  async function cancelEnroll() {
    if (factorId) await supabase.auth.mfa.unenroll({ factorId })
    setQrCode(null)
    setFactorId(null)
    setCode('')
    setError(null)
  }

  async function verifyEnroll(e: React.FormEvent) {
    e.preventDefault()
    if (!factorId) return
    setError(null)
    setBusy(true)
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code })
    setBusy(false)
    if (error) {
      setError('Code invalide. Réessaie.')
      return
    }
    setSuccess('Double authentification activée avec succès.')
    setQrCode(null)
    setFactorId(null)
    setCode('')
    await loadFactors()
    if (required) {
      setTimeout(() => router.push('/admin'), 1200)
    }
  }

  async function handleUnenroll(id: string) {
    if (!confirm('Désactiver la double authentification sur ce compte ?')) return
    setError(null)
    setBusy(true)
    const { error } = await supabase.auth.mfa.unenroll({ factorId: id })
    setBusy(false)
    if (error) {
      setError(error.message)
      return
    }
    setSuccess('Double authentification désactivée.')
    await loadFactors()
  }

  if (loading) {
    return <div className="max-w-lg mx-auto px-4 py-12 text-center text-sm text-gray-400">Chargement…</div>
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <Link href="/dashboard" className="text-sm text-blue-600 hover:underline mb-6 inline-block">← Retour</Link>

      {required && !verifiedFactor && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-100 text-amber-800 rounded-xl text-sm">
          🔒 Active la double authentification pour accéder à l&apos;espace admin.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🔐</span>
          <h1 className="text-xl font-bold text-gray-900">Double authentification</h1>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{success}</div>}

        {verifiedFactor && !qrCode ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                ✓ Activée
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Ton compte est protégé par une application d&apos;authentification (Google Authenticator, Authy…).
            </p>
            <button
              onClick={() => handleUnenroll(verifiedFactor.id)}
              disabled={busy}
              className="w-full py-3 bg-red-50 text-red-700 rounded-xl font-medium text-sm hover:bg-red-100 disabled:opacity-50"
            >
              Désactiver la double authentification
            </button>
          </div>
        ) : qrCode ? (
          <form onSubmit={verifyEnroll} className="space-y-4">
            <p className="text-sm text-gray-600">
              Scanne ce QR code avec ton application d&apos;authentification (Google Authenticator, Authy…), puis
              saisis le code à 6 chiffres affiché.
            </p>
            <div className="flex justify-center p-4 bg-gray-50 rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCode} alt="QR code de double authentification" className="w-48 h-48" />
            </div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              required
              autoFocus
              className="w-full px-4 py-4 border rounded-lg text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelEnroll}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={busy || code.length < 6}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {busy ? 'Vérification…' : 'Activer'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-6">
              Ajoute une couche de sécurité supplémentaire à ton compte avec une application d&apos;authentification
              (Google Authenticator, Authy, 1Password…).
            </p>
            <button
              onClick={startEnroll}
              disabled={busy}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {busy ? 'Génération…' : 'Activer la double authentification'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SecuritePage() {
  return (
    <Suspense>
      <SecuriteContent />
    </Suspense>
  )
}
