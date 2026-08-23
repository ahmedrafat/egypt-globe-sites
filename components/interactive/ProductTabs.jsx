'use client'

/**
 * ProductTabs — interactive SKU layout (Drop 132, restructured 2026-08-23
 * for the "Quality at the Core" content overhaul).
 *
 * Tabs: Overview · Specifications · Certificates · Applications ·
 *       Logistics · Documents · Quote
 *
 * The Specifications tab is now a structured SPEC SHEET built from three
 * sources — the page's `specs` jsonb, the commodity's `quality_specs`
 * reference rows (test method / standard / sampling frequency) and the
 * page's commercial columns — and rendered as three Tailwind tables:
 *
 *   1. Physical properties        (grain, moisture, density, strength…)
 *   2. Chemical analysis          (purity, impurity limits, heavy metals…)
 *   3. Logistical & QA parameters (MOQ FCL / break-bulk, packing, ports,
 *                                  Incoterms, lead time, inspection
 *                                  protocol, internal QA gate, HS code)
 *
 * preceded by the five-gate QA verification chain. Every panel renders in
 * the DOM (display:none when inactive) so crawlers see every fact pre-JS.
 *
 * Vector protocol: monochrome micro-icons only (components/ui/Icon).
 */
import { useState, useEffect } from 'react'
import Link from 'next/link'
import SourceStorySwitcher from './SourceStorySwitcher'
import TransitTimeCalculator from './TransitTimeCalculator'
import DocumentChecklist from './DocumentChecklist'
import InlineQuoteCard from './InlineQuoteCard'
import PriceDisplay from '../PriceDisplay'
import PackingMatrix from '../PackingMatrix'
import CoaCenter from './CoaCenter'
import Icon, { APPLICATION_ICON } from '../ui/Icon'

/* ─── spec vocabulary ─────────────────────────────────────────────────── */

