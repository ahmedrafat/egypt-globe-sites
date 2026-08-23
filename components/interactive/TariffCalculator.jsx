'use client'

/**
 * TariffCalculator — Drop 133 interactive widget for country-import-guide pages.
 *
 * Buyer picks commodity (HS code) + CIF value → instant indicative
 * landed-cost breakdown showing customs duty + VAT + national levies +
 * any FTA preferential treatment savings.
 *
 * Each country has its own tariff schema (defined as props or hardcoded
 * per countryId). Purely indicative — destination customs broker confirms
 * the actual rates; the widget exists to give the buyer a fast
 * "Is this worth it?" gut-check before they commit to a quote.
 */
import { useState, useMemo, useEffect } from 'react'
import Icon from '../ui/Icon'

// Commodity → HS code → MFN duty rate per country (representative — verify
// per current Customs Tariff schedule). PAFTA / COMESA / ECOWAS preferential
// rates noted where Egypt qualifies.
const COMMODITIES = {
  cement:        { label: 'Cement (Portland CEM I 42.5N)',   hs: '2523.29.00' },
  clinker:       { label: 'Cement clinker',                  hs: '2523.10.00' },
  urea:          { label: 'Urea fertilizer (46% N)',         hs: '3102.10.00' },
  dap:           { label: 'DAP (18-46-0)',                   hs: '3105.30.00' },
  phosphate:     { label: 'Phosphate rock',                  hs: '2510.20.10' },
  salt_industrial: { label: 'Industrial salt',               hs: '2501.00.91' },
  salt_food:     { label: 'Food-grade salt',                 hs: '2501.00.10' },
  caustic_soda:  { label: 'Caustic soda (NaOH)',             hs: '2815.12.00' },
  soda_ash:      { label: 'Soda ash (Na₂CO₃)',               hs: '2836.20.00' },
  sulphuric_acid: { label: 'Sulphuric acid',                 hs: '2807.00.00' },
  silica_sand:   { label: 'Silica sand (glass-grade)',       hs: '2505.10.00' },
  rebar:         { label: 'Steel rebar',                     hs: '7214.20.00' },
  cotton:        { label: 'Cotton (Egyptian Long Staple)',   hs: '5201.00.00' },
  oranges:       { label: 'Fresh oranges',                   hs: '0805.10.00' },
}

