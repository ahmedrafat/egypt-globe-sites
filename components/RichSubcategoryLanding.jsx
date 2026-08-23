/**
 * RichSubcategoryLanding — layout for any /products/<division>/<subcat>
 * landing (2026-08-23 "Quality at the Core" edition).
 *
 * Layout:
 *   1. Compact white hero, breadcrumb, chip rail, dual CTA, stats strip
 *   2. Sub-category body (body_markdown → RichPageBody: technical
 *      narrative, specification tables, QA verification chain)
 *   3. SKU catalogue grid
 *   4. Applications served
 *   5. Certifications strip
 *   6. Related sub-categories
 *   7. Bottom CTA
 *
 * Vector protocol: monochrome micro-icons only — no emoji, no watermarks.
 */
import HeroMotif from './HeroMotif'
import Link from 'next/link'
import { APPLICATIONS } from '../lib/corporatePages'
import RichPageBody from './RichPageBody'
import Icon, { DIVISION_ICON, APPLICATION_ICON } from './ui/Icon'

const APP_BY_ID = Object.fromEntries(APPLICATIONS.map(a => [a.id, a]))

export default function RichSubcategoryLanding({ page, division, skus, siblingSubcats, visibility }) {
  const appIds = new Set()
  const certs = new Set()
  for (const p of (skus || [])) {
    for (const a of (p.applications || [])) appIds.add(a)
    for (const c of (p.certifications || [])) certs.add(c)
  }
  const apps = [...appIds].map(id => APP_BY_ID[id]).filter(Boolean)
  const certList = [...certs].slice(0, 8)
  const sampleHs = (skus || []).find(s => s.hs_code)?.hs_code
  const tone = division.color
  const divIcon = DIVISION_ICON[division.id] || 'box'
  const n = (skus || []).length

  return (
    <article className="bg-white text-[#14161a]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white border-b border-[#14161a]/10">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        <HeroMotif category={page.category} path={page.path} tone={tone} />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(55% 55% at 88% 0%, ${tone}24, transparent 60%), radial-gradient(40% 45% at 0% 100%, rgba(255,99,33,.08), transparent 60%)` }} />

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
              <Icon name={divIcon} className="w-3.5 h-3.5" /> {division.label}
            </span>
            <span className="egg-chip text-xs">{n} {n === 1 ? 'SKU' : 'SKUs'}</span>
            {sampleHs && <span className="egg-chip font-mono text-[11px] text-[#5b6472]">HS {sampleHs}</span>}
            <span className="egg-chip text-xs font-mono tracking-[0.08em]">FOB · CIF · CFR</span>
            <span className="egg-chip text-xs text-[#0b8f84]" style={{ boxShadow: 'inset 0 0 0 1px rgba(15,181,165,.45)' }}>
              <Icon name="shield" className="w-3.5 h-3.5" /> Per-lot CoA
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h1 className="egg-display text-4xl sm:text-5xl lg:text-6xl text-[#14161a] mb-4 leading-[1.02]">{page.title}</h1>
              {page.description && (
                <p className="text-base sm:text-lg leading-relaxed max-w-3xl text-[#3f4650]">{page.description}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Link href={`/rfq?product=${encodeURIComponent(page.path)}`} className="egg-btn-primary">Get Quote</Link>
              <Link href={division.path} className="egg-btn-ghost">← Back to {division.label}</Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden ring-1 ring-[#14161a]/10 bg-[#14161a]/10 stagger-children">
            {[
              { big: String(n), label: 'SKUs in this sub-category' },
              { big: certList.length > 0 ? String(certList.length) : '—', label: 'Certifications & standards' },
              { big: apps.length > 0 ? String(apps.length) : '—', label: 'Applications served' },
              { big: '100%', label: 'Lots CoA-verified before B/L' },
            ].map(s => (
              <div key={s.label} className="bg-white/90 backdrop-blur px-5 py-5">
                <div className="egg-display text-3xl sm:text-4xl tracking-tight" style={{ color: tone }}>{s.big}</div>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#7a8290] mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sub-category body — technical narrative + specification tables */}
      {page.body_markdown && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 sm:py-20 egg-reveal">
          <RichPageBody content={page.body_markdown} title={page.title} />
        </section>
      )}

      {/* SKU catalogue */}
      {n > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 border-t border-[#14161a]/10 egg-reveal">
          <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
            <div>
              <div className="egg-eyebrow text-[#0b8f84] mb-3">Catalogue</div>
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">
                {n} {n === 1 ? 'product' : 'products'} ready for export
              </h2>
            </div>
            <Link href={`/rfq?product=${encodeURIComponent(page.path)}`} className="egg-link text-sm">Quote any combination →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {skus.map(p => (
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
                  {p.hs_code && <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8a93a3] mb-1">HS {p.hs_code}</div>}
                  <h3 className="text-sm font-semibold text-[#14161a] line-clamp-2 group-hover:text-[#0b8f84] transition-colors min-h-[2.5em]">{p.title}</h3>
                  {p.specs?.nacl_min && <div className="text-xs font-mono text-[#5b6472] mt-1.5">NaCl {p.specs.nacl_min}</div>}
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
              <div className="egg-eyebrow text-[#7c3aed] justify-center mb-3">{page.title} by industry</div>
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">
                {apps.length} application{apps.length === 1 ? '' : 's'} served by this sub-category.
              </h2>
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

      {/* Certifications strip */}
      {certList.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 egg-reveal">
          <div className="egg-panel p-6 sm:p-8">
            <div className="flex items-start gap-3 mb-4">
              <span className="inline-flex w-9 h-9 items-center justify-center rounded-lg bg-white ring-1 ring-[#14161a]/15 text-[#14161a]"><Icon name="shield" className="w-[18px] h-[18px]" /></span>
              <div>
                <h3 className="font-semibold text-[#14161a] text-lg">Certifications &amp; standards</h3>
                <p className="text-sm text-[#7a8290] mt-0.5">Every shipment carries a per-lot Certificate of Analysis and paperwork prepared for these standards.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {certList.map(c => (
                <span key={c} className="egg-chip text-xs text-[#0b8f84]" style={{ boxShadow: 'inset 0 0 0 1px rgba(15,181,165,.45)' }}>
                  <Icon name="check" className="w-3 h-3" strokeWidth={2.4} /> {c}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related sub-categories */}
      {(siblingSubcats || []).length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 egg-reveal">
          <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-2">Other sub-categories in {division.label}</h2>
          <p className="text-[#3f4650] mb-8">Browse related products across {division.label.toLowerCase()}.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {siblingSubcats.map(sc => (
              <Link key={sc.id} href={sc.path} className="egg-card group overflow-hidden">
                <div className="aspect-[16/9] rounded-t-2xl flex items-center justify-center text-[#14161a]/20"
                  style={{ background: `linear-gradient(135deg, ${tone}1a, ${tone}08)` }}>
                  <Icon name={divIcon} className="w-10 h-10" strokeWidth={1.25} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[#14161a] group-hover:text-[#0b8f84] transition-colors text-sm">{sc.title}</h3>
                  {sc.sku_count > 0 && <div className="text-xs text-[#7a8290] mt-1">{sc.sku_count} {sc.sku_count === 1 ? 'SKU' : 'SKUs'}</div>}
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
            Need a tender match for {page.title.toLowerCase()}?
          </h2>
          <p className="relative text-[#3f4650] text-lg mb-7 max-w-2xl mx-auto">
            Send the specification, tonnage and destination — a priced FOB / CIF / CFR offer with a sample
            Certificate of Analysis and inspection protocol comes back within 24 hours.
          </p>
          <Link href={`/rfq?product=${encodeURIComponent(page.path)}`} className="egg-btn-primary relative px-8 py-4">Request a Quote</Link>
        </div>
      </section>
    </article>
  )
}
