/**
 * RichSubcategoryLanding — a product line: /products/<division>/<line>.
 *
 * Sep 2026 edition, built on the rock-salt / sea-salt source pages: the
 * division hub is the overview, and each product line is where a buyer
 * reads the line's specification window, where it loads, what it serves,
 * and browses its SKUs.
 *
 * Layout:
 *   1. Dark hero (commissioned banner when the row carries one), breadcrumb,
 *      chips, H1, lede, stats, dual CTA
 *   2. At a glance — reference table built from the commodities behind the
 *      SKUs (lib/productLines.js) + loading ports + destination regions
 *   3. SKU catalogue
 *   4. Technical narrative from the CMS (closing quote section dropped)
 *   5. Applications served
 *   6. Other lines in the division
 *   7. FAQs, closing CTA
 *
 * Vector protocol: monochrome micro-icons only — no emoji, no watermarks.
 */
import { crumbLabel } from '../lib/headings'
import CardImage from './ui/CardImage'
import HeroMotif from './HeroMotif'
import HeroBackdrop, { isBanner } from './HeroBackdrop'
import Link from 'next/link'
import { cardUrl } from '../lib/corporatePages'
import { summarizeFacts, glanceRows, applicationsForTags, portPage, withoutQuoteSection, fmtMoq, lineLabel } from '../lib/productLines'
import RichPageBody from './RichPageBody'
import HubFaqs from './HubFaqs'
import { heroCopy } from '../lib/heroCopy'
import { DataTable } from './QaChainTable'
import Icon, { DIVISION_ICON, APPLICATION_ICON } from './ui/Icon'

