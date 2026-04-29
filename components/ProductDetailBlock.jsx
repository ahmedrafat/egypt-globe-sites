/**
 * ProductDetailBlock — PelotSalt-style rich product detail surface.
 *
 * Renders the product's commodity-master link, technical specs grid,
 * certifications, packing options, applications, regions and
 * commercial terms (HS code / MOQ / lead time / price indication).
 * Only mounts when the page row carries any of these fields.
 */
import Link from 'next/link'

const SPEC_LABELS = {
  // Cement
  standard: 'Standard',
  compressive_2d: 'Compressive 2-day',
  compressive_7d: 'Compressive 7-day',
  compressive_28d: 'Compressive 28-day',
  blaine_fineness: 'Blaine fineness',
  so3_max: 'SO₃ max',
  so3: 'SO₃',
  mgo_max: 'MgO max',
  loi_max: 'LOI max',
  insoluble_residue: 'Insoluble residue',
  c3a: 'C₃A',
  c3a_max: 'C₃A max',
  chloride_max: 'Chloride max',
  initial_setting: 'Initial setting',
  final_setting: 'Final setting',
  sulfate_resistance: 'Sulfate resistance',
  // Salt / chemicals
  nacl_min: 'NaCl min',
  moisture_max: 'Moisture max',
  water_insolubles: 'Water insolubles',
  ca_max: 'Ca max',
  mg_max: 'Mg max',
  so4_max: 'SO₄ max',
  particle_size: 'Particle size',
  bulk_density: 'Bulk density',
  colour: 'Colour',
  origin: 'Origin',
  natural: 'Natural',
  anti_caking: 'Anti-caking',
  // Fertilizer
  nitrogen_min: 'Nitrogen min',
  biuret_max: 'Biuret max',
  free_flowing: 'Free-flowing',
  k2o_min: 'K₂O min',
  cl_max: 'Cl max',
  p2o5_min: 'P₂O₅ min',
  p2o5_content: 'P₂O₅ content',
  water_soluble: 'Water-soluble',
  free_acid_max: 'Free acid max',
  water_solubility: 'Water solubility',
  ph_solution: 'pH (solution)',
  // Chemicals
  concentration: 'Concentration',
  iron_max: 'Iron max',
  free_chlorine: 'Free chlorine',
  specific_gravity: 'Specific gravity',
  un_number: 'UN number',
  fe_max: 'Fe max',
  // Construction / minerals
  caso4_min: 'CaSO₄ min',
  caco3_min: 'CaCO₃ min',
  purity_options: 'Purity options',
  sio2_max: 'SiO₂ max',
}

function prettyKey(k) {
  return SPEC_LABELS[k] || k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function ProductDetailBlock({ page, commodity }) {
  const specs = page.specs || {}
  const specEntries = Object.entries(specs).filter(([, v]) => v !== null && v !== '' && v !== undefined)
  const certifications = page.certifications || []
  const packing = page.packing_options || []
  const applications = page.applications || []
  const regions = page.regions || []

  const hasAnything =
    specEntries.length > 0 ||
    certifications.length > 0 ||
    packing.length > 0 ||
    applications.length > 0 ||
    regions.length > 0 ||
    page.hs_code ||
    page.moq_mt ||
    page.price_indication ||
    page.lead_time_min_weeks ||
    page.datasheet_url ||
    commodity

  if (!hasAnything) return null

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-100">
      {/* Commercial terms summary strip */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 mb-10 grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-children">
        {page.hs_code && (
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">HS Code</div>
            <div className="font-mono text-lg font-bold text-slate-900 mt-1">{page.hs_code}</div>
          </div>
        )}
        {page.moq_mt && (
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Min Order</div>
            <div className="text-lg font-bold text-slate-900 mt-1">{page.moq_mt.toLocaleString()} MT</div>
          </div>
        )}
        {(page.lead_time_min_weeks || page.lead_time_max_weeks) && (
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Lead Time</div>
            <div className="text-lg font-bold text-slate-900 mt-1">
              {page.lead_time_min_weeks && page.lead_time_max_weeks
                ? `${page.lead_time_min_weeks}–${page.lead_time_max_weeks} weeks`
                : `${page.lead_time_min_weeks || page.lead_time_max_weeks} weeks`}
            </div>
          </div>
        )}
        {page.price_indication && (
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Price Indication</div>
            <div className="text-base font-bold text-[#FF6321] mt-1">{page.price_indication}</div>
          </div>
        )}
      </div>

      {/* Two-column layout: specs (left, wider) + meta (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Specifications table */}
        {specEntries.length > 0 && (
          <div className="lg:col-span-2 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🧪</span>
              <h2 className="text-2xl font-bold text-slate-900">Technical Specifications</h2>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <dl className="divide-y divide-slate-100">
                {specEntries.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-1 sm:grid-cols-3 gap-1 px-5 py-3 hover:bg-slate-50 transition-colors">
                    <dt className="text-sm font-semibold text-slate-600">{prettyKey(k)}</dt>
                    <dd className="sm:col-span-2 text-sm text-slate-900 font-mono">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {commodity && (
              <div className="mt-3 text-xs text-slate-500">
                Linked to commodity master <span className="font-mono font-semibold text-slate-700">{commodity.code || commodity.sku || commodity.name}</span>
                {commodity.origin && <> · Origin: {commodity.origin}</>}
              </div>
            )}

            {page.datasheet_url && (
              <a href={page.datasheet_url} target="_blank" rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1d5fa1] hover:text-[#FF6321] transition-colors">
                📄 Download Technical Data Sheet (PDF) →
              </a>
            )}
          </div>
        )}

        {/* Right column: certifications + packing */}
        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {certifications.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🏅</span>
                <h3 className="text-lg font-bold text-slate-900">Certifications & Standards</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {certifications.map(c => (
                  <span key={c}
                    className="inline-flex items-center text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full">
                    ✓ {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {packing.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📦</span>
                <h3 className="text-lg font-bold text-slate-900">Packing Options</h3>
              </div>
              <ul className="space-y-1.5">
                {packing.map(p => (
                  <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-[#FF6321] font-bold mt-0.5">›</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Applications + regions — full-width bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {applications.length > 0 && (
          <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🏭</span>
              <h3 className="text-lg font-bold text-slate-900">Applications</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {applications.map(a => (
                <span key={a}
                  className="inline-flex items-center text-xs font-medium bg-white text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}

        {regions.length > 0 && (
          <div className="rounded-2xl bg-blue-50/70 border border-blue-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🌍</span>
              <h3 className="text-lg font-bold text-slate-900">Active Destination Markets</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {regions.map(r => (
                <span key={r}
                  className="inline-flex items-center text-xs font-medium bg-white text-blue-800 border border-blue-200 px-3 py-1.5 rounded-full">
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quote CTA — pre-fills the RFQ form with this product */}
      <div className="mt-10 rounded-2xl bg-gradient-to-br from-[#1d5fa1] to-[#14467a] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl shadow-blue-900/10 animate-scale-in">
        <div>
          <h3 className="text-xl font-bold text-white">Want a quote on {page.title}?</h3>
          <p className="text-blue-100 text-sm mt-1">FOB / CIF / CFR pricing in 24 hours — full L/C-bank document set on order.</p>
        </div>
        <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
          className="bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-7 py-3.5 rounded-xl shadow-lg whitespace-nowrap transition-all hover:-translate-y-0.5">
          📋 Request Quote
        </Link>
      </div>
    </section>
  )
}
