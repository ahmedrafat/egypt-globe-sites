/**
 * /coa — Certificate of Analysis center.
 *
 * Drop 146 — public-facing browse of every active CoA across all
 * commodities, grouped by market region. Buyers land here from the
 * footer or from product pages and can filter by region or commodity.
 *
 * Light editorial edition — tokens + utilities (.egg-*) in app/globals.css.
 */
import { routeOpenGraph } from '../../lib/seo'
import HeroBackdrop from '../../components/HeroBackdrop'
import Link from 'next/link'
import { getCoaSummary } from '../../lib/corporatePages'
import Icon from '../../components/ui/Icon'
import CoaFilter from '../../components/CoaFilter'

const HERO_BANNER = '/banners/coa.jpg'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Certificate of Analysis Center',
  description: 'Independent TÜV Austria / SGS / Intertek / Bureau Veritas certificates of analysis for every Egypt Globe Group commodity, organised by destination market region (Europe, GCC, East Africa, Far East, South Asia, Mediterranean, Americas).',
  alternates: { canonical: 'https://egyptglobe.com/coa' },
  openGraph: routeOpenGraph({ path: '/coa' }),
}

const REGION_META = {
  GLOBAL:           { icon: 'globe', label: 'Global / default',  color: '#64748b' },
  Europe:           { icon: 'dot', label: 'Europe',             color: '#1d4ed8' },
  'North Europe':   { icon: 'snow', label: 'North Europe',       color: '#0891b2' },
  Mediterranean:    { icon: 'wave', label: 'Mediterranean',      color: '#0284c7' },
  GCC:              { icon: 'building', label: 'GCC / Saudi',        color: '#059669' },
  'East Africa':    { icon: 'globe', label: 'East Africa',        color: '#d97706' },
  'West Africa':    { icon: 'globe', label: 'West Africa',        color: '#b45309' },
  'South Asia':     { icon: 'globe', label: 'South Asia',         color: '#e11d48' },
  'Far East':       { icon: 'globe', label: 'Far East',           color: '#db2777' },
  Americas:         { icon: 'globe', label: 'Americas',           color: '#7c3aed' },
}

function regionMeta(r) {
  return REGION_META[r] || { icon: 'pin', label: r, color: '#475569' }
}

function fmtDate(d) {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return '—' }
}

const TONE = '#087a70'

