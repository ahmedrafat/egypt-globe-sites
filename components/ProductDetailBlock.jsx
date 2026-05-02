/**
 * ProductDetailBlock — Pelot Salt-style rich product detail surface.
 *
 * Two-column layout (2:1):
 *   • Left  — Specifications table + Applications grid + Packing grid
 *   • Right — Quote CTA / Origin gradient / Certifications / Key Specs
 *             / MOQ + Lead Time card
 *
 * Mounts on any egg_corporate_pages row that has rich product data.
 * Derives the source type (rock vs sea) from specs.source_type so the
 * Origin card and hero gradient can adapt.
 */
import Link from 'next/link'
import { APPLICATIONS } from '../lib/corporatePages'
import PriceDisplay from './PriceDisplay'
import PackingMatrix from './PackingMatrix'

const SPEC_LABELS = {
  // Salt
  nacl_min: 'NaCl min',
  moisture_max: 'Moisture max',
  particle_size: 'Particle size',
  bulk_density: 'Bulk density',
  ca_max: 'Ca max',
  mg_max: 'Mg max',
  so4_max: 'SO₄ max',
  water_insolubles: 'Water insolubles',
  pb_max: 'Lead (Pb)',
  as_max: 'Arsenic (As)',
  cd_max: 'Cadmium (Cd)',
  hg_max: 'Mercury (Hg)',
  ph_range: 'pH range',
  colour: 'Colour',
  appearance: 'Appearance',
  grain_label: 'Grain',
  source_type: 'Source',
  origin: 'Origin',
  storage_conditions: 'Storage',
  shelf_life_months: 'Shelf life',
  product_code: 'Product code',
  // Cement / fertilizer / chemical fallbacks
  standard: 'Standard',
  compressive_2d: 'Compressive 2-day',
  compressive_7d: 'Compressive 7-day',
  compressive_28d: 'Compressive 28-day',
  blaine_fineness: 'Blaine fineness',
  so3_max: 'SO₃ max',
  mgo_max: 'MgO max',
  loi_max: 'LOI max',
  insoluble_residue: 'Insoluble residue',
  c3a: 'C₃A',
  c3a_max: 'C₃A max',
  chloride_max: 'Chloride max',
  initial_setting: 'Initial setting',
  final_setting: 'Final setting',
  sulfate_resistance: 'Sulfate resistance',
  nitrogen_min: 'N min',
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
  concentration: 'Concentration',
  iron_max: 'Iron max',
  free_chlorine: 'Free chlorine',
  specific_gravity: 'Specific gravity',
  un_number: 'UN number',
  fe_max: 'Fe max',
  caso4_min: 'CaSO₄ min',
  caco3_min: 'CaCO₃ min',
  purity_options: 'Purity options',
  sio2_max: 'SiO₂ max',
  anti_caking: 'Anti-caking',
  natural: 'Natural',
}

const APP_BY_ID = Object.fromEntries(APPLICATIONS.map(a => [a.id, a]))

