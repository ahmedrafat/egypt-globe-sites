/**
 * QaChainTable — the five-gate "extraction → destination port" verification
 * chain as a Tailwind data table. Server component. Used on the hubs and
 * the salt pillar; SKU pages carry their own copy inside ProductTabs.
 */
import Icon from './ui/Icon'

const DEFAULT_ROWS = [
  ['1', 'Extraction / source',    'Source sampling on every production lot — mine face, solar pan, plant or packhouse', 'Source laboratory · per lot'],
  ['2', 'Processing',             'Washing, screening, drying, grading or milling verified against the contract specification', 'Plant QC · per batch'],
  ['3', 'Port laboratory',        'Full analysis against contract specification; Certificate of Analysis or Mill Test Certificate issued before the Bill of Lading', 'EGG port QC lab · per shipment'],
  ['4', 'Independent inspection', 'Pre-shipment sampling, witness testing, draft survey or tally; sealed retained samples held 90 days', 'TÜV Austria / SGS / Intertek / BV · per vessel'],
  ['5', 'Destination acceptance', 'CoA cross-referenced with the buyer’s arrival laboratory; retained samples arbitrate any variance', 'Buyer laboratory · on discharge'],
]

export default function QaChainTable({ rows = DEFAULT_ROWS, title = 'QA verification chain — extraction to destination port', note }) {
  return (
    <div className="bg-white border border-[#14161a]/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 sm:px-6 py-4 border-b border-[#14161a]/10 bg-[#f9fafb] flex items-center justify-between gap-3">
        <h3 className="font-semibold text-lg text-[#14161a] flex items-center gap-2">
          <Icon name="shield" className="w-5 h-5 text-[#0b8f84]" /> {title}
        </h3>
        <span className="text-xs font-medium text-[#7a8290] hidden sm:inline">5 gates · every consignment</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white border-b border-[#14161a]/10">
            <tr>
              {['Gate', 'Control', 'Evidence', 'Who · frequency'].map((h, i) => (
                <th key={h} className={`text-left text-[10px] uppercase tracking-wider font-semibold text-[#7a8290] px-4 py-2 ${i === 2 ? 'hidden md:table-cell' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#14161a]/10">
            {rows.map(([n, stage, evidence, who]) => (
              <tr key={n} className="hover:bg-[#f9fafb]">
                <td className="px-4 py-2.5 align-top"><span className="inline-flex w-6 h-6 items-center justify-center rounded-md ring-1 ring-[#14161a]/15 text-[#14161a] text-[11px] font-mono font-bold">{n}</span></td>
                <td className="px-4 py-2.5 align-top text-[#14161a] text-xs font-semibold">{stage}</td>
                <td className="px-4 py-2.5 align-top text-[#3f4650] text-xs hidden md:table-cell">{evidence}</td>
                <td className="px-4 py-2.5 align-top text-[#3f4650] text-xs font-mono">{who}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="px-5 py-3 text-[11px] text-[#7a8290] bg-[#f9fafb] border-t border-[#14161a]/10 leading-relaxed">{note}</p>}
    </div>
  )
}

/** Generic two- or multi-column spec table used by the hub pages. */
export function DataTable({ title, icon = 'beaker', head, rows, note, mono = [] }) {
  return (
    <div className="bg-white border border-[#14161a]/10 rounded-2xl overflow-hidden shadow-sm">
      {title && (
        <div className="px-5 sm:px-6 py-4 border-b border-[#14161a]/10 bg-[#f9fafb]">
          <h3 className="font-semibold text-lg text-[#14161a] flex items-center gap-2"><Icon name={icon} className="w-5 h-5 text-[#0b8f84]" /> {title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white border-b border-[#14161a]/10">
            <tr>{head.map(h => <th key={h} className="text-left text-[10px] uppercase tracking-wider font-semibold text-[#7a8290] px-4 py-2">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[#14161a]/10">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-[#f9fafb]">
                {r.map((c, j) => (
                  <td key={j} className={`px-4 py-2.5 align-top text-xs ${j === 0 ? 'text-[#14161a] font-semibold' : 'text-[#3f4650]'} ${mono.includes(j) ? 'font-mono' : ''}`}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="px-5 py-3 text-[11px] text-[#7a8290] bg-[#f9fafb] border-t border-[#14161a]/10 leading-relaxed">{note}</p>}
    </div>
  )
}
