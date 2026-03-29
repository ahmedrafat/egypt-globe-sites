'use client'
import { useEffect, useRef, useState } from 'react'

const iconPaths = {
  utensils: 'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h2a2 2 0 002-2z',
  factory: 'M2 20a2 2 0 002 2h16a2 2 0 002-2V8l-7 5V8l-7 5V4a2 2 0 00-2-2H4a2 2 0 00-2 2v16z',
  flask: 'M9 3h6M8 3v4.7a2 2 0 01-.4 1.2L5 12.5A7 7 0 1019 12.5l-2.6-3.6A2 2 0 0116 7.7V3',
  wheat: 'M3 2l2.5 2.5M12 22V12M12 12C12 7 17 2 17 2M12 12C12 7 7 2 7 2M12 12c5 0 10 5 10 5M12 12c-5 0-10 5-10 5',
  cpu: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
  wifi: 'M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01',
  brain: 'M9.5 2A2.5 2.5 0 017 4.5v.5H5.5a2 2 0 00-2 2V8c0 1.4.8 2.6 2 3.2V11a3 3 0 003 3v5a1 1 0 001 1h3a1 1 0 001-1v-5a3 3 0 003-3v-.8c1.2-.6 2-1.8 2-3.2V7a2 2 0 00-2-2H17v-.5A2.5 2.5 0 0014.5 2h-5z',
  smartphone: 'M12 18h.01M8 2h8a2 2 0 012 2v16a2 2 0 01-2 2H8a2 2 0 01-2-2V4a2 2 0 012-2z',
  ship: 'M2 21c.6.5 1.2 1 2.5 1C7 22 7 20 9.5 20s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M4 19l-1-7h18l-1 7M12 5V2M6 5l-2-3M18 5l2-3M3 12h18M9 5h6',
  plane: 'M17.8 19.2L16 11l3.5-3.5A2 2 0 0017 4.2l-3.5 3.5L5 5.9l-1.3 1.3 5 5 3.5-3.5L16 20.5l1.8-1.3z',
  'file-check': 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6M9 15l2 2 4-4',
  'file-text': 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6M16 13H8M16 17H8M10 9H8',
  gem: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  mountain: 'M8 3l4 8 5-5 5 15H0L3 8l5-5z',
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  sparkles: 'M12 3v1m0 16v1M3 12h1m16 0h1M5.6 5.6l.7.7m11.4-.7l-.7.7M5.6 18.4l.7-.7m11.4.7l-.7-.7M12 8a4 4 0 100 8 4 4 0 000-8z',
  anchor: 'M16 16s-1.5 2-4 2-4-2-4-2M12 2a4 4 0 010 8M12 10v12M5 12H2a10 10 0 0020 0h-3',
  crane: 'M16 16l-4-4-4 4M12 3v9M3 21h18M12 12a2 2 0 100-4 2 2 0 000 4z',
  handshake: 'M4 12h16M7 12L4 9l3-3M17 12l3-3-3-3',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z',
  link: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  'layout-dashboard': 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
  atom: 'M12 12a2 2 0 100-4 2 2 0 000 4zM4.5 7A9.9 9.9 0 0112 5c4.3 0 7.9 2.7 9.5 6.5A10 10 0 0112 19a10 10 0 01-9.5-6.5A10 10 0 014.5 7z',
  droplets: 'M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z',
  package: 'M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
  box: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12',
  wind: 'M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2',
  circle: 'M12 22a10 10 0 100-20 10 10 0 000 20z',
  leaf: 'M17 8C8 10 5.9 16.17 3.82 20.8L5.71 22l1-2.3A4.49 4.49 0 008 20c9 0 14-8 14-17a9.9 9.9 0 00-9-4c-1 .1-1.9.4-2.7.8',
  square: 'M3 3h18v18H3z',
  hexagon: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
  beaker: 'M9 3h6M8 3v4.7a2 2 0 01-.4 1.2L5 12.5A7 7 0 1019 12.5l-2.6-3.6A2 2 0 0016 7.7V3',
  default: 'M12 2a10 10 0 100 20A10 10 0 0012 2z',
}

function Icon({ name, primary }) {
  const path = iconPaths[name] || iconPaths.default
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={primary}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  )
}

export default function FeaturesSection({ site }) {
  const { theme, sections } = site
  const features = sections.features
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
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  if (!features?.items?.length) return null

  const cols = features.items.length <= 3 ? features.items.length : features.items.length <= 4 ? 2 : 3

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            {features.title}
          </h2>
          {features.subtitle && (
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {features.subtitle}
            </p>
          )}
        </div>

        {/* Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(cols, 3)} gap-6`}>
          {features.items.map((item, i) => (
            <div
              key={i}
              className={`group p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-500 hover:-translate-y-1 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{
                transitionDelay: `${i * 80}ms`,
                borderLeft: `3px solid ${primary}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${primary}15` }}
              >
                <Icon name={item.icon} primary={primary} />
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
