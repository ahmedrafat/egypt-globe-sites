import { getAllSites } from '../lib/getSiteConfig'
import Link from 'next/link'

const categoryColors = {
  trading: '#00B4D8',
  logistics: '#FF6321',
  'it-services': '#F72585',
  stevedoring: '#6A0572',
  corporate: '#FFD166',
  application: '#7B2FBE',
}

export default function HomePage() {
  const sites = getAllSites()

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero */}
      <header className="border-b border-white/10 bg-black/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-5xl mb-4">🌍</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            Egypt Globe Group
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Digital presence for all 13 brands in the Egypt Globe Group conglomerate.
            Connecting Egyptian industrial excellence to 60+ countries.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
              {sites.length} Brands
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
              60+ Countries
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
              $168M+ Annual Revenue
            </span>
          </div>
        </div>
      </header>

      {/* Brand grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => {
            const primary = site.theme?.primaryColor || site.brandColor || '#FF6321'
            const preset = site.theme?.preset || 'corporate'
            const statusBadge = {
              published: { label: 'Live', color: '#22c55e' },
              draft: { label: 'Draft', color: '#f59e0b' },
              archived: { label: 'Archived', color: '#6b7280' },
            }[site.status] || { label: site.status, color: '#6b7280' }

            return (
              <div
                key={site.id}
                className="group relative rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Color bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: `linear-gradient(to right, ${primary}, ${primary}88)` }}
                />

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{site.brandLogo}</span>
                      <div>
                        <h2 className="font-bold text-lg leading-tight">{site.brandName}</h2>
                        <p className="text-xs text-gray-500">{site.domain}</p>
                      </div>
                    </div>
                    <span
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                      style={{ background: `${statusBadge.color}20`, color: statusBadge.color }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: statusBadge.color }}
                      />
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">
                    {site.seo?.metaDescription}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-2 mb-5 text-xs text-gray-600">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 capitalize">{preset}</span>
                    {site.visitors && site.visitors !== '—' && (
                      <span className="px-2 py-0.5 rounded-full bg-white/5">{site.visitors}</span>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/site/${site.slug}`}
                    className="group/btn flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
                    style={{
                      background: `${primary}15`,
                      border: `1px solid ${primary}33`,
                      color: primary,
                    }}
                  >
                    <span>Preview Site</span>
                    <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          <p>
            Egypt Globe Group Brand Sites &mdash; Powered by{' '}
            <a
              href="https://egyptglobegroup.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF6321] hover:opacity-80 transition-opacity"
            >
              EGG OS
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
