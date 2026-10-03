/**
 * QaChainTable — the five-gate "extraction → destination port" verification
 * chain as a Tailwind data table. Server component. Used on the hubs and
 * the salt pillar; SKU pages carry their own copy inside ProductTabs.
 */
import Icon from './ui/Icon'
import QaChainSteps from './ui/QaChainSteps'
import FactGrid from './ui/FactGrid'
import { classifyTable } from '../lib/tableShapes'

const DEFAULT_ROWS = [
  ['1', 'Extraction / source',    'Source sampling on every production lot — mine face, solar pan, plant or packhouse', 'Source laboratory · per lot'],
  ['2', 'Processing',             'Washing, screening, drying, grading or milling verified against the contract specification', 'Plant QC · per batch'],
  ['3', 'Port laboratory',        'Full analysis against contract specification; Certificate of Analysis or Mill Test Certificate issued before the Bill of Lading', 'EGG port QC lab · per shipment'],
  ['4', 'Independent inspection', 'Pre-shipment sampling, witness testing, draft survey or tally; sealed retained samples held 90 days', 'TÜV Austria / SGS / Intertek / BV · per vessel'],
  ['5', 'Destination acceptance', 'CoA cross-referenced with the buyer’s arrival laboratory; retained samples arbitrate any variance', 'Buyer laboratory · on discharge'],
]

export default function QaChainTable({ rows = DEFAULT_ROWS, title = 'QA verification chain — extraction to destination port', note }) {
  // Sep 2026 — rendered as the five-step visual, not a table.
  const gates = rows.map(([n, stage, control, who]) => ({ n, stage, control, who }))
  return <QaChainSteps gates={gates} title={title} note={note} />
}

/** Generic two- or multi-column spec table used by the hub pages. */
export function DataTable({ title, icon = 'beaker', head, rows, note, mono = [], minWidth }) {
  // Two-column parameter lists read better as a fact grid than a table.
  if (head?.length === 2 && classifyTable(head, rows) === 'facts') {
    return <FactGrid title={title} icon={icon} items={rows} note={note} />
  }
  // Three columns of long text get ~100 px each on a phone and wrap to eight lines.
  // Below sm those tables stack: parameter as a heading, each value under its
  // column label (data-label + a CSS ::before — one copy of the content, no
  // duplicated DOM). Wide or numeric matrices, and anything with a minWidth, keep
  // the horizontal scroll.
  const cells = rows.flatMap(r => r.slice(1)).map(c => String(c ?? '').length)
  const stack = !minWidth && head?.length === 3 && cells.length > 0 && cells.reduce((a, b) => a + b, 0) / cells.length > 28
  return (
    <div className="bg-white border border-[#14161a]/10 rounded-2xl overflow-hidden shadow-sm">
      {title && (
        <div className="px-5 sm:px-6 py-4 border-b border-[#14161a]/10 bg-[#f9fafb]">
          <h3 className="font-semibold text-lg text-[#14161a] flex items-center gap-2"><Icon name={icon} className="w-5 h-5 text-[#087a70]" /> {title}</h3>
        </div>
      )}
      <div className="overflow-x-auto" tabIndex={0}>
        <table className={`w-full text-sm ${stack ? 'max-sm:block' : ''}`} style={minWidth ? { minWidth } : undefined}>
          <thead className={`bg-white border-b border-[#14161a]/10 ${stack ? 'max-sm:sr-only' : ''}`}>
            <tr>{head.map(h => <th key={h} className="text-left text-[11px] uppercase tracking-wider font-semibold text-[#5b6577] px-4 py-2">{h}</th>)}</tr>
          </thead>
          <tbody className={`divide-y divide-[#14161a]/10 ${stack ? 'max-sm:block' : ''}`}>
            {rows.map((r, i) => (
              <tr key={i} className={`hover:bg-[#f9fafb] ${stack ? 'max-sm:block max-sm:py-3' : ''}`}>
                {r.map((c, j) => (
                  <td key={j} data-label={stack && j > 0 ? head[j] : undefined}
                    className={`px-4 py-2.5 align-top text-xs ${j === 0 ? 'text-[#14161a] font-semibold' : 'text-[#3f4650]'} ${mono.includes(j) ? 'font-mono' : ''} ${stack ? `max-sm:block max-sm:py-1 max-sm:text-[13px] ${j === 0 ? 'max-sm:text-sm' : 'max-sm:before:block max-sm:before:text-[10px] max-sm:before:uppercase max-sm:before:tracking-wider max-sm:before:font-semibold max-sm:before:text-[#5b6577] max-sm:before:content-[attr(data-label)]'}` : ''}`}>{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="px-5 py-3 text-[11px] text-[#5b6577] bg-[#f9fafb] border-t border-[#14161a]/10 leading-relaxed">{note}</p>}
    </div>
  )
}
