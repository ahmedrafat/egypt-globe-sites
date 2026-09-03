/**
 * /blog — magazine index of all blog articles.
 * Light editorial edition — tokens + utilities (.egg-*) in app/globals.css.
 */
import HeroMotif from '../../components/HeroMotif'
import Link from 'next/link'
import { getPagesByCategory, getPageByPath } from '../../lib/corporatePages'
import RichPageBody from '../../components/RichPageBody'
import Icon from '../../components/ui/Icon'

// Drop 139c — render on demand. See app/case-studies/page.jsx note.
export const dynamic = 'force-dynamic'

export const metadata = {
  alternates: { canonical: '/blog' },
  title: 'News & Insights — Blog',
  description: 'Egypt Globe Group blog — company news, market commentary, industry analysis and Egyptian B2B export trade trends.',
}

const TONE = '#d9501a'

export default async function BlogIndex() {
  const [grouped, hubPage] = await Promise.all([
    getPagesByCategory(),
    getPageByPath('/blog'),
  ])
  const posts = (grouped.blog || []).filter(p => p.path !== '/blog')

  return (
    <article className="bg-white text-[#14161a]">
      {/* Hero — white editorial banner with warm glow */}
      <section className="relative overflow-hidden bg-white border-b border-[#14161a]/10">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        {/* editorial wayfinding */}
        <HeroMotif variant="compass" tone="#b8862b" />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(55% 55% at 88% 0%, rgba(255,99,33,.16), transparent 60%), radial-gradient(40% 45% at 0% 100%, rgba(184,134,43,.14), transparent 60%)' }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 sm:py-20">
          <nav className="flex items-center gap-2 text-xs text-[#7a8290] mb-5 flex-wrap animate-fade-in">
            <Link href="/" className="hover:text-[#14161a] transition-colors">Home</Link>
            <span>›</span>
            <span className="text-[#14161a] font-medium">News & Blog</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in-up">
            <span className="egg-chip text-xs" style={{ color: TONE, boxShadow: 'inset 0 0 0 1px rgba(255,99,33,.45)' }}>
              <Icon name="news" className="w-3.5 h-3.5" /> Editorial
            </span>
            <span className="egg-chip text-xs">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'}
            </span>
          </div>

          <h1 className="egg-display text-4xl sm:text-5xl lg:text-6xl text-[#14161a] mb-4 leading-[1.02] animate-fade-in-up">
            News, market commentary &
            <span className="block text-[#3f4650] italic text-2xl sm:text-3xl lg:text-4xl mt-3 leading-[1.15]">
              Egyptian B2B export trade insights.
            </span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-3xl text-[#3f4650] animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
            Company updates, Egyptian commodity-market dynamics, port economics, regulatory
            shifts (CBAM, PVoC, VOC, CIQ) and emerging tech in the salt / cement / fertilizer
            / chemicals supply chain.
          </p>
        </div>
      </section>

      {/* Featured + grid */}
      {posts.length === 0 ? (
        <section className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-20 text-center">
          <div className="egg-panel p-10 text-[#7a8290]">
            <Icon name="news" className="w-10 h-10 mx-auto mb-3 text-[#14161a]/40" strokeWidth={1.25} />
            <p>New articles publish here. Check back soon — or
              {' '}<Link href="/contact" className="egg-link">subscribe via the contact form</Link>{' '}
              to get notified.</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured (most recent) */}
          {posts[0] && (
            <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16 egg-reveal">
              <div className="egg-eyebrow mb-3" style={{ color: TONE }}>Featured</div>
              <Link href={posts[0].path}
                className="egg-card group block rounded-3xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                  <div className="lg:col-span-3 aspect-[16/9] lg:aspect-auto overflow-hidden relative"
                    style={{ background: 'linear-gradient(135deg, #fff4ec 0%, #fbf3e3 100%)' }}>
                    {posts[0].hero_photo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={posts[0].hero_photo_url} alt={posts[0].title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon name="news" className="w-16 h-16 text-[#14161a]/20" strokeWidth={1} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 egg-chip bg-white/95 backdrop-blur text-xs uppercase tracking-wider shadow-sm" style={{ color: TONE }}>
                      ★ Featured
                    </div>
                  </div>
                  <div className="lg:col-span-2 p-7 sm:p-9 lg:p-10 flex flex-col justify-center">
                    <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] group-hover:text-[#0b8f84] transition-colors leading-tight mb-3">
                      {posts[0].title}
                    </h2>
                    {posts[0].description && (
                      <p className="text-[#3f4650] leading-relaxed mb-5 line-clamp-4">{posts[0].description}</p>
                    )}
                    <div className="inline-flex items-center text-sm font-semibold text-[#0b8f84] gap-2">
                      Read article <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Rest of articles grid */}
          {posts.length > 1 && (
            <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-16 sm:pb-20 egg-reveal">
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-8">All articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
                {posts.slice(1).map(post => (
                  <Link key={post.id} href={post.path}
                    className="egg-card group overflow-hidden">
                    <div className="aspect-[16/9] overflow-hidden relative rounded-t-2xl"
                      style={{ background: 'linear-gradient(135deg, #fff4ec 0%, #fbf3e3 100%)' }}>
                      {post.hero_photo_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={post.hero_photo_url} alt={post.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon name="news" className="w-12 h-12 text-[#14161a]/20" strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-[#14161a] line-clamp-2 group-hover:text-[#0b8f84] transition-colors leading-tight">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-sm text-[#7a8290] mt-2 line-clamp-3 leading-relaxed">{post.description}</p>
                      )}
                      <div className="mt-3 inline-flex items-center text-xs font-semibold text-[#0b8f84] group-hover:gap-2 gap-1 transition-all">
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
        <section className="bg-[#f9fafb] py-16 border-y border-[#14161a]/10 egg-reveal">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <RichPageBody content={hubPage.body_markdown} title={hubPage.title} />
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 overflow-hidden egg-reveal">
        <div className="egg-panel p-10 sm:p-12 text-center relative overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-60 pointer-events-none" />
          <div aria-hidden="true" className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-40 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #FF6321 0%, transparent 70%)' }} />
          <h2 className="egg-display relative text-3xl sm:text-4xl text-[#14161a] mb-3">
            Want our market commentary in your inbox?
          </h2>
          <p className="relative text-[#3f4650] text-base sm:text-lg mb-6 max-w-2xl mx-auto">
            Periodic insights on Egyptian B2B commodity trade flows, port economics
            and regulatory updates. No marketing spam — just the analysis.
          </p>
          <a href="mailto:insights@egyptglobe.com?subject=Subscribe%20to%20insights"
            className="egg-btn-primary relative">
            <Icon name="mail" className="w-3.5 h-3.5" /> Subscribe to insights
          </a>
        </div>
      </section>
    </article>
  )
}
