/**
 * /tds/<product-path> — printable Technical Data Sheet for any product.
 *
 * Renders a clean, single-page A4-style TDS with the company letterhead,
 * full chemical & physical specs, certifications, packing options,
 * applications, and storage/origin/loading-port info. Auto-triggers
 * window.print() via a "Print / Save as PDF" button.
 *
 * Light editorial edition — tokens + utilities (.egg-*) in app/globals.css.
 */
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  getPageByPath,
  getCommodityById,
  getSiteSettings,
  APPLICATIONS,
} from '../../../lib/corporatePages'
import Logo from '../../../components/Logo'
import TDSPrintTrigger from '../../../components/TDSPrintTrigger'

export const revalidate = 60

const SPEC_LABELS = {
  nacl_min: 'NaCl min',  moisture_max: 'Moisture max',  particle_size: 'Particle size',
  bulk_density: 'Bulk density', ca_max: 'Ca max', mg_max: 'Mg max', so4_max: 'SO₄ max',
  water_insolubles: 'Water insolubles',
  pb_max: 'Lead (Pb)', as_max: 'Arsenic (As)', cd_max: 'Cadmium (Cd)', hg_max: 'Mercury (Hg)',
  ph_range: 'pH range', colour: 'Colour', appearance: 'Appearance', grain_label: 'Grain label',
  source_type: 'Source type', origin: 'Origin', storage_conditions: 'Storage conditions',
  shelf_life_months: 'Shelf life', product_code: 'Product code', sku: 'SKU',
  commodity_code: 'Commodity code', grade: 'Grade', unit: 'Unit',
  standard: 'Standard', compressive_28d: 'Compressive 28-day', blaine_fineness: 'Blaine',
  so3_max: 'SO₃ max', mgo_max: 'MgO max', loi_max: 'LOI max', c3a_max: 'C₃A max',
  chloride_max: 'Chloride max', initial_setting: 'Initial setting',
  nitrogen_min: 'N min', biuret_max: 'Biuret max', k2o_min: 'K₂O min', cl_max: 'Cl max',
  p2o5_min: 'P₂O₅ min', p2o5_content: 'P₂O₅ content',
  concentration: 'Concentration', un_number: 'UN number', specific_gravity: 'Specific gravity',
}
const APP_BY_ID = Object.fromEntries(APPLICATIONS.map(a => [a.id, a]))
const prettyKey = k => SPEC_LABELS[k] || k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

export async function generateMetadata({ params }) {
  const { path } = await params
  const fullPath = '/' + (Array.isArray(path) ? path.join('/') : path)
  const page = await getPageByPath(fullPath)
  return {
    title: page ? `TDS — ${page.title}` : 'Technical Data Sheet',
    description: 'Egypt Globe Group Technical Data Sheet — printable specification document.',
    robots: { index: false, follow: false }, // TDS pages shouldn't compete with the main product page in SERP
  }
}

