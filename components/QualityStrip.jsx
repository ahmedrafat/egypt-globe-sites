/**
 * QualityStrip — the "Quality at the Core" trust anchor, reused on every
 * division, sub-category and application landing.
 *
 * Four non-negotiables + the one-line institutional statement. Server
 * component; monochrome micro-icons only.
 */
import Link from 'next/link'
import Icon from './ui/Icon'

const POINTS = [
  { icon: 'shield', t: 'Zero tolerance on specification deviation', b: 'A lot outside its Certificate of Analysis is rejected at the loading port — never re-graded, blended down or renegotiated.' },
  { icon: 'beaker', t: 'Per-lot laboratory verification',           b: 'Source and port laboratories test every lot against the contract specification before a Bill of Lading is issued.' },
  { icon: 'doc',    t: 'Independent third-party inspection',        b: 'TÜV Austria, SGS, Intertek or Bureau Veritas (ISO/IEC 17020 / 17025) sample and witness at any of seven Egyptian ports.' },
  { icon: 'clock',  t: 'Laycan and grading discipline',             b: 'Documented Notice of Readiness and Statement of Facts on every vessel; sieve, assay and moisture verified per lot.' },
]

export default function QualityStrip({ division, compact = false }) {
  return (
    <section className="bg-[#f9fafb] border-b border-[#14161a]/10">
      <div className={`max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 ${compact ? 'py-8' : 'py-12 lg:py-14'} grid lg:grid-cols-12 gap-8 lg:gap-12 items-start`}>
        <div className="lg:col-span-4">
          <p className="flex items-center gap-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.26em] text-[#7a8290]">
            <span className="h-px w-8 bg-[#b8862b]/60" />
            <span className="text-[#b8862b]">Quality at the Core · since 2014</span>
          </p>
          <h2 className="egg-display mt-4 text-2xl sm:text-3xl text-[#14161a] leading-[1.1]">
            Institutional reliability in {division ? `${division.toLowerCase()} export` : 'bulk commodity exporting'}.
          </h2>
          <p className="mt-3 text-sm text-[#3f4650] leading-relaxed">
            Egypt Globe Group was incorporated with a dedicated Quality Assurance division at its nucleus.
            Specification is guaranteed at the port of loading and binding under the sales contract — the
            Certificate of Analysis the buyer&rsquo;s own arrival laboratory reproduces, shipment after shipment.
          </p>
          <Link href="/about/quality-compliance" className="egg-link mt-3 inline-flex items-center gap-1.5 text-sm">
            <Icon name="shield" className="w-3.5 h-3.5" /> Read the QA charter →
          </Link>
        </div>
        <div className="lg:col-span-8 grid sm:grid-cols-2 gap-px rounded-2xl overflow-hidden ring-1 ring-[#14161a]/10 bg-[#14161a]/10">
          {POINTS.map(p => (
            <div key={p.t} className="bg-white p-5 hover:bg-[#f6f7f9] transition-colors">
              <span className="inline-flex w-8 h-8 items-center justify-center rounded-lg ring-1 ring-[#14161a]/15 text-[#14161a]">
                <Icon name={p.icon} className="w-4 h-4" />
              </span>
              <h3 className="mt-3 text-sm font-semibold text-[#14161a] leading-snug">{p.t}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5b6472]">{p.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
