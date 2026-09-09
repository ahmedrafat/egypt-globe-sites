/**
 * FactGrid — label / value pairs as a definition list laid out as cells,
 * for MOQ, packing, ports, lead time, HS code and the like. Replaces the
 * two-column "Parameter | Detail" tables (Sep 2026). Server component.
 *
 * `items` is an array of [label, value] pairs or { k, v } objects.
 * Markup mirrors the HTML the markdown renderer emits for 2-column
 * tables (lib/tableShapes.js); styles in globals.css under "Fact grid".
 */
import Icon from './Icon'

export default function FactGrid({ items = [], title, icon = 'anchor', note, className = '' }) {
  const pairs = items.map(it => Array.isArray(it) ? { k: it[0], v: it[1] } : it).filter(p => p && p.k && p.v)
  if (!pairs.length) return null
  return (
    <section className={`egg-factbox ${className}`}>
      {title && (
        <div className="egg-factbox-head">
          <h3 className="egg-factbox-title"><Icon name={icon} className="w-4 h-4 text-[#087a70]" /> {title}</h3>
          <span className="egg-factbox-meta">{pairs.length} parameters</span>
        </div>
      )}
      <dl className="egg-facts">
        {pairs.map(p => (
          <div key={p.k} className="egg-fact">
            <dt className="egg-fact-k">{p.k}</dt>
            <dd className="egg-fact-v">{p.v}</dd>
          </div>
        ))}
      </dl>
      {note && <p className="egg-factbox-note">{note}</p>}
    </section>
  )
}
