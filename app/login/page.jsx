/**
 * /login — buyer authentication page.
 *
 * Sign-in tab + Sign-up tab via Supabase Auth (signInWithPassword /
 * signUp). After successful auth, the buyer either hits their dashboard
 * (if approved) or sees a pending message until admin approves.
 */
import LoginForm from '../../components/auth/LoginForm'
import { getBuyerVisibility } from '../../lib/supabaseServer'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Buyer Sign In',
  description: 'Sign in to see prices, your scoped catalogue, and submit RFQs from your buyer profile.',
  robots: { index: false, follow: true },
}

export default async function LoginPage() {
  const v = await getBuyerVisibility()
  // Already signed in? Bounce to dashboard.
  if (v.authenticated) redirect('/buyer')

  return (
    <article>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1d5fa1] via-[#14467a] to-[#0f1f3a] text-white">
        <div aria-hidden="true" className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-25" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-3">
            Buyer sign-in
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl text-white/80">
            Egypt Globe Group runs a closed-catalogue model — sign in to see
            your priced catalogue, RFQ history and the products our team has
            approved for your account.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <LoginForm />
        </div>

        <aside className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-bold text-slate-900 mb-4">Why register?</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                <span><strong>See indicative prices</strong> on every SKU once your account is approved.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                <span><strong>Scoped catalogue</strong> — see the products our team has matched to your purchasing profile.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                <span><strong>Faster RFQ cycle</strong> — your contact details auto-fill the form; we know who you are.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                <span><strong>Recent quote history</strong> — track all your submitted RFQs in one place.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 p-6">
            <h3 className="font-bold text-slate-900 mb-2">Approval process</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              New accounts go through a quick verification by our export desk
              (typically within 24h). Until approved, you'll see the catalogue
              but prices stay hidden — RFQs still work normally.
            </p>
          </div>
        </aside>
      </section>
    </article>
  )
}
