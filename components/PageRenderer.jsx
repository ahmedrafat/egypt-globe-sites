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
  getDivisionSubcategories,
  getCommodityById,
  getPagesForApplication,
  CATEGORY_META,
  PRODUCT_DIVISIONS,
  SERVICE_DIVISIONS,
  APPLICATIONS,
} from '../lib/corporatePages'
import RichDivisionLanding from './RichDivisionLanding'
import RichSubcategoryLanding from './RichSubcategoryLanding'
import RichApplicationLanding from './RichApplicationLanding'

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
  // Sub-category landing — exactly 3 path segments under /products/<division>/<subcat>
  const isSubcategoryLanding = /^\/products\/[a-z-]+\/[a-z0-9-]+$/.test(page.path)
                            && PRODUCT_DIVISIONS.some(d => page.path.startsWith(d.path + '/'))
                            && !page.commodity_id

  const directChildren = !isProductsHub && !isServicesHub && !isApplicationsHub && !isApplicationLanding && !isDivisionLanding && !isSubcategoryLanding
    ? await getDirectChildren(page.path)
    : []
  const divisionPages = isDivisionLanding
    ? await getPagesInCategory(division.id, { excludePath: page.path })
    : []
  const divisionSubcats = isDivisionLanding
    ? await getDivisionSubcategories(page.path)
    : []
  // SKU pages = division pages with commodity_id (excluding sub-cat landings)
  const divisionSkus = (divisionPages || []).filter(p =>
    p.path.split('/').filter(Boolean).length >= 4
  )
  const subcategoryProducts = isSubcategoryLanding
    ? await getDirectChildren(page.path)
    : []
  const applicationProducts = isApplicationLanding
    ? await getPagesForApplication(applicationId)
    : []
  const related = await getRelatedPages(page, 4)

  const commodity = page.commodity_id ? await getCommodityById(page.commodity_id) : null

  // Division landing — early-return with the Pelot-style rich layout
  if (isDivisionLanding && division) {
    return (
      <RichDivisionLanding
        page={page}
        division={division}
        subcategories={divisionSubcats}
        featured={divisionSkus}
        allDivisionPages={divisionPages}
      />
    )
  }

  // Sub-category landing — Pelot-style rich layout w/ parent division context
  if (isSubcategoryLanding) {
    const parentDivisionPath = '/' + page.path.split('/').slice(1, 3).join('/')
    const parentDivision = PRODUCT_DIVISIONS.find(d => d.path === parentDivisionPath)
    if (parentDivision) {
      const allSibling = await getDivisionSubcategories(parentDivision.path)
      const siblingSubcats = allSibling.filter(s => s.path !== page.path).slice(0, 8)
      return (
        <RichSubcategoryLanding
          page={page}
          division={parentDivision}
          skus={subcategoryProducts}
          siblingSubcats={siblingSubcats}
        />
      )
    }
  }

  // Application landing — violet hero + matched products + related apps
  if (isApplicationLanding && application) {
    const siblingApps = APPLICATIONS.filter(a => a.id !== application.id).slice(0, 8)
    return (
      <RichApplicationLanding
        page={page}
        application={application}
        products={applicationProducts}
        siblingApps={siblingApps}
      />
    )
  }

  // Detect product detail page (has rich data) for the immersive hero
  const isProductDetail =
    page.specs && Object.keys(page.specs).length > 0 ||
    (page.certifications || []).length > 0 ||
    page.moq_mt
  const sourceType = (page.specs?.source_type || '').toLowerCase()
  const isRockSalt = sourceType.includes('rock')
  const isSeaSalt = sourceType.includes('sea')

  // Pick a hero gradient: rock salt → stone, sea salt / chemicals / general
  // products → brand blue, services hub → teal-blue, applications hub → violet
  const heroGradient = page.hero_photo_url ? null : (
    isRockSalt
      ? 'bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900'
      : isSeaSalt
      ? 'bg-gradient-to-br from-cyan-700 via-blue-800 to-[#0f1f3a]'
      : isApplicationLanding || isApplicationsHub
      ? 'bg-gradient-to-br from-violet-700 via-purple-800 to-indigo-900'
      : isServicesHub
      ? 'bg-gradient-to-br from-teal-700 via-cyan-800 to-blue-900'
      : isDivisionLanding && division
      ? null  // use category color (set inline)
      : 'bg-gradient-to-br from-[#1d5fa1] via-[#14467a] to-[#0f1f3a]'
  )

  return (
    <article>
      {/* Hero — immersive brand-coloured banner ──────────────────── */}
      <section className={`relative overflow-hidden ${heroGradient || ''}`}
        style={!heroGradient && !page.hero_photo_url && division ? {
          background: `linear-gradient(135deg, ${division.color} 0%, ${division.color}cc 50%, #0f1f3a 100%)`
        } : undefined}>
        {page.hero_photo_url && (
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={page.hero_photo_url} alt={page.title}
              className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f1f3a]/85 via-[#0f1f3a]/70 to-[#1d5fa1]/60" />
          </div>
        )}

        {/* Decorative pattern */}
        <div aria-hidden="true" className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-5 flex-wrap animate-fade-in">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            {!isHomePath && page.category && (
              <>
                <span className="text-white/70">{cat.label}</span>
                <span>›</span>
              </>
            )}
            <span className="text-white/80 truncate max-w-[300px]">{page.title}</span>
          </nav>

          {/* Chip rail */}
          <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in-up">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white backdrop-blur-sm border border-white/20">
              <span aria-hidden="true">{cat.icon}</span> {cat.label}
            </span>
            {isRockSalt && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-stone-600/40 text-stone-100 border border-stone-400/30">
                ⛏️ Rock Salt
              </span>
            )}
            {isSeaSalt && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-cyan-500/30 text-cyan-50 border border-cyan-400/30">
                🌊 Sea Salt
              </span>
            )}
            {page.specs?.nacl_min && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20">
                NaCl {page.specs.nacl_min}
              </span>
            )}
            {page.specs?.grain_label && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20">
                {page.specs.grain_label}
              </span>
            )}
            {page.hs_code && (
              <span className="inline-flex items-center text-[11px] font-mono font-bold px-3 py-1.5 rounded-full bg-white/10 text-white/90 border border-white/15">
                HS {page.hs_code}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 leading-[1.05] drop-shadow-sm">
                {page.title}
              </h1>
              {page.description && (
                <p className="text-base sm:text-lg leading-relaxed max-w-3xl text-white/80">
                  {page.description}
                </p>
              )}
            </div>

            {/* Hero action buttons — Quote + TDS + COA */}
            {isProductDetail && (
              <div className="flex flex-wrap gap-2 lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
                  className="inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5">
                  📋 Get Quote
                </Link>
                <Link href={`/tds${page.path}`} target="_blank"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold border border-white/20 px-5 py-3 rounded-xl transition-colors">
                  📄 TDS
                </Link>
                <Link href={`/rfq?product=${encodeURIComponent(page.path)}&type=coa`}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold border border-white/20 px-5 py-3 rounded-xl transition-colors">
                  🧪 COA
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      {page.body_markdown && (
        <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 scroll-reveal">
          {/* Decorative side accent (desktop) */}
          <div aria-hidden="true"
            className="hidden lg:block absolute -left-12 top-20 w-1 h-40 rounded-full bg-gradient-to-b from-[#1d5fa1] via-[#FF6321] to-transparent opacity-30" />
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

      {/* Sub-category landing — show all SKUs in that sub-category
          (e.g. /products/construction/cement-and-clinker → all cement SKUs) */}
      {isSubcategoryLanding && subcategoryProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            {page.title} — full catalogue
          </h2>
          <p className="text-slate-600 mb-8">
            {subcategoryProducts.length} {subcategoryProducts.length === 1 ? 'SKU' : 'SKUs'} available for export.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {subcategoryProducts.map(p => (
              <Link key={p.id} href={p.path}
                className="card-lift group rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                  {p.hero_photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.hero_photo_url} alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl opacity-30 bg-gradient-to-br from-blue-50 to-slate-50"
                      style={{ background: `linear-gradient(135deg, ${cat.color}10, transparent)` }}>
                      {cat.icon}
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

      {/* Division landing branch removed — handled by RichDivisionLanding
          via early-return at the top of this component. */}

      {/* Generic page — show direct children if any */}
      {!isProductsHub && !isServicesHub && !isApplicationsHub && !isApplicationLanding && !isDivisionLanding && !isSubcategoryLanding && directChildren.length > 0 && (
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
      {!isProductsHub && !isServicesHub && !isApplicationsHub && !isApplicationLanding && !isDivisionLanding && !isSubcategoryLanding && (
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
      {related.length > 0 && !isProductsHub && !isServicesHub && !isApplicationsHub && !isApplicationLanding && !isDivisionLanding && !isSubcategoryLanding && directChildren.length === 0 && (
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
