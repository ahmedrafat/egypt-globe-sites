'use client'

/**
 * CoaCenter — per-product Certificate of Analysis browser with
 * market-region tabs.
 *
 * Drop 146. The DB carries one or more CoAs per commodity, each
 * tagged to a market region (Europe / GCC / East Africa / Far East /
 * South Asia / Mediterranean / Americas / GLOBAL). Buyers pick their
 * region, see the relevant CoA's parameters, lab, dates, pass/fail,
 * and download the PDF if available.
 *
 * Falls back to GLOBAL CoA when no region-specific cert exists yet.
 */
import { useMemo, useState } from 'react'
import { printCoa } from '../../lib/coaPrint'

const REGION_META = {
  'GLOBAL':         { icon: '🌍', label: 'Global / default',     tone: 'bg-[#f9fafb] text-[#3f4650] border-[#14161a]/10' },
  'Europe':         { icon: '🇪🇺', label: 'Europe',                tone: 'bg-[#eef6fd] text-[#0369a1] border-[#0284c7]/35' },
  'North Europe':   { icon: '❄️', label: 'North Europe',          tone: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
  'Mediterranean':  { icon: '🌊', label: 'Mediterranean',         tone: 'bg-sky-50 text-sky-800 border-sky-200' },
  'GCC':            { icon: '🕌', label: 'GCC / Saudi',           tone: 'bg-[#e6fbf8] text-[#0b8f84] border-[#0fb5a5]/40' },
  'MENA':           { icon: '🌅', label: 'MENA',                  tone: 'bg-amber-50 text-[#8a6d3b] border-amber-200' },
  'North Africa':   { icon: '🏜', label: 'North Africa',          tone: 'bg-orange-50 text-orange-800 border-orange-200' },
  'East Africa':    { icon: '🌍', label: 'East Africa',           tone: 'bg-amber-50 text-[#8a6d3b] border-amber-200' },
  'West Africa':    { icon: '🌍', label: 'West Africa',           tone: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
  'Africa':         { icon: '🌍', label: 'Africa',                tone: 'bg-amber-50 text-[#8a6d3b] border-amber-200' },
  'Red Sea & Gulf': { icon: '🛢', label: 'Red Sea & Gulf',        tone: 'bg-orange-50 text-orange-800 border-orange-200' },
  'South Asia':     { icon: '🌏', label: 'South Asia',            tone: 'bg-rose-50 text-rose-800 border-rose-200' },
  'Far East':       { icon: '🌏', label: 'Far East',              tone: 'bg-pink-50 text-pink-800 border-pink-200' },
  'South-East Asia':{ icon: '🌏', label: 'South-East Asia',       tone: 'bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200' },
  'Asia':           { icon: '🌏', label: 'Asia',                  tone: 'bg-rose-50 text-rose-800 border-rose-200' },
  'Americas':       { icon: '🌎', label: 'Americas',              tone: 'bg-violet-50 text-violet-800 border-violet-200' },
  'North America':  { icon: '🌎', label: 'North America',         tone: 'bg-violet-50 text-violet-800 border-violet-200' },
  'Latin America':  { icon: '🌎', label: 'Latin America',         tone: 'bg-purple-50 text-purple-800 border-purple-200' },
  'CIS':            { icon: '❄️', label: 'CIS',                   tone: 'bg-[#f9fafb] text-[#3f4650] border-[#14161a]/10' },
}

function regionMeta(r) {
  return REGION_META[r] || { icon: '📍', label: r || 'Unknown', tone: 'bg-[#f9fafb] text-[#3f4650] border-[#14161a]/10' }
}

// Pretty-print a parameter key like 'compressive_28d_mpa' → 'Compressive 28-day (MPa)'
const PARAM_LABELS = {
  // Cement
  blaine_fineness_m2_kg: 'Blaine fineness (m²/kg)',
  compressive_2d_mpa:    'Compressive 2-day (MPa)',
  compressive_7d_mpa:    'Compressive 7-day (MPa)',
  compressive_28d_mpa:   'Compressive 28-day (MPa)',
  so3_pct:               'SO₃ (%)',
  mgo_pct:               'MgO (%)',
  loi_pct:               'Loss on Ignition (%)',
  insoluble_residue_pct: 'Insoluble Residue (%)',
  c3a_pct:               'C₃A (%)',
  chloride_pct:          'Chloride (%)',
  initial_setting_min:   'Initial setting (min)',
  final_setting_min:     'Final setting (min)',
  // Salt
  nacl_pct:              'NaCl (%)',
  moisture_pct:          'Moisture (%)',
  ca_pct:                'Calcium (%)',
  mg_pct:                'Magnesium (%)',
  so4_pct:               'Sulphate SO₄ (%)',
  water_insolubles_pct:  'Water insolubles (%)',
  pb_ppm:                'Lead Pb (ppm)',
  as_ppm:                'Arsenic As (ppm)',
  cd_ppm:                'Cadmium Cd (ppm)',
  hg_ppm:                'Mercury Hg (ppm)',
  whiteness_index:       'Whiteness Index',
  ph:                    'pH',
  // Fertilizer
  nitrogen_pct:          'Nitrogen N (%)',
  biuret_pct:            'Biuret (%)',
  particle_size_2_4mm_pct: 'Particle size 2-4 mm (%)',
  free_acidity_pct:      'Free acidity (%)',
  // Silica / minerals
  sio2_pct:              'SiO₂ (%)',
  fe2o3_pct:             'Fe₂O₃ (%)',
  al2o3_pct:             'Al₂O₃ (%)',
  tio2_pct:              'TiO₂ (%)',
  cr2o3_pct:             'Cr₂O₃ (%)',
  particle_d50_micron:   'Particle d50 (μm)',
}

function paramLabel(key) {
  if (PARAM_LABELS[key]) return PARAM_LABELS[key]
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function fmtDate(d) {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return '—' }
}

function daysUntil(d) {
  if (!d) return null
  const diff = Math.floor((new Date(d).getTime() - Date.now()) / 86400000)
  return diff
}

export default function CoaCenter({ coas = [], commodityName, requestPath, brand = null, commodity = null }) {
  // Group by region, sort regions in a sensible order
  const grouped = useMemo(() => {
    const map = {}
    for (const c of coas) {
      const k = c.market_region || 'GLOBAL'
      if (!map[k]) map[k] = []
      map[k].push(c)
    }
    return map
  }, [coas])

  const regions = useMemo(() => {
    const order = ['GLOBAL', 'Mediterranean', 'Europe', 'North Europe', 'GCC', 'MENA', 'East Africa', 'West Africa', 'North Africa', 'Africa', 'Red Sea & Gulf', 'South Asia', 'Far East', 'South-East Asia', 'Asia', 'Americas', 'North America', 'Latin America', 'CIS']
    const present = Object.keys(grouped)
    // Use canonical order for known regions, append any extras at the end
    return [...order.filter(r => present.includes(r)), ...present.filter(r => !order.includes(r))]
  }, [grouped])

  const [active, setActive] = useState(regions[0] || 'GLOBAL')

  if (coas.length === 0) {
    return (
      <div className="egg-panel p-6 sm:p-8 text-center">
        <div className="text-4xl mb-3">🧪</div>
        <h3 className="font-bold text-lg text-[#14161a] mb-2">No Certificate of Analysis on file yet</h3>
        <p className="text-sm text-[#7a8290] mb-4 max-w-md mx-auto">
          Our internal Egypt Globe QC Lab issues a CoA with every shipment, and
          we can arrange independent third-party verification (SGS / Intertek /
          Bureau Veritas / TUV) on request — typically 0.3-0.5% of FOB value.
          Submit a quote request and we'll attach the latest CoA to the response.
        </p>
        {requestPath && (
          <a href={`/rfq?product=${encodeURIComponent(requestPath)}&type=coa`}
            className="egg-btn-primary text-sm py-2.5">
            🧪 Request CoA
          </a>
        )}
      </div>
    )
  }

  const activeCoas = grouped[active] || []
  const meta = regionMeta(active)

  return (
    <div className="bg-white ring-1 ring-[#14161a]/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 border-b border-[#14161a]/10 bg-[#f9fafb]">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-bold text-lg text-[#14161a] flex items-center gap-2">
              <span className="text-xl" aria-hidden>🧪</span>
              Certificates of Analysis
            </h2>
            <p className="text-xs text-[#7a8290] mt-1">
              {coas.length} active CoA{coas.length === 1 ? '' : 's'} across {regions.length} market{regions.length === 1 ? '' : 's'}.
              Issued by our Egypt Globe QC Lab — third-party verification (SGS / Intertek / Bureau Veritas / TUV) on request.
            </p>
          </div>
          {requestPath && (
            <a href={`/rfq?product=${encodeURIComponent(requestPath)}&type=coa`}
              className="egg-btn-primary text-xs py-1.5 px-3 flex-shrink-0">
              🧪 Request CoA
            </a>
          )}
        </div>
      </div>

      {/* Region tabs (scrollable on mobile) */}
      <div className="border-b border-[#14161a]/10 overflow-x-auto">
        <div className="flex gap-1 px-3 sm:px-5 py-2 min-w-max">
          {regions.map(r => {
            const m = regionMeta(r)
            const isActive = active === r
            return (
              <button key={r} type="button" onClick={() => setActive(r)}
                className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#14161a] text-white border-[#14161a] shadow-sm'
                    : `${m.tone} hover:border-[#14161a]/40`}`}>
                <span aria-hidden>{m.icon}</span>
                {m.label}
                <span className={`text-[10px] font-bold px-1 rounded ${isActive ? 'bg-white/25' : 'bg-white text-[#7a8290]'}`}>
                  {grouped[r].length}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Active region's CoAs */}
      <div className="divide-y divide-[#14161a]/10">
        {activeCoas.map(coa => {
          const days = daysUntil(coa.expiry_date)
          const expired = days != null && days < 0
          const expiringSoon = days != null && days >= 0 && days < 30
          const params = coa.parameters || {}
          const paramKeys = Object.keys(params).filter(k => k !== 'compliance_tested')
          return (
            <div key={coa.id} className="px-5 sm:px-6 py-5">
              {/* CoA card header */}
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-[11px] font-bold text-[#14161a] bg-[#f3f4f6] px-2 py-0.5 rounded">{coa.ref_code}</span>
                    {coa.pass_fail === true && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#e6fbf8] text-[#0b8f84] border border-[#0fb5a5]/40">
                        ✓ Pass
                      </span>
                    )}
                    {coa.pass_fail === false && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                        ✗ Fail
                      </span>
                    )}
                    {expired && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                        Expired
                      </span>
                    )}
                    {expiringSoon && !expired && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#fbf7ee] text-[#8a6d3b] border border-[#b8862b]/40">
                        Expires in {days}d
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold text-[#14161a]">
                    {coa.lab_name}
                    {coa.lab_certificate_no && <span className="text-[#8a93a3] font-mono font-normal ml-2">{coa.lab_certificate_no}</span>}
                  </div>
                  {coa.overall_result && (
                    <p className="text-xs text-[#0b8f84] font-semibold mt-1">{coa.overall_result}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => printCoa(coa, {
                      commodityName: commodityName || coa.commodity_name,
                      commoditySku: coa.commodity_code || coa.commodity_sku,
                      commodityHsCode: coa.commodity_hs_code,
                      commodityOrigin: coa.commodity_origin,
                      commodityGrade: coa.commodity_grade,
                      brand,  // Drop 158 — per-brand letterhead
                    })}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-3 py-2 rounded-lg shadow-sm transition-colors hover:opacity-90"
                    style={{ background: brand?.primary_color || '#0b8f84' }}
                    title="Open print dialog — choose Save as PDF or send to printer"
                  >
                    🖨 Print / PDF
                  </button>
                  {coa.pdf_url && (
                    <a
                      href={coa.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold bg-white hover:bg-[#f9fafb] text-[#0b8f84] border border-[#14161a]/20 px-3 py-2 rounded-lg shadow-sm transition-colors"
                      title="Download the lab's original PDF (uploaded by QC)"
                    >
                      📄 Original PDF
                    </a>
                  )}
                </div>
              </div>

              {/* Date strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 text-[10px] uppercase tracking-wider font-semibold text-[#7a8290]">
                {coa.sample_date && <div><div className="text-[#8a93a3]">Sampled</div><div className="text-[#3f4650] font-bold normal-case tracking-normal">{fmtDate(coa.sample_date)}</div></div>}
                {coa.analysis_date && <div><div className="text-[#8a93a3]">Analysed</div><div className="text-[#3f4650] font-bold normal-case tracking-normal">{fmtDate(coa.analysis_date)}</div></div>}
                {coa.issue_date && <div><div className="text-[#8a93a3]">Issued</div><div className="text-[#3f4650] font-bold normal-case tracking-normal">{fmtDate(coa.issue_date)}</div></div>}
                {coa.expiry_date && <div><div className="text-[#8a93a3]">Expires</div><div className={`font-bold normal-case tracking-normal ${expired ? 'text-red-700' : expiringSoon ? 'text-[#8a6d3b]' : 'text-[#3f4650]'}`}>{fmtDate(coa.expiry_date)}</div></div>}
              </div>

              {/* Drop 148 — Packing + cargo metadata strip (only if any field set) */}
              {(coa.packing_name || coa.packing_label || coa.quantity_mt || coa.vessel_name || coa.pol_unlocode || coa.pod_unlocode) && (
                <div className="rounded-xl border border-[#14161a]/10 bg-[#f9fafb] p-3 mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#7a8290] mb-2">Cargo & packing</div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {(coa.packing_name || coa.packing_label) && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-[#14161a]/10 text-[#14161a]">
                        📦 <span className="font-semibold">{coa.packing_name || coa.packing_label}</span>
                        {coa.packing_size_kg && <span className="text-[#7a8290]">· {Number(coa.packing_size_kg)} kg</span>}
                        {coa.packing_material && <span className="text-[#7a8290]">· {coa.packing_material}</span>}
                      </span>
                    )}
                    {coa.quantity_mt && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-[#14161a]/10 text-[#14161a]">
                        ⚖️ <span className="font-semibold">{Number(coa.quantity_mt)} MT</span>
                      </span>
                    )}
                    {coa.container_count && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-[#14161a]/10 text-[#14161a]">
                        🚛 <span className="font-semibold">{coa.container_count}× container</span>
                      </span>
                    )}
                    {coa.vessel_name && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-[#14161a]/10 text-[#14161a]">
                        🚢 <span className="font-semibold">{coa.vessel_name}</span>
                      </span>
                    )}
                    {coa.pol_unlocode && coa.pod_unlocode && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-[#14161a]/10 text-[#14161a] font-mono">
                        ⚓ {coa.pol_unlocode} → {coa.pod_unlocode}
                      </span>
                    )}
                    {coa.bl_no && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-[#14161a]/10 text-[#3f4650] font-mono text-[10px]">
                        B/L {coa.bl_no}
                      </span>
                    )}
                    {coa.attached_shipments_count > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#e6fbf8] border border-[#0fb5a5]/40 text-[#0b8f84]">
                        ✓ {coa.attached_shipments_count} shipment{coa.attached_shipments_count === 1 ? '' : 's'} attached
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Parameters table */}
              {paramKeys.length > 0 && (
                <div className="rounded-xl border border-[#14161a]/10 overflow-hidden bg-[#f9fafb]">
                  <div className="px-4 py-2 border-b border-[#14161a]/10 bg-[#f9fafb]">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#7a8290]">Measured parameters</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 divide-[#14161a]/10">
                    {paramKeys.map((k, i) => (
                      <div key={k} className={`flex items-baseline justify-between px-4 py-2.5 ${i % 2 === 0 ? '' : 'sm:bg-white'}`}>
                        <span className="text-xs text-[#7a8290] font-medium">{paramLabel(k)}</span>
                        <span className="text-sm font-mono font-bold text-[#14161a]">{String(params[k])}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {coa.batch_ref && (
                <div className="mt-3 text-[11px] text-[#7a8290]">
                  Batch ref: <span className="font-mono font-semibold text-[#3f4650]">{coa.batch_ref}</span>
                </div>
              )}
              {coa.notes && (
                <p className="mt-3 text-xs text-[#3f4650] leading-relaxed">{coa.notes}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-5 sm:px-6 py-3 bg-[#f9fafb] border-t border-[#14161a]/10">
        <p className="text-[11px] text-[#7a8290] leading-relaxed">
          Per-shipment CoAs are issued by our internal Egypt Globe QC Lab.
          Independent third-party verification (SGS Egypt / Intertek Cairo /
          Bureau Veritas / TUV) is available on request, typically at
          0.3-0.5% of FOB value. Region-specific certificates
          attest compliance with the destination market's standard
          (EN 197-1 / ASTM C150 / GB/T / KEBS / SASO / FCO etc.).
        </p>
      </div>
    </div>
  )
}
