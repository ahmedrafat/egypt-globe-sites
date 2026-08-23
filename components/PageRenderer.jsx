/**
 * PageRenderer — shared layout for any egg_corporate_pages row.
 *
 * Renders: hero + breadcrumb, body markdown, ProductDetailBlock when
 * the page has rich product data, gallery, child grid for category
 * landings, related-pages strip, and a CTA banner.
 */
import HeroMotif from './HeroMotif'
import Link from 'next/link'
import MarkdownBody from './MarkdownBody'
import RichPageBody from './RichPageBody'
import ProductDetailBlock from './ProductDetailBlock'
import ProductTabs from './interactive/ProductTabs'
import MarkdownTabs from './interactive/MarkdownTabs'
import TariffCalculator from './interactive/TariffCalculator'
import HSCodeBrowser from './interactive/HSCodeBrowser'
import {
  getRelatedPages,
  getDirectChildren,
  getPagesInCategory,
  getDivisionSubcategories,
  getCommodityById,
  getQualitySpecsForCommodity,
  getCommodityCoas,
  getBrandForCommodity,
  getPagesForApplication,
  getPackingOptions,
  getApplicationDivisionMatrix,
  CATEGORY_META,
  PRODUCT_DIVISIONS,
  SERVICE_DIVISIONS,
  APPLICATIONS,
} from '../lib/corporatePages'
import RichDivisionLanding from './RichDivisionLanding'
import RichSubcategoryLanding from './RichSubcategoryLanding'
import RichApplicationLanding from './RichApplicationLanding'
import PackingMatrix from './PackingMatrix'
import SkuRelatedLinks from './SkuRelatedLinks'
import { BreadcrumbJsonLd, ProductJsonLd, WebPageJsonLd, FAQJsonLd } from './StructuredData'
import FAQAccordion from './FAQAccordion'
import StickyRfqBar from './StickyRfqBar'
import { faqsForPage } from '../lib/faqs'
import { getBuyerVisibility, filterPagesByVisibility, isPageVisible } from '../lib/supabaseServer'
import Icon, { DIVISION_ICON, APPLICATION_ICON, SERVICE_ICON, CATEGORY_ICON } from './ui/Icon'

/**
 * Build a list of {name, path} crumbs from a page's path.
 * "/products/salt/food-grade/ultra-pure" →
 *   [{Home,/}, {Products,/products}, {Salt,/products/salt},
 *    {Food grade,/products/salt/food-grade}, {Ultra pure,/...}]
 */
