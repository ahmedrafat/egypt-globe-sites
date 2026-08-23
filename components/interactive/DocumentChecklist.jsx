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
import Icon from '../ui/Icon'

const DOCS = [
  {
    id: 'commercial-invoice',
    icon: 'doc',
    name: 'Commercial Invoice',
    short: 'Egyptian Chamber of Commerce stamped',
    full: 'Itemised invoice listing each line of cargo with HS code + value. Stamped by the Egyptian Chamber of Commerce + GAFI / GOEIC where required. Notarised on request for L/C banks that need it. Issued in 3 originals.',
    advance: true,
    courier: true,
    required: 'always',
  },
  {
    id: 'packing-list',
    icon: 'box',
    name: 'Packing List',
    short: 'Container + seal numbers, gross + net per line',
    full: 'Detailed packing list itemising every container (number + seal), gross + net weight per line, marks + numbers, count per packing format. Excel mode available for L/C bank line-by-line verification.',
    advance: true,
    courier: true,
    required: 'always',
  },
  {
    id: 'bill-of-lading',
    icon: 'ship',
    name: 'Bill of Lading (B/L)',
    short: 'Negotiable, 3 originals — issued on vessel sailing',
    full: 'Negotiable Bill of Lading from the carrier — proof of contract of carriage + receipt of cargo + title document. Standard 3 originals + 3 non-negotiable copies. "To order" endorsement common for L/C shipments. Released against payment / L/C presentation.',
    advance: false,
    courier: true,
    required: 'always',
  },
  {
    id: 'cert-of-origin',
    icon: 'shield',
    name: 'Certificate of Origin',
    short: 'Egyptian Chamber + COMESA / PAFTA forms',
    full: 'Confirms Egyptian origin for customs valuation. PAFTA / COMESA / EU-Med preferential forms issued where the shipment qualifies (substantial transformation in Egypt with appropriate value-add). Often saves 5-25% destination duty.',
    advance: true,
    courier: true,
    required: 'always',
  },
  {
    id: 'mtc-coa',
    icon: 'beaker',
    name: 'Mill Test Certificate / CoA',
    short: 'Per-shipment QC analysis from internal lab',
    full: 'Certificate of Analysis from our internal QC lab covering every spec parameter on the product page (purity, moisture, particle size, heavy metals, chemistry). Independent third-party verification (TÜV Austria / SGS / Intertek / Bureau Veritas) available on request — typical cost 0.3-0.5% of FOB.',
    advance: true,
    courier: true,
    required: 'always',
  },
  {
    id: 'phyto',
    icon: 'leaf',
    name: 'Phytosanitary Certificate',
    short: 'Egyptian Min. of Agriculture — agro / plant cargo',
    full: 'Required for agricultural commodities (fresh produce, grains, oilseeds, pulses, biomass) entering most destination markets. Issued by Egyptian Ministry of Agriculture inspection officers at the port of loading.',
    advance: false,
    courier: true,
    required: 'agricultural-only',
  },
  {
    id: 'health',
    icon: 'pill',
    name: 'Health Certificate',
    short: 'Egyptian Drug Authority — food / pharma cargo',
    full: 'Required for food, pharmaceutical, cosmetic, and food-contact materials. Issued by the Egyptian Drug Authority. Halal certificate from the Egyptian Islamic Food Authority (ESIC) issued in parallel for Halal markets.',
    advance: false,
    courier: true,
    required: 'food/pharma-only',
  },
  {
    id: 'insurance',
    icon: 'shield',
    name: 'Insurance Certificate',
    short: 'For CIF / CIP shipments — 110% of CIF value',
    full: 'Marine cargo insurance certificate covering 110% of CIF value (per Incoterms convention). All-risks cover including Strikes / Riots / War clauses. Sold via Allianz, AIG, Coface, Atradius — buyer\'s choice.',
    advance: true,
    courier: true,
    required: 'CIF/CIP-only',
  },
  {
    id: 'inspection',
    icon: 'search',
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
    <div className="rounded-3xl ring-1 ring-[#14161a]/10 bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-[#14161a]/10 bg-[#f9fafb]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white ring-1 ring-[#14161a]/10 text-[#14161a]"><Icon name="doc" className="w-4 h-4" /></span>
          <h3 className="egg-display text-2xl text-[#14161a]">Documents shipped with every consignment</h3>
        </div>
        <p className="text-xs text-[#7a8290] mt-1">Click any row to expand. Advance PDF goes by email for L/C bank lodging; originals follow by DHL / FedEx.</p>
      </div>

      <div className="divide-y divide-[#14161a]/10">
        {DOCS.map(d => {
          const isOpen = open === d.id
          return (
            <div key={d.id}>
              <button
                onClick={() => setOpen(isOpen ? null : d.id)}
                className={`w-full text-left px-5 py-3.5 flex items-start gap-3 hover:bg-[#f9fafb] transition-colors ${isOpen ? 'bg-[#f9fafb]' : ''}`}
              >
                <span className="shrink-0 inline-flex w-9 h-9 items-center justify-center rounded-lg ring-1 ring-[#14161a]/15 text-[#14161a]"><Icon name={d.icon} className="w-4 h-4" /></span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#14161a]">{d.name}</span>
                    {d.required === 'always' && <Badge color="bg-[#e6fbf8] text-[#0b8f84] border-[#0fb5a5]/40">Always</Badge>}
                    {d.required === 'CIF/CIP-only' && <Badge color="bg-[#eef6fd] text-[#0369a1] border-[#0284c7]/35">CIF / CIP only</Badge>}
                    {d.required === 'agricultural-only' && <Badge color="bg-green-100 text-green-800 border-green-200">Agro only</Badge>}
                    {d.required === 'food/pharma-only' && <Badge color="bg-pink-100 text-pink-800 border-pink-200">Food / pharma only</Badge>}
                    {d.required === 'optional' && <Badge color="bg-[#f3f4f6] text-[#3f4650] border-[#14161a]/10">Optional</Badge>}
                  </div>
                  <div className="text-xs text-[#7a8290] mt-0.5">{d.short}</div>
                </div>
                <span className={`shrink-0 mt-1 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isOpen ? 'bg-[#ff6321] text-white' : 'bg-[#f3f4f6] text-[#3f4650]'
                }`} aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-[#14161a]/10">
                  <p className="text-sm text-[#3f4650] leading-relaxed">{d.full}</p>
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

      <div className="px-5 py-3 border-t border-[#14161a]/10 bg-[#f9fafb] text-xs text-[#3f4650]">
        <strong className="text-[#14161a]">Letter of Credit (L/C) shipments:</strong> we lodge the full document set within 24 hours of vessel sailing for sight L/C presentation, or per the L/C terms for usance.
      </div>
    </div>
  )
}

function Badge({ color, children }) {
  return <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${color}`}>{children}</span>
}

function DeliveryFlag({ label, enabled }) {
  return (
    <div className={`flex items-center gap-1.5 ${enabled ? 'text-[#0b8f84]' : 'text-[#8a93a3]'}`}>
      <span className={`inline-block w-3 h-3 rounded-full ${enabled ? 'bg-[#0fb5a5]' : 'bg-[#c9ced6]'}`} />
      <span className={enabled ? 'font-semibold' : ''}>{label}</span>
    </div>
  )
}
