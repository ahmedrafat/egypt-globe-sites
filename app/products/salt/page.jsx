/**
 * /products/salt — custom salt division landing.
 *
 * Wins over the catch-all `[...path]` route. Renders a Pelot-style
 * hero (light editorial edition), a Sea Salt vs Rock Salt source split,
 * an Applications grid, and the full SKU catalogue at the bottom.
 *
 * Design tokens + utilities (.egg-*) live in app/globals.css.
 * Sea salt = clear turquoise accent, rock salt = deep gold accent.
 */
import Link from 'next/link'
import {
  getPageByPath,
  getSaltCatalogueBySource,
  getSaltApplicationsServed,
  APPLICATIONS,
} from '../../../lib/corporatePages'

// Drop 139c — render on demand (multi-query salt catalogue page)
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Bulk Salt Supplier Egypt — Rock, Sea, De-icing & Industrial NaCl',
  description: 'Bulk Egyptian salt exporter — rock salt (Siwa & Qattara, ≥97% NaCl) and sea salt (North Sinai & Red Sea). De-icing, industrial, chlor-alkali, food, pharma & water-treatment grades — 27 SKUs, 8 grades. FOB / CIF from 7 Egyptian ports, CoA per shipment. Quote in 24h.',
}

const GRADES = [
  { label: 'Bulk De-icing / Road Salt', href: '/products/salt/de-icing-grade', icon: '❄️' },
  { label: 'Industrial / Chlor-Alkali', href: '/products/salt/industrial-grade', icon: '🏭' },
  { label: 'Food Grade Salt', href: '/products/salt/food-grade', icon: '🍽️' },
  { label: 'Pharmaceutical Salt', href: '/products/salt/pharmaceutical-grade', icon: '💊' },
  { label: 'Water Treatment & Pool', href: '/products/salt/pool-grade', icon: '💧' },
  { label: 'Cosmetic & Spa Salt', href: '/products/salt/cosmetic-grade', icon: '🧴' },
  { label: 'Aquaculture Salt', href: '/products/salt/aquaculture-grade', icon: '🐟' },
  { label: 'Agricultural Salt', href: '/products/salt/agricultural-grade', icon: '🌾' },
]

const APPS_BY_ID = Object.fromEntries(APPLICATIONS.map(a => [a.id, a]))

const STATS = [
  { big: '27',  label: 'SKUs in catalogue' },
  { big: '8',   label: 'Quality grades' },
  { big: '7',   label: 'Loading ports' },
  { big: '60+', label: 'Destination markets' },
]

const TEAL = '#0fb5a5'
const TEAL_TEXT = '#0b8f84'
const GOLD = '#b8862b'
const GOLD_TEXT = '#8a6d3b'

