'use client'

// Generic page for layouts without a dedicated component
// (certifications, logistics, about, fleet, minerals, crops, terminals, etc.)
export default function GenericPage({ site, pageConfig }) {
  const { theme, sections, brandName, brandLogo } = site
  const primary = theme.primaryColor

  // Try to find matching section data by layout slug
  const sectionData = sections[pageConfig.layout] || sections[pageConfig.slug] || null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Header */}
      <div className="mb-16">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 border"
          style={{ borderColor: `${primary}44`, color: primary, background: `${primary}11` }}
        >
          <span>{brandLogo}</span>
          <span>{brandName}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">{pageConfig.title}</h1>
        <div
          className="h-1 w-16 rounded"
          style={{ background: primary }}
        />
      </div>

      {sectionData ? (
        <SectionContent data={sectionData} primary={primary} />
      ) : (
        /* Fallback: show stats + features from main sections */
        <div className="space-y-16">
          {sections.stats?.items?.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-8" style={{ color: primary }}>Key Metrics</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sections.stats.items.map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-white/10 p-6 text-center"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <div className="text-3xl font-extrabold mb-1" style={{ color: primary }}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.network?.connections && (
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: primary }}>
                {sections.network.title || 'Network & Reach'}
              </h2>
              <p className="text-gray-400 mb-8">{sections.network.subtitle}</p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div
                  className="rounded-xl border border-white/10 p-6"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
                    Origin Ports / Hubs
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sections.network.connections.map((c) => (
                      <span
                        key={c}
                        className="px-3 py-1 rounded-full text-sm font-medium"
                        style={{ background: `${primary}22`, color: primary }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div
                  className="rounded-xl border border-white/10 p-6"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
                    Destination Markets
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {sections.network.destinations.map((d) => (
                      <span
                        key={d}
                        className="px-3 py-1 rounded-full text-sm border border-white/20 text-gray-300"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!sections.stats && !sections.network && (
            <div
              className="rounded-xl border border-white/10 p-12 text-center"
              style={{ background: 'rgba(255,255,255,0.02)' }}
            >
              <div className="text-4xl mb-4">{brandLogo}</div>
              <p className="text-gray-400">Content for this page is coming soon.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SectionContent({ data, primary }) {
  if (!data) return null

  // Render items array if present
  if (data.items?.length > 0) {
    return (
      <div className="space-y-8">
        {data.title && <h2 className="text-2xl font-bold" style={{ color: primary }}>{data.title}</h2>}
        {data.subtitle && <p className="text-gray-400">{data.subtitle}</p>}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 p-6"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              {item.name && <h3 className="font-bold mb-2">{item.name}</h3>}
              {item.title && <h3 className="font-bold mb-2">{item.title}</h3>}
              {item.description && <p className="text-sm text-gray-400">{item.description}</p>}
              {item.grade && (
                <div className="mt-2 text-xs" style={{ color: primary }}>Grade: {item.grade}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
