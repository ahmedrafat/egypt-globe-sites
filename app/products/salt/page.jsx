/**
 * /products/salt — salt division pillar ("Quality at the Core" edition,
 * 2026-08-23). Wins over the catch-all `[...path]` route.
 *
 * Structure: white editorial hero → stats → Quality strip → two-source
 * split (Siwa Oasis crystalline rock salt vs Sinai sea salt) with the
 * differentiation table → division Logistical & QA table → QA chain →
 * applications served → grade hubs → sea catalogue → rock catalogue → CTA.
 *
 * Every link present before this edition is preserved. Vector protocol:
 * monochrome micro-icons only.
 */
import HeroMotif from '../../../components/HeroMotif'
import Link from 'next/link'
import {
  getPageByPath,
  getSaltCatalogueBySource,
  getSaltApplicationsServed,
  APPLICATIONS,
} from '../../../lib/corporatePages'
import Icon, { APPLICATION_ICON } from '../../../components/ui/Icon'
import QualityStrip from '../../../components/QualityStrip'
import QaChainTable, { DataTable } from '../../../components/QaChainTable'

// Drop 139c — render on demand (multi-query salt catalogue page)
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Bulk Salt Supplier Egypt — Rock, Sea, De-icing & Industrial NaCl',
  description: 'Bulk Egyptian salt exporter — Siwa Oasis crystalline rock salt (≥ 97 % NaCl, chemical, food and pharma grades) and North Sinai / Red Sea sea salt (industrial and de-icing scale). Per-lot CoA before B/L, TÜV Austria / SGS / Intertek inspection, FOB / CIF / CFR from 7 Egyptian ports. 8 grades, 100+ SKUs. Quote in 24h.',
}

const GRADES = [
  { label: 'Bulk De-icing / Road Salt', href: '/products/salt/de-icing-grade', icon: 'snow' },
  { label: 'Industrial / Chlor-Alkali', href: '/products/salt/industrial-grade', icon: 'factory' },
  { label: 'Food Grade Salt', href: '/products/salt/food-grade', icon: 'leaf' },
  { label: 'Pharmaceutical Salt', href: '/products/salt/pharmaceutical-grade', icon: 'pill' },
  { label: 'Water Treatment & Pool', href: '/products/salt/pool-grade', icon: 'drop' },
  { label: 'Cosmetic & Spa Salt', href: '/products/salt/cosmetic-grade', icon: 'sparkle' },
  { label: 'Aquaculture Salt', href: '/products/salt/aquaculture-grade', icon: 'wave' },
  { label: 'Agricultural Salt', href: '/products/salt/agricultural-grade', icon: 'wheat' },
]

const APPS_BY_ID = Object.fromEntries(APPLICATIONS.map(a => [a.id, a]))

const TEAL = '#0fb5a5'
const TEAL_TEXT = '#0b8f84'
const GOLD = '#b8862b'
const GOLD_TEXT = '#8a6d3b'

// Siwa Oasis crystalline rock salt vs Sinai sea salt — the differentiation
// buyers tender against. Values are contractual limits from the SKU catalogue.
const COMPARE = [
  ['Source',               'Siwa Oasis & Qattara Depression halite beds (mined)', 'North Sinai (Bardawil lagoon, El-Arish) & Red Sea pans at Ain Sokhna (solar-evaporated)'],
  ['NaCl, dry basis',      '≥ 97.00 % guaranteed on every grade; ≥ 99.5 % double-washed / vacuum for pharma', 'Raw 94–97 % · washed 97.5–98 % · double-washed ≥ 99 %'],
  ['Ca²⁺ / Mg²⁺ / SO₄²⁻',  '≤ 0.40 % / ≤ 0.40 % / ≤ 0.80 %', '≤ 0.40 % / ≤ 0.40 % / ≤ 0.80 % (washed); higher on raw industrial'],
  ['Water insolubles',     '≤ 0.50 %', '≤ 0.50 % washed · ≤ 1.0 % raw'],
  ['Moisture',             '≤ 1.5 % natural · ≤ 0.5 % kiln-dried (0.25 % on request)', 'Type 1 kiln-dried ≤ 1.5 % · Type 2 natural 3–4 %'],
  ['Sieve profiles',       '0/2 · 0/4 · 0/6.3 · 2/8 · 10/40 mm (ISO 13320 / sieve, per lot)', '0/2 · 0/4 · 0/6.3 · 2/8 · 0.5/10 mm (per lot)'],
  ['Governing standards',  'EN 16811-1 Grades A/B/C · ASTM D632 · BS 3247 · GOST 13830 · Codex STAN 150 · USP / BP / EP', 'EN 16811-1 Type 1 / Type 2 · ASTM D632 / AASHTO M-143 · SS-EN 16811-1 · NSF/ANSI 60 · ISO 22000'],
  ['Primary grades',       'Food · pharmaceutical · cosmetic · chlor-alkali · drilling · de-icing', 'De-icing · industrial · water treatment · pool · aquaculture · agricultural'],
  ['Loading ports',        'El Dekheila (EGEDK) · Alexandria (EGALY) · Damietta (EGDAM) · Ain Sokhna (EGSOK)', 'Al-Arish (EGEAR) · Port Said East (EGPSE) · Damietta (EGDAM) · Ain Sokhna (EGSOK)'],
  ['Source-to-berth',      '< 12 hours by road', '< 12 hours by road'],
]

