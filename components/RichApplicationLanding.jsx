/**
 * RichApplicationLanding — Pelot-style layout for /applications/<id>.
 *
 * Layout:
 *   1. Hero (light editorial edition — white with a soft violet glow)
 *      with breadcrumb, chip rail, dual CTA
 *   2. Stats strip (matching SKUs / standards / regions)
 *   3. Industry-specific markdown body
 *   4. Matched products grid
 *   5. Related applications
 *   6. Bottom CTA
 *
 * Design tokens + utilities (.egg-*) live in app/globals.css.
 */
import Link from 'next/link'
import RichPageBody from './RichPageBody'
import { APPLICATIONS, PRODUCT_DIVISIONS, CATEGORY_META } from '../lib/corporatePages'
import Icon, { DIVISION_ICON, APPLICATION_ICON } from './ui/Icon'

// Industry accent — violet, the applications colour across the site
const TONE = '#7c3aed'

export default function RichApplicationLanding({ page, application, products, siblingApps, visibility }) {
  // Aggregate certs across matched products
  const certs = new Set()
  for (const p of (products || [])) {
    for (const c of (p.certifications || [])) certs.add(c)
  }
  const certList = [...certs].slice(0, 12)

  return (
    <article className="bg-white text-[#14161a]">
      {/* Hero — white editorial banner with violet glow */}
      <section className="relative overflow-hidden bg-white border-b border-[#14161a]/10">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(55% 55% at 88% 0%, ${TONE}22, transparent 60%), radial-gradient(40% 45% at 0% 100%, rgba(255,99,33,.09), transparent 60%)` }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 sm:py-20">
          <nav className="flex items-center gap-2 text-xs text-[#7a8290] mb-5 flex-wrap animate-fade-in">
            <Link href="/" className="hover:text-[#14161a] transition-colors">Home</Link>
            <span>›</span>
            <Link href="/applications" className="hover:text-[#14161a] transition-colors">Applications</Link>
            <span>›</span>
            <span className="text-[#14161a] font-medium">{page.title}</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in-up">
            <span className="egg-chip text-xs" style={{ color: TONE, boxShadow: `inset 0 0 0 1px ${TONE}66` }}>
              <Icon name={APPLICATION_ICON[application?.id] || 'factory'} className="w-3.5 h-3.5" /> Application
            </span>
            <span className="egg-chip text-xs">
              {(products || []).length} matching SKU{(products || []).length === 1 ? '' : 's'}
            </span>
            {certList.length > 0 && (
              <span className="egg-chip text-xs">
                {certList.length} standards covered
              </span>
            )}
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
                Get Quote
              </Link>
              <Link href="/applications"
                className="egg-btn-ghost">
                All applications →
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden ring-1 ring-[#14161a]/10 bg-[#14161a]/10 stagger-children">
            {[
              { big: String((products || []).length), label: 'SKUs serving this industry' },
              { big: certList.length > 0 ? String(certList.length) : '—', label: 'Standards & certs covered' },
              { big: '7',   label: 'Loading ports' },
              { big: '60+', label: 'Destination markets' },
            ].map(s => (
              <div key={s.label} className="bg-white/90 backdrop-blur px-5 py-5">
                <div className="egg-display text-3xl sm:text-4xl tracking-tight" style={{ color: TONE }}>{s.big}</div>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#7a8290] mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry overview body */}
      {page.body_markdown && (
        <section id="top" className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 sm:py-20 egg-reveal">
          <RichPageBody content={page.body_markdown} title={page.title} />
        </section>
      )}

      {/* Matched products — Drop 145: grouped by source division so buyers
         see "Salt for water treatment" and "Chemicals for water treatment"
         as separate sub-sections instead of one mixed grid. */}
      {(products || []).length > 0 ? (() => {
        // Group products by their `category` (= page division)
        const byDivision = {}
        for (const p of products) {
          const k = p.category || 'other'
          if (!byDivision[k]) byDivision[k] = []
          byDivision[k].push(p)
        }
        // Render in canonical PRODUCT_DIVISIONS order (salt first, then
        // fertilizers, chemicals, construction, agro, minerals, metals)
        const divisionsToRender = PRODUCT_DIVISIONS.filter(d => byDivision[d.id]?.length)
        const otherKeys = Object.keys(byDivision).filter(k => !PRODUCT_DIVISIONS.find(d => d.id === k))

        return (
          <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-[#14161a]/10 egg-reveal">
            <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
              <div>
                <div className="egg-eyebrow mb-3" style={{ color: TONE }}>
                  Matching SKUs
                </div>
                <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">
                  {products.length} product{products.length === 1 ? '' : 's'} for {page.title.toLowerCase()}
                </h2>
                <p className="text-sm text-[#7a8290] mt-2">
                  Sourced from {divisionsToRender.length} of our 7 product division{divisionsToRender.length === 1 ? '' : 's'}.
                </p>
              </div>
              <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
                className="egg-link text-sm">
                Custom blend? →
              </Link>
            </div>

            {/* Per-division sub-sections */}
            <div className="space-y-10">
              {divisionsToRender.map(d => {
                const items = byDivision[d.id]
                return (
                  <div key={d.id}>
                    {/* Division header */}
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#14161a]/10">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ring-1 ring-[#14161a]/15 text-[#14161a]">
                        <Icon name={DIVISION_ICON[d.id] || 'box'} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#14161a] text-lg">
                          From {d.label} <span className="text-[#8a93a3] font-medium tabular-nums">({items.length})</span>
                        </h3>
                      </div>
                      <Link href={d.path} className="egg-chip text-xs text-[#3f4650] hover:text-[#14161a] transition-all hover:shadow-[inset_0_0_0_1.5px_rgba(20,22,26,.35)] flex-shrink-0">
                        All {d.label.toLowerCase()} →
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {items.map(p => (
                        <Link key={p.id} href={p.path}
                          className="egg-card group overflow-hidden">
                          <div className="aspect-[16/9] overflow-hidden rounded-t-2xl"
                            style={{ background: `linear-gradient(135deg, ${d.color}14, #f9fafb)` }}>
                            {p.hero_photo_url ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={p.hero_photo_url} alt={p.title}
                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">
                                <Icon name={DIVISION_ICON[d.id] || 'box'} className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            {p.hs_code && (
                              <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8a93a3] mb-1">HS {p.hs_code}</div>
                            )}
                            <h4 className="text-sm font-semibold text-[#14161a] line-clamp-2 group-hover:text-[#0b8f84] transition-colors min-h-[2.5em]">
                              {p.title}
                            </h4>
                            {p.certifications?.length > 0 && (
                              <div className="text-xs text-[#7a8290] mt-1.5 line-clamp-1">{p.certifications.slice(0, 3).join(' · ')}</div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
              {otherKeys.length > 0 && otherKeys.map(k => (
                <div key={k}>
                  <h3 className="font-semibold text-[#14161a] text-lg mb-4">Other ({byDivision[k].length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {byDivision[k].map(p => (
                      <Link key={p.id} href={p.path} className="egg-card group overflow-hidden">
                        <div className="p-4">
                          <h4 className="text-sm font-semibold text-[#14161a] line-clamp-2 group-hover:text-[#0b8f84] transition-colors">{p.title}</h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })() : (
        <section className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-12 text-center egg-reveal">
          <div className="egg-panel p-8 text-[#7a8290]">
            <p>No products tagged for this application yet.</p>
            <Link href="/rfq" className="egg-link mt-2 inline-block">
              Request a custom quote →
            </Link>
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
                <h3 className="font-semibold text-[#14161a] text-lg">Standards & Certifications Covered</h3>
                <p className="text-sm text-[#7a8290] mt-0.5">SKUs in this application carry paperwork ready for the standards below.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {certList.map(c => (
                <span key={c} className="egg-chip text-xs" style={{ color: '#6d28d9', boxShadow: `inset 0 0 0 1px ${TONE}55` }}>
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related applications */}
      {(siblingApps || []).length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 egg-reveal">
          <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-8">
            Other applications served
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
            {siblingApps.map(a => (
              <Link key={a.id} href={a.path}
                className="egg-card group p-5 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 ring-1 ring-[#14161a]/15 text-[#14161a]"><Icon name={APPLICATION_ICON[a.id] || 'factory'} className="w-5 h-5" /></div>
                <h3 className="font-semibold text-[#14161a] group-hover:text-[#0b8f84] transition-colors text-sm">
                  {a.label}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 egg-reveal">
        <div className="egg-panel p-10 sm:p-14 text-center relative overflow-hidden animate-scale-in">
          <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-60 pointer-events-none" />
          <div aria-hidden="true" className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-35 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${TONE} 0%, transparent 70%)` }} />
          <h2 className="egg-display relative text-3xl sm:text-4xl text-[#14161a] mb-3">
            Have a {page.title.toLowerCase()} requirement?
          </h2>
          <p className="relative text-[#3f4650] text-lg mb-7 max-w-2xl mx-auto">
            Tell us your tender spec — we'll come back within 24 hours with priced
            FOB / CIF / CFR options matched to your industry's standards.
          </p>
          <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
            className="egg-btn-primary relative px-8 py-4">
            Request a Quote
          </Link>
        </div>
      </section>
    </article>
  )
}
