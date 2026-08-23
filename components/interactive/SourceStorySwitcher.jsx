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
 *
 * Light editorial edition — rock salt = deep gold tint, sea salt = clear
 * turquoise tint (tokens + utilities in app/globals.css).
 */
import { useState } from 'react'
import Icon from '../ui/Icon'

const SOURCES = {
  rock: {
    label: 'Rock Salt',
    icon: 'pickaxe',
    badge: 'Mined',
    panelBg: 'linear-gradient(160deg, #fbf3e3 0%, #f3e3c0 100%)',
    accent: '#8a6d3b',
    badgeBg: 'bg-[#fbf3e3] text-[#8a6d3b] border-[#b8862b]/45',
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
    icon: 'wave',
    badge: 'Solar-evaporated',
    panelBg: 'linear-gradient(160deg, #e6fbf8 0%, #c9f3ee 100%)',
    accent: '#0b8f84',
    badgeBg: 'bg-[#e6fbf8] text-[#0b8f84] border-[#0fb5a5]/45',
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
    <div className="rounded-3xl ring-1 ring-[#14161a]/10 bg-white overflow-hidden">
      <div className="flex items-stretch border-b border-[#14161a]/10">
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
                  ? 'bg-[#14161a] text-white'
                  : 'bg-[#f9fafb] text-[#3f4650] hover:bg-[#f3f4f6]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon name={s.icon} className="w-5 h-5" />
                <div className="min-w-0">
                  <div className={`text-[10px] font-mono uppercase tracking-[0.16em] ${isActive ? 'text-white/60' : 'text-[#7a8290]'}`}>
                    {s.badge}
                  </div>
                  <div className="font-semibold text-sm sm:text-base">{s.label}</div>
                </div>
                {isThisPage && (
                  <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/15 text-white' : 'bg-[#e6fbf8] text-[#0b8f84]'
                  }`}>
                    This product
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="relative overflow-hidden text-[#14161a] p-6 sm:p-8" style={{ background: src.panelBg }}>
        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <Stat label="Source location" value={src.location} accent={src.accent} />
          <Stat label="Purity floor" value={src.purity} accent={src.accent} />
          <Stat label="Origin character" value={src.formationAge} accent={src.accent} />
        </div>

        <h3 className="egg-display relative text-2xl sm:text-3xl leading-tight mb-3 text-[#14161a]">{src.title}</h3>
        <ul className="relative space-y-2">
          {src.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#3f4650] leading-relaxed">
              <svg className="w-4 h-4 shrink-0 mt-0.5" style={{ color: src.accent }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="relative mt-5 pt-5 border-t border-[#14161a]/10 flex items-center gap-2 text-xs">
          <span className="text-[#7a8290]">Loads from:</span>
          <span className="font-semibold text-[#14161a]">{src.portsHint}</span>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-[0.16em] mb-0.5" style={{ color: accent }}>{label}</div>
      <div className="text-sm font-semibold text-[#14161a] leading-tight">{value}</div>
    </div>
  )
}
