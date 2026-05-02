/**
 * SiteFooter — full corporate footer for egyptglobe.com.
 *
 * Deep-blue background with orange top-accent strip. Brand block +
 * product columns + services column + company links + contact block +
 * Egyptian commercial registry / tax / export-license compliance strip.
 * `settings` prop merges site_settings overrides over the static default.
 */
import Link from 'next/link'
import Logo from './Logo'
import { PRODUCT_DIVISIONS, SERVICE_DIVISIONS, COMPANY_INFO_DEFAULT, LOGISTICS_PORTAL_URL } from '../lib/corporatePages'

export default function SiteFooter({ settings }) {
  const s = settings || COMPANY_INFO_DEFAULT
  return (
    <footer className="bg-[#0d1b30] text-slate-300 mt-16 sm:mt-24">

      {/* Orange accent top bar */}
      <div className="h-1 bg-gradient-to-r from-[#FF6321] via-[#ff8c55] to-[#FF6321]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 sm:pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-8 sm:gap-8">

          {/* ── Brand block — spans full width on mobile ───────── */}
          <div className="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-3">
            <div className="bg-white inline-flex p-3 rounded-xl shadow-lg mb-5">
              <Logo imageUrl={s.logoUrl} className="h-10 w-auto" />
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs mb-5">
              {s.tagline}. Salt, cement, fertilizers, chemicals,
              construction materials, agro & food, and industrial minerals —
              shipped from 7 Egyptian ports to 60+ destination markets.
            </p>
            {s.linkedin && (
              <a href={s.linkedin} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group">
                <span className="w-8 h-8 rounded-lg bg-[#0a66c2] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.268 2.37 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </span>
                Follow on LinkedIn →
              </a>
            )}
          </div>

          {/* ── Product divisions ──────────────────────────────── */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#FF6321] rounded-full" />
              Products
            </h4>
            <ul className="space-y-2.5 text-sm">
              {PRODUCT_DIVISIONS.map(div => (
                <li key={div.id}>
                  <Link href={div.path} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span aria-hidden="true" className="group-hover:scale-110 transition-transform inline-block">
                      {div.icon}
                    </span>
                    {div.label}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link href="/products" className="text-[#FF6321] font-semibold hover:underline text-xs">
                  All products →
                </Link>
              </li>
            </ul>
          </div>

          {/* ── Service divisions ──────────────────────────────── */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#FF6321] rounded-full" />
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {SERVICE_DIVISIONS.map(svc => (
                <li key={svc.id}>
                  <Link href={svc.path} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <span aria-hidden="true" className="group-hover:scale-110 transition-transform inline-block">
                      {svc.icon}
                    </span>
                    {svc.label}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link href="/services" className="text-[#FF6321] font-semibold hover:underline text-xs">
                  All services →
                </Link>
              </li>
              <li className="pt-2 mt-1 border-t border-white/10">
                <a href={LOGISTICS_PORTAL_URL} target="_blank" rel="noopener noreferrer"
                  className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1.5 transition-colors">
                  ⚓ Provider portal ↗
                </a>
                <span className="text-[10px] text-slate-600 block mt-0.5">For freight carriers</span>
              </li>
            </ul>
          </div>

          {/* ── Company links ──────────────────────────────────── */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#FF6321] rounded-full" />
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['/about', 'About'],
                ['/about/mission-vision', 'Mission & Vision'],
                ['/about/locations', 'Locations'],
                ['/about/quality-compliance', 'Quality'],
                ['/about/careers', 'Careers'],
                ['/case-studies', 'Case Studies'],
                ['/blog', 'News & Blog'],
                ['/global-presence', 'Global Presence'],
                ['/partners', 'Partners'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact block — spans full on mobile so address reads cleanly ── */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-3">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#FF6321] rounded-full" />
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <div className="text-xs font-semibold text-slate-300 mb-0.5">📍 Head Office — Cairo</div>
                <p className="text-slate-500 text-xs leading-relaxed">{s.headOffice}</p>
              </li>
              <li>
                <div className="text-xs font-semibold text-slate-300 mb-0.5">⚓ Operations — Damietta</div>
                <p className="text-slate-500 text-xs leading-relaxed">{s.operationsOffice}</p>
              </li>
              <li className="pt-1 border-t border-white/10">
                <a href={`tel:${s.phoneE164}`}
                  className="block text-slate-300 hover:text-white transition-colors font-medium text-sm">
                  📞 {s.phone}
                </a>
                <span className="block text-slate-600 text-xs mt-0.5">Tel &amp; Fax: {s.telFax}</span>
                <a href={`mailto:${s.email}`}
                  className="block text-slate-300 hover:text-white transition-colors mt-1 text-sm">
                  ✉ {s.email}
                </a>
              </li>
              <li className="pt-1">
                <Link href="/rfq"
                  className="inline-flex items-center gap-2 text-sm font-bold bg-[#FF6321] hover:bg-[#e0541b] text-white px-5 py-2.5 rounded-lg transition-all hover:-translate-y-0.5 shadow-md shadow-orange-900/30">
                  📋 Request a Quote
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Compliance strip ─────────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-white/8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Commercial Registry', value: s.commercialRegistry },
            { label: 'Tax Card', value: s.taxCard },
            { label: 'Egyptian Export License', value: s.exportLicense },
          ].map(item => (
            <div key={item.label} className="rounded-xl bg-white/4 border border-white/8 px-4 py-3 hover:bg-white/6 transition-colors">
              <div className="text-slate-600 uppercase tracking-widest text-[10px] font-semibold mb-1">
                {item.label}
              </div>
              <div className="text-white font-semibold text-sm">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────────── */}
      <div className="border-t border-white/8 bg-black/25">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span className="text-slate-600">
            © {new Date().getFullYear()} {s.name} · All rights reserved · Egypt
          </span>
          <div className="flex items-center gap-5 text-slate-600">
            <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact</Link>
            <Link href="/rfq" className="hover:text-slate-300 transition-colors">RFQ</Link>
            <Link href="/about/quality-compliance" className="hover:text-slate-300 transition-colors">Quality</Link>
            {s.linkedin && (
              <a href={s.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>

    </footer>
  )
}
