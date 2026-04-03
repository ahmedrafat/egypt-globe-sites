'use client'

export default function ProductsPage({ site }) {
  const { theme, sections, brandName } = site
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Header */}
      <div className="mb-16 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4 border"
          style={{ borderColor: `${primary}44`, color: primary, background: `${primary}11` }}
        >
          {brandName} Products
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          {products.title || 'Our Products'}
        </h1>
        {products.subtitle && (
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">{products.subtitle}</p>
        )}
      </div>

      {/* Product grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.items.map((product, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 p-6 flex flex-col gap-4 transition-all hover:border-white/20 hover:-translate-y-0.5"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            {/* Grade badge */}
            {product.grade && (
              <div
                className="self-start px-2.5 py-0.5 rounded text-xs font-semibold"
                style={{ background: `${primary}22`, color: primary }}
              >
                {product.grade}
              </div>
            )}

            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-sm text-gray-400 leading-relaxed flex-1">{product.description}</p>

            {/* Packaging */}
            {product.packaging && (
              <div className="text-xs text-gray-500">
                <span className="text-gray-400 font-medium">Packaging: </span>
                {product.packaging}
              </div>
            )}

            {/* Certifications */}
            {product.certifications?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="px-2 py-0.5 rounded text-xs border"
                    style={{ borderColor: `${accent}44`, color: accent }}
                  >
                    {cert}
                  </span>
                ))}
              </div>
            )}

            {/* Specs table */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="border-t border-white/10 pt-4 space-y-1.5">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-gray-500">{key}</span>
                    <span className="text-gray-300 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
