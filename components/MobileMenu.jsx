'use client'

/**
 * MobileMenu — elegant right-slide drawer (design pass 2026-06-12).
 *
 * Replaces the instant full-white takeover with:
 *  · dimmed, blurred backdrop + 320px panel sliding from the right
 *    (iOS-style cubic-bezier, GPU transform only)
 *  · staggered item entrance (reuses .stagger-children from globals.css)
 *  · ONE interaction language: every group is an accordion row with a
 *    rotating chevron; the group's index page is the first row inside
 *  · the 26-link "Knowledge Base" wall tamed into a Resources accordion
 *    with mono-tracking eyebrow sub-labels (matches homepage sections)
 *  · sticky footer: orange RFQ CTA + call / chat / email triplet
 *  · a11y: Escape closes, backdrop tap closes, body scroll lock,
 *    aria-modal, focus moves into panel on open, reduced-motion safe
 *
 * Props are unchanged from the previous version — drop-in replacement.
 */

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'

// Resources content — same destinations as the desktop mega-menu.
const RESOURCE_GROUPS = [
  {
    label: 'Market intelligence',
    links: [
      ['/markets', 'All market briefs'],
      ['/markets/cement-clinker-hs-2523', 'Cement & clinker (HS 2523)'],
      ['/markets/industrial-salt-egypt', 'Industrial salt'],
      ['/markets/egypt-gypsum-plaster', 'Gypsum & plaster'],
      ['/markets/egypt-npk-fertilizer', 'NPK fertilizer market'],
      ['/markets/mining-companies-egypt', 'Mining in Egypt'],
    ],
  },
  {
    label: 'Trade tools',
    links: [
      ['/trade-tools/hs-codes', 'HS code library'],
      ['/trade-tools/incoterms-2020', 'Incoterms 2020'],
      ['/trade-tools/vessel-sizes', 'Vessel size guide'],
      ['/trade-tools/import-guides', 'Country import guides'],
    ],
  },
  {
    label: 'Standards',
    links: [
      ['/standards/en-197-1', 'EN 197-1 — EU cement'],
      ['/standards/astm-c150', 'ASTM C150 — US cement'],
      ['/standards/en-16811-1', 'EN 16811-1 — EU de-icing'],
      ['/standards/astm-d632', 'ASTM D632 — US salt'],
      ['/standards/aashto-m-143', 'AASHTO M-143'],
      ['/standards/bs-3247', 'BS 3247:2011 — UK'],
      ['/standards/gost-13830', 'GOST 13830 — CIS'],
    ],
  },
  {
    label: 'Egyptian ports',
    links: [
      ['/ports/damietta-salt', 'Damietta'],
      ['/ports/alexandria-salt', 'Alexandria'],
      ['/ports/el-dekheila-salt', 'El Dekheila'],
      ['/ports/ain-sokhna-salt', 'Ain Sokhna'],
      ['/ports/port-said-east-salt', 'Port Said East'],
      ['/ports/al-arish-salt', 'Al-Arish'],
      ['/ports/adabiya-salt', 'Adabiya'],
      ['/ports/safaga-salt', 'Safaga'],
      ['/services/loading-ports', 'All loading ports →'],
    ],
  },
]

const COMPANY_LINKS = [
  ['/about', 'About'],
  ['/applications', 'Applications by industry'],
  ['/global-presence', 'Global presence'],
  ['/case-studies', 'Case studies'],
  ['/blog', 'News & insights'],
  ['/coa', 'CoA centre'],
  ['/contact', 'Contact'],
]

// Accordion body — animated open/close via the grid-rows 0fr→1fr trick.
function AccordionBody({ open, children }) {
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}

