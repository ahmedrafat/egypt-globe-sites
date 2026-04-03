'use client'
import { useEffect, useRef, useState } from 'react'

export default function NetworkSection({ site }) {
  const { theme, sections, brandName } = site
  const network = sections.network
  const primary = theme.primaryColor
  const accent = theme.accentColor || primary
  if (!network) return null

  const connections = network.connections || []
  const destinations = network.destinations || []
  const mapStats = network.mapStats || []

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-8"
        style={{ background: `radial-gradient(circle, ${primary}, transparent 70%)` }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-4 uppercase tracking-wider"
            style={{ borderColor: `${primary}40`, color: primary, background: `${primary}10` }}>
            Network
          </div>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">{network.title || 'Global Network'}</h2>
          {network.subtitle && <p className="text-gray-400 text-lg">{network.subtitle}</p>}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Left: Visual map placeholder */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 min-h-[360px] flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            {/* Animated connection lines visual */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-72 h-72">
                {/* Center hub */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 flex items-center justify-center font-bold text-xs text-center leading-tight z-10"
                  style={{ borderColor: primary, background: `${primary}20`, color: primary }}>
                  {brandName.split(' ')[0]}
                </div>
                {/* Orbiting destinations */}
                {destinations.slice(0, 8).map((dest, i) => {
                  const angle = (i / Math.min(destinations.length, 8)) * 2 * Math.PI - Math.PI / 2
                  const r = 120
                  const x = 50 + (r / 144) * 50 * Math.cos(angle)
                  const y = 50 + (r / 144) * 50 * Math.sin(angle)
                  return (
                    <div key={dest} className="absolute flex items-center justify-center" style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}>
                      {/* Line to center */}
                      <div className="absolute w-px origin-center opacity-20" style={{
                        height: `${r}px`,
                        background: `linear-gradient(to bottom, transparent, ${primary})`,
                        transform: `rotate(${angle + Math.PI / 2}rad)`,
                        transformOrigin: 'top center',
                        top: '50%',
                        left: '50%',
                      }} />
                      <div className="relative px-2 py-1 rounded-lg text-xs font-medium border border-white/10 backdrop-blur-sm whitespace-nowrap"
                        style={{ background: 'rgba(10,10,10,0.9)', color: 'rgba(255,255,255,0.7)' }}>
                        {dest}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            {/* Map stats overlay bottom */}
            {mapStats.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 backdrop-blur-sm flex justify-around"
                style={{ background: 'rgba(10,10,10,0.8)' }}>
                {mapStats.map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-lg font-black" style={{ color: primary }}>{s.value}</div>
                    <div className="text-xs text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Hubs + destinations */}
          <div className="space-y-5">
            {connections.length > 0 && (
              <div className="rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Origin Hubs</div>
                <div className="flex flex-wrap gap-2.5">
                  {connections.map((c) => (
                    <span key={c} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-sm font-semibold"
                      style={{ background: `${primary}18`, color: primary, border: `1px solid ${primary}30` }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: primary }} />
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {destinations.length > 0 && (
              <div className="rounded-2xl border border-white/10 p-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                  Global Destinations <span className="ml-2 px-1.5 py-0.5 rounded text-xs" style={{ background: `${accent}20`, color: accent }}>{destinations.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {destinations.map((d) => (
                    <span key={d} className="px-3 py-1 rounded-lg text-sm border border-white/10 text-gray-300 hover:border-white/25 transition-colors">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* CTA */}
            <div className="rounded-2xl border border-white/10 p-6" style={{ background: `${primary}08`, borderColor: `${primary}20` }}>
              <div className="text-sm font-semibold mb-1" style={{ color: primary }}>Ready to ship globally?</div>
              <p className="text-xs text-gray-500 mb-4">Get a freight quote within 24 hours for any destination worldwide.</p>
              <a href="#contact" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110"
                style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
                Get a Quote →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
