'use client'
import { useEffect, useRef, useState } from 'react'

const TRUSTED_BY = [
  'Carrefour Egypt',
  'Metro Group',
  'Lidl International',
  'Al-Meera Qatar',
  'Spinneys UAE',
]

export default function HeroSection({ site }) {
  const { theme, sections, brandName, brandLogo } = site
  const hero = sections.hero
  const stats = sections.stats?.items?.slice(0, 4) || []
  const primary = theme.primaryColor
  const accent = theme.accentColor || primary
  const titleLines = (hero.title || '').split('\n')

  // Floating badge animation state
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#0A0A0A' }}
    >
      {/* Animated gradient background */}
      <style>{`
        @keyframes heroGradientShift {
          0%   { opacity: 0.13; transform: scale(1)   rotate(0deg); }
          50%  { opacity: 0.18; transform: scale(1.1) rotate(8deg); }
          100% { opacity: 0.13; transform: scale(1)   rotate(0deg); }
        }
        @keyframes heroGradientShift2 {
          0%   { opacity: 0.08; transform: scale(1)   rotate(0deg); }
          50%  { opacity: 0.13; transform: scale(1.12) rotate(-6deg); }
          100% { opacity: 0.08; transform: scale(1)   rotate(0deg); }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes floatBadge2 {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-9px); }
        }
      `}</style>

      {/* Radial glow backgrounds — now animated */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full blur-[140px]"
          style={{
            background: `radial-gradient(circle, ${primary}, transparent 70%)`,
            animation: 'heroGradientShift 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-0 -left-32 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{
            background: `radial-gradient(circle, ${accent}, transparent 70%)`,
            animation: 'heroGradientShift2 10s ease-in-out infinite',
          }}
        />
      </div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 xl:gap-20 items-center">
          {/* LEFT: Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold mb-8 tracking-wide uppercase"
              style={{ borderColor: `${primary}50`, color: primary, background: `${primary}12` }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: primary }} />
              {hero.badge || brandName}
            </div>

            {/* Title */}
            <h1
              className="font-black leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
            >
              {titleLines.map((line, i) => (
                <span key={i} className="block">
                  {i === 1 ? (
                    <span
                      style={{
                        background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
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
                <a
                  href={hero.ctaLink || '#contact'}
                  className="group flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.03] hover:brightness-110 active:scale-[0.99]"
                  style={{
                    background: `linear-gradient(135deg, ${primary}, ${accent})`,
                    boxShadow: `0 8px 32px ${primary}45`,
                  }}
                >
                  {hero.ctaText}
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              )}
              {hero.secondaryCta && (
                <a
                  href={hero.secondaryCtaLink || '#'}
                  className="group flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm border transition-all hover:bg-white/5 hover:border-white/30 active:scale-[0.99]"
                  style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.75)' }}
                >
                  {hero.secondaryCta}
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    <path d="M7 17L17 7M7 7h10v10" />
                  </svg>
                </a>
              )}
            </div>

            {/* Inline stats row */}
            {stats.length > 0 && (
              <div className="flex flex-wrap gap-6 mb-10">
                {stats.map((s, i) => (
                  <div key={i} className="flex items-baseline gap-2">
                    <span className="text-2xl font-black" style={{ color: primary }}>{s.value}</span>
                    <span className="text-xs text-gray-500">{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Trusted by row */}
            <div>
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-4 font-semibold">
                Trusted by global retailers &amp; importers
              </p>
              <div className="flex flex-wrap gap-4">
                {TRUSTED_BY.map((name) => (
                  <span
                    key={name}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/8 text-gray-500"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Floating visual card */}
          <div className="hidden lg:block relative">
            {/* Floating stat badges */}
            <div
              className="absolute -left-10 top-10 z-10 px-4 py-2.5 rounded-2xl border border-white/12 backdrop-blur-md text-center"
              style={{
                background: 'rgba(10,10,10,0.92)',
                animation: 'floatBadge 4s ease-in-out infinite',
              }}
            >
              <div className="text-xl font-black" style={{ color: primary }}>500+</div>
              <div className="text-xs text-gray-500">Orders / Year</div>
            </div>

            <div
              className="absolute -right-6 top-1/3 z-10 px-4 py-2.5 rounded-2xl border border-white/12 backdrop-blur-md text-center"
              style={{
                background: 'rgba(10,10,10,0.92)',
                animation: 'floatBadge2 5s ease-in-out infinite',
                animationDelay: '1s',
              }}
            >
              <div className="text-xl font-black" style={{ color: accent }}>60+</div>
              <div className="text-xs text-gray-500">Markets</div>
            </div>

            <div
              className="absolute -left-6 bottom-12 z-10 px-4 py-2.5 rounded-2xl border border-white/12 backdrop-blur-md text-center"
              style={{
                background: 'rgba(10,10,10,0.92)',
                animation: 'floatBadge 6s ease-in-out infinite',
                animationDelay: '2s',
              }}
            >
              <div className="text-xl font-black" style={{ color: primary }}>15+</div>
              <div className="text-xs text-gray-500">Years in Business</div>
            </div>

            {/* Glow behind card */}
            <div
              className="absolute inset-0 scale-90 rounded-3xl blur-2xl opacity-20"
              style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}
            />

            <div
              className="relative rounded-3xl border border-white/10 p-7 backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              {/* Card header */}
              <div className="flex items-center gap-3 mb-7">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${primary}20` }}
                >
                  {brandLogo}
                </div>
                <div>
                  <div className="font-bold text-sm">{brandName}</div>
                  <div className="text-xs text-gray-500">Performance Overview</div>
                </div>
                <div
                  className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: '#22c55e18', color: '#22c55e' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live
                </div>
              </div>

              {/* 2x2 stats grid */}
              {stats.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {stats.slice(0, 4).map((s, i) => (
                    <div
                      key={i}
                      className="rounded-2xl p-4 border border-white/5"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
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
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${value}%`, background: `linear-gradient(to right, ${primary}, ${accent})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating chip top-right */}
            <div
              className="absolute -top-3 -right-3 px-3 py-1.5 rounded-xl text-xs font-bold border border-white/10 backdrop-blur-md"
              style={{ background: 'rgba(10,10,10,0.95)' }}
            >
              ✦ {hero.badge || 'Trusted Globally'}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0A0A0A)' }}
      />
    </section>
  )
}
