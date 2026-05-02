/**
 * /services — custom services hub. Wins over the catch-all.
 *
 * Pelot-style teal-blue hero + chip rail + 7-service grid + provider-portal
 * banner + bottom CTA.
 */
import Link from 'next/link'
import {
  SERVICE_DIVISIONS,
  LOGISTICS_PORTAL_URL,
  getPageByPath,
} from '../../lib/corporatePages'
import RichPageBody from '../../components/RichPageBody'

export const revalidate = 60

export const metadata = {
  title: 'Services — Logistics, Port, Packing, Inspection, Distribution',
  description: 'Egypt Globe Group supply-chain services: logistics, port operations, added-value processing, packing, inspection, distribution and trade documentation across 7 Egyptian ports.',
}

export default async function ServicesHub() {
  const page = await getPageByPath('/services')

  return (
    <article>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-cyan-800 to-blue-900 text-white">
        <div aria-hidden="true" className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />
          <div className="absolute -bottom-32 -left-24 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,99,33,0.4) 0%, transparent 70%)' }} />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-25" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-24">
          <nav className="flex items-center gap-2 text-xs text-white/60 mb-5 flex-wrap animate-fade-in">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <span className="text-white/90">Services</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in-up">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              🚢 {SERVICE_DIVISIONS.length} services
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              7 loading ports
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              60+ destination markets
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              In-house operations
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-[1.05] drop-shadow-sm">
                Beyond commodities —
                <span className="block text-white/85 text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">
                  full supply-chain coverage in-house.
                </span>
              </h1>
              <p className="text-base sm:text-lg leading-relaxed max-w-3xl text-white/80">
                Sourcing the right product is half the job. The other half — vessel, port,
                packing, paperwork, last-mile — is what keeps shipments moving on schedule.
                Egypt Globe Group operates an in-house service desk covering all 7 layers.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Link href="/rfq"
                className="inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5">
                📋 Get Quote
              </Link>
              <a href={LOGISTICS_PORTAL_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold border border-white/20 px-5 py-3 rounded-xl transition-colors">
                ⚓ Provider portal ↗
              </a>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
            {[
              { big: String(SERVICE_DIVISIONS.length), label: 'In-house services' },
              { big: '7',   label: 'Loading ports' },
              { big: '60+', label: 'Destination markets' },
              { big: '24h', label: 'Quote SLA' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 px-5 py-5">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{s.big}</div>
                <div className="text-xs text-white/70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service cards grid */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block bg-blue-50 text-[#1d5fa1] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            All services
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Pick a service or pair multiple in one quote.
          </h2>
          <p className="text-slate-600">
            Most buyers combine logistics + packing + inspection + documentation
            on a single shipment. Get one quote, one accountable team, one set of
            paperwork.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {SERVICE_DIVISIONS.map(svc => (
            <Link key={svc.id} href={svc.path}
              className="card-lift relative rounded-3xl border border-slate-200 bg-white overflow-hidden group">
              <div className="h-1.5 w-full" style={{ background: svc.color }} />
              <div className="aspect-[16/9] overflow-hidden relative"
                style={{ background: `linear-gradient(135deg, ${svc.color}1F 0%, ${svc.color}08 60%, white 100%)` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-7xl opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500">{svc.icon}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 -mt-12 ml-1 bg-white shadow-md border border-slate-100"
                  style={{ color: svc.color }}>
                  {svc.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1d5fa1] transition-colors mb-2">
                  {svc.label}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{svc.blurb}</p>
                <div className="mt-4 inline-flex items-center text-sm font-bold text-[#1d5fa1] group-hover:gap-2 gap-1 transition-all">
                  Learn more <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Body content from CMS */}
      {page?.body_markdown && (
        <section className="bg-slate-50/40 py-16 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <RichPageBody content={page.body_markdown} title={page.title} />
          </div>
        </section>
      )}

      {/* Provider portal banner */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#0f1f3a] to-[#1d5fa1] p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div aria-hidden="true" className="absolute -top-12 -right-12 text-[260px] opacity-10 select-none">⚓</div>
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-cyan-500/30 text-cyan-100 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 border border-cyan-400/30">
                For freight providers
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
                Are you a shipping line, multimodal operator or freight forwarder?
              </h2>
              <p className="text-blue-100 leading-relaxed mb-5">
                Submit rate cards directly into our pricing system via the
                Logistics Portal. Submitted rates flow into our quote pipeline
                and surface to commercial teams as buyer RFQs come in.
              </p>
              <a href={LOGISTICS_PORTAL_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-[#0f1f3a] font-bold px-6 py-3 rounded-xl shadow-lg transition-all hover:-translate-y-0.5">
                ⚓ Open Logistics Portal ↗
              </a>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { ico: '⚡', t: 'Instant rate submission', b: 'Web form, no spreadsheet email chains' },
                { ico: '📊', t: 'Visible to all buyers',   b: 'Your rates surface across our buyer network' },
                { ico: '🔐', t: 'Provider-private view',   b: 'You see only your own rate cards' },
                { ico: '📅', t: 'Validity windows',        b: 'Set effective + expiry per lane' },
              ].map(c => (
                <div key={c.t} className="rounded-xl bg-white/10 backdrop-blur border border-white/15 p-4">
                  <div className="text-2xl mb-1">{c.ico}</div>
                  <div className="font-bold text-white text-sm">{c.t}</div>
                  <div className="text-xs text-blue-200 leading-snug mt-1">{c.b}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-teal-700 via-cyan-800 to-blue-900 p-10 sm:p-14 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20 animate-scale-in">
          <div aria-hidden="true" className="absolute -top-12 -right-12 text-[280px] opacity-10 select-none">🚢</div>
          <h2 className="relative text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Need product + service combined?
          </h2>
          <p className="relative text-cyan-100 text-lg mb-7 max-w-2xl mx-auto">
            Most quotes are for the full chain — product + freight + packing + inspection + documentation —
            in one priced offer. Tell us what you need and we'll come back within 24 hours.
          </p>
          <Link href="/rfq"
            className="relative inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5">
            📋 Request a Quote
          </Link>
        </div>
      </section>
    </article>
  )
}
