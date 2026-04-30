'use client'

import { createBrowserClient } from '@supabase/ssr'

export default function SignOutButton() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }
  return (
    <button onClick={signOut}
      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-sm font-semibold border border-white/20 px-4 py-2 rounded-xl transition-colors">
      Sign out →
    </button>
  )
}
