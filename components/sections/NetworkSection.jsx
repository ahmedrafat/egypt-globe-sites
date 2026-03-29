'use client'
import { useEffect, useRef, useState } from 'react'

const PORT_COORDS = {
  Alexandria: { x: 18, y: 36 },
  'Port Said': { x: 22, y: 38 },
  Damietta: { x: 21, y: 35 },
  Sokhna: { x: 23, y: 42 },
  Safaga: { x: 24, y: 48 },
  Nuweiba: { x: 23, y: 52 },
  Cairo: { x: 21, y: 40 },
}

export default function NetworkSection({ site }) {
  const { theme, sections } = site
  const network = sections.network
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

  if (!network?.ports?.length) return null

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            {network.title}
          </h2>
          {network.subtitle && (
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {network.subtitle}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Map visualization */}
          <div
            className={`relative rounded-2xl border border-white/10 overflow-hidden transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
            style={{ background: `radial-gradient(circle at 50% 50%, ${primary}08, transparent)` }}
          >
            <div className="aspect-[4/3] relative p-8">
              {/* Grid lines */}
              <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 75">
                {Array.from({ length: 10 }).map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 7.5} x2="100" y2={i * 7.5} stroke={primary} strokeWidth="0.2" />
                ))}
                {Array.from({ length: 13 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 8} y1="0" x2={i * 8} y2="75" stroke={primary} strokeWidth="0.2" />
                ))}
              </svg>

              {/* Connection lines between ports */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 75">
                {network.ports.length > 1 && network.ports.map((port, i) => {
                  const coords = PORT_COORDS[port]
                  if (!coords) return null
                  const next = network.ports[i + 1]
                  const nextCoords = next ? PORT_COORDS[next] : null
                  if (!nextCoords) return null
                  return (
                    <line
                      key={`line-${i}`}
                      x1={coords.x}
                      y1={coords.y}
                      x2={nextCoords.x}
                      y2={nextCoords.y}
                      stroke={primary}
                      strokeWidth="0.3"
                      strokeDasharray="1 1"
                      opacity="0.4"
                    />
                  )
                })}

                {/* Port dots */}
                {network.ports.map((port) => {
                  const coords = PORT_COORDS[port] || { x: 20, y: 40 }
                  return (
                    <g key={port}>
                      <circle cx={coords.x} cy={coords.y} r="1.5" fill={primary} opacity="0.9" />
                      <circle cx={coords.x} cy={coords.y} r="3" fill={primary} opacity="0.2" />
                      <text x={coords.x + 2} y={coords.y - 1} fontSize="2.5" fill="white" opacity="0.8">
                        {port}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          {/* Port list */}
          <div className="space-y-4">
            {network.ports.map((port, i) => (
              <div
                key={port}
                className={`flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 transition-all duration-500 hover:bg-white/10 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: `${primary}20`, border: `1px solid ${primary}44` }}
                >
                  <span style={{ color: primary }} className="text-sm font-bold">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <div className="font-semibold">{port}</div>
                  <div className="text-xs text-gray-500">Active Operations</div>
                </div>
                <div
                  className="ml-auto w-2 h-2 rounded-full animate-pulse"
                  style={{ background: primary }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
