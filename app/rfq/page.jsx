/**
 * /rfq — Request for Quote.
 *
 * Server page: fetches the catalogue (product options for the dropdown)
 * and any RFQ landing copy from egg_corporate_pages, then renders the
 * client-side RFQForm. Real INSERT → market_rfqs runs in the form.
 *
 * Light editorial edition — tokens + utilities (.egg-*) in app/globals.css.
 */
import HeroMotif from '../../components/HeroMotif'
import {
  getPageByPath,
  getRfqProductOptions,
  getSiteSettings,
  getMasterDestPorts,
} from '../../lib/corporatePages'
import RFQForm from '../../components/rfq/RFQForm'
import { ServiceJsonLd } from '../../components/StructuredData'
import Icon from '../../components/ui/Icon'

export const revalidate = 60

export const metadata = {
  alternates: { canonical: '/rfq' },
  title: 'Request a Quote — Egyptian Salt, Cement & Fertilizers',
  description:
    'Submit a B2B RFQ for Egyptian salt, cement, fertilizers, chemicals, or minerals. Egypt Globe Group responds within 24 hours with FOB / CIF / CFR pricing from 7 Egyptian seaports.',
}

export default async function RFQPage({ searchParams }) {
  const params = (await searchParams) || {}
  const preselectPath = typeof params.product === 'string' ? params.product : null
  const requestType = params.type === 'coa' ? 'coa' : 'quote'

  const [page, products, company, destPorts] = await Promise.all([
    getPageByPath('/rfq'),
    getRfqProductOptions(),
    getSiteSettings(),
    getMasterDestPorts(),
  ])

  const isCoa = requestType === 'coa'
  const heroLabel    = isCoa ? 'Certificate of Analysis Request' : '24-Hour Response SLA'
  const heroTitle    = isCoa ? 'Request a Certificate of Analysis.' : 'Request a Quote.'
  const heroBlurb    = isCoa
    ? 'Need a recent batch CoA before placing an order? Tell us which product and (optionally) which lot — we\'ll send the latest signed CoA from the production plant within 24 hours.'
    : 'Tell us what commodity, quantity, destination port and Incoterm you need. Our export desk in Cairo + Damietta will come back within 24 hours with a priced FOB / CIF / CFR offer plus full L/C-bank document set.'

  return (
    <article className="bg-white text-[#14161a]">
      <ServiceJsonLd
        name="B2B Commodity Export Quote — Egypt Globe Group"
        description="Request a FOB / CIF / CFR price quote for Egyptian salt, cement, fertilizers, chemicals, industrial minerals, or agro commodities. Egypt Globe Group responds within 24 hours with pricing from any of 7 Egyptian seaports."
        url="/rfq"
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-[#14161a]/10">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        {/* entry point — matches the orange CTA */}
        <HeroMotif variant="compass" tone="#ff6321" />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: isCoa
            ? 'radial-gradient(55% 55% at 88% 0%, rgba(15,181,165,.2), transparent 60%), radial-gradient(40% 45% at 0% 100%, rgba(184,134,43,.1), transparent 60%)'
            : 'radial-gradient(55% 55% at 88% 0%, rgba(255,99,33,.16), transparent 60%), radial-gradient(40% 45% at 0% 100%, rgba(15,181,165,.12), transparent 60%)' }} />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 animate-fade-in-up">
          <div className={`egg-eyebrow mb-4 ${isCoa ? 'text-[#0b8f84]' : 'text-[#d9501a]'}`}>
            <span className={`w-2 h-2 rounded-full ${isCoa ? 'bg-[#0fb5a5]' : 'bg-[#FF6321]'} animate-pulse`} />
            {heroLabel}
          </div>
          <h1 className="egg-display text-4xl sm:text-5xl lg:text-6xl text-[#14161a] mb-4 leading-[1.02]">
            {heroTitle}
          </h1>
          <p className="text-lg text-[#3f4650] max-w-2xl leading-relaxed">
            {heroBlurb}
          </p>
        </div>
      </section>

      {/* Three-column layout: form (8 cols) + sidebar (4 cols) */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <RFQForm
              products={products}
              destPorts={destPorts}
              preselectPath={preselectPath}
              requestType={requestType}
              supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL}
              supabaseAnon={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}
            />
          </div>

          <aside className="lg:col-span-4 space-y-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {/* What happens next */}
            <div className="egg-card p-6 hover:transform-none">
              <h3 className="egg-display text-2xl text-[#14161a] mb-4">What happens next?</h3>
              <ol className="space-y-3 text-sm">
                {[
                  ['Within 1 hour', 'Your RFQ is logged + assigned to a commodity owner.'],
                  ['Within 24 hours', 'You receive a priced FOB / CIF / CFR offer, a sample Certificate of Analysis and the inspection protocol by email.'],
                  ['On acceptance', 'We open a proforma invoice + L/C bank-set process.'],
                  ['Pre-shipment', 'PSI inspection (TÜV Austria / SGS / Intertek / BV) on request.'],
                  ['On loading', 'Port-laboratory CoA issued before the B/L; full L/C document set delivered. Out-of-spec lots never load.'],
                ].map(([when, what], i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0b8f84] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-[10px] font-mono font-semibold text-[#0b8f84] uppercase tracking-[0.16em]">{when}</div>
                      <div className="text-sm text-[#3f4650] leading-snug mt-0.5">{what}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Direct contact */}
            <div className="relative overflow-hidden egg-panel p-6">
              <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-60 pointer-events-none" />
              <div aria-hidden="true" className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full opacity-30 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #FF6321 0%, transparent 70%)' }} />
              <div className="relative">
                <h3 className="egg-display text-2xl text-[#14161a] mb-3">Prefer to email?</h3>
                <p className="text-sm text-[#3f4650] mb-4 leading-relaxed">
                  Send your RFQ directly to our export desk — same 24-hour SLA.
                </p>
                <a href={`mailto:${company.email}?subject=RFQ%20-%20Egypt%20Globe%20Group`}
                  className="block bg-white ring-1 ring-[#14161a]/10 hover:ring-[#14161a]/35 transition-all rounded-lg px-4 py-3 text-sm font-mono font-semibold text-[#14161a]">
                  <Icon name="mail" className="w-3.5 h-3.5" /> {company.email}
                </a>
                <a href={`tel:${company.phoneE164}`}
                  className="block mt-2 bg-white ring-1 ring-[#14161a]/10 hover:ring-[#14161a]/35 transition-all rounded-lg px-4 py-3 text-sm font-mono font-semibold text-[#14161a]">
                  <Icon name="phone" className="w-3.5 h-3.5" /> {company.phone}
                </a>
              </div>
            </div>

            {/* Trust */}
            <div className="egg-card p-6 hover:transform-none">
              <h3 className="text-sm font-semibold text-[#14161a] mb-3">No commitment, no spam.</h3>
              <ul className="space-y-2 text-xs text-[#3f4650]">
                <li className="flex items-start gap-2"><span className="text-[#0fb5a5] font-bold">✓</span> Your RFQ is confidential — only assigned to your commodity owner.</li>
                <li className="flex items-start gap-2"><span className="text-[#0fb5a5] font-bold">✓</span> No automated follow-up emails. Real Egyptian export desk.</li>
                <li className="flex items-start gap-2"><span className="text-[#0fb5a5] font-bold">✓</span> Quote stands on FOB / CIF / CFR per your Incoterm preference.</li>
                <li className="flex items-start gap-2"><span className="text-[#0fb5a5] font-bold">✓</span> Full L/C-bank document set on every order.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {/* Body markdown if present (admin-editable copy below the form) */}
      {page?.body_markdown && (
        <section className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-slate max-w-none text-[#3f4650]">
            {page.description}
          </div>
        </section>
      )}
    </article>
  )
}
