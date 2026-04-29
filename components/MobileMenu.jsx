'use client'

/**
 * MobileMenu — slide-in drawer navigation for screens < lg.
 *
 * Replaces the desktop mega-menus on mobile / tablet. Touch-friendly
 * 56px tap targets, accordion sub-sections for Products / Services /
 * About, deep links into Contact / Global Presence / RFQ. Locks
 * background scroll while open and closes on Escape, link click or
 * backdrop tap.
 */
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MobileMenu({ productDivisions, serviceDivisions, aboutPages, settings }) {
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState(null) // 'products' | 'services' | 'about' | null

  // Close on Escape + lock body scroll while open
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = ''
      return
    }
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  function close() { setOpen(false); setSection(null) }
  function toggle(name) { setSection(s => (s === name ? null : name)) }

  return (
    <>
      {/* Hamburger button (visible < lg) */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      {/* Backdrop */}
      <div
        onClick={close}
        className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-label="Mobile navigation"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-[#1d5fa1] to-[#14467a] text-white">
          <Link href="/" onClick={close} className="font-extrabold text-lg tracking-tight">
            Egypt Globe Group
          </Link>
          <button onClick={close} aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/15 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Drawer body — scrollable */}
        <nav className="flex-1 overflow-y-auto py-2">
          {/* Products accordion */}
          <Accordion
            label="Products"
            icon="📦"
            isOpen={section === 'products'}
            onToggle={() => toggle('products')}
          >
            <Link href="/products" onClick={close} className={subLinkCls + ' font-bold'}>
              All Products →
            </Link>
            {productDivisions.map(d => (
              <Link key={d.id} href={d.path} onClick={close} className={subLinkCls}>
                <span className="text-xl mr-2" aria-hidden="true">{d.icon}</span>
                {d.label}
              </Link>
            ))}
          </Accordion>

          {/* Services accordion */}
          <Accordion
            label="Services"
            icon="🚢"
            isOpen={section === 'services'}
            onToggle={() => toggle('services')}
          >
            <Link href="/services" onClick={close} className={subLinkCls + ' font-bold'}>
              All Services →
            </Link>
            {serviceDivisions.map(s => (
              <Link key={s.id} href={s.path} onClick={close} className={subLinkCls}>
                <span className="text-xl mr-2" aria-hidden="true">{s.icon}</span>
                {s.label}
              </Link>
            ))}
          </Accordion>

          {/* About accordion */}
          {aboutPages?.length > 0 && (
            <Accordion
              label="About"
              icon="🏢"
              isOpen={section === 'about'}
              onToggle={() => toggle('about')}
            >
              <Link href="/about" onClick={close} className={subLinkCls + ' font-bold'}>
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
            <span className="text-xl mr-3" aria-hidden="true">🏭</span> Applications
          </Link>
          <Link href="/global-presence" onClick={close} className={topLinkCls}>
            <span className="text-xl mr-3" aria-hidden="true">🌍</span> Global Presence
          </Link>
          <Link href="/blog" onClick={close} className={topLinkCls}>
            <span className="text-xl mr-3" aria-hidden="true">📝</span> News & Blog
          </Link>
          <Link href="/contact" onClick={close} className={topLinkCls}>
            <span className="text-xl mr-3" aria-hidden="true">📞</span> Contact
          </Link>
        </nav>

        {/* Drawer footer — sticky CTA + contact */}
        <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-3">
          <Link href="/rfq" onClick={close}
            className="block w-full text-center bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold py-3 rounded-xl shadow-lg transition-all">
            📋 Get a Quote in 24h
          </Link>
          {settings?.phoneE164 && (
            <a href={`tel:${settings.phoneE164}`}
              className="block w-full text-center bg-white border border-slate-200 text-slate-900 font-semibold py-2.5 rounded-xl hover:bg-slate-100 transition-colors">
              ☎ {settings.phone}
            </a>
          )}
          {settings?.email && (
            <a href={`mailto:${settings.email}`}
              className="block w-full text-center text-xs text-slate-500 hover:text-[#1d5fa1] transition-colors">
              ✉ {settings.email}
            </a>
          )}
        </div>
      </aside>
    </>
  )
}

const topLinkCls = 'flex items-center px-5 py-4 text-slate-900 font-semibold hover:bg-slate-50 hover:text-[#1d5fa1] border-b border-slate-100 last:border-b-0 transition-colors'
const subLinkCls = 'flex items-center px-5 py-3.5 text-slate-700 text-sm hover:bg-slate-50 hover:text-[#1d5fa1] border-b border-slate-100 last:border-b-0 transition-colors'

function Accordion({ label, icon, isOpen, onToggle, children }) {
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-5 py-4 text-slate-900 font-semibold hover:bg-slate-50 transition-colors"
      >
        <span className="flex items-center">
          <span className="text-xl mr-3" aria-hidden="true">{icon}</span>
          {label}
        </span>
        <svg className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
      <div className={`overflow-hidden transition-[max-height] duration-300 ease-out ${isOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
        <div className="bg-slate-50/60">
          {children}
        </div>
      </div>
    </div>
  )
}
