'use client'

/**
 * ProductTabs — Drop 132 interactive product layout.
 *
 * Replaces the long-scroll body+ProductDetailBlock combo with a clean
 * tabbed interface so buyers can jump straight to the section they care
 * about (specs / packing / logistics / quote) instead of scrolling past
 * 2,500 chars of editorial. Body markdown is no longer rendered on SKU
 * pages — every fact lives in an interactive card now.
 *
 * Tabs: Overview · Specs · Applications · Logistics · Documents · Quote
 *
 * Each tab is server-data-driven. The component itself is client-side
 * for state + interactions, but receives all data as props from the
 * server-rendered ProductDetailBlock (so SEO crawlers get the full text
 * even before JS hydrates — critical for AI crawlers that don't run JS).
 */
import { useState, useEffect } from 'react'
import Link from 'next/link'
import SourceStorySwitcher from './SourceStorySwitcher'
import TransitTimeCalculator from './TransitTimeCalculator'
import DocumentChecklist from './DocumentChecklist'
import InlineQuoteCard from './InlineQuoteCard'
import PriceDisplay from '../PriceDisplay'
import PackingMatrix from '../PackingMatrix'

const SPEC_LABELS = {
  nacl_min: 'NaCl min', moisture_max: 'Moisture max', particle_size: 'Particle size',
  bulk_density: 'Bulk density', ca_max: 'Ca max', mg_max: 'Mg max', so4_max: 'SO₄ max',
  water_insolubles: 'Water insolubles', pb_max: 'Lead (Pb)', as_max: 'Arsenic (As)',
  cd_max: 'Cadmium (Cd)', hg_max: 'Mercury (Hg)', ph_range: 'pH range', colour: 'Colour',
  appearance: 'Appearance', grain_label: 'Grain', source_type: 'Source', origin: 'Origin',
  storage_conditions: 'Storage', shelf_life_months: 'Shelf life', product_code: 'Product code',
  standard: 'Standard', compressive_2d: 'Compressive 2-day', compressive_7d: 'Compressive 7-day',
  compressive_28d: 'Compressive 28-day', blaine_fineness: 'Blaine fineness', so3_max: 'SO₃ max',
  mgo_max: 'MgO max', loi_max: 'LOI max', insoluble_residue: 'Insoluble residue', c3a: 'C₃A',
  c3a_max: 'C₃A max', chloride_max: 'Chloride max', initial_setting: 'Initial setting',
  final_setting: 'Final setting', sulfate_resistance: 'Sulfate resistance',
  nitrogen_min: 'N min', biuret_max: 'Biuret max', free_flowing: 'Free-flowing',
  k2o_min: 'K₂O min', cl_max: 'Cl max', p2o5_min: 'P₂O₅ min', p2o5_content: 'P₂O₅ content',
  water_soluble: 'Water-soluble', free_acid_max: 'Free acid max',
  water_solubility: 'Water solubility', ph_solution: 'pH (solution)',
  concentration: 'Concentration', iron_max: 'Iron max', free_chlorine: 'Free chlorine',
  specific_gravity: 'Specific gravity', un_number: 'UN number', fe_max: 'Fe max',
  caso4_min: 'CaSO₄ min', caco3_min: 'CaCO₃ min', purity_options: 'Purity options',
  sio2_max: 'SiO₂ max', anti_caking: 'Anti-caking', natural: 'Natural',
}
function pretty(k) { return SPEC_LABELS[k] || k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

const TABS = [
  { id: 'overview',     label: 'Overview',     icon: '📖' },
  { id: 'specs',        label: 'Specifications', icon: '🧪' },
  { id: 'applications', label: 'Applications', icon: '🏭' },
  { id: 'logistics',    label: 'Logistics',    icon: '🚢' },
  { id: 'documents',    label: 'Documents',    icon: '📋' },
  { id: 'quote',        label: 'Get a quote',  icon: '📨' },
]

export default function ProductTabs({ page, commodity, applications: matchedApps, qualitySpecs, packingOptions, visibility }) {
  const [active, setActive] = useState('overview')
  const [transitSelection, setTransitSelection] = useState({})

  const specs = page.specs || {}
  const certs = page.certifications || []
  const packing = page.packing_options || []
  const apps = matchedApps || []

  const specEntries = Object.entries(specs).filter(([, v]) => v !== null && v !== '' && v !== undefined)
  const sourceType = (specs.source_type || '').toLowerCase()
  const isSalt = page.path?.startsWith('/products/salt') || sourceType.includes('rock') || sourceType.includes('sea')

  // Hash-routing — /products/.../sku#specs jumps to the Specs tab on load
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
      // Smooth-scroll to the panel, with header offset
      const el = document.getElementById('product-tabs')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section id="product-tabs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Sticky tab bar */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 bg-white/85 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 overflow-x-auto">
          <div className="flex gap-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => go(t.id)}
                className={`shrink-0 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  active === t.id
                    ? 'border-[#1d5fa1] text-[#1d5fa1]'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <span aria-hidden="true">{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Panels — ALL render in DOM so SEO crawlers + AI crawlers see every
         fact even pre-JS. Non-active panels hidden via Tailwind `hidden`
         class (display:none) — invisible to humans, visible to bots. */}
      <div className="pt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="min-w-0 space-y-8">
          {/* Overview */}
          <div className={`space-y-6 ${active === 'overview' ? 'animate-fade-in-up' : 'hidden'}`}>
            {page.description && (
              <p className="text-lg text-slate-700 leading-relaxed font-medium">{page.description}</p>
            )}
            {isSalt && <SourceStorySwitcher pageSourceType={specs.source_type} />}
            {!isSalt && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Origin & sourcing</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {specs.origin || 'Sourced from Egypt Globe Group operations.'}
                  {' '}Provenance documented on Egyptian Chamber of Commerce Certificate of Origin —
                  qualifies for COMESA / PAFTA / EU-Med preferential treatment where applicable.
                </p>
              </div>
            )}
            <KeyStatsStrip page={page} specs={specs} />
          </div>

          {/* Specs */}
          <div className={active === 'specs' ? 'animate-fade-in-up' : 'hidden'}>
            <SpecsTable page={page} specs={specs} commodity={commodity} specEntries={specEntries} />
            {qualitySpecs && qualitySpecs.length > 0 && (
              <QualityReferenceTable specs={qualitySpecs} />
            )}
            {certs.length > 0 && <CertificationsBlock certs={certs} />}
          </div>

          {/* Applications */}
          <div className={`space-y-6 ${active === 'applications' ? 'animate-fade-in-up' : 'hidden'}`}>
            <ApplicationsGrid apps={apps} pageTitle={page.title} />
            {/* Drop 141 — comprehensive PackingMatrix from globe_packing_options
                table. Falls back to product's own packing array when master
                fetch returned empty (Supabase down, etc.). Mobile-friendly
                stacked grid with vessel-mode chips + OEM badge per format. */}
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

        {/* Sticky right rail — Quick Quote + Commercial Terms always visible */}
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

// ─── Sub-components ──────────────────────────────────────────────────────

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
        <div key={it.label} className="rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{it.label}</div>
          <div className="text-base font-extrabold text-[#1d5fa1] font-mono mt-1">{it.value}</div>
        </div>
      ))}
    </div>
  )
}

function SpecsTable({ page, specs, commodity, specEntries }) {
  const ANCHOR_ORDER = ['hs_code', 'product_code', 'source_type', 'origin', 'grain_label', 'colour', 'appearance']
  const anchors = ANCHOR_ORDER
    .map(k => k === 'hs_code'
      ? page.hs_code && { label: pretty(k), value: page.hs_code, mono: true }
      : specs[k] && { label: pretty(k), value: specs[k], mono: k.includes('code') }
    )
    .filter(Boolean)
  const numeric = specEntries
    .filter(([k]) => !ANCHOR_ORDER.includes(k))
    .map(([k, v]) => ({ label: pretty(k), value: String(v) }))

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <span className="text-xl">🧪</span> Full specification
        </h3>
        <span className="text-xs font-medium text-slate-500">{anchors.length + numeric.length} parameters</span>
      </div>
      <div className="divide-y divide-slate-100">
        {[...anchors, ...numeric].map((row, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-1 px-6 py-3 hover:bg-slate-50/50 transition-colors">
            <dt className="text-sm font-semibold text-slate-500">{row.label}</dt>
            <dd className={`sm:col-span-2 text-sm text-slate-900 ${row.mono ? 'font-mono font-bold' : 'font-semibold'}`}>{row.value}</dd>
          </div>
        ))}
      </div>
      {commodity && (
        <div className="px-6 py-3 bg-slate-50/40 border-t border-slate-100 text-xs text-slate-500">
          Commodity master: <span className="font-mono font-semibold text-slate-700">{commodity.code || commodity.sku || commodity.name}</span>
        </div>
      )}
      {page.datasheet_url && (
        <a href={page.datasheet_url} target="_blank" rel="noopener noreferrer"
          className="block px-6 py-3 bg-blue-50 border-t border-blue-100 text-sm font-semibold text-[#1d5fa1] hover:bg-blue-100 transition-colors">
          📄 Download Technical Data Sheet (PDF) →
        </a>
      )}
    </div>
  )
}

/**
 * QualityReferenceTable — Drop 137b. Renders the cross-product quality_specs
 * reference (Drop 136 master) for this commodity. One row per parameter
 * carrying target value + test method + standard + cert body + sampling
 * frequency + required flag. Mounted under the SpecsTable in the Specs tab.
 */
function QualityReferenceTable({ specs }) {
  const required = specs.filter(s => s.required)
  const optional = specs.filter(s => !s.required)
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mt-4">
      <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-amber-50/40 via-white to-amber-50/40 flex items-center justify-between">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <span className="text-xl">🛡</span> Quality reference + test methods
        </h3>
        <span className="text-xs font-medium text-slate-500">
          {required.length} required · {optional.length} optional · {specs.length} total
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/60 border-b border-slate-100">
            <tr>
              <th className="text-left text-[10px] uppercase tracking-wider font-bold text-slate-500 px-4 py-2">Parameter</th>
              <th className="text-left text-[10px] uppercase tracking-wider font-bold text-slate-500 px-4 py-2">Target</th>
              <th className="text-left text-[10px] uppercase tracking-wider font-bold text-slate-500 px-4 py-2">Test method</th>
              <th className="text-left text-[10px] uppercase tracking-wider font-bold text-slate-500 px-4 py-2 hidden md:table-cell">Standard</th>
              <th className="text-left text-[10px] uppercase tracking-wider font-bold text-slate-500 px-4 py-2 hidden lg:table-cell">Cert body</th>
              <th className="text-center text-[10px] uppercase tracking-wider font-bold text-slate-500 px-4 py-2">Req</th>
            </tr>
          </thead>
          <tbody>
            {[...required, ...optional].map(s => (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/40">
                <td className="px-4 py-2.5 text-slate-900 text-xs font-semibold">{s.parameter_name}</td>
                <td className="px-4 py-2.5 text-amber-700 font-mono text-xs font-bold">
                  {s.target_value} {s.unit && <span className="text-slate-400 font-normal">{s.unit}</span>}
                </td>
                <td className="px-4 py-2.5 text-slate-600 text-xs">{s.test_method}</td>
                <td className="px-4 py-2.5 text-slate-500 text-xs hidden md:table-cell">{s.standard_ref}</td>
                <td className="px-4 py-2.5 text-slate-500 text-xs hidden lg:table-cell">{s.certification_body}</td>
                <td className="px-4 py-2.5 text-center text-xs">
                  {s.required
                    ? <span className="inline-flex items-center gap-0.5 text-red-700 font-bold">●</span>
                    : <span className="text-slate-300">○</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="px-4 py-3 text-[11px] text-slate-500 bg-slate-50/40 border-t border-slate-100">
        ● Required = mandatory per shipment. ○ Optional = on-request.
        Independent third-party verification (SGS / Intertek / Bureau Veritas) available — typically 0.3-0.5% of FOB value.
      </p>
    </div>
  )
}

function CertificationsBlock({ certs }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mt-4">
      <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
        <span className="text-xl">🏅</span> Certifications & Standards
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {certs.map(c => (
          <div key={c} className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50/40">
            <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm text-slate-700 font-semibold">{c}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ApplicationsGrid({ apps, pageTitle }) {
  if (!apps.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 p-8 text-center text-sm text-slate-500">
        No specific application taxonomy linked. {pageTitle} is suitable for general industrial / commercial use — contact our export desk for fit-to-application advice.
      </div>
    )
  }
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
        <span className="text-xl">🏭</span> Where {pageTitle} is used
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {apps.map(app => (
          <Link key={app.id} href={app.path}
            className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-[#1d5fa1] hover:bg-blue-50/40 transition-all group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br from-violet-100 to-blue-100">
              {app.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 group-hover:text-[#1d5fa1] transition-colors">{app.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">View matching products →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function PackingGrid({ packing }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
        <span className="text-xl">📦</span> Available packing formats
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {packing.map((p, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 text-center">
            <div className="text-3xl mb-1">📦</div>
            <div className="text-xs font-bold text-slate-900">{p}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-4">
        OEM / private-label printing on request.{' '}
        <Link href="/services/packing" className="text-[#1d5fa1] font-semibold hover:underline">View packing services →</Link>
      </p>
    </div>
  )
}

function LoadingPortsCard({ ports, regions }) {
  if (ports.length === 0 && regions.length === 0) return null
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {ports.length > 0 && (
        <div className="rounded-2xl bg-amber-50/60 border border-amber-100 p-5">
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
            <span className="text-lg">⚓</span> Loads from
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {ports.map(p => (
              <span key={p} className="inline-flex items-center text-xs font-semibold bg-white text-amber-900 border border-amber-200 px-2.5 py-1 rounded-full">{p}</span>
            ))}
          </div>
        </div>
      )}
      {regions.length > 0 && (
        <div className="rounded-2xl bg-blue-50/60 border border-blue-100 p-5">
          <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
            <span className="text-lg">🌍</span> Ships to
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {regions.map(r => (
              <span key={r} className="inline-flex items-center text-xs font-medium bg-white text-blue-800 border border-blue-200 px-2.5 py-1 rounded-full">{r}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function QuoteCta({ page }) {
  return (
    <div className="bg-gradient-to-br from-[#1d5fa1] to-[#14467a] rounded-2xl p-5 text-white shadow-xl">
      <h3 className="font-bold text-base mb-1.5">Quote in 24 hours</h3>
      <p className="text-blue-100 text-xs mb-4">No spam. Direct to our Cairo export desk.</p>
      <Link href={`/rfq?product=${encodeURIComponent(page.path)}`}
        className="block w-full text-center bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg text-sm">
        📋 Get Quote
      </Link>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Link href={`/tds${page.path}`} target="_blank"
          className="flex items-center justify-center gap-1 border border-white/25 text-white/85 hover:text-white hover:bg-white/10 text-xs font-bold py-2 rounded-lg transition-colors">
          📄 TDS
        </Link>
        <Link href={`/rfq?product=${encodeURIComponent(page.path)}&type=coa`}
          className="flex items-center justify-center gap-1 border border-white/25 text-white/85 hover:text-white hover:bg-white/10 text-xs font-bold py-2 rounded-lg transition-colors">
          🧪 CoA
        </Link>
      </div>
    </div>
  )
}

function CommercialCard({ page, visibility }) {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold text-slate-900 text-sm mb-3">Commercial</h3>
      <div className="grid grid-cols-2 gap-3 text-xs">
        {page.moq_mt && (
          <div>
            <div className="text-slate-500 mb-0.5">Min. order</div>
            <div className="font-bold text-slate-900 text-base">{Number(page.moq_mt).toLocaleString()} MT</div>
          </div>
        )}
        {(page.lead_time_min_weeks || page.lead_time_max_weeks) && (
          <div>
            <div className="text-slate-500 mb-0.5">Lead</div>
            <div className="font-bold text-slate-900 text-base">
              {page.lead_time_min_weeks && page.lead_time_max_weeks
                ? `${page.lead_time_min_weeks}–${page.lead_time_max_weeks} wk`
                : `${page.lead_time_min_weeks || page.lead_time_max_weeks} wk`}
            </div>
          </div>
        )}
        {page.hs_code && (
          <div className="col-span-2">
            <div className="text-slate-500 mb-0.5">HS code</div>
            <div className="font-mono font-bold text-slate-900">{page.hs_code}</div>
          </div>
        )}
        {page.price_indication && (
          <div className="col-span-2 pt-2 border-t border-orange-200">
            <div className="text-slate-500 mb-0.5">Indicative price</div>
            <PriceDisplay price={page.price_indication} visibility={visibility} size="lg" placeholder="Sign in to see price" />
          </div>
        )}
      </div>
    </div>
  )
}