function prettyKey(k) {
  return SPEC_LABELS[k] || k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function ProductDetailBlock({ page, commodity, packingOptions = [], visibility }) {
  const specs = page.specs || {}
  const specEntries = Object.entries(specs).filter(([, v]) => v !== null && v !== '' && v !== undefined)
  const certifications = page.certifications || []
  const packing = page.packing_options || []
  const applicationIds = page.applications || []
  const regions = page.regions || []
  const loadingPorts = page.loading_ports || []

  const hasAnything =
    specEntries.length > 0 ||
    certifications.length > 0 ||
    packing.length > 0 ||
    applicationIds.length > 0 ||
    regions.length > 0 ||
    loadingPorts.length > 0 ||
    page.hs_code ||
    page.moq_mt ||
    page.price_indication ||
    page.lead_time_min_weeks ||
    page.datasheet_url ||
    commodity

  if (!hasAnything) return null

  // Detect rock vs sea for the Origin card
  const sourceType = (specs.source_type || '').toLowerCase()
  const isRock = sourceType.includes('rock')
  const isSea = sourceType.includes('sea')

  // Map app ids → APPLICATIONS metadata
  const apps = applicationIds
    .map(id => APP_BY_ID[id])
    .filter(Boolean)

  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ───────── Main content (left, 2/3) ───────── */}
        <div className="lg:col-span-2 space-y-6 animate-fade-in-up">

          {/* Specs table */}
          {specEntries.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                  <span className="text-xl">🧪</span> Product Specifications
                </h2>
                <span className="text-xs font-medium text-slate-500">{specEntries.length} parameters</span>
              </div>
              <div className="divide-y divide-slate-100">
                {/* Anchor rows that are always-on if present */}
                {[
                  page.hs_code        ? { label: 'HS Code',          value: page.hs_code, mono: true } : null,
                  specs.product_code  ? { label: 'Product Code',     value: specs.product_code, mono: true } : null,
                  specs.source_type   ? { label: 'Source Type',      value: specs.source_type } : null,
                  specs.origin        ? { label: 'Origin',           value: specs.origin } : null,
                  specs.grain_label   ? { label: 'Grain',            value: specs.grain_label } : null,
                  specs.colour        ? { label: 'Colour',           value: specs.colour } : null,
                  specs.appearance    ? { label: 'Appearance',       value: specs.appearance } : null,
                ].filter(Boolean).map(row => (
                  <div key={row.label} className="grid grid-cols-1 sm:grid-cols-3 gap-1 px-6 py-3 hover:bg-slate-50/50 transition-colors">
                    <dt className="text-sm font-semibold text-slate-500">{row.label}</dt>
                    <dd className={`sm:col-span-2 text-sm text-slate-900 ${row.mono ? 'font-mono font-bold' : 'font-semibold'}`}>{String(row.value)}</dd>
                  </div>
                ))}
                {/* Remaining specs (numeric / chemistry) */}
                {specEntries
                  .filter(([k]) => !['hs_code','product_code','source_type','origin','grain_label','colour','appearance'].includes(k))
                  .map(([k, v]) => (
                    <div key={k} className="grid grid-cols-1 sm:grid-cols-3 gap-1 px-6 py-3 hover:bg-slate-50/50 transition-colors">
                      <dt className="text-sm font-semibold text-slate-500">{prettyKey(k)}</dt>
                      <dd className="sm:col-span-2 text-sm text-slate-900 font-mono font-semibold">{String(v)}</dd>
                    </div>
                  ))}
              </div>

              {commodity && (
                <div className="px-6 py-3 bg-slate-50/40 border-t border-slate-100 text-xs text-slate-500">
                  Linked to commodity master <span className="font-mono font-semibold text-slate-700">{commodity.code || commodity.sku || commodity.name}</span>
                  {commodity.origin && <> · Sourced from {commodity.origin}</>}
                </div>
              )}

              {page.datasheet_url && (
                <a href={page.datasheet_url} target="_blank" rel="noopener noreferrer"
                  className="block px-6 py-3 bg-blue-50 border-t border-blue-100 text-sm font-semibold text-[#1d5fa1] hover:bg-blue-100 transition-colors">
                  📄 Download Technical Data Sheet (PDF) →
                </a>
              )}
            </div>
          )}

          {/* Applications grid — rich linkable cards */}
          {apps.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <span className="text-xl">🏭</span> Applications
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {apps.map(app => (
                  <Link key={app.id} href={app.path}
                    className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:border-[#1d5fa1] hover:bg-blue-50/40 transition-all group">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br from-violet-100 to-blue-100">
                      {app.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 text-sm group-hover:text-[#1d5fa1] transition-colors">{app.label}</div>
                      <div className="text-xs text-slate-500">View matching products →</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Packing options — Drop 141 PackingMatrix replaces the simple
             chip grid. Shows ALL master packing formats (PE bags, OEM, all
             FIBC sizes, bag-in-jumbo) not just the product's short array.
             Mobile-friendly stacked layout. */}
          {(packingOptions.length > 0 || packing.length > 0) && (
            <PackingMatrix packingOptions={packingOptions} productPackingOptions={packing} />
          )}

          {/* Drop 131 — combined Loading + Markets row (was 2 separate cards
             that ate vertical space). Single card with two columns keeps the
             chip rails close together — they're conceptually paired (load HERE
             → ship THERE). */}
          {(loadingPorts.length > 0 || regions.length > 0) && (
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-amber-50/40 via-white to-blue-50/40 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {loadingPorts.length > 0 && (
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                      <span className="text-lg">⚓</span> Loads from
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {loadingPorts.map(p => (
                        <span key={p}
                          className="inline-flex items-center gap-1 text-xs font-semibold bg-white text-amber-900 border border-amber-200 px-2.5 py-1 rounded-full">
                          {p}
                        </span>
                      ))}
                    </div>
                    {(isRock || isSea) && (
                      <p className="text-[11px] text-slate-500 mt-2">
                        {isRock
                          ? 'Closest ports to Siwa / Qattara mines.'
                          : 'Closest ports to source pans.'}
                      </p>
                    )}
                  </div>
                )}
                {regions.length > 0 && (
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
                      <span className="text-lg">🌍</span> Ships to
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {regions.map(r => (
                        <span key={r}
                          className="inline-flex items-center text-xs font-medium bg-white text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full">
                          {r}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2">
                      FOB / CIF / CFR worldwide. <Link href="/services/logistics" className="text-[#1d5fa1] hover:underline">Logistics →</Link>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ───────── Sidebar (right, 1/3) ───────── */}
        <aside className="space-y-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>

          {/* Quote CTA + document actions */}
          <div className="bg-gradient-to-br from-[#1d5fa1] to-[#14467a] rounded-2xl p-6 text-white shadow-xl shadow-blue-900/15">
            <h3 className="font-bold text-lg mb-2">Request a Quote</h3>
            <p className="text-blue-100 text-sm leading-relaxed mb-4">
              Get pricing, availability and a proforma invoice within 24 hours.
            </p>
            <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
              className="block w-full text-center bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg">
              📋 Get Quote
            </Link>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Link href={`/tds${page.path}`} target="_blank"
                className="flex items-center justify-center gap-1.5 border border-white/25 text-white/85 hover:text-white hover:bg-white/10 text-xs font-bold py-2.5 rounded-lg transition-colors">
                📄 Download TDS
              </Link>
              <Link href={`/rfq?product=${encodeURIComponent(page.path)}&type=coa`}
                className="flex items-center justify-center gap-1.5 border border-white/25 text-white/85 hover:text-white hover:bg-white/10 text-xs font-bold py-2.5 rounded-lg transition-colors">
                🧪 Request COA
              </Link>
            </div>
            <p className="text-blue-200 text-xs text-center mt-3">24-hour response · No spam</p>
          </div>

          {/* Origin card — only for salt with rock/sea source type */}
          {(isRock || isSea) && (
            <div className={`rounded-2xl p-6 text-white shadow-lg ${isRock
              ? 'bg-gradient-to-br from-stone-700 to-stone-900'
              : 'bg-gradient-to-br from-cyan-700 to-blue-900'}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{isRock ? '⛏️' : '🌊'}</span>
                <h3 className="font-bold text-base">{isRock ? 'Rock Salt Origin' : 'Sea Salt Origin'}</h3>
              </div>
              <p className={`text-xs leading-relaxed ${isRock ? 'text-stone-200' : 'text-cyan-100'}`}>
                {isRock
                  ? 'Mined from ancient halite deposits in Egypt\'s Siwa Oasis and Qattara Depression. Formed 30+ million years ago, delivering minimum 97% NaCl purity across every grade.'
                  : 'Solar-evaporated from Egypt\'s North Sinai (El-Arish / Bardawil) and Red Sea coastal salt pans. ~2,700 kWh/m² annual solar irradiance for natural mineral-balanced salt.'}
              </p>
              {specs.origin && (
                <div className={`mt-3 text-xs font-semibold ${isRock ? 'text-stone-300' : 'text-cyan-200'}`}>
                  {specs.origin}
                </div>
              )}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                <span className="text-base">🏅</span> Certifications & Standards
              </h3>
              <ul className="space-y-2">
                {certifications.map(c => (
                  <li key={c} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-slate-700">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Drop 131 — "Key Specs at a Glance" right card removed.
             Same data is in the full Specifications table on the left
             (NaCl / Moisture / Particle Size are always among the first
             rows there) — surfacing it twice was the #1 duplication
             complaint on salt SKU pages. */}

          {/* MOQ + Lead Time + HS code commercial card */}
          {(page.moq_mt || page.lead_time_min_weeks || page.hs_code) && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Commercial Terms</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {page.moq_mt && (
                  <div>
                    <div className="text-slate-500 mb-0.5">Min. Order</div>
                    <div className="font-bold text-slate-900 text-base">{Number(page.moq_mt).toLocaleString()} MT</div>
                  </div>
                )}
                {(page.lead_time_min_weeks || page.lead_time_max_weeks) && (
                  <div>
                    <div className="text-slate-500 mb-0.5">Lead Time</div>
                    <div className="font-bold text-slate-900 text-base">
                      {page.lead_time_min_weeks && page.lead_time_max_weeks
                        ? `${page.lead_time_min_weeks}–${page.lead_time_max_weeks} wk`
                        : `${page.lead_time_min_weeks || page.lead_time_max_weeks} wk`}
                    </div>
                  </div>
                )}
                {page.hs_code && (
                  <div className="col-span-2">
                    <div className="text-slate-500 mb-0.5">HS Code</div>
                    <div className="font-mono font-bold text-slate-900">{page.hs_code}</div>
                  </div>
                )}
                {page.price_indication && (
                  <div className="col-span-2 pt-2 border-t border-orange-200">
                    <div className="text-slate-500 mb-0.5">Indicative Price</div>
                    <PriceDisplay price={page.price_indication} visibility={visibility} size="lg" placeholder="Sign in to see indicative price" />
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
