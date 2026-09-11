/**
 * Salt source page — /products/salt/rock-salt and /products/salt/sea-salt.
 *
 * Sep 2026 restructure: the salt hub is now an overview (the business, the two
 * sources, grades, applications) and each source gets its own page carrying
 * what used to be the hub's SKU dump — plus the source's specification, best
 * uses, applications, grades and loading ports. Copy that should be editable
 * (title, lede, narrative, FAQs, banner) comes from the CMS row; reference
 * data comes from lib/salt.js so it can never disagree with the hub.
 */
import Link from 'next/link'
import HeroBackdrop, { isBanner } from '../HeroBackdrop'
import HeroMotif from '../HeroMotif'
import Icon, { APPLICATION_ICON } from '../ui/Icon'
import RichPageBody from '../RichPageBody'
import HubFaqs from '../HubFaqs'
import { DataTable } from '../QaChainTable'
import { BreadcrumbJsonLd } from '../StructuredData'
import SaltCatalogue from './SaltCatalogue'
import { SOURCES, COMPARE, applicationsFor, gradesFor } from '../../lib/salt'

export default function SaltSourcePage({ source, page, items }) {
  const s = SOURCES[source]
  const other = SOURCES[s.other]
  const apps = applicationsFor(items)
  const grades = gradesFor(items)
  const glance = COMPARE.map(r => [r[0], r[s.col]])
  const crumbs = [
    { name: 'Home', path: '/' }, { name: 'Products', path: '/products' },
    { name: 'Salt', path: '/products/salt' }, { name: s.label, path: s.path },
  ]
  const stats = [
    { big: String(items.length), label: `${s.label} SKUs` },
    { big: String(grades.length), label: 'Grades' },
    { big: s.nacl, label: 'NaCl, dry basis' },
    { big: String(s.ports.length), label: 'Loading ports' },
  ]
  const quote = `/rfq?product=${encodeURIComponent(s.path)}`

  return (
    <article className="bg-white text-[#14161a]">
      <BreadcrumbJsonLd crumbs={crumbs} />

      {/* Hero */}
      <section data-hero className="egg-hero-dark relative overflow-hidden border-b border-[#ff5a18]/60">
        {isBanner(page?.hero_photo_url) && <HeroBackdrop src={page.hero_photo_url} />}
        <div aria-hidden="true" className="absolute inset-0 egg-grid-dark opacity-60 pointer-events-none" />
        {!isBanner(page?.hero_photo_url) && <HeroMotif variant="lattice" tone={s.tone} />}
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-24">
          <nav className="flex items-center gap-2 text-xs mb-5 flex-wrap animate-fade-in" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span>›</span>
            <Link href="/products">Products</Link><span>›</span>
            <Link href="/products/salt">Salt</Link><span>›</span>
            <span className="font-medium" aria-current="page">{s.label}</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in-up">
            <span className="egg-chip text-xs" style={{ color: s.tone }}><Icon name={s.icon} className="w-3.5 h-3.5" /> {s.label}</span>
            <span className="egg-chip text-xs">NaCl {s.nacl}</span>
            <span className="egg-chip font-mono text-[11px]">HS 2501</span>
            <span className="egg-chip text-xs">{items.length} SKUs</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
              <h1 className="egg-display text-4xl sm:text-5xl lg:text-6xl mb-4 leading-[1.02]">
                {s.headline}<br /><span className="italic">{s.headlineTail}</span>
              </h1>
              {page?.description && (
                <p className="text-base sm:text-lg leading-relaxed max-w-3xl">{page.description}</p>
              )}
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-end animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Link href={quote} className="egg-btn-primary">Get Quote</Link>
              <Link href="#catalogue" className="egg-btn-ghost">Browse {items.length} SKUs →</Link>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden ring-1 ring-[#14161a]/10 bg-[#14161a]/10">
            {stats.map(x => (
              <div key={x.label} className="bg-white/90 backdrop-blur px-5 py-5">
                <div className="egg-display text-3xl sm:text-4xl tracking-tight" style={{ color: s.toneText }}>{x.big}</div>
                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#5b6577] mt-2">{x.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* At a glance — specification + best uses + ports */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <div className="egg-eyebrow mb-3" style={{ color: s.toneText }}>{s.eyebrow}</div>
          <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-4">{s.longLabel} at a glance</h2>
          <p className="text-[#3f4650] leading-relaxed mb-6 max-w-2xl">{s.summary}</p>
          <DataTable
            title={`${s.label} — specification reference`}
            icon="layers"
            head={['Parameter', s.longLabel]}
            rows={glance}
            note="Contractual limits verified per lot. Grade-specific limits (heavy metals, pH, anti-caking) are on each grade hub and SKU page."
          />
        </div>
        <aside className="lg:col-span-5 space-y-6">
          <div className="egg-card p-6">
            <div className="egg-eyebrow mb-3">Best for</div>
            <ul className="space-y-2 text-sm text-[#3f4650]">
              {s.bestFor.map(b => (
                <li key={b} className="flex items-start gap-2"><span className="font-bold" style={{ color: s.toneText }}>›</span> {b}</li>
              ))}
            </ul>
          </div>
          <div className="egg-card p-6">
            <div className="egg-eyebrow mb-3">Loading ports</div>
            <ul className="grid grid-cols-2 gap-2">
              {s.ports.map(p => (
                <li key={p.code}>
                  <Link href={p.href} className="group flex items-center gap-2 rounded-xl border border-[#14161a]/10 px-3 py-2.5 hover:border-[#14161a]/30 transition-colors">
                    <span className="shrink-0" style={{ color: s.toneText }}><Icon name="anchor" className="w-3.5 h-3.5" /></span>
                    <span className="text-sm font-semibold text-[#14161a] group-hover:underline underline-offset-4">{p.name}</span>
                    <span className="ml-auto font-mono text-[10px] text-[#5b6577]">{p.code}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      {/* Narrative from the CMS */}
      {page?.body_markdown && (
        <section className="border-t border-[#14161a]/10">
          <RichPageBody content={page.body_markdown} title={page.title} />
        </section>
      )}

      {/* Applications */}
      {apps.length > 0 && (
        <section className="bg-[#f9fafb] py-16 sm:py-20 border-y border-[#14161a]/10">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <div className="egg-eyebrow text-[#7c3aed] mb-3">{s.label} by industry</div>
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-3">
                {apps.length} applications for Egyptian {s.label.toLowerCase()}.
              </h2>
              <p className="text-[#3f4650]">Each industry page carries its own sub-specification, standards and the matching SKUs.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {apps.map(a => (
                <Link key={a.id} href={a.path} className="egg-card group p-5 flex items-center gap-3">
                  <span className="inline-flex w-10 h-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-[#14161a]/15 text-[#14161a] group-hover:ring-[#7c3aed]/60 transition-colors">
                    <Icon name={APPLICATION_ICON[a.id] || 'factory'} className="w-5 h-5" />
                  </span>
                  <span className="font-semibold text-sm text-[#14161a] group-hover:text-[#087a70] transition-colors">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Grades available from this source */}
      {grades.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mb-8">
            <div className="egg-eyebrow mb-3" style={{ color: s.toneText }}>Grades</div>
            <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">{s.label} grades we supply</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {grades.map(g => (
              <Link key={g.id} href={g.href} className="egg-card group px-4 py-4 flex items-center gap-3">
                <span className="inline-flex w-9 h-9 shrink-0 items-center justify-center rounded-lg ring-1 ring-[#14161a]/15 text-[#14161a]"><Icon name={g.icon} className="w-4 h-4" /></span>
                <span className="font-semibold text-sm text-[#14161a] group-hover:text-[#087a70] transition-colors">{g.label}</span>
                <span className="ml-auto font-mono text-[11px] text-[#5b6577]">{g.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Catalogue */}
      <section id="catalogue" className="bg-[#f9fafb] py-16 border-y border-[#14161a]/10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8 flex-wrap">
            <div>
              <div className="egg-eyebrow mb-2" style={{ color: s.toneText }}><Icon name={s.icon} className="w-3.5 h-3.5" /> {s.label} catalogue</div>
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a]">{items.length} {s.label.toLowerCase()} SKUs</h2>
            </div>
            <Link href={quote} className="egg-link text-sm">Quote any combination →</Link>
          </div>
          <SaltCatalogue items={items} type={source} />
        </div>
      </section>

      {/* The other source */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14">
        <Link href={other.path} className="egg-card group p-7 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <span className="inline-flex w-12 h-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-[#14161a]/15" style={{ color: other.toneText }}>
            <Icon name={other.icon} className="w-6 h-6" />
          </span>
          <div className="flex-1">
            <div className="egg-eyebrow mb-1" style={{ color: other.toneText }}>The other Egyptian source</div>
            <div className="egg-display text-2xl text-[#14161a]">{other.longLabel} — NaCl {other.nacl}</div>
          </div>
          <span className="egg-link text-sm">Explore {other.label.toLowerCase()} →</span>
        </Link>
      </section>

      <HubFaqs page={page} />

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20">
        <div className="egg-panel p-10 sm:p-14 text-center relative overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-60 pointer-events-none" />
          <h2 className="egg-display relative text-3xl sm:text-4xl text-[#14161a] mb-3">Send the standard and the tonnage.</h2>
          <p className="relative text-[#3f4650] text-lg mb-7 max-w-2xl mx-auto">
            Grade, sieve profile, moisture tolerance, destination and quantity — the export desk comes back with a
            priced FOB / CIF / CFR offer for {s.label.toLowerCase()} once stock, laycan and freight are confirmed.
          </p>
          <Link href={quote} className="egg-btn-primary relative px-8 py-4">Request a Quote</Link>
        </div>
      </section>
    </article>
  )
}
