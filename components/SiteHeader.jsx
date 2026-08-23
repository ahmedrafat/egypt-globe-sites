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
    <header className="sticky top-0 z-30 border-b border-[#14161a]/10 bg-white/95 backdrop-blur-md shadow-sm">

      {/* ── Top info strip ───────────────────────────────────────── */}
      <div className="hidden md:block bg-[#1d5fa1]">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-xs">
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
              <button className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold text-[#3f4650] hover:text-[#0b8f84] hover:bg-[#f2fbfa] transition-colors">
                Products
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-[660px] bg-white border border-[#14161a]/10 rounded-2xl shadow-[0_24px_60px_-28px_rgba(20,22,26,.35)]
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200 translate-y-1 group-hover:translate-y-0 overflow-hidden">
                {/* Mega-menu header */}
                <div className="px-5 pt-4 pb-3 border-b border-[#14161a]/10 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#8a93a3]">Product Divisions</span>
                  <Link href="/products" className="text-xs font-semibold text-[#0b8f84] hover:underline">
                    All products →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-1 p-3">
                  {PRODUCT_DIVISIONS.map(div => (
                    <Link key={div.id} href={div.path}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#f9fafb] transition-colors group/item">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: `${div.color}18` }}>
                        {div.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-[#14161a] group-hover/item:text-[#0b8f84] transition-colors">
                          {div.label}
                        </div>
                        <div className="text-xs text-[#7a8290] line-clamp-1 mt-0.5">{div.blurb}</div>
                      </div>
                    </Link>
                  ))}
                </div>
                {/* Mega-menu footer */}
                <div className="px-5 py-2.5 bg-[#f9fafb] border-t border-[#14161a]/10 flex items-center gap-3 text-[11px] text-[#7a8290]">
                  <span>🇪🇬 Egyptian-origin verified</span>
                  <span className="text-[#c9ced6]">·</span>
                  <span>7 seaports · FOB / CIF / CFR</span>
                  <span className="text-[#c9ced6]">·</span>
                  <span>CoA per shipment</span>
                </div>
              </div>
            </div>

            {/* Services mega-menu */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold text-[#3f4650] hover:text-[#0b8f84] hover:bg-[#f2fbfa] transition-colors">
                Services
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-[600px] bg-white border border-[#14161a]/10 rounded-2xl shadow-[0_24px_60px_-28px_rgba(20,22,26,.35)]
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200 translate-y-1 group-hover:translate-y-0 overflow-hidden">
                {/* Mega-menu header */}
                <div className="px-5 pt-4 pb-3 border-b border-[#14161a]/10 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#8a93a3]">Supply-chain Services</span>
                  <Link href="/services" className="text-xs font-semibold text-[#0b8f84] hover:underline">
                    All services →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-1 p-3">
                  {SERVICE_DIVISIONS.map(svc => (
                    <Link key={svc.id} href={svc.path}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#f9fafb] transition-colors group/item">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: `${svc.color}18` }}>
                        {svc.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-[#14161a] group-hover/item:text-[#0b8f84] transition-colors">
                          {svc.label}
                        </div>
                        <div className="text-xs text-[#7a8290] line-clamp-1 mt-0.5">{svc.blurb}</div>
                      </div>
                    </Link>
                  ))}
                </div>
                {/* Mega-menu footer */}
                <div className="px-5 py-2.5 bg-[#f9fafb] border-t border-[#14161a]/10 flex items-center gap-3 text-[11px] text-[#7a8290]">
                  <span>Logistics · Port · QC · Docs</span>
                  <span className="text-[#c9ced6]">·</span>
                  <span>Pair any product with the service it needs</span>
                </div>
              </div>
            </div>

            {/* Resources mega-menu — Markets · Trade Tools · Standards · Ports */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold text-[#3f4650] hover:text-[#0b8f84] hover:bg-[#f2fbfa] transition-colors">
                Resources
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[920px] max-w-[calc(100vw-2rem)] bg-white border border-[#14161a]/10 rounded-2xl shadow-[0_24px_60px_-28px_rgba(20,22,26,.35)]
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200 translate-y-1 group-hover:-translate-x-1/2 group-hover:translate-y-0 overflow-hidden">
                {/* Mega-menu header */}
                <div className="px-6 pt-4 pb-3 border-b border-[#14161a]/10 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#8a93a3]">Knowledge Base — 48 reference pages</span>
                  <Link href="/markets" className="text-xs font-semibold text-[#0b8f84] hover:underline">
                    Markets hub →
                  </Link>
                </div>

                <div className="grid grid-cols-4 gap-0 divide-x divide-[#14161a]/10">
                  {/* Markets column */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base">📊</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700">Market Intelligence</span>
                    </div>
                    <Link href="/markets/cement-clinker-hs-2523" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">Cement & clinker (HS 2523)</Link>
                    <Link href="/markets/industrial-salt-egypt" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">Industrial salt</Link>
                    <Link href="/markets/egypt-gypsum-plaster" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">Gypsum & plaster</Link>
                    <Link href="/markets/egypt-npk-fertilizer" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">NPK fertilizer market</Link>
                    <Link href="/markets/egypt-caustic-soda" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">Caustic soda (NaOH)</Link>
                    <Link href="/markets/egypt-palm-oil" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">Palm oil</Link>
                    <Link href="/markets/mining-companies-egypt" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">Mining in Egypt</Link>
                    <Link href="/markets" className="block text-[11px] font-bold text-cyan-700 hover:underline pt-2">All market briefs →</Link>
                  </div>

                  {/* Trade Tools column */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base">🧰</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700">Trade Tools</span>
                    </div>
                    <Link href="/trade-tools/hs-codes" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">HS Code library</Link>
                    <Link href="/trade-tools/incoterms-2020" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">Incoterms 2020</Link>
                    <Link href="/trade-tools/vessel-sizes" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">Vessel size guide</Link>
                    <Link href="/trade-tools/import-guides" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight font-semibold pt-2">Country import guides — 15 markets</Link>
                    <Link href="/trade-tools/import-guides/germany" className="block text-[11px] text-[#7a8290] hover:text-[#0b8f84] py-0.5 leading-tight pl-3">→ Germany</Link>
                    <Link href="/trade-tools/import-guides/uk" className="block text-[11px] text-[#7a8290] hover:text-[#0b8f84] py-0.5 leading-tight pl-3">→ UK</Link>
                    <Link href="/trade-tools/import-guides/usa" className="block text-[11px] text-[#7a8290] hover:text-[#0b8f84] py-0.5 leading-tight pl-3">→ USA</Link>
                    <Link href="/trade-tools/import-guides/saudi-arabia" className="block text-[11px] text-[#7a8290] hover:text-[#0b8f84] py-0.5 leading-tight pl-3">→ Saudi Arabia</Link>
                    <Link href="/trade-tools/import-guides/india" className="block text-[11px] text-[#7a8290] hover:text-[#0b8f84] py-0.5 leading-tight pl-3">→ India</Link>
                  </div>

                  {/* Standards column */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base">📋</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Standards</span>
                    </div>
                    <Link href="/standards/en-197-1" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">EN 197-1 — EU cement</Link>
                    <Link href="/standards/astm-c150" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">ASTM C150 — US cement</Link>
                    <Link href="/standards/en-16811-1" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">EN 16811-1 — EU de-icing salt</Link>
                    <Link href="/standards/astm-d632" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">ASTM D632 — US salt</Link>
                    <Link href="/standards/aashto-m-143" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">AASHTO M-143 — US highway</Link>
                    <Link href="/standards/bs-3247" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">BS 3247:2011 — UK salt</Link>
                    <Link href="/standards/gost-13830" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">GOST 13830 — CIS salt</Link>
                    <Link href="/standards/ss-en-16811-1" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">SS-EN 16811-1 Nordic</Link>
                    <Link href="/standards/iso-9001-salt-suppliers" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">ISO 9001 — quality</Link>
                  </div>

                  {/* Ports column */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base">⚓</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Egyptian Ports</span>
                    </div>
                    <Link href="/ports/damietta-salt" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">Damietta — main hub, 17m</Link>
                    <Link href="/ports/alexandria-salt" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">Alexandria — 14m</Link>
                    <Link href="/ports/el-dekheila-salt" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">El Dekheila — 20m Capesize</Link>
                    <Link href="/ports/ain-sokhna-salt" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">Ain Sokhna — Red Sea 17m</Link>
                    <Link href="/ports/port-said-east-salt" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">Port Said East — 22m ULCV</Link>
                    <Link href="/ports/al-arish-salt" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">Al-Arish — upgraded 14m, 50k DWT</Link>
                    <Link href="/ports/adabiya-salt" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">Adabiya — Suez Gulf bulk</Link>
                    <Link href="/ports/safaga-salt" className="block text-xs text-[#3f4650] hover:text-[#0b8f84] py-1 leading-tight">Safaga — Red Sea phosphate</Link>
                    <Link href="/services/loading-ports" className="block text-[11px] font-bold text-blue-700 hover:underline pt-2">All Egyptian loading ports →</Link>
                    <div className="mt-4 pt-3 border-t border-[#14161a]/10">
                      <Link href="/blog" className="block text-xs font-semibold text-[#3f4650] hover:text-[#0b8f84] py-1">📝 News & insights</Link>
                      <Link href="/case-studies" className="block text-xs font-semibold text-[#3f4650] hover:text-[#0b8f84] py-1">📖 Case studies</Link>
                      <Link href="/coa" className="block text-xs font-semibold text-[#3f4650] hover:text-[#0b8f84] py-1">🧪 CoA centre</Link>
                    </div>
                  </div>
                </div>

                {/* Mega-menu footer */}
                <div className="px-6 py-2.5 bg-[#f9fafb] border-t border-[#14161a]/10 flex items-center gap-3 text-[11px] text-[#7a8290]">
                  <span>13 market briefs</span>
                  <span className="text-[#c9ced6]">·</span>
                  <span>19 trade tools</span>
                  <span className="text-[#c9ced6]">·</span>
                  <span>9 standards</span>
                  <span className="text-[#c9ced6]">·</span>
                  <span>8 ports</span>
                  <span className="text-[#c9ced6] ml-auto">·</span>
                  <Link href="/search" className="text-[#0b8f84] hover:underline font-semibold">🔍 Search the site →</Link>
                </div>
              </div>
            </div>

            {/* About dropdown */}
            {grouped.about?.length > 0 && (
              <div className="relative group">
                <button className="flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-semibold text-[#3f4650] hover:text-[#0b8f84] hover:bg-[#f2fbfa] transition-colors">
                  About
                  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-[#14161a]/10 rounded-2xl shadow-[0_24px_60px_-28px_rgba(20,22,26,.35)]
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  transition-all duration-200 translate-y-1 group-hover:translate-y-0 overflow-hidden py-1.5">
                  <Link href="/about" className="block px-4 py-2.5 text-sm font-bold text-[#14161a] hover:bg-[#f9fafb] hover:text-[#0b8f84] transition-colors">
                    About Egypt Globe Group
                  </Link>
                  <div className="mx-4 my-1 border-t border-[#14161a]/10" />
                  {grouped.about.map(p => (
                    <Link key={p.id} href={p.path}
                      className="block px-4 py-2 text-sm text-[#3f4650] hover:bg-[#f9fafb] hover:text-[#0b8f84] transition-colors">
                      {p.title}
                    </Link>
                  ))}
                  <div className="mx-4 my-1 border-t border-[#14161a]/10" />
                  <Link href="/global-presence" className="block px-4 py-2 text-sm text-[#3f4650] hover:bg-[#f9fafb] hover:text-[#0b8f84] transition-colors">
                    Global presence — 60+ markets
                  </Link>
                  <Link href="/contact" className="block px-4 py-2 text-sm text-[#3f4650] hover:bg-[#f9fafb] hover:text-[#0b8f84] transition-colors">
                    Contact us
                  </Link>
                </div>
              </div>
            )}

            {/* Direct links — kept lean */}
            <Link href="/applications"
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-[#3f4650] hover:text-[#0b8f84] hover:bg-[#f2fbfa] transition-colors">
              Applications
            </Link>
            <Link href="/contact"
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-[#3f4650] hover:text-[#0b8f84] hover:bg-[#f2fbfa] transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right-side actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {visibility.authenticated ? (
              <Link href="/buyer"
                className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#3f4650] hover:text-[#0b8f84] px-3 py-2 rounded-lg hover:bg-[#f9fafb] transition-colors">
                <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                  {(visibility.contactName || visibility.email || '?').charAt(0).toUpperCase()}
                </span>
                <span className="hidden lg:inline">My catalogue</span>
              </Link>
            ) : (
              <Link href="/login"
                className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#3f4650] hover:text-[#0b8f84] px-3 py-2 rounded-lg hover:bg-[#f9fafb] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                <span className="hidden lg:inline">Sign in</span>
              </Link>
            )}

            {/* CTA — compact icon-only on mobile (<sm), full label sm+ */}
            <Link href="/rfq" aria-label="Get a quote"
              className="flex items-center gap-1.5 text-sm font-bold text-white bg-[#FF6321] hover:bg-[#14161a] active:bg-[#14161a] px-3 sm:px-5 h-10 sm:h-auto sm:py-2.5 rounded-full shadow-[0_10px_30px_-10px_rgba(255,99,33,.55)] transition-all">
              <svg className="w-4 h-4 sm:hidden" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              <span className="hidden sm:inline">Get a Quote</span>
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
