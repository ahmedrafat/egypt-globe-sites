/**
 * /products/salt — salt division overview (Sep 2026 restructure).
 * Wins over the catch-all `[...path]` route.
 *
 * The hub is an overview of the salt business, not a catalogue: hero → the
 * two sources as the primary way in (each links to its own page) with the
 * track record → rock-vs-sea tender table, logistics and QA chain → Quality
 * strip → applications served → grade hubs → FAQs → CTA. The SKU catalogues
 * moved to /products/salt/rock-salt and /products/salt/sea-salt; every SKU is
 * linked from one source page and its grade hub.
 */
import { heroCopy } from '../../../lib/heroCopy'
import { routeOpenGraph } from '../../../lib/seo'
import HeroMotif from '../../../components/HeroMotif'
import HeroBackdrop, { isBanner } from '../../../components/HeroBackdrop'
import Link from 'next/link'
import {
  getPageByPath,
  getSaltCatalogueBySource,
  getSaltApplicationsServed,
  APPLICATIONS } from '../../../lib/corporatePages'
import Icon, { APPLICATION_ICON } from '../../../components/ui/Icon'
import QualityStrip from '../../../components/QualityStrip'
import HubFaqs from '../../../components/HubFaqs'
import QaChainTable, { DataTable } from '../../../components/QaChainTable'
import Image from 'next/image'
import { GRADES, COMPARE, LOGISTICS, SOURCES, TEAL, TEAL_TEXT, GOLD, GOLD_TEXT } from '../../../lib/salt'

// Drop 139c — render on demand (multi-query salt catalogue page)
export const dynamic = 'force-dynamic'

export const metadata = {
  alternates: { canonical: '/products/salt' },
  openGraph: routeOpenGraph({ path: '/products/salt' }),
  title: 'Bulk Salt Supplier Egypt — Rock, Sea, De-icing & Industrial NaCl',
  description: 'Bulk Egyptian salt exporter — Siwa Oasis crystalline rock salt (≥ 97 % NaCl, chemical, food and pharma grades) and North Sinai / Red Sea sea salt (industrial and de-icing scale). Per-lot CoA before B/L, TÜV Austria / SGS / Intertek inspection, FOB / CIF / CFR from 7 Egyptian ports. 8 grades, 100+ SKUs. Priced offers from the export desk.',
}

const APPS_BY_ID = Object.fromEntries(APPLICATIONS.map(a => [a.id, a]))

