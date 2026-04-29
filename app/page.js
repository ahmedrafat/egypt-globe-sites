/**
 * Egypt Globe Group — home page.
 *
 * Custom hero/CTA layout (NOT the generic PageRenderer — the home is
 * the only page where we hand-tune the section flow). Renders:
 *   1. Hero with title, tagline, dual CTAs, animated trust strip
 *   2. 6-tile product divisions grid (the only "categories" tile section)
 *   3. Egyptian-advantage / why-us
 *   4. Featured products mini-grid
 *   5. About preview
 *   6. CTA banner
 */
import Link from 'next/link'
import {
  PRODUCT_DIVISIONS,
  COMPANY_INFO,
  getPageByPath,
  getPagesInCategory,
} from '../lib/corporatePages'
import MarkdownBody from '../components/MarkdownBody'

export const revalidate = 60

export const metadata = {
  title: 'Egypt Globe Group — B2B Export Trading Conglomerate',
  description:
    'Egyptian industrial excellence delivered to 60+ countries. Salt, cement, fertilizers, chemicals, construction materials, agro & food, industrial minerals. FOB / CIF / CFR from 7 Egyptian ports. Quote in 24 hours.',
}

const TRUST = [
  { big: '60+', label: 'Destination markets' },
  { big: '7',   label: 'Egyptian seaports' },
  { big: '6',   label: 'Product divisions' },
  { big: '24h', label: 'Quote turnaround' },
]

const WHY_US = [
  {
    icon: '🇪🇬',
    title: 'Egyptian-origin verified',
    body: 'Direct from Egyptian quarries, plants and cooperatives — short, traceable supply chain with EUR1 / Certificate of Origin paperwork.',
  },
  {
    icon: '🚢',
    title: '7-port loading flexibility',
    body: 'Damietta, Port Said East, Alexandria, El-Dekheila, Ain Sokhna, Safaga, El-Arish — choose the closest source-to-destination lane.',
  },
  {
    icon: '🧪',
    title: 'Lab certificates per shipment',
    body: 'Independent SGS / Intertek / Bureau Veritas inspection on request. Per-batch CoA for every consignment, no exceptions.',
  },
  {
    icon: '⚡',
    title: '24-hour quote SLA',
    body: 'Submit your RFQ today, receive priced FOB / CIF / CFR by tomorrow. Standardised L/C-bank document set ready on order confirmation.',
  },
]

