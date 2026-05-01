/**
 * Egypt Globe Group — home page.
 *
 * Custom hero/CTA layout (NOT the generic PageRenderer — the home is
 * the only page where we hand-tune the section flow). Renders:
 *   1. Hero with 2-column layout: text left, stat cards right
 *   2. Customer logos strip
 *   3. 6-tile product divisions grid
 *   4. Full supply-chain services strip
 *   5. Industries / applications grid
 *   6. Why Egypt Globe
 *   7. Certifications & standards
 *   8. Featured products mini-grid
 *   9. About preview (dark section)
 *  10. Case studies
 *  11. Blog teaser
 *  12. Bottom CTA banner
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
  { big: '60+', label: 'Destination markets', icon: '🌍' },
  { big: '7',   label: 'Egyptian seaports',   icon: '⚓' },
  { big: '7',   label: 'Product divisions',   icon: '📦' },
  { big: '24h', label: 'Quote turnaround',    icon: '⚡' },
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

const TRUST_CHECKLIST = [
  'EUR1 & CoO paperwork included',
  'SGS / Intertek / BV on request',
  '24-hour quote SLA guaranteed',
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
      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#eef6ff] via-white to-[#f8fafc]">
        {/* Decorative layer */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-dots-pattern opacity-50" />
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, #1d5fa122 0%, transparent 65%)' }} />
          <div className="absolute -bottom-48 -left-16 w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #FF632122 0%, transparent 65%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-20 sm:pb-28 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">

            {/* Left: Text content */}
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 bg-[#1d5fa1]/10 text-[#1d5fa1] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-[#1d5fa1]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1d5fa1] animate-pulse" />
                Egyptian B2B Export Trading
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-6">
                Egyptian industry,<br />
                <span className="text-gradient">delivered worldwide.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl mb-8">
                {company.name} is a multi-division trading conglomerate sourcing
                salt, cement, fertilizers, chemicals, construction materials, agro &amp;
                food, and industrial minerals — shipped FOB / CIF / CFR from 7
                Egyptian ports to 60+ destination markets.
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-8">
                <Link href="/rfq"
                  className="inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-7 py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-1 hover:shadow-xl">
                  📋 Request a Quote in 24h
                </Link>
                <Link href="/products"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 font-bold px-7 py-4 rounded-xl border-2 border-slate-200 hover:border-[#1d5fa1] transition-all hover:-translate-y-0.5">
                  Browse Products →
                </Link>
              </div>

              {/* Inline trust checklist */}
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {TRUST_CHECKLIST.map(item => (
                  <span key={item} className="flex items-center gap-1.5 text-sm text-slate-500">
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Animated stat cards */}
            <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {TRUST.map(t => (
                <div key={t.label} className="stat-card rounded-2xl bg-white border border-slate-200 px-5 py-6 sm:px-6 sm:py-8 text-center">
                  <div className="text-2xl mb-2 opacity-60">{t.icon}</div>
                  <div className="text-4xl sm:text-5xl font-extrabold text-[#1d5fa1] tracking-tight leading-none mb-1.5">
                    {t.big}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500">{t.label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ─── Trusted by — customer logos ───────────────────────────── */}
      <CustomerLogosStrip variant="home" />

      {/* ─── Product divisions ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1d5fa1] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 border border-blue-100">
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
              className="card-lift group relative rounded-3xl bg-white overflow-hidden border border-slate-200/80 hover:border-slate-300">
              {/* Top color bar */}
              <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${div.color}, ${div.color}99)` }} />

              <div className="p-7">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${div.color}18` }}>
                    {div.icon}
                  </div>
                  {/* Animated arrow circle */}
                  <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-[#1d5fa1] flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                    <span className="text-slate-400 group-hover:text-white text-sm transition-colors leading-none">→</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#1d5fa1] transition-colors mb-2">
                  {div.label}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{div.blurb}</p>

                {/* Hover reveal label */}
                <div className="mt-5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: div.color }}>
                  Explore catalogue →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Services strip ────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50/40 py-20 sm:py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 border border-teal-100">
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
                className="card-lift group rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 text-center hover:border-teal-200">
                <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-2xl mb-3 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${svc.color}15`, boxShadow: `0 0 0 1px ${svc.color}20` }}>
                  {svc.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-teal-700 transition-colors leading-tight mb-1.5">
                  {svc.label}
                </h3>
                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">{svc.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Industries we serve ───────────────────────────────────── */}
      <section className="bg-gradient-to-br from-violet-50/40 via-white to-blue-50/40 py-20 sm:py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 border border-violet-200">
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
                className="card-lift group rounded-2xl border border-slate-200/80 bg-white p-4 text-center hover:border-violet-200 hover:bg-violet-50/30">
                <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center text-2xl mb-2.5 bg-gradient-to-br from-violet-50 to-blue-50 group-hover:from-violet-100 group-hover:to-blue-100 transition-colors">
                  {app.icon}
                </div>
                <h3 className="font-bold text-slate-800 group-hover:text-violet-700 transition-colors text-xs leading-tight">
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

      {/* ─── Why Egypt Globe ───────────────────────────────────────── */}
      <section className="bg-[#f8fafc] py-20 sm:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-orange-50 text-[#FF6321] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 border border-orange-100">
              Why Egypt Globe
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              Egyptian-origin commodity exports — done the right way.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
            {WHY_US.map((card, i) => (
              <div key={card.title}
                className="card-lift bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden group">
                {/* Large decorative background number */}
                <div className="absolute -top-3 -right-1 text-8xl font-extrabold text-slate-100 select-none leading-none group-hover:text-blue-50 transition-colors pointer-events-none">
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div className="relative">
                  <div className="text-4xl mb-4">{card.icon}</div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-[#1d5fa1] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{card.body}</p>
                </div>

                {/* Bottom gradient bar on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1d5fa1] to-[#FF6321] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Certifications & standards ────────────────────────────── */}
      <section className="bg-white py-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4 border border-emerald-100">
              Standards &amp; Certifications
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
                className="card-lift bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-center hover:border-emerald-200 hover:from-emerald-50/30">
                <div className="text-sm font-bold text-slate-900 leading-tight">{c.name}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{c.hint}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured products ─────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4 animate-fade-in-up">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1d5fa1] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-3 border border-blue-100">
                Featured Products
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Recently shipped from our catalogue.
              </h2>
            </div>
            <Link href="/products" className="text-[#1d5fa1] font-semibold hover:underline text-sm">
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

      {/* ─── About preview ─────────────────────────────────────────── */}
      <section className="bg-[#0f1f3a] py-20 sm:py-24 text-white relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="absolute top-1/4 right-10 w-[350px] h-[350px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, #1d5fa166 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 -left-10 w-[400px] h-[400px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #FF632133 0%, transparent 70%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5 border border-white/15">
              About the Group
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5 leading-tight">
              Cairo headquarters,<br />Damietta operations.
            </h2>
            <p className="text-blue-100/90 text-lg leading-relaxed mb-7">
              {aboutPage?.description ||
                'Egypt Globe Group is an Egyptian export trading house operating across the country\'s strongest industrial verticals — minerals, chemicals, construction materials, salt, fertilizers and agricultural products.'}
            </p>
            <Link href="/about"
              className="inline-flex items-center gap-2 bg-white text-[#0f1f3a] font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-all hover:-translate-y-0.5 shadow-lg">
              Read our story →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            {[
              { label: '📍 Head Office — Cairo',      value: company.headOffice,       href: null },
              { label: '⚓ Operations — Damietta',    value: company.operationsOffice, href: null },
              { label: '📞 Sales / Export',            value: company.phone,            href: `tel:${company.phoneE164}` },
              { label: '✉ Email',                     value: company.email,            href: `mailto:${company.email}` },
            ].map(item => (
              <div key={item.label} className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="text-xs text-blue-300 uppercase tracking-wider font-semibold mb-2">{item.label}</div>
                {item.href ? (
                  <a href={item.href} className="text-sm text-white font-semibold hover:text-orange-300 transition-colors">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm text-slate-200 leading-relaxed">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Case studies ──────────────────────────────────────────── */}
      {caseStudies.length > 0 && (
        <section className="bg-white py-20 sm:py-24 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4 animate-fade-in-up">
              <div>
                <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-3 border border-teal-100">
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
              <Link href="/case-studies" className="text-sm font-bold text-[#1d5fa1] hover:underline">
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
                    <div className="mt-3 inline-flex items-center text-xs font-bold text-teal-700 gap-1 group-hover:gap-2 transition-all">
                      Read case study <span>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Blog teaser ───────────────────────────────────────────── */}
      {blogPosts.length > 0 && (
        <section className="bg-gradient-to-br from-slate-50 to-blue-50/30 py-20 sm:py-24 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10 flex-wrap gap-4 animate-fade-in-up">
              <div>
                <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-3 border border-rose-100">
                  Latest insights
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  News, market commentary &amp; company updates.
                </h2>
              </div>
              <Link href="/blog" className="text-sm font-bold text-[#1d5fa1] hover:underline">
                Read all insights →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
              {blogPosts.map(post => (
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
                    <div className="mt-3 inline-flex items-center text-xs font-bold text-[#1d5fa1] gap-1 group-hover:gap-2 transition-all">
                      Read more <span>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Bottom CTA ────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-[#1a5490] via-[#1d5fa1] to-[#155187] p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl shadow-blue-900/20 animate-scale-in">
          {/* Decorative overlays */}
          <div aria-hidden="true" className="absolute inset-0 bg-grid-pattern opacity-25" />
          <div aria-hidden="true" className="absolute -top-12 -right-12 text-[260px] opacity-[0.06] select-none pointer-events-none">
            🌍
          </div>
          <div aria-hidden="true" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[320px] h-[160px] rounded-full opacity-25 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #FF632155 0%, transparent 70%)' }} />

          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-white/20">
              24-hour SLA
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
              Have a sourcing requirement?
            </h2>
            <p className="text-blue-100/90 text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Submit one RFQ — we'll come back within 24 hours with priced FOB / CIF /
              CFR options across every Egyptian loading port.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/rfq"
                className="inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-black/20 transition-all hover:-translate-y-1 hover:shadow-xl">
                📋 Get Your Quote
              </Link>
              <Link href="/contact"
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold px-8 py-4 rounded-xl border border-white/25 transition-all hover:-translate-y-0.5">
                Talk to our team →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
