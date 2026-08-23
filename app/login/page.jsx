/**
 * /login — buyer authentication page.
 *
 * Sign-in tab + Sign-up tab via Supabase Auth (signInWithPassword /
 * signUp). After successful auth, the buyer either hits their dashboard
 * (if approved) or sees a pending message until admin approves.
 *
 * Light editorial edition — tokens + utilities (.egg-*) in app/globals.css.
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
    <article className="bg-white text-[#14161a]">
      <section className="relative overflow-hidden bg-white border-b border-[#14161a]/10">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(55% 55% at 88% 0%, rgba(2,132,199,.14), transparent 60%), radial-gradient(40% 45% at 0% 100%, rgba(15,181,165,.12), transparent 60%)' }} />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="egg-display text-4xl sm:text-5xl lg:text-6xl text-[#14161a] mb-3">
            Buyer sign-in
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl text-[#3f4650]">
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
          <div className="egg-card p-6 hover:transform-none">
            <h3 className="egg-display text-2xl text-[#14161a] mb-4">Why register?</h3>
            <ul className="space-y-3 text-sm text-[#3f4650]">
              <li className="flex items-start gap-2">
                <span className="text-[#0fb5a5] font-bold mt-0.5">✓</span>
                <span><strong className="text-[#14161a]">See indicative prices</strong> on every SKU once your account is approved.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0fb5a5] font-bold mt-0.5">✓</span>
                <span><strong className="text-[#14161a]">Scoped catalogue</strong> — see the products our team has matched to your purchasing profile.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0fb5a5] font-bold mt-0.5">✓</span>
                <span><strong className="text-[#14161a]">Faster RFQ cycle</strong> — your contact details auto-fill the form; we know who you are.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#0fb5a5] font-bold mt-0.5">✓</span>
                <span><strong className="text-[#14161a]">Recent quote history</strong> — track all your submitted RFQs in one place.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-[#fff4ec] ring-1 ring-[#ff6321]/25 p-6">
            <h3 className="font-semibold text-[#14161a] mb-2">Approval process</h3>
            <p className="text-sm text-[#3f4650] leading-relaxed">
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
