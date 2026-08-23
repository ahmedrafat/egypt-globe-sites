/**
 * RichDivisionLanding — landing layout for any product division
 * (fertilizers / chemicals / construction / agro / minerals / metals —
 * salt has its own dedicated app/products/salt/page.jsx).
 *
 * Layout (2026-08-23 "Quality at the Core" edition):
 *   1. White editorial hero with division-colour glow, chip rail, dual CTA
 *   2. Stat strip (SKUs / sub-cats / ports / markets)
 *   3. Quality-at-the-Core strip — the four QA non-negotiables
 *   4. Division body (body_markdown → RichPageBody: technical narrative,
 *      specification tables, QA verification chain, standards)
 *   5. Sub-categories grid
 *   6. Applications served
 *   7. Why Egypt Globe — 4 value-prop cards
 *   8. Featured SKU catalogue
 *   9. Bottom CTA
 *
 * Vector protocol: monochrome micro-icons only (components/ui/Icon) —
 * no emoji, no watermark glyphs.
 */
import HeroMotif from './HeroMotif'
import Link from 'next/link'
import { APPLICATIONS } from '../lib/corporatePages'
import RichPageBody from './RichPageBody'
import Icon, { DIVISION_ICON, APPLICATION_ICON } from './ui/Icon'
import QualityStrip from './QualityStrip'

const APP_BY_ID = Object.fromEntries(APPLICATIONS.map(a => [a.id, a]))