export default async function CoaCenter() {
  const coas = await getCoaSummary({ limit: 200 })

  // Group by region
  const byRegion = {}
  for (const c of coas) {
    const k = c.market_region || 'GLOBAL'
    if (!byRegion[k]) byRegion[k] = []
    byRegion[k].push(c)
  }

  // Canonical region order — most-shipped first
  const regionOrder = ['GLOBAL', 'East Africa', 'GCC', 'Mediterranean', 'Europe', 'Far East', 'South Asia', 'North Europe', 'Americas', 'West Africa']
  const regions = [...regionOrder.filter(r => byRegion[r]?.length), ...Object.keys(byRegion).filter(r => !regionOrder.includes(r))]

  // Division chips for the filter — first path segment under /products
  const divOf = c => (c.commodities?.page_path || '').split('/')[2] || 'other'
  const divCounts = {}
  for (const c of coas) divCounts[divOf(c)] = (divCounts[divOf(c)] || 0) + 1
  const divisions = Object.entries(divCounts).sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ id, count, label: id.charAt(0).toUpperCase() + id.slice(1) }))

  // KPI counts
  const totalCoas = coas.length
  const totalCommodities = new Set(coas.map(c => c.commodity_id)).size
  const totalLabs = new Set(coas.map(c => c.lab_name)).size

  return (
    <article className="bg-white text-[#14161a]">
      {/* Hero — commissioned banner under the navy band (Oct 2026) */}
      <section data-hero className="egg-hero-dark relative overflow-hidden border-b border-[#ff5a18]/60">
        <HeroBackdrop src={HERO_BANNER} />
        <div aria-hidden="true" className="absolute inset-0 egg-grid-dark opacity-60 pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(55% 55% at 88% 0%, rgba(15,181,165,.2), transparent 60%), radial-gradient(40% 45% at 0% 100%, rgba(255,99,33,.09), transparent 60%)' }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-xs text-[#5b6577] mb-5 flex-wrap">
            <Link href="/" className="hover:text-[#14161a] transition-colors">Home</Link>
            <span>›</span>
            <span className="text-[#14161a] font-medium">Certificate of Analysis Center</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="egg-chip text-xs" style={{ color: '#7fe3d8', boxShadow: 'inset 0 0 0 1px rgba(15,181,165,.6)' }}>
              <Icon name="shield" className="w-3.5 h-3.5" /> Independent TÜV Austria / SGS / Intertek / Bureau Veritas
            </span>
            <span className="egg-chip text-xs">
              {totalCoas} active CoAs
            </span>
            <span className="egg-chip text-xs">
              {totalCommodities} commodities
            </span>
            <span className="egg-chip text-xs">
              {regions.length} {regions.length === 1 ? 'market' : 'markets'}
            </span>
          </div>

          <h1 className="egg-display text-4xl sm:text-5xl lg:text-6xl text-[#14161a] mb-4 leading-[1.02]">
            Certificate of Analysis Center
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-3xl text-[#3f4650]">
            Every Egypt Globe Group commodity ships with an independent third-party
            CoA from TÜV Austria Egypt, SGS Egypt, Intertek Cairo or Bureau Veritas Egypt. Region-specific
            certificates attest compliance with each destination market's standard
            (EN 197-1 / ASTM C150 / GB/T / KEBS / SASO / FCO etc.).
          </p>
        </div>
      </section>

      {/* Filter + region quick-jump */}
      <section className="bg-white border-b border-[#14161a]/10 sticky top-0 z-10 backdrop-blur-md bg-white/85">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3 space-y-2.5">
          <CoaFilter divisions={divisions} total={coas.length} />
          {regions.length > 1 && (
            <div className="overflow-x-auto" tabIndex={0}>
              <div className="flex gap-2 min-w-max">
                {regions.map(r => {
                  const meta = regionMeta(r)
                  return (
                    <a key={r} href={`#${r.replace(/\s+/g, '-')}`}
                      className="egg-chip text-xs hover:text-[#14161a] transition-all hover:shadow-[inset_0_0_0_1.5px_rgba(20,22,26,.35)] whitespace-nowrap">
                      <Icon name={meta.icon} className="w-3.5 h-3.5" />
                      {meta.label}
                      <span className="ml-1 text-[11px] font-bold tabular-nums text-[#67707f]">{byRegion[r].length}</span>
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Per-region sections */}
      {regions.map(r => {
        const meta = regionMeta(r)
        const items = byRegion[r]
        return (
          <section key={r} id={r.replace(/\s+/g, '-')} data-coa-section
            className="border-t border-[#14161a]/10 scroll-mt-20 egg-reveal"
            style={{ background: `linear-gradient(180deg, ${meta.color}0a 0%, #ffffff 80%)` }}>
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
              {/* Section header */}
              <div className="flex items-start gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ring-1 ring-[#14161a]/15 text-[#14161a]"><Icon name={meta.icon} className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0">
                  <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">
                    {meta.label}
                  </h2>
                  <p className="text-sm text-[#5b6577] mt-0.5">
                    {items.length} active certificate{items.length === 1 ? '' : 's'} ·
                    {' '}{new Set(items.map(c => c.commodity_id)).size} commodit{new Set(items.map(c => c.commodity_id)).size === 1 ? 'y' : 'ies'}
                  </p>
                </div>
              </div>

              {/* CoA cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map(c => {
                  const com = c.commodities
                  return (
                    <Link key={c.id} href={com?.page_path || '/products'}
                      data-coa-card data-division={divOf(c)}
                      data-text={`${c.ref_code} ${com?.name || ''} ${c.lab_name || ''} ${c.overall_result || ''}`.toLowerCase()}
                      className="egg-card group p-4">
                      <div className="flex items-start gap-2.5">
                        <span className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-[#14161a]"
                          style={{ background: `${meta.color}1f`, boxShadow: `inset 0 0 0 1px ${meta.color}66` }} aria-hidden="true">
                          <Icon name={meta.icon} className="w-[18px] h-[18px]" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <span className="font-mono text-[11px] font-bold text-[#3f4650] bg-[#f3f4f6] px-1.5 py-0.5 rounded">{c.ref_code}</span>
                            {c.pass_fail === true && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#e6fbf8] text-[#087a70] border border-[#0fb5a5]/40">
                                ✓ Pass
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm text-[#14161a] group-hover:text-[#087a70] transition-colors leading-tight line-clamp-2">
                            {com?.name || 'Commodity'}
                          </h3>
                          <p className="text-[11px] text-[#5b6577] mt-1 leading-snug">
                            {c.lab_name} · Issued {fmtDate(c.issue_date)}
                          </p>
                          {c.overall_result && (
                            <p className="text-[11px] text-[#087a70] font-semibold mt-1 line-clamp-2">{c.overall_result}</p>
                          )}
                        </div>
                        <span className="text-[#67707f] group-hover:text-[#c2410c] transition-colors mt-1">→</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })}

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16 egg-reveal">
        <div className="egg-panel relative overflow-hidden p-8 sm:p-10 text-center">
          <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-60 pointer-events-none" />
          <div aria-hidden="true" className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-40 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #0fb5a5 0%, transparent 70%)' }} />
          <h2 className="egg-display relative text-3xl sm:text-4xl text-[#14161a] mb-3">
            Need a CoA for your specific shipment?
          </h2>
          <p className="relative text-[#3f4650] mb-6 max-w-2xl mx-auto">
            Per-shipment Certificate of Analysis issued from independent TÜV Austria / SGS / Intertek / Bureau Veritas labs,
            attesting compliance with your destination market's standard. Available on dispatch.
          </p>
          <Link href="/rfq?type=coa"
            className="egg-btn-primary relative">
            <Icon name="beaker" className="w-3.5 h-3.5" /> Request CoA
          </Link>
        </div>
      </section>
    </article>
  )
}
