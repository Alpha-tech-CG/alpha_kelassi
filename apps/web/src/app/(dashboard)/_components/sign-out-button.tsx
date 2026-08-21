'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function SignOutButton({ className }: { className?: string }) {
  const supabase = createClient()
  const router = useRouter()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={
        className ??
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-blue-100 hover:bg-white/10 hover:text-white transition-colors w-full text-left'
      }
    >
      <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.75} aria-hidden="true" />
      Se déconnecter
    </button>
  )
}
