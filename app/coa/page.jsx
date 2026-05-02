/**
 * /coa — Certificate of Analysis center.
 *
 * Drop 146 — public-facing browse of every active CoA across all
 * commodities, grouped by market region. Buyers land here from the
 * footer or from product pages and can filter by region or commodity.
 */
import Link from 'next/link'
import { getCoaSummary } from '../../lib/corporatePages'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Certificate of Analysis Center',
  description: 'Independent SGS / Intertek / Bureau Veritas certificates of analysis for every Egypt Globe Group commodity, organised by destination market region (Europe, GCC, East Africa, Far East, South Asia, Mediterranean, Americas).',
  alternates: { canonical: 'https://egyptglobe.com/coa' },
}

const REGION_META = {
  GLOBAL:           { icon: '🌍', label: 'Global / default',  color: '#64748b' },
  Europe:           { icon: '🇪🇺', label: 'Europe',             color: '#1d4ed8' },
  'North Europe':   { icon: '❄️', label: 'North Europe',       color: '#0891b2' },
  Mediterranean:    { icon: '🌊', label: 'Mediterranean',      color: '#0284c7' },
  GCC:              { icon: '🕌', label: 'GCC / Saudi',        color: '#059669' },
  'East Africa':    { icon: '🌍', label: 'East Africa',        color: '#d97706' },
  'West Africa':    { icon: '🌍', label: 'West Africa',        color: '#b45309' },
  'South Asia':     { icon: '🌏', label: 'South Asia',         color: '#e11d48' },
  'Far East':       { icon: '🌏', label: 'Far East',           color: '#db2777' },
  Americas:         { icon: '🌎', label: 'Americas',           color: '#7c3aed' },
}

function regionMeta(r) {
  return REGION_META[r] || { icon: '📍', label: r, color: '#475569' }
}

function fmtDate(d) {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return '—' }
}

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
    <article>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-teal-800 to-[#0f1f3a] text-white">
        <div aria-hidden="true" className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />
          <div className="absolute -bottom-32 -left-24 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,99,33,0.4) 0%, transparent 70%)' }} />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-25" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
          <nav className="flex items-center gap-2 text-xs text-white/60 mb-5 flex-wrap">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <span className="text-white/90">Certificate of Analysis Center</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              🏅 Independent SGS / Intertek / Bureau Veritas
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              {totalCoas} active CoAs
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              {totalCommodities} commodities
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              {regions.length} markets
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-[1.05] drop-shadow-sm">
            Certificate of Analysis Center
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-3xl text-emerald-100">
            Every Egypt Globe Group commodity ships with an independent third-party
            CoA from SGS Egypt, Intertek Cairo or Bureau Veritas Egypt. Region-specific
            certificates attest compliance with each destination market's standard
            (EN 197-1 / ASTM C150 / GB/T / KEBS / SASO / FCO etc.).
          </p>
        </div>
      </section>

      {/* Region quick-jump nav */}
      <section className="bg-white border-b border-slate-200 sticky top-0 z-10 backdrop-blur-md bg-white/85">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {regions.map(r => {
              const meta = regionMeta(r)
              return (
                <a key={r} href={`#${r.replace(/\s+/g, '-')}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:border-[#1d5fa1] hover:text-[#1d5fa1] transition-colors whitespace-nowrap">
                  <span aria-hidden>{meta.icon}</span>
                  {meta.label}
                  <span className="ml-1 text-[10px] font-bold tabular-nums text-slate-400">{byRegion[r].length}</span>
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
            className="border-t border-slate-100 scroll-mt-20"
            style={{ background: `linear-gradient(180deg, ${meta.color}05 0%, white 80%)` }}>
            <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
              {/* Section header */}
              <div className="flex items-start gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${meta.color}1A`, color: meta.color }}>
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {meta.label}
                  </h2>
                  <p className="text-sm text-slate-500 mt-0.5">
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
                      className="group rounded-xl border bg-white p-4 hover:shadow-md transition-all"
                      style={{ borderColor: `${meta.color}25` }}>
                      <div className="flex items-start gap-2.5">
                        <span className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                          style={{ background: `${meta.color}15`, color: meta.color }}>
                          🧪
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{c.ref_code}</span>
                            {c.pass_fail === true && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                ✓ Pass
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#1d5fa1] transition-colors leading-tight line-clamp-2">
                            {com?.name || 'Commodity'}
                          </h3>
                          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                            {c.lab_name} · Issued {fmtDate(c.issue_date)}
                          </p>
                          {c.overall_result && (
                            <p className="text-[10px] text-emerald-700 font-semibold mt-1 line-clamp-2">{c.overall_result}</p>
                          )}
                        </div>
                        <span className="text-slate-300 group-hover:text-[#1d5fa1] transition-colors mt-1">→</span>
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
      <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-700 via-teal-800 to-[#0f1f3a] p-8 sm:p-10 text-center text-white shadow-xl shadow-emerald-900/20">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 tracking-tight">
            Need a CoA for your specific shipment?
          </h2>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
            Per-shipment Certificate of Analysis issued from independent SGS / Intertek / Bureau Veritas labs,
            attesting compliance with your destination market's standard. Available within 24h of dispatch.
          </p>
          <Link href="/rfq?type=coa"
            className="inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5">
            🧪 Request CoA
          </Link>
        </div>
      </section>
    </article>
  )
}
