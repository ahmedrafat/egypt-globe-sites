'use client'

/**
 * HSCodeBrowser — Drop 133 interactive widget for /trade-tools/hs-codes.
 *
 * Replaces the long static glossary markdown with a searchable + filterable
 * HS-code table. Buyer types into the search bar, picks a chapter / division,
 * gets HS codes filtered live. Click any code to copy to clipboard.
 *
 * Each row carries: 6-digit HS code · description · division · note.
 * Source: the same canonical list shipped in Drop 124d's hand-written
 * /trade-tools/hs-codes glossary, transcribed into structured data here.
 */
import { useState, useMemo } from 'react'

const CODES = [
  // Salt
  { code: '2501.00.10', desc: 'Salt for human consumption (table salt, pharma-grade NaCl)', div: 'salt', chapter: 'Ch 25 — Mineral products' },
  { code: '2501.00.91', desc: 'Industrial salt (chlor-alkali, water-treatment, de-icing)', div: 'salt', chapter: 'Ch 25 — Mineral products' },
  { code: '2501.00.99', desc: 'Other salt (ultra-pure, specialty grades)', div: 'salt', chapter: 'Ch 25 — Mineral products' },
  // Cement / clinker
  { code: '2523.10.00', desc: 'Cement clinker (intermediate, exported to grinding mills)', div: 'construction', chapter: 'Ch 25 — Mineral products' },
  { code: '2523.21.00', desc: 'White Portland cement', div: 'construction', chapter: 'Ch 25 — Mineral products' },
  { code: '2523.29.00', desc: 'Other Portland cement (CEM I, CEM II, SRC)', div: 'construction', chapter: 'Ch 25 — Mineral products' },
  { code: '2523.30.00', desc: 'Aluminous cement', div: 'construction', chapter: 'Ch 25 — Mineral products' },
  { code: '2523.90.00', desc: 'Other hydraulic cements', div: 'construction', chapter: 'Ch 25 — Mineral products' },
  // Fertilizers
  { code: '3102.10.00', desc: 'Urea (46% N)', div: 'fertilizers', chapter: 'Ch 31 — Fertilizers' },
  { code: '3102.21.00', desc: 'Ammonium sulphate', div: 'fertilizers', chapter: 'Ch 31 — Fertilizers' },
  { code: '3103.10.00', desc: 'Single super phosphate (SSP)', div: 'fertilizers', chapter: 'Ch 31 — Fertilizers' },
  { code: '3103.90.00', desc: 'Other mineral phosphate fertilizers', div: 'fertilizers', chapter: 'Ch 31 — Fertilizers' },
  { code: '3105.20.00', desc: 'NPK fertilizers (containing N, P, K)', div: 'fertilizers', chapter: 'Ch 31 — Fertilizers' },
  { code: '3105.30.00', desc: 'DAP (diammonium phosphate)', div: 'fertilizers', chapter: 'Ch 31 — Fertilizers' },
  { code: '3105.40.00', desc: 'MAP (monoammonium phosphate)', div: 'fertilizers', chapter: 'Ch 31 — Fertilizers' },
  // Chemicals
  { code: '2801.10.00', desc: 'Chlorine', div: 'chemicals', chapter: 'Ch 28 — Inorganic chemicals' },
  { code: '2807.00.00', desc: 'Sulphuric acid', div: 'chemicals', chapter: 'Ch 28 — Inorganic chemicals' },
  { code: '2806.10.00', desc: 'Hydrochloric acid', div: 'chemicals', chapter: 'Ch 28 — Inorganic chemicals' },
  { code: '2808.00.00', desc: 'Nitric acid', div: 'chemicals', chapter: 'Ch 28 — Inorganic chemicals' },
  { code: '2809.20.00', desc: 'Phosphoric acid', div: 'chemicals', chapter: 'Ch 28 — Inorganic chemicals' },
  { code: '2815.11.00', desc: 'Sodium hydroxide (caustic soda) solid', div: 'chemicals', chapter: 'Ch 28 — Inorganic chemicals' },
  { code: '2815.12.00', desc: 'Sodium hydroxide solution', div: 'chemicals', chapter: 'Ch 28 — Inorganic chemicals' },
  { code: '2836.20.00', desc: 'Sodium carbonate (soda ash)', div: 'chemicals', chapter: 'Ch 28 — Inorganic chemicals' },
  { code: '2836.30.00', desc: 'Sodium bicarbonate', div: 'chemicals', chapter: 'Ch 28 — Inorganic chemicals' },
  // Solvents
  { code: '2905.11.00', desc: 'Methanol', div: 'chemicals', chapter: 'Ch 29 — Organic chemicals' },
  { code: '2905.12.00', desc: 'Propan-2-ol (IPA)', div: 'chemicals', chapter: 'Ch 29 — Organic chemicals' },
  { code: '2914.11.00', desc: 'Acetone', div: 'chemicals', chapter: 'Ch 29 — Organic chemicals' },
  { code: '2902.30.00', desc: 'Toluene', div: 'chemicals', chapter: 'Ch 29 — Organic chemicals' },
  { code: '2902.41.00', desc: 'Xylene', div: 'chemicals', chapter: 'Ch 29 — Organic chemicals' },
  // Polymers
  { code: '3901.10.00', desc: 'Polyethylene density < 0.94 (LDPE)', div: 'chemicals', chapter: 'Ch 39 — Plastics' },
  { code: '3901.20.00', desc: 'Polyethylene density ≥ 0.94 (HDPE)', div: 'chemicals', chapter: 'Ch 39 — Plastics' },
  { code: '3902.10.00', desc: 'Polypropylene', div: 'chemicals', chapter: 'Ch 39 — Plastics' },
  { code: '3904.10.00', desc: 'Polyvinyl chloride (PVC)', div: 'chemicals', chapter: 'Ch 39 — Plastics' },
  { code: '3907.61.00', desc: 'PET resin', div: 'chemicals', chapter: 'Ch 39 — Plastics' },
  // Construction minerals
  { code: '2502.00.00', desc: 'Iron pyrites unroasted', div: 'minerals', chapter: 'Ch 25 — Mineral products' },
  { code: '2503.00.00', desc: 'Sulphur (other than sublimed / precipitated)', div: 'minerals', chapter: 'Ch 25 — Mineral products' },
  { code: '2505.10.00', desc: 'Silica sand and quartz sand', div: 'construction', chapter: 'Ch 25 — Mineral products' },
  { code: '2507.00.00', desc: 'Kaolin and other kaolinic clays', div: 'minerals', chapter: 'Ch 25 — Mineral products' },
  { code: '2508.10.00', desc: 'Bentonite', div: 'minerals', chapter: 'Ch 25 — Mineral products' },
  { code: '2509.00.00', desc: 'Chalk', div: 'minerals', chapter: 'Ch 25 — Mineral products' },
  { code: '2511.10.00', desc: 'Natural barium sulphate (barite)', div: 'minerals', chapter: 'Ch 25 — Mineral products' },
  { code: '2515.11.00', desc: 'Marble (raw block)', div: 'construction', chapter: 'Ch 25 — Mineral products' },
  { code: '2516.11.00', desc: 'Granite (raw block)', div: 'construction', chapter: 'Ch 25 — Mineral products' },
  { code: '2517.10.00', desc: 'Aggregates (pebbles, gravel, broken stone)', div: 'construction', chapter: 'Ch 25 — Mineral products' },
  { code: '2520.10.00', desc: 'Gypsum (natural)', div: 'construction', chapter: 'Ch 25 — Mineral products' },
  { code: '2521.00.00', desc: 'Limestone flux', div: 'construction', chapter: 'Ch 25 — Mineral products' },
  // Metals
  { code: '7204.10.00', desc: 'Iron + steel scrap', div: 'metals', chapter: 'Ch 72 — Iron & steel' },
  { code: '7214.20.00', desc: 'Hot-rolled rebar', div: 'metals', chapter: 'Ch 72 — Iron & steel' },
  { code: '7208.10.00', desc: 'Hot-rolled coil (HRC)', div: 'metals', chapter: 'Ch 72 — Iron & steel' },
  { code: '7209.15.00', desc: 'Cold-rolled coil (CRC)', div: 'metals', chapter: 'Ch 72 — Iron & steel' },
  { code: '7601.10.00', desc: 'Aluminium ingot (unalloyed)', div: 'metals', chapter: 'Ch 76 — Aluminium' },
  { code: '7403.11.00', desc: 'Refined copper cathode', div: 'metals', chapter: 'Ch 74 — Copper' },
  { code: '7901.11.00', desc: 'Zinc unwrought (>99.99%)', div: 'metals', chapter: 'Ch 79 — Zinc' },
  { code: '7202.21.00', desc: 'Ferro-silicon (FeSi 75%)', div: 'metals', chapter: 'Ch 72 — Iron & steel' },
  { code: '7202.30.00', desc: 'Silico-manganese', div: 'metals', chapter: 'Ch 72 — Iron & steel' },
  // Agro
  { code: '0805.10.00', desc: 'Oranges',                   div: 'agro', chapter: 'Ch 08 — Fruits' },
  { code: '0809.30.00', desc: 'Strawberries',              div: 'agro', chapter: 'Ch 08 — Fruits' },
  { code: '0703.20.00', desc: 'Garlic',                    div: 'agro', chapter: 'Ch 07 — Vegetables' },
  { code: '0701.90.00', desc: 'Potatoes (other than seed)', div: 'agro', chapter: 'Ch 07 — Vegetables' },
  { code: '1001.99.00', desc: 'Wheat (other than durum)',   div: 'agro', chapter: 'Ch 10 — Cereals' },
  { code: '1005.90.00', desc: 'Maize (other than seed)',    div: 'agro', chapter: 'Ch 10 — Cereals' },
  { code: '1701.99.00', desc: 'Refined cane / beet sugar',  div: 'agro', chapter: 'Ch 17 — Sugars' },
  { code: '5201.00.00', desc: 'Cotton, not carded / combed', div: 'agro', chapter: 'Ch 52 — Cotton' },
]

