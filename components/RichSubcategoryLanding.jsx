/**
 * RichSubcategoryLanding — Pelot-style layout for any
 * /products/<division>/<subcat> landing.
 *
 * Layout:
 *   1. Compact hero with division-coloured gradient, breadcrumb,
 *      chip rail (sub-cat icon, SKU count, HS-prefix from first SKU),
 *      dual CTA, stats strip
 *   2. SKU catalogue grid (rich cards)
 *   3. Applications served (across the SKUs in this sub-cat)
 *   4. Related sub-categories (other sub-cats in same division)
 *   5. Bottom CTA
 */
import Link from 'next/link'
import { APPLICATIONS } from '../lib/corporatePages'

const APP_BY_ID = Object.fromEntries(APPLICATIONS.map(a => [a.id, a]))

export default function RichSubcategoryLanding({ page, division, skus, siblingSubcats, visibility }) {
  // Aggregate apps + certifications across SKUs
  const appIds = new Set()
  const certs = new Set()
  let totalMoq = 0
  let withPrice = 0
  for (const p of (skus || [])) {
    for (const a of (p.applications || [])) appIds.add(a)
    for (const c of (p.certifications || [])) certs.add(c)
    if (p.price_indication) withPrice++
  }
  const apps = [...appIds].map(id => APP_BY_ID[id]).filter(Boolean)
  const certList = [...certs].slice(0, 8)
  const sampleHs = (skus || []).find(s => s.hs_code)?.hs_code

  // Hero gradient — pulls from division color
  const heroBg = `linear-gradient(135deg, ${division.color} 0%, ${division.color}cc 50%, #0f1f3a 100%)`

  return (
    <article>
      {/* Hero */}
      <section className="relative overflow-hidden text-white" style={{ background: heroBg }}>
        <div aria-hidden="true" className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-25" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <nav className="flex items-center gap-2 text-xs text-white/60 mb-5 flex-wrap animate-fade-in">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>›</span>
            <Link href={division.path} className="hover:text-white">{division.label}</Link>
            <span>›</span>
            <span className="text-white/90">{page.title}</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in-up">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              {division.icon} {division.label}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              {(skus || []).length} {(skus || []).length === 1 ? 'SKU' : 'SKUs'}
            </span>
            {sampleHs && (
              <span className="inline-flex items-center text-[11px] font-mono font-bold px-3 py-1.5 rounded-full bg-white/10 text-white/90 border border-white/15">
                HS {sampleHs}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              FOB · CIF · CFR
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-[1.05] drop-shadow-sm">
                {page.title}
              </h1>
              {page.description && (
                <p className="text-base sm:text-lg leading-relaxed max-w-3xl text-white/80">
                  {page.description}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
                className="inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5">
                📋 Get Quote
              </Link>
              <Link href={division.path}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold border border-white/20 px-5 py-3 rounded-xl transition-colors">
                ← Back to {division.label}
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
            {[
              { big: String((skus || []).length), label: 'SKUs in this sub-category' },
              { big: certList.length > 0 ? String(certList.length) : '—', label: 'Certifications & standards' },
              { big: apps.length > 0 ? String(apps.length) : '—', label: 'Applications served' },
              { big: '7', label: 'Loading ports' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 px-5 py-5">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{s.big}</div>
                <div className="text-xs text-white/70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKU catalogue */}
      {(skus || []).length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 scroll-reveal">
          <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
            <div>
              <div className="inline-block bg-blue-50 text-[#1d5fa1] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                Catalogue
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {(skus || []).length} {(skus || []).length === 1 ? 'product' : 'products'} ready for export
              </h2>
            </div>
            <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
              className="text-sm font-semibold text-[#1d5fa1] hover:underline">
              Quote any combination →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {skus.map(p => (
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
                  {p.specs?.nacl_min && (
                    <div className="text-xs font-mono text-slate-500 mt-1.5">NaCl {p.specs.nacl_min}</div>
                  )}
                  {p.price_indication && visibility?.showPrices ? (
                    <p className="text-xs text-[#FF6321] font-semibold mt-1.5 line-clamp-1">{p.price_indication}</p>
                  ) : p.certifications?.length > 0 ? (
                    <div className="text-xs text-slate-500 mt-1.5 line-clamp-1">{p.certifications.slice(0, 3).join(' · ')}</div>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Applications served */}
      {apps.length > 0 && (
        <section className="bg-gradient-to-br from-violet-50/50 via-white to-blue-50/50 py-16 sm:py-20 border-y border-slate-200 scroll-reveal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <div className="inline-block bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                {page.title} by Industry
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                {apps.length} application{apps.length === 1 ? '' : 's'} served by this sub-category.
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
              {apps.map(a => (
                <Link key={a.id} href={a.path}
                  className="card-lift group rounded-2xl border border-slate-200 bg-white p-5 text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-3xl mb-3 bg-gradient-to-br from-violet-100 to-blue-100">
                    {a.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-[#1d5fa1] transition-colors text-sm">
                    {a.label}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications strip */}
      {certList.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-reveal">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="text-2xl">🏅</div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Certifications & Standards</h3>
                <p className="text-sm text-slate-500 mt-0.5">All shipments ship with per-batch CoA + paperwork ready for these standards.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {certList.map(c => (
                <span key={c} className="inline-flex items-center text-xs font-semibold bg-white text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full">
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related sub-categories in same division */}
      {(siblingSubcats || []).length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-reveal">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Other sub-categories in {division.label}
          </h2>
          <p className="text-slate-600 mb-8">Browse related products across {division.label.toLowerCase()}.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {siblingSubcats.map(sc => (
              <Link key={sc.id} href={sc.path}
                className="card-lift group rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <div className="aspect-[16/9]"
                  style={{ background: `linear-gradient(135deg, ${division.color}1a, ${division.color}05)` }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl opacity-30">{division.icon}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 group-hover:text-[#1d5fa1] transition-colors text-sm">
                    {sc.title}
                  </h3>
                  {sc.sku_count > 0 && (
                    <div className="text-xs text-slate-500 mt-1">{sc.sku_count} {sc.sku_count === 1 ? 'SKU' : 'SKUs'}</div>
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
            Need a custom {page.title.toLowerCase()} blend?
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
