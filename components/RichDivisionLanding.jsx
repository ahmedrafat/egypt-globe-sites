/**
 * RichDivisionLanding — Pelot-style landing layout for any product
 * division (fertilizers / chemicals / construction / agro / minerals /
 * metals — and salt has its own dedicated app/products/salt/page.jsx).
 *
 * Layout mirrors the salt main page:
 *   1. Full-bleed hero (light editorial edition — white with a soft
 *      division-colour glow) with chip rail + dual CTAs
 *   2. Stat strip (SKUs / sub-cats / ports / markets)
 *   3. Sub-categories grid — one card per sub-category with cover,
 *      SKU count, "Browse" link
 *   4. Why Egypt Globe — 4 value-prop cards
 *   5. Featured SKU catalogue (top 8 across all sub-cats)
 *   6. Bottom CTA banner
 *
 * Design tokens + utilities (.egg-*) live in app/globals.css.
 */
import Link from 'next/link'
import { APPLICATIONS } from '../lib/corporatePages'

const APP_BY_ID = Object.fromEntries(APPLICATIONS.map(a => [a.id, a]))

const STAT_LABELS = {
  skus:    'SKUs in catalogue',
  subcats: 'Sub-categories',
  ports:   'Loading ports',
  markets: '60+',
}

export default function RichDivisionLanding({ page, division, subcategories, featured, allDivisionPages, visibility }) {
  // Collect unique applications across the division's SKUs
  const appIds = new Set()
  for (const p of (allDivisionPages || [])) {
    for (const a of (p.applications || [])) appIds.add(a)
  }
  const apps = [...appIds].map(id => APP_BY_ID[id]).filter(Boolean)

  const skuCount    = (allDivisionPages || []).filter(p => /\/products\/[a-z-]+\/[a-z0-9-]+\/[a-z0-9-]+$/.test(p.path)).length
  const subCount    = subcategories?.length || 0
  const tone        = division.color
  const tile        = (b, l) => ({ big: b, label: l })
  const stats = [
    tile(String(skuCount), 'SKUs in catalogue'),
    tile(String(subCount), 'Sub-categories'),
    tile('7', 'Loading ports'),
    tile('60+', 'Destination markets'),
  ]

  return (
    <article className="bg-white text-[#14161a]">
      {/* Hero — white editorial banner with division-colour glow */}
      <section className="relative overflow-hidden bg-white border-b border-[#14161a]/10">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(60% 55% at 88% 0%, ${tone}26, transparent 60%), radial-gradient(45% 45% at 0% 100%, rgba(255,99,33,.10), transparent 60%)` }} />
        <div aria-hidden="true" className="absolute -right-10 -top-16 text-[260px] leading-none opacity-[0.06] select-none pointer-events-none">{division.icon}</div>

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
              {division.icon} {division.label}
            </span>
            <span className="egg-chip text-xs">
              {skuCount} SKUs
            </span>
            <span className="egg-chip text-xs">
              {subCount} sub-categories
            </span>
            <span className="egg-chip text-xs font-mono tracking-[0.08em]">
              FOB · CIF · CFR
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
              <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
                className="egg-btn-primary">
                📋 Get Quote
              </Link>
              <Link href="/services/logistics"
                className="egg-btn-ghost">
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

      {/* Sub-categories grid */}
      {subCount > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 egg-reveal">
          <div className="text-center mb-10">
            <div className="egg-eyebrow text-[#0b8f84] justify-center mb-3">
              Browse the catalogue
            </div>
            <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">
              {subCount} sub-categories — pick your commodity
            </h2>
            <p className="text-[#3f4650] max-w-3xl mx-auto">
              Each sub-category has its own technical-spec window, certifications and tender language.
              Click any card to see the full SKU lineup.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {subcategories.map(sc => (
              <Link key={sc.id} href={sc.path}
                className="egg-card group overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden relative rounded-t-2xl"
                  style={{ background: `linear-gradient(135deg, ${tone}1a, ${tone}08)` }}>
                  {sc.hero_photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={sc.hero_photo_url} alt={sc.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-7xl opacity-30">{division.icon}</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 egg-chip bg-white/95 backdrop-blur text-[#14161a] text-xs shadow-sm">
                    {sc.sku_count} {sc.sku_count === 1 ? 'SKU' : 'SKUs'}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-[#14161a] group-hover:text-[#0b8f84] transition-colors">
                    {sc.title}
                  </h3>
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

      {/* Applications served (only renders when SKUs are app-tagged) */}
      {apps.length > 0 && (
        <section className="bg-[#f9fafb] py-16 sm:py-20 border-y border-[#14161a]/10 egg-reveal">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="egg-eyebrow text-[#7c3aed] justify-center mb-3">
                {division.label} by Industry
              </div>
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">
                {apps.length} application{apps.length === 1 ? '' : 's'} served from this division.
              </h2>
              <p className="text-[#3f4650] max-w-3xl mx-auto">
                Each industry has its own technical-spec window, certifications and tender language.
                Click any card to see SKUs matching that application.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
              {apps.map(a => (
                <Link key={a.id} href={a.path}
                  className="egg-card group p-5 text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-3xl mb-3 bg-[#f3f0ff] ring-1 ring-[#7c3aed]/25">
                    {a.icon}
                  </div>
                  <h3 className="font-semibold text-[#14161a] group-hover:text-[#0b8f84] transition-colors text-sm">
                    {a.label}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Egypt Globe */}
      <section className="bg-white py-16 sm:py-20 border-y border-[#14161a]/10 egg-reveal">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="egg-eyebrow text-[#d9501a] justify-center mb-3">
              Why Egypt Globe
            </div>
            <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">
              Egyptian-origin {division.label.toLowerCase()} done the right way.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
            {[
              { ico: '🇪🇬', t: 'Egyptian-origin verified',  b: 'Direct producer relationships across Egypt — short, traceable supply chain with EUR1 + Certificate of Origin paperwork.' },
              { ico: '🚢', t: '7-port loading flexibility', b: 'Damietta · Port Said East · Alexandria · El-Dekheila · Ain Sokhna · Safaga · Al-Arish — closest-to-source routing.' },
              { ico: '🧪', t: 'Per-shipment QC',            b: 'Independent TÜV Austria / SGS / Intertek / Bureau Veritas inspection on request. Per-batch CoA on every consignment.' },
              { ico: '⚡', t: '24-hour quote SLA',           b: 'Submit RFQ today, priced FOB / CIF / CFR offer by tomorrow. Standardised L/C-bank document set on order.' },
            ].map(c => (
              <div key={c.t} className="egg-panel p-6">
                <div className="text-4xl mb-3">{c.ico}</div>
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
              <div className="egg-eyebrow text-[#0b8f84] mb-3">
                Featured Products
              </div>
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">
                Recently shipped from this division.
              </h2>
            </div>
            <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
              className="egg-link text-sm">
              Quote any combination →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {featured.slice(0, 8).map(p => (
              <Link key={p.id} href={p.path}
                className="egg-card group overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden rounded-t-2xl"
                  style={{ background: `linear-gradient(135deg, ${tone}1a, #f9fafb)` }}>
                  {p.hero_photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.hero_photo_url} alt={p.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
                      {division.icon}
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
          <div aria-hidden="true" className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-40 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${tone} 0%, transparent 70%)` }} />
          <div aria-hidden="true" className="absolute -top-12 -right-12 text-[280px] opacity-[0.06] select-none pointer-events-none">{division.icon}</div>
          <h2 className="egg-display relative text-3xl sm:text-4xl text-[#14161a] mb-3">
            Need a custom blend or tender match?
          </h2>
          <p className="relative text-[#3f4650] text-lg mb-7 max-w-2xl mx-auto">
            Combine grades, blend specs, match a tender — we'll come back within 24 hours
            with a priced FOB / CIF / CFR offer.
          </p>
          <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
            className="egg-btn-primary relative px-8 py-4">
            📋 Request a Quote
          </Link>
        </div>
      </section>
    </article>
  )
}