export default async function TDSPage({ params }) {
  const { path } = await params
  const fullPath = '/' + (Array.isArray(path) ? path.join('/') : path)
  const [page, settings] = await Promise.all([
    getPageByPath(fullPath),
    getSiteSettings(),
  ])
  if (!page) notFound()
  const commodity = page.commodity_id ? await getCommodityById(page.commodity_id) : null

  const specs = page.specs || {}
  const specEntries = Object.entries(specs).filter(([, v]) => v !== null && v !== '' && v !== undefined)
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

  const apps = (page.applications || []).map(id => APP_BY_ID[id]).filter(Boolean)

  return (
    <div className="bg-[#f9fafb] min-h-screen print:bg-white text-[#14161a]">
      {/* Toolbar — hidden in print */}
      <div className="bg-white border-b border-[#14161a]/10 sticky top-0 z-10 print:hidden">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href={page.path} className="text-sm text-[#3f4650] hover:text-[#0b8f84] inline-flex items-center gap-1.5 transition-colors">
            ← Back to product
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8a93a3]">Issued: {today}</span>
            <TDSPrintTrigger />
          </div>
        </div>
      </div>

      {/* The TDS document — A4-style page */}
      <div className="max-w-4xl mx-auto bg-white ring-1 ring-[#14161a]/10 print:ring-0 my-6 print:my-0 print:max-w-none">
        <div className="px-10 py-8 sm:px-12 sm:py-10 print:p-12">

          {/* Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-[#14161a] pb-4 mb-6">
            <div>
              <Logo imageUrl={settings.logoUrl} className="h-14" />
              <p className="mt-2 text-xs text-[#7a8290]">{settings.tagline}</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#7a8290]">Technical Data Sheet</div>
              <div className="egg-display text-3xl text-[#14161a] mt-0.5">TDS</div>
              <div className="text-xs text-[#7a8290] mt-1">Issued: {today}</div>
            </div>
          </div>

          {/* Title block */}
          <div className="mb-8">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {page.hs_code && (
                <span className="text-xs font-mono font-bold bg-[#f3f4f6] text-[#3f4650] border border-[#14161a]/10 px-2 py-1 rounded">
                  HS {page.hs_code}
                </span>
              )}
              {(specs.sku || specs.commodity_code) && (
                <span className="text-xs font-mono font-bold bg-[#f2fbfa] text-[#0b8f84] border border-[#0fb5a5]/40 px-2 py-1 rounded">
                  {specs.sku || specs.commodity_code}
                </span>
              )}
              {specs.source_type && (
                <span className="text-xs font-bold bg-[#eef6fd] text-[#0369a1] border border-[#0284c7]/35 px-2 py-1 rounded">
                  {specs.source_type}
                </span>
              )}
            </div>
            <h1 className="egg-display text-3xl sm:text-4xl text-[#14161a] leading-tight">{page.title}</h1>
            {page.description && <p className="text-sm text-[#3f4650] mt-2 leading-relaxed">{page.description}</p>}
          </div>

          {/* Section 1 — Identification */}
          <Section n="1" title="Identification">
            <DefList rows={[
              ['Product name',     page.title],
              ['Product code',     specs.sku || specs.commodity_code || specs.product_code || '—'],
              ['HS code',          page.hs_code || '—'],
              ['Source / origin',  specs.origin || (commodity?.origin) || '—'],
              ['Source type',      specs.source_type || '—'],
              ['Manufacturer',     settings.name],
            ]} />
          </Section>

          {/* Section 2 — Chemical & physical specifications */}
          {specEntries.length > 0 && (
            <Section n="2" title="Chemical & Physical Specifications">
              <table className="w-full text-sm border-t border-[#14161a]/10">
                <tbody>
                  {specEntries
                    .filter(([k]) => !['sku','commodity_code','source_type','origin','product_code','grade','unit'].includes(k))
                    .map(([k, v]) => (
                      <tr key={k} className="border-b border-[#14161a]/10">
                        <td className="py-2 px-2 font-semibold text-[#5b6472] w-2/5">{prettyKey(k)}</td>
                        <td className="py-2 px-2 text-[#14161a] font-mono">{String(v)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Section>
          )}

          {/* Section 3 — Packing options */}
          {(page.packing_options || []).length > 0 && (
            <Section n="3" title="Packing Options">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-[#3f4650] list-disc list-inside">
                {page.packing_options.map(p => <li key={p}>{p}</li>)}
              </ul>
            </Section>
          )}

          {/* Section 4 — Applications */}
          {apps.length > 0 && (
            <Section n="4" title="Applications">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-[#3f4650] list-disc list-inside">
                {apps.map(a => <li key={a.id}>{a.label}</li>)}
              </ul>
            </Section>
          )}

          {/* Section 5 — Certifications */}
          {(page.certifications || []).length > 0 && (
            <Section n="5" title="Certifications & Standards">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-[#3f4650] list-disc list-inside">
                {page.certifications.map(c => <li key={c}>{c}</li>)}
              </ul>
            </Section>
          )}

          {/* Section 6 — Commercial terms */}
          <Section n="6" title="Commercial Terms">
            <DefList rows={[
              ['Min. Order Quantity', page.moq_mt ? `${Number(page.moq_mt).toLocaleString()} ${page.price_unit || 'MT'}` : '—'],
              ['Lead time',           (page.lead_time_min_weeks || page.lead_time_max_weeks)
                                        ? `${page.lead_time_min_weeks || '?'}–${page.lead_time_max_weeks || '?'} weeks` : '—'],
              ['Indicative price',    page.price_indication || '—'],
              ['Incoterms',           'FOB / CIF / CFR (Egyptian ports)'],
              ['Currency',            page.price_currency || 'USD'],
            ]} />
          </Section>

          {/* Section 7 — Loading ports */}
          <Section n="7" title="Loading Ports (Egypt)">
            {(page.loading_ports || []).length > 0 ? (
              <>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-[#3f4650] list-disc list-inside mb-2">
                  {page.loading_ports.map(p => <li key={p}>{p}</li>)}
                </ul>
                <p className="text-xs text-[#7a8290] italic">
                  {specs.source_type?.toLowerCase().includes('rock')
                    ? 'Lanes optimised for rock-salt loading from Siwa / Qattara feed.'
                    : specs.source_type?.toLowerCase().includes('sea')
                    ? 'Lanes optimised for sea-salt loading — closest port to source pans.'
                    : 'Specific loading port confirmed at quote stage.'}
                </p>
              </>
            ) : (
              <p className="text-sm text-[#3f4650] leading-relaxed">
                Damietta · Port Said East · Alexandria · El-Dekheila · Ain Sokhna · Safaga · El-Arish.
                Specific loading port confirmed at quote stage based on destination.
              </p>
            )}
          </Section>

          {/* Section 8 — Storage & shelf life */}
          {(specs.storage_conditions || specs.shelf_life_months) && (
            <Section n="8" title="Storage & Handling">
              <DefList rows={[
                ['Storage conditions', specs.storage_conditions || 'Cool, dry, well-ventilated; out of direct sunlight'],
                ['Shelf life',         specs.shelf_life_months || 'Indefinite under proper storage'],
              ]} />
            </Section>
          )}

          {/* Section 9 — Quality assurance */}
          <Section n="9" title="Quality Assurance">
            <p className="text-sm text-[#3f4650] leading-relaxed">
              Every shipment ships with an Egyptian Chamber of Commerce-stamped Certificate
              of Origin and a per-batch Certificate of Analysis. Pre-shipment inspection
              (TÜV Austria / SGS / Intertek / Bureau Veritas / Cotecna) available on request. Full
              L/C-bank document set delivered: Proforma + Commercial Invoice + Packing List
              + Bill of Lading (3/3 originals) + Phytosanitary where applicable.
            </p>
          </Section>

          {/* Footer letterhead */}
          <div className="border-t border-[#14161a]/10 mt-10 pt-4 text-[11px] text-[#7a8290] leading-relaxed">
            <div className="font-semibold text-[#3f4650] mb-1">{settings.name}</div>
            <div>Head Office: {settings.headOffice}</div>
            <div>Operations: {settings.operationsOffice}</div>
            <div className="mt-1">
              {settings.phone} · {settings.telFax ? `Tel/Fax ${settings.telFax} · ` : ''}{settings.email}
            </div>
            <div className="mt-1 flex flex-wrap gap-x-3">
              <span>Commercial Registry {settings.commercialRegistry}</span>
              <span>Tax Card {settings.taxCard}</span>
              <span>Egyptian Export License {settings.exportLicense}</span>
            </div>
            <div className="mt-3 italic">
              Specifications shown are typical values. Actual lot-level data is captured on the
              per-shipment Certificate of Analysis. This TDS is for informational purposes only —
              binding specs are agreed at contract / proforma stage.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ n, title, children }) {
  return (
    <section className="mb-6">
      <h2 className="text-[10px] font-mono font-semibold uppercase tracking-[0.18em] text-[#0b8f84] border-b border-[#14161a]/10 pb-2 mb-3">
        {n}. {title}
      </h2>
      {children}
    </section>
  )
}

function DefList({ rows }) {
  return (
    <table className="w-full text-sm">
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label} className="border-b border-[#14161a]/10 last:border-0">
            <td className="py-1.5 pr-4 font-semibold text-[#5b6472] w-2/5">{label}</td>
            <td className="py-1.5 text-[#14161a]">{value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
