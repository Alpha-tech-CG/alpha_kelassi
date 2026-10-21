'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const RESEND_DELAY = 60

/**
 * Confirmation du compte par code à 6 chiffres (modèle d'e-mail « Confirm
 * signup » avec {{ .Token }}). verifyOtp() ouvre la session ; le tableau de
 * bord renvoie ensuite vers l'onboarding tant qu'il n'est pas terminé.
 */
export default function ConfirmerPage(): React.JSX.Element {
  const supabase = createClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [wait, setWait] = useState(0)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setEmail(params.get('email') ?? '')
    if (params.get('fresh') === '1') setWait(RESEND_DELAY)
  }, [])

  useEffect(() => {
    if (wait <= 0) return
    const t = setTimeout(() => setWait((w) => w - 1), 1000)
    return () => clearTimeout(t)
  }, [wait])

  async function verify(token: string) {
    if (!email) return setError('Indique ton adresse e-mail.')
    setLoading(true)
    setError(null)
    const { error: err } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token, type: 'signup' })
    setLoading(false)
    if (err) {
      setError(/expired/i.test(err.message) ? 'Ce code a expiré. Demande-en un nouveau.' : 'Code incorrect. Vérifie les chiffres et réessaie.')
      setCode('')
      input.current?.focus()
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  function onChange(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 8)
    setCode(digits)
    setError(null)
    if (digits.length === 6) void verify(digits)
  }

  async function resend() {
    if (!email || wait > 0) return
    setError(null)
    const { error: err } = await supabase.auth.resend({ type: 'signup', email: email.trim().toLowerCase() })
    if (err) {
      setError(/rate limit|seconds/i.test(err.message) ? 'Patiente un peu avant de redemander un code.' : 'Envoi impossible pour le moment.')
      return
    }
    setInfo('Nouveau code envoyé ✅')
    setWait(RESEND_DELAY)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cx-paper via-white to-[#BFD9FB] px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-[0_30px_80px_-40px_rgba(15,27,45,0.35)] p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-5">📩</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Confirme ton e-mail</h1>
        <p className="text-sm text-gray-500 mb-6">
          Entre le code à 6 chiffres envoyé à
          {email ? <><br /><strong className="text-gray-900">{email}</strong></> : null}
        </p>

        {!email && (
          <input
            type="email"
            placeholder="ton@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        <input
          ref={input}
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={8}
          placeholder="••••••"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-4 border border-gray-200 rounded-2xl text-3xl font-black tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">{error}</div>}
        {info && !error && <p className="mt-4 text-sm text-green-700">{info}</p>}

        <button
          onClick={() => verify(code)}
          disabled={loading || code.length < 6}
          className="mt-6 w-full py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Vérification…' : 'Valider'}
        </button>

        <button
          onClick={resend}
          disabled={wait > 0 || !email}
          className="mt-4 text-sm font-semibold text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
        >
          {wait > 0 ? `Renvoyer le code dans ${wait} s` : 'Renvoyer le code'}
        </button>
        <p className="text-xs text-gray-400 mt-3">Pas reçu ? Regarde dans les spams ou « Promotions ».</p>

        <p className="text-xs text-gray-400 mt-6">
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">Retour à la connexion</Link>
        </p>
      </div>
    </div>
  )
}