const COUNTRY_TARIFFS = {
  kenya: {
    label: 'Kenya',
    fta: 'COMESA',
    pref: { cement: 0, clinker: 0, urea: 0, dap: 0, phosphate: 0, salt_industrial: 0, salt_food: 0, caustic_soda: 0, soda_ash: 0, sulphuric_acid: 0, silica_sand: 0, rebar: 0, cotton: 0, oranges: 0 },
    mfn:  { cement: 25, clinker: 0, urea: 0, dap: 0, phosphate: 0, salt_industrial: 10, salt_food: 25, caustic_soda: 10, soda_ash: 10, sulphuric_acid: 0, silica_sand: 10, rebar: 25, cotton: 25, oranges: 25 },
    levies: [
      { label: 'VAT', rate: 16, base: 'CIF+duty' },
      { label: 'IDF (Import Declaration Fee)', rate: 3.5, base: 'CIF' },
      { label: 'RDL (Railway Development Levy)', rate: 2.0, base: 'CIF' },
    ],
    ftaNote: 'COMESA preferential treatment grants 0% duty on Egyptian-origin goods meeting Rules of Origin. Issue COMESA Certificate of Origin.',
  },
  nigeria: {
    label: 'Nigeria',
    fta: null,
    pref: null,
    mfn:  { cement: 35, clinker: 5, urea: 0, dap: 0, phosphate: 0, salt_industrial: 5, salt_food: 20, caustic_soda: 5, soda_ash: 5, sulphuric_acid: 5, silica_sand: 5, rebar: 35, cotton: 0, oranges: 35 },
    levies: [
      { label: 'VAT', rate: 7.5, base: 'CIF+duty' },
      { label: 'CISS (supervision)', rate: 1.0, base: 'FOB' },
      { label: 'ETLS (ECOWAS levy)', rate: 0.5, base: 'CIF' },
      { label: 'Port surcharge', rate: 7.0, base: 'duty' },
    ],
    ftaNote: 'No bilateral FTA between Egypt and Nigeria as of publication. Standard MFN tariff applies.',
  },
  india: {
    label: 'India',
    fta: null,
    pref: null,
    mfn:  { cement: 20, clinker: 5, urea: 0, dap: 5, phosphate: 5, salt_industrial: 5, salt_food: 30, caustic_soda: 7.5, soda_ash: 7.5, sulphuric_acid: 7.5, silica_sand: 5, rebar: 15, cotton: 0, oranges: 30 },
    levies: [
      { label: 'SWS (Social Welfare Surcharge)', rate: 10, base: 'duty' },
      { label: 'IGST (varies)', rate: 18, base: 'CIF+duty+SWS' },
    ],
    ftaNote: 'No bilateral FTA between Egypt and India. Standard MFN + SWS + IGST.',
  },
  'saudi-arabia': {
    label: 'Saudi Arabia',
    fta: 'PAFTA',
    pref: { cement: 0, clinker: 0, urea: 0, dap: 0, phosphate: 0, salt_industrial: 0, salt_food: 0, caustic_soda: 0, soda_ash: 0, sulphuric_acid: 0, silica_sand: 0, rebar: 0, cotton: 0, oranges: 0 },
    mfn:  { cement: 5, clinker: 5, urea: 5, dap: 5, phosphate: 5, salt_industrial: 5, salt_food: 5, caustic_soda: 5, soda_ash: 5, sulphuric_acid: 5, silica_sand: 5, rebar: 5, cotton: 0, oranges: 5 },
    levies: [
      { label: 'VAT (Saudi)', rate: 15, base: 'CIF+duty' },
    ],
    ftaNote: 'PAFTA grants 0% customs duty on Egyptian-origin goods. Issue PAFTA Certificate of Origin to claim.',
  },
}

// Drop 138c — country slug → ISO3 for WITS lookup
const ISO3_BY_SLUG = {
  kenya: 'KEN', nigeria: 'NGA', india: 'IND', 'saudi-arabia': 'SAU',
  egypt: 'EGY', uae: 'ARE', 'south-africa': 'ZAF',
}

