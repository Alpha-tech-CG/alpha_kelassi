'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage(): React.JSX.Element {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // On ignore volontairement l'erreur renvoyée par Supabase pour ne pas
    // révéler si l'email existe ou non (protection contre l'énumération de comptes).
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    })

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-violet-50 px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black">K</span>
            </div>
            <span className="text-2xl font-black text-gray-900">Kelassi</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {sent ? (
            <>
              <div className="text-4xl text-center mb-4">📬</div>
              <h1 className="text-2xl font-black text-gray-900 mb-1 text-center">Vérifie ta boîte mail</h1>
              <p className="text-sm text-gray-500 text-center mb-7 leading-relaxed">
                Si un compte existe pour <strong>{email}</strong>, tu vas recevoir un email avec un lien pour
                réinitialiser ton mot de passe. Pense à vérifier tes spams.
              </p>
              <Link
                href="/login"
                className="block w-full text-center py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors"
              >
                Retour à la connexion
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black text-gray-900 mb-1 text-center">Mot de passe oublié ?</h1>
              <p className="text-sm text-gray-400 text-center mb-7">
                Entre ton email, on t&apos;envoie un lien pour le réinitialiser
              </p>

              {error && (
                <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Adresse email</label>
                  <input
                    type="email"
                    placeholder="ton@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors mt-2"
                >
                  {loading ? 'Envoi…' : 'Envoyer le lien →'}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-6">
                <Link href="/login" className="text-blue-600 font-bold hover:underline">
                  ← Retour à la connexion
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