const SPEC_LABELS = {
  nacl_min: 'NaCl (dry basis)', moisture_max: 'Moisture, max', moisture_typical: 'Moisture, typical',
  moisture_kiln_dried: 'Moisture, kiln-dried', kiln_drying_options: 'Kiln-drying options',
  particle_size: 'Particle size', bulk_density: 'Bulk density', ca_max: 'Calcium (Ca²⁺), max',
  mg_max: 'Magnesium (Mg²⁺), max', so4_max: 'Sulphate (SO₄²⁻), max', water_insolubles: 'Water insolubles, max',
  pb_max: 'Lead (Pb), max', as_max: 'Arsenic (As), max', cd_max: 'Cadmium (Cd), max', hg_max: 'Mercury (Hg), max',
  ph_range: 'pH (5 % solution)', ph: 'pH', ph_solution: 'pH (solution)', colour: 'Colour', appearance: 'Appearance',
  grain_label: 'Grain class', source_type: 'Source', origin: 'Origin', storage_conditions: 'Storage',
  shelf_life_months: 'Shelf life', product_code: 'Product code', standard: 'Standard',
  compressive_2d: 'Compressive strength, 2-day', compressive_7d: 'Compressive strength, 7-day',
  compressive_28d: 'Compressive strength, 28-day', compressive_strength: 'Compressive strength',
  compressive_strength_8h_60c: 'Compressive strength, 8 h @ 60 °C', compressive_strength_24h_60c: 'Compressive strength, 24 h @ 60 °C',
  blaine_fineness: 'Blaine fineness', so3_max: 'SO₃, max', mgo_max: 'MgO, max', mgo: 'MgO', loi_max: 'Loss on ignition, max', loi: 'Loss on ignition',
  insoluble_residue: 'Insoluble residue', c3a: 'C₃A', c3a_max: 'C₃A, max', chloride_max: 'Chloride (Cl⁻), max', cl_max: 'Chloride (Cl⁻), max',
  initial_setting: 'Initial setting time', final_setting: 'Final setting time', sulfate_resistance: 'Sulphate resistance',
  heat_of_hydration: 'Heat of hydration', whiteness: 'Whiteness', limestone: 'Limestone content', pozzolana: 'Pozzolana content', slag: 'Slag content',
  fe2o3_max: 'Fe₂O₃, max', fe2o3: 'Fe₂O₃', fe: 'Fe (total)', fe3o4: 'Fe₃O₄', al2o3: 'Al₂O₃', sio2: 'SiO₂', sio2_max: 'SiO₂, max', tio2: 'TiO₂', cao: 'CaO',
  nitrogen: 'Nitrogen (N)', nitrogen_min: 'Nitrogen (N), min', biuret_max: 'Biuret, max', k2o_min: 'K₂O, min', p2o5: 'P₂O₅', p2o5_min: 'P₂O₅, min', p2o5_content: 'P₂O₅ content',
  sulphur: 'Sulphur (S)', sulphur_min: 'Sulphur (S), min', calcium: 'Calcium (Ca)', ash_max: 'Ash, max', ash: 'Ash', arsenic_max: 'Arsenic (As), max',
  carbon: 'Carbon (C)', manganese: 'Manganese (Mn)', iron_max: 'Iron (Fe), max', fe_max: 'Iron (Fe), max', caso4_min: 'CaSO₄·2H₂O, min', caco3_min: 'CaCO₃, min',
  purity: 'Purity', purity_options: 'Purity options', oil_content: 'Oil content', aflatoxin: 'Aflatoxin (total)', brix: 'Brix (°Bx)', sugar: 'Total sugars', sugars: 'Sugars',
  hmf: 'HMF', diastase: 'Diastase activity', fructose_glucose: 'Fructose + glucose', anthocyanin: 'Anthocyanin', essential_oil: 'Volatile oil',
  available_chlorine: 'Available chlorine', basicity: 'Basicity', fecl3: 'FeCl₃', nahso3: 'NaHSO₃', free_acid: 'Free acid', free_acid_max: 'Free acid, max',
  insolubles_max: 'Insolubles, max', water_soluble: 'Water-soluble', water_solubility: 'Water solubility', concentration: 'Concentration', free_chlorine: 'Free chlorine',
  anti_caking: 'Anti-caking agent', natural: 'Natural', density: 'Density', specific_gravity: 'Specific gravity', crushing_strength: 'Crushing strength',
  crystallisation_temp: 'Crystallisation temperature', oil_absorption: 'Oil absorption', free_flowing: 'Free-flowing', stability: 'Stability',
  size: 'Size', sizes: 'Sizes', thickness: 'Thickness', width: 'Width', length: 'Length', diameter: 'Diameter', sections: 'Sections', texture: 'Texture',
  finish: 'Finish', water_absorption: 'Water absorption', flexural_strength: 'Flexural strength', mohs_hardness: 'Mohs hardness', abrasion_resistance: 'Abrasion resistance',
  tensile: 'Tensile strength', tensile_min: 'Tensile strength, min', yield: 'Yield strength', yield_min: 'Yield strength, min', elongation: 'Elongation', surface: 'Surface', coating: 'Coating',
  broken_max: 'Broken kernels, max', milled_polished: 'Milling / polishing', cut: 'Cut', temperature: 'Storage / transit temperature', moisture: 'Moisture',
  variety: 'Variety', varieties: 'Varieties', harvest: 'Harvest window', season: 'Season', grade: 'Grade', processing: 'Processing', processing_options: 'Processing options',
  un_number: 'UN number', hs_code: 'HS code',
}

const IDENTITY_KEYS = new Set(['hs_code', 'product_code', 'sku', 'commodity_code', 'source_type', 'origin', 'standard', 'grade', 'variety', 'varieties', 'harvest', 'season', 'arabic_name', 'subcategory', 'description', 'note', 'un_code', 'un_number', 'unit'])
const COMMERCIAL_KEYS = new Set(['min_order', 'max_order', 'min_order_container', 'min_order_vessel', 'max_order_vessel', 'shipping_options', 'incoterms', 'cert_required', 'processing', 'processing_options'])
const CHEMICAL_KEYS = new Set([
  'nacl_min', 'ca_max', 'mg_max', 'so4_max', 'water_insolubles', 'pb_max', 'as_max', 'cd_max', 'hg_max', 'ph_range', 'ph', 'ph_solution',
  'so3_max', 'mgo_max', 'mgo', 'loi_max', 'loi', 'insoluble_residue', 'c3a', 'c3a_max', 'chloride_max', 'cl_max', 'sulfate_resistance',
  'fe2o3_max', 'fe2o3', 'fe', 'fe3o4', 'al2o3', 'sio2', 'sio2_max', 'tio2', 'cao', 'nitrogen', 'nitrogen_min', 'biuret_max', 'k2o_min', 'p2o5',
  'p2o5_min', 'p2o5_content', 'sulphur', 'sulphur_min', 'calcium', 'ash_max', 'ash', 'arsenic_max', 'carbon', 'manganese', 'limestone', 'pozzolana',
  'slag', 'iron_max', 'fe_max', 'caso4_min', 'caco3_min', 'purity', 'purity_options', 'oil_content', 'aflatoxin', 'brix', 'sugar', 'sugars', 'hmf',
  'diastase', 'fructose_glucose', 'anthocyanin', 'essential_oil', 'available_chlorine', 'basicity', 'fecl3', 'nahso3', 'free_acid', 'free_acid_max',
  'insolubles_max', 'water_soluble', 'water_solubility', 'concentration', 'free_chlorine', 'anti_caking', 'whiteness',
])

