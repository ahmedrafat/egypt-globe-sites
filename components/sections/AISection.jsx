'use client'
import { useEffect, useRef, useState } from 'react'

export default function AISection({ site }) {
  const { theme, sections } = site
  const ai = sections.aiSection
  const primary = theme.primaryColor
  const accent = theme.accentColor
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

  if (!ai?.highlights?.length && !ai?.title) return null

  return (
    <section
      ref={ref}
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(ellipse at center, ${primary}44 0%, transparent 70%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 border"
              style={{ borderColor: `${primary}44`, color: primary, background: `${primary}11` }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: primary }} />
              AI-Powered
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight">
              {ai.title}
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              {ai.subtitle}
            </p>

            {/* Highlights */}
            {ai.highlights && (
              <ul className="space-y-3">
                {ai.highlights.map((h, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-3 transition-all duration-500 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                    style={{ transitionDelay: `${200 + i * 100}ms` }}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `${primary}20` }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill={primary}>
                        <polyline points="20 6 9 17 4 12" stroke={primary} strokeWidth="3" strokeLinecap="round" fill="none" />
                      </svg>
                    </span>
                    <span className="text-gray-300">{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Visual */}
          <div
            className={`transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <div
              className="relative rounded-2xl border border-white/10 p-8 overflow-hidden"
              style={{ background: `radial-gradient(circle at top right, ${primary}10, transparent 60%)` }}
            >
              {/* Animated lines */}
              <div className="space-y-4">
                {['Analyzing market signals...', 'Route optimization complete', 'Risk score: 0.04', 'Compliance check passed ✓'].map((line, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5"
                    style={{ animationDelay: `${i * 0.5}s` }}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: i === 3 ? '#22c55e' : primary }}
                    />
                    <span className="text-sm font-mono text-gray-400">{line}</span>
                  </div>
                ))}
              </div>

              {/* Bottom badge */}
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xs text-gray-600">EGG AI Architect v2.4</span>
                <div
                  className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full"
                  style={{ background: `${primary}20`, color: primary }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: primary }} />
                  Live
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