export default async function HomePage() {
  // Pull a featured-products carousel from the most-populated divisions
  const featured = (await Promise.all(
    ['construction', 'salt', 'fertilizers', 'chemicals'].map(c =>
      getPagesInCategory(c, { limit: 2 })
    )
  )).flat().slice(0, 8)

  // About preview = pull the /about row's description so the home stays
  // in lock-step with whatever the admin edits there
  const aboutPage = await getPageByPath('/about')

  return (
    <>
      {/* Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f8fafc] via-white to-[#eef4fb]">
        {/* Decorative blobs */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-32 w-[500px] h-[500px] rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #1d5fa133 0%, transparent 70%)' }} />
          <div className="absolute -bottom-32 -left-24 w-[400px] h-[400px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #FF632133 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-[#1d5fa1] text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5">
              <span className="w-2 h-2 rounded-full bg-[#1d5fa1] animate-pulse" />
              Egyptian B2B Export Trading
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-6">
              Egyptian industry,<br />
              <span className="text-[#1d5fa1]">delivered worldwide.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mb-8">
              {COMPANY_INFO.name} is a multi-division trading conglomerate sourcing
              salt, cement, fertilizers, chemicals, construction materials, agro &
              food, and industrial minerals direct from Egyptian producers — shipped
              FOB / CIF / CFR from 7 Egyptian ports to 60+ destination markets.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/rfq"
                className="inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-7 py-4 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl">
                📋 Request a Quote in 24h
              </Link>
              <Link href="/products"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 font-bold px-7 py-4 rounded-xl border-2 border-slate-200 hover:border-[#1d5fa1] transition-all">
                Browse Products →
              </Link>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger-children">
            {TRUST.map(t => (
              <div key={t.label} className="rounded-2xl bg-white border border-slate-200 px-5 py-5 sm:py-6 card-lift">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#1d5fa1] tracking-tight">{t.big}</div>
                <div className="text-xs sm:text-sm text-slate-500 mt-1">{t.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product divisions — THE ONLY categories tile section ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
          <div className="inline-block bg-blue-50 text-[#1d5fa1] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Our Product Divisions
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Six divisions, one Egyptian export desk.
          </h2>
          <p className="text-lg text-slate-600">
            Each division has its own dedicated sourcing, batch traceability and
            quality-control pipeline. Click to explore the catalogue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {PRODUCT_DIVISIONS.map(div => (
            <Link key={div.id} href={div.path}
              className="card-lift group relative rounded-3xl border border-slate-200 bg-white overflow-hidden">
              {/* Color band */}
              <div className="h-1.5 w-full" style={{ background: div.color }} />
              <div className="p-7">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: `${div.color}1A`, color: div.color }}>
                    {div.icon}
                  </div>
                  <span className="text-slate-400 group-hover:text-[#1d5fa1] group-hover:translate-x-1 transition-all text-2xl">
                    →
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-[#1d5fa1] transition-colors mb-2">
                  {div.label}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{div.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why us ────────────────────────────────────────────────── */}
      <section className="bg-[#f8fafc] py-20 sm:py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
            <div className="inline-block bg-orange-50 text-[#FF6321] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              Why Egypt Globe
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Egyptian-origin commodity exports — done the right way.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
            {WHY_US.map(card => (
              <div key={card.title} className="card-lift bg-white border border-slate-200 rounded-2xl p-6">
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{card.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products ────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4 animate-fade-in-up">
            <div>
              <div className="inline-block bg-blue-50 text-[#1d5fa1] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                Featured Products
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Recently shipped from our catalogue.
              </h2>
            </div>
            <Link href="/products" className="text-[#1d5fa1] font-semibold hover:underline">
              View all products →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
            {featured.map(p => (
              <Link key={p.id} href={p.path}
                className="card-lift group rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                  {p.hero_photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.hero_photo_url} alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">📦</div>
                  )}
                </div>
                <div className="p-4">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-[#1d5fa1] mb-1">
                    {p.category}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-[#1d5fa1] transition-colors">
                    {p.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* About preview ────────────────────────────────────────── */}
      <section className="bg-[#0f1f3a] py-20 sm:py-24 text-white relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 right-10 w-[300px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(circle, #1d5fa166 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 -left-10 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, #FF632144 0%, transparent 70%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="animate-fade-in-up">
            <div className="inline-block bg-white/10 text-blue-200 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              About the Group
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5">
              Cairo headquarters,<br />Damietta operations.
            </h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-6">
              {aboutPage?.description ||
                'Egypt Globe Group is an Egyptian export trading house operating across the country\'s strongest industrial verticals — minerals, chemicals, construction materials, salt, fertilizers and agricultural products.'}
            </p>
            <Link href="/about"
              className="inline-flex items-center gap-2 bg-white text-[#0f1f3a] font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Read our story →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur">
              <div className="text-xs text-blue-300 uppercase tracking-wider font-semibold mb-2">📍 Head Office — Cairo</div>
              <p className="text-sm text-slate-200 leading-relaxed">{COMPANY_INFO.headOffice}</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur">
              <div className="text-xs text-blue-300 uppercase tracking-wider font-semibold mb-2">⚓ Operations — Damietta</div>
              <p className="text-sm text-slate-200 leading-relaxed">{COMPANY_INFO.operationsOffice}</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur">
              <div className="text-xs text-blue-300 uppercase tracking-wider font-semibold mb-2">📞 Sales / Export</div>
              <a href={`tel:${COMPANY_INFO.phoneE164}`} className="block text-sm text-white font-semibold hover:text-orange-300">
                {COMPANY_INFO.phone}
              </a>
              <span className="block text-xs text-slate-400 mt-1">Tel & Fax: {COMPANY_INFO.telFax}</span>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur">
              <div className="text-xs text-blue-300 uppercase tracking-wider font-semibold mb-2">✉ Email</div>
              <a href={`mailto:${COMPANY_INFO.email}`} className="text-sm text-white font-semibold hover:text-orange-300">
                {COMPANY_INFO.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA ────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-[#1d5fa1] to-[#14467a] p-10 sm:p-14 text-center relative overflow-hidden shadow-2xl shadow-blue-900/15 animate-scale-in">
          <div aria-hidden="true" className="absolute -top-12 -right-12 text-[280px] opacity-10 select-none">🌍</div>
          <h2 className="relative text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Have a sourcing requirement?
          </h2>
          <p className="relative text-blue-100 text-lg mb-7 max-w-2xl mx-auto">
            Submit one RFQ — we'll come back within 24 hours with priced FOB / CIF /
            CFR options across every Egyptian loading port.
          </p>
          <Link href="/rfq"
            className="relative inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5">
            📋 Get Your Quote
          </Link>
        </div>
      </section>
    </>
  )
}
