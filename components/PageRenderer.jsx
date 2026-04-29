/**
 * PageRenderer — shared layout for any egg_corporate_pages row.
 *
 * Renders: hero + breadcrumb, body markdown, ProductDetailBlock when
 * the page has rich product data, gallery, child grid for category
 * landings, related-pages strip, and a CTA banner.
 */
import Link from 'next/link'
import MarkdownBody from './MarkdownBody'
import ProductDetailBlock from './ProductDetailBlock'
import {
  getRelatedPages,
  getDirectChildren,
  getPagesInCategory,
  getCommodityById,
  getPagesForApplication,
  CATEGORY_META,
  PRODUCT_DIVISIONS,
  SERVICE_DIVISIONS,
  APPLICATIONS,
} from '../lib/corporatePages'

const PRODUCT_DIVISION_BY_PATH = Object.fromEntries(PRODUCT_DIVISIONS.map(d => [d.path, d]))

export default async function PageRenderer({ page }) {
  const cat = CATEGORY_META[page.category] || CATEGORY_META.other

  const isHomePath = page.path === '/'
  const isProductsHub = page.path === '/products'
  const isServicesHub = page.path === '/services'
  const isApplicationsHub = page.path === '/applications'
  const appMatch = page.path.match(/^\/applications\/([a-z_]+)$/)
  const isApplicationLanding = !!appMatch
  const applicationId = appMatch?.[1] || null
  const application = applicationId ? APPLICATIONS.find(a => a.id === applicationId) : null
  const isDivisionLanding = !!PRODUCT_DIVISION_BY_PATH[page.path]
  const division = PRODUCT_DIVISION_BY_PATH[page.path]
  const isGradeLanding = page.category === 'salt' && /^\/products\/salt\/[a-z-]+$/.test(page.path)

  const directChildren = !isProductsHub && !isServicesHub && !isApplicationsHub && !isApplicationLanding && !isDivisionLanding
    ? await getDirectChildren(page.path)
    : []
  const divisionPages = isDivisionLanding
    ? await getPagesInCategory(division.id, { excludePath: page.path })
    : []
  const gradeProducts = isGradeLanding
    ? await getDirectChildren(page.path)
    : []
  const applicationProducts = isApplicationLanding
    ? await getPagesForApplication(applicationId)
    : []
  const related = await getRelatedPages(page, 4)

  const commodity = page.commodity_id ? await getCommodityById(page.commodity_id) : null

  return (
    <article>
      {/* Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {page.hero_photo_url ? (
          <div className="relative h-[40vh] sm:h-[60vh] min-h-[360px] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={page.hero_photo_url} alt={page.title}
              className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f1f3a]/60 via-[#0f1f3a]/40 to-white" />
          </div>
        ) : (
          <div className="h-[28vh] sm:h-[36vh] min-h-[220px] relative"
            style={{ background: `linear-gradient(135deg, ${cat.color}1F 0%, transparent 60%), radial-gradient(circle at 80% 20%, ${cat.color}26, transparent 50%)` }}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
            <div aria-hidden="true"
              className="absolute right-8 top-1/2 -translate-y-1/2 text-[180px] sm:text-[260px] opacity-10 animate-float select-none">
              {cat.icon}
            </div>
          </div>
        )}

        <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ${page.hero_photo_url ? '-mt-40 sm:-mt-48' : '-mt-24 sm:-mt-32'} relative z-10 animate-fade-in-up`}>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Link href="/" className="text-xs font-medium text-slate-500 hover:text-[#1d5fa1] transition-colors">
              Home
            </Link>
            <span className="text-slate-400 text-xs">›</span>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cat.tone}`}>
              <span aria-hidden="true">{cat.icon}</span> {cat.label}
            </span>
            {page.hs_code && (
              <span className="inline-flex items-center text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                HS {page.hs_code}
              </span>
            )}
          </div>

          <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 ${page.hero_photo_url ? 'text-white drop-shadow-md' : 'text-slate-900'}`}>
            {page.title}
          </h1>
          {page.description && (
            <p className={`text-lg sm:text-xl leading-relaxed max-w-3xl ${page.hero_photo_url ? 'text-blue-50' : 'text-slate-600'}`}>
              {page.description}
            </p>
          )}
        </div>
      </section>

      {/* Body */}
      {page.body_markdown && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <MarkdownBody content={page.body_markdown} />
        </section>
      )}

      {/* Rich product detail (only mounts when row has fields populated) */}
      <ProductDetailBlock page={page} commodity={commodity} />

      {/* Products hub — always show every division */}
      {isProductsHub && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Browse our 6 product divisions</h2>
          <p className="text-slate-600 mb-8">Each division ships from Egyptian ports under FOB / CIF / CFR Incoterms with per-shipment certificate of analysis.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {PRODUCT_DIVISIONS.map(div => (
              <Link key={div.id} href={div.path}
                className="card-lift relative rounded-2xl border border-slate-200 bg-white p-6 group overflow-hidden">
                <div className="absolute -right-6 -top-6 text-7xl opacity-[0.06] group-hover:opacity-[0.12] transition-opacity"
                  aria-hidden="true">{div.icon}</div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ background: `${div.color}1A`, color: div.color }}>
                    {div.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1d5fa1] transition-colors">
                    {div.label}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{div.blurb}</p>
                  <div className="mt-4 inline-flex items-center text-sm font-semibold text-[#1d5fa1] group-hover:gap-2 gap-1 transition-all">
                    Explore {div.label.toLowerCase()} <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Applications hub — list every industry */}
      {isApplicationsHub && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Salt by industry</h2>
          <p className="text-slate-600 mb-8">12 standard applications served from our 74-SKU Egyptian salt catalogue.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
            {APPLICATIONS.map(a => (
              <Link key={a.id} href={a.path}
                className="card-lift group rounded-2xl border border-slate-200 bg-white p-5 text-center">
                <div className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-3xl mb-3 bg-violet-50 text-violet-700">
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

      {/* Application landing — show all matching salt products */}
      {isApplicationLanding && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Salt for {application?.label || 'this industry'}
          </h2>
          <p className="text-slate-600 mb-8">
            {applicationProducts.length} {applicationProducts.length === 1 ? 'product' : 'products'} matching this application.
          </p>
          {applicationProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
              {applicationProducts.map(p => (
                <Link key={p.id} href={p.path}
                  className="card-lift group rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    {p.hero_photo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={p.hero_photo_url} alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl opacity-30 bg-gradient-to-br from-violet-100 to-blue-100">🧂</div>
                    )}
                  </div>
                  <div className="p-4">
                    {p.hs_code && (
                      <div className="text-[10px] font-mono uppercase font-bold text-slate-400 mb-1">HS {p.hs_code}</div>
                    )}
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-[#1d5fa1] transition-colors">
                      {p.title}
                    </h3>
                    {p.certifications?.length > 0 && (
                      <div className="text-xs text-slate-500 mt-1.5 line-clamp-1">{p.certifications.slice(0, 3).join(' · ')}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              No products tagged for this application yet. <Link href="/rfq" className="text-[#1d5fa1] font-semibold hover:underline">Request a quote →</Link>
            </div>
          )}
        </section>
      )}

      {/* Grade landing — show all SKUs in that grade (salt grade landings) */}
      {isGradeLanding && gradeProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            {page.title} — full catalogue
          </h2>
          <p className="text-slate-600 mb-8">{gradeProducts.length} SKUs available for export.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {gradeProducts.map(p => (
              <Link key={p.id} href={p.path}
                className="card-lift group rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                  {p.hero_photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.hero_photo_url} alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl opacity-30 bg-gradient-to-br from-blue-50 to-cyan-50">🧂</div>
                  )}
                </div>
                <div className="p-4">
                  {p.hs_code && (
                    <div className="text-[10px] font-mono uppercase font-bold text-slate-400 mb-1">HS {p.hs_code}</div>
                  )}
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-[#1d5fa1] transition-colors">
                    {p.title}
                  </h3>
                  {p.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Services hub — show every supply-chain service */}
      {isServicesHub && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Our supply-chain services</h2>
          <p className="text-slate-600 mb-8">Logistics, port operations, added value, packing, inspection and trade documentation — all in-house.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {SERVICE_DIVISIONS.map(svc => (
              <Link key={svc.id} href={svc.path}
                className="card-lift relative rounded-2xl border border-slate-200 bg-white p-6 group overflow-hidden">
                <div className="absolute -right-6 -top-6 text-7xl opacity-[0.06] group-hover:opacity-[0.12] transition-opacity"
                  aria-hidden="true">{svc.icon}</div>
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ background: `${svc.color}1A`, color: svc.color }}>
                    {svc.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#1d5fa1] transition-colors">
                    {svc.label}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{svc.blurb}</p>
                  <div className="mt-4 inline-flex items-center text-sm font-semibold text-[#1d5fa1] group-hover:gap-2 gap-1 transition-all">
                    Learn more <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Division landing — show all pages in that category */}
      {isDivisionLanding && divisionPages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            {division.label} — full catalogue
          </h2>
          <p className="text-slate-600 mb-8">{divisionPages.length} {divisionPages.length === 1 ? 'product' : 'products'} available for export.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {divisionPages.map(p => (
              <Link key={p.id} href={p.path}
                className="card-lift group rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                  {p.hero_photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.hero_photo_url} alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl opacity-30"
                      style={{ background: `linear-gradient(135deg, ${division.color}10, transparent)` }}>
                      {division.icon}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {p.hs_code && (
                    <div className="text-[10px] font-mono uppercase font-bold text-slate-400 mb-1">HS {p.hs_code}</div>
                  )}
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-[#1d5fa1] transition-colors">
                    {p.title}
                  </h3>
                  {p.price_indication && (
                    <p className="text-xs text-[#FF6321] font-semibold mt-1.5 line-clamp-1">{p.price_indication}</p>
                  )}
                  {p.description && !p.price_indication && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Generic page — show direct children if any */}
      {!isProductsHub && !isServicesHub && !isApplicationsHub && !isApplicationLanding && !isDivisionLanding && !isGradeLanding && directChildren.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">In this section</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {directChildren.map(p => {
              const childCat = CATEGORY_META[p.category] || cat
              return (
                <Link key={p.id} href={p.path}
                  className="card-lift group rounded-2xl border border-slate-200 bg-white p-6 overflow-hidden relative">
                  <div className="absolute -right-4 -top-4 text-6xl opacity-[0.06] group-hover:opacity-[0.12] transition-opacity"
                    aria-hidden="true">{childCat.icon}</div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#1d5fa1] transition-colors">
                    {p.title}
                  </h3>
                  {p.description && (
                    <p className="text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed">{p.description}</p>
                  )}
                  <span className="mt-3 inline-flex text-xs font-semibold text-[#1d5fa1] group-hover:gap-2 gap-1 transition-all">
                    Read more <span>→</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Gallery */}
      {(page.gallery_urls || []).length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-bold text-slate-900 mb-5">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 stagger-children">
            {page.gallery_urls.map((url, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100 card-lift">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA strip — skip on hubs / division landings (they get their own treatment) */}
      {!isProductsHub && !isServicesHub && !isApplicationsHub && !isApplicationLanding && !isDivisionLanding && !isGradeLanding && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="rounded-3xl bg-gradient-to-br from-[#1d5fa1] to-[#14467a] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl shadow-blue-900/10">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-1">Ready for a quote?</h3>
              <p className="text-blue-100 leading-relaxed">FOB / CIF / CFR pricing from 7 Egyptian ports — turnaround within 24 hours.</p>
            </div>
            <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
              className="bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-7 py-3.5 rounded-xl shadow-lg whitespace-nowrap transition-all hover:-translate-y-0.5">
              📋 Request Quote
            </Link>
          </div>
        </section>
      )}

      {/* Related pages */}
      {related.length > 0 && !isProductsHub && !isServicesHub && !isApplicationsHub && !isApplicationLanding && !isDivisionLanding && !isGradeLanding && directChildren.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-6">More in {cat.label}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
            {related.map(p => (
              <Link key={p.id} href={p.path}
                className="card-lift group rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="aspect-[4/3] bg-slate-100">
                  {p.hero_photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.hero_photo_url} alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl opacity-30">{cat.icon}</div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-[#1d5fa1]">{p.title}</h3>
                  {p.description && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
