/**
 * /blog — magazine index of all blog articles.
 */
import Link from 'next/link'
import { getPagesByCategory, getPageByPath } from '../../lib/corporatePages'
import RichPageBody from '../../components/RichPageBody'

// Drop 139c — render on demand. See app/case-studies/page.jsx note.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'News & Insights — Blog',
  description: 'Egypt Globe Group blog — company news, market commentary, industry analysis and Egyptian B2B export trade trends.',
}

export default async function BlogIndex() {
  const [grouped, hubPage] = await Promise.all([
    getPagesByCategory(),
    getPageByPath('/blog'),
  ])
  const posts = (grouped.blog || []).filter(p => p.path !== '/blog')

  return (
    <article>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-700 via-orange-700 to-[#0f1f3a] text-white">
        <div aria-hidden="true" className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute right-0 top-0 w-[600px] h-[600px] rounded-full"
            style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)' }} />
          <div className="absolute -bottom-32 -left-24 w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)' }} />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-25" aria-hidden="true" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 sm:py-20">
          <nav className="flex items-center gap-2 text-xs text-white/60 mb-5 flex-wrap animate-fade-in">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>›</span>
            <span className="text-white/90">News & Blog</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in-up">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              📝 Editorial
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-white/15 text-white border border-white/20 backdrop-blur-sm">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-[1.05] drop-shadow-sm animate-fade-in-up">
            News, market commentary &
            <span className="block text-white/85 text-2xl sm:text-3xl lg:text-4xl font-bold mt-2">
              Egyptian B2B export trade insights.
            </span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-3xl text-white/80 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
            Company updates, Egyptian commodity-market dynamics, port economics, regulatory
            shifts (CBAM, PVoC, VOC, CIQ) and emerging tech in the salt / cement / fertilizer
            / chemicals supply chain.
          </p>
        </div>
      </section>

      {/* Featured + grid */}
      {posts.length === 0 ? (
        <section className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-20 text-center">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-10 text-slate-500">
            <div className="text-5xl mb-3">📝</div>
            <p>New articles publish here. Check back soon — or
              {' '}<Link href="/contact" className="text-[#1d5fa1] font-semibold hover:underline">subscribe via the contact form</Link>{' '}
              to get notified.</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured (most recent) */}
          {posts[0] && (
            <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
              <div className="text-xs uppercase tracking-wider font-bold text-rose-700 mb-3">Featured</div>
              <Link href={posts[0].path}
                className="card-lift group block rounded-3xl border border-slate-200 bg-white overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                  <div className="lg:col-span-3 aspect-[16/9] lg:aspect-auto overflow-hidden bg-gradient-to-br from-rose-100 via-orange-100 to-amber-100 relative">
                    {posts[0].hero_photo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={posts[0].hero_photo_url} alt={posts[0].title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-9xl opacity-30">📝</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur text-rose-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                      ★ Featured
                    </div>
                  </div>
                  <div className="lg:col-span-2 p-7 sm:p-9 lg:p-10 flex flex-col justify-center">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-[#1d5fa1] transition-colors leading-tight tracking-tight mb-3">
                      {posts[0].title}
                    </h2>
                    {posts[0].description && (
                      <p className="text-slate-600 leading-relaxed mb-5 line-clamp-4">{posts[0].description}</p>
                    )}
                    <div className="inline-flex items-center text-sm font-bold text-[#1d5fa1] gap-2">
                      Read article <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Rest of articles grid */}
          {posts.length > 1 && (
            <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-16 sm:pb-20">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8">All articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
                {posts.slice(1).map(post => (
                  <Link key={post.id} href={post.path}
                    className="card-lift group rounded-2xl border border-slate-200 bg-white overflow-hidden">
                    <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-rose-100 via-orange-100 to-amber-100 relative">
                      {post.hero_photo_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={post.hero_photo_url} alt={post.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-7xl opacity-30">📝</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-[#1d5fa1] transition-colors leading-tight">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed">{post.description}</p>
                      )}
                      <div className="mt-3 inline-flex items-center text-xs font-bold text-[#1d5fa1] group-hover:gap-2 gap-1 transition-all">
                        Read more <span>→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Hub body content if any */}
      {hubPage?.body_markdown && (
        <section className="bg-slate-50/40 py-16 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <RichPageBody content={hubPage.body_markdown} title={hubPage.title} />
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-rose-700 via-orange-700 to-[#0f1f3a] p-10 sm:p-12 text-center relative overflow-hidden shadow-2xl shadow-rose-900/20">
          <div aria-hidden="true" className="absolute -top-12 -right-12 text-[260px] opacity-10 select-none">📝</div>
          <h2 className="relative text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
            Want our market commentary in your inbox?
          </h2>
          <p className="relative text-rose-100 text-base sm:text-lg mb-6 max-w-2xl mx-auto">
            Periodic insights on Egyptian B2B commodity trade flows, port economics
            and regulatory updates. No marketing spam — just the analysis.
          </p>
          <a href="mailto:insights@egyptglobe.com?subject=Subscribe%20to%20insights"
            className="relative inline-flex items-center gap-2 bg-white hover:bg-rose-50 text-rose-700 font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all hover:-translate-y-0.5">
            ✉ Subscribe to insights
          </a>
        </div>
      </section>
    </article>
  )
}