export default async function SaltMainPage() {
  const [page, catalogue, servedApps] = await Promise.all([
    getPageByPath('/products/salt'),
    getSaltCatalogueBySource(),
    getSaltApplicationsServed(),
  ])
  const { sea, rock, all } = catalogue
  const hero = heroCopy(page)
  const apps = servedApps.map(id => APPS_BY_ID[id]).filter(Boolean)

  const STATS = [
    { big: String(all.length),  label: 'SKUs in catalogue' },
    { big: '8',   label: 'Quality grades' },
    { big: '7',   label: 'Loading ports' },
    { big: '10M+', label: 'Tonnes of salt produced & supplied' },
  ]

  return (
    <article className="bg-white text-[#14161a]">
      {/* Hero ─────────────────────────────────────────────────── */}
      <section data-hero className="egg-hero-dark relative overflow-hidden border-b border-[#ff5a18]/60">
        {isBanner(page?.hero_photo_url) && <HeroBackdrop src={page.hero_photo_url} />}
        <div aria-hidden="true" className="absolute inset-0 egg-grid-dark opacity-60 pointer-events-none" />
        {/* halite is cubic — the crystal habit of salt */}
        {!isBanner(page?.hero_photo_url) && <HeroMotif variant="lattice" tone="#0fb5a5" />}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(55% 55% at 88% 0%, ${TEAL}2b, transparent 60%), radial-gradient(40% 45% at 0% 100%, ${GOLD}22, transparent 60%)` }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-24">
          <nav className="flex items-center gap-2 text-xs text-[#5b6577] mb-5 flex-wrap animate-fade-in">
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
            <span className="egg-chip text-xs text-[#087a70]" style={{ boxShadow: 'inset 0 0 0 1px rgba(15,181,165,.45)' }}>
              <Icon name="shield" className="w-3.5 h-3.5" /> Per-lot CoA
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h1 className="egg-display text-4xl sm:text-5xl lg:text-6xl text-[#14161a] mb-4 leading-[1.02]">
                {hero.heading || <>Bulk Egyptian salt — sea &amp; rock,</>}<br /><span className="italic text-[#087a70]">{hero.sub || 'over 2 million tonnes shipped since 2015.'}</span>
              </h1>
              <p className="text-base sm:text-lg leading-relaxed max-w-3xl text-[#3f4650]">
                {hero.lede || <>{all.length} SKUs across 8 grades from two Egyptian sources: Siwa Oasis crystalline rock salt
                for chemical, food and pharmaceutical purity, and North Sinai sea salt at industrial and de-icing
                scale. <Link href="/about/export-record" className="text-white underline decoration-[#ff5a18]/70 underline-offset-4 hover:decoration-[#ff5a18] transition-colors">More than 100 chartered vessels</Link> have
                carried it FOB / CIF / CFR from Egyptian ports since 2015 — the same specification season after
                season, with a Certificate of Analysis on every lot.</>}
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
                <div className="egg-display text-3xl sm:text-4xl tracking-tight text-[#087a70]">{s.big}</div>
                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#5b6577] mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Source split — Siwa rock vs Sinai sea ───────────────────── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 egg-reveal">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="egg-eyebrow text-[#087a70] justify-center mb-3">Two Egyptian sources</div>
          <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">
            Siwa Oasis crystalline rock salt or Sinai sea salt — specified, not assumed.
          </h2>
          <p className="text-[#3f4650] max-w-3xl mx-auto">
            Egypt&rsquo;s geography supports both salt types. The two are not interchangeable: rock salt carries
            the purity floor for chemical, food and pharmaceutical use; sea salt carries the volume for
            de-icing, industrial and water-treatment tenders. Pick by application, grade and sieve profile —
            we load from the closest port and certify the lot either way.
          </p>
          <p className="mt-5 text-sm text-[#5b6577] max-w-3xl mx-auto">
            <Link href="/about/export-record" className="egg-link">More than 2 million tonnes exported under our own name on 100+ chartered vessels since 2015</Link>
            {' '}— and, counting added-value processing and supply to other exporters, more than 10 million tonnes of salt produced and supplied.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sea salt card */}
          <div className="egg-card rounded-3xl overflow-hidden animate-fade-in-up">
            <Link href={SOURCES.sea.path} className="block relative aspect-[21/9] overflow-hidden rounded-t-3xl group" aria-label={`Explore ${SOURCES.sea.label.toLowerCase()}`}>
              <Image src={SOURCES.sea.banner} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-[72%_50%] group-hover:scale-[1.03] transition-transform duration-700" />
              <span className="absolute inset-0 bg-gradient-to-t from-[#03182d]/70 via-[#03182d]/10 to-transparent" />
              <span className="absolute left-5 bottom-4 text-white egg-display text-2xl drop-shadow-[0_1px_8px_rgba(0,0,0,.5)]">{SOURCES.sea.label}</span>
            </Link>
            <div className="relative overflow-hidden p-7" style={{ background: 'linear-gradient(160deg, #e6fbf8 0%, #c9f3ee 100%)' }}>
              <div className="relative flex items-center gap-3 mb-3">
                <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-white/70 ring-1 ring-[#0fb5a5]/40 text-[#087a70]"><Icon name="wave" className="w-5 h-5" /></span>
                <div>
                  <div className="egg-eyebrow text-[#087a70]">Source 1 · industrial &amp; de-icing scale</div>
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
                <div><div className="egg-display text-3xl text-[#087a70]">{sea.length}</div><div className="text-[11px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">SKUs</div></div>
                <div><div className="egg-display text-3xl text-[#087a70]">94–99+%</div><div className="text-[11px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">NaCl tiers</div></div>
                <div><div className="egg-display text-3xl text-[#087a70]">4</div><div className="text-[11px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">Loading ports</div></div>
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
              <Link href={SOURCES.sea.path} className="egg-btn-ghost mt-6 inline-flex">Explore sea salt — {sea.length} SKUs →</Link>
            </div>
          </div>

          {/* Rock salt card */}
          <div className="egg-card rounded-3xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <Link href={SOURCES.rock.path} className="block relative aspect-[21/9] overflow-hidden rounded-t-3xl group" aria-label={`Explore ${SOURCES.rock.label.toLowerCase()}`}>
              <Image src={SOURCES.rock.banner} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-[72%_50%] group-hover:scale-[1.03] transition-transform duration-700" />
              <span className="absolute inset-0 bg-gradient-to-t from-[#03182d]/70 via-[#03182d]/10 to-transparent" />
              <span className="absolute left-5 bottom-4 text-white egg-display text-2xl drop-shadow-[0_1px_8px_rgba(0,0,0,.5)]">{SOURCES.rock.label}</span>
            </Link>
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
                <div><div className="egg-display text-3xl text-[#8a6d3b]">{rock.length || '—'}</div><div className="text-[11px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">SKUs</div></div>
                <div><div className="egg-display text-3xl text-[#8a6d3b]">≥97%</div><div className="text-[11px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">NaCl floor</div></div>
                <div><div className="egg-display text-3xl text-[#8a6d3b]">4</div><div className="text-[11px] font-mono tracking-[0.14em] text-[#5b6472] uppercase">Loading ports</div></div>
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
                <li className="flex items-start gap-2"><span className="text-[#8a6d3b] font-bold">›</span> Chlor-alkali, PVC and soda-ash feedstock — low Ca / Mg / SO₄</li>
                <li className="flex items-start gap-2"><span className="text-[#8a6d3b] font-bold">›</span> Food-grade and pharmaceutical NaCl (USP / BP / EP after refining)</li>
                <li className="flex items-start gap-2"><span className="text-[#8a6d3b] font-bold">›</span> De-icing road salt to EN 16811-1 Grade A / B / C, ASTM D632, BS 3247, GOST 13830</li>
                <li className="flex items-start gap-2"><span className="text-[#8a6d3b] font-bold">›</span> Drilling-mud weighting, oil &amp; gas completion brines</li>
                <li className="flex items-start gap-2"><span className="text-[#8a6d3b] font-bold">›</span> Leather tanning, textile dyeing (low iron) and livestock lick blocks</li>
              </ul>
              <Link href={SOURCES.rock.path} className="egg-btn-ghost mt-6 inline-flex">Explore rock salt — {rock.length} SKUs →</Link>
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

      {/* Quality at the Core ───────────────────────────────────── */}
      <QualityStrip division="Salt" compact />

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
                  <h3 className="font-semibold text-[#14161a] group-hover:text-[#087a70] transition-colors text-sm">{a.label}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bulk salt by grade — internal links to the 8 grade hubs ── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 egg-reveal">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="egg-eyebrow text-[#087a70] justify-center mb-3">Bulk salt by grade</div>
          <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">Every grade of Egyptian bulk salt</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 stagger-children">
          {GRADES.map(g => (
            <Link key={g.href} href={g.href} className="egg-card group px-4 py-4 flex items-center gap-3">
              <span className="inline-flex w-9 h-9 items-center justify-center rounded-lg ring-1 ring-[#14161a]/15 text-[#14161a]"><Icon name={g.icon} className="w-4 h-4" /></span>
              <span className="font-semibold text-sm text-[#14161a] group-hover:text-[#087a70] transition-colors">{g.label}</span>
            </Link>
          ))}
        </div>
        <p className="text-center text-sm text-[#5b6577] mt-6">
          For grades, standards and lane economics see the full{' '}
          <Link href="/markets/industrial-salt-egypt" className="egg-link">industrial salt supplier guide</Link>.
        </p>
      </section>

      {/* Per-page FAQs from the CMS row (seo.faqs) — FAQPage schema + accordion */}
      <HubFaqs page={page} />

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 egg-reveal">
        <div className="egg-panel p-10 sm:p-14 text-center relative overflow-hidden animate-scale-in">
          <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-60 pointer-events-none" />
          <h2 className="egg-display relative text-3xl sm:text-4xl text-[#14161a] mb-3">Need a tender match or a custom blend?</h2>
          <p className="relative text-[#3f4650] text-lg mb-7 max-w-2xl mx-auto">
            Send the standard, sieve profile, moisture tolerance and tonnage — a priced FOB / CIF / CFR offer with
            a sample Certificate of Analysis and the inspection protocol comes back once stock, laycan and freight are confirmed.
          </p>
          <Link href="/rfq?product=%2Fproducts%2Fsalt" className="egg-btn-primary relative px-8 py-4">Request a Quote</Link>
        </div>
      </section>
    </article>
  )
}
