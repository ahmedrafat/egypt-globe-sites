/**
 * /products — Egypt Globe Group commodity divisions hub.
 * White theme, consistent with homepage (light editorial system —
 * tokens + utilities in app/globals.css). Responsive throughout.
 */
import HeroMotif from '../../components/HeroMotif'
import Link from 'next/link'
import { PRODUCT_DIVISIONS } from '../../lib/corporatePages'
import Icon, { DIVISION_ICON } from '../../components/ui/Icon'
import QualityStrip from '../../components/QualityStrip'
import QaChainTable, { DataTable } from '../../components/QaChainTable'

export const revalidate = 3600

export const metadata = {
  title: 'Products — Egyptian Commodity Exporter',
  description:
    'Salt, fertilizers, construction materials, chemicals, industrial minerals, agro & food, metals — 7 commodity divisions, every lot laboratory-verified before B/L, exported FOB / CIF / CFR from 7 Egyptian seaports to 60+ markets with TÜV Austria / SGS / Intertek / BV inspection.',
}

const INCOTERMS = [
  { term: 'FOB', desc: 'Buyer arranges freight from the Egyptian port.' },
  { term: 'CIF', desc: 'We deliver cost + insurance + freight to your port.' },
  { term: 'CFR', desc: 'Cost & freight — CIF without insurance.' },
  { term: 'DAP', desc: 'Door delivery, buyer clears import customs.' },
  { term: 'EXW', desc: 'Buyer collects ex-works; lowest price basis.' },
  { term: 'DDP', desc: 'Full door-to-door, we handle import clearance.' },
]

const PORTS = [
  { name: 'Damietta',       code: 'EGDAM', note: 'Primary salt & agro terminal' },
  { name: 'Alexandria',     code: 'EGALY', note: 'General cargo & container hub' },
  { name: 'El Dekheila',    code: 'EGEDK', note: 'Bulk minerals & rock salt' },
  { name: 'Port Said East', code: 'EGPSE', note: 'Container & sea salt' },
  { name: 'Ain Sokhna',     code: 'EGSOK', note: 'Minerals & fertilizers' },
  { name: 'Al-Arish',       code: 'EGEAR', note: 'Sinai sea salt' },
  { name: 'Suez',           code: 'EGPSD', note: 'Red Sea lane entry' },
]

const QA_MATRIX = [
  [<Link key="s" href="/products/salt" className="egg-link">Salt</Link>, 'Siwa rock ≥ 97 % NaCl · Sinai sea raw / washed / double-washed · de-icing, industrial, food, pharma', 'EN 16811-1 · ASTM D632 · BS 3247 · GOST 13830 · Codex STAN 150 · USP / BP / EP', 'CoA: NaCl, Ca, Mg, SO₄, insolubles, moisture, sieve', 'TÜV Austria · SGS · Intertek · BV'],
  [<Link key="c" href="/products/construction" className="egg-link">Construction</Link>, 'CEM I 42.5N / 52.5N · CEM II · SRC · white cement · clinker · gypsum · limestone', 'EN 197-1 · ASTM C150 · EN 13279-1 · EN 12620', 'Mill Test Certificate: Blaine, SO₃, MgO, LOI, C₃A, 2 / 28-day strength', 'TÜV Austria · SGS · BV'],
  [<Link key="f" href="/products/fertilizers" className="egg-link">Fertilizers</Link>, 'Granular / prilled urea 46 % N · DAP 18-46-0 · MAP · NPK · MOP · SOP · sulphur', 'ISO 8633 sampling · EU 2019/1009 · IFA documentation', 'CoA: N / P₂O₅ / K₂O, biuret, moisture, granulometry', 'SGS · Intertek · BV'],
  [<Link key="ch" href="/products/chemicals" className="egg-link">Chemicals</Link>, 'Caustic soda · soda ash · sulphuric acid · methanol · PVC · water-treatment chemicals', 'REACH · CLP SDS · product standards (ASTM / ISO)', 'CoA: assay, impurity profile; SDS; UN packaging', 'SGS · Intertek · BV'],
  [<Link key="m" href="/products/minerals" className="egg-link">Industrial Minerals</Link>, 'Silica sand · kaolin · barite · feldspar · talc · bentonite · iron ore · magnetite', 'ISO 3082 / ISO 12743 sampling · API 13A (barite)', 'CoA: assay (SiO₂, Fe₂O₃, Al₂O₃, BaSO₄, Fe), moisture, sizing, LOI', 'SGS · BV · Intertek'],
  [<Link key="mt" href="/products/metals" className="egg-link">Metals &amp; Alloys</Link>, 'Rebar B500B / ASTM A615 · HRC / CRC · billets · aluminium · copper · ferro-alloys', 'EN 10204 3.1 · EN 10025 · ASTM A615 / A36', 'Mill certificate: chemistry, yield, tensile, elongation; heat-number traceability', 'SGS · BV · TÜV Austria'],
  [<Link key="a" href="/products/agro" className="egg-link">Agro &amp; Food</Link>, 'Citrus · onions · potatoes · garlic · dates · sugar · edible oils · grains · pulses', 'GlobalG.A.P. · EU 2019/2072 · Codex · ISO 22000', 'CoA + phytosanitary certificate: sizing, Brix / dry matter, MRL, pulp temperature log', 'SGS · Intertek · CAPQ'],
]