const STAT_COLS = { 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' }

export default function RichSubcategoryLanding({ page, division, skus, siblingSubcats, facts, visibility }) {
  const list = skus || []
  // Only facts for SKUs the visitor can actually see on this page.
  const visible = new Set(list.map(p => p.path))
  const lineFacts = (facts || []).filter(f => visible.has(f.page_path))
  const factByPath = Object.fromEntries(lineFacts.map(f => [f.page_path, f]))
  const s = summarizeFacts(lineFacts)
  // Industries come from the page-level tags — the same ones the
  // /applications pages match on, so every card leads to a page that lists
  // these SKUs. (commodities.applications holds generic placeholders.)
  const apps = applicationsForTags(list.flatMap(p => p.applications || []))
  const tone = division.color
  const divIcon = DIVISION_ICON[division.id] || 'box'
  const n = list.length
  const label = lineLabel(page)
  const hero = heroCopy(page)
  const quote = `/rfq?product=${encodeURIComponent(page.path)}`
  const banner = isBanner(page.hero_photo_url)

  const statTiles = [
    { big: String(n), label: n === 1 ? 'SKU in this line' : 'SKUs in this line' },
    s.moq ? { big: fmtMoq(s.moq).replace(' MT', ''), label: 'MOQ, metric tonnes' } : null,
    s.ports.length ? { big: String(s.ports.length), label: s.ports.length === 1 ? 'Loading port' : 'Loading ports' } : null,
    apps.length ? { big: String(apps.length), label: apps.length === 1 ? 'Industry served' : 'Industries served' } : null,
  ].filter(Boolean)

  return (
    <article className="bg-white text-[#14161a]">
      {/* Hero */}
      <section data-hero className="egg-hero-dark relative overflow-hidden border-b border-[#ff5a18]/60">
        {banner && <HeroBackdrop src={page.hero_photo_url} />}
        <div aria-hidden="true" className="absolute inset-0 egg-grid-dark opacity-60 pointer-events-none" />
        {!banner && <HeroMotif category={page.category} path={page.path} tone={tone} />}

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-24">
          <nav className="flex items-center gap-2 text-xs mb-5 flex-wrap animate-fade-in" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>›</span>
            <Link href="/products">Products</Link><span>›</span>
            <Link href={division.path}>{division.label}</Link><span>›</span>
            <span className="font-medium" aria-current="page">{crumbLabel(page)}</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in-up">
            <span className="egg-chip text-xs"><Icon name={divIcon} className="w-3.5 h-3.5" /> {division.label}</span>
            <span className="egg-chip text-xs">{n} {n === 1 ? 'SKU' : 'SKUs'}</span>
            {s.hs[0] && <span className="egg-chip font-mono text-[11px]">HS {s.hs.length > 1 ? s.hs[0].slice(0, 4) : s.hs[0]}</span>}
            <span className="egg-chip text-xs font-mono tracking-[0.08em]">FOB · CIF · CFR</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h1 className="egg-display text-4xl sm:text-5xl lg:text-6xl mb-4 leading-[1.02]">
                {hero.heading || page.title}
                {hero.sub && <span className="block italic text-2xl sm:text-3xl lg:text-4xl mt-3 leading-[1.15]">{hero.sub}</span>}
              </h1>
              {(hero.lede || page.description) && (
                <p className="text-base sm:text-lg leading-relaxed max-w-3xl">{hero.lede || page.description}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Link href={quote} className="egg-btn-primary">Get Quote</Link>
              {n > 0 && <Link href="#catalogue" className="egg-btn-ghost">Browse {n} {n === 1 ? 'SKU' : 'SKUs'} →</Link>}
            </div>
          </div>

          {statTiles.length >= 2 && (
            <div className={`mt-12 grid grid-cols-2 ${STAT_COLS[statTiles.length] || 'lg:grid-cols-4'} gap-px rounded-2xl overflow-hidden ring-1 ring-[#14161a]/10 bg-[#14161a]/10`}>
              {statTiles.map(x => (
                <div key={x.label} className="bg-white/90 backdrop-blur px-5 py-5">
                  <div className="egg-display text-3xl sm:text-4xl tracking-tight" style={{ color: tone }}>{x.big}</div>
                  <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#5b6577] mt-2">{x.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* At a glance */}
      {lineFacts.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="egg-eyebrow text-[#087a70] mb-3">{division.label} · product line</div>
            <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-4">{label} at a glance</h2>
            <p className="text-[#3f4650] leading-relaxed mb-6 max-w-2xl">
              Commercial and logistics terms across the {n} {n === 1 ? 'SKU' : 'SKUs'} in this line. Each SKU page carries
              its own specification sheet and test methods; every lot is analysed before the Bill of Lading.
            </p>
            <DataTable
              title={`${label} — commercial reference`}
              icon="layers"
              head={['Term', label]}
              rows={glanceRows(s)}
              note="Taken from the SKU records in this line. Grade-specific limits and test methods are on each SKU page."
            />
          </div>
          <aside className="lg:col-span-5 space-y-6">
            {apps.length === 1 && (
              <div className="egg-card p-6">
                <div className="egg-eyebrow text-[#7c3aed] mb-3">Industry served</div>
                <Link href={apps[0].path} className="group flex items-center gap-3">
                  <span className="inline-flex w-10 h-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-[#14161a]/15 text-[#14161a] group-hover:ring-[#7c3aed]/60 transition-colors">
                    <Icon name={APPLICATION_ICON[apps[0].id] || 'factory'} className="w-5 h-5" />
                  </span>
                  <span className="font-semibold text-sm text-[#14161a] group-hover:text-[#087a70] transition-colors">{apps[0].label} →</span>
                </Link>
              </div>
            )}
            {s.ports.length > 0 && (
              <div className="egg-card p-6">
                <div className="egg-eyebrow mb-3">Loading ports</div>
                <ul className="grid grid-cols-2 gap-2">
                  {s.ports.map(name => {
                    const href = portPage(name)
                    const inner = (<>
                      <span className="shrink-0 text-[#087a70]"><Icon name="anchor" className="w-3.5 h-3.5" /></span>
                      <span className="text-sm font-semibold text-[#14161a] group-hover:underline underline-offset-4">{name}</span>
                    </>)
                    return (
                      <li key={name}>
                        {href
                          ? <Link href={href} className="group flex items-center gap-2 rounded-xl border border-[#14161a]/10 px-3 py-2.5 hover:border-[#14161a]/30 transition-colors">{inner}</Link>
                          : <span className="flex items-center gap-2 rounded-xl border border-[#14161a]/10 px-3 py-2.5">{inner}</span>}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {s.regions.length > 0 && (
              <div className="egg-card p-6">
                <div className="egg-eyebrow mb-3">Shipped to</div>
                <div className="flex flex-wrap gap-2">
                  {s.regions.map(r => <span key={r} className="egg-chip text-xs">{r}</span>)}
                </div>
                <Link href="/global-presence" className="egg-link text-sm mt-4 inline-flex">Global presence →</Link>
              </div>
            )}
            {s.certs.length > 0 && (
              <div className="egg-card p-6">
                <div className="egg-eyebrow mb-3">Standards &amp; documents</div>
                <div className="flex flex-wrap gap-2">
                  {s.certs.slice(0, 10).map(c => (
                    <span key={c} className="egg-chip text-xs text-[#087a70]" style={{ boxShadow: 'inset 0 0 0 1px rgba(15,181,165,.45)' }}>
                      <Icon name="check" className="w-3 h-3" strokeWidth={2.4} /> {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </section>
      )}

      {/* Catalogue */}
      {n > 0 && (
        <section id="catalogue" className="bg-[#f9fafb] py-16 border-y border-[#14161a]/10 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
              <div>
                <div className="egg-eyebrow text-[#087a70] mb-2">{label} catalogue</div>
                <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">{n} {n === 1 ? 'product' : 'products'} ready for export</h2>
              </div>
              <Link href={quote} className="egg-link text-sm">Quote any combination →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {list.map(p => {
                const f = factByPath[p.path]
                return (
                  <Link key={p.id} href={p.path} className="egg-card group overflow-hidden">
                    <div className="aspect-[16/9] overflow-hidden rounded-t-2xl" style={{ background: `linear-gradient(135deg, ${tone}1a, #f9fafb)` }}>
                      {cardUrl(p) ? (
                        <CardImage src={cardUrl(p)} className="group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#14161a]/20"><Icon name={divIcon} className="w-10 h-10" strokeWidth={1.25} /></div>
                      )}
                    </div>
                    <div className="p-4">
                      {(p.hs_code || f?.hs_code) && <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#67707f] mb-1">HS {p.hs_code || f.hs_code}</div>}
                      <h3 className="text-sm font-semibold text-[#14161a] line-clamp-2 group-hover:text-[#087a70] transition-colors min-h-[2.5em]">{p.title}</h3>
                      {p.price_indication && visibility?.showPrices ? (
                        <p className="text-xs text-[#c2410c] font-semibold mt-1.5 line-clamp-1">{p.price_indication}</p>
                      ) : f?.origin ? (
                        <div className="text-xs text-[#5b6577] mt-1.5 line-clamp-1">{f.origin}{f.moq_mt ? ` · MOQ ${Number(f.moq_mt).toLocaleString('en-US')} MT` : ''}</div>
                      ) : null}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Technical narrative from the CMS */}
      {page.body_markdown && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 sm:py-20">
          <RichPageBody content={withoutQuoteSection(page.body_markdown)} title={page.title} />
        </section>
      )}

      {/* Applications */}
      {apps.length > 1 && (
        <section className="bg-[#f9fafb] py-16 sm:py-20 border-y border-[#14161a]/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <div className="egg-eyebrow text-[#7c3aed] mb-3">{label} by industry</div>
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">
                {apps.length} industries served
              </h2>
              <p className="text-[#3f4650]">Each industry page carries its own specification window, standards and the matching SKUs.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {apps.map(a => (
                <Link key={a.id} href={a.path} className="egg-card group p-5 flex items-center gap-3">
                  <span className="inline-flex w-10 h-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-[#14161a]/15 text-[#14161a] group-hover:ring-[#7c3aed]/60 transition-colors">
                    <Icon name={APPLICATION_ICON[a.id] || 'factory'} className="w-5 h-5" />
                  </span>
                  <span className="font-semibold text-sm text-[#14161a] group-hover:text-[#087a70] transition-colors">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other lines in the division */}
      {(siblingSubcats || []).length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
            <div>
              <div className="egg-eyebrow text-[#087a70] mb-2">{division.label}</div>
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">Other product lines in {division.label.toLowerCase()}</h2>
            </div>
            <Link href={division.path} className="egg-link text-sm">{division.label} overview →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {siblingSubcats.map(sc => (
              <Link key={sc.id} href={sc.path} className="egg-card group p-4 flex items-center gap-3">
                <span className="inline-flex w-9 h-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-[#14161a]/15 text-[#14161a] group-hover:ring-[#087a70]/50 transition-colors">
                  <Icon name={divIcon} className="w-4 h-4" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-[#14161a] group-hover:text-[#087a70] transition-colors text-sm leading-snug">{lineLabel(sc)}</span>
                  {sc.sku_count > 0 && <span className="block text-[11px] font-mono text-[#5b6577] mt-0.5">{sc.sku_count} {sc.sku_count === 1 ? 'SKU' : 'SKUs'}</span>}
                </span>
                <span className="ml-auto text-[#087a70] opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <HubFaqs page={page} />

      {/* Closing CTA */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20">
        <div className="egg-panel p-10 sm:p-14 text-center relative overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-60 pointer-events-none" />
          <h2 className="egg-display relative text-3xl sm:text-4xl text-[#14161a] mb-3">Send the specification and the tonnage.</h2>
          <p className="relative text-[#3f4650] text-lg mb-7 max-w-2xl mx-auto">
            Grade, packing, destination and quantity — the export desk comes back with a priced FOB / CIF / CFR offer
            for {label} once stock, laycan and freight are confirmed.
          </p>
          <Link href={quote} className="egg-btn-primary relative px-8 py-4">Request a Quote</Link>
        </div>
      </section>
    </article>
  )
}
