'use client'
import { useEffect, useRef, useState } from 'react'

const DEFAULT_CERTS = [
  { name: 'ISO 9001', body: 'Quality Management System', year: '2023', icon: '🏆' },
  { name: 'ISO 14001', body: 'Environmental Management', year: '2022', icon: '🌿' },
  { name: 'Halal Certified', body: 'ESMA / Gulf Halal Authority', year: '2024', icon: '☪️' },
  { name: 'Phytosanitary', body: 'Egyptian NPPO — MALR', year: '2024', icon: '🌾' },
  { name: 'CE Mark', body: 'European Conformity', year: '2023', icon: '🇪🇺' },
]

function CertCard({ cert, primary, accent, index }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="group relative flex flex-col items-center text-center rounded-2xl border border-white/8 p-6 transition-all duration-300 hover:border-white/20 hover:-translate-y-1 cursor-default"
      style={{
        background: 'rgba(255,255,255,0.025)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.5s ${index * 0.08}s, transform 0.5s ${index * 0.08}s, border-color 0.2s`,
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 32px ${primary}18` }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Icon badge */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${primary}15`, border: `1px solid ${primary}25` }}
      >
        {cert.icon}
      </div>

      <h3 className="font-bold text-base text-white mb-1">{cert.name}</h3>
      <p className="text-xs text-gray-500 leading-snug mb-3">{cert.body}</p>

      {/* Year chip */}
      <span
        className="px-3 py-1 rounded-full text-xs font-semibold"
        style={{ background: `${primary}15`, color: primary }}
      >
        Since {cert.year}
      </span>

      {/* Bottom gradient line on hover */}
      <div
        className="absolute bottom-0 left-6 right-6 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded"
        style={{ background: `linear-gradient(to right, ${primary}, ${accent || primary})` }}
      />
    </div>
  )
}

export default function CertificationsSection({ site }) {
  const { theme, sections } = site
  const primary = theme.primaryColor
  const accent = theme.accentColor || primary

  const rawItems = sections.certifications?.items
  const items = rawItems?.length > 0 ? rawItems : DEFAULT_CERTS

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden border-t border-white/5">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage: `linear-gradient(${primary}88 1px, transparent 1px), linear-gradient(90deg, ${primary}88 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-4 uppercase tracking-wider"
            style={{ borderColor: `${primary}40`, color: primary, background: `${primary}10` }}
          >
            {sections.certifications?.badge || 'Certifications & Compliance'}
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">
            {sections.certifications?.title || 'Internationally Certified'}
          </h2>
          {sections.certifications?.subtitle && (
            <p className="text-gray-400 text-lg">{sections.certifications.subtitle}</p>
          )}
          <div className="flex justify-center mt-6">
            <div
              className="h-1 w-16 rounded-full"
              style={{ background: `linear-gradient(to right, ${primary}, ${accent})` }}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((cert, i) => (
            <CertCard key={i} cert={cert} primary={primary} accent={accent} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
