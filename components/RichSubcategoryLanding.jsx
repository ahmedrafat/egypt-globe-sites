/**
 * RichSubcategoryLanding — Pelot-style layout for any
 * /products/<division>/<subcat> landing.
 *
 * Layout:
 *   1. Compact hero (light editorial edition — white with a soft
 *      division-colour glow), breadcrumb, chip rail (sub-cat icon, SKU
 *      count, HS-prefix from first SKU), dual CTA, stats strip
 *   2. SKU catalogue grid (rich cards)
 *   3. Applications served (across the SKUs in this sub-cat)
 *   4. Related sub-categories (other sub-cats in same division)
 *   5. Bottom CTA
 *
 * Design tokens + utilities (.egg-*) live in app/globals.css.
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

  // Accent tone — pulls from division color
  const tone = division.color

  return (
    <article className="bg-white text-[#14161a]">
      {/* Hero — white editorial banner with division-colour glow */}
      <section className="relative overflow-hidden bg-white border-b border-[#14161a]/10">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(55% 55% at 88% 0%, ${tone}24, transparent 60%), radial-gradient(40% 45% at 0% 100%, rgba(255,99,33,.08), transparent 60%)` }} />
        <div aria-hidden="true" className="absolute -right-10 -top-16 text-[240px] leading-none opacity-[0.06] select-none pointer-events-none">{division.icon}</div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 sm:py-20">
          <nav className="flex items-center gap-2 text-xs text-[#7a8290] mb-5 flex-wrap animate-fade-in">
            <Link href="/" className="hover:text-[#14161a] transition-colors">Home</Link>
            <span>›</span>
            <Link href="/products" className="hover:text-[#14161a] transition-colors">Products</Link>
            <span>›</span>
            <Link href={division.path} className="hover:text-[#14161a] transition-colors">{division.label}</Link>
            <span>›</span>
            <span className="text-[#14161a] font-medium">{page.title}</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in-up">
            <span className="egg-chip text-xs" style={{ color: tone, boxShadow: `inset 0 0 0 1px ${tone}66` }}>
              {division.icon} {division.label}
            </span>
            <span className="egg-chip text-xs">
              {(skus || []).length} {(skus || []).length === 1 ? 'SKU' : 'SKUs'}
            </span>
            {sampleHs && (
              <span className="egg-chip font-mono text-[11px] text-[#5b6472]">
                HS {sampleHs}
              </span>
            )}
            <span className="egg-chip text-xs font-mono tracking-[0.08em]">
              FOB · CIF · CFR
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h1 className="egg-display text-4xl sm:text-5xl lg:text-6xl text-[#14161a] mb-4 leading-[1.02]">
                {page.title}
              </h1>
              {page.description && (
                <p className="text-base sm:text-lg leading-relaxed max-w-3xl text-[#3f4650]">
                  {page.description}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
                className="egg-btn-primary">
                📋 Get Quote
              </Link>
              <Link href={division.path}
                className="egg-btn-ghost">
                ← Back to {division.label}
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden ring-1 ring-[#14161a]/10 bg-[#14161a]/10 stagger-children">
            {[
              { big: String((skus || []).length), label: 'SKUs in this sub-category' },
              { big: certList.length > 0 ? String(certList.length) : '—', label: 'Certifications & standards' },
              { big: apps.length > 0 ? String(apps.length) : '—', label: 'Applications served' },
              { big: '7', label: 'Loading ports' },
            ].map(s => (
              <div key={s.label} className="bg-white/90 backdrop-blur px-5 py-5">
                <div className="egg-display text-3xl sm:text-4xl tracking-tight" style={{ color: tone }}>{s.big}</div>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#7a8290] mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKU catalogue */}
      {(skus || []).length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 egg-reveal">
          <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
            <div>
              <div className="egg-eyebrow text-[#0b8f84] mb-3">
                Catalogue
              </div>
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">
                {(skus || []).length} {(skus || []).length === 1 ? 'product' : 'products'} ready for export
              </h2>
            </div>
            <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
              className="egg-link text-sm">
              Quote any combination →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {skus.map(p => (
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
                  {p.specs?.nacl_min && (
                    <div className="text-xs font-mono text-[#5b6472] mt-1.5">NaCl {p.specs.nacl_min}</div>
                  )}
                  {p.price_indication && visibility?.showPrices ? (
                    <p className="text-xs text-[#d9501a] font-semibold mt-1.5 line-clamp-1">{p.price_indication}</p>
                  ) : p.certifications?.length > 0 ? (
                    <div className="text-xs text-[#7a8290] mt-1.5 line-clamp-1">{p.certifications.slice(0, 3).join(' · ')}</div>
                  ) : null}
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
              <div className="egg-eyebrow text-[#7c3aed] justify-center mb-3">
                {page.title} by Industry
              </div>
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">
                {apps.length} application{apps.length === 1 ? '' : 's'} served by this sub-category.
              </h2>
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

      {/* Certifications strip */}
      {certList.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 egg-reveal">
          <div className="egg-panel p-6 sm:p-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="text-2xl">🏅</div>
              <div>
                <h3 className="font-semibold text-[#14161a] text-lg">Certifications & Standards</h3>
                <p className="text-sm text-[#7a8290] mt-0.5">All shipments ship with per-batch CoA + paperwork ready for these standards.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {certList.map(c => (
                <span key={c} className="egg-chip text-xs text-[#0b8f84]" style={{ boxShadow: 'inset 0 0 0 1px rgba(15,181,165,.45)' }}>
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related sub-categories in same division */}
      {(siblingSubcats || []).length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 egg-reveal">
          <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-2">
            Other sub-categories in {division.label}
          </h2>
          <p className="text-[#3f4650] mb-8">Browse related products across {division.label.toLowerCase()}.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {siblingSubcats.map(sc => (
              <Link key={sc.id} href={sc.path}
                className="egg-card group overflow-hidden">
                <div className="aspect-[16/9] rounded-t-2xl"
                  style={{ background: `linear-gradient(135deg, ${tone}1a, ${tone}08)` }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl opacity-30">{division.icon}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#14161a] group-hover:text-[#0b8f84] transition-colors text-sm">
                    {sc.title}
                  </h3>
                  {sc.sku_count > 0 && (
                    <div className="text-xs text-[#7a8290] mt-1">{sc.sku_count} {sc.sku_count === 1 ? 'SKU' : 'SKUs'}</div>
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
            Need a custom {page.title.toLowerCase()} blend?
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
