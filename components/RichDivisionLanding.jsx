/**
 * RichDivisionLanding — Pelot-style landing layout for any product
 * division (fertilizers / chemicals / construction / agro / minerals /
 * metals — and salt has its own dedicated app/products/salt/page.jsx).
 *
 * Layout mirrors the salt main page:
 *   1. Full-bleed brand-coloured hero with chip rail + dual CTAs
 *   2. Stat strip (SKUs / sub-cats / ports / markets)
 *   3. Sub-categories grid — one card per sub-category with cover,
 *      SKU count, "Browse" link
 *   4. Why Egypt Globe — 4 value-prop cards
 *   5. Featured SKU catalogue (top 8 across all sub-cats)
 *   6. Bottom CTA banner
 */
import Link from 'next/link'

const STAT_LABELS = {
  skus:    'SKUs in catalogue',
  subcats: 'Sub-categories',
  ports:   'Loading ports',
  markets: '60+',
}

export default function RichDivisionLanding({ page, division, subcategories, featured, allDivisionPages }) {
  const skuCount    = (allDivisionPages || []).filter(p => /\/products\/[a-z-]+\/[a-z0-9-]+\/[a-z0-9-]+$/.test(p.path)).length
  const subCount    = subcategories?.length || 0
  const heroBg      = `linear-gradient(135deg, ${division.color} 0%, ${division.color}cc 50%, #0f1f3a 100%)`
  const tile        = (b, l) => ({ big: b, label: l })
  const stats = [
    tile(String(skuCount), 'SKUs in catalogue'),
    tile(String(subCount), 'Sub-categories'),
    tile('7', 'Loading ports'),
    tile('60+', 'Destination markets'),
  ]

  return (
    <article>
      {/* Hero */}
      <section className="relative overflow-hidden text-white"
        style={{ background: heroBg }}>
        <div aria-hidden="true" className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full"
            style={{ background: `radial-gradient(circle, white 0%, transparent 70%)` }} />
          <div className="absolute -bottom-32 -left-24 w-[500px] h-[500px] rounded-full"
            style={{ background: `radial-gradient(circle, rgba(255,99,33,0.25) 0%, transparent 70%)` }} />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-30" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-5 flex-wrap animate-fade-in">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>›</span>
            <span className="text-white/80">{division.label}</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in-up">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              {division.icon} {division.label}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              {skuCount} SKUs
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              {subCount} sub-categories
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              FOB · CIF · CFR
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-[1.05] drop-shadow-sm">
                {division.label}
                <span className="block text-white/80 text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">
                  {division.blurb}
                </span>
              </h1>
              {page.description && (
                <p className="text-base sm:text-lg leading-relaxed max-w-3xl text-white/80 mt-5">
                  {page.description}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
                className="inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5">
                📋 Get Quote
              </Link>
              <Link href="/services/logistics"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold border border-white/20 px-5 py-3 rounded-xl transition-colors">
                Logistics →
              </Link>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
            {stats.map(s => (
              <div key={s.label} className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 px-5 py-5">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{s.big}</div>
                <div className="text-xs text-white/70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-categories grid */}
      {subCount > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 scroll-reveal">
          <div className="text-center mb-10">
            <div className="inline-block bg-blue-50 text-[#1d5fa1] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              Browse the catalogue
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              {subCount} sub-categories — pick your commodity
            </h2>
            <p className="text-slate-600 max-w-3xl mx-auto">
              Each sub-category has its own technical-spec window, certifications and tender language.
              Click any card to see the full SKU lineup.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {subcategories.map(sc => (
              <Link key={sc.id} href={sc.path}
                className="card-lift group rounded-3xl border border-slate-200 bg-white overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden relative"
                  style={{ background: `linear-gradient(135deg, ${division.color}15, ${division.color}05)` }}>
                  {sc.hero_photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={sc.hero_photo_url} alt={sc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-7xl opacity-30">{division.icon}</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    {sc.sku_count} {sc.sku_count === 1 ? 'SKU' : 'SKUs'}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1d5fa1] transition-colors">
                    {sc.title}
                  </h3>
                  {sc.description && (
                    <p className="text-sm text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">{sc.description}</p>
                  )}
                  <div className="mt-3 inline-flex items-center text-sm font-semibold text-[#1d5fa1] group-hover:gap-2 gap-1 transition-all">
                    Browse {sc.title.toLowerCase()} <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Why Egypt Globe */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50/40 py-16 sm:py-20 border-y border-slate-200 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-block bg-orange-50 text-[#FF6321] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              Why Egypt Globe
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Egyptian-origin {division.label.toLowerCase()} done the right way.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
            {[
              { ico: '🇪🇬', t: 'Egyptian-origin verified',  b: 'Direct producer relationships across Egypt — short, traceable supply chain with EUR1 + Certificate of Origin paperwork.' },
              { ico: '🚢', t: '7-port loading flexibility', b: 'Damietta · Port Said East · Alexandria · El-Dekheila · Ain Sokhna · Safaga · Al-Arish — closest-to-source routing.' },
              { ico: '🧪', t: 'Per-shipment QC',            b: 'Independent SGS / Intertek / Bureau Veritas inspection on request. Per-batch CoA on every consignment.' },
              { ico: '⚡', t: '24-hour quote SLA',           b: 'Submit RFQ today, priced FOB / CIF / CFR offer by tomorrow. Standardised L/C-bank document set on order.' },
            ].map(c => (
              <div key={c.t} className="card-lift bg-white border border-slate-200 rounded-2xl p-6">
                <div className="text-4xl mb-3">{c.ico}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{c.t}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured catalogue */}
      {(featured || []).length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 scroll-reveal">
          <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
            <div>
              <div className="inline-block bg-blue-50 text-[#1d5fa1] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                Featured Products
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Recently shipped from this division.
              </h2>
            </div>
            <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
              className="text-sm font-semibold text-[#1d5fa1] hover:underline">
              Quote any combination →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {featured.slice(0, 8).map(p => (
              <Link key={p.id} href={p.path}
                className="card-lift group rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${division.color}15, transparent)` }}>
                  {p.hero_photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.hero_photo_url} alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
                      {division.icon}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {p.hs_code && (
                    <div className="text-[10px] font-mono uppercase font-bold text-slate-400 mb-1">HS {p.hs_code}</div>
                  )}
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-[#1d5fa1] transition-colors min-h-[2.5em]">
                    {p.title}
                  </h3>
                  {p.price_indication && (
                    <p className="text-xs text-[#FF6321] font-semibold mt-1.5 line-clamp-1">{p.price_indication}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden shadow-2xl shadow-blue-900/15 animate-scale-in"
          style={{ background: `linear-gradient(135deg, ${division.color}, ${division.color}99 60%, #0f1f3a)` }}>
          <div aria-hidden="true" className="absolute -top-12 -right-12 text-[280px] opacity-10 select-none">{division.icon}</div>
          <h2 className="relative text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Need a custom blend or tender match?
          </h2>
          <p className="relative text-white/80 text-lg mb-7 max-w-2xl mx-auto">
            Combine grades, blend specs, match a tender — we'll come back within 24 hours
            with a priced FOB / CIF / CFR offer.
          </p>
          <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
            className="relative inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5">
            📋 Request a Quote
          </Link>
        </div>
      </section>
    </article>
  )
}
