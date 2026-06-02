'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function MobileMenu({ productDivisions, serviceDivisions, aboutPages, settings, visibility }) {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(null) // 'products' | 'services' | null

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setActiveSection(null)
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const close = () => setOpen(false)
  const toggle = section => setActiveSection(s => s === section ? null : section)

  const s = settings || {}

  return (
    <>
      {/* ── Hamburger ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors"
        style={{ touchAction: 'manipulation' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* ── Full-screen overlay ───────────────────────────────────── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex flex-col bg-white"
          role="dialog"
          aria-label="Navigation menu"
          aria-modal="true"
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-5 h-14 border-b border-slate-100 flex-shrink-0">
            <Link href="/" onClick={close} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1d5fa1] flex items-center justify-center">
                <span className="text-white font-black text-[10px] leading-none">EG</span>
              </div>
              <span className="font-bold text-sm text-slate-900">Egypt Globe Group</span>
            </Link>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">

            {/* ── Products ─────────────────────────────────────── */}
            <div className="border-b border-slate-100">
              {/* Row: link to /products + separate chevron toggle */}
              <div className="flex items-center border-b border-slate-50">
                <Link
                  href="/products"
                  onClick={close}
                  className="flex-1 px-5 py-4 font-semibold text-slate-900 text-[15px]"
                >
                  Products
                </Link>
                <button
                  type="button"
                  onClick={() => toggle('products')}
                  aria-label="Toggle product divisions"
                  className="flex items-center gap-1.5 px-4 py-4 text-xs text-[#1d5fa1] font-semibold"
                >
                  <span>{activeSection === 'products' ? 'Less' : 'Divisions'}</span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${activeSection === 'products' ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {activeSection === 'products' && (
                <div className="pb-2 bg-slate-50/50">
                  {productDivisions.map(div => (
                    <Link
                      key={div.id}
                      href={div.path}
                      onClick={close}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-slate-100 transition-colors"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: `${div.color}18` }}
                      >
                        {div.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[14px] text-slate-900">{div.label}</div>
                        <div className="text-[11px] text-slate-500 truncate">{div.blurb}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* ── Services ─────────────────────────────────────── */}
            <div className="border-b border-slate-100">
              <div className="flex items-center border-b border-slate-50">
                <Link
                  href="/services"
                  onClick={close}
                  className="flex-1 px-5 py-4 font-semibold text-slate-900 text-[15px]"
                >
                  Services
                </Link>
                <button
                  type="button"
                  onClick={() => toggle('services')}
                  aria-label="Toggle service divisions"
                  className="flex items-center gap-1.5 px-4 py-4 text-xs text-[#1d5fa1] font-semibold"
                >
                  <span>{activeSection === 'services' ? 'Less' : 'More'}</span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${activeSection === 'services' ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {activeSection === 'services' && (
                <div className="pb-2 bg-slate-50/50">
                  {serviceDivisions.map(svc => (
                    <Link
                      key={svc.id}
                      href={svc.path}
                      onClick={close}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-slate-100 transition-colors"
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: `${svc.color}18` }}
                      >
                        {svc.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[14px] text-slate-900">{svc.label}</div>
                        <div className="text-[11px] text-slate-500 truncate">{svc.blurb}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* ── Resources — Markets · Trade · Standards · Ports (always expanded so it's discoverable) ── */}
            <div className="border-t-4 border-orange-500 bg-gradient-to-b from-orange-50/30 to-transparent">
              <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">📚</span>
                  <span className="text-[15px] font-bold text-slate-900">Knowledge Base</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-500 text-white px-2 py-0.5 rounded-full">48 pages</span>
              </div>
              <div className="px-3 pb-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 px-2 pt-2 pb-1">📊 Market Intelligence</p>
                {[
                  ['/markets', 'All market briefs'],
                  ['/markets/cement-clinker-hs-2523', 'Cement & clinker (HS 2523)'],
                  ['/markets/industrial-salt-egypt', 'Industrial salt'],
                  ['/markets/egypt-gypsum-plaster', 'Gypsum & plaster'],
                  ['/markets/egypt-npk-fertilizer', 'NPK fertilizer market'],
                  ['/markets/mining-companies-egypt', 'Mining in Egypt'],
                ].map(([h, l]) => (
                  <Link key={h} href={h} onClick={close} className="block text-sm text-slate-700 hover:text-[#1d5fa1] py-1.5 px-2">{l}</Link>
                ))}

                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-700 px-2 pt-3 pb-1">🧰 Trade Tools</p>
                {[
                  ['/trade-tools/hs-codes', 'HS code library'],
                  ['/trade-tools/incoterms-2020', 'Incoterms 2020'],
                  ['/trade-tools/vessel-sizes', 'Vessel size guide'],
                  ['/trade-tools/import-guides', 'Country import guides (15)'],
                ].map(([h, l]) => (
                  <Link key={h} href={h} onClick={close} className="block text-sm text-slate-700 hover:text-[#1d5fa1] py-1.5 px-2">{l}</Link>
                ))}

                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 px-2 pt-3 pb-1">📋 Standards</p>
                {[
                  ['/standards/en-197-1', 'EN 197-1 — EU cement'],
                  ['/standards/astm-c150', 'ASTM C150 — US cement'],
                  ['/standards/en-16811-1', 'EN 16811-1 — EU de-icing'],
                  ['/standards/astm-d632', 'ASTM D632 — US salt'],
                  ['/standards/aashto-m-143', 'AASHTO M-143'],
                  ['/standards/bs-3247', 'BS 3247:2011 — UK'],
                  ['/standards/gost-13830', 'GOST 13830 — CIS'],
                ].map(([h, l]) => (
                  <Link key={h} href={h} onClick={close} className="block text-sm text-slate-700 hover:text-[#1d5fa1] py-1.5 px-2">{l}</Link>
                ))}

                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700 px-2 pt-3 pb-1">⚓ Egyptian Ports</p>
                {[
                  ['/ports/damietta-salt', 'Damietta'],
                  ['/ports/alexandria-salt', 'Alexandria'],
                  ['/ports/el-dekheila-salt', 'El Dekheila'],
                  ['/ports/ain-sokhna-salt', 'Ain Sokhna'],
                  ['/ports/port-said-east-salt', 'Port Said East'],
                  ['/ports/al-arish-salt', 'Al-Arish'],
                  ['/services/loading-ports', 'All 7 loading ports →'],
                ].map(([h, l]) => (
                  <Link key={h} href={h} onClick={close} className="block text-sm text-slate-700 hover:text-[#1d5fa1] py-1.5 px-2">{l}</Link>
                ))}

                <div className="mt-3 px-2">
                  <Link href="/search" onClick={close} className="block text-sm font-bold text-[#1d5fa1] hover:underline py-2">🔍 Search the whole site →</Link>
                </div>
              </div>
            </div>

            {/* ── Flat nav links ───────────────────────────────── */}
            <div className="py-1">
              {[
                { href: '/about',           label: 'About' },
                { href: '/applications',    label: 'Applications by industry' },
                { href: '/global-presence', label: 'Global presence — 60+ markets' },
                { href: '/case-studies',    label: 'Case studies' },
                { href: '/blog',            label: 'News & insights' },
                { href: '/coa',             label: 'CoA centre' },
                { href: '/contact',         label: 'Contact' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  className="flex items-center justify-between px-5 py-3.5 text-[15px] font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors border-b border-slate-100"
                >
                  {label}
                  <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>

            {/* ── Account ──────────────────────────────────────── */}
            <div className="px-5 py-4 border-t border-slate-100">
              {visibility?.authenticated ? (
                <Link href="/buyer" onClick={close} className="flex items-center gap-3 py-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {(visibility.contactName || visibility.email || '?').charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <div className="font-semibold text-[14px] text-slate-900">My catalogue</div>
                    <div className="text-[11px] text-slate-500">{visibility.email}</div>
                  </div>
                </Link>
              ) : (
                <Link href="/login" onClick={close} className="flex items-center gap-2 text-[14px] text-slate-600 hover:text-slate-900 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Sign in to buyer portal
                </Link>
              )}
            </div>
          </div>

          {/* ── Sticky footer CTA ────────────────────────────────────── */}
          <div className="flex-shrink-0 border-t border-slate-200 p-4 bg-white">
            <Link
              href="/rfq"
              onClick={close}
              className="flex items-center justify-center gap-2 w-full bg-[#FF6321] hover:bg-[#e0541b] text-white font-bold text-[15px] h-12 rounded-xl transition-colors mb-3"
            >
              Get a Quote in 24 hours
            </Link>
            <div className="grid grid-cols-2 gap-2">
              {s.phoneE164 && (
                <a
                  href={`tel:${s.phoneE164}`}
                  className="flex items-center justify-center gap-1.5 h-10 rounded-lg border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call
                </a>
              )}
              {s.email && (
                <a
                  href={`mailto:${s.email}`}
                  className="flex items-center justify-center gap-1.5 h-10 rounded-lg border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-4 h-4 text-[#1d5fa1]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
