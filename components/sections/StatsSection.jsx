'use client'
import { useEffect, useRef, useState } from 'react'

function StatCard({ item, primary, accent, index }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref}
      className="relative flex flex-col items-center text-center px-8 py-6 group"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(12px)', transition: `opacity 0.5s ${index * 0.1}s, transform 0.5s ${index * 0.1}s` }}>
      <div className="text-4xl sm:text-5xl font-black mb-2 tabular-nums"
        style={{ background: `linear-gradient(135deg, ${primary}, ${accent || primary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        {item.value}
      </div>
      <div className="text-sm text-gray-500 font-medium max-w-[140px] leading-snug">{item.label}</div>
    </div>
  )
}

export default function StatsSection({ site }) {
  const { theme, sections } = site
  const items = sections.stats?.items || []
  const primary = theme.primaryColor
  const accent = theme.accentColor || primary
  if (!items.length) return null

  return (
    <section className="relative border-y border-white/5 overflow-hidden">
      <div className="absolute inset-0"
        style={{ background: `linear-gradient(to right, ${primary}08, transparent 40%, transparent 60%, ${accent}08)` }} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/5">
          {items.map((item, i) => (
            <StatCard key={i} item={item} primary={primary} accent={accent} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
