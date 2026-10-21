'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UpdatePasswordPage(): React.JSX.Element {
  const supabase = createClient()
  const router = useRouter()

  const [checkingSession, setCheckingSession] = useState(true)
  const [hasSession, setHasSession] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // La session de récupération est déjà établie côté serveur par
    // /auth/callback (échange du code PKCE) avant d'arriver sur cette page.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session)
      setCheckingSession(false)
    })
  }, [supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setDone(true)
    setTimeout(() => router.push('/dashboard'), 1800)
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
          {checkingSession ? (
            <p className="text-sm text-gray-400 text-center py-8">Chargement…</p>
          ) : done ? (
            <>
              <div className="text-4xl text-center mb-4">✅</div>
              <h1 className="text-2xl font-black text-gray-900 mb-1 text-center">Mot de passe mis à jour</h1>
              <p className="text-sm text-gray-500 text-center">Redirection en cours…</p>
            </>
          ) : !hasSession ? (
            <>
              <div className="text-4xl text-center mb-4">⚠️</div>
              <h1 className="text-2xl font-black text-gray-900 mb-1 text-center">Lien invalide ou expiré</h1>
              <p className="text-sm text-gray-500 text-center mb-7">
                Ce lien de réinitialisation n&apos;est plus valide. Demandes-en un nouveau.
              </p>
              <Link
                href="/forgot-password"
                className="block w-full text-center py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors"
              >
                Nouveau lien de réinitialisation
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black text-gray-900 mb-1 text-center">Nouveau mot de passe</h1>
              <p className="text-sm text-gray-400 text-center mb-7">Choisis un mot de passe pour ton compte</p>

              {error && (
                <div className="mb-5 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Au moins 8 caractères"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoFocus
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Confirme le mot de passe</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ressaisis ton mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-600 text-white rounded-2xl font-bold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors mt-2"
                >
                  {loading ? 'Mise à jour…' : 'Mettre à jour le mot de passe →'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
