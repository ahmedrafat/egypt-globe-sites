'use client'
import { useEffect, useRef, useState } from 'react'

const ICON_EMOJI = {
  flask: '⚗️', factory: '🏭', 'file-check': '✅', ship: '🚢', wheat: '🌾', zap: '⚡',
  cpu: '⚙️', brain: '🧠', smartphone: '📱', wifi: '☁️', 'bar-chart': '📊', globe: '🌍',
  anchor: '⚓', truck: '🚛', leaf: '🌿', gem: '💎', settings: '🔧', users: '👥',
  shield: '🛡️', hammer: '🔨', chart: '📈', monitor: '🖥️', database: '🗄️',
  beaker: '⚗️', utensils: '🍴', lock: '🔒', layers: '📦', star: '⭐',
}

function FeatureCard({ item, primary, accent, index }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const emoji = ICON_EMOJI[item.icon] || '●'

  return (
    <div ref={ref}
      className="group relative rounded-2xl border border-white/8 p-6 transition-all duration-300 hover:border-white/20 hover:-translate-y-1 cursor-default"
      style={{
        background: 'rgba(255,255,255,0.02)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(16px)',
        transition: `opacity 0.6s ${index * 0.08}s, transform 0.6s ${index * 0.08}s, border-color 0.2s, box-shadow 0.2s`,
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 40px ${primary}15`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 transition-all group-hover:scale-110"
        style={{ background: `${primary}15` }}>
        {emoji}
      </div>
      <h3 className="font-bold text-base mb-2.5 text-white">{item.title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>

      {/* Bottom accent line on hover */}
      <div className="absolute bottom-0 left-6 right-6 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded"
        style={{ background: `linear-gradient(to right, ${primary}, ${accent || primary})` }} />
    </div>
  )
}

export default function FeaturesSection({ site }) {
  const { theme, sections, brandName } = site
  const features = sections.features
  const primary = theme.primaryColor
  const accent = theme.accentColor || primary
  if (!features?.items?.length) return null

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: `linear-gradient(${primary}88 1px, transparent 1px), linear-gradient(90deg, ${primary}88 1px, transparent 1px)`, backgroundSize: '80px 80px' }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-4 uppercase tracking-wider"
            style={{ borderColor: `${primary}40`, color: primary, background: `${primary}10` }}>
            {brandName}
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">{features.title || 'Why Choose Us'}</h2>
          {features.subtitle && <p className="text-gray-400 text-lg">{features.subtitle}</p>}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.items.map((item, i) => (
            <FeatureCard key={i} item={item} primary={primary} accent={accent} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
