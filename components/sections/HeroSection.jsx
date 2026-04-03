'use client'
import { useEffect, useRef } from 'react'

export default function HeroSection({ site }) {
  const { theme, sections, brandName, brandLogo } = site
  const hero = sections.hero
  const stats = sections.stats?.items?.slice(0, 4) || []
  const primary = theme.primaryColor
  const accent = theme.accentColor || primary
  const titleLines = (hero.title || '').split('\n')

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: '#0A0A0A' }}>
      {/* Radial glow backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full blur-[140px] opacity-15"
          style={{ background: `radial-gradient(circle, ${primary}, transparent 70%)` }} />
        <div className="absolute bottom-0 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10"
          style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }} />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 xl:gap-20 items-center">
          {/* LEFT: Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold mb-8 tracking-wide uppercase"
              style={{ borderColor: `${primary}50`, color: primary, background: `${primary}12` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: primary }} />
              {hero.badge || brandName}
            </div>

            {/* Title */}
            <h1 className="font-black leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
              {titleLines.map((line, i) => (
                <span key={i} className="block">
                  {i === 1 ? (
                    <span style={{
                      background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}>
                      {line}
                    </span>
                  ) : line}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-10 max-w-xl">
              {hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              {hero.ctaText && (
                <a href={hero.ctaLink || '#contact'}
                  className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02] hover:brightness-110"
                  style={{ background: `linear-gradient(135deg, ${primary}, ${accent})`, boxShadow: `0 8px 32px ${primary}40` }}>
                  {hero.ctaText}
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </a>
              )}
              {hero.secondaryCta && (
                <a href={hero.secondaryCtaLink || '#'}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm border transition-all hover:bg-white/5 hover:border-white/30"
                  style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)' }}>
                  {hero.secondaryCta} <span>↗</span>
                </a>
              )}
            </div>

            {/* Inline stats row */}
            {stats.length > 0 && (
              <div className="flex flex-wrap gap-6">
                {stats.map((s, i) => (
                  <div key={i} className="flex items-baseline gap-2">
                    <span className="text-2xl font-black" style={{ color: primary }}>{s.value}</span>
                    <span className="text-xs text-gray-500">{s.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Floating visual card */}
          <div className="hidden lg:block relative">
            {/* Glow behind card */}
            <div className="absolute inset-0 scale-90 rounded-3xl blur-2xl opacity-20"
              style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }} />

            <div className="relative rounded-3xl border border-white/10 p-7 backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              {/* Card header */}
              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${primary}20` }}>
                  {brandLogo}
                </div>
                <div>
                  <div className="font-bold text-sm">{brandName}</div>
                  <div className="text-xs text-gray-500">Performance Overview</div>
                </div>
                <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: '#22c55e18', color: '#22c55e' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Live
                </div>
              </div>

              {/* 2x2 stats grid */}
              {stats.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {stats.slice(0, 4).map((s, i) => (
                    <div key={i} className="rounded-2xl p-4 border border-white/5"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="text-xl font-black mb-0.5" style={{ color: primary }}>{s.value}</div>
                      <div className="text-xs text-gray-500 leading-tight">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Progress bars */}
              <div className="space-y-3.5">
                {[
                  { label: 'Quality Score', value: 98 },
                  { label: 'On-Time Delivery', value: 96 },
                  { label: 'Client Satisfaction', value: 99 },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-semibold" style={{ color: primary }}>{value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full"
                        style={{ width: `${value}%`, background: `linear-gradient(to right, ${primary}, ${accent})` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating chip top-right */}
            <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-xl text-xs font-bold border border-white/10 backdrop-blur-md"
              style={{ background: 'rgba(10,10,10,0.95)' }}>
              ✦ {hero.badge || 'Trusted Globally'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0A0A0A)' }} />
    </section>
  )
}
