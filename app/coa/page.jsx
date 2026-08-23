/**
 * /coa — Certificate of Analysis center.
 *
 * Drop 146 — public-facing browse of every active CoA across all
 * commodities, grouped by market region. Buyers land here from the
 * footer or from product pages and can filter by region or commodity.
 *
 * Light editorial edition — tokens + utilities (.egg-*) in app/globals.css.
 */
import HeroMotif from '../../components/HeroMotif'
import Link from 'next/link'
import { getCoaSummary } from '../../lib/corporatePages'
import Icon from '../../components/ui/Icon'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Certificate of Analysis Center',
  description: 'Independent TÜV Austria / SGS / Intertek / Bureau Veritas certificates of analysis for every Egypt Globe Group commodity, organised by destination market region (Europe, GCC, East Africa, Far East, South Asia, Mediterranean, Americas).',
  alternates: { canonical: 'https://egyptglobe.com/coa' },
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

const TONE = '#0b8f84'

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

  // KPI counts
  const totalCoas = coas.length
  const totalCommodities = new Set(coas.map(c => c.commodity_id)).size
  const totalLabs = new Set(coas.map(c => c.lab_name)).size

  return (
    <article className="bg-white text-[#14161a]">
      {/* Hero — white editorial banner with turquoise glow */}
      <section className="relative overflow-hidden bg-white border-b border-[#14161a]/10">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        {/* calibrated lab instrument */}
        <HeroMotif variant="dial" tone="#0fb5a5" />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(55% 55% at 88% 0%, rgba(15,181,165,.2), transparent 60%), radial-gradient(40% 45% at 0% 100%, rgba(255,99,33,.09), transparent 60%)' }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-xs text-[#7a8290] mb-5 flex-wrap">
            <Link href="/" className="hover:text-[#14161a] transition-colors">Home</Link>
            <span>›</span>
            <span className="text-[#14161a] font-medium">Certificate of Analysis Center</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="egg-chip text-xs" style={{ color: TONE, boxShadow: 'inset 0 0 0 1px rgba(15,181,165,.5)' }}>
              <Icon name="shield" className="w-3.5 h-3.5" /> Independent TÜV Austria / SGS / Intertek / Bureau Veritas
            </span>
            <span className="egg-chip text-xs">
              {totalCoas} active CoAs
            </span>
            <span className="egg-chip text-xs">
              {totalCommodities} commodities
            </span>
            <span className="egg-chip text-xs">
              {regions.length} markets
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

      {/* Region quick-jump nav */}
      <section className="bg-white border-b border-[#14161a]/10 sticky top-0 z-10 backdrop-blur-md bg-white/85">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {regions.map(r => {
              const meta = regionMeta(r)
              return (
                <a key={r} href={`#${r.replace(/\s+/g, '-')}`}
                  className="egg-chip text-xs hover:text-[#14161a] transition-all hover:shadow-[inset_0_0_0_1.5px_rgba(20,22,26,.35)] whitespace-nowrap">
                  <Icon name={meta.icon} className="w-3.5 h-3.5" />
                  {meta.label}
                  <span className="ml-1 text-[10px] font-bold tabular-nums text-[#8a93a3]">{byRegion[r].length}</span>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* Per-region sections */}
      {regions.map(r => {
        const meta = regionMeta(r)
        const items = byRegion[r]
        return (
          <section key={r} id={r.replace(/\s+/g, '-')}
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
                  <p className="text-sm text-[#7a8290] mt-0.5">
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
                      className="egg-card group p-4">
                      <div className="flex items-start gap-2.5">
                        <span className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                          style={{ background: `${meta.color}1f`, boxShadow: `inset 0 0 0 1px ${meta.color}66` }}>
                                                  </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <span className="font-mono text-[10px] font-bold text-[#3f4650] bg-[#f3f4f6] px-1.5 py-0.5 rounded">{c.ref_code}</span>
                            {c.pass_fail === true && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#e6fbf8] text-[#0b8f84] border border-[#0fb5a5]/40">
                                ✓ Pass
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm text-[#14161a] group-hover:text-[#0b8f84] transition-colors leading-tight line-clamp-2">
                            {com?.name || 'Commodity'}
                          </h3>
                          <p className="text-[11px] text-[#7a8290] mt-1 leading-snug">
                            {c.lab_name} · Issued {fmtDate(c.issue_date)}
                          </p>
                          {c.overall_result && (
                            <p className="text-[10px] text-[#0b8f84] font-semibold mt-1 line-clamp-2">{c.overall_result}</p>
                          )}
                        </div>
                        <span className="text-[#c9ced6] group-hover:text-[#ff6321] transition-colors mt-1">→</span>
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
            attesting compliance with your destination market's standard. Available within 24h of dispatch.
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
