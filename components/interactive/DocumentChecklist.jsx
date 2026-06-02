'use client'

/**
 * DocumentChecklist — Drop 132 interactive widget.
 *
 * Replaces the markdown "Quality and paperwork" paragraph with an
 * expandable checklist of every document Egypt Globe Group ships with
 * each consignment. Buyer can expand any row to see what the document
 * is for / which authority issues it / when it ships (advance PDF vs
 * original by courier).
 */
import { useState } from 'react'

const DOCS = [
  {
    id: 'commercial-invoice',
    icon: '📄',
    name: 'Commercial Invoice',
    short: 'Egyptian Chamber of Commerce stamped',
    full: 'Itemised invoice listing each line of cargo with HS code + value. Stamped by the Egyptian Chamber of Commerce + GAFI / GOEIC where required. Notarised on request for L/C banks that need it. Issued in 3 originals.',
    advance: true,
    courier: true,
    required: 'always',
  },
  {
    id: 'packing-list',
    icon: '📦',
    name: 'Packing List',
    short: 'Container + seal numbers, gross + net per line',
    full: 'Detailed packing list itemising every container (number + seal), gross + net weight per line, marks + numbers, count per packing format. Excel mode available for L/C bank line-by-line verification.',
    advance: true,
    courier: true,
    required: 'always',
  },
  {
    id: 'bill-of-lading',
    icon: '🚢',
    name: 'Bill of Lading (B/L)',
    short: 'Negotiable, 3 originals — issued on vessel sailing',
    full: 'Negotiable Bill of Lading from the carrier — proof of contract of carriage + receipt of cargo + title document. Standard 3 originals + 3 non-negotiable copies. "To order" endorsement common for L/C shipments. Released against payment / L/C presentation.',
    advance: false,
    courier: true,
    required: 'always',
  },
  {
    id: 'cert-of-origin',
    icon: '🏅',
    name: 'Certificate of Origin',
    short: 'Egyptian Chamber + COMESA / PAFTA forms',
    full: 'Confirms Egyptian origin for customs valuation. PAFTA / COMESA / EU-Med preferential forms issued where the shipment qualifies (substantial transformation in Egypt with appropriate value-add). Often saves 5-25% destination duty.',
    advance: true,
    courier: true,
    required: 'always',
  },
  {
    id: 'mtc-coa',
    icon: '🧪',
    name: 'Mill Test Certificate / CoA',
    short: 'Per-shipment QC analysis from internal lab',
    full: 'Certificate of Analysis from our internal QC lab covering every spec parameter on the product page (purity, moisture, particle size, heavy metals, chemistry). Independent third-party verification (TÜV Austria / SGS / Intertek / Bureau Veritas) available on request — typical cost 0.3-0.5% of FOB.',
    advance: true,
    courier: true,
    required: 'always',
  },
  {
    id: 'phyto',
    icon: '🌿',
    name: 'Phytosanitary Certificate',
    short: 'Egyptian Min. of Agriculture — agro / plant cargo',
    full: 'Required for agricultural commodities (fresh produce, grains, oilseeds, pulses, biomass) entering most destination markets. Issued by Egyptian Ministry of Agriculture inspection officers at the port of loading.',
    advance: false,
    courier: true,
    required: 'agricultural-only',
  },
  {
    id: 'health',
    icon: '🩺',
    name: 'Health Certificate',
    short: 'Egyptian Drug Authority — food / pharma cargo',
    full: 'Required for food, pharmaceutical, cosmetic, and food-contact materials. Issued by the Egyptian Drug Authority. Halal certificate from the Egyptian Islamic Food Authority (ESIC) issued in parallel for Halal markets.',
    advance: false,
    courier: true,
    required: 'food/pharma-only',
  },
  {
    id: 'insurance',
    icon: '🛡',
    name: 'Insurance Certificate',
    short: 'For CIF / CIP shipments — 110% of CIF value',
    full: 'Marine cargo insurance certificate covering 110% of CIF value (per Incoterms convention). All-risks cover including Strikes / Riots / War clauses. Sold via Allianz, AIG, Coface, Atradius — buyer\'s choice.',
    advance: true,
    courier: true,
    required: 'CIF/CIP-only',
  },
  {
    id: 'inspection',
    icon: '🔍',
    name: 'Pre-Shipment Inspection',
    short: 'Optional 3rd-party (TÜV Austria / SGS / Intertek / BV)',
    full: 'Optional independent inspection at the port of loading — covers product spec compliance + quantity + packing + container condition. Required by some destination conformity programmes (KEBS PVoC, SONCAP, SABER). Cost typically 0.3-0.5% of FOB value.',
    advance: true,
    courier: true,
    required: 'optional',
  },
]

export default function DocumentChecklist() {
  const [open, setOpen] = useState(null)

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-orange-50 border border-blue-100 text-xl shadow-sm">📋</span>
          <h3 className="text-xl font-extrabold text-slate-900">Documents shipped with every consignment</h3>
        </div>
        <p className="text-xs text-slate-500 mt-1">Click any row to expand. Advance PDF goes by email for L/C bank lodging; originals follow by DHL / FedEx.</p>
      </div>

      <div className="divide-y divide-slate-100">
        {DOCS.map(d => {
          const isOpen = open === d.id
          return (
            <div key={d.id}>
              <button
                onClick={() => setOpen(isOpen ? null : d.id)}
                className={`w-full text-left px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50/60 transition-colors ${isOpen ? 'bg-slate-50/40' : ''}`}
              >
                <span className="text-2xl shrink-0 mt-0.5">{d.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">{d.name}</span>
                    {d.required === 'always' && <Badge color="bg-emerald-100 text-emerald-800 border-emerald-200">Always</Badge>}
                    {d.required === 'CIF/CIP-only' && <Badge color="bg-blue-100 text-blue-800 border-blue-200">CIF / CIP only</Badge>}
                    {d.required === 'agricultural-only' && <Badge color="bg-green-100 text-green-800 border-green-200">Agro only</Badge>}
                    {d.required === 'food/pharma-only' && <Badge color="bg-pink-100 text-pink-800 border-pink-200">Food / pharma only</Badge>}
                    {d.required === 'optional' && <Badge color="bg-slate-100 text-slate-700 border-slate-200">Optional</Badge>}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{d.short}</div>
                </div>
                <span className={`shrink-0 mt-1 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isOpen ? 'bg-[#1d5fa1] text-white' : 'bg-slate-100 text-slate-600'
                }`} aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100">
                  <p className="text-sm text-slate-700 leading-relaxed">{d.full}</p>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <DeliveryFlag label="PDF advance email" enabled={d.advance} />
                    <DeliveryFlag label="Originals via courier" enabled={d.courier} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/40 text-xs text-slate-600">
        <strong className="text-slate-900">Letter of Credit (L/C) shipments:</strong> we lodge the full document set within 24 hours of vessel sailing for sight L/C presentation, or per the L/C terms for usance.
      </div>
    </div>
  )
}

function Badge({ color, children }) {
  return <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${color}`}>{children}</span>
}

function DeliveryFlag({ label, enabled }) {
  return (
    <div className={`flex items-center gap-1.5 ${enabled ? 'text-emerald-700' : 'text-slate-400'}`}>
      <span className={`inline-block w-3 h-3 rounded-full ${enabled ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      <span className={enabled ? 'font-semibold' : ''}>{label}</span>
    </div>
  )
}
