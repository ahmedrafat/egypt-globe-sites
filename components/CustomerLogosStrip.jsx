/**
 * CustomerLogosStrip — "Trusted by" home strip showing customer logos
 * (or anonymized labels when no logo image is uploaded). Server component.
 */
import { getCustomerLogos } from '../lib/corporatePages'

export default async function CustomerLogosStrip({ variant = 'home' }) {
  const logos = await getCustomerLogos()
  if (logos.length === 0) return null

  if (variant === 'compact') {
    // Compact strip — used in the footer (dark bg variant)
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {logos.slice(0, 8).map(l => <CompactCard key={l.id} logo={l} />)}
      </div>
    )
  }

  // Full home-strip variant
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-16 sm:py-20 border-b border-slate-200 relative overflow-hidden">
      {/* Subtle background dots */}
      <div aria-hidden="true" className="absolute inset-0 bg-dots-pattern opacity-[0.35] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="section-eyebrow bg-emerald-50 text-emerald-700 border border-emerald-100 mb-4">
            <span aria-hidden="true">✦</span> Trusted by B2B buyers worldwide
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-4">
            Import partners across {logos.length}+ countries
          </h2>
          <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">
            Some buyer names withheld at the customer's request — anonymized below.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 stagger-children">
          {logos.map(l => <FullCard key={l.id} logo={l} />)}
        </div>
      </div>
    </section>
  )
}

function FullCard({ logo }) {
  const Inner = (
    <div className="group relative rounded-2xl border border-slate-200 bg-white p-4 hover:border-[#1d5fa1]/40 hover:shadow-md transition-all h-full flex items-center gap-3.5 overflow-hidden">
      {/* Hover bottom bar */}
      <span aria-hidden="true" className="card-bottom-bar" />

      {/* Icon / logo */}
      {logo.logo_url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={logo.logo_url} alt={logo.label} className="h-10 w-10 object-contain flex-shrink-0 rounded-lg" />
      ) : (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-emerald-50 border border-slate-100 flex items-center justify-center text-xl">
          {iconForSector(logo.sector)}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-[#1d5fa1] transition-colors">
          {logo.label}
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
          {logo.country && (
            <span className="flex items-center gap-1">
              <span aria-hidden="true" className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {logo.country}
            </span>
          )}
          {logo.country && logo.sector && <span className="text-slate-200">·</span>}
          {logo.sector && <span className="text-slate-400">{logo.sector}</span>}
        </div>
        {logo.hint && (
          <div className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">{logo.hint}</div>
        )}
      </div>
    </div>
  )
  return logo.link_url
    ? <a href={logo.link_url} target="_blank" rel="noopener noreferrer">{Inner}</a>
    : Inner
}

function CompactCard({ logo }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-center min-h-[64px] flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-colors">
      {logo.logo_url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={logo.logo_url} alt={logo.label} className="h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity" />
      ) : (
        <span className="text-[10px] font-semibold text-slate-400 line-clamp-2 leading-tight">{logo.label}</span>
      )}
    </div>
  )
}

function iconForSector(sector) {
  const s = String(sector || '').toLowerCase()
  if (s.includes('cement') || s.includes('construct')) return '🏗'
  if (s.includes('chem')) return '⚗️'
  if (s.includes('food') || s.includes('beverage')) return '🍴'
  if (s.includes('pharma')) return '💊'
  if (s.includes('fertilizer')) return '🌾'
  if (s.includes('public')) return '🏛'
  if (s.includes('multi')) return '🌐'
  if (s.includes('mining')) return '⛏️'
  if (s.includes('water')) return '💧'
  if (s.includes('textile') || s.includes('leather')) return '🧵'
  return '✦'
}
