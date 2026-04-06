'use client'
import { useEffect, useRef, useState } from 'react'

function buildProducts(site) {
  const { sections } = site

  // Priority: sections.products.items (array of objects or strings)
  // Fallback: sections.features.items
  const rawItems = sections.productsGrid?.items || sections.products?.items || sections.features?.items

  if (!rawItems?.length) return []

  return rawItems.map((item) => {
    if (typeof item === 'string') {
      return { name: item, description: '', specs: {} }
    }
    return item
  })
}

function ProductCard({ product, primary, accent, index }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const specs = product.specs || {}
  const specEntries = Object.entries(specs).filter(([, v]) => v)

  return (
    <div
      ref={ref}
      className="group relative flex flex-col rounded-2xl border border-white/8 overflow-hidden transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.025)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ${index * 0.08}s, transform 0.6s ${index * 0.08}s, border-color 0.2s`,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 40px ${primary}14` }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Top color strip */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(to right, ${primary}, ${accent || primary})` }}
      />

      <div className="p-6 flex flex-col flex-1">
        {/* Icon + name */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ background: `${primary}18` }}
          >
            {product.icon || '📦'}
          </div>
          <div>
            <h3 className="font-bold text-white text-base leading-tight">{product.name}</h3>
            {product.category && (
              <span className="text-xs text-gray-500">{product.category}</span>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-1">{product.description}</p>
        )}

        {/* Specs row */}
        {specEntries.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {specEntries.map(([key, val]) => (
              <span
                key={key}
                className="px-2.5 py-1 rounded-lg text-xs font-medium border border-white/8"
                style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)' }}
              >
                <span className="text-gray-600 mr-1 capitalize">{key}:</span>{val}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <a
          href="#contact"
          className="mt-auto flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.02]"
          style={{
            background: `${primary}18`,
            border: `1px solid ${primary}30`,
            color: primary,
          }}
        >
          Request Quote <span>→</span>
        </a>
      </div>
    </div>
  )
}

export default function ProductsGridSection({ site }) {
  const { theme, sections } = site
  const primary = theme.primaryColor
  const accent = theme.accentColor || primary
  const products = buildProducts(site)

  if (!products.length) return null

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden border-t border-white/5">
      {/* Background glow */}
      <div
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[100px] opacity-[0.05] pointer-events-none"
        style={{ background: primary }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-4 uppercase tracking-wider"
            style={{ borderColor: `${primary}40`, color: primary, background: `${primary}10` }}
          >
            {sections.productsGrid?.badge || 'Product Catalogue'}
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            {sections.productsGrid?.title || sections.products?.title || 'Our Key Products'}
          </h2>
          {(sections.productsGrid?.subtitle || sections.products?.subtitle) && (
            <p className="text-gray-400 text-lg">
              {sections.productsGrid?.subtitle || sections.products?.subtitle}
            </p>
          )}
          <div className="flex justify-center mt-6">
            <div
              className="h-1 w-16 rounded-full"
              style={{ background: `linear-gradient(to right, ${primary}, ${accent})` }}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product, i) => (
            <ProductCard key={i} product={product} primary={primary} accent={accent} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.03] hover:brightness-110"
            style={{
              background: `linear-gradient(135deg, ${primary}, ${accent})`,
              boxShadow: `0 8px 32px ${primary}35`,
            }}
          >
            Request Full Product List <span>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
