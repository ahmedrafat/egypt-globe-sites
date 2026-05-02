/**
 * /products/salt — custom salt division landing.
 *
 * Wins over the catch-all `[...path]` route. Renders a Pelot-style
 * hero, a Sea Salt vs Rock Salt source split, an Applications grid,
 * and the full SKU catalogue at the bottom.
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
  title: 'Salt — Sea & Rock from Egypt',
  description: 'Egyptian sea salt and rock salt — 27 SKUs across 8 grades from food and pharma to de-icing and chlor-alkali. NaCl ≥ 97%. FOB / CIF from 7 Egyptian ports.',
}

const APPS_BY_ID = Object.fromEntries(APPLICATIONS.map(a => [a.id, a]))

const STATS = [
  { big: '27',  label: 'SKUs in catalogue' },
  { big: '8',   label: 'Quality grades' },
  { big: '7',   label: 'Loading ports' },
  { big: '60+', label: 'Destination markets' },
]

export default async function SaltMainPage() {
  const [page, catalogue, servedApps] = await Promise.all([
    getPageByPath('/products/salt'),
    getSaltCatalogueBySource(),
    getSaltApplicationsServed(),
  ])
  const { sea, rock, all } = catalogue
  const apps = servedApps.map(id => APPS_BY_ID[id]).filter(Boolean)

  return (
    <article>
      {/* Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-700 via-blue-800 to-[#0f1f3a]">
        <div aria-hidden="true" className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.4) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-32 -left-24 w-[500px] h-[500px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,99,33,0.25) 0%, transparent 70%)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-24">
          <nav className="flex items-center gap-2 text-xs text-white/50 mb-5 flex-wrap animate-fade-in">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <Link href="/products" className="hover:text-white">Products</Link>
            <span>›</span>
            <span className="text-white/80">Salt</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in-up">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-cyan-500/30 text-cyan-50 border border-cyan-400/30">
              🌊 Sea Salt
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-stone-600/40 text-stone-100 border border-stone-400/30">
              ⛏️ Rock Salt
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20">
              NaCl ≥ 97%
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-white/10 text-white/90 border border-white/15">
              HS 2501
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 leading-[1.05] drop-shadow-sm">
                Egyptian salt — sea & rock,<br />delivered worldwide.
              </h1>
              <p className="text-base sm:text-lg leading-relaxed max-w-3xl text-white/80">
                {all.length} SKUs across 8 grades — from food and pharmaceutical to
                de-icing, chlor-alkali, water-treatment and cosmetic. Loaded FOB /
                CIF / CFR from 7 Egyptian ports with per-shipment Certificate of
                Analysis.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Link href="/rfq?product=%2Fproducts%2Fsalt"
                className="inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5">
                📋 Get Quote
              </Link>
              <Link href="/applications"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold border border-white/20 px-5 py-3 rounded-xl transition-colors">
                Browse by industry →
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 stagger-children">
            {STATS.map(s => (
              <div key={s.label} className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 px-5 py-5">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{s.big}</div>
                <div className="text-xs text-cyan-200 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Source split — Sea Salt vs Rock Salt ──────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-block bg-blue-50 text-[#1d5fa1] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Two Egyptian Sources
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            Sea Salt or Rock Salt — both Egyptian.
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto">
            Egypt's geography uniquely supports both salt types. Pick by application,
            grade and grain size — we ship from the closest loading port.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sea salt card */}
          <div className="rounded-3xl overflow-hidden border border-cyan-100 bg-gradient-to-br from-cyan-50 via-blue-50/40 to-white card-lift animate-fade-in-up">
            <div className="bg-gradient-to-br from-cyan-700 to-blue-900 text-white p-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">🌊</span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-cyan-200 font-bold">Source 1</div>
                  <h3 className="text-2xl font-bold">Sea Salt</h3>
                </div>
              </div>
              <p className="text-cyan-100 text-sm leading-relaxed">
                Solar-evaporated from <strong className="text-white">North Sinai (El-Arish / Bardawil)</strong>
                {' '}and the <strong className="text-white">Red Sea coast</strong>. ~2,700 kWh/m² annual solar
                irradiance for natural mineral-balanced salt with NaCl ≥ 97%.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-2xl font-extrabold">{sea.length}</div>
                  <div className="text-[10px] text-cyan-200 uppercase">SKUs</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold">≥97%</div>
                  <div className="text-[10px] text-cyan-200 uppercase">NaCl</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold">4</div>
                  <div className="text-[10px] text-cyan-200 uppercase">Loading ports</div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Loading ports</div>
              <div className="flex flex-wrap gap-2 mb-5">
                {['Al-Arish', 'Port Said East', 'Damietta', 'Ain Sokhna'].map(p => (
                  <span key={p} className="text-xs font-semibold bg-white text-cyan-800 border border-cyan-200 px-3 py-1.5 rounded-full">
                    ⚓ {p}
                  </span>
                ))}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Best for</div>
              <ul className="space-y-1.5 text-sm text-slate-700">
                <li className="flex items-start gap-2"><span className="text-cyan-600 font-bold">›</span> Food processing & table salt</li>
                <li className="flex items-start gap-2"><span className="text-cyan-600 font-bold">›</span> Cosmetic + spa + Dead Sea-style blends</li>
                <li className="flex items-start gap-2"><span className="text-cyan-600 font-bold">›</span> Aquaculture & pool water treatment</li>
                <li className="flex items-start gap-2"><span className="text-cyan-600 font-bold">›</span> Fish curing & food preservation</li>
                <li className="flex items-start gap-2"><span className="text-cyan-600 font-bold">›</span> Pharmaceutical / saline (refined)</li>
              </ul>
              <Link href={`#sea-catalogue`}
                className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-cyan-700 hover:text-cyan-900">
                Browse {sea.length} sea-salt SKUs →
              </Link>
            </div>
          </div>

          {/* Rock salt card */}
          <div className="rounded-3xl overflow-hidden border border-stone-200 bg-gradient-to-br from-stone-50 via-amber-50/40 to-white card-lift animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-gradient-to-br from-stone-700 to-stone-900 text-white p-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">⛏️</span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-stone-300 font-bold">Source 2</div>
                  <h3 className="text-2xl font-bold">Rock Salt</h3>
                </div>
              </div>
              <p className="text-stone-200 text-sm leading-relaxed">
                Mined from <strong className="text-white">Siwa Oasis</strong> and the
                {' '}<strong className="text-white">Qattara Depression</strong> — ancient halite deposits
                formed 30+ million years ago. Guaranteed minimum 97% NaCl across every grade.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-2xl font-extrabold">{rock.length || '—'}</div>
                  <div className="text-[10px] text-stone-300 uppercase">SKUs</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold">≥97%</div>
                  <div className="text-[10px] text-stone-300 uppercase">NaCl</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold">4</div>
                  <div className="text-[10px] text-stone-300 uppercase">Loading ports</div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Loading ports</div>
              <div className="flex flex-wrap gap-2 mb-5">
                {['El Dekheila', 'Alexandria', 'Damietta', 'Ain Sokhna'].map(p => (
                  <span key={p} className="text-xs font-semibold bg-white text-stone-800 border border-stone-200 px-3 py-1.5 rounded-full">
                    ⚓ {p}
                  </span>
                ))}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Best for</div>
              <ul className="space-y-1.5 text-sm text-slate-700">
                <li className="flex items-start gap-2"><span className="text-stone-600 font-bold">›</span> Industrial salt (chlor-alkali, PVC, water treatment)</li>
                <li className="flex items-start gap-2"><span className="text-stone-600 font-bold">›</span> De-icing road salt (EN 16811-1, ASTM, BS, GOST)</li>
                <li className="flex items-start gap-2"><span className="text-stone-600 font-bold">›</span> Drilling-mud weighting & oil/gas brines</li>
                <li className="flex items-start gap-2"><span className="text-stone-600 font-bold">›</span> Leather tanning + textile dyeing low-iron</li>
                <li className="flex items-start gap-2"><span className="text-stone-600 font-bold">›</span> Livestock lick blocks + agricultural soil</li>
              </ul>
              <Link href={`#rock-catalogue`}
                className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-stone-700 hover:text-stone-900">
                Browse {rock.length || 'rock'} rock-salt SKUs →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Applications served ──────────────────────────────────── */}
      {apps.length > 0 && (
        <section className="bg-gradient-to-br from-violet-50/50 via-white to-blue-50/50 py-16 sm:py-20 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-10 animate-fade-in-up">
              <div className="inline-block bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                Salt by Industry
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                {apps.length} applications served across our catalogue.
              </h2>
              <p className="text-slate-600 max-w-3xl mx-auto">
                Each industry has its own sub-spec, certifications and tender-grade
                requirements — pick yours to see matching SKUs.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 stagger-children">
              {apps.map(a => (
                <Link key={a.id} href={a.path}
                  className="card-lift group rounded-2xl border border-slate-200 bg-white p-5 text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl flex items-center justify-center text-3xl mb-3 bg-gradient-to-br from-violet-100 to-blue-100">
                    {a.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-[#1d5fa1] transition-colors text-sm">
                    {a.label}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sea salt catalogue ──────────────────────────────────── */}
      {sea.length > 0 && (
        <section id="sea-catalogue" className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 scroll-mt-20">
          <div className="flex items-end justify-between gap-4 mb-8 flex-wrap animate-fade-in-up">
            <div>
              <div className="inline-block bg-cyan-50 text-cyan-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                🌊 Sea Salt
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {sea.length} sea-salt SKUs
              </h2>
            </div>
            <Link href="/rfq" className="text-sm font-semibold text-[#1d5fa1] hover:underline">
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
        <section id="rock-catalogue" className="bg-stone-50/60 py-16 border-y border-stone-200 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between gap-4 mb-8 flex-wrap animate-fade-in-up">
              <div>
                <div className="inline-block bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                  ⛏️ Rock Salt
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {rock.length} rock-salt SKUs
                </h2>
              </div>
              <Link href="/rfq" className="text-sm font-semibold text-stone-700 hover:underline">
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
      <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-[#1d5fa1] to-[#14467a] p-10 sm:p-14 text-center relative overflow-hidden shadow-2xl shadow-blue-900/15 animate-scale-in">
          <div aria-hidden="true" className="absolute -top-12 -right-12 text-[280px] opacity-10 select-none">🧂</div>
          <h2 className="relative text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Need a custom salt blend?
          </h2>
          <p className="relative text-blue-100 text-lg mb-7 max-w-2xl mx-auto">
            Combine grades, blend grain sizes, match a tender spec — we'll come back
            within 24 hours with a priced FOB / CIF / CFR offer.
          </p>
          <Link href="/rfq?product=%2Fproducts%2Fsalt"
            className="relative inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5">
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
      className="card-lift group rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className={`aspect-[16/9] overflow-hidden ${isSea ? 'bg-gradient-to-br from-cyan-50 to-blue-50' : 'bg-gradient-to-br from-stone-100 to-amber-50'}`}>
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
          <div className="text-[10px] font-mono uppercase font-bold text-slate-400 mb-1">HS {p.hs_code}</div>
        )}
        <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-[#1d5fa1] transition-colors min-h-[2.5em]">
          {p.title}
        </h3>
        {p.specs?.nacl_min && (
          <div className="text-xs font-mono text-slate-500 mt-1.5">NaCl {p.specs.nacl_min}</div>
        )}
        {p.applications?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {p.applications.slice(0, 2).map(a => (
              <span key={a} className="text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-100 px-2 py-0.5 rounded-full">
                {a.replace(/_/g, ' ')}
              </span>
            ))}
            {p.applications.length > 2 && (
              <span className="text-[10px] text-slate-400">+{p.applications.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
