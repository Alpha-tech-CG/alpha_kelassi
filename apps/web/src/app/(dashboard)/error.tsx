'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[dashboard] error boundary:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-2">Une erreur est survenue</h2>
      <p className="text-sm text-gray-500 mb-6 max-w-xs">
        Impossible de charger cette page. Vérifie ta connexion et réessaie.
      </p>
      <button
        onClick={reset}
        className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
      >
        Réessayer
      </button>
    </div>
  )
}
