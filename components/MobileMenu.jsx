'use client'

/**
 * MobileMenu — slide-in drawer navigation for screens < lg.
 *
 * Replaces the desktop mega-menus on mobile/tablet. Touch-friendly
 * tap targets, accordion sub-sections for Products / Services / About,
 * deep links into Contact / Global / RFQ. Locks scroll + closes on
 * Escape, link tap, or backdrop tap.
 */
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MobileMenu({ productDivisions, serviceDivisions, aboutPages, settings, visibility }) {
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState(null) // 'products' | 'services' | 'about' | null

  useEffect(() => {
    if (!open) { document.body.style.overflow = ''; return }
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  function close() { setOpen(false); setSection(null) }
  function toggle(name) { setSection(s => (s === name ? null : name)) }

  return (
    <>
      {/* Hamburger — 44×44 for Apple HIG-compliant tap target */}
      <button onClick={() => setOpen(true)} aria-label="Open navigation menu"
        aria-expanded={open}
        className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors -mr-1">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      {/* Backdrop */}
      <div onClick={close} aria-hidden="true"
        className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

      {/* Drawer */}
      <aside role="dialog" aria-label="Mobile navigation" aria-modal="true"
        className={`lg:hidden fixed inset-y-0 right-0 z-50 w-full max-w-[360px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>

        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-br from-[#1d5fa1] via-[#185289] to-[#14467a] text-white flex-shrink-0 relative overflow-hidden">
          {/* Decorative orange dot */}
          <div aria-hidden="true" className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #FF6321 0%, transparent 70%)' }} />

          <Link href="/" onClick={close} className="relative flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-white text-[#1d5fa1] border border-white/30 flex items-center justify-center group-active:scale-95 transition-transform">
              <span className="font-black text-sm leading-none">EG</span>
            </div>
            <div>
              <div className="font-extrabold text-sm leading-tight">Egypt Globe Group</div>
              <div className="text-[10px] text-blue-200 leading-tight">B2B Export · 60+ markets</div>
            </div>
          </Link>
          <button onClick={close} aria-label="Close menu"
            className="relative w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/15 active:bg-white/25 transition-colors flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Drawer body — scrollable */}
        <nav className="flex-1 overflow-y-auto divide-y divide-slate-100">

          {/* Quick-actions row — RFQ / call / mail. One-tap conversion
              paths visible immediately without scrolling. */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-b from-slate-50 to-white">
            <Link href="/rfq" onClick={close}
              className="flex flex-col items-center justify-center gap-1 h-16 rounded-xl bg-[#FF6321] hover:bg-[#e0541b] active:bg-[#c84512] text-white shadow-md shadow-orange-500/25 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <span className="text-[11px] font-bold leading-none">Quote</span>
            </Link>
            {settings?.phoneE164 && (
              <a href={`tel:${settings.phoneE164}`}
                className="flex flex-col items-center justify-center gap-1 h-16 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-900 transition-colors">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span className="text-[11px] font-bold leading-none">Call</span>
              </a>
            )}
            {settings?.email && (
              <a href={`mailto:${settings.email}`}
                className="flex flex-col items-center justify-center gap-1 h-16 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-900 transition-colors">
                <svg className="w-5 h-5 text-[#1d5fa1]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span className="text-[11px] font-bold leading-none">Email</span>
              </a>
            )}
          </div>

          {/* Products accordion */}
          <Accordion label="Products" icon="📦" isOpen={section === 'products'} onToggle={() => toggle('products')}>
            <Link href="/products" onClick={close} className={subLinkCls + ' font-bold text-[#1d5fa1]'}>
              All Products →
            </Link>
            {productDivisions.map(d => (
              <Link key={d.id} href={d.path} onClick={close} className={subLinkCls}>
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: `${d.color}18` }}>
                  {d.icon}
                </span>
                <span>{d.label}</span>
              </Link>
            ))}
          </Accordion>

          {/* Services accordion */}
          <Accordion label="Services" icon="🚢" isOpen={section === 'services'} onToggle={() => toggle('services')}>
            <Link href="/services" onClick={close} className={subLinkCls + ' font-bold text-[#1d5fa1]'}>
              All Services →
            </Link>
            {serviceDivisions.map(s => (
              <Link key={s.id} href={s.path} onClick={close} className={subLinkCls}>
                <span className="w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: `${s.color}18` }}>
                  {s.icon}
                </span>
                <span>{s.label}</span>
              </Link>
            ))}
          </Accordion>

          {/* About accordion */}
          {aboutPages?.length > 0 && (
            <Accordion label="About" icon="🏢" isOpen={section === 'about'} onToggle={() => toggle('about')}>
              <Link href="/about" onClick={close} className={subLinkCls + ' font-bold text-[#1d5fa1]'}>
                About Egypt Globe →
              </Link>
              {aboutPages.map(p => (
                <Link key={p.id} href={p.path} onClick={close} className={subLinkCls}>
                  {p.title}
                </Link>
              ))}
            </Accordion>
          )}

          {/* Direct links */}
          <Link href="/applications" onClick={close} className={topLinkCls}>
            <span aria-hidden className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center text-base">🏭</span>
            Applications
          </Link>
          <Link href="/global-presence" onClick={close} className={topLinkCls}>
            <span aria-hidden className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-base">🌍</span>
            Global Presence
          </Link>
          <Link href="/blog" onClick={close} className={topLinkCls}>
            <span aria-hidden className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-base">📝</span>
            News &amp; Blog
          </Link>
          <Link href="/contact" onClick={close} className={topLinkCls}>
            <span aria-hidden className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-base">📞</span>
            Contact
          </Link>

          {visibility?.authenticated ? (
            <Link href="/buyer" onClick={close} className={topLinkCls + ' bg-emerald-50/50'}>
              <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {(visibility.contactName || visibility.email || '?').charAt(0).toUpperCase()}
              </span>
              My buyer catalogue
            </Link>
          ) : (
            <Link href="/login" onClick={close} className={topLinkCls + ' bg-blue-50/50'}>
              <span aria-hidden className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-base">🔒</span>
              Sign in — see prices
            </Link>
          )}
        </nav>

        {/* Drawer footer */}
        <div className="border-t border-slate-200 p-4 bg-slate-50/80 space-y-2.5 flex-shrink-0">
          <Link href="/rfq" onClick={close}
            className="flex items-center justify-center gap-2 w-full bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold py-3 rounded-xl shadow-md transition-all hover:-translate-y-0.5">
            📋 Get a Quote in 24 hours
          </Link>
          {settings?.phoneE164 && (
            <a href={`tel:${settings.phoneE164}`}
              className="flex items-center justify-center gap-2 w-full bg-white border border-slate-200 text-slate-900 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm">
              ☎ {settings.phone}
            </a>
          )}
          {settings?.email && (
            <a href={`mailto:${settings.email}`}
              className="block w-full text-center text-xs text-slate-500 hover:text-[#1d5fa1] transition-colors pt-0.5">
              ✉ {settings.email}
            </a>
          )}
        </div>
      </aside>
    </>
  )
}

const topLinkCls = 'flex items-center gap-3 px-5 py-3.5 text-slate-800 font-semibold hover:bg-slate-50 hover:text-[#1d5fa1] active:bg-slate-100 transition-colors text-sm min-h-[52px]'
const subLinkCls = 'flex items-center gap-3 px-5 py-3 text-slate-600 text-sm hover:bg-slate-100 hover:text-[#1d5fa1] active:bg-slate-200 transition-colors min-h-[44px]'

function Accordion({ label, icon, isOpen, onToggle, children }) {
  return (
    <div>
      <button onClick={onToggle} aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-5 py-4 text-slate-900 font-bold hover:bg-slate-50 active:bg-slate-100 transition-colors text-sm min-h-[56px]">
        <span className="flex items-center gap-3">
          <span aria-hidden className="w-8 h-8 rounded-lg bg-blue-100 text-[#1d5fa1] flex items-center justify-center text-base">
            {icon}
          </span>
          {label}
        </span>
        <span className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-blue-100' : ''}`}>
          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7"/>
          </svg>
        </span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="bg-slate-50/80 border-t border-slate-100 py-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
