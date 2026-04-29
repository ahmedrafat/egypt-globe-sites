/**
 * PageRenderer — shared layout for any egg_corporate_pages row.
 *
 * Renders: hero (with photo or fallback gradient), title + description,
 * body markdown, gallery grid, related-page strip from same category.
 */
import Link from 'next/link'
import MarkdownBody from './MarkdownBody'
import { getRelatedPages, CATEGORY_META } from '../lib/corporatePages'

export default async function PageRenderer({ page }) {
  const cat = CATEGORY_META[page.category] || CATEGORY_META.other
  const related = await getRelatedPages(page, 6)

  return (
    <article className="min-h-screen">
      {/* Hero */}
      <section className="relative">
        {page.hero_photo_url ? (
          <div className="relative h-[40vh] sm:h-[55vh] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={page.hero_photo_url} alt={page.title}
              className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-[#0A0A0A]" />
          </div>
        ) : (
          <div className="h-[20vh] sm:h-[28vh]" style={{ background: `linear-gradient(135deg, ${cat.color}33, transparent 80%)` }} />
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 sm:-mt-40 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Link href="/" className="text-xs text-gray-400 hover:text-white">Home</Link>
            <span className="text-gray-600">/</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${cat.color}20`, color: cat.color }}>
              {cat.icon} {cat.label}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white tracking-tight">{page.title}</h1>
          {page.description && (
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl">{page.description}</p>
          )}
        </div>
      </section>

      {/* Body */}
      {page.body_markdown && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <MarkdownBody content={page.body_markdown} />
        </section>
      )}

      {/* Gallery */}
      {(page.gallery_urls || []).length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-bold mb-4 text-white">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {page.gallery_urls.map((url, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA strip */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Need a quote?</h3>
            <p className="text-sm text-gray-400">FOB / CIF / CFR from 7 Egyptian ports — quote in 24h.</p>
          </div>
          <Link href="/rfq"
            className="bg-[#FF6321] hover:bg-[#FF6321]/90 text-white font-bold px-6 py-3 rounded-xl transition-colors whitespace-nowrap">
            📋 Request Quote
          </Link>
        </div>
      </section>

      {/* Related pages */}
      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-white/5">
          <h2 className="text-xl font-bold mb-6 text-white">More in {cat.label}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map(p => (
              <Link key={p.id} href={p.path}
                className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 overflow-hidden transition-all">
                <div className="aspect-[4/3] bg-[#0A0A0A]">
                  {p.hero_photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.hero_photo_url} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl opacity-40">{cat.icon}</div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-[#FF6321] transition-colors">{p.title}</h3>
                  {p.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
