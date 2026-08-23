/**
 * /search?q=... — site-wide search results page.
 *
 * Powers the WebSite SearchAction schema target so Google can show a
 * sitelinks searchbox in SERPs. Searches across egg_corporate_pages
 * via Postgres ILIKE on title + description + body_markdown.
 *
 * Drop 168. Light editorial edition — tokens + utilities (.egg-*) in
 * app/globals.css.
 */
import HeroMotif from '../../components/HeroMotif'
import Link from 'next/link'
import { searchPages } from '../../lib/corporatePages'
import { CATEGORY_META } from '../../lib/corporatePages'
import Icon, { CATEGORY_ICON } from '../../components/ui/Icon'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ searchParams }) {
  const sp = await searchParams
  const q = (sp?.q || '').toString().slice(0, 80)
  return {
    title: q ? `${q} — Egypt Globe Group search` : 'Search — Egypt Globe Group',
    description: q
      ? `Search results for "${q}" on Egypt Globe Group — Egyptian B2B commodity export trader.`
      : 'Search Egypt Globe Group — Egyptian B2B commodity export trader covering salt, cement, fertilizers, chemicals, gypsum, agro across 60+ destination markets.',
    alternates: { canonical: 'https://egyptglobe.com/search' },
    robots: q ? { index: false, follow: true } : { index: true, follow: true },
  }
}

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams
  const q = (sp?.q || '').toString().slice(0, 80).trim()
  const results = q ? await searchPages(q, { limit: 40 }) : []

  return (
    <div className="bg-white min-h-screen text-[#14161a]">
      <section className="relative overflow-hidden bg-white border-b border-[#14161a]/10 py-12">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        {/* scanning the catalogue */}
        <HeroMotif variant="radar" tone="#0284c7" />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(55% 55% at 88% 0%, rgba(2,132,199,.14), transparent 60%), radial-gradient(40% 45% at 0% 100%, rgba(15,181,165,.12), transparent 60%)' }} />
        <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <h1 className="egg-display text-3xl sm:text-4xl lg:text-5xl text-[#14161a] mb-4">
            {q ? <>Search results for &ldquo;{q}&rdquo;</> : 'Search Egypt Globe Group'}
          </h1>
          <form action="/search" method="get" className="flex gap-2 mt-6">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search commodities, ports, standards, HS codes…"
              className="flex-1 px-4 py-3 rounded-full bg-white text-[#14161a] placeholder-[#9aa2ae] ring-1 ring-[#14161a]/15 focus:outline-none focus:ring-2 focus:ring-[#ff6321]"
              autoFocus
            />
            <button
              type="submit"
              className="egg-btn-primary"
            >
              Search
            </button>
          </form>
          {q && (
            <p className="mt-4 text-sm text-[#7a8290]">
              {results.length} {results.length === 1 ? 'result' : 'results'} found
            </p>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
        {!q && (
          <div className="text-center text-[#3f4650]">
            <p className="text-lg mb-2">Type a query above to search across the site.</p>
            <p className="text-sm">
              Try: <Link className="egg-link" href="/search?q=cement+CEM+I">cement CEM I</Link>{' · '}
              <Link className="egg-link" href="/search?q=HS+2501">HS 2501</Link>{' · '}
              <Link className="egg-link" href="/search?q=de-icing+salt">de-icing salt</Link>{' · '}
              <Link className="egg-link" href="/search?q=Damietta+port">Damietta port</Link>
            </p>
          </div>
        )}

        {q && results.length === 0 && (
          <div className="text-center text-[#3f4650]">
            <p className="text-lg mb-2">No results found for &ldquo;{q}&rdquo;.</p>
            <p className="text-sm">
              Try broader keywords, or{' '}
              <Link className="egg-link" href="/rfq">request a quote</Link>{' '}
              and we'll respond within 24 hours.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <ul className="space-y-4">
            {results.map((r) => {
              const meta = CATEGORY_META[r.category] || CATEGORY_META.other
              return (
                <li key={r.id} className="egg-card p-5">
                  <Link href={r.path} className="block">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${meta.tone}`}>
                        <Icon name={CATEGORY_ICON[r.category] || 'grid'} className="w-3 h-3" />
                        {meta.label}
                      </span>
                      <span className="text-xs text-[#8a93a3]">{r.path}</span>
                    </div>
                    <h2 className="text-lg font-semibold text-[#14161a] hover:text-[#0b8f84] mb-1">
                      {r.title}
                    </h2>
                    {r.description && (
                      <p className="text-sm text-[#3f4650] leading-relaxed line-clamp-2">
                        {r.description}
                      </p>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
