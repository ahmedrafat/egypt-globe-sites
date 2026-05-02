/**
 * PackingMatrix — comprehensive packing display for any product page.
 *
 * Drop 141 — replaces the simple chip grid that used to render only the
 * product's own packing_options array. Now shows the FULL master packing
 * matrix from globe_packing_options:
 *
 *   - Loose Bulk           (no packing, direct vessel hold)
 *   - Bag                  (50kg / 25kg / 5kg in PP / Laminated PP /
 *                          PE woven / Kraft / HDPE-lined kraft)
 *   - Jumbo Bag            (1 / 1.25 / 1.5 MT FIBC ± PE liner)
 *   - Bag in Jumbo         (any inner bag stacked inside a 1MT FIBC,
 *                          loaded on bulk vessels — the "any packing
 *                          inside FIBC and loaded in bulk vessels" mode
 *                          Ahmed flagged was missing from the public UI)
 *   - OEM                  (custom size / material / print on request)
 *
 * Mobile-first: cards stack 1-col on phones, 2-col sm+, 3-col lg+.
 * Each card shows: icon · name · material+size · vessel-mode chips
 * (Bulk vessel | Container) · OEM badge if applicable · MOQ.
 *
 * Highlights "Standard for this product" rows when the product's own
 * packing_options array overlaps the master row name.
 */
import Link from 'next/link'

const CATEGORY_META = {
  'Loose Bulk':   { icon: '⛴️', tone: 'bg-cyan-50    text-cyan-700    border-cyan-100',    label: 'Loose Bulk' },
  'Bag':          { icon: '🛍️', tone: 'bg-amber-50   text-amber-700   border-amber-100',   label: 'Bagged' },
  'Jumbo Bag':    { icon: '🧰', tone: 'bg-violet-50  text-violet-700  border-violet-100',  label: 'FIBC Jumbo Bags' },
  'Bag in Jumbo': { icon: '📦', tone: 'bg-emerald-50 text-emerald-700 border-emerald-100', label: 'Bag-in-Jumbo (bulk vessel)' },
  'OEM':          { icon: '🎨', tone: 'bg-rose-50    text-rose-700    border-rose-100',    label: 'OEM / Custom' },
}

const CATEGORY_ORDER = ['Loose Bulk', 'Bag', 'Jumbo Bag', 'Bag in Jumbo', 'OEM']

function vesselModeChip(mode) {
  if (mode === 'Bulk') return { label: '⛴️ Bulk vessel', cls: 'bg-cyan-100 text-cyan-800 border-cyan-200' }
  if (mode === 'Container') return { label: '📦 Container', cls: 'bg-blue-100 text-blue-800 border-blue-200' }
  return { label: mode, cls: 'bg-slate-100 text-slate-700 border-slate-200' }
}

export default function PackingMatrix({ packingOptions = [], productPackingOptions = [] }) {
  if (!packingOptions || packingOptions.length === 0) {
    // Fallback to product's own array if master fetch failed
    if (productPackingOptions.length === 0) return null
    return <SimplePackingChips packing={productPackingOptions} />
  }

  // Lower-case set of the product's own packing labels for highlighting
  const productSet = new Set(productPackingOptions.map(p => String(p || '').toLowerCase()))

  // Group by category
  const byCategory = {}
  for (const p of packingOptions) {
    const k = p.category || 'Other'
    if (!byCategory[k]) byCategory[k] = []
    byCategory[k].push(p)
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <span className="text-xl" aria-hidden>📦</span>
          Packing &amp; Containerisation
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {packingOptions.length} formats · loaded as FIBC / bagged / bulk on container or bulk vessel.
          Inner liners, laminate, OEM print, and bag-in-jumbo all available.
        </p>
      </div>

      {/* Sections */}
      <div className="divide-y divide-slate-100">
        {CATEGORY_ORDER.filter(c => byCategory[c]?.length).map(category => {
          const meta = CATEGORY_META[category] || { icon: '📦', tone: 'bg-slate-50 text-slate-700 border-slate-200', label: category }
          const items = byCategory[category]
          return (
            <div key={category} className="px-5 sm:px-6 py-4">
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${meta.tone}`}>
                  <span>{meta.icon}</span> {meta.label}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{items.length} {items.length === 1 ? 'format' : 'formats'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {items.map(p => {
                  const isProduct = productSet.has(String(p.packing_name || '').toLowerCase())
                  const modes = (p.vessel_modes || []).map(vesselModeChip)
                  return (
                    <div key={p.id}
                      className={`relative rounded-xl border bg-white p-3.5 transition-shadow hover:shadow-sm ${isProduct ? 'border-[#1d5fa1]/40 ring-1 ring-[#1d5fa1]/10' : 'border-slate-200'}`}>
                      {isProduct && (
                        <span className="absolute -top-2 right-3 text-[9px] font-bold uppercase tracking-wider bg-[#1d5fa1] text-white px-2 py-0.5 rounded-full shadow-sm">
                          Standard
                        </span>
                      )}
                      <div className="flex items-start gap-2.5">
                        <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${meta.tone.split(' ').slice(0, 2).join(' ')}`}>
                          {meta.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-slate-900 leading-tight">
                            {p.packing_name}
                          </div>
                          {(p.material || p.size_kg) && (
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {p.size_kg ? `${Number(p.size_kg)} kg` : ''}
                              {p.size_kg && p.material ? ' · ' : ''}
                              {p.material || ''}
                              {p.inner_liner ? ' · PE liner' : ''}
                            </div>
                          )}
                          {/* Vessel-mode + OEM chip rail */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {modes.map((m, i) => (
                              <span key={i} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${m.cls}`}>
                                {m.label}
                              </span>
                            ))}
                            {p.oem_available && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                                🎨 OEM
                              </span>
                            )}
                          </div>
                          {p.min_order_mt && (
                            <div className="text-[10px] text-slate-400 mt-1.5 font-medium">
                              MOQ {Number(p.min_order_mt) >= 1000 ? `${(Number(p.min_order_mt)/1000)}k` : Number(p.min_order_mt)} MT
                            </div>
                          )}
                          {p.notes && (
                            <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                              {p.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer note */}
      <div className="px-5 sm:px-6 py-3 bg-slate-50/60 border-t border-slate-100">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          <strong className="text-slate-700">Bag-in-Jumbo</strong> means any inner bag (PP / PE / Kraft / Laminated)
          can be hand-stacked inside a 1MT FIBC and loaded on a <strong>bulk vessel</strong> — combines retail-ready
          packing with bulk-vessel economics.
          OEM printing, custom sizes, and inner liners on request.{' '}
          <Link href="/services/packing" className="text-[#1d5fa1] font-semibold hover:underline">View packing services →</Link>
        </p>
      </div>
    </div>
  )
}

// Fallback when master packing options aren't available (Supabase down etc.)
function SimplePackingChips({ packing }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
        <span className="text-xl" aria-hidden>📦</span> Available packing formats
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {packing.map((p, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/40 p-3">
            <span className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-base flex-shrink-0">📦</span>
            <span className="text-sm font-semibold text-slate-900">{p}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-4">
        OEM / private-label printing on request.{' '}
        <Link href="/services/packing" className="text-[#1d5fa1] font-semibold hover:underline">View packing services →</Link>
      </p>
    </div>
  )
}
