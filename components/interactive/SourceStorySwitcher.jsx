'use client'

/**
 * SourceStorySwitcher — Drop 132 interactive widget.
 *
 * For salt SKU pages, an animated toggle between the two source families
 * (sea salt / rock salt) — buyer can compare the two origin stories side
 * by side without leaving the page. Replaces the static "Origin" sidebar
 * card from the Drop 131 ProductDetailBlock with a richer narrative that
 * doubles as cross-sell (rock-salt buyer can see the sea-salt story for
 * future sourcing).
 *
 * On non-salt SKU pages, render the page's own source paragraph as a
 * single static panel (no toggle needed) so the component is reusable.
 */
import { useState } from 'react'

const SOURCES = {
  rock: {
    label: 'Rock Salt',
    icon: '⛏️',
    badge: 'Mined',
    accentBg: 'from-stone-700 via-stone-800 to-stone-900',
    badgeBg: 'bg-stone-100 text-stone-800 border-stone-300',
    title: 'Mined from Egypt\'s ancient halite deposits',
    location: 'Siwa Oasis · Qattara Depression',
    purity: '≥97% NaCl guaranteed',
    formationAge: '30+ million years',
    bullets: [
      'Underground rock-salt mines, ancient deposits formed by paleoenvironmental seas',
      'Crusher → washer → screen → dryer → packing line',
      'Naturally low moisture (typically < 0.5%) — kiln-drying optional',
      'Ideal for de-icing, chlor-alkali, drilling fluids, water softening',
    ],
    portsHint: 'El Dekheila · Alexandria · Damietta · Ain Sokhna',
  },
  sea: {
    label: 'Sea Salt',
    icon: '🌊',
    badge: 'Solar-evaporated',
    accentBg: 'from-cyan-700 via-blue-800 to-[#0f1f3a]',
    badgeBg: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    title: 'Solar-evaporated from Egypt\'s coastal pans',
    location: 'North Sinai (El-Arish / Bardawil) · Red Sea',
    purity: '94–99.5% NaCl across grades',
    formationAge: 'Year-round seasonal harvest',
    bullets: [
      'Saltworks fed by Mediterranean / Red Sea — solar-driven evaporation cycle',
      '~2,700 kWh/m² annual irradiance — the highest in the Mediterranean basin',
      'Naturally mineral-balanced (Mg, K, Br retained at trace levels)',
      'Ideal for food-grade table salt, cosmetic, pharmaceutical, pool',
    ],
    portsHint: 'Al-Arish · Port Said East · Damietta · Ain Sokhna',
  },
}

export default function SourceStorySwitcher({ pageSourceType }) {
  const initial = pageSourceType?.toLowerCase().includes('rock')
    ? 'rock'
    : pageSourceType?.toLowerCase().includes('sea')
      ? 'sea'
      : 'sea'
  const [active, setActive] = useState(initial)
  const src = SOURCES[active]

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-stretch border-b border-slate-200">
        {(['rock', 'sea']).map(key => {
          const s = SOURCES[key]
          const isActive = active === key
          const isThisPage = (initial === key)
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`flex-1 px-4 sm:px-5 py-3.5 text-left transition-all ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{s.icon}</span>
                <div className="min-w-0">
                  <div className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-white/60' : 'text-slate-500'}`}>
                    {s.badge}
                  </div>
                  <div className="font-bold text-sm sm:text-base">{s.label}</div>
                </div>
                {isThisPage && (
                  <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/15 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    This product
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className={`bg-gradient-to-br ${src.accentBg} text-white p-6 sm:p-8`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <Stat label="Source location" value={src.location} />
          <Stat label="Purity floor" value={src.purity} />
          <Stat label="Origin character" value={src.formationAge} />
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold leading-tight mb-3">{src.title}</h3>
        <ul className="space-y-2">
          {src.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-white/90 leading-relaxed">
              <svg className="w-4 h-4 text-white/60 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 pt-5 border-t border-white/15 flex items-center gap-2 text-xs">
          <span className="text-white/60">Loads from:</span>
          <span className="font-semibold">{src.portsHint}</span>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-white/55 font-bold mb-0.5">{label}</div>
      <div className="text-sm font-semibold text-white leading-tight">{value}</div>
    </div>
  )
}
