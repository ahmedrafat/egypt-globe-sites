'use client'

/**
 * LoginForm — Supabase Auth sign-in / sign-up tabs.
 * On successful auth, the cookie is set, then we hard-navigate to /buyer.
 */
import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginForm() {
  const [tab, setTab] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [company, setCompany] = useState('')
  const [contactName, setContactName] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )

  async function onSignIn(e) {
    e.preventDefault()
    setError(null); setInfo(null); setSubmitting(true)
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    setSubmitting(false)
    if (err) { setError(err.message); return }
    if (data?.user) window.location.href = '/buyer'
  }

  async function onSignUp(e) {
    e.preventDefault()
    setError(null); setInfo(null); setSubmitting(true)
    const { data, error: err } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { company, contact_name: contactName, country, phone },
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/buyer` : undefined,
      },
    })
    if (err) { setError(err.message); setSubmitting(false); return }

    // Create the buyer-access row (status=pending until admin approves)
    if (data?.user) {
      await supabase.from('egg_buyer_access').insert({
        user_id: data.user.id,
        email,
        company,
        contact_name: contactName,
        country,
        phone,
        status: 'pending',
        show_prices: false,
        visible_all: false,
      })
    }
    setSubmitting(false)
    if (data?.session) {
      window.location.href = '/buyer'
    } else {
      setInfo('Check your email for the confirmation link, then sign in.')
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50">
        <button onClick={() => { setTab('signin'); setError(null); setInfo(null) }}
          className={`py-4 font-bold text-sm transition-colors ${tab === 'signin' ? 'bg-white text-[#1d5fa1] border-b-2 border-[#1d5fa1]' : 'text-slate-500 hover:text-slate-700'}`}>
          Sign in
        </button>
        <button onClick={() => { setTab('signup'); setError(null); setInfo(null) }}
          className={`py-4 font-bold text-sm transition-colors ${tab === 'signup' ? 'bg-white text-[#1d5fa1] border-b-2 border-[#1d5fa1]' : 'text-slate-500 hover:text-slate-700'}`}>
          Create account
        </button>
      </div>

      <div className="p-6 sm:p-8">
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
            ⚠ {error}
          </div>
        )}
        {info && (
          <div className="mb-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 text-sm">
            ℹ {info}
          </div>
        )}

        {tab === 'signin' ? (
          <form onSubmit={onSignIn} className="space-y-4">
            <Field label="Email" required>
              <Input type="email" value={email} onChange={setEmail} required autoComplete="email" placeholder="you@company.com" />
            </Field>
            <Field label="Password" required>
              <Input type="password" value={password} onChange={setPassword} required autoComplete="current-password" placeholder="•••••••••" />
            </Field>
            <button type="submit" disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#1d5fa1] hover:bg-[#14467a] disabled:bg-slate-300 text-white font-bold px-7 py-3.5 rounded-xl shadow-md transition-all">
              {submitting ? '⏳ Signing in…' : 'Sign in →'}
            </button>
            <p className="text-xs text-center text-slate-500">
              Don't have an account?{' '}
              <button type="button" onClick={() => setTab('signup')} className="text-[#1d5fa1] font-semibold hover:underline">
                Create one
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={onSignUp} className="space-y-4">
            <Grid>
              <Field label="Company name" required>
                <Input value={company} onChange={setCompany} required placeholder="ACME Trading FZE" autoComplete="organization" />
              </Field>
              <Field label="Contact name" required>
                <Input value={contactName} onChange={setContactName} required placeholder="Your full name" autoComplete="name" />
              </Field>
              <Field label="Email" required>
                <Input type="email" value={email} onChange={setEmail} required autoComplete="email" placeholder="you@company.com" />
              </Field>
              <Field label="Phone (optional)">
                <Input type="tel" value={phone} onChange={setPhone} placeholder="+971 50 …" autoComplete="tel" />
              </Field>
              <Field label="Country" required>
                <Input value={country} onChange={setCountry} required placeholder="Country" />
              </Field>
              <Field label="Password" required>
                <Input type="password" value={password} onChange={setPassword} required autoComplete="new-password" placeholder="At least 8 characters" minLength={8} />
              </Field>
            </Grid>
            <button type="submit" disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] disabled:bg-slate-300 text-white font-bold px-7 py-3.5 rounded-xl shadow-md shadow-orange-500/20 transition-all">
              {submitting ? '⏳ Creating…' : 'Create account →'}
            </button>
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              By creating an account you agree we may contact you about quotes.
              Approval (typically &lt; 24 h) unlocks prices and your scoped
              catalogue.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-700 mb-1.5 block">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  )
}
function Grid({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
}
function Input({ type = 'text', value, onChange, ...rest }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d5fa1] focus:border-transparent"
      {...rest} />
  )
}