export default function TariffCalculator({ countryId = 'kenya' }) {
  const country = COUNTRY_TARIFFS[countryId] || COUNTRY_TARIFFS.kenya
  const [commodity, setCommodity] = useState('cement')
  const [cifValue, setCifValue]   = useState(100000)
  const [usePref, setUsePref]     = useState(true)
  // Drop 138c — live tariff override from /api/tariff-lookup (WITS-backed)
  const [liveRate, setLiveRate]   = useState(null)
  const [liveLoading, setLiveLoading] = useState(false)
  const [liveSource, setLiveSource]   = useState(null)
  const [useLive, setUseLive]     = useState(true)

  // Fetch live tariff whenever commodity changes
  useEffect(() => {
    const reporter = ISO3_BY_SLUG[countryId]
    const com = COMMODITIES[commodity]
    if (!reporter || !com?.hs) return
    setLiveLoading(true); setLiveRate(null); setLiveSource(null)
    fetch(`/api/tariff-lookup?reporter=${reporter}&hs=${com.hs.replace(/\D/g, '')}`)
      .then(r => r.ok ? r.json() : null)
      .then(j => {
        if (!j) return
        setLiveRate(j.mfn_rate_pct)
        setLiveSource(j.cached ? `${j.source} (cached)` : j.source)
      })
      .catch(() => {})
      .finally(() => setLiveLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commodity, countryId])

  const breakdown = useMemo(() => {
    const cif = Number(cifValue) || 0
    // Resolution order: preferential (FTA) wins → live WITS rate (if toggled + available)
    // → hardcoded MFN fallback. Same precedence the user sees in the UI badges.
    let dutyRate, dutySrc
    if (usePref && country.pref?.[commodity] !== undefined) {
      dutyRate = country.pref[commodity]; dutySrc = `${country.fta} preferential`
    } else if (useLive && liveRate != null) {
      dutyRate = liveRate; dutySrc = liveSource || 'WITS live'
    } else {
      dutyRate = country.mfn[commodity] ?? 5; dutySrc = 'MFN (indicative)'
    }
    const duty = (cif * dutyRate) / 100
    const lines = [{ label: `Customs duty (${dutyRate}% — ${dutySrc})`, value: duty, kind: 'duty' }]
    let cumulative = duty
    for (const l of country.levies) {
      let base = cif
      if (l.base === 'CIF+duty') base = cif + duty
      else if (l.base === 'CIF+duty+SWS') base = cif + duty + (lines.find(x => x.label.includes('SWS'))?.value || 0)
      else if (l.base === 'duty') base = duty
      else if (l.base === 'FOB') base = cif * 0.92  // ~92% rule of thumb (FOB ≈ CIF − insurance − freight)
      const v = (base * l.rate) / 100
      lines.push({ label: `${l.label} (${l.rate}%${l.base !== 'CIF' ? ` of ${l.base}` : ''})`, value: v, kind: 'levy' })
      cumulative += v
    }
    return { lines, total: cif + cumulative, cif, totalCharges: cumulative }
  }, [country, commodity, cifValue, usePref, useLive, liveRate, liveSource])

  const com = COMMODITIES[commodity]
  const sample = (cifValue || 0).toLocaleString()
  const totalPct = ((breakdown.totalCharges / breakdown.cif) * 100).toFixed(1)

  return (
    <div className="rounded-3xl ring-1 ring-[#14161a]/10 bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-[#14161a]/10 bg-[#f9fafb]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white ring-1 ring-[#14161a]/10 text-[#14161a]"><Icon name="coins" className="w-4 h-4" /></span>
          <h3 className="egg-display text-2xl text-[#14161a]">{country.label} import cost calculator</h3>
        </div>
        <p className="text-xs text-[#7a8290] mt-1">Pick commodity + CIF value → indicative duty + VAT + levies. Final rates confirmed by your customs broker.</p>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#7a8290] mb-1.5 block">Commodity</label>
            <select value={commodity} onChange={e => setCommodity(e.target.value)}
              className="w-full text-sm font-semibold border border-[#14161a]/10 rounded-lg px-3 py-2.5 focus:border-[#ff6321] focus:ring-2 focus:ring-[#ff6321]/25 outline-none">
              {Object.entries(COMMODITIES).map(([k, v]) => (
                <option key={k} value={k}>{v.label} (HS {v.hs})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#7a8290] mb-1.5 block">CIF value (USD)</label>
            <div className="flex">
              <div className="bg-[#f3f4f6] border border-r-0 border-[#14161a]/10 rounded-l-lg px-3 py-2.5 text-sm font-bold text-[#3f4650]">USD</div>
              <input type="number" min="0" value={cifValue} onChange={e => setCifValue(e.target.value)}
                className="flex-1 border border-[#14161a]/10 rounded-r-lg px-3 py-2.5 text-sm font-mono font-semibold focus:border-[#ff6321] focus:ring-2 focus:ring-[#ff6321]/25 outline-none" />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[10000, 50000, 100000, 500000, 1000000].map(p => (
                <button key={p} type="button" onClick={() => setCifValue(p)}
                  className="text-[10px] font-bold px-2 py-1 rounded-md bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#3f4650]">
                  ${(p/1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {country.pref && (
            <div className="rounded-xl border border-[#0fb5a5]/40 bg-[#e6fbf8] p-3">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={usePref} onChange={e => setUsePref(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#0b8f84]" />
                <div>
                  <div className="text-sm font-bold text-[#0b5f57]">Apply {country.fta} preferential treatment</div>
                  <div className="text-[11px] text-[#0b8f84] mt-0.5">{country.ftaNote}</div>
                </div>
              </label>
            </div>
          )}

          {/* Drop 138c — Live WITS rate badge (informational + toggle) */}
          <div className={`rounded-xl border p-3 ${liveLoading ? 'border-[#14161a]/10 bg-[#f9fafb]' : liveRate != null ? 'border-[#0284c7]/35 bg-[#eef6fd]' : 'border-[#b8862b]/40 bg-[#fbf7ee]'}`}>
            {liveLoading ? (
              <div className="flex items-center gap-2 text-xs text-[#7a8290]">
                <span className="inline-block w-3 h-3 rounded-full border-2 border-[#14161a]/20 border-t-[#14161a] animate-spin" />
                Looking up live tariff from World Bank WITS…
              </div>
            ) : liveRate != null ? (
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={useLive} onChange={e => setUseLive(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#0369a1]" disabled={usePref && country.pref?.[commodity] !== undefined} />
                <div className="flex-1">
                  <div className="text-sm font-bold text-[#0369a1]">
                    Live MFN rate: <span className="font-mono">{liveRate}%</span>
                    <span className="ml-2 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#eef6fd] text-[#0369a1] font-bold align-middle">{liveSource}</span>
                  </div>
                  <div className="text-[11px] text-[#0369a1] mt-0.5">
                    {usePref && country.pref?.[commodity] !== undefined
                      ? `${country.fta} preferential (0%) overrides — uncheck above to compare against live MFN.`
                      : `Pulled live from World Bank UNCTAD TRAINS, cached 30 days. Uncheck to use the static fallback (${country.mfn[commodity] ?? 5}%).`}
                  </div>
                </div>
              </label>
            ) : (
              <div className="text-[11px] text-[#8a6d3b]">
                <span className="font-bold">Using indicative MFN ({country.mfn[commodity] ?? 5}%).</span> Live WITS data unavailable for this HS code / country combination.
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="relative overflow-hidden rounded-2xl p-5 text-[#14161a] ring-1 ring-[#14161a]/10 bg-[linear-gradient(160deg,#e6fbf8_0%,#eef6fd_100%)]">
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[#0b8f84] mb-1">Cost breakdown</div>
            <div className="egg-display text-3xl sm:text-4xl text-[#14161a] leading-tight mb-1">USD {Math.round(breakdown.total).toLocaleString()}</div>
            <div className="text-xs text-[#7a8290] mb-4">total landed cost · CIF + import charges</div>

            <div className="space-y-1.5 text-sm border-t border-[#14161a]/10 pt-3">
              <Row label={`CIF value`}         value={breakdown.cif} />
              {breakdown.lines.map((l, i) => (
                <Row key={i} label={l.label} value={l.value} kind={l.kind} />
              ))}
              <div className="pt-1.5 mt-1.5 border-t border-[#14161a]/10">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#7a8290]">Total import charges</span>
                  <span className="text-sm font-semibold text-[#14161a]">+{Math.round(breakdown.totalCharges).toLocaleString()} ({totalPct}% of CIF)</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[#7a8290] mt-3 leading-relaxed">
            Indicative only. Actual rates depend on your destination port + national regulations + your broker's classification. HS code <strong className="text-[#3f4650]">{com.hs}</strong> for <strong className="text-[#3f4650]">{com.label}</strong>.
            {country.pref && usePref && breakdown.lines[0].value === 0 && (
              <span className="text-[#0b8f84] font-semibold"> {country.fta} preferential treatment applied — saved ~{country.mfn[commodity]}% MFN duty.</span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, kind }) {
  const colorCls = kind === 'duty' ? 'text-[#8a6d3b]' : kind === 'levy' ? 'text-[#0369a1]' : 'text-[#3f4650]'
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className={`${colorCls} truncate`}>{label}</span>
      <span className="font-mono font-semibold text-[#14161a] shrink-0">USD {Math.round(value).toLocaleString()}</span>
    </div>
  )
}
