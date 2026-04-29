/**
 * SiteHeader — sticky navigation for egyptglobe.com.
 *
 * White theme. Wordmark logo (or admin-uploaded image) on the left,
 * mega-menus for Products + Services + About, plus an orange "Get a
 * Quote" CTA. `settings` prop comes from site_settings via the
 * RootLayout — falls back to COMPANY_INFO_DEFAULT when null.
 */
import Link from 'next/link'
import Logo from './Logo'
import {
  PRODUCT_DIVISIONS,
  SERVICE_DIVISIONS,
  COMPANY_INFO_DEFAULT,
  getPagesByCategory,
} from '../lib/corporatePages'

export default async function SiteHeader({ settings }) {
  const s = settings || COMPANY_INFO_DEFAULT
  const grouped = await getPagesByCategory()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-md">
      {/* Top contact strip */}
      <div className="hidden md:block bg-[#1d5fa1] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-5">
            <a href={`tel:${s.phoneE164}`} className="hover:text-orange-300 transition-colors">
              ☎ {s.phone}
            </a>
            <a href={`mailto:${s.email}`} className="hover:text-orange-300 transition-colors">
              ✉ {s.email}
            </a>
            <span className="hidden lg:inline text-blue-200">
              Cairo HQ · Damietta Operations · 60+ destination markets
            </span>
          </div>
          <div className="flex items-center gap-4">
            {s.linkedin && (
              <a href={s.linkedin} target="_blank" rel="noopener noreferrer"
                className="hover:text-orange-300 transition-colors flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.268 2.37 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main nav row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo imageUrl={s.logoUrl} className="h-9 w-auto transition-transform group-hover:scale-105" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {/* Products mega-menu */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-[#1d5fa1] hover:bg-blue-50 transition-colors">
                Products <span className="text-xs">▾</span>
              </button>
              <div className="absolute top-full left-0 mt-1 w-[640px] bg-white border border-slate-200 rounded-2xl shadow-2xl
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200 -translate-y-1 group-hover:translate-y-0 p-5">
                <div className="grid grid-cols-2 gap-3">
                  {PRODUCT_DIVISIONS.map(div => (
                    <Link key={div.id} href={div.path}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                        style={{ background: `${div.color}18`, color: div.color }}>
                        {div.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 group-hover/item:text-[#1d5fa1] transition-colors">
                          {div.label}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-2 mt-0.5">{div.blurb}</div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Egyptian-origin · FOB / CIF / CFR · 7 ports</span>
                  <Link href="/products" className="text-[#1d5fa1] font-semibold hover:underline">
                    View all products →
                  </Link>
                </div>
              </div>
            </div>

            {/* Services mega-menu */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-[#1d5fa1] hover:bg-blue-50 transition-colors">
                Services <span className="text-xs">▾</span>
              </button>
              <div className="absolute top-full left-0 mt-1 w-[600px] bg-white border border-slate-200 rounded-2xl shadow-2xl
                opacity-0 invisible group-hover:opacity-100 group-hover:visible
                transition-all duration-200 -translate-y-1 group-hover:translate-y-0 p-5">
                <div className="grid grid-cols-2 gap-3">
                  {SERVICE_DIVISIONS.map(svc => (
                    <Link key={svc.id} href={svc.path}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                        style={{ background: `${svc.color}18`, color: svc.color }}>
                        {svc.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 group-hover/item:text-[#1d5fa1] transition-colors">
                          {svc.label}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-2 mt-0.5">{svc.blurb}</div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Logistics · Port · Added value · Packing · QC · Docs</span>
                  <Link href="/services" className="text-[#1d5fa1] font-semibold hover:underline">
                    All services →
                  </Link>
                </div>
              </div>
            </div>

            {/* About mega-menu */}
            {grouped.about?.length > 0 && (
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-[#1d5fa1] hover:bg-blue-50 transition-colors">
                  About <span className="text-xs">▾</span>
                </button>
                <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  transition-all duration-200 -translate-y-1 group-hover:translate-y-0 py-2">
                  <Link href="/about" className="block px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 hover:text-[#1d5fa1]">
                    About Egypt Globe
                  </Link>
                  <div className="my-1 border-t border-slate-100" />
                  {grouped.about.map(p => (
                    <Link key={p.id} href={p.path}
                      className="block px-4 py-1.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#1d5fa1] transition-colors">
                      {p.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Link href="/global-presence"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-[#1d5fa1] hover:bg-blue-50 transition-colors">
              Global Presence
            </Link>
            <Link href="/contact"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-[#1d5fa1] hover:bg-blue-50 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/rfq"
              className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-white bg-[#FF6321] hover:bg-[#e0541b] px-4 py-2 rounded-lg shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
              📋 Get a Quote
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
