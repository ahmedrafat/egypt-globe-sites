/**
 * QaChainSteps — the five-gate verification chain as a visual sequence,
 * not a data table. Server component.
 *
 * This is the module that makes the group different, so it gets one
 * recognisable treatment site-wide: numbered gates on a hairline rail,
 * the control in plain text, the evidence as a labelled line, and who
 * signs it in mono. Replaces QaChainTable / QaChainStrip (Sep 2026).
 *
 * Markup mirrors the HTML the markdown renderer emits for a "Gate" table
 * (lib/tableShapes.js) so CMS bodies and templates look the same. Styles
 * live in globals.css under "Verification chain".
 */
import Icon from './Icon'

export const DEFAULT_GATES = [
  { n: '1', stage: 'Extraction / source',    control: 'Source sampling on every production lot — mine face, solar pan, plant or packhouse.', evidence: 'Source analysis sheet', who: 'Source laboratory · per lot' },
  { n: '2', stage: 'Processing',             control: 'Washing, screening, drying, grading or milling verified against the contract specification.', evidence: 'Batch record, packing list by lot', who: 'Plant QC · per batch' },
  { n: '3', stage: 'Port laboratory',        control: 'Full analysis against the contract specification; the Certificate of Analysis or Mill Test Certificate is issued before the Bill of Lading.', evidence: 'CoA / MTC, retained sample', who: 'EGG port QC lab · per shipment' },
  { n: '4', stage: 'Independent inspection', control: 'Pre-shipment sampling, witness testing, draft survey or tally; sealed retained samples held 90 days.', evidence: 'Inspection certificate, draft survey report', who: 'TÜV Austria / SGS / Intertek / BV · per vessel' },
  { n: '5', stage: 'Destination acceptance', control: 'The buyer’s arrival laboratory reconciles against the CoA; retained samples arbitrate any variance.', evidence: 'Arrival test report', who: 'Buyer laboratory · on discharge' },
]

export default function QaChainSteps({ gates = DEFAULT_GATES, title = 'QA verification chain — extraction to destination port', kicker = 'Verification chain', note, className = '' }) {
  return (
    <section className={`egg-chain ${className}`} aria-label={title}>
      <div className="egg-chain-head">
        <span className="egg-chain-kicker"><Icon name="shield" className="w-3.5 h-3.5" /> {kicker}</span>
        <span className="egg-chain-meta">{gates.length} gates · every consignment</span>
      </div>
      {title && <h3 className="egg-chain-title">{title}</h3>}
      <ol className="egg-chain-list">
        {gates.map(g => (
          <li key={g.n} className="egg-gate">
            <div className="egg-gate-n"><span>{g.n}</span></div>
            <div className="egg-gate-body">
              <p className="egg-gate-stage">{g.stage}</p>
              <p className="egg-gate-control">{g.control}</p>
              {g.evidence && <p className="egg-gate-evidence"><span className="egg-gate-k">Evidence</span>{g.evidence}</p>}
              {g.who && <p className="egg-gate-who">{g.who}</p>}
            </div>
          </li>
        ))}
      </ol>
      {note && <p className="egg-chain-note">{note}</p>}
    </section>
  )
}