function pretty(k) { return SPEC_LABELS[k] || String(k).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }
function classify(k) {
  if (IDENTITY_KEYS.has(k)) return 'identity'
  if (COMMERCIAL_KEYS.has(k)) return 'commercial'
  if (CHEMICAL_KEYS.has(k)) return 'chemical'
  return 'physical'
}
function fmt(v) {
  if (v === null || v === undefined) return ''
  if (Array.isArray(v)) return v.join(' · ')
  if (typeof v === 'object') return Object.entries(v).map(([a, b]) => `${a}: ${b}`).join(' · ')
  const s = String(v)
  // snake_case enum values (extra_coarse, kiln_dried) → readable
  if (/^[a-z]+(_[a-z0-9]+)+$/.test(s)) return s.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())
  return s
}

/* ─── per-division QA / inspection protocol ───────────────────────────── */

const INSPECTION = {
  salt:         { bodies: 'TÜV Austria · SGS · Intertek · Bureau Veritas', scope: 'Pre-shipment sampling per ISO 2479 / EN 16811-1 Annex B; NaCl, moisture and sieve witness tests; draft survey on bulk vessels; sealed retained samples', lab: 'Port laboratory — NaCl, Ca, Mg, SO₄, insolubles, moisture and sieve analysis on every lot; CoA issued before B/L' },
  construction: { bodies: 'TÜV Austria · SGS · Bureau Veritas', scope: 'EN 197-2 / ASTM C183 conformity sampling; Mill Test Certificate witness (Blaine, SO₃, LOI, strength); draft survey or tally', lab: 'Plant and port laboratory — chemical analysis and strength class on every lot; Mill Test Certificate issued before B/L' },
  fertilizers:  { bodies: 'SGS · Intertek · Bureau Veritas', scope: 'Sampling per ISO 8633 / ISO 7742; N, P₂O₅, K₂O, biuret, moisture and granulometry witness tests; draft survey or bag tally', lab: 'Port laboratory — nutrient assay, moisture and sizing on every lot; CoA issued before B/L' },
  chemicals:    { bodies: 'SGS · Intertek · Bureau Veritas', scope: 'Sampling per the product standard; assay and impurity witness tests; SDS / REACH dossier and UN packaging check', lab: 'Port laboratory — assay and impurity profile on every lot; CoA issued before B/L' },
  minerals:     { bodies: 'SGS · Bureau Veritas · Intertek', scope: 'ISO 3082 / ISO 12743 sampling and sample preparation; assay and moisture witness tests; draft survey for freight weight', lab: 'Mine and port laboratory — assay, moisture and sizing on every lot; CoA issued before B/L' },
  metals:       { bodies: 'SGS · Bureau Veritas · TÜV Austria', scope: 'EN 10204 3.1 mill-certificate verification; dimensional, tensile and chemistry witness tests; tally and bundle check', lab: 'Mill certificate reviewed and counter-checked at the port; heat-number traceability per bundle' },
  agro:         { bodies: 'SGS · Intertek · Egyptian CAPQ phytosanitary inspection', scope: 'MRL and contaminant laboratory test; phytosanitary inspection and certificate; cold-chain data-logger; GlobalG.A.P. chain of custody where applicable', lab: 'Packhouse and port cold-store QC — sizing, Brix / dry-matter, defects and pulp temperature on every lot; CoA and phytosanitary certificate issued before B/L' },
}
function inspectionFor(page) {
  const cat = page?.category || (page?.path || '').split('/')[2] || 'salt'
  return INSPECTION[cat] || INSPECTION.salt
}

const QA_CHAIN = [
  ['1', 'Extraction / source',    'Source sampling on every production lot (mine face, pan, plant, packhouse)', 'Source lab · per lot'],
  ['2', 'Processing',             'Washing, screening, drying, grading or milling verified against the contract specification', 'Plant QC · per batch'],
  ['3', 'Port laboratory',        'Full analysis against contract spec; Certificate of Analysis issued before the Bill of Lading', 'Port QC lab · per shipment'],
  ['4', 'Independent inspection', 'Pre-shipment sampling, witness testing, draft survey or tally; sealed retained samples held 90 days', 'SGS / TÜV / Intertek / BV · per vessel'],
  ['5', 'Destination acceptance', 'CoA cross-referenced with the buyer’s arrival laboratory; retained samples arbitrate any variance', 'Buyer lab · on discharge'],
]