export default async function SaltMainPage() {
  const [page, catalogue, servedApps] = await Promise.all([
    getPageByPath('/products/salt'),
    getSaltCatalogueBySource(),
    getSaltApplicationsServed(),
  ])
  const { sea, rock, all } = catalogue
  const apps = servedApps.map(id => APPS_BY_ID[id]).filter(Boolean)

  return (
    <article className="bg-white text-[#14161a]">
      {/* Hero — white editorial banner with turquoise + gold glow ───── */}
      <section className="relative overflow-hidden bg-white border-b border-[#14161a]/10">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(55% 55% at 88% 0%, ${TEAL}2b, transparent 60%), radial-gradient(40% 45% at 0% 100%, ${GOLD}22, transparent 60%)` }} />
        <div aria-hidden="true" className="absolute -right-10 -top-16 text-[260px] leading-none opacity-[0.06] select-none pointer-events-none">🧂</div>
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
              🌊 Sea Salt
            </span>
            <span className="egg-chip text-xs" style={{ color: GOLD_TEXT, boxShadow: `inset 0 0 0 1px ${GOLD}73` }}>
              ⛏️ Rock Salt
            </span>
            <span className="egg-chip text-xs">
              NaCl ≥ 97%
            </span>
            <span className="egg-chip font-mono text-[11px] text-[#5b6472]">
              HS 2501
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h1 className="egg-display text-4xl sm:text-5xl lg:text-6xl text-[#14161a] mb-4 leading-[1.02]">
                Bulk Egyptian salt — sea & rock,<br /><span className="italic text-[#0b8f84]">delivered worldwide.</span>
              </h1>
              <p className="text-base sm:text-lg leading-relaxed max-w-3xl text-[#3f4650]">
                {all.length} SKUs across 8 grades — from food and pharmaceutical to
                de-icing, chlor-alkali, water-treatment and cosmetic. Loaded FOB /
                CIF / CFR from 7 Egyptian ports with per-shipment Certificate of
                Analysis.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Link href="/rfq?product=%2Fproducts%2Fsalt"
                className="egg-btn-primary">
                📋 Get Quote
              </Link>
              <Link href="/applications"
                className="egg-btn-ghost">
                Browse by industry →
              </Link>
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

      {/* Source split — Sea Salt vs Rock Salt ──────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 egg-reveal">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="egg-eyebrow text-[#0b8f84] justify-center mb-3">
            Two Egyptian Sources
          </div>
          <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">
            Sea Salt or Rock Salt — both Egyptian.
          </h2>
          <p className="text-[#3f4650] max-w-3xl mx-auto">
            Egypt's geography uniquely supports both salt types. Pick by application,
            grade and grain size — we ship from the closest loading port.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sea salt card */}
          <div className="egg-card rounded-3xl overflow-hidden animate-fade-in-up">
            <div className="relative overflow-hidden p-7" style={{ background: 'linear-gradient(160deg, #e6fbf8 0%, #c9f3ee 100%)' }}>
              <div aria-hidden="true" className="absolute -right-8 -top-10 text-[180px] leading-none opacity-[0.08] select-none pointer-events-none">🌊</div>
              <div className="relative flex items-center gap-3 mb-3">
                <span className="text-4xl">🌊</span>
                <div>
                  <div className="egg-eyebrow text-[#0b8f84]">Source 1</div>
                  <h3 className="egg-display text-3xl text-[#14161a]">Sea Salt</h3>
                </div>
              </div>
              <p className="relative text-[#3f4650] text-sm leading-relaxed">
                Solar-evaporated from <strong className="text-[#14161a]">North Sinai (El-Arish / Bardawil)</strong>
                {' '}and the <strong className="text-[#14161a]">Red Sea coast</strong>. ~2,700 kWh/m² annual solar
                irradiance for natural mineral-balanced salt with NaCl ≥ 97%.
              </p>
              <div className="relative mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="egg-display text-3xl text-[#0b8f84]">{sea.length}</div>
                  <div className="text-[10px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">SKUs</div>
                </div>
                <div>
                  <div className="egg-display text-3xl text-[#0b8f84]">≥97%</div>
                  <div className="text-[10px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">NaCl</div>
                </div>
                <div>
                  <div className="egg-display text-3xl text-[#0b8f84]">4</div>
                  <div className="text-[10px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">Loading ports</div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="egg-eyebrow mb-3">Loading ports</div>
              <div className="flex flex-wrap gap-2 mb-5">
                {['Al-Arish', 'Port Said East', 'Damietta', 'Ain Sokhna'].map(p => (
                  <span key={p} className="egg-chip text-xs" style={{ color: TEAL_TEXT, boxShadow: `inset 0 0 0 1px ${TEAL}73` }}>
                    ⚓ {p}
                  </span>
                ))}
              </div>
              <div className="egg-eyebrow mb-3">Best for</div>
              <ul className="space-y-1.5 text-sm text-[#3f4650]">
                <li className="flex items-start gap-2"><span className="text-[#0fb5a5] font-bold">›</span> Food processing & table salt</li>
                <li className="flex items-start gap-2"><span className="text-[#0fb5a5] font-bold">›</span> Cosmetic + spa + Dead Sea-style blends</li>
                <li className="flex items-start gap-2"><span className="text-[#0fb5a5] font-bold">›</span> Aquaculture & pool water treatment</li>
                <li className="flex items-start gap-2"><span className="text-[#0fb5a5] font-bold">›</span> Fish curing & food preservation</li>
                <li className="flex items-start gap-2"><span className="text-[#0fb5a5] font-bold">›</span> Pharmaceutical / saline (refined)</li>
              </ul>
              <Link href={`#sea-catalogue`}
                className="egg-link mt-5 inline-flex items-center gap-1 text-sm">
                Browse {sea.length} sea-salt SKUs →
              </Link>
            </div>
          </div>

          {/* Rock salt card */}
          <div className="egg-card rounded-3xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="relative overflow-hidden p-7" style={{ background: 'linear-gradient(160deg, #fbf3e3 0%, #f3e3c0 100%)' }}>
              <div aria-hidden="true" className="absolute -right-8 -top-10 text-[180px] leading-none opacity-[0.08] select-none pointer-events-none">⛏️</div>
              <div className="relative flex items-center gap-3 mb-3">
                <span className="text-4xl">⛏️</span>
                <div>
                  <div className="egg-eyebrow text-[#8a6d3b]">Source 2</div>
                  <h3 className="egg-display text-3xl text-[#14161a]">Rock Salt</h3>
                </div>
              </div>
              <p className="relative text-[#3f4650] text-sm leading-relaxed">
                Mined from <strong className="text-[#14161a]">Siwa Oasis</strong> and the
                {' '}<strong className="text-[#14161a]">Qattara Depression</strong> — ancient halite deposits
                formed 30+ million years ago. Guaranteed minimum 97% NaCl across every grade.
              </p>
              <div className="relative mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="egg-display text-3xl text-[#8a6d3b]">{rock.length || '—'}</div>
                  <div className="text-[10px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">SKUs</div>
                </div>
                <div>
                  <div className="egg-display text-3xl text-[#8a6d3b]">≥97%</div>
                  <div className="text-[10px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">NaCl</div>
                </div>
                <div>
                  <div className="egg-display text-3xl text-[#8a6d3b]">4</div>
                  <div className="text-[10px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">Loading ports</div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="egg-eyebrow mb-3">Loading ports</div>
              <div className="flex flex-wrap gap-2 mb-5">
                {['El Dekheila', 'Alexandria', 'Damietta', 'Ain Sokhna'].map(p => (
                  <span key={p} className="egg-chip text-xs" style={{ color: GOLD_TEXT, boxShadow: `inset 0 0 0 1px ${GOLD}73` }}>
                    ⚓ {p}
                  </span>
                ))}
              </div>
              <div className="egg-eyebrow mb-3">Best for</div>
              <ul className="space-y-1.5 text-sm text-[#3f4650]">
                <li className="flex items-start gap-2"><span className="text-[#b8862b] font-bold">›</span> Industrial salt (chlor-alkali, PVC, water treatment)</li>
                <li className="flex items-start gap-2"><span className="text-[#b8862b] font-bold">›</span> De-icing road salt (EN 16811-1, ASTM, BS, GOST)</li>
                <li className="flex items-start gap-2"><span className="text-[#b8862b] font-bold">›</span> Drilling-mud weighting & oil/gas brines</li>
                <li className="flex items-start gap-2"><span className="text-[#b8862b] font-bold">›</span> Leather tanning + textile dyeing low-iron</li>
                <li className="flex items-start gap-2"><span className="text-[#b8862b] font-bold">›</span> Livestock lick blocks + agricultural soil</li>
              </ul>
              <Link href={`#rock-catalogue`}
                className="egg-link mt-5 inline-flex items-center gap-1 text-sm">
                Browse {rock.length || 'rock'} rock-salt SKUs →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Applications served ──────────────────────────────────── */}
      {apps.length > 0 && (
        <section className="bg-[#f9fafb] py-16 sm:py-20 border-y border-[#14161a]/10 egg-reveal">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-10 animate-fade-in-up">
              <div className="egg-eyebrow text-[#7c3aed] justify-center mb-3">
                Salt by Industry
              </div>
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">
                {apps.length} applications served across our catalogue.
              </h2>
              <p className="text-[#3f4650] max-w-3xl mx-auto">
                Each industry has its own sub-spec, certifications and tender-grade
                requirements — pick yours to see matching SKUs.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
              {apps.map(a => (
                <Link key={a.id} href={a.path}
                  className="egg-card group p-5 text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-3xl mb-3 bg-[#f3f0ff] ring-1 ring-[#7c3aed]/25">
                    {a.icon}
                  </div>
                  <h3 className="font-semibold text-[#14161a] group-hover:text-[#0b8f84] transition-colors text-sm">
                    {a.label}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bulk salt by grade — internal links to the 8 grade hubs ── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 egg-reveal">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="egg-eyebrow text-[#0b8f84] justify-center mb-3">
            Bulk salt by grade
          </div>
          <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">
            Every grade of Egyptian bulk salt
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 stagger-children">
          {GRADES.map(g => (
            <Link key={g.href} href={g.href}
              className="egg-card group px-4 py-4 flex items-center gap-3">
              <span className="text-2xl">{g.icon}</span>
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
              <div className="egg-eyebrow text-[#0b8f84] mb-2">
                🌊 Sea Salt
              </div>
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">
                {sea.length} sea-salt SKUs
              </h2>
            </div>
            <Link href="/rfq" className="egg-link text-sm">
              Quote any combination →
            </Link>
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
                <div className="egg-eyebrow text-[#8a6d3b] mb-2">
                  ⛏️ Rock Salt
                </div>
                <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">
                  {rock.length} rock-salt SKUs
                </h2>
              </div>
              <Link href="/rfq" className="egg-link text-sm">
                Quote any combination →
              </Link>
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
          <div aria-hidden="true" className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-40 pointer-events-none"
            style={{ background: `radial-gradient(circle, ${TEAL} 0%, transparent 70%)` }} />
          <div aria-hidden="true" className="absolute -top-12 -right-12 text-[280px] opacity-[0.06] select-none pointer-events-none">🧂</div>
          <h2 className="egg-display relative text-3xl sm:text-4xl text-[#14161a] mb-3">
            Need a custom salt blend?
          </h2>
          <p className="relative text-[#3f4650] text-lg mb-7 max-w-2xl mx-auto">
            Combine grades, blend grain sizes, match a tender spec — we'll come back
            within 24 hours with a priced FOB / CIF / CFR offer.
          </p>
          <Link href="/rfq?product=%2Fproducts%2Fsalt"
            className="egg-btn-primary relative px-8 py-4">
            📋 Request a Quote
          </Link>
        </div>
      </section>
    </article>
  )
}

/* SKU card — used for both sea and rock catalogues */
function SaltCard({ p, type }) {
  const isSea = type === 'sea'
  return (
    <Link href={p.path}
      className="egg-card group overflow-hidden">
      <div className="aspect-[16/9] overflow-hidden rounded-t-2xl"
        style={{ background: isSea ? 'linear-gradient(135deg, #e6fbf8, #f9fafb)' : 'linear-gradient(135deg, #fbf3e3, #f9fafb)' }}>
        {p.hero_photo_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={p.hero_photo_url} alt={p.title}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">
            {isSea ? '🌊' : '⛏️'}
          </div>
        )}
      </div>
      <div className="p-4">
        {p.hs_code && (
          <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8a93a3] mb-1">HS {p.hs_code}</div>
        )}
        <h3 className="text-sm font-semibold text-[#14161a] line-clamp-2 group-hover:text-[#0b8f84] transition-colors min-h-[2.5em]">
          {p.title}
        </h3>
        {p.specs?.nacl_min && (
          <div className="text-xs font-mono text-[#5b6472] mt-1.5">NaCl {p.specs.nacl_min}</div>
        )}
        {p.applications?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {p.applications.slice(0, 2).map(a => (
              <span key={a} className="text-[10px] font-semibold bg-[#f3f0ff] text-[#6d28d9] ring-1 ring-[#7c3aed]/25 px-2 py-0.5 rounded-full">
                {a.replace(/_/g, ' ')}
              </span>
            ))}
            {p.applications.length > 2 && (
              <span className="text-[10px] text-[#8a93a3]">+{p.applications.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
