/**
 * /case-studies — magazine index of real Egypt Globe export shipments.
 * Light editorial edition — tokens + utilities (.egg-*) in app/globals.css.
 */
import HeroMotif from '../../components/HeroMotif'
import Link from 'next/link'
import { getCaseStudies, getPageByPath } from '../../lib/corporatePages'
import RichPageBody from '../../components/RichPageBody'
import Icon from '../../components/ui/Icon'

// Drop 139c — render on demand instead of pre-building. The build worker has
// a 60s/page hard limit; if Supabase is slow during build, this page hung 3
// retries and failed the entire build. Runtime-rendered pages benefit from
// the withTimeout wrappers in lib/corporatePages.js (degrade gracefully)
// while keeping the build queue moving.
export const dynamic = 'force-dynamic'

export const metadata = {
  alternates: { canonical: '/case-studies' },
  title: 'Case Studies — Real Egypt Globe Shipments',
  description: 'How Egypt Globe Group ships cement to East Africa, de-icing salt to the Nordics, pharma-grade NaCl to South Asia. Real shipments, real numbers.',
}

const TONE = '#0b8f84'

export default async function CaseStudiesIndex() {
  const [posts, hubPage] = await Promise.all([
    getCaseStudies({ limit: 50 }),
    getPageByPath('/case-studies'),
  ])

  return (
    <article className="bg-white text-[#14161a]">
      {/* Hero — white editorial banner with turquoise glow */}
      <section className="relative overflow-hidden bg-white border-b border-[#14161a]/10">
        <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
        {/* measured outcomes */}
        <HeroMotif variant="dial" tone="#0d9488" />
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(55% 55% at 88% 0%, rgba(15,181,165,.2), transparent 60%), radial-gradient(40% 45% at 0% 100%, rgba(255,99,33,.08), transparent 60%)' }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 sm:py-20">
          <nav className="flex items-center gap-2 text-xs text-[#7a8290] mb-5 flex-wrap animate-fade-in">
            <Link href="/" className="hover:text-[#14161a] transition-colors">Home</Link>
            <span>›</span>
            <span className="text-[#14161a] font-medium">Case Studies</span>
          </nav>

          <div className="flex items-center gap-2 mb-4 flex-wrap animate-fade-in-up">
            <span className="egg-chip text-xs" style={{ color: TONE, boxShadow: 'inset 0 0 0 1px rgba(15,181,165,.5)' }}>
              <Icon name="book" className="w-3.5 h-3.5" /> Real shipments
            </span>
            <span className="egg-chip text-xs">
              {posts.length} {posts.length === 1 ? 'study' : 'studies'}
            </span>
            <span className="egg-chip text-xs">
              Verified numbers
            </span>
          </div>

          <h1 className="egg-display text-4xl sm:text-5xl lg:text-6xl text-[#14161a] mb-4 leading-[1.02] animate-fade-in-up">
            Real Egypt Globe shipments,
            <span className="block text-[#3f4650] italic text-2xl sm:text-3xl lg:text-4xl mt-3 leading-[1.15]">
              full process and delivered numbers.
            </span>
          </h1>
          <p className="text-base sm:text-lg leading-relaxed max-w-3xl text-[#3f4650] animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
            B2B export trade is built on verifiable execution, not promises.
            Each case study below walks through a real shipment — sourcing,
            loading, documentation, distribution and the lab-tested numbers
            that came out the other end.
          </p>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-20 text-center">
          <div className="egg-panel p-10 text-[#7a8290]">
            <Icon name="book" className="w-10 h-10 mx-auto mb-3 text-[#14161a]/40" strokeWidth={1.25} />
            <p>Case studies publish here as we receive customer permission to share details.
              {' '}<Link href="/contact" className="egg-link">Get in touch</Link>{' '}
              for references aligned with your sourcing requirement.</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured (first one) */}
          {posts[0] && (
            <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-16 egg-reveal">
              <div className="egg-eyebrow mb-3" style={{ color: TONE }}>Featured</div>
              <Link href={posts[0].path}
                className="egg-card group block rounded-3xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                  <div className="lg:col-span-3 aspect-[16/9] lg:aspect-auto overflow-hidden relative"
                    style={{ background: 'linear-gradient(135deg, #e6fbf8 0%, #f2fbfa 100%)' }}>
                    {posts[0].hero_photo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={posts[0].hero_photo_url} alt={posts[0].title}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon name="book" className="w-16 h-16 text-[#14161a]/20" strokeWidth={1} />
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
                      Read case study <span aria-hidden="true">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Rest */}
          {posts.length > 1 && (
            <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pb-16 sm:pb-20 egg-reveal">
              <h2 className="egg-display text-3xl sm:text-4xl text-[#14161a] mb-8">All case studies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
                {posts.slice(1).map(cs => (
                  <Link key={cs.id} href={cs.path}
                    className="egg-card group overflow-hidden">
                    <div className="aspect-[16/9] overflow-hidden relative rounded-t-2xl"
                      style={{ background: 'linear-gradient(135deg, #e6fbf8 0%, #f2fbfa 100%)' }}>
                      {cs.hero_photo_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={cs.hero_photo_url} alt={cs.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon name="book" className="w-12 h-12 text-[#14161a]/20" strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-[#14161a] line-clamp-2 group-hover:text-[#0b8f84] transition-colors leading-tight">
                        {cs.title}
                      </h3>
                      {cs.description && (
                        <p className="text-sm text-[#7a8290] mt-2 line-clamp-3 leading-relaxed">{cs.description}</p>
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

      {hubPage?.body_markdown && (
        <section className="bg-[#f9fafb] py-16 border-y border-[#14161a]/10 egg-reveal">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <RichPageBody content={hubPage.body_markdown} title={hubPage.title} />
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 egg-reveal">
        <div className="egg-panel p-10 sm:p-12 text-center relative overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-60 pointer-events-none" />
          <div aria-hidden="true" className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-40 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #0fb5a5 0%, transparent 70%)' }} />
          <h2 className="egg-display relative text-3xl sm:text-4xl text-[#14161a] mb-3">
            Want a reference aligned with your sourcing requirement?
          </h2>
          <p className="relative text-[#3f4650] text-base sm:text-lg mb-6 max-w-2xl mx-auto">
            We can share customer references in your industry / region under NDA — useful for tender-bid social proof.
          </p>
          <a href="mailto:export@egyptglobe.com?subject=Case%20study%20reference%20request"
            className="egg-btn-primary relative">
            <Icon name="mail" className="w-3.5 h-3.5" /> Request references
          </a>
        </div>
      </section>
    </article>
  )
}
