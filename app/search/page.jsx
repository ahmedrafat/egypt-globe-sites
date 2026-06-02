/**
 * /search?q=... — site-wide search results page.
 *
 * Powers the WebSite SearchAction schema target so Google can show a
 * sitelinks searchbox in SERPs. Searches across egg_corporate_pages
 * via Postgres ILIKE on title + description + body_markdown.
 *
 * Drop 168.
 */
import Link from 'next/link'
import { searchPages } from '../../lib/corporatePages'
import { CATEGORY_META } from '../../lib/corporatePages'

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
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-[#1d5fa1] via-[#14467a] to-[#0f1f3a] text-white py-12">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            {q ? <>Search results for &ldquo;{q}&rdquo;</> : 'Search Egypt Globe Group'}
          </h1>
          <form action="/search" method="get" className="flex gap-2 mt-6">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search commodities, ports, standards, HS codes…"
              className="flex-1 px-4 py-3 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
              autoFocus
            />
            <button
              type="submit"
              className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
          {q && (
            <p className="mt-4 text-sm text-blue-100">
              {results.length} {results.length === 1 ? 'result' : 'results'} found
            </p>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
        {!q && (
          <div className="text-center text-slate-600">
            <p className="text-lg mb-2">Type a query above to search across the site.</p>
            <p className="text-sm">
              Try: <Link className="text-[#1d5fa1] hover:underline" href="/search?q=cement+CEM+I">cement CEM I</Link>{' · '}
              <Link className="text-[#1d5fa1] hover:underline" href="/search?q=HS+2501">HS 2501</Link>{' · '}
              <Link className="text-[#1d5fa1] hover:underline" href="/search?q=de-icing+salt">de-icing salt</Link>{' · '}
              <Link className="text-[#1d5fa1] hover:underline" href="/search?q=Damietta+port">Damietta port</Link>
            </p>
          </div>
        )}

        {q && results.length === 0 && (
          <div className="text-center text-slate-600">
            <p className="text-lg mb-2">No results found for &ldquo;{q}&rdquo;.</p>
            <p className="text-sm">
              Try broader keywords, or{' '}
              <Link className="text-[#1d5fa1] hover:underline font-semibold" href="/rfq">request a quote</Link>{' '}
              and we'll respond within 24 hours.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <ul className="space-y-4">
            {results.map((r) => {
              const meta = CATEGORY_META[r.category] || CATEGORY_META.other
              return (
                <li key={r.id} className="border border-slate-200 rounded-xl p-5 hover:border-[#1d5fa1] hover:shadow-md transition-all">
                  <Link href={r.path} className="block">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${meta.tone}`}>
                        <span>{meta.icon}</span>
                        {meta.label}
                      </span>
                      <span className="text-xs text-slate-400">{r.path}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 hover:text-[#1d5fa1] mb-1">
                      {r.title}
                    </h2>
                    {r.description && (
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
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
