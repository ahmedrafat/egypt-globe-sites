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
  SERVICE_DIVISIONS,
  APPLICATIONS,
  getPageByPath,
  getPagesInCategory,
  getPagesByCategory,
  getSiteSettings,
} from '../lib/corporatePages'
import MarkdownBody from '../components/MarkdownBody'
import CustomerLogosStrip from '../components/CustomerLogosStrip'
import { getCaseStudies } from '../lib/corporatePages'

export const revalidate = 60

export const metadata = {
  title: 'Egypt Globe Group — B2B Export Trading Conglomerate',
  description:
    'Egyptian industrial excellence delivered to 60+ countries. Salt, cement, fertilizers, chemicals, construction materials, agro & food, industrial minerals. FOB / CIF / CFR from 7 Egyptian ports. Quote in 24 hours.',
}

const TRUST = [
  { big: '60+', label: 'Destination markets' },
  { big: '7',   label: 'Egyptian seaports' },
  { big: '7',   label: 'Product divisions' },
  { big: '24h', label: 'Quote turnaround' },
]

// Standards & certifications shown in the trust strip
const TRUST_CERTS = [
  { name: 'ISO 22000',     hint: 'Food safety' },
  { name: 'ISO 9001:2015', hint: 'Quality mgmt' },
  { name: 'EN 197-1',      hint: 'Cement spec' },
  { name: 'EN 16811-1',    hint: 'De-icing salt' },
  { name: 'USP / BP',      hint: 'Pharma grade' },
  { name: 'NSF/ANSI 60',   hint: 'Drinking water' },
  { name: 'API 13B-1',     hint: 'Drilling mud' },
  { name: 'HACCP',         hint: 'Food chain' },
  { name: 'Halal',         hint: 'Food cert' },
  { name: 'EU REACH',      hint: 'Chemical reg' },
  { name: 'GOEIC',         hint: 'Egyptian export' },
  { name: 'EUR1',          hint: 'Pref. origin' },
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
  const [featuredAll, aboutPage, company, grouped] = await Promise.all([
    Promise.all(
      ['construction', 'salt', 'fertilizers', 'chemicals'].map(c =>
        getPagesInCategory(c, { limit: 2 })
      )
    ),
    getPageByPath('/about'),
    getSiteSettings(),
    getPagesByCategory(),
  ])
  const featured = featuredAll.flat().slice(0, 8)
  const blogPosts = (grouped.blog || []).slice(0, 3)
  const caseStudies = await getCaseStudies({ limit: 3 })

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
              {company.name} is a multi-division trading conglomerate sourcing
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

      {/* Trusted by — customer-logos strip (right after hero) ─── */}
      <CustomerLogosStrip variant="home" />

      {/* Product divisions — THE ONLY categories tile section ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
          <div className="inline-block bg-blue-50 text-[#1d5fa1] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Our Product Divisions
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Seven divisions, one Egyptian export desk.
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

      {/* Services strip ───────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50/40 py-20 sm:py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
            <div className="inline-block bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              Beyond commodities
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              Full supply-chain services in-house.
            </h2>
            <p className="text-lg text-slate-600">
              Logistics, port operations, added-value processing, packing, inspection
              and trade documentation — pair any product with the service it needs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 stagger-children">
            {SERVICE_DIVISIONS.map(svc => (
              <Link key={svc.id} href={svc.path}
                className="card-lift group rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-2xl mb-3"
                  style={{ background: `${svc.color}1A`, color: svc.color }}>
                  {svc.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#1d5fa1] transition-colors leading-tight">
                  {svc.label}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-snug line-clamp-3">{svc.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries we serve ─────────────────────────────────── */}
      <section className="bg-gradient-to-br from-violet-50/40 via-white to-blue-50/40 py-20 sm:py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
            <div className="inline-block bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              Industries we serve
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
              {APPLICATIONS.length} industries · 60+ markets · one export desk.
            </h2>
            <p className="text-lg text-slate-600">
              From food processing to chlor-alkali to road de-icing — pick your
              application to see the matching SKUs across our 7 product divisions.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 stagger-children">
            {APPLICATIONS.map(app => (
              <Link key={app.id} href={app.path}
                className="card-lift group rounded-2xl border border-slate-200 bg-white p-4 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-2xl mb-2.5 bg-gradient-to-br from-violet-100 to-blue-100">
                  {app.icon}
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-[#1d5fa1] transition-colors text-xs leading-tight">
                  {app.label}
                </h3>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/applications"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1d5fa1] hover:underline">
              All {APPLICATIONS.length} applications →
            </Link>
          </div>
        </div>
      </section>

      {/* Why us ────────────────────────────────────────────────── */}
      <section className="bg-[#f8fafc] py-20 sm:py-24 border-b border-slate-200">
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

      {/* Certifications & standards trust strip ──────────────── */}
      <section className="bg-white py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              Standards & Certifications
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Per-shipment paperwork ready for the world's tender standards.
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Every order ships with the certificates your destination market requires —
              from food-safety to drinking-water to drilling-mud spec.
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 stagger-children">
            {TRUST_CERTS.map(c => (
              <div key={c.name}
                className="card-lift bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-center">
                <div className="text-sm font-bold text-slate-900 leading-tight">{c.name}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{c.hint}</div>
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
              <p className="text-sm text-slate-200 leading-relaxed">{company.headOffice}</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur">
              <div className="text-xs text-blue-300 uppercase tracking-wider font-semibold mb-2">⚓ Operations — Damietta</div>
              <p className="text-sm text-slate-200 leading-relaxed">{company.operationsOffice}</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur">
              <div className="text-xs text-blue-300 uppercase tracking-wider font-semibold mb-2">📞 Sales / Export</div>
              <a href={`tel:${company.phoneE164}`} className="block text-sm text-white font-semibold hover:text-orange-300">
                {company.phone}
              </a>
              <span className="block text-xs text-slate-400 mt-1">Tel & Fax: {company.telFax}</span>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur">
              <div className="text-xs text-blue-300 uppercase tracking-wider font-semibold mb-2">✉ Email</div>
              <a href={`mailto:${company.email}`} className="text-sm text-white font-semibold hover:text-orange-300">
                {company.email}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Case studies — real shipments ─────────────────────────── */}
      {caseStudies.length > 0 && (
        <section className="bg-white py-20 sm:py-24 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4 animate-fade-in-up">
              <div>
                <div className="inline-block bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                  📖 Case studies
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Real shipments, real numbers.
                </h2>
                <p className="text-slate-600 mt-2 max-w-2xl">
                  Each case study walks through a real Egypt Globe export — sourcing,
                  loading, documentation, distribution and the delivered numbers.
                </p>
              </div>
              <Link href="/case-studies"
                className="text-sm font-bold text-[#1d5fa1] hover:underline">
                All case studies →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
              {caseStudies.map(cs => (
                <Link key={cs.id} href={cs.path}
                  className="card-lift group rounded-2xl border border-slate-200 bg-white overflow-hidden">
                  <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-teal-100 via-emerald-100 to-cyan-100 relative">
                    {cs.hero_photo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={cs.hero_photo_url} alt={cs.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-7xl opacity-30">📖</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-teal-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                      📖 Case study
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-[#1d5fa1] transition-colors leading-tight">
                      {cs.title}
                    </h3>
                    {cs.description && (
                      <p className="text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed">{cs.description}</p>
                    )}
                    <div className="mt-3 inline-flex items-center text-xs font-bold text-teal-700 group-hover:gap-2 gap-1 transition-all">
                      Read case study <span>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest insights / blog teaser ─────────────────────────── */}
      {blogPosts.length > 0 && (
        <section className="bg-gradient-to-br from-slate-50 to-blue-50/30 py-20 sm:py-24 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4 animate-fade-in-up">
              <div>
                <div className="inline-block bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                  Latest insights
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  News, market commentary & company updates.
                </h2>
              </div>
              <Link href="/blog"
                className="text-sm font-bold text-[#1d5fa1] hover:underline">
                Read all insights →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
              {blogPosts.map((post, i) => (
                <Link key={post.id} href={post.path}
                  className="card-lift group rounded-2xl border border-slate-200 bg-white overflow-hidden">
                  <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-rose-100 to-orange-100 relative">
                    {post.hero_photo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={post.hero_photo_url} alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-7xl opacity-30">📝</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur text-rose-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                      📝 Article
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-[#1d5fa1] transition-colors leading-tight">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed">{post.description}</p>
                    )}
                    <div className="mt-3 inline-flex items-center text-xs font-bold text-[#1d5fa1] group-hover:gap-2 gap-1 transition-all">
                      Read more <span>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
