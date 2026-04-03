'use client'

export default function ProductsPage({ site }) {
  const { theme, sections, brandName, brandLogo } = site
  const primary = theme.primaryColor
  const accent = theme.accentColor || primary
  const products = sections.products

  if (!products?.items?.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Products coming soon.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      {/* Header */}
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold mb-5 uppercase tracking-wider"
          style={{ borderColor: `${primary}40`, color: primary, background: `${primary}10` }}>
          {brandLogo} {brandName}
        </div>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">{products.title || 'Our Products'}</h1>
        {products.subtitle && <p className="text-gray-400 text-lg max-w-2xl mx-auto">{products.subtitle}</p>}
      </div>

      {/* Product grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.items.map((product, i) => (
          <div key={i}
            className="group relative rounded-2xl border border-white/8 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
            style={{ background: 'rgba(255,255,255,0.025)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = `0 20px 60px ${primary}18`}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>

            {/* Top color bar */}
            <div className="h-1" style={{ background: `linear-gradient(to right, ${primary}, ${accent})` }} />

            {/* Image placeholder */}
            <div className="relative overflow-hidden" style={{ height: '160px', background: `${primary}08` }}>
              <img
                src={`https://picsum.photos/seed/${encodeURIComponent(product.name)}/600/320`}
                alt={product.name}
                className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500 group-hover:scale-105 transition-transform"
                style={{ transition: 'opacity 0.5s, transform 0.5s' }}
              />
              {product.grade && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-md border border-white/10"
                  style={{ background: `${primary}dd`, color: '#fff' }}>
                  {product.grade}
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-lg font-bold mb-2.5">{product.name}</h3>
              <p className="text-sm text-gray-400 leading-relaxed flex-1 mb-4">{product.description}</p>

              {product.packaging && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 pb-4 border-b border-white/8">
                  <span className="text-gray-600">📦</span>
                  <span>{product.packaging}</span>
                </div>
              )}

              {product.certifications?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {product.certifications.map((cert) => (
                    <span key={cert} className="px-2 py-0.5 rounded-md text-xs font-semibold border"
                      style={{ borderColor: `${accent}40`, color: accent, background: `${accent}10` }}>
                      {cert}
                    </span>
                  ))}
                </div>
              )}

              <a href="#contact"
                className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold border transition-all hover:brightness-110"
                style={{ borderColor: `${primary}40`, color: primary, background: `${primary}10` }}>
                Request Quote →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
