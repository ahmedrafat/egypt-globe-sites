'use client'

/**
 * MobileMenu — slide-in drawer navigation for screens < lg.
 *
 * Drop 140 — flat-list redesign. Previous version (Drop 139) put
 * Products / Services / About behind collapsed accordions, so the user
 * opening the drawer only saw the Quote/Call/Email quick-row at the
 * top + the Phone/Email block at the footer with three accordion stubs
 * in between. People reported "I only see phone and email." Fix: every
 * menu item is now visible without taps. Sectioned by category with
 * sticky-feeling headers, scrollable. Quote/Call/Email move to the
 * footer where they're sticky and reachable from any scroll position.
 */
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MobileMenu({ productDivisions, serviceDivisions, aboutPages, settings, visibility }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) { document.body.style.overflow = ''; return }
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  function close() { setOpen(false) }

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

        {/* Drawer header — compact 56px so body has more room */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-br from-[#1d5fa1] via-[#185289] to-[#14467a] text-white flex-shrink-0 relative overflow-hidden">
          <div aria-hidden="true" className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #FF6321 0%, transparent 70%)' }} />

          <Link href="/" onClick={close} className="relative flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-white text-[#1d5fa1] border border-white/30 flex items-center justify-center group-active:scale-95 transition-transform">
              <span className="font-black text-xs leading-none">EG</span>
            </div>
            <div>
              <div className="font-extrabold text-sm leading-tight">Egypt Globe Group</div>
              <div className="text-[10px] text-blue-200 leading-tight">B2B Export · 60+ markets</div>
            </div>
          </Link>
          <button onClick={close} aria-label="Close menu"
            className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/15 active:bg-white/25 transition-colors flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Drawer body — flat scrollable list, all menu items visible */}
        <nav className="flex-1 overflow-y-auto">

          {/* PRODUCTS section — all 7 divisions visible */}
          <Section label="Products" linkHref="/products" linkLabel="All →" />
          <div>
            {productDivisions.map(d => (
              <Link key={d.id} href={d.path} onClick={close} className={itemCls}>
                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: `${d.color}1A`, color: d.color }}>
                  {d.icon}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="font-semibold text-slate-900 block truncate">{d.label}</span>
                  {d.blurb && <span className="text-[11px] text-slate-500 block truncate">{d.blurb}</span>}
                </span>
                <Chevron />
              </Link>
            ))}
          </div>

          {/* SERVICES section */}
          <Section label="Services" linkHref="/services" linkLabel="All →" />
          <div>
            {serviceDivisions.map(s => (
              <Link key={s.id} href={s.path} onClick={close} className={itemCls}>
                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: `${s.color}1A`, color: s.color }}>
                  {s.icon}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="font-semibold text-slate-900 block truncate">{s.label}</span>
                  {s.blurb && <span className="text-[11px] text-slate-500 block truncate">{s.blurb}</span>}
                </span>
                <Chevron />
              </Link>
            ))}
          </div>

          {/* COMPANY section — about + global + applications + blog + contact */}
          <Section label="Company" />
          <div>
            <Link href="/about" onClick={close} className={itemCls}>
              <span aria-hidden className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg flex-shrink-0">🏢</span>
              <span className="flex-1 font-semibold text-slate-900">About</span>
              <Chevron />
            </Link>
            {aboutPages?.slice(0, 4).map(p => (
              <Link key={p.id} href={p.path} onClick={close} className={subItemCls}>
                <span className="w-2 h-2 rounded-full bg-slate-300 ml-3 flex-shrink-0" aria-hidden />
                <span className="flex-1 text-slate-600 text-sm">{p.title}</span>
              </Link>
            ))}
            <Link href="/applications" onClick={close} className={itemCls}>
              <span aria-hidden className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center text-lg flex-shrink-0">🏭</span>
              <span className="flex-1 font-semibold text-slate-900">Applications</span>
              <Chevron />
            </Link>
            <Link href="/global-presence" onClick={close} className={itemCls}>
              <span aria-hidden className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-lg flex-shrink-0">🌍</span>
              <span className="flex-1 font-semibold text-slate-900">Global Presence</span>
              <Chevron />
            </Link>
            <Link href="/case-studies" onClick={close} className={itemCls}>
              <span aria-hidden className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-lg flex-shrink-0">📖</span>
              <span className="flex-1 font-semibold text-slate-900">Case Studies</span>
              <Chevron />
            </Link>
            <Link href="/blog" onClick={close} className={itemCls}>
              <span aria-hidden className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-lg flex-shrink-0">📝</span>
              <span className="flex-1 font-semibold text-slate-900">News &amp; Blog</span>
              <Chevron />
            </Link>
            <Link href="/contact" onClick={close} className={itemCls}>
              <span aria-hidden className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg flex-shrink-0">📞</span>
              <span className="flex-1 font-semibold text-slate-900">Contact</span>
              <Chevron />
            </Link>
          </div>

          {/* ACCOUNT section */}
          <Section label="Account" />
          <div className="pb-4">
            {visibility?.authenticated ? (
              <Link href="/buyer" onClick={close} className={itemCls + ' bg-emerald-50/60'}>
                <span className="w-9 h-9 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {(visibility.contactName || visibility.email || '?').charAt(0).toUpperCase()}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="font-semibold text-slate-900 block">My buyer catalogue</span>
                  <span className="text-[11px] text-slate-500 block truncate">{visibility.email}</span>
                </span>
                <Chevron />
              </Link>
            ) : (
              <Link href="/login" onClick={close} className={itemCls + ' bg-blue-50/60'}>
                <span aria-hidden className="w-9 h-9 rounded-xl bg-blue-200 text-blue-800 flex items-center justify-center text-lg flex-shrink-0">🔒</span>
                <span className="flex-1 min-w-0">
                  <span className="font-semibold text-slate-900 block">Sign in</span>
                  <span className="text-[11px] text-slate-500 block">See your prices &amp; RFQ history</span>
                </span>
                <Chevron />
              </Link>
            )}
          </div>
        </nav>

        {/* Drawer footer — sticky conversion CTAs */}
        <div className="border-t border-slate-200 p-3 bg-gradient-to-b from-slate-50 to-white flex-shrink-0">
          {/* Quote — primary CTA, full width */}
          <Link href="/rfq" onClick={close}
            className="flex items-center justify-center gap-2 w-full bg-[#FF6321] hover:bg-[#e0541b] active:bg-[#c84512] text-white font-bold h-12 rounded-xl shadow-md shadow-orange-500/25 transition-colors mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            Get a Quote in 24 hours
          </Link>
          {/* Call + Email — secondary, side-by-side */}
          <div className="grid grid-cols-2 gap-2">
            {settings?.phoneE164 && (
              <a href={`tel:${settings.phoneE164}`}
                className="flex items-center justify-center gap-1.5 h-11 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-900 font-semibold text-sm transition-colors">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                Call
              </a>
            )}
            {settings?.email && (
              <a href={`mailto:${settings.email}`}
                className="flex items-center justify-center gap-1.5 h-11 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-900 font-semibold text-sm transition-colors">
                <svg className="w-4 h-4 text-[#1d5fa1]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Email
              </a>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}

// Section header — small uppercase label with optional "All →" right-side link
function Section({ label, linkHref, linkLabel }) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-1.5 bg-white">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </h3>
      {linkHref && (
        <Link href={linkHref} className="text-[11px] font-bold text-[#1d5fa1] hover:underline">
          {linkLabel}
        </Link>
      )}
    </div>
  )
}

// Tiny chevron at the end of every list item — gives "tap me" affordance
function Chevron() {
  return (
    <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
    </svg>
  )
}

const itemCls = 'flex items-center gap-3 px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors min-h-[60px]'
const subItemCls = 'flex items-center gap-3 px-4 py-2 hover:bg-slate-50 active:bg-slate-100 transition-colors min-h-[40px]'