export default function RichDivisionLanding({ page, division, subcategories, featured, allDivisionPages, visibility }) {
  const appIds = new Set()
  for (const p of (allDivisionPages || [])) {
    for (const a of (p.applications || [])) appIds.add(a)
  }
  const apps = [...appIds].map(id => APP_BY_ID[id]).filter(Boolean)

  const skuCount = (allDivisionPages || []).filter(p => /\/products\/[a-z-]+\/[a-z0-9-]+\/[a-z0-9-]+$/.test(p.path)).length
  const subCount = subcategories?.length || 0
  const tone     = division.color
  const divIcon  = DIVISION_ICON[division.id] || 'box'
  const stats = [
    { big: String(skuCount), label: 'SKUs in catalogue' },
    { big: String(subCount), label: 'Sub-categories' },
    { big: '7', label: 'Loading ports' },
    { big: '100%', label: 'Lots CoA-verified before B/L' },
  ]

  return (
    <article className="bg-white text-[#14161a]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-[#14161a]/10">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        <HeroMotif category={page.category} path={page.path} tone={tone} />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(60% 55% at 88% 0%, ${tone}26, transparent 60%), radial-gradient(45% 45% at 0% 100%, rgba(255,99,33,.10), transparent 60%)` }} />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-24">
          <nav className="flex items-center gap-2 text-xs text-[#7a8290] mb-5 flex-wrap animate-fade-in">
            <Link href="/" className="hover:text-[#14161a] transition-colors">Home</Link>
            <span>›</span>
            <Link href="/products" className="hover:text-[#14161a] transition-colors">Products</Link>
            <span>›</span>
            <span className="text-[#14161a] font-medium">{division.label}</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in-up">
            <span className="egg-chip text-xs" style={{ color: tone, boxShadow: `inset 0 0 0 1px ${tone}66` }}>
              <Icon name={divIcon} className="w-3.5 h-3.5" /> {division.label}
            </span>
            <span className="egg-chip text-xs">{skuCount} SKUs</span>
            <span className="egg-chip text-xs">{subCount} sub-categories</span>
            <span className="egg-chip text-xs font-mono tracking-[0.08em]">FOB · CIF · CFR</span>
            <span className="egg-chip text-xs text-[#0b8f84]" style={{ boxShadow: 'inset 0 0 0 1px rgba(15,181,165,.45)' }}>
              <Icon name="shield" className="w-3.5 h-3.5" /> Per-lot CoA
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h1 className="egg-display text-4xl sm:text-5xl lg:text-6xl text-[#14161a] mb-4 leading-[1.02]">
                {division.label}
                <span className="block text-[#3f4650] text-2xl sm:text-3xl lg:text-4xl italic mt-3 leading-[1.15]">
                  {division.blurb}
                </span>
              </h1>
              {page.description && (
                <p className="text-base sm:text-lg leading-relaxed max-w-3xl text-[#3f4650] mt-5">
                  {page.description}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Link href={`/rfq?product=${encodeURIComponent(page.path)}`} className="egg-btn-primary">
                Get Quote
              </Link>
              <Link href="/services/logistics" className="egg-btn-ghost">
                Logistics →
              </Link>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden ring-1 ring-[#14161a]/10 bg-[#14161a]/10 stagger-children">
            {stats.map(s => (
              <div key={s.label} className="bg-white/90 backdrop-blur px-5 py-5">
                <div className="egg-display text-3xl sm:text-4xl tracking-tight" style={{ color: tone }}>{s.big}</div>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#7a8290] mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality at the Core */}
      <QualityStrip division={division.label} />

      {/* Division body — technical narrative + specification tables */}
      {page.body_markdown && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 sm:py-20 egg-reveal">
          <RichPageBody content={page.body_markdown} title={page.title} />
        </section>
      )}

      {/* Sub-categories grid */}
      {subCount > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-[#14161a]/10 egg-reveal">
          <div className="text-center mb-10">
            <div className="egg-eyebrow text-[#0b8f84] justify-center mb-3">Browse the catalogue</div>
            <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">
              {subCount} sub-categories — pick your commodity
            </h2>
            <p className="text-[#3f4650] max-w-3xl mx-auto">
              Each sub-category carries its own specification window, certifications and tender language,
              and every SKU inside it ships on a per-lot Certificate of Analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {subcategories.map(sc => (
              <Link key={sc.id} href={sc.path} className="egg-card group overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden relative rounded-t-2xl"
                  style={{ background: `linear-gradient(135deg, ${tone}1a, ${tone}08)` }}>
                  {sc.hero_photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={sc.hero_photo_url} alt={sc.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#14161a]/20">
                      <Icon name={divIcon} className="w-12 h-12" strokeWidth={1.25} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 egg-chip bg-white/95 backdrop-blur text-[#14161a] text-xs shadow-sm">
                    {sc.sku_count} {sc.sku_count === 1 ? 'SKU' : 'SKUs'}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-[#14161a] group-hover:text-[#0b8f84] transition-colors">{sc.title}</h3>
                  {sc.description && (
                    <p className="text-sm text-[#3f4650] mt-1.5 line-clamp-2 leading-relaxed">{sc.description}</p>
                  )}
                  <div className="mt-3 inline-flex items-center text-sm font-semibold text-[#0b8f84] group-hover:gap-2 gap-1 transition-all">
                    Browse {sc.title.toLowerCase()} <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Applications served */}
      {apps.length > 0 && (
        <section className="bg-[#f9fafb] py-16 sm:py-20 border-y border-[#14161a]/10 egg-reveal">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="egg-eyebrow text-[#7c3aed] justify-center mb-3">{division.label} by industry</div>
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">
                {apps.length} application{apps.length === 1 ? '' : 's'} served from this division.
              </h2>
              <p className="text-[#3f4650] max-w-3xl mx-auto">
                Each industry has its own specification window, certifications and tender language.
                Select one to see the SKUs matched to it.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
              {apps.map(a => (
                <Link key={a.id} href={a.path} className="egg-card group p-5 text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 ring-1 ring-[#14161a]/15 text-[#14161a] group-hover:ring-[#7c3aed]/60 transition-colors">
                    <Icon name={APPLICATION_ICON[a.id] || 'factory'} className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-[#14161a] group-hover:text-[#0b8f84] transition-colors text-sm">{a.label}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Egypt Globe */}
      <section className="bg-white py-16 sm:py-20 border-b border-[#14161a]/10 egg-reveal">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="egg-eyebrow text-[#d9501a] justify-center mb-3">Why Egypt Globe</div>
            <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">
              Institutional reliability in Egyptian-origin {division.label.toLowerCase()}.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
            {[
              { ico: 'pin',    t: 'Egyptian-origin, traceable',  b: 'Direct producer relationships across Egypt — a short, audited supply chain with EUR.1 / PAFTA / COMESA Certificate of Origin on every shipment.' },
              { ico: 'anchor', t: '7-port loading, own teams',    b: 'Damietta · Port Said East · Alexandria · El Dekheila · Ain Sokhna · Safaga · Al-Arish — closest-to-source routing with resident EGG stevedoring, agency and port-QC teams.' },
              { ico: 'shield', t: 'Per-lot QA before B/L',        b: 'Port-laboratory analysis and Certificate of Analysis on every lot before the Bill of Lading; TÜV Austria / SGS / Intertek / Bureau Veritas pre-shipment inspection on request.' },
              { ico: 'clock',  t: '24-hour quote SLA',            b: 'Submit an RFQ today, receive a priced FOB / CIF / CFR offer, sample CoA and inspection protocol tomorrow. Standardised L/C-bank document set on order.' },
            ].map(c => (
              <div key={c.t} className="egg-panel p-6">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-lg ring-1 ring-[#14161a]/15 text-[#14161a] mb-4">
                  <Icon name={c.ico} className="w-5 h-5" />
                </span>
                <h3 className="font-semibold text-[#14161a] text-lg mb-2">{c.t}</h3>
                <p className="text-sm text-[#3f4650] leading-relaxed">{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured catalogue */}
      {(featured || []).length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 egg-reveal">
          <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
            <div>
              <div className="egg-eyebrow text-[#0b8f84] mb-3">Featured products</div>
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">Recently shipped from this division.</h2>
            </div>
            <Link href={`/rfq?product=${encodeURIComponent(page.path)}`} className="egg-link text-sm">
              Quote any combination →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {featured.slice(0, 8).map(p => (
              <Link key={p.id} href={p.path} className="egg-card group overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden rounded-t-2xl"
                  style={{ background: `linear-gradient(135deg, ${tone}1a, #f9fafb)` }}>
                  {p.hero_photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.hero_photo_url} alt={p.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#14161a]/20">
                      <Icon name={divIcon} className="w-10 h-10" strokeWidth={1.25} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {p.hs_code && (
                    <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8a93a3] mb-1">HS {p.hs_code}</div>
                  )}
                  <h3 className="text-sm font-semibold text-[#14161a] line-clamp-2 group-hover:text-[#0b8f84] transition-colors min-h-[2.5em]">
                    {p.title}
                  </h3>
                  {p.price_indication && visibility?.showPrices && (
                    <p className="text-xs text-[#d9501a] font-semibold mt-1.5 line-clamp-1">{p.price_indication}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 egg-reveal">
        <div className="egg-panel p-10 sm:p-14 text-center relative overflow-hidden animate-scale-in">
          <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-60 pointer-events-none" />
          <h2 className="egg-display relative text-3xl sm:text-4xl text-[#14161a] mb-3">
            Need a tender match or a custom specification?
          </h2>
          <p className="relative text-[#3f4650] text-lg mb-7 max-w-2xl mx-auto">
            Send the specification, tonnage and destination — a priced FOB / CIF / CFR offer with a sample
            Certificate of Analysis and the applicable inspection protocol comes back within 24 hours.
          </p>
          <Link href={`/rfq?product=${encodeURIComponent(page.path)}`} className="egg-btn-primary relative px-8 py-4">
            Request a Quote
          </Link>
        </div>
      </section>
    </article>
  )
}