const CERTS = [
  'ISO 22000', 'EN 197-1', 'HACCP', 'USP / BP',
  'GOEIC', 'TÜV Austria', 'SGS / Intertek', 'ASTM D632', 'EN 16811-1',
]

export default function ProductsHub() {
  return (
    <article className="bg-white text-[#14161a]">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#14161a]/10 px-5 sm:px-8 lg:px-14 pt-14 sm:pt-16 pb-12 sm:pb-14">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        {/* catalogue navigation across all divisions */}
        <HeroMotif variant="compass" tone="#0fb5a5" />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(55% 55% at 88% 0%, rgba(15,181,165,.16), transparent 60%), radial-gradient(40% 45% at 0% 100%, rgba(255,99,33,.08), transparent 60%)' }} />
        <nav className="relative flex items-center gap-2 text-[11px] text-[#8a93a3] mb-8 font-mono uppercase tracking-wider">
          <Link href="/" className="hover:text-[#14161a] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#3f4650]">Products</span>
        </nav>

        <div className="relative max-w-3xl">
          <p className="egg-eyebrow text-[#b8862b] mb-4">
            7 commodity divisions · 60+ destination markets
          </p>
          <h1 className="egg-display text-[clamp(2.2rem,5.5vw,4.4rem)] leading-[1.02] mb-5 text-[#14161a]">
            Egyptian commodities,<br />
            <span className="italic text-[#0b8f84]">certified before they ship.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#3f4650] leading-relaxed mb-8">
            Salt, cement &amp; clinker, fertilizers, chemicals, industrial minerals, agro &amp; food
            and metals — sourced from Egyptian capacity under one QA system and shipped FOB / CIF /
            CFR from 7 Egyptian seaports. Every lot is tested at the port laboratory and released
            on a Certificate of Analysis or Mill Test Certificate before the Bill of Lading; a lot
            outside specification is rejected at the port, never renegotiated.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/rfq"
              className="egg-btn-primary">
              Request a quote →
            </Link>
            <Link href="/services"
              className="text-sm text-[#3f4650] hover:text-[#14161a] transition-colors border-b border-[#14161a]/30 hover:border-[#14161a] pb-0.5">
              Pairing services
            </Link>
          </div>
        </div>
      </section>

      {/* ── Division grid ──────────────────────────────────────────── */}
      <section className="border-b border-[#14161a]/10 egg-reveal">
        <div className="px-5 sm:px-8 lg:px-14 pt-8 pb-2 flex items-center justify-between">
          <p className="egg-eyebrow">Product divisions</p>
        </div>
        <div className="divide-y divide-[#14161a]/10 sm:grid sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3 xl:grid-cols-4">
          {PRODUCT_DIVISIONS.map((div, i) => (
            <Link key={div.id} href={div.path}
              className={[
                'flex items-start gap-4 px-5 sm:px-8 lg:px-10 py-7 hover:bg-[#f9fafb] transition-colors group',
                // On sm+, add dividers between columns
                'sm:border-b sm:border-[#14161a]/10',
                // Right border between columns
                i % 2 === 0 ? 'sm:border-r sm:border-r-[#14161a]/10 lg:border-r' : '',
                i % 3 === 0 ? 'lg:border-r-[#14161a]/10' : '',
                i % 3 === 1 ? 'lg:border-r-[#14161a]/10' : '',
              ].join(' ')}>
              <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl mt-0.5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${div.color}1f`, boxShadow: `inset 0 0 0 1px ${div.color}66` }}>
                <Icon name={DIVISION_ICON[div.id] || 'box'} className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-[#14161a] group-hover:text-[#0b8f84] transition-colors text-[15px] mb-1">
                  {div.label}
                </div>
                <div className="text-sm text-[#7a8290] leading-relaxed line-clamp-2">{div.blurb}</div>
                <div className="mt-2.5 text-xs font-semibold text-[#d9501a]">Browse →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Quality at the Core ──────────────────────────────────── */}
      <QualityStrip />

      {/* ── Division QA matrix ───────────────────────────────────── */}
      <section className="border-b border-[#14161a]/10 egg-reveal">
        <div className="px-5 sm:px-8 lg:px-14 py-10 space-y-6">
          <p className="egg-eyebrow text-[#0b8f84]">Verification by division</p>
          <DataTable
            title="What is tested, to which standard, and what evidence ships with the cargo"
            icon="shield"
            head={['Division', 'Flagship grades', 'Governing standards', 'Per-lot evidence', 'Independent inspection']}
            rows={QA_MATRIX}
            note="Independent pre-shipment inspection is available on every consignment and mandatory for L/C-financed shipments and destination conformity programmes (SASO / SABER, KEBS PVoC, SONCAP, BIS, GACC). Typical cost 0.3–0.5 % of FOB value."
          />
          <QaChainTable />
        </div>
      </section>

      {/* ── Incoterms ──────────────────────────────────────────────── */}
      <section className="border-b border-[#14161a]/10 bg-[#f9fafb] egg-reveal">
        <div className="px-5 sm:px-8 lg:px-14 pt-8 pb-2">
          <p className="egg-eyebrow">Incoterms we quote</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y divide-[#14161a]/10 sm:divide-y-0">
          {INCOTERMS.map((t, i) => (
            <div key={t.term} className={[
              'px-5 sm:px-6 py-6',
              'border-b border-[#14161a]/10',
              // Vertical dividers between columns only on larger screens
              i > 0 ? 'sm:border-l sm:border-l-[#14161a]/10' : '',
              i > 2 ? 'sm:border-t sm:border-t-[#14161a]/10' : '',
            ].join(' ')}>
              <div className="egg-display text-2xl mb-1" style={{ color: '#d9501a' }}>{t.term}</div>
              <div className="text-xs text-[#7a8290] leading-relaxed">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ports ──────────────────────────────────────────────────── */}
      <section className="border-b border-[#14161a]/10 egg-reveal">
        <div className="px-5 sm:px-8 lg:px-14 py-10">
          <p className="egg-eyebrow text-[#0369a1] mb-6">
            Loading ports — 7 Egyptian seaports
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {PORTS.map(p => (
              <div key={p.code} className="egg-card px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm">
                <div className="font-semibold text-[#14161a]">
                  {p.name}
                  <span className="ml-2 text-[10px] font-mono text-[#0369a1]">{p.code}</span>
                </div>
                <div className="text-[11px] text-[#7a8290] mt-0.5">{p.note}</div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-[#8a93a3] font-mono">
            Full vessel charter · 20ft / 40ft HC containers · bulk · min 25 MT per commodity
          </p>
        </div>
      </section>

      {/* ── Certifications ─────────────────────────────────────────── */}
      <section className="border-b border-[#14161a]/10 bg-[#f9fafb] egg-reveal">
        <div className="px-5 sm:px-8 lg:px-14 py-8">
          <p className="egg-eyebrow text-[#b8862b] mb-5">
            Standards &amp; certifications
          </p>
          <div className="flex flex-wrap gap-2">
            {CERTS.map(c => (
              <span key={c}
                className="egg-chip text-xs text-[#3f4650]">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 sm:px-8 lg:px-14 py-16 sm:py-24 bg-white border-b border-[#14161a]/10 egg-reveal">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-50 pointer-events-none" />
        <div aria-hidden="true" className="absolute -bottom-24 right-0 w-80 h-80 rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FF6321 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl">
          <p className="egg-eyebrow text-[#d9501a] mb-8">Get a price</p>
          <h2 className="egg-display text-3xl sm:text-4xl lg:text-5xl mb-4 text-[#14161a]">
            Know your specification. Need a certified price?
          </h2>
          <p className="text-[#3f4650] text-base mb-10 leading-relaxed">
            Submit an RFQ with your commodity, specification, quantity, destination port and preferred
            Incoterm. We respond within 24 hours with a priced offer, a sample Certificate of Analysis,
            the applicable inspection protocol and the L/C document set.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <Link href="/rfq"
              className="egg-btn-primary">
              Submit an RFQ
            </Link>
            <Link href="/services"
              className="text-sm text-[#7a8290] sm:pt-3 hover:text-[#14161a] transition-colors border-b border-[#14161a]/20 hover:border-[#14161a]/60 pb-0.5">
              View pairing services →
            </Link>
          </div>
        </div>
      </section>

    </article>
  )
}
