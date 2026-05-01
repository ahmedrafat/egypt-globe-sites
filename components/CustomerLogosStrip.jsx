/**
 * CustomerLogosStrip — "Trusted by" home strip showing customer logos
 * (or anonymized labels when no logo image is uploaded). Server component.
 */
import { getCustomerLogos } from '../lib/corporatePages'

export default async function CustomerLogosStrip({ variant = 'home' }) {
  const logos = await getCustomerLogos()
  if (logos.length === 0) return null

  if (variant === 'compact') {
    // Compact strip — used in the footer
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {logos.slice(0, 8).map(l => <CompactCard key={l.id} logo={l} />)}
      </div>
    )
  }

  // Full home-strip variant
  return (
    <section className="bg-white py-14 sm:py-16 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
            Trusted by
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            B2B importers across {logos.length}+ countries.
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
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
    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-4 hover:border-[#1d5fa1]/40 hover:shadow-sm transition-all h-full flex items-center gap-3">
      {logo.logo_url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={logo.logo_url} alt={logo.label} className="h-10 w-10 object-contain flex-shrink-0" />
      ) : (
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center text-lg">
          {iconForSector(logo.sector)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2">{logo.label}</div>
        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
          {logo.country && <span>{logo.country}</span>}
          {logo.country && logo.sector && <span className="text-slate-300">·</span>}
          {logo.sector && <span>{logo.sector}</span>}
        </div>
        {logo.hint && <div className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">{logo.hint}</div>}
      </div>
    </div>
  )
  return logo.link_url
    ? <a href={logo.link_url} target="_blank" rel="noopener noreferrer">{Inner}</a>
    : Inner
}

function CompactCard({ logo }) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-center min-h-[60px] flex items-center justify-center">
      {logo.logo_url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={logo.logo_url} alt={logo.label} className="h-7 w-auto object-contain opacity-80" />
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
  return '✦'
}