const LOGISTICS = [
  ['MOQ — containerised (FCL)',      '240 MT (10 × 20′ FCL, ~24 MT per box) · 25 MT trial lots for food, pharma and cosmetic grades'],
  ['MOQ — break-bulk vessel',        '2,000 MT Handysize part-cargo · up to 65,000 MT Panamax; annual offtake contracts available'],
  ['Packing',                        'Loose bulk · 1 / 1.25 / 1.5 MT FIBC (PE liner for food, pharma and kiln-dried grades) · 50 kg / 25 kg PP, PE or kraft bags · bag-in-jumbo for bulk vessels · OEM print'],
  ['Incoterms',                      'FOB · CFR · CIF (DAP / DDP on request)'],
  ['Lead time',                      '1–2 weeks from L/C or advance for stock grades; 3–4 weeks for kiln-dried or custom gradings'],
  ['Independent inspection protocol','TÜV Austria (EU / GCC) · SGS · Intertek (ASTM / BS) · Bureau Veritas — pre-shipment sampling per ISO 2479 / EN 16811-1 Annex B, NaCl, moisture and sieve witness tests, draft survey on bulk vessels, sealed retained samples held 90 days'],
  ['Internal QA gate',               'Mine-site or saltworks lab on every production lot; port laboratory re-test (NaCl, Ca, Mg, SO₄, insolubles, moisture, sieve) on every shipment; Certificate of Analysis issued before the Bill of Lading; any out-of-spec lot rejected at the port'],
  ['Documents',                      'Commercial Invoice · Packing List · B/L · Certificate of Origin (EUR.1 / PAFTA / COMESA / AfCFTA) · CoA · Halal / ISO 22000 certificates for food grades · SDS'],
  ['HS code',                        '2501.00 (2501.00.91 food / 2501.00.99 industrial per destination tariff)'],
]

