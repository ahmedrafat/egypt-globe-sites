'use client'
import { useEffect, useRef, useState } from 'react'

function StatCard({ item, primary, visible }) {
  return (
    <div
      className={`text-center p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      <div
        className="text-4xl sm:text-5xl font-extrabold mb-2"
        style={{ color: primary }}
      >
        {item.value}
      </div>
      <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">
        {item.label}
      </div>
    </div>
  )
}

export default function StatsSection({ site }) {
  const { theme, sections } = site
  const stats = sections.stats
  const primary = theme.primaryColor
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  if (!stats?.items?.length) return null

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.items.map((item, i) => (
            <div
              key={i}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <StatCard item={item} primary={primary} visible={visible} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
