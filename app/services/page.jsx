/**
 * /services — custom services hub. Wins over the catch-all.
 *
 * Pelot-style hero (light editorial edition — white with a teal glow)
 * + chip rail + 7-service grid + provider-portal banner + bottom CTA.
 *
 * Design tokens + utilities (.egg-*) live in app/globals.css.
 */
import HeroMotif from '../../components/HeroMotif'
import Link from 'next/link'
import {
  SERVICE_DIVISIONS,
  LOGISTICS_PORTAL_URL,
  getPageByPath,
} from '../../lib/corporatePages'
import RichPageBody from '../../components/RichPageBody'
import QualityStrip from '../../components/QualityStrip'
import Icon, { SERVICE_ICON } from '../../components/ui/Icon'

export const revalidate = 60

export const metadata = {
  title: 'Services — Logistics, Port, Packing, Inspection, Distribution',
  description: 'Egypt Globe Group supply-chain services: logistics, port operations, added-value processing, packing, inspection, distribution and trade documentation across 7 Egyptian ports.',
}

const TONE = '#0d9488'

export default async function ServicesHub() {
  const page = await getPageByPath('/services')

  return (
    <article className="bg-white text-[#14161a]">
      {/* Hero — white editorial banner with teal glow */}
      <section className="relative overflow-hidden bg-white border-b border-[#14161a]/10">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        {/* freight + inspection = sweep and range */}
        <HeroMotif variant="radar" tone="#0d9488" />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(55% 55% at 88% 0%, ${TONE}26, transparent 60%), radial-gradient(40% 45% at 0% 100%, rgba(255,99,33,.09), transparent 60%)` }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-24">
          <nav className="flex items-center gap-2 text-xs text-[#7a8290] mb-5 flex-wrap animate-fade-in">
            <Link href="/" className="hover:text-[#14161a] transition-colors">Home</Link>
            <span>›</span>
            <span className="text-[#14161a] font-medium">Services</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in-up">
            <span className="egg-chip text-xs" style={{ color: TONE, boxShadow: `inset 0 0 0 1px ${TONE}66` }}>
              <Icon name="ship" className="w-3.5 h-3.5" /> {SERVICE_DIVISIONS.length} services
            </span>
            <span className="egg-chip text-xs">
              7 loading ports
            </span>
            <span className="egg-chip text-xs">
              60+ destination markets
            </span>
            <span className="egg-chip text-xs">
              In-house operations
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h1 className="egg-display text-4xl sm:text-5xl lg:text-6xl text-[#14161a] mb-4 leading-[1.02]">
                Beyond commodities —
                <span className="block text-[#3f4650] italic text-2xl sm:text-3xl lg:text-4xl mt-3 leading-[1.15]">
                  full supply-chain coverage in-house.
                </span>
              </h1>
              <p className="text-base sm:text-lg leading-relaxed max-w-3xl text-[#3f4650]">
                Supply-chain risk in bulk export is rarely the commodity — it is the handover between
                contractors. Egypt Globe Group removes the handovers: resident stevedoring, vessel-agency,
                port-QC, packing, inspection and documentation teams at all seven Egyptian ports, one
                accountable desk, documented Notice of Readiness and Statement of Facts on every vessel.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Link href="/rfq"
                className="egg-btn-primary">
                Get Quote
              </Link>
              <a href={LOGISTICS_PORTAL_URL} target="_blank" rel="noopener noreferrer"
                className="egg-btn-ghost">
                <Icon name="anchor" className="w-3.5 h-3.5" /> Provider portal ↗
              </a>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden ring-1 ring-[#14161a]/10 bg-[#14161a]/10 stagger-children">
            {[
              { big: String(SERVICE_DIVISIONS.length), label: 'In-house services' },
              { big: '7',   label: 'Loading ports' },
              { big: '60+', label: 'Destination markets' },
              { big: '100%', label: 'Lots CoA-verified before B/L' },
            ].map(s => (
              <div key={s.label} className="bg-white/90 backdrop-blur px-5 py-5">
                <div className="egg-display text-3xl sm:text-4xl tracking-tight" style={{ color: TONE }}>{s.big}</div>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#7a8290] mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality at the Core */}
      <QualityStrip division="Supply-chain services" />

      {/* Service cards grid */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 egg-reveal">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="egg-eyebrow text-[#0b8f84] justify-center mb-3">
            All services
          </div>
          <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">
            Pick a service or pair multiple in one quote.
          </h2>
          <p className="text-[#3f4650]">
            Most buyers combine logistics, packing, inspection and documentation on a single
            shipment. One quote, one accountable team, one L/C-compliant set of paperwork — and
            the same per-lot QA gate at the port regardless of which services you pair.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {SERVICE_DIVISIONS.map(svc => (
            <Link key={svc.id} href={svc.path}
              className="egg-card relative rounded-3xl overflow-hidden group">
              <div className="h-1.5 w-full" style={{ background: svc.color }} />
              <div className="aspect-[16/9] overflow-hidden relative"
                style={{ background: `linear-gradient(135deg, ${svc.color}1F 0%, ${svc.color}08 60%, white 100%)` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[#14161a]/20 group-hover:text-[#14161a]/35 group-hover:scale-110 transition-all duration-500"><Icon name={SERVICE_ICON[svc.id] || 'ship'} className="w-8 h-8" strokeWidth={1.25} /></span>
                </div>
              </div>
              <div className="p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 -mt-12 ml-1 bg-white shadow-md ring-1 ring-[#14161a]/10"
                  style={{ color: svc.color }}>
                  <Icon name={SERVICE_ICON[svc.id] || 'ship'} className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#14161a] group-hover:text-[#0b8f84] transition-colors mb-2">
                  {svc.label}
                </h3>
                <p className="text-sm text-[#3f4650] leading-relaxed">{svc.blurb}</p>
                <div className="mt-4 inline-flex items-center text-sm font-semibold text-[#0b8f84] group-hover:gap-2 gap-1 transition-all">
                  Learn more <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Body content from CMS */}
      {page?.body_markdown && (
        <section className="bg-[#f9fafb] py-16 border-y border-[#14161a]/10 egg-reveal">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <RichPageBody content={page.body_markdown} title={page.title} />
          </div>
        </section>
      )}

      {/* Provider portal banner */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 overflow-hidden egg-reveal">
        <div className="egg-panel p-8 sm:p-12 relative overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-60 pointer-events-none" />
          <div aria-hidden="true" className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #0284c7 0%, transparent 70%)' }} />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="egg-eyebrow text-[#0369a1] mb-4">
                For freight providers
              </div>
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">
                Are you a shipping line, multimodal operator or freight forwarder?
              </h2>
              <p className="text-[#3f4650] leading-relaxed mb-5">
                Submit rate cards directly into our pricing system via the
                Logistics Portal. Submitted rates flow into our quote pipeline
                and surface to commercial teams as buyer RFQs come in.
              </p>
              <a href={LOGISTICS_PORTAL_URL} target="_blank" rel="noopener noreferrer"
                className="egg-btn-primary">
                <Icon name="anchor" className="w-3.5 h-3.5" /> Open Logistics Portal ↗
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { ico: 'bolt', t: 'Instant rate submission', b: 'Web form, no spreadsheet email chains' },
                { ico: 'chart', t: 'Visible to all buyers',   b: 'Your rates surface across our buyer network' },
                { ico: 'lock', t: 'Provider-private view',   b: 'You see only your own rate cards' },
                { ico: 'calendar', t: 'Validity windows',        b: 'Set effective + expiry per lane' },
              ].map(c => (
                <div key={c.t} className="egg-card p-4 hover:transform-none">
                  <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg ring-1 ring-[#14161a]/15 text-[#14161a] mb-2"><Icon name={c.ico} className="w-4 h-4" /></span>
                  <div className="font-semibold text-[#14161a] text-sm">{c.t}</div>
                  <div className="text-xs text-[#7a8290] leading-snug mt-1">{c.b}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 overflow-hidden egg-reveal">
        <div className="egg-panel p-10 sm:p-14 text-center relative overflow-hidden animate-scale-in">
          <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-60 pointer-events-none" />
          <div aria-hidden="true" className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-40 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${TONE} 0%, transparent 70%)` }} />
          <h2 className="egg-display relative text-3xl sm:text-4xl text-[#14161a] mb-3">
            Need product + service combined?
          </h2>
          <p className="relative text-[#3f4650] text-lg mb-7 max-w-2xl mx-auto">
            Most quotes are for the full chain — product + freight + packing + inspection + documentation —
            in one priced offer. Tell us what you need and we'll come back within 24 hours.
          </p>
          <Link href="/rfq"
            className="egg-btn-primary relative px-8 py-4">
            Request a Quote
          </Link>
        </div>
      </section>
    </article>
  )
}
