/**
 * PageRenderer — shared layout for any egg_corporate_pages row.
 *
 * Renders: hero + breadcrumb, body markdown, gallery grid, child grid
 * (if this page has direct sub-pages — eg /products → 6 divisions),
 * and a "More in <category>" related strip. Light theme + entrance
 * animations on every section.
 */
import Link from 'next/link'
import MarkdownBody from './MarkdownBody'
import {
  getRelatedPages,
  getDirectChildren,
  getPagesInCategory,
  CATEGORY_META,
  PRODUCT_DIVISIONS,
} from '../lib/corporatePages'

const PRODUCT_DIVISION_BY_PATH = Object.fromEntries(PRODUCT_DIVISIONS.map(d => [d.path, d]))
const PRODUCT_DIVISION_BY_CATEGORY = Object.fromEntries(PRODUCT_DIVISIONS.map(d => [d.id, d]))

export default async function PageRenderer({ page }) {
  const cat = CATEGORY_META[page.category] || CATEGORY_META.other

  // Decide what to show below the body:
  // - On /products → list every product division as tiles (PRODUCT_DIVISIONS)
  // - On /products/<division> landing → list every page in that category
  // - On any other page with direct children → show those children
  // - Always show a related-pages strip at the bottom (same category)
  const isProductsHub = page.path === '/products'
  const isDivisionLanding = !!PRODUCT_DIVISION_BY_PATH[page.path]
  const division = PRODUCT_DIVISION_BY_PATH[page.path]
  const directChildren = !isProductsHub && !isDivisionLanding
    ? await getDirectChildren(page.path)
    : []
  const divisionPages = isDivisionLanding
    ? await getPagesInCategory(division.id, { excludePath: page.path })
    : []
  const related = await getRelatedPages(page, 4)

  return (
    <article>
      {/* Hero */}
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
          {/* Breadcrumb chip */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Link href="/" className="text-xs font-medium text-slate-500 hover:text-[#1d5fa1] transition-colors">
              Home
            </Link>
            <span className="text-slate-400 text-xs">›</span>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cat.tone}`}>
              <span aria-hidden="true">{cat.icon}</span> {cat.label}
            </span>
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

      {/* Generic page — show direct children if any */}
      {!isProductsHub && !isDivisionLanding && directChildren.length > 0 && (
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

      {/* CTA strip */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="rounded-3xl bg-gradient-to-br from-[#1d5fa1] to-[#14467a] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl shadow-blue-900/10">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-1">Ready for a quote?</h3>
            <p className="text-blue-100 leading-relaxed">FOB / CIF / CFR pricing from 7 Egyptian ports — turnaround within 24 hours.</p>
          </div>
          <Link href="/rfq"
            className="bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-7 py-3.5 rounded-xl shadow-lg whitespace-nowrap transition-all hover:-translate-y-0.5">
            📋 Request Quote
          </Link>
        </div>
      </section>

      {/* Related pages — only when there's no nested grid above */}
      {related.length > 0 && !isProductsHub && !isDivisionLanding && directChildren.length === 0 && (
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