const DIVISIONS = [
  { id: 'all',          label: 'All divisions', icon: '📦' },
  { id: 'salt',         label: 'Salt',          icon: '🧂' },
  { id: 'fertilizers',  label: 'Fertilizers',   icon: '🌾' },
  { id: 'chemicals',    label: 'Chemicals',     icon: '⚗️' },
  { id: 'construction', label: 'Construction',  icon: '🏗' },
  { id: 'metals',       label: 'Metals',        icon: '🔩' },
  { id: 'minerals',     label: 'Minerals',      icon: '⛰' },
  { id: 'agro',         label: 'Agro',          icon: '🍅' },
]

export default function HSCodeBrowser() {
  const [search, setSearch] = useState('')
  const [div, setDiv]       = useState('all')
  const [copied, setCopied] = useState(null)

  const filtered = useMemo(() => {
    let res = CODES
    if (div !== 'all') res = res.filter(c => c.div === div)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      res = res.filter(c =>
        c.code.includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        c.chapter.toLowerCase().includes(q)
      )
    }
    return res
  }, [search, div])

  function copy(code) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code)
      setCopied(code)
      setTimeout(() => setCopied(null), 1500)
    }
  }

  const grouped = useMemo(() => {
    const out = {}
    for (const c of filtered) {
      if (!out[c.chapter]) out[c.chapter] = []
      out[c.chapter].push(c)
    }
    return out
  }, [filtered])

  return (
    <div className="rounded-3xl ring-1 ring-[#14161a]/10 bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-[#14161a]/10 bg-[#f9fafb]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white ring-1 ring-[#14161a]/10 text-xl">🔍</span>
          <h3 className="egg-display text-2xl text-[#14161a]">Egyptian-export HS code finder</h3>
        </div>
        <p className="text-xs text-[#7a8290] mt-1">Search by code, description, or chapter. Click any row to copy the 6-digit code.</p>
      </div>

      <div className="px-6 pt-5 pb-3 space-y-3 border-b border-[#14161a]/10">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search e.g. 'cement', 'urea', '2501', 'PVC'…"
          className="w-full text-base border border-[#14161a]/10 rounded-lg px-4 py-3 focus:border-[#ff6321] focus:ring-2 focus:ring-[#ff6321]/25 outline-none"
        />
        <div className="flex flex-wrap gap-1.5">
          {DIVISIONS.map(d => (
            <button
              key={d.id}
              onClick={() => setDiv(d.id)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                div === d.id
                  ? 'bg-[#14161a] border-[#14161a] text-white'
                  : 'bg-white border-[#14161a]/12 text-[#3f4650] hover:border-[#0fb5a5]'
              }`}
            >
              <span>{d.icon}</span> {d.label}
            </button>
          ))}
        </div>
        <div className="text-xs text-[#7a8290]">
          Showing <strong className="text-[#14161a]">{filtered.length}</strong> of {CODES.length} codes{div !== 'all' ? ` in ${DIVISIONS.find(x => x.id === div)?.label}` : ''}{search ? ` matching "${search}"` : ''}.
        </div>
      </div>

      <div className="max-h-[640px] overflow-y-auto divide-y divide-[#14161a]/10">
        {Object.entries(grouped).length === 0 ? (
          <div className="p-10 text-center text-[#7a8290] text-sm">
            No HS codes match. Try a different search term or division filter.
          </div>
        ) : Object.entries(grouped).map(([chapter, codes]) => (
          <div key={chapter}>
            <div className="px-6 py-2 bg-[#f9fafb] sticky top-0 z-10 border-b border-[#14161a]/10">
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#7a8290]">{chapter}</div>
            </div>
            <div className="divide-y divide-[#14161a]/10">
              {codes.map(c => (
                <button key={c.code} onClick={() => copy(c.code)}
                  className="w-full text-left px-6 py-3 hover:bg-[#f2fbfa] transition-colors flex items-start gap-4">
                  <code className={`font-mono font-bold text-sm shrink-0 px-2.5 py-1 rounded-md ${
                    copied === c.code ? 'bg-[#e6fbf8] text-[#0b8f84]' : 'bg-[#f3f4f6] text-[#3f4650]'
                  }`}>
                    {copied === c.code ? '✓ Copied' : c.code}
                  </code>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#14161a] font-medium">{c.desc}</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#8a93a3] shrink-0">{c.div}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-3 border-t border-[#14161a]/10 bg-[#f9fafb] text-[11px] text-[#3f4650]">
        Note: destination-country customs may apply 8/10/12-digit national extensions.
        We provide line-item-level HS classification on the Commercial Invoice.
        Unsure which code applies? <a href="/rfq?type=hs" className="text-[#0b8f84] font-semibold hover:underline">Send your spec → we'll return the canonical code →</a>
      </div>
    </div>
  )
}