export default async function SaltMainPage() {
  const [page, catalogue, servedApps] = await Promise.all([
    getPageByPath('/products/salt'),
    getSaltCatalogueBySource(),
    getSaltApplicationsServed(),
  ])
  const { sea, rock, all } = catalogue
  const apps = servedApps.map(id => APPS_BY_ID[id]).filter(Boolean)

  const STATS = [
    { big: String(all.length),  label: 'SKUs in catalogue' },
    { big: '8',   label: 'Quality grades' },
    { big: '7',   label: 'Loading ports' },
    { big: '100%', label: 'Lots CoA-verified before B/L' },
  ]

  return (
    <article className="bg-white text-[#14161a]">
      {/* Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white border-b border-[#14161a]/10">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        {/* halite is cubic — the crystal habit of salt */}
        <HeroMotif variant="lattice" tone="#0fb5a5" />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(55% 55% at 88% 0%, ${TEAL}2b, transparent 60%), radial-gradient(40% 45% at 0% 100%, ${GOLD}22, transparent 60%)` }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-24">
          <nav className="flex items-center gap-2 text-xs text-[#7a8290] mb-5 flex-wrap animate-fade-in">
            <Link href="/" className="hover:text-[#14161a] transition-colors">Home</Link>
            <span>›</span>
            <Link href="/products" className="hover:text-[#14161a] transition-colors">Products</Link>
            <span>›</span>
            <span className="text-[#14161a] font-medium">Salt</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in-up">
            <span className="egg-chip text-xs" style={{ color: TEAL_TEXT, boxShadow: `inset 0 0 0 1px ${TEAL}80` }}>
              <Icon name="wave" className="w-3.5 h-3.5" /> Sea Salt
            </span>
            <span className="egg-chip text-xs" style={{ color: GOLD_TEXT, boxShadow: `inset 0 0 0 1px ${GOLD}73` }}>
              <Icon name="pickaxe" className="w-3.5 h-3.5" /> Rock Salt
            </span>
            <span className="egg-chip text-xs">NaCl ≥ 97%</span>
            <span className="egg-chip font-mono text-[11px] text-[#5b6472]">HS 2501</span>
            <span className="egg-chip text-xs text-[#0b8f84]" style={{ boxShadow: 'inset 0 0 0 1px rgba(15,181,165,.45)' }}>
              <Icon name="shield" className="w-3.5 h-3.5" /> Per-lot CoA
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h1 className="egg-display text-4xl sm:text-5xl lg:text-6xl text-[#14161a] mb-4 leading-[1.02]">
                Bulk Egyptian salt — sea &amp; rock,<br /><span className="italic text-[#0b8f84]">certified lot by lot.</span>
              </h1>
              <p className="text-base sm:text-lg leading-relaxed max-w-3xl text-[#3f4650]">
                {all.length} SKUs across 8 grades from two verified Egyptian sources: Siwa Oasis crystalline
                rock salt for chemical, food and pharmaceutical purity, and North Sinai sea salt at industrial
                and de-icing scale. Every lot is laboratory-tested at source and again at the port of loading,
                and ships FOB / CIF / CFR from 7 Egyptian ports with a Certificate of Analysis issued before
                the Bill of Lading.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Link href="/rfq?product=%2Fproducts%2Fsalt" className="egg-btn-primary">Get Quote</Link>
              <Link href="/applications" className="egg-btn-ghost">Browse by industry →</Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden ring-1 ring-[#14161a]/10 bg-[#14161a]/10 stagger-children">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/90 backdrop-blur px-5 py-5">
                <div className="egg-display text-3xl sm:text-4xl tracking-tight text-[#0b8f84]">{s.big}</div>
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#7a8290] mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality at the Core ───────────────────────────────────── */}
      <QualityStrip division="Salt" />

      {/* Source split — Siwa rock vs Sinai sea ───────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 egg-reveal">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="egg-eyebrow text-[#0b8f84] justify-center mb-3">Two Egyptian sources</div>
          <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">
            Siwa Oasis crystalline rock salt or Sinai sea salt — specified, not assumed.
          </h2>
          <p className="text-[#3f4650] max-w-3xl mx-auto">
            Egypt&rsquo;s geography supports both salt types. The two are not interchangeable: rock salt carries
            the purity floor for chemical, food and pharmaceutical use; sea salt carries the volume for
            de-icing, industrial and water-treatment tenders. Pick by application, grade and sieve profile —
            we load from the closest port and certify the lot either way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sea salt card */}
          <div className="egg-card rounded-3xl overflow-hidden animate-fade-in-up">
            <div className="relative overflow-hidden p-7" style={{ background: 'linear-gradient(160deg, #e6fbf8 0%, #c9f3ee 100%)' }}>
              <div className="relative flex items-center gap-3 mb-3">
                <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-white/70 ring-1 ring-[#0fb5a5]/40 text-[#0b8f84]"><Icon name="wave" className="w-5 h-5" /></span>
                <div>
                  <div className="egg-eyebrow text-[#0b8f84]">Source 1 · industrial &amp; de-icing scale</div>
                  <h3 className="egg-display text-3xl text-[#14161a]">Sinai Sea Salt</h3>
                </div>
              </div>
              <p className="relative text-[#3f4650] text-sm leading-relaxed">
                Solar-evaporated from <strong className="text-[#14161a]">North Sinai (El-Arish / Bardawil)</strong>
                {' '}and the <strong className="text-[#14161a]">Red Sea coast</strong> at Ain Sokhna. ~2,700 kWh/m² annual
                irradiance delivers raw 94–97 % NaCl, washed 97.5–98 % and double-washed ≥ 99 %, screened per lot
                to EN 16811-1 Type 1 / Type 2, ASTM D632 and BS 3247 gradings with moisture held to the tender
                tolerance (kiln-dried ≤ 1.5 %, natural 3–4 %).
              </p>
              <div className="relative mt-4 grid grid-cols-3 gap-2 text-center">
                <div><div className="egg-display text-3xl text-[#0b8f84]">{sea.length}</div><div className="text-[10px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">SKUs</div></div>
                <div><div className="egg-display text-3xl text-[#0b8f84]">94–99+%</div><div className="text-[10px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">NaCl tiers</div></div>
                <div><div className="egg-display text-3xl text-[#0b8f84]">4</div><div className="text-[10px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">Loading ports</div></div>
              </div>
            </div>
            <div className="p-6">
              <div className="egg-eyebrow mb-3">Loading ports</div>
              <div className="flex flex-wrap gap-2 mb-5">
                {['Al-Arish', 'Port Said East', 'Damietta', 'Ain Sokhna'].map(p => (
                  <span key={p} className="egg-chip text-xs" style={{ color: TEAL_TEXT, boxShadow: `inset 0 0 0 1px ${TEAL}73` }}>
                    <Icon name="anchor" className="w-3 h-3" /> {p}
                  </span>
                ))}
              </div>
              <div className="egg-eyebrow mb-3">Best for</div>
              <ul className="space-y-1.5 text-sm text-[#3f4650]">
                <li className="flex items-start gap-2"><span className="text-[#0fb5a5] font-bold">›</span> De-icing and road salt — EN 16811-1 Type 1 / 2, ASTM D632, BS 3247, SS-EN, GOST</li>
                <li className="flex items-start gap-2"><span className="text-[#0fb5a5] font-bold">›</span> Industrial bulk — chlor-alkali feed, water softening, ion exchange</li>
                <li className="flex items-start gap-2"><span className="text-[#0fb5a5] font-bold">›</span> Pool and water-treatment salt (NSF/ANSI 60)</li>
                <li className="flex items-start gap-2"><span className="text-[#0fb5a5] font-bold">›</span> Aquaculture and fish curing / food preservation</li>
                <li className="flex items-start gap-2"><span className="text-[#0fb5a5] font-bold">›</span> Food-grade washed sea salt (ISO 22000 / HACCP / Halal)</li>
              </ul>
              <Link href="#sea-catalogue" className="egg-link mt-5 inline-flex items-center gap-1 text-sm">Browse {sea.length} sea-salt SKUs →</Link>
            </div>
          </div>

          {/* Rock salt card */}
          <div className="egg-card rounded-3xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative overflow-hidden p-7" style={{ background: 'linear-gradient(160deg, #fbf3e3 0%, #f3e3c0 100%)' }}>
              <div className="relative flex items-center gap-3 mb-3">
                <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-white/70 ring-1 ring-[#b8862b]/40 text-[#8a6d3b]"><Icon name="pickaxe" className="w-5 h-5" /></span>
                <div>
                  <div className="egg-eyebrow text-[#8a6d3b]">Source 2 · high-purity chemical grades</div>
                  <h3 className="egg-display text-3xl text-[#14161a]">Siwa Oasis Crystalline Rock Salt</h3>
                </div>
              </div>
              <p className="relative text-[#3f4650] text-sm leading-relaxed">
                Mined from <strong className="text-[#14161a]">Siwa Oasis</strong> and the
                {' '}<strong className="text-[#14161a]">Qattara Depression</strong> — halite deposits formed 30+ million
                years ago, free of marine contaminants. Guaranteed minimum 97.00 % NaCl on every grade with calcium
                and magnesium each ≤ 0.40 %, sulphate ≤ 0.80 % and insolubles ≤ 0.50 %, tested at the mine-site
                laboratory on every production lot and re-tested at the port.
              </p>
              <div className="relative mt-4 grid grid-cols-3 gap-2 text-center">
                <div><div className="egg-display text-3xl text-[#8a6d3b]">{rock.length || '—'}</div><div className="text-[10px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">SKUs</div></div>
                <div><div className="egg-display text-3xl text-[#8a6d3b]">≥97%</div><div className="text-[10px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">NaCl floor</div></div>
                <div><div className="egg-display text-3xl text-[#8a6d3b]">4</div><div className="text-[10px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">Loading ports</div></div>
              </div>
            </div>
            <div className="p-6">
              <div className="egg-eyebrow mb-3">Loading ports</div>
              <div className="flex flex-wrap gap-2 mb-5">
                {['El Dekheila', 'Alexandria', 'Damietta', 'Ain Sokhna'].map(p => (
                  <span key={p} className="egg-chip text-xs" style={{ color: GOLD_TEXT, boxShadow: `inset 0 0 0 1px ${GOLD}73` }}>
                    <Icon name="anchor" className="w-3 h-3" /> {p}
                  </span>
                ))}
              </div>
              <div className="egg-eyebrow mb-3">Best for</div>
              <ul className="space-y-1.5 text-sm text-[#3f4650]">
                <li className="flex items-start gap-2"><span className="text-[#b8862b] font-bold">›</span> Chlor-alkali, PVC and soda-ash feedstock — low Ca / Mg / SO₄</li>
                <li className="flex items-start gap-2"><span className="text-[#b8862b] font-bold">›</span> Food-grade and pharmaceutical NaCl (USP / BP / EP after refining)</li>
                <li className="flex items-start gap-2"><span className="text-[#b8862b] font-bold">›</span> De-icing road salt to EN 16811-1 Grade A / B / C, ASTM D632, BS 3247, GOST 13830</li>
                <li className="flex items-start gap-2"><span className="text-[#b8862b] font-bold">›</span> Drilling-mud weighting, oil &amp; gas completion brines</li>
                <li className="flex items-start gap-2"><span className="text-[#b8862b] font-bold">›</span> Leather tanning, textile dyeing (low iron) and livestock lick blocks</li>
              </ul>
              <Link href="#rock-catalogue" className="egg-link mt-5 inline-flex items-center gap-1 text-sm">Browse {rock.length || 'rock'} rock-salt SKUs →</Link>
            </div>
          </div>
        </div>

        {/* Differentiation table */}
        <div className="mt-10 space-y-6">
          <DataTable
            title="Siwa Oasis rock salt vs Sinai sea salt — tender reference"
            icon="layers"
            head={['Parameter', 'Siwa Oasis crystalline rock salt', 'Sinai / Red Sea sea salt']}
            rows={COMPARE}
            note="Contractual limits verified per lot. Grade-specific limits (heavy metals, pH, anti-caking) are on each grade hub and SKU page."
          />
          <DataTable
            title="Logistical & QA parameters — salt division"
            icon="anchor"
            head={['Parameter', 'Detail']}
            rows={LOGISTICS}
          />
          <QaChainTable
            note="Retained samples are sealed at gate 4 and held for 90 days to arbitrate any variance at gate 5. Specification is guaranteed at the port of loading and binding under the sales contract."
          />
        </div>
      </section>

      {/* Applications served ──────────────────────────────────── */}
      {apps.length > 0 && (
        <section className="bg-[#f9fafb] py-16 sm:py-20 border-y border-[#14161a]/10 egg-reveal">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-10 animate-fade-in-up">
              <div className="egg-eyebrow text-[#7c3aed] justify-center mb-3">Salt by industry</div>
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">
                {apps.length} applications served across our catalogue.
              </h2>
              <p className="text-[#3f4650] max-w-3xl mx-auto">
                Each industry has its own sub-specification, certifications and tender-grade requirements —
                select yours to see the matching SKUs and the QA evidence issued with them.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
              {apps.map(a => (
                <Link key={a.id} href={a.path} className="egg-card group p-5 text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 ring-1 ring-[#14161a]/15 text-[#14161a] group-hover:ring-[#7c3aed]/60 transition-colors">
                    <Icon name={APPLICATION_ICON[a.id] || 'factory'} className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-[#14161a] group-hover:text-[#0b8f84] transition-colors text-sm">{a.label}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bulk salt by grade — internal links to the 8 grade hubs ── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 egg-reveal">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="egg-eyebrow text-[#0b8f84] justify-center mb-3">Bulk salt by grade</div>
          <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">Every grade of Egyptian bulk salt</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 stagger-children">
          {GRADES.map(g => (
            <Link key={g.href} href={g.href} className="egg-card group px-4 py-4 flex items-center gap-3">
              <span className="inline-flex w-9 h-9 items-center justify-center rounded-lg ring-1 ring-[#14161a]/15 text-[#14161a]"><Icon name={g.icon} className="w-4 h-4" /></span>
              <span className="font-semibold text-sm text-[#14161a] group-hover:text-[#0b8f84] transition-colors">{g.label}</span>
            </Link>
          ))}
        </div>
        <p className="text-center text-sm text-[#7a8290] mt-6">
          For grades, standards and lane economics see the full{' '}
          <Link href="/markets/industrial-salt-egypt" className="egg-link">industrial salt supplier guide</Link>.
        </p>
      </section>

      {/* Sea salt catalogue ──────────────────────────────────── */}
      {sea.length > 0 && (
        <section id="sea-catalogue" className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 scroll-mt-20 egg-reveal">
          <div className="flex items-end justify-between gap-4 mb-8 flex-wrap animate-fade-in-up">
            <div>
              <div className="egg-eyebrow text-[#0b8f84] mb-2"><Icon name="wave" className="w-3.5 h-3.5" /> Sea Salt</div>
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">{sea.length} sea-salt SKUs</h2>
            </div>
            <Link href="/rfq" className="egg-link text-sm">Quote any combination →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
            {sea.map(p => <SaltCard key={p.id} p={p} type="sea" />)}
          </div>
        </section>
      )}

      {/* Rock salt catalogue ─────────────────────────────────── */}
      {rock.length > 0 && (
        <section id="rock-catalogue" className="bg-[#f9fafb] py-16 border-y border-[#14161a]/10 scroll-mt-20 egg-reveal">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-8 flex-wrap animate-fade-in-up">
              <div>
                <div className="egg-eyebrow text-[#8a6d3b] mb-2"><Icon name="pickaxe" className="w-3.5 h-3.5" /> Rock Salt</div>
                <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">{rock.length} rock-salt SKUs</h2>
              </div>
              <Link href="/rfq" className="egg-link text-sm">Quote any combination →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
              {rock.map(p => <SaltCard key={p.id} p={p} type="rock" />)}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 egg-reveal">
        <div className="egg-panel p-10 sm:p-14 text-center relative overflow-hidden animate-scale-in">
          <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-60 pointer-events-none" />
          <h2 className="egg-display relative text-3xl sm:text-4xl text-[#14161a] mb-3">Need a tender match or a custom blend?</h2>
          <p className="relative text-[#3f4650] text-lg mb-7 max-w-2xl mx-auto">
            Send the standard, sieve profile, moisture tolerance and tonnage — a priced FOB / CIF / CFR offer with
            a sample Certificate of Analysis and the inspection protocol comes back within 24 hours.
          </p>
          <Link href="/rfq?product=%2Fproducts%2Fsalt" className="egg-btn-primary relative px-8 py-4">Request a Quote</Link>
        </div>
      </section>
    </article>
  )
}

/* SKU card — used for both sea and rock catalogues */
function SaltCard({ p, type }) {
  const isSea = type === 'sea'
  return (
    <Link href={p.path} className="egg-card group overflow-hidden">
      <div className="aspect-[16/9] overflow-hidden rounded-t-2xl"
        style={{ background: isSea ? 'linear-gradient(135deg, #e6fbf8, #f9fafb)' : 'linear-gradient(135deg, #fbf3e3, #f9fafb)' }}>
        {p.hero_photo_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={p.hero_photo_url} alt={p.title}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#14161a]/20"><Icon name={isSea ? 'wave' : 'pickaxe'} className="w-10 h-10" strokeWidth={1.25} /></div>
        )}
      </div>
      <div className="p-4">
        {p.hs_code && <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8a93a3] mb-1">HS {p.hs_code}</div>}
        <h3 className="text-sm font-semibold text-[#14161a] line-clamp-2 group-hover:text-[#0b8f84] transition-colors min-h-[2.5em]">{p.title}</h3>
        {p.specs?.nacl_min && <div className="text-xs font-mono text-[#5b6472] mt-1.5">NaCl {p.specs.nacl_min}</div>}
        {p.applications?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {p.applications.slice(0, 2).map(a => (
              <span key={a} className="text-[10px] font-semibold bg-[#f3f0ff] text-[#6d28d9] ring-1 ring-[#7c3aed]/25 px-2 py-0.5 rounded-full">{a.replace(/_/g, ' ')}</span>
            ))}
            {p.applications.length > 2 && <span className="text-[10px] text-[#8a93a3]">+{p.applications.length - 2}</span>}
          </div>
        )}
      </div>
    </Link>
  )
}