const TABS = [
  { id: 'overview',     label: 'Overview',       icon: 'book' },
  { id: 'specs',        label: 'Specifications', icon: 'beaker' },
  { id: 'certificates', label: 'Certificates',   icon: 'shield' },
  { id: 'applications', label: 'Applications',   icon: 'factory' },
  { id: 'logistics',    label: 'Logistics',      icon: 'ship' },
  { id: 'documents',    label: 'Documents',      icon: 'doc' },
  { id: 'quote',        label: 'Get a quote',    icon: 'mail' },
]

export default function ProductTabs({ page, commodity, applications: matchedApps, qualitySpecs, packingOptions, coas, brand, visibility }) {
  const [active, setActive] = useState('overview')
  const [transitSelection, setTransitSelection] = useState({})

  const specs = page.specs || {}
  const certs = page.certifications || []
  const packing = page.packing_options || []
  const apps = matchedApps || []

  const sourceType = (specs.source_type || '').toLowerCase()
  const isSalt = page.path?.startsWith('/products/salt') || sourceType.includes('rock') || sourceType.includes('sea')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const h = window.location.hash.replace('#', '')
    if (h && TABS.find(t => t.id === h)) setActive(h)
    function onHash() {
      const h = window.location.hash.replace('#', '')
      if (h && TABS.find(t => t.id === h)) setActive(h)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function go(id) {
    setActive(id)
    if (typeof window !== 'undefined') {
      history.replaceState(null, '', `#${id}`)
      const el = document.getElementById('product-tabs')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section id="product-tabs" className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
      {/* Sticky tab bar */}
      <div className="sticky top-0 z-20 -mx-5 sm:-mx-6 lg:-mx-8 bg-white/85 backdrop-blur-md border-b border-[#14161a]/10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-auto">
          <div className="flex gap-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className={`shrink-0 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  active === t.id
                    ? 'border-[#ff6321] text-[#14161a]'
                    : 'border-transparent text-[#5b6472] hover:text-[#14161a] hover:border-[#14161a]/30'
                }`}
              >
                <Icon name={t.icon} className="w-3.5 h-3.5" /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="min-w-0 space-y-8">
          {/* Overview */}
          <div className={`space-y-6 ${active === 'overview' ? 'animate-fade-in-up' : 'hidden'}`}>
            {page.description && (
              <p className="text-lg text-[#3f4650] leading-relaxed font-medium">{page.description}</p>
            )}
            <QaPromise page={page} />
            {isSalt && <SourceStorySwitcher pageSourceType={specs.source_type} />}
            {!isSalt && (
              <div className="rounded-2xl border border-[#14161a]/10 bg-white p-6">
                <h3 className="text-lg font-bold text-[#14161a] mb-3 flex items-center gap-2"><Icon name="pin" className="w-4 h-4 text-[#0b8f84]" /> Origin &amp; sourcing</h3>
                <p className="text-sm text-[#3f4650] leading-relaxed">
                  {specs.origin || 'Sourced from Egypt Globe Group operations.'}
                  {' '}Provenance is documented on an Egyptian Chamber of Commerce Certificate of Origin and
                  qualifies for COMESA / PAFTA / EU-Med / AfCFTA preferential treatment where applicable.
                  Every lot is sampled at source and re-tested at the port of loading before the Bill of Lading is issued.
                </p>
              </div>
            )}
            <KeyStatsStrip page={page} specs={specs} />
          </div>

          {/* Specifications — structured spec sheet */}
          <div className={`space-y-4 ${active === 'specs' ? 'animate-fade-in-up' : 'hidden'}`}>
            <QaChainStrip />
            <SpecSheet page={page} specs={specs} commodity={commodity} qualitySpecs={qualitySpecs || []} />
            {certs.length > 0 && <CertificationsBlock certs={certs} />}
          </div>

          {/* Certificates of Analysis */}
          <div className={active === 'certificates' ? 'animate-fade-in-up' : 'hidden'}>
            <CoaCenter coas={coas || []} commodityName={page.title} requestPath={page.path} brand={brand} commodity={commodity} />
          </div>

          {/* Applications */}
          <div className={`space-y-6 ${active === 'applications' ? 'animate-fade-in-up' : 'hidden'}`}>
            <ApplicationsGrid apps={apps} pageTitle={page.title} />
            {(packingOptions?.length > 0 || packing.length > 0) && (
              <PackingMatrix packingOptions={packingOptions} productPackingOptions={packing} />
            )}
          </div>

          {/* Logistics */}
          <div className={`space-y-6 ${active === 'logistics' ? 'animate-fade-in-up' : 'hidden'}`}>
            <TransitTimeCalculator
              defaultPorts={page.loading_ports || []}
              onSelect={(s) => setTransitSelection(s)}
            />
            <LoadingPortsCard ports={page.loading_ports || []} regions={page.regions || []} />
          </div>

          {/* Documents */}
          <div className={active === 'documents' ? 'animate-fade-in-up' : 'hidden'}>
            <DocumentChecklist />
          </div>

          {/* Quote */}
          <div className={active === 'quote' ? 'animate-fade-in-up' : 'hidden'}>
            <InlineQuoteCard page={page} prefill={transitSelection} />
          </div>
        </div>

        {/* Sticky right rail */}
        <aside className="lg:sticky lg:top-24 self-start space-y-4">
          <QuoteCta page={page} />
          {(page.moq_mt || page.lead_time_min_weeks || page.hs_code || page.price_indication) && (
            <CommercialCard page={page} visibility={visibility} />
          )}
        </aside>
      </div>
    </section>
  )
}

/* ─── sub-components ──────────────────────────────────────────────────── */

function QaPromise({ page }) {
  const insp = inspectionFor(page)
  return (
    <div className="rounded-2xl ring-1 ring-[#0fb5a5]/35 bg-[#f2fbfa] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="shrink-0 inline-flex w-9 h-9 items-center justify-center rounded-lg bg-white ring-1 ring-[#0fb5a5]/40 text-[#0b8f84]"><Icon name="shield" className="w-[18px] h-[18px]" /></span>
        <div>
          <h3 className="text-base font-bold text-[#14161a]">Quality at the Core — how this product is verified</h3>
          <p className="text-sm text-[#3f4650] leading-relaxed mt-1.5">
            Egypt Globe Group has operated with an internal Quality Assurance division since its 2014 incorporation.
            {' '}{insp.lab}. A lot that falls outside its Certificate of Analysis is rejected at the loading port — never re-graded
            or renegotiated. Independent pre-shipment inspection by {insp.bodies} is available on every consignment.
            Specification is guaranteed at the port of loading and binding under the sales contract.
          </p>
        </div>
      </div>
    </div>
  )
}

function KeyStatsStrip({ page, specs }) {
  const items = [
    specs.nacl_min     && { label: 'Purity',         value: specs.nacl_min },
    specs.moisture_max && { label: 'Moisture',       value: specs.moisture_max },
    specs.particle_size && { label: 'Particle size', value: specs.particle_size },
    page.moq_mt        && { label: 'MOQ',            value: `${Number(page.moq_mt).toLocaleString()} MT` },
    (page.lead_time_min_weeks || page.lead_time_max_weeks) && {
      label: 'Lead time',
      value: page.lead_time_min_weeks && page.lead_time_max_weeks
        ? `${page.lead_time_min_weeks}–${page.lead_time_max_weeks} wk`
        : `${page.lead_time_min_weeks || page.lead_time_max_weeks} wk`
    },
  ].filter(Boolean)
  if (!items.length) return null
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map(it => (
        <div key={it.label} className="rounded-xl border border-[#14161a]/10 bg-white p-3">
          <div className="text-[10px] uppercase tracking-wider text-[#7a8290] font-bold">{it.label}</div>
          <div className="text-base font-semibold text-[#0b8f84] font-mono mt-1">{it.value}</div>
        </div>
      ))}
    </div>
  )
}

function QaChainStrip() {
  return (
    <div className="bg-white border border-[#14161a]/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 sm:px-6 py-4 border-b border-[#14161a]/10 bg-[#f9fafb] flex items-center justify-between gap-3">
        <h3 className="font-bold text-lg text-[#14161a] flex items-center gap-2">
          <Icon name="shield" className="w-5 h-5 text-[#0b8f84]" /> QA verification chain — extraction to destination port
        </h3>
        <span className="text-xs font-medium text-[#7a8290] hidden sm:inline">5 gates · every consignment</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f9fafb] border-b border-[#14161a]/10">
            <tr>
              <Th className="w-12">Gate</Th><Th>Control</Th><Th className="hidden md:table-cell">Evidence</Th><Th>Who · frequency</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#14161a]/10">
            {QA_CHAIN.map(([n, stage, evidence, who]) => (
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
    </div>
  )
}

function Th({ children, className = '' }) {
  return <th className={`text-left text-[10px] uppercase tracking-wider font-bold text-[#7a8290] px-4 py-2 ${className}`}>{children}</th>
}

/**
 * SpecSheet — merges `specs` jsonb with `quality_specs` rows and renders the
 * Physical / Chemical / Logistical-&-QA tables.
 */
function SpecSheet({ page, specs, commodity, qualitySpecs }) {
  const qsByKey = {}
  for (const q of qualitySpecs) if (q.parameter_key) qsByKey[q.parameter_key] = q

  const rows = {}
  for (const [k, v] of Object.entries(specs)) {
    if (v === null || v === '' || v === undefined) continue
    rows[k] = { key: k, label: pretty(k), value: fmt(v), group: classify(k) }
  }
  for (const q of qualitySpecs) {
    const k = q.parameter_key
    if (!k) continue
    if (!rows[k]) {
      const val = [q.target_value, q.unit && !String(q.target_value || '').includes(q.unit) ? q.unit : ''].filter(Boolean).join(' ')
      rows[k] = { key: k, label: q.parameter_name || pretty(k), value: val, group: classify(k) }
    }
    rows[k].method = q.test_method && q.test_method !== 'Per applicable standard' ? q.test_method : rows[k].method
    rows[k].standard = q.standard_ref || rows[k].standard
    rows[k].freq = q.sampling_freq || rows[k].freq
    rows[k].required = !!q.required
  }

  const byGroup = g => Object.values(rows).filter(r => r.group === g).sort((a, b) => (b.required ? 1 : 0) - (a.required ? 1 : 0))
  const physical = byGroup('physical')
  const chemical = byGroup('chemical')
  const identity = byGroup('identity').filter(r => !['description', 'note', 'unit', 'un_code'].includes(r.key))

  const insp = inspectionFor(page)
  const lead = page.lead_time_min_weeks && page.lead_time_max_weeks
    ? `${page.lead_time_min_weeks}–${page.lead_time_max_weeks} weeks from L/C or advance`
    : (page.lead_time_min_weeks || page.lead_time_max_weeks) ? `${page.lead_time_min_weeks || page.lead_time_max_weeks} weeks from L/C or advance` : null
  const moqFcl = specs.min_order_container || (page.moq_mt ? `${Number(page.moq_mt).toLocaleString()} MT` : null)
  const moqBulk = specs.min_order_vessel
    ? `${specs.min_order_vessel}${specs.max_order_vessel ? ` · up to ${specs.max_order_vessel}` : ''}`
    : (specs.min_order && specs.max_order ? `${Number(specs.min_order).toLocaleString()} – ${Number(specs.max_order).toLocaleString()} MT` : null)
  const incoterms = Array.isArray(specs.incoterms) && specs.incoterms.length ? specs.incoterms.join(' · ') + ' (DAP / DDP on request)' : 'FOB · CFR · CIF (DAP / DDP on request)'

  const logistics = [
    ['MOQ — containerised (FCL)', moqFcl],
    ['MOQ — break-bulk vessel', moqBulk],
    ['Shipping options', specs.shipping_options],
    ['Packing', (page.packing_options || []).join(' · ') || null],
    ['Loading ports', (page.loading_ports || []).join(' · ') || null],
    ['Incoterms', incoterms],
    ['Lead time', lead],
    ['Processing', specs.processing_options || specs.processing],
    ['Independent inspection protocol', `${insp.bodies} — ${insp.scope}`],
    ['Internal QA gate', `${insp.lab}. Lot rejected if any parameter falls outside specification.`],
    ['Documents', 'Commercial Invoice · Packing List · B/L · Certificate of Origin (Egyptian Chamber of Commerce; EUR.1 / PAFTA / COMESA / AfCFTA) · CoA' + (page.category === 'agro' ? ' · Phytosanitary certificate' : '')],
    ['HS code', page.hs_code],
  ].filter(([, v]) => v)

  return (
    <div className="space-y-4">
      {/* Identity strip */}
      {(identity.length > 0 || page.hs_code) && (
        <div className="rounded-2xl border border-[#14161a]/10 bg-white px-5 sm:px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
          {page.hs_code && <Id label="HS code" value={page.hs_code} mono />}
          {identity.map(r => <Id key={r.key} label={r.label} value={r.value} mono={/code|sku/.test(r.key)} />)}
        </div>
      )}

      {physical.length > 0 && (
        <Table title="Physical properties" icon="layers" cols={['Parameter', 'Specification', 'Test method', 'Standard · sampling']} count={physical.length}>
          {physical.map(r => <SpecRow key={r.key} r={r} />)}
        </Table>
      )}

      {chemical.length > 0 && (
        <Table title="Chemical analysis" icon="beaker" cols={['Parameter', 'Limit', 'Test method', 'Standard · QA sampling']} count={chemical.length}>
          {chemical.map(r => <SpecRow key={r.key} r={r} />)}
        </Table>
      )}

      <Table title="Logistical & QA parameters" icon="anchor" cols={['Parameter', 'Detail']}>
        {logistics.map(([k, v]) => (
          <tr key={k} className="hover:bg-[#f9fafb]">
            <td className="px-4 py-2.5 align-top text-[#14161a] text-xs font-semibold w-[38%]">{k}</td>
            <td className="px-4 py-2.5 align-top text-[#3f4650] text-xs">{v}</td>
          </tr>
        ))}
      </Table>

      <p className="px-1 text-[11px] text-[#7a8290] leading-relaxed">
        ● Required parameter — tested on every shipment before the Bill of Lading. Values are contractual limits guaranteed at the port of loading.
        Independent third-party verification is typically 0.3–0.5 % of FOB value.
        {commodity && <> Commodity master: <span className="font-mono font-semibold text-[#3f4650]">{commodity.code || commodity.sku || commodity.name}</span>.</>}
      </p>

      {page.datasheet_url && (
        <a href={page.datasheet_url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#f2fbfa] ring-1 ring-[#0fb5a5]/30 text-sm font-semibold text-[#0b8f84] hover:bg-[#e6f8f6] transition-colors">
          <Icon name="doc" className="w-4 h-4" /> Download Technical Data Sheet (PDF) →
        </a>
      )}
    </div>
  )
}

function Table({ title, icon, cols, children, count }) {
  return (
    <div className="bg-white border border-[#14161a]/10 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 sm:px-6 py-4 border-b border-[#14161a]/10 bg-[#f9fafb] flex items-center justify-between gap-3">
        <h3 className="font-bold text-lg text-[#14161a] flex items-center gap-2"><Icon name={icon} className="w-5 h-5 text-[#0b8f84]" /> {title}</h3>
        {count != null && <span className="text-xs font-medium text-[#7a8290]">{count} parameters</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white border-b border-[#14161a]/10"><tr>{cols.map((c, i) => <Th key={c} className={i >= 2 ? 'hidden md:table-cell' : ''}>{c}</Th>)}</tr></thead>
          <tbody className="divide-y divide-[#14161a]/10">{children}</tbody>
        </table>
      </div>
    </div>
  )
}

function SpecRow({ r }) {
  return (
    <tr className="hover:bg-[#f9fafb]">
      <td className="px-4 py-2.5 align-top text-[#14161a] text-xs font-semibold">{r.label}{r.required && <span className="ml-1 text-[#d9501a]" title="Required per shipment">●</span>}</td>
      <td className="px-4 py-2.5 align-top text-[#14161a] font-mono text-xs font-bold">{r.value}</td>
      <td className="px-4 py-2.5 align-top text-[#3f4650] text-xs hidden md:table-cell">{r.method || '—'}</td>
      <td className="px-4 py-2.5 align-top text-[#7a8290] text-xs hidden md:table-cell">{r.standard || '—'}{r.freq ? <span className="block text-[10px]">{r.freq}</span> : null}</td>
    </tr>
  )
}

function Id({ label, value, mono }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wider text-[#7a8290] font-bold">{label}</div>
      <div className={`text-sm text-[#14161a] font-semibold truncate ${mono ? 'font-mono' : ''}`} title={value}>{value}</div>
    </div>
  )
}

function CertificationsBlock({ certs }) {
  return (
    <div className="bg-white border border-[#14161a]/10 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-lg text-[#14161a] mb-4 flex items-center gap-2">
        <Icon name="shield" className="w-5 h-5 text-[#0b8f84]" /> Certifications &amp; standards
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {certs.map(c => (
          <div key={c} className="flex items-start gap-2 p-3 rounded-lg border border-[#14161a]/10 bg-[#f9fafb]">
            <Icon name="check" className="w-4 h-4 text-[#0b8f84] shrink-0 mt-0.5" strokeWidth={2.2} />
            <span className="text-sm text-[#3f4650] font-semibold">{c}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ApplicationsGrid({ apps, pageTitle }) {
  if (!apps.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#14161a]/10 bg-[#f9fafb] p-8 text-center text-sm text-[#7a8290]">
        No specific application taxonomy linked. {pageTitle} is suitable for general industrial / commercial use — contact our export desk for fit-to-application advice.
      </div>
    )
  }
  return (
    <div className="bg-white border border-[#14161a]/10 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-lg text-[#14161a] mb-4 flex items-center gap-2">
        <Icon name="factory" className="w-5 h-5 text-[#0b8f84]" /> Where {pageTitle} is used
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {apps.map(app => (
          <Link key={app.id} href={app.path}
            className="flex items-center gap-3 p-4 border border-[#14161a]/10 rounded-xl hover:border-[#0fb5a5] hover:bg-[#f2fbfa] transition-all group">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[#14161a] ring-1 ring-[#14161a]/15">
              <Icon name={APPLICATION_ICON[app.id] || 'factory'} className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[#14161a] group-hover:text-[#0b8f84] transition-colors">{app.label}</div>
              <div className="text-xs text-[#7a8290] mt-0.5">View matching products →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function LoadingPortsCard({ ports, regions }) {
  if (ports.length === 0 && regions.length === 0) return null
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {ports.length > 0 && (
        <div className="rounded-2xl bg-[#fbf7ee] border border-[#b8862b]/25 p-5">
          <h4 className="font-bold text-[#14161a] mb-2 flex items-center gap-1.5">
            <Icon name="anchor" className="w-4 h-4 text-[#8a6d3b]" /> Loads from
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {ports.map(p => (
              <span key={p} className="inline-flex items-center text-xs font-semibold bg-white text-[#8a6d3b] border border-[#b8862b]/45 px-2.5 py-1 rounded-full">{p}</span>
            ))}
          </div>
          <p className="text-[11px] text-[#7a8290] mt-2">Resident EGG stevedoring, agency and port-QC teams at every berth.</p>
        </div>
      )}
      {regions.length > 0 && (
        <div className="rounded-2xl bg-[#eef6fd] border border-[#0284c7]/25 p-5">
          <h4 className="font-bold text-[#14161a] mb-2 flex items-center gap-1.5">
            <Icon name="globe" className="w-4 h-4 text-[#0369a1]" /> Ships to
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {regions.map(r => (
              <span key={r} className="inline-flex items-center text-xs font-medium bg-white text-[#0369a1] border border-[#0284c7]/35 px-2.5 py-1 rounded-full">{r}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function QuoteCta({ page }) {
  return (
    <div className="relative overflow-hidden egg-panel p-5">
      <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-60 pointer-events-none" />
      <div className="relative">
        <h3 className="egg-display text-xl text-[#14161a] mb-1.5">Quote in 24 hours</h3>
        <p className="text-[#3f4650] text-xs mb-4">Priced offer, sample CoA and inspection protocol. Direct to the export desk.</p>
        <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
          className="egg-btn-primary w-full text-sm py-2.5">
          Get Quote
        </Link>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Link href={`/tds${page.path}`} target="_blank"
            className="egg-btn-ghost text-xs py-2 px-2">
            <Icon name="doc" className="w-3.5 h-3.5" /> TDS
          </Link>
          <Link href={`/rfq?product=${encodeURIComponent(page.path)}&type=coa`}
            className="egg-btn-ghost text-xs py-2 px-2">
            <Icon name="beaker" className="w-3.5 h-3.5" /> CoA
          </Link>
        </div>
      </div>
    </div>
  )
}

function CommercialCard({ page, visibility }) {
  return (
    <div className="bg-[#fff4ec] ring-1 ring-[#ff6321]/25 rounded-2xl p-5">
      <h3 className="font-bold text-[#14161a] text-sm mb-3">Commercial</h3>
      <div className="grid grid-cols-2 gap-3 text-xs">
        {page.moq_mt && (
          <div>
            <div className="text-[#7a8290] mb-0.5">Min. order</div>
            <div className="font-bold text-[#14161a] text-base">{Number(page.moq_mt).toLocaleString()} MT</div>
          </div>
        )}
        {(page.lead_time_min_weeks || page.lead_time_max_weeks) && (
          <div>
            <div className="text-[#7a8290] mb-0.5">Lead</div>
            <div className="font-bold text-[#14161a] text-base">
              {page.lead_time_min_weeks && page.lead_time_max_weeks
                ? `${page.lead_time_min_weeks}–${page.lead_time_max_weeks} wk`
                : `${page.lead_time_min_weeks || page.lead_time_max_weeks} wk`}
            </div>
          </div>
        )}
        {page.hs_code && (
          <div className="col-span-2">
            <div className="text-[#7a8290] mb-0.5">HS code</div>
            <div className="font-mono font-bold text-[#14161a]">{page.hs_code}</div>
          </div>
        )}
        {page.price_indication && (
          <div className="col-span-2 pt-2 border-t border-[#ff6321]/25">
            <div className="text-[#7a8290] mb-0.5">Indicative price</div>
            <PriceDisplay price={page.price_indication} visibility={visibility} size="lg" placeholder="Sign in to see price" />
          </div>
        )}
      </div>
    </div>
  )
}
