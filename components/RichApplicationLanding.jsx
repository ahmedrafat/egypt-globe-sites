/**
 * RichApplicationLanding — Pelot-style layout for /applications/<id>.
 *
 * Layout:
 *   1. Violet-gradient hero with breadcrumb, chip rail, dual CTA
 *   2. Stats strip (matching SKUs / standards / regions)
 *   3. Industry-specific markdown body
 *   4. Matched products grid
 *   5. Related applications
 *   6. Bottom CTA
 */
import Link from 'next/link'
import RichPageBody from './RichPageBody'
import { APPLICATIONS } from '../lib/corporatePages'

export default function RichApplicationLanding({ page, application, products, siblingApps, visibility }) {
  // Aggregate certs across matched products
  const certs = new Set()
  for (const p of (products || [])) {
    for (const c of (p.certifications || [])) certs.add(c)
  }
  const certList = [...certs].slice(0, 12)

  return (
    <article>
      {/* Violet hero */}
      <section className="relative overflow-hidden text-white bg-gradient-to-br from-violet-700 via-purple-800 to-indigo-900">
        <div aria-hidden="true" className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,99,33,0.4) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-32 -left-24 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)' }} />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-25" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 sm:py-20">
          <nav className="flex items-center gap-2 text-xs text-white/60 mb-5 flex-wrap animate-fade-in">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <Link href="/applications" className="hover:text-white">Applications</Link>
            <span>›</span>
            <span className="text-white/90">{page.title}</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in-up">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              🏭 Application
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              {(products || []).length} matching SKU{(products || []).length === 1 ? '' : 's'}
            </span>
            {certList.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
                {certList.length} standards covered
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-[1.05] drop-shadow-sm">
                <span className="text-3xl sm:text-4xl lg:text-5xl mr-2">{application?.icon}</span>
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
              <Link href="/applications"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold border border-white/20 px-5 py-3 rounded-xl transition-colors">
                All applications →
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
            {[
              { big: String((products || []).length), label: 'SKUs serving this industry' },
              { big: certList.length > 0 ? String(certList.length) : '—', label: 'Standards & certs covered' },
              { big: '7',   label: 'Loading ports' },
              { big: '60+', label: 'Destination markets' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 px-5 py-5">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{s.big}</div>
                <div className="text-xs text-white/70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry overview body */}
      {page.body_markdown && (
        <section id="top" className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 sm:py-20 scroll-reveal">
          <RichPageBody content={page.body_markdown} title={page.title} />
        </section>
      )}

      {/* Matched products */}
      {(products || []).length > 0 ? (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-slate-100 scroll-reveal">
          <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
            <div>
              <div className="inline-block bg-violet-50 text-violet-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                Matching SKUs
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {(products || []).length} product{(products || []).length === 1 ? '' : 's'} for {page.title.toLowerCase()}
              </h2>
            </div>
            <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
              className="text-sm font-semibold text-violet-700 hover:underline">
              Custom blend? →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {products.map(p => (
              <Link key={p.id} href={p.path}
                className="card-lift group rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="aspect-[16/9] bg-gradient-to-br from-violet-50 to-blue-50 overflow-hidden">
                  {p.hero_photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.hero_photo_url} alt={p.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">
                      {application?.icon || '📦'}
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
                  {p.certifications?.length > 0 && (
                    <div className="text-xs text-slate-500 mt-1.5 line-clamp-1">{p.certifications.slice(0, 3).join(' · ')}</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <section className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-12 text-center scroll-reveal">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-slate-500">
            <p>No products tagged for this application yet.</p>
            <Link href="/rfq" className="text-[#1d5fa1] font-semibold hover:underline mt-2 inline-block">
              Request a custom quote →
            </Link>
          </div>
        </section>
      )}

      {/* Certifications strip */}
      {certList.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 scroll-reveal">
          <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/40 to-white p-6 sm:p-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="text-2xl">🏅</div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Standards & Certifications Covered</h3>
                <p className="text-sm text-slate-500 mt-0.5">SKUs in this application carry paperwork ready for the standards below.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {certList.map(c => (
                <span key={c} className="inline-flex items-center text-xs font-semibold bg-white text-violet-800 border border-violet-200 px-3 py-1.5 rounded-full">
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related applications */}
      {(siblingApps || []).length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 scroll-reveal">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
            Other applications served
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
            {siblingApps.map(a => (
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
        </section>
      )}

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-violet-700 to-indigo-900 p-10 sm:p-14 text-center relative overflow-hidden shadow-2xl shadow-violet-900/20 animate-scale-in">
          <div aria-hidden="true" className="absolute -top-12 -right-12 text-[280px] opacity-10 select-none">{application?.icon}</div>
          <h2 className="relative text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Have a {page.title.toLowerCase()} requirement?
          </h2>
          <p className="relative text-violet-100 text-lg mb-7 max-w-2xl mx-auto">
            Tell us your tender spec — we'll come back within 24 hours with priced
            FOB / CIF / CFR options matched to your industry's standards.
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
