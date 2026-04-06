'use client'
import { useEffect, useRef, useState } from 'react'

const DEFAULT_TESTIMONIALS = [
  {
    quote: "Egypt Globe has been our most reliable supplier for over 5 years. Their quality standards and on-time delivery are exceptional in the Egyptian export market.",
    author: "Marcus Hoffmann",
    company: "Hoffmann Trading GmbH",
    flag: "🇩🇪",
  },
  {
    quote: "We import significant volumes of agricultural commodities through Egypt Globe. Their documentation is always flawless and their team handles compliance with expertise.",
    author: "Priya Nair",
    company: "Nair Commodities Pte Ltd",
    flag: "🇸🇬",
  },
  {
    quote: "Competitive pricing, premium quality, and a team that understands international trade. Egypt Globe is our first call for any Egyptian-origin goods.",
    author: "Abdulrahman Al-Khalidi",
    company: "Al-Khalidi Import & Export",
    flag: "🇸🇦",
  },
]

function TestimonialCard({ item, primary, accent, index }) {
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

  return (
    <div
      ref={ref}
      className="relative rounded-2xl border border-white/8 p-7 flex flex-col gap-5 transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.025)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ${index * 0.12}s, transform 0.6s ${index * 0.12}s, border-color 0.2s`,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 40px ${primary}12` }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Quote mark */}
      <div className="text-5xl font-serif leading-none select-none" style={{ color: `${primary}40` }}>&ldquo;</div>

      {/* Quote text */}
      <p className="text-gray-300 text-sm leading-relaxed flex-1 -mt-6">{item.quote}</p>

      {/* Author row */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/8">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
          style={{ background: `${primary}20` }}
        >
          {item.flag}
        </div>
        <div>
          <div className="font-semibold text-sm text-white">{item.author}</div>
          <div className="text-xs text-gray-500">{item.company}</div>
        </div>
      </div>

      {/* Subtle bottom glow line */}
      <div
        className="absolute bottom-0 left-8 right-8 h-px rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, transparent, ${primary}60, transparent)` }}
      />
    </div>
  )
}

export default function TestimonialsSection({ site }) {
  const { theme, sections, brandName } = site
  const primary = theme.primaryColor
  const accent = theme.accentColor || primary

  const rawItems = sections.testimonials?.items
  const items = rawItems?.length > 0 ? rawItems : DEFAULT_TESTIMONIALS

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden border-t border-white/5">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[120px] opacity-[0.04] pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${primary}, transparent 70%)` }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-4 uppercase tracking-wider"
            style={{ borderColor: `${primary}40`, color: primary, background: `${primary}10` }}
          >
            {sections.testimonials?.badge || 'Client Testimonials'}
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            {sections.testimonials?.title || 'Trusted by Global Traders'}
          </h2>
          {(sections.testimonials?.subtitle) && (
            <p className="text-gray-400 text-lg">{sections.testimonials.subtitle}</p>
          )}

          {/* Accent line */}
          <div className="flex justify-center mt-6">
            <div
              className="h-1 w-16 rounded-full"
              style={{ background: `linear-gradient(to right, ${primary}, ${accent})` }}
            />
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <TestimonialCard key={i} item={item} primary={primary} accent={accent} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
