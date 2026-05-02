/**
 * SiteHeader — sticky navigation for egyptglobe.com.
 *
 * White theme. Wordmark logo on the left, mega-menus for Products +
 * Services + About, plus an orange "Get a Quote" CTA. `settings` prop
 * comes from site_settings via RootLayout.
 */
import Link from 'next/link'
import Logo from './Logo'
import MobileMenu from './MobileMenu'
import {
  PRODUCT_DIVISIONS,
  SERVICE_DIVISIONS,
  COMPANY_INFO_DEFAULT,
  getPagesByCategory,
} from '../lib/corporatePages'
import { getBuyerVisibility } from '../lib/supabaseServer'

export default async function SiteHeader({ settings }) {
  const s = settings || COMPANY_INFO_DEFAULT
  const [grouped, visibility] = await Promise.all([
    getPagesByCategory(),
    getBuyerVisibility(),
  ])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-sm">

      {/* ── Top info strip ───────────────────────────────────────── */}
      <div className="hidden md:block bg-[#1d5fa1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-blue-100">
            <span className="hidden lg:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
              Cairo HQ · Damietta Operations
            </span>
            <span className="hidden lg:inline text-blue-400/50">|</span>
            <a href={`tel:${s.phoneE164}`} className="flex items-center gap-1 hover:text-white transition-colors">
              ☎ {s.phone}
            </a>
            <span className="text-blue-400/50">·</span>
            <a href={`mailto:${s.email}`} className="hover:text-white transition-colors">
              ✉ {s.email}
            </a>
          </div>
          <div className="flex items-center gap-3 text-blue-200">
            <span className="hidden lg:inline text-xs text-blue-300/80">60+ destination markets worldwide</span>
            {s.linkedin && (
              <a href={s.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md transition-colors text-white">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.268 2.37 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Main nav row ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">

          {/* Logo — slightly smaller on mobile to leave room for CTAs */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0 min-w-0">
            <Logo imageUrl={s.logoUrl} className="h-8 sm:h-9 w-auto transition-transform group-hover:scale-105" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary navigation">

            {/* Products mega-menu */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#1d5fa1] hover:bg-blue-50/70 transition-colors">
                Products
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-[660px] bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/10
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200 translate-y-1 group-hover:translate-y-0 overflow-hidden">
                {/* Mega-menu header */}
                <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Product Divisions</span>
                  <Link href="/products" className="text-xs font-bold text-[#1d5fa1] hover:underline">
                    All products →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-1 p-3">
                  {PRODUCT_DIVISIONS.map(div => (
                    <Link key={div.id} href={div.path}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: `${div.color}18` }}>
                        {div.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-slate-900 group-hover/item:text-[#1d5fa1] transition-colors">
                          {div.label}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{div.blurb}</div>
                      </div>
                    </Link>
                  ))}
                </div>
                {/* Mega-menu footer */}
                <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-3 text-[11px] text-slate-500">
                  <span>🇪🇬 Egyptian-origin verified</span>
                  <span className="text-slate-300">·</span>
                  <span>7 seaports · FOB / CIF / CFR</span>
                  <span className="text-slate-300">·</span>
                  <span>CoA per shipment</span>
                </div>
              </div>
            </div>

            {/* Services mega-menu */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#1d5fa1] hover:bg-blue-50/70 transition-colors">
                Services
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-[600px] bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/10
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200 translate-y-1 group-hover:translate-y-0 overflow-hidden">
                {/* Mega-menu header */}
                <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Supply-chain Services</span>
                  <Link href="/services" className="text-xs font-bold text-[#1d5fa1] hover:underline">
                    All services →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-1 p-3">
                  {SERVICE_DIVISIONS.map(svc => (
                    <Link key={svc.id} href={svc.path}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: `${svc.color}18` }}>
                        {svc.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-slate-900 group-hover/item:text-[#1d5fa1] transition-colors">
                          {svc.label}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{svc.blurb}</div>
                      </div>
                    </Link>
                  ))}
                </div>
                {/* Mega-menu footer */}
                <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center gap-3 text-[11px] text-slate-500">
                  <span>Logistics · Port · QC · Docs</span>
                  <span className="text-slate-300">·</span>
                  <span>Pair any product with the service it needs</span>
                </div>
              </div>
            </div>

            {/* About dropdown */}
            {grouped.about?.length > 0 && (
              <div className="relative group">
                <button className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#1d5fa1] hover:bg-blue-50/70 transition-colors">
                  About
                  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/10
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  transition-all duration-200 translate-y-1 group-hover:translate-y-0 overflow-hidden py-1.5">
                  <Link href="/about" className="block px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-50 hover:text-[#1d5fa1] transition-colors">
                    About Egypt Globe Group
                  </Link>
                  <div className="mx-4 my-1 border-t border-slate-100" />
                  {grouped.about.map(p => (
                    <Link key={p.id} href={p.path}
                      className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#1d5fa1] transition-colors">
                      {p.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Direct links */}
            {[
              { href: '/applications', label: 'Applications' },
              { href: '/global-presence', label: 'Global' },
              { href: '/blog', label: 'News' },
              { href: '/contact', label: 'Contact' },
            ].map(({ href, label }) => (
              <Link key={href} href={href}
                className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#1d5fa1] hover:bg-blue-50/70 transition-colors">
                {label}
              </Link>
            ))}
          </nav>

          {/* Right-side actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {visibility.authenticated ? (
              <Link href="/buyer"
                className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#1d5fa1] px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                  {(visibility.contactName || visibility.email || '?').charAt(0).toUpperCase()}
                </span>
                <span className="hidden lg:inline">My catalogue</span>
              </Link>
            ) : (
              <Link href="/login"
                className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-[#1d5fa1] px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span className="hidden lg:inline">Sign in</span>
              </Link>
            )}

            {/* CTA — compact icon-only on mobile (<sm), full label sm+ */}
            <Link href="/rfq" aria-label="Get a quote"
              className="flex items-center gap-1.5 text-sm font-bold text-white bg-[#FF6321] hover:bg-[#e0541b] active:bg-[#c84512] px-3 sm:px-5 h-10 sm:h-auto sm:py-2.5 rounded-xl sm:rounded-lg shadow-md shadow-orange-500/25 transition-all sm:hover:-translate-y-0.5">
              <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <span className="hidden sm:inline">📋 Get a Quote</span>
              <span className="sm:hidden">Quote</span>
            </Link>

            {/* Mobile hamburger */}
            <MobileMenu
              productDivisions={PRODUCT_DIVISIONS}
              serviceDivisions={SERVICE_DIVISIONS}
              aboutPages={grouped.about || []}
              settings={s}
              visibility={visibility}
            />
          </div>

        </div>
      </div>
    </header>
  )
}