function Chevron({ open }) {
  return (
    <svg
      className={`w-4 h-4 text-[#8a93a3] transition-transform duration-300 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

// Mono-tracking section eyebrow — same voice as the homepage sections.
function Eyebrow({ children }) {
  return (
    <p className="px-6 pt-6 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#8a93a3] select-none">
      {children}
    </p>
  )
}

export default function MobileMenu({ productDivisions, serviceDivisions, aboutPages, settings, visibility }) {
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState(null) // 'products' | 'services' | 'resources' | null
  const [openCount, setOpenCount] = useState(0) // re-keys the list → stagger replays per open
  const [mounted, setMounted] = useState(false) // portal target exists only client-side
  const panelRef = useRef(null)

  useEffect(() => { setMounted(true) }, [])

  // Body scroll lock + reset accordion + focus panel
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setOpenCount(c => c + 1)
      // Move focus into the dialog for keyboard/screen-reader users
      requestAnimationFrame(() => panelRef.current?.focus())
    } else {
      document.body.style.overflow = ''
      setSection(null)
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Escape closes
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const close = () => setOpen(false)
  const toggle = id => setSection(s => (s === id ? null : id))

  const s = settings || {}
  const waNumber = (s.whatsappE164 || s.phoneE164 || '').replace(/[^\d]/g, '')

  return (
    <>
      {/* ── Hamburger ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-[#3f4650] hover:bg-[#f3f4f6] active:bg-[#e5e7eb] transition-colors"
        style={{ touchAction: 'manipulation' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop + drawer PORTAL to <body> — the sticky header has
          backdrop-blur, which creates a CSS containing block that would
          otherwise trap our position:fixed at the header's 56px box. */}
      {mounted && createPortal(
      <>
      {/* ── Backdrop ──────────────────────────────────────────────── */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`lg:hidden fixed inset-0 z-50 bg-[#14161a]/45 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* ── Drawer panel — slides from the right ─────────────────── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        tabIndex={-1}
        className="lg:hidden fixed inset-y-0 right-0 z-50 w-[min(20rem,88vw)] bg-white shadow-[0_24px_60px_-28px_rgba(20,22,26,.35)] flex flex-col outline-none transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
        style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-[#14161a]/10">
          <div className="flex items-center justify-between pl-6 pr-3 h-14">
            <Link href="/" onClick={close} className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#1d5fa1] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-[10px] leading-none">EG</span>
              </div>
              <div className="min-w-0">
                <div className="font-bold text-[13px] text-[#14161a] leading-tight truncate">Egypt Globe Group</div>
                <div className="text-[9px] font-mono uppercase tracking-[0.18em] text-[#8a93a3] leading-tight">Est. 2014 · Cairo</div>
              </div>
            </Link>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="flex items-center justify-center w-10 h-10 rounded-lg text-[#7a8290] hover:bg-[#f3f4f6] active:bg-[#e5e7eb] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable body — children stagger in on each open via key remount */}
        <div key={openCount} className="flex-1 overflow-y-auto overscroll-contain stagger-children motion-reduce:[&>*]:!animate-none">

          <Eyebrow>Navigate</Eyebrow>

          {/* Products accordion */}
          <div className="border-b border-[#14161a]/10">
            <button
              type="button"
              onClick={() => toggle('products')}
              aria-expanded={section === 'products'}
              className="w-full flex items-center justify-between px-6 py-3.5 text-left"
            >
              <span className="text-[15px] font-semibold text-[#14161a]">Products</span>
              <Chevron open={section === 'products'} />
            </button>
            <AccordionBody open={section === 'products'}>
              <div className="pb-3">
                <Link href="/products" onClick={close}
                  className="flex items-center justify-between mx-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-[#0b8f84] hover:bg-[#f9fafb]">
                  All products <span aria-hidden="true">→</span>
                </Link>
                {productDivisions.map(div => (
                  <Link key={div.id} href={div.path} onClick={close}
                    className="flex items-center gap-3 mx-3 px-3 py-2.5 rounded-lg hover:bg-[#f9fafb] active:bg-[#f3f4f6] transition-colors">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: `${div.color}15` }}>
                      {div.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-[13.5px] text-[#14161a] leading-tight">{div.label}</div>
                      <div className="text-[11px] text-[#8a93a3] truncate">{div.blurb}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </AccordionBody>
          </div>

          {/* Services accordion */}
          <div className="border-b border-[#14161a]/10">
            <button
              type="button"
              onClick={() => toggle('services')}
              aria-expanded={section === 'services'}
              className="w-full flex items-center justify-between px-6 py-3.5 text-left"
            >
              <span className="text-[15px] font-semibold text-[#14161a]">Services</span>
              <Chevron open={section === 'services'} />
            </button>
            <AccordionBody open={section === 'services'}>
              <div className="pb-3">
                <Link href="/services" onClick={close}
                  className="flex items-center justify-between mx-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-[#0b8f84] hover:bg-[#f9fafb]">
                  All services <span aria-hidden="true">→</span>
                </Link>
                {serviceDivisions.map(svc => (
                  <Link key={svc.id} href={svc.path} onClick={close}
                    className="flex items-center gap-3 mx-3 px-3 py-2.5 rounded-lg hover:bg-[#f9fafb] active:bg-[#f3f4f6] transition-colors">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: `${svc.color}15` }}>
                      {svc.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-[13.5px] text-[#14161a] leading-tight">{svc.label}</div>
                      <div className="text-[11px] text-[#8a93a3] truncate">{svc.blurb}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </AccordionBody>
          </div>

          {/* Resources accordion — the tamed knowledge base */}
          <div className="border-b border-[#14161a]/10">
            <button
              type="button"
              onClick={() => toggle('resources')}
              aria-expanded={section === 'resources'}
              className="w-full flex items-center justify-between px-6 py-3.5 text-left"
            >
              <span className="flex items-baseline gap-2 text-[15px] font-semibold text-[#14161a]">
                Resources
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#FF6321]">48 pages</span>
              </span>
              <Chevron open={section === 'resources'} />
            </button>
            <AccordionBody open={section === 'resources'}>
              <div className="pb-4">
                {RESOURCE_GROUPS.map(group => (
                  <div key={group.label}>
                    <p className="px-6 pt-4 pb-1 text-[9px] font-mono uppercase tracking-[0.18em] text-[#8a93a3] select-none">
                      {group.label}
                    </p>
                    {group.links.map(([href, label]) => (
                      <Link key={href} href={href} onClick={close}
                        className="block mx-3 px-3 py-2 rounded-lg text-[13.5px] text-[#3f4650] hover:bg-[#f9fafb] hover:text-[#0b8f84] active:bg-[#f3f4f6] transition-colors">
                        {label}
                      </Link>
                    ))}
                  </div>
                ))}
                <Link href="/search" onClick={close}
                  className="flex items-center gap-2 mx-3 mt-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold text-[#0b8f84] hover:bg-[#f9fafb]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                  </svg>
                  Search the whole site
                </Link>
              </div>
            </AccordionBody>
          </div>

          <Eyebrow>Company</Eyebrow>

          {/* Flat company links */}
          <div className="pb-2">
            {COMPANY_LINKS.map(([href, label]) => (
              <Link key={href} href={href} onClick={close}
                className="flex items-center justify-between px-6 py-3 text-[14px] font-medium text-[#3f4650] hover:bg-[#f9fafb] hover:text-[#14161a] active:bg-[#f3f4f6] transition-colors">
                {label}
                <svg className="w-3.5 h-3.5 text-[#c9ced6]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>

          {/* Account */}
          <div className="px-6 py-4 border-t border-[#14161a]/10 mb-2">
            {visibility?.authenticated ? (
              <Link href="/buyer" onClick={close} className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {(visibility.contactName || visibility.email || '?').charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-[13.5px] text-[#14161a]">My catalogue</div>
                  <div className="text-[11px] text-[#8a93a3] truncate">{visibility.email}</div>
                </div>
              </Link>
            ) : (
              <Link href="/login" onClick={close}
                className="flex items-center gap-2 text-[13.5px] text-[#7a8290] hover:text-[#14161a] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Sign in to buyer portal
              </Link>
            )}
          </div>
        </div>

        {/* Sticky footer CTA */}
        <div className="flex-shrink-0 border-t border-[#14161a]/10 p-4 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <Link
            href="/rfq"
            onClick={close}
            className="flex items-center justify-center gap-2 w-full bg-[#FF6321] hover:bg-[#14161a] active:bg-[#14161a] text-white font-semibold text-[15px] h-12 rounded-full shadow-[0_10px_30px_-10px_rgba(255,99,33,.55)] transition-colors mb-2.5"
          >
            Get a Quote in 24 hours
          </Link>
          <div className={`grid gap-2 ${waNumber ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {s.phoneE164 && (
              <a href={`tel:${s.phoneE164}`}
                className="flex items-center justify-center gap-1.5 h-10 rounded-lg border border-[#14161a]/10 text-[#3f4650] font-medium text-[13px] hover:bg-[#f9fafb] active:bg-[#f3f4f6] transition-colors">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call
              </a>
            )}
            {waNumber && (
              <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 h-10 rounded-lg border border-[#14161a]/10 text-[#3f4650] font-medium text-[13px] hover:bg-[#f9fafb] active:bg-[#f3f4f6] transition-colors">
                <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat
              </a>
            )}
            {s.email && (
              <a href={`mailto:${s.email}`}
                className="flex items-center justify-center gap-1.5 h-10 rounded-lg border border-[#14161a]/10 text-[#3f4650] font-medium text-[13px] hover:bg-[#f9fafb] active:bg-[#f3f4f6] transition-colors">
                <svg className="w-4 h-4 text-[#1d5fa1]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
            )}
          </div>
        </div>
      </div>
      </>,
      document.body
      )}
    </>
  )
}