function buildCrumbs(page) {
  if (!page?.path || page.path === '/') return [{ name: 'Home', path: '/' }]
  const segs = page.path.split('/').filter(Boolean)
  const crumbs = [{ name: 'Home', path: '/' }]
  let acc = ''
  for (let i = 0; i < segs.length; i++) {
    acc += '/' + segs[i]
    const isLast = i === segs.length - 1
    const name = isLast
      ? page.title
      : segs[i].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    crumbs.push({ name, path: acc })
  }
  return crumbs
}

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
  // Drop 137b — fetch quality_specs reference for the commodity (one row
  // per QC parameter with target / test method / standard / cert body).
  const qualitySpecs = page.commodity_id ? await getQualitySpecsForCommodity(page.commodity_id) : []
  // Drop 146 — fetch all active CoAs per market region for the new
  // Certificates tab in ProductTabs.
  const coas = page.commodity_id ? await getCommodityCoas(page.commodity_id) : []
  // Drop 158 — resolve the brand letterhead for this commodity (Pelot Salt /
  // EGG Cement / EGG Chemicals / etc.) so the CoA print uses the right
  // logo / colours / contact / signatures / footer disclaimer.
  const brand = commodity ? await getBrandForCommodity(commodity) : null
  // Drop 141 — pull comprehensive packing matrix from globe_packing_options
  // scoped to this product's category (cement/salt/fertilizers/etc.). The
  // PackingMatrix component shows all formats inc. PE bags / OEM / bag-in-jumbo
  // even when the product's own packing_options array is sparse.
  // Drop 143 — also fetch packing options on the dedicated /services/packing
  // page so the editorial body sits above the comprehensive PackingMatrix.
  const isPackingService = page.path === '/services/packing'
  const packingOptions = (page.commodity_id || isPackingService)
    ? await getPackingOptions(isPackingService ? null : page.category)
    : []
  const visibility = await getBuyerVisibility()

  // Approved buyers with scoped access who navigate to a SKU outside
  // their scope see a soft access-denied panel instead of the page
  if (page.commodity_id && !isPageVisible(page, visibility)) {
    return <AccessRestricted page={page} visibility={visibility} />
  }

  // Division landing — early-return with the Pelot-style rich layout
  if (isDivisionLanding && division) {
    return (
      <RichDivisionLanding
        page={page}
        division={division}
        subcategories={filterPagesByVisibility(divisionSubcats, visibility)}
        featured={filterPagesByVisibility(divisionSkus, visibility)}
        allDivisionPages={filterPagesByVisibility(divisionPages, visibility)}
        visibility={visibility}
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
          skus={filterPagesByVisibility(subcategoryProducts, visibility)}
          siblingSubcats={siblingSubcats}
          visibility={visibility}
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
        products={filterPagesByVisibility(applicationProducts, visibility)}
        siblingApps={siblingApps}
        visibility={visibility}
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

  // Light editorial hero — one accent tone per page type, rendered as a soft
  // glow over white: rock salt → deep gold, sea salt → clear turquoise,
  // applications → violet, services → teal, divisions → division colour,
  // everything else → the category colour.
  const heroTone = isRockSalt
    ? '#b8862b'
    : isSeaSalt
    ? '#0fb5a5'
    : isApplicationLanding || isApplicationsHub
    ? '#7c3aed'
    : isServicesHub
    ? '#0d9488'
    : isDivisionLanding && division
    ? division.color
    : (cat.color || '#0284c7')

  // Drop 122 — JSON-LD: BreadcrumbList always; Product when this is a SKU page
  const crumbs = buildCrumbs(page)
  const isSkuPage = !!page.commodity_id || (
    isProductDetail && /^\/(salt|fertilizers|chemicals|construction|agro|minerals|metals|products)\//.test(page.path)
  )

  return (
    <article>
      {/* Drop 122 + 125 — structured data ────────────────────────── */}
      <BreadcrumbJsonLd crumbs={crumbs} />
      {isSkuPage ? (
        <ProductJsonLd page={page} commodity={commodity} visibility={visibility} brand={brand} />
      ) : (
        <WebPageJsonLd
          page={page}
          type={
            page.path === '/contact'           ? 'ContactPage' :
            page.path?.startsWith('/about')    ? 'AboutPage'  :
            page.path?.startsWith('/blog/')    ? 'Article'     :
            page.path?.startsWith('/markets/') ? 'Article'     :
            page.path === '/markets'           ? 'CollectionPage' :
            isProductsHub || isDivisionLanding || isSubcategoryLanding ? 'CollectionPage' :
            'WebPage'
          }
        />
      )}

      {/* Hero — light editorial banner (white, soft accent glow) ──── */}
      <section className="relative overflow-hidden bg-white border-b border-[#14161a]/10">
        {page.hero_photo_url && (
          <div className="absolute inset-0">
            {/* Drop 140 — hero photos are typically 1200×675 (16:9). Hero
               container is taller than 16:9 on mobile (portrait-ish), so
               object-cover crops top + bottom. Use object-top to favor the
               TOP of the photo (where product labels / branding sit) when
               the crop is necessary. Light edition: the photo sits as a
               faint backdrop under a white scrim so the obsidian copy stays
               perfectly legible. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={page.hero_photo_url} alt={page.title}
              className="absolute inset-0 w-full h-full object-cover object-top opacity-[0.22] blur-2xl scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/95" />
          </div>
        )}

        {/* Decorative patterns — fine light grid + accent glow + content motif */}
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        <HeroMotif category={page.category} path={page.path} sourceType={sourceType} tone={heroTone} />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(60% 55% at 88% 0%, ${heroTone}24, transparent 60%), radial-gradient(45% 40% at 0% 100%, ${heroTone}12, transparent 60%)` }} />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-[#7a8290] mb-5 flex-wrap animate-fade-in">
            <Link href="/" className="hover:text-[#14161a] transition-colors">Home</Link>
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
            {!isHomePath && page.category && (
              <>
                <span className="text-[#5b6472] cursor-default">{cat.label}</span>
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
                </svg>
              </>
            )}
            <span className="text-[#14161a] font-medium truncate max-w-[300px]">{page.title}</span>
          </nav>

          {/* Chip rail — tighter on mobile, hide HS chip on <sm */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-4 flex-wrap animate-fade-in-up">
            <span className="egg-chip text-[11px] sm:text-xs" style={{ color: heroTone, boxShadow: `inset 0 0 0 1px ${heroTone}55` }}>
              <Icon name={CATEGORY_ICON[page.category] || 'grid'} className="w-3.5 h-3.5" /> {cat.label}
            </span>
            {isRockSalt && (
              <span className="egg-chip text-[11px] sm:text-xs" style={{ color: '#8a6d3b', boxShadow: 'inset 0 0 0 1px rgba(184,134,43,.45)' }}>
                Rock Salt
              </span>
            )}
            {isSeaSalt && (
              <span className="egg-chip text-[11px] sm:text-xs" style={{ color: '#0b8f84', boxShadow: 'inset 0 0 0 1px rgba(15,181,165,.5)' }}>
                Sea Salt
              </span>
            )}
            {page.specs?.nacl_min && (
              <span className="egg-chip text-[11px] sm:text-xs">
                NaCl {page.specs.nacl_min}
              </span>
            )}
            {page.specs?.grain_label && (
              <span className="egg-chip hidden sm:inline-flex text-xs">
                {page.specs.grain_label}
              </span>
            )}
            {page.hs_code && (
              <span className="egg-chip hidden sm:inline-flex font-mono text-[11px] text-[#5b6472]">
                HS {page.hs_code}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h1 className="egg-display text-[30px] sm:text-5xl lg:text-6xl text-[#14161a] mb-3 sm:mb-4 leading-[1.08] sm:leading-[1.02]">
                {page.title}
              </h1>
              {page.description && (
                <p className="text-sm sm:text-lg leading-relaxed max-w-3xl text-[#3f4650]">
                  {page.description}
                </p>
              )}
            </div>

            {/* Hero action buttons — Quote dominates on mobile,
                TDS/COA become secondary chips */}
            {isProductDetail && (
              <div className="flex flex-wrap items-center gap-2 lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
                  className="egg-btn-primary w-full sm:w-auto">
                  Get Quote
                </Link>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Link href={`/tds${page.path}`} target="_blank"
                    className="egg-btn-ghost flex-1 sm:flex-initial">
                    TDS
                  </Link>
                  <Link href={`/rfq?product=${encodeURIComponent(page.path)}&type=coa`}
                    className="egg-btn-ghost flex-1 sm:flex-initial">
                    COA
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Drop 132 + 133 — interactive layouts replace markdown long-scroll.
         SKU pages → ProductTabs (Drop 132).
         Editorial pages (about / services / case-studies / blog / country
         guides / HS-code glossary / division pillars) → MarkdownTabs which
         auto-splits body_markdown by ## H2 boundaries into clickable tabs
         (Drop 133). Plus per-page-category interactive widget on top:
           /trade-tools/import-guides/<country>  → <TariffCalculator>
           /trade-tools/hs-codes                  → <HSCodeBrowser>
         body_markdown column kept in DB for /llms-full.txt + reversibility. */}
      {isSkuPage ? (
        <ProductTabs
          page={page}
          commodity={commodity}
          applications={(page.applications || []).map(id => APPLICATIONS.find(a => a.id === id)).filter(Boolean)}
          qualitySpecs={qualitySpecs}
          packingOptions={packingOptions}
          coas={coas}
          brand={brand}
          visibility={visibility}
        />
      ) : page.path === '/trade-tools/hs-codes' ? (
        // HS-code glossary becomes a fully interactive searchable browser —
        // markdown body suppressed entirely (browser carries every code).
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
          <HSCodeBrowser />
        </section>
      ) : page.path?.startsWith('/trade-tools/import-guides/') && page.path !== '/trade-tools/import-guides' ? (
        // Country import guide — TariffCalculator above the auto-tabs.
        <MarkdownTabs body={page.body_markdown} title={page.title}
          leadingWidget={<TariffCalculator countryId={page.path.split('/').pop()} />}
        />
      ) : isPackingService ? (
        // Drop 143 — packing service page surfaces the comprehensive
        // PackingMatrix above the editorial body so buyers see every
        // format (PE bags, OEM, FIBC sizes, bag-in-jumbo) at a glance.
        <MarkdownTabs body={page.body_markdown} title={page.title}
          leadingWidget={
            <PackingMatrix packingOptions={packingOptions} productPackingOptions={[]} />
          }
        />
      ) : page.body_markdown ? (
        // Every other editorial page — auto-tabbed body_markdown.
        <MarkdownTabs body={page.body_markdown} title={page.title} />
      ) : (
        // Pages with no body_markdown — keep ProductDetailBlock for any
        // structured product data they carry (mostly subcategory landings).
        <ProductDetailBlock page={page} commodity={commodity} packingOptions={packingOptions} visibility={visibility} />
      )}

      {/* Products hub — always show every division */}
      {isProductsHub && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 border-t border-[#14161a]/10 egg-reveal">
          <div className="mb-8">
            <span className="egg-eyebrow text-[#0b8f84]">
              <span aria-hidden="true"></span> Product catalogue
            </span>
            <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-2 mt-4">Browse our 6 product divisions</h2>
            <p className="text-[#7a8290]">Each division ships from Egyptian ports under FOB / CIF / CFR Incoterms with per-shipment certificate of analysis.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {PRODUCT_DIVISIONS.map(div => (
              <Link key={div.id} href={div.path}
                className="egg-card relative p-6 group overflow-hidden">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ background: `${div.color}1f`, boxShadow: `inset 0 0 0 1px ${div.color}66` }}>
                    <Icon name={DIVISION_ICON[div.id] || 'box'} className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#14161a] transition-colors">
                    {div.label}
                  </h3>
                  <p className="text-sm text-[#3f4650] mt-1.5 leading-relaxed">{div.blurb}</p>
                  <div className="mt-4 inline-flex items-center text-sm font-semibold text-[#0b8f84] group-hover:gap-2 gap-1 transition-all">
                    Explore {div.label.toLowerCase()} <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Applications hub — Drop 145 grouped-by-source-division layout.
         Each PRODUCT_DIVISIONS gets its own section with the matching
         applications underneath. Apps that serve multiple divisions
         appear under each (clear "where this comes from" signal). */}
      {isApplicationsHub && <ApplicationsHubByDivision />}

      {/* Application landing — show all matching salt products */}
      {isApplicationLanding && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 border-t border-[#14161a]/10 egg-reveal">
          <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-2">
            Salt for {application?.label || 'this industry'}
          </h2>
          <p className="text-[#3f4650] mb-8">
            {applicationProducts.length} {applicationProducts.length === 1 ? 'product' : 'products'} matching this application.
          </p>
          {applicationProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
              {applicationProducts.map(p => (
                <Link key={p.id} href={p.path}
                  className="egg-card group overflow-hidden">
                  <div className="aspect-[16/9] bg-[#f9fafb] overflow-hidden rounded-t-2xl">
                    {p.hero_photo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={p.hero_photo_url} alt={p.title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#14161a]/20 bg-gradient-to-br from-[#f2fbfa] to-[#f9fafb]"><Icon name="cube" className="w-10 h-10" strokeWidth={1.25} /></div>
                    )}
                  </div>
                  <div className="p-4">
                    {p.hs_code && (
                      <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8a93a3] mb-1">HS {p.hs_code}</div>
                    )}
                    <h3 className="text-sm font-semibold text-[#14161a] line-clamp-2 group-hover:text-[#0b8f84] transition-colors">
                      {p.title}
                    </h3>
                    {p.certifications?.length > 0 && (
                      <div className="text-xs text-[#7a8290] mt-1.5 line-clamp-1">{p.certifications.slice(0, 3).join(' · ')}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="egg-panel p-8 text-center text-[#7a8290]">
              No products tagged for this application yet. <Link href="/rfq" className="egg-link">Request a quote →</Link>
            </div>
          )}
        </section>
      )}

      {/* Sub-category landing — show all SKUs in that sub-category
          (e.g. /products/construction/cement-and-clinker → all cement SKUs) */}
      {isSubcategoryLanding && subcategoryProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 border-t border-[#14161a]/10 egg-reveal">
          <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-2">
            {page.title} — full catalogue
          </h2>
          <p className="text-[#3f4650] mb-8">
            {subcategoryProducts.length} {subcategoryProducts.length === 1 ? 'SKU' : 'SKUs'} available for export.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {subcategoryProducts.map(p => (
              <Link key={p.id} href={p.path}
                className="egg-card group overflow-hidden">
                <div className="aspect-[16/9] bg-[#f9fafb] overflow-hidden rounded-t-2xl">
                  {p.hero_photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.hero_photo_url} alt={p.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#14161a]/20" style={{ background: `linear-gradient(135deg, ${cat.color}14, #f9fafb)` }}><Icon name={CATEGORY_ICON[page.category] || 'grid'} className="w-10 h-10" strokeWidth={1.25} /></div>
                  )}
                </div>
                <div className="p-4">
                  {p.hs_code && (
                    <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8a93a3] mb-1">HS {p.hs_code}</div>
                  )}
                  <h3 className="text-sm font-semibold text-[#14161a] line-clamp-2 group-hover:text-[#0b8f84] transition-colors">
                    {p.title}
                  </h3>
                  {p.price_indication && visibility.showPrices ? (
                    <p className="text-xs text-[#d9501a] font-semibold mt-1.5 line-clamp-1">{p.price_indication}</p>
                  ) : p.description ? (
                    <p className="text-xs text-[#7a8290] mt-1 line-clamp-2">{p.description}</p>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Services hub — show every supply-chain service */}
      {isServicesHub && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 border-t border-[#14161a]/10 egg-reveal">
          <div className="mb-8">
            <span className="egg-eyebrow text-[#0b8f84]">
              <span aria-hidden="true"></span> Supply-chain services
            </span>
            <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-2 mt-4">Our supply-chain services</h2>
            <p className="text-[#7a8290]">Logistics, port operations, added value, packing, inspection and trade documentation — all in-house.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {SERVICE_DIVISIONS.map(svc => (
              <Link key={svc.id} href={svc.path}
                className="egg-card relative p-6 group overflow-hidden">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                    style={{ background: `${svc.color}1f`, boxShadow: `inset 0 0 0 1px ${svc.color}66` }}>
                    <Icon name={SERVICE_ICON[svc.id] || 'ship'} className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#14161a] transition-colors">
                    {svc.label}
                  </h3>
                  <p className="text-sm text-[#3f4650] mt-1.5 leading-relaxed">{svc.blurb}</p>
                  <div className="mt-4 inline-flex items-center text-sm font-semibold text-[#0b8f84] group-hover:gap-2 gap-1 transition-all">
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
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 border-t border-[#14161a]/10 egg-reveal">
          <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-8">In this section</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {directChildren.map(p => {
              const childCat = CATEGORY_META[p.category] || cat
              return (
                <Link key={p.id} href={p.path}
                  className="egg-card group p-6 overflow-hidden relative">
                  <h3 className="text-base font-semibold text-[#14161a] group-hover:text-[#0b8f84] transition-colors">
                    {p.title}
                  </h3>
                  {p.description && (
                    <p className="text-sm text-[#7a8290] mt-2 line-clamp-3 leading-relaxed">{p.description}</p>
                  )}
                  <span className="mt-3 inline-flex text-xs font-semibold text-[#0b8f84] group-hover:gap-2 gap-1 transition-all">
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
        <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-10 egg-reveal">
          <h2 className="egg-display text-2xl text-[#14161a] mb-5">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 stagger-children">
            {page.gallery_urls.map((url, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-[#f9fafb] egg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA strip — skip on hubs / division landings (they get their own treatment) */}
      {!isProductsHub && !isServicesHub && !isApplicationsHub && !isApplicationLanding && !isDivisionLanding && !isSubcategoryLanding && (
        <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-14 egg-reveal">
          <div className="relative rounded-3xl overflow-hidden egg-panel p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-5">
            {/* Grid overlay */}
            <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-60 pointer-events-none" />
            {/* Orange glow */}
            <div aria-hidden="true" className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full opacity-30 pointer-events-none"
              style={{ background: 'radial-gradient(circle, #FF6321 0%, transparent 70%)' }} />
            <div className="relative flex-1">
              <div className="egg-eyebrow text-[#d9501a] mb-3">24-hour SLA</div>
              <h3 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-1">Ready for a quote?</h3>
              <p className="text-[#3f4650] leading-relaxed text-sm sm:text-base">FOB / CIF / CFR pricing from 7 Egyptian ports — turnaround within 24 hours.</p>
            </div>
            <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
              className="egg-btn-primary relative">
              Request Quote
            </Link>
          </div>
        </section>
      )}

      {/* Related pages */}
      {related.length > 0 && !isProductsHub && !isServicesHub && !isApplicationsHub && !isApplicationLanding && !isDivisionLanding && !isSubcategoryLanding && directChildren.length === 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 border-t border-[#14161a]/10 egg-reveal">
          <h2 className="egg-display text-2xl sm:text-3xl text-[#14161a] mb-6">More in {cat.label}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
            {related.map(p => (
              <Link key={p.id} href={p.path}
                className="egg-card group overflow-hidden">
                <div className="aspect-[16/9] bg-[#f9fafb] overflow-hidden rounded-t-2xl">
                  {p.hero_photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.hero_photo_url} alt={p.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#14161a]/20"><Icon name={CATEGORY_ICON[p.category] || 'grid'} className="w-8 h-8" strokeWidth={1.25} /></div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-[#14161a] line-clamp-1 group-hover:text-[#0b8f84]">{p.title}</h3>
                  {p.description && <p className="text-xs text-[#7a8290] mt-1 line-clamp-2">{p.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Drop 127 — FAQ accordion + FAQPage JSON-LD (CRO + rich SERP cards) */}
      {(() => {
        const faqs = faqsForPage(page, commodity)
        return faqs.length > 0 ? (
          <div className="bg-[#f9fafb] border-t border-[#14161a]/10">
            <FAQJsonLd qas={faqs.map(f => ({ question: f.question, answer: f.answer }))} />
            <FAQAccordion
              faqs={faqs}
              title={isSkuPage ? `Frequently asked about ${page.title}` : 'Frequently asked questions'}
              subtitle={isSkuPage
                ? 'Common procurement questions for this product. Other questions? Email export@egyptglobe.com.'
                : null}
            />
          </div>
        ) : null
      })()}

      {/* Drop 168 — internal-link cluster (application + wholesale + standard +
           port + blog) on every salt SKU page. Drives ranking equity into the
           new landing pages built in drops 163-166. */}
      {isSkuPage && page.path?.startsWith('/products/salt/') && (
        <SkuRelatedLinks page={page} commodity={commodity} />
      )}

      {/* Drop 127 — sticky mobile RFQ bar on product / SKU pages */}
      {isSkuPage && (
        <StickyRfqBar pageTitle={page.title} pagePath={page.path}
          whatsappUrl="https://wa.me/201007729844" />
      )}
    </article>
  )
}

/**
 * Drop 145 — Applications hub layout grouped by source product division.
 *
 * Renders one section per division (Salt / Cement & Construction / Fertilizers
 * / Chemicals / Agro & Food / Industrial Minerals / Metals & Alloys), each
 * with the applications it supplies. Apps that serve multiple divisions
 * appear under each — buyers immediately see "what cement does for me" vs
 * "what salt does for me" without mixing.
 */
async function ApplicationsHubByDivision() {
  const divisionsList = PRODUCT_DIVISIONS
  // Drop 154 — pull the actual SKU count per (app × division) so we can
  // (a) show "(N)" badges per app card and (b) auto-prune (app × division)
  // pairs that have zero matching SKUs.
  const matrix = await getApplicationDivisionMatrix()

  // Build {divisionId: [app, ...]} map by walking APPLICATIONS.divisions[]
  // BUT only include the app under that division if it has at least 1 SKU
  // there. Falls back to the static include if the matrix lookup is empty
  // (so we never show a fully empty hub if the catalogue query failed).
  const matrixIsEmpty = !matrix || Object.keys(matrix).length === 0
  const grouped = {}
  for (const d of divisionsList) grouped[d.id] = []
  for (const app of APPLICATIONS) {
    for (const divId of (app.divisions || [])) {
      if (!grouped[divId]) continue
      const count = matrix?.[app.id]?.[divId] || 0
      if (matrixIsEmpty || count > 0) {
        grouped[divId].push({ ...app, _count: count })
      }
    }
  }

  // Total count for the summary line
  const totalApps = APPLICATIONS.length
  const divisionsWithApps = divisionsList.filter(d => grouped[d.id].length > 0)

  return (
    <article>
      {/* Hub intro */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-[#14161a]/10 egg-reveal">
        <div className="mb-10 max-w-3xl">
          <span className="egg-eyebrow text-[#7c3aed]">
            <span aria-hidden="true"></span> Industries we serve
          </span>
          <h2 className="egg-display text-3xl sm:text-4xl lg:text-5xl text-[#14161a] mt-4 mb-3">
            {totalApps} industries — grouped by the division that supplies them.
          </h2>
          <p className="text-[#3f4650] leading-relaxed">
            Egypt Globe Group's 7 product divisions serve {totalApps} distinct
            industries worldwide. Pick the division you source from, then drill
            into the application landing for matching SKUs, certifications,
            packing formats and lead times.
          </p>
        </div>

        {/* Quick-jump nav chips — scroll to per-division section */}
        <nav className="flex flex-wrap gap-2 mb-8" aria-label="Jump to division">
          {divisionsWithApps.map(d => (
            <a key={d.id} href={`#${d.id}`}
              className="egg-chip text-xs hover:text-[#14161a] transition-all hover:shadow-[inset_0_0_0_1.5px_rgba(20,22,26,.35)]">
              <Icon name={DIVISION_ICON[d.id] || 'box'} className="w-3.5 h-3.5" />
              {d.label}
              <span className="ml-1 text-[10px] font-bold tabular-nums text-[#8a93a3]">{grouped[d.id].length}</span>
            </a>
          ))}
        </nav>
      </section>

      {/* Per-division sections */}
      {divisionsWithApps.map(d => {
        const apps = grouped[d.id]
        // Drop 154 — sum SKU counts across all apps in this division so the
        // header shows total exporting volume from this division
        const divisionSkuTotal = apps.reduce((sum, a) => sum + (a._count || 0), 0)
        return (
          <section key={d.id} id={d.id}
            className="border-t border-[#14161a]/10 scroll-mt-24 egg-reveal"
            style={{ background: `linear-gradient(180deg, ${d.color}0a 0%, #ffffff 80%)` }}>
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 sm:py-14">
              {/* Section header — branded by division colour */}
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: `${d.color}1f`, boxShadow: `inset 0 0 0 1px ${d.color}66` }}>
                  <Icon name={DIVISION_ICON[d.id] || 'box'} className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="egg-display text-3xl sm:text-4xl text-[#14161a]">
                      {d.label}
                    </h3>
                    <Link href={d.path} className="egg-chip text-xs text-[#3f4650] hover:text-[#14161a] transition-all hover:shadow-[inset_0_0_0_1.5px_rgba(20,22,26,.35)]">
                      View {d.label.toLowerCase()} →
                    </Link>
                  </div>
                  <p className="text-sm text-[#7a8290] leading-relaxed max-w-2xl">{d.blurb}</p>
                  <div className="mt-2 text-[10px] font-mono text-[#8a93a3] uppercase tracking-[0.18em]">
                    {apps.length} application{apps.length === 1 ? '' : 's'} served from this division
                    {divisionSkuTotal > 0 && (
                      <span className="ml-1.5 text-[#7a8290]">
                        · {divisionSkuTotal} SKU{divisionSkuTotal === 1 ? '' : 's'} matched
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Application cards — branded with division colour ring */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 stagger-children">
                {apps.map(a => (
                  <Link key={a.id} href={a.path}
                    className="egg-card group p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: `${d.color}1f`, boxShadow: `inset 0 0 0 1px ${d.color}66` }}>
                        <Icon name={APPLICATION_ICON[a.id] || 'factory'} className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-1.5 mb-1">
                          <h4 className="flex-1 font-semibold text-sm text-[#14161a] group-hover:text-[#0b8f84] transition-colors leading-tight">
                            {a.label}
                          </h4>
                          {a._count > 0 && (
                            <span
                              className="flex-shrink-0 inline-flex items-center justify-center min-w-[26px] h-[20px] px-1.5 rounded-full text-[10px] font-bold tabular-nums"
                              style={{ background: `${d.color}15`, color: d.color }}
                              title={`${a._count} ${d.label} SKU${a._count === 1 ? '' : 's'} match this application`}>
                              {a._count}
                            </span>
                          )}
                        </div>
                        {a.blurb && (
                          <p className="text-[11px] text-[#7a8290] leading-relaxed line-clamp-2">{a.blurb}</p>
                        )}
                        {/* If this app is also served by other divisions WITH
                           at least one matching SKU, show small chips so
                           buyers see the multi-source option (Drop 154 prunes
                           empties using the matrix). */}
                        {(() => {
                          const otherDivIds = (a.divisions || []).filter(id => {
                            if (id === d.id) return false
                            // When matrix is populated, only show divisions that
                            // actually have matching SKUs; otherwise fall back
                            // to static list (defensive — empty matrix path).
                            if (matrixIsEmpty) return true
                            return (matrix?.[a.id]?.[id] || 0) > 0
                          })
                          if (otherDivIds.length === 0) return null
                          return (
                            <div className="flex flex-wrap items-center gap-1 mt-2 text-[9px] font-semibold uppercase tracking-wider text-[#8a93a3]">
                              <span>Also from:</span>
                              {otherDivIds.slice(0, 3).map(otherId => {
                                const other = PRODUCT_DIVISIONS.find(x => x.id === otherId)
                                if (!other) return null
                                const otherCount = matrix?.[a.id]?.[otherId] || 0
                                return (
                                  <span key={otherId} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#f3f4f6]"
                                    style={{ color: other.color }}>
                                    <Icon name={DIVISION_ICON[other.id] || APPLICATION_ICON[other.id] || 'box'} className="w-3 h-3" />{other.label}
                                    {otherCount > 0 && <span className="text-[#8a93a3]">·{otherCount}</span>}
                                  </span>
                                )
                              })}
                            </div>
                          )
                        })()}
                      </div>
                      <span className="text-[#c9ced6] group-hover:text-[#ff6321] transition-colors mt-1">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16 egg-reveal">
        <div className="relative overflow-hidden egg-panel p-8 sm:p-10 text-center">
          <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-60 pointer-events-none" />
          <div aria-hidden="true" className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #FF6321 0%, transparent 70%)' }} />
          <h3 className="egg-display relative text-3xl sm:text-4xl text-[#14161a] mb-3">
            Don't see your industry?
          </h3>
          <p className="relative text-[#3f4650] mb-6 max-w-2xl mx-auto">
            We export to 60+ countries across many sub-industries beyond the
            ones listed here. Submit your sourcing requirement and we'll match
            it to the right division within 24 hours.
          </p>
          <Link href="/rfq" className="egg-btn-primary relative">
            Request a Quote
          </Link>
        </div>
      </section>
    </article>
  )
}

/* Buyer-scope guard — shown when an authenticated buyer hits a page
   outside their visible_paths/visible_categories scope. Anon users
   never hit this branch (they have visibleAll=true). */
function AccessRestricted({ page, visibility }) {
  return (
    <article>
      <section className="relative bg-white min-h-[60vh] flex items-center overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-60 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-5 sm:px-6 lg:px-8 py-20 text-center">
          <div className="text-5xl mb-4"><Icon name="lock" className="w-3.5 h-3.5" /></div>
          <h1 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">{page.title}</h1>
          <p className="text-[#3f4650] mb-8 leading-relaxed">
            This product is outside the catalogue scope assigned to your buyer
            profile. If you'd like access, contact our export desk and we'll
            review your sourcing requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="mailto:export@egyptglobe.com?subject=Catalogue%20access%20request"
              className="egg-btn-primary">
              <Icon name="mail" className="w-3.5 h-3.5" /> Request access
            </a>
            <Link href="/buyer"
              className="egg-btn-ghost">
              ← Back to your dashboard
            </Link>
          </div>
        </div>
      </section>
    </article>
  )
}
