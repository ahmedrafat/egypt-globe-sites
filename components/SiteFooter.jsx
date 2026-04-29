/**
 * SiteFooter — full corporate footer for egyptglobe.com.
 *
 * White-on-deep-blue. Brand block + product columns + corporate columns
 * + contact column. Bottom strip carries the Egyptian commercial
 * registry, tax card and export-license numbers as required by
 * Egyptian export-trade conventions, plus LinkedIn and copyright.
 */
import Link from 'next/link'
import Logo from './Logo'
import { PRODUCT_DIVISIONS, COMPANY_INFO } from '../lib/corporatePages'

export default function SiteFooter() {
  return (
    <footer className="bg-[#0f1f3a] text-slate-300 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand block */}
          <div className="lg:col-span-4">
            <div className="bg-white inline-flex p-3 rounded-xl shadow-sm">
              <Logo className="h-10 w-auto" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400 max-w-sm">
              {COMPANY_INFO.tagline}. Salt, cement, fertilizers, chemicals,
              construction materials, agro & food, industrial minerals — shipped
              from 7 Egyptian ports to 60+ destination markets.
            </p>
            <a href={COMPANY_INFO.linkedin} target="_blank" rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors">
              <span className="w-8 h-8 rounded-md bg-[#0a66c2] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.268 2.37 4.268 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </span>
              Follow on LinkedIn →
            </a>
          </div>

          {/* Product divisions */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              📦 Product Divisions
            </h4>
            <ul className="space-y-2 text-sm">
              {PRODUCT_DIVISIONS.map(div => (
                <li key={div.id}>
                  <Link href={div.path} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                    <span aria-hidden="true">{div.icon}</span> {div.label}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link href="/products" className="text-[#FF6321] font-semibold hover:underline">
                  View all products →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company / corporate */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              🏢 Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/about/mission-vision" className="text-slate-400 hover:text-white transition-colors">Mission & Vision</Link></li>
              <li><Link href="/about/locations" className="text-slate-400 hover:text-white transition-colors">Locations</Link></li>
              <li><Link href="/about/quality-compliance" className="text-slate-400 hover:text-white transition-colors">Quality & Compliance</Link></li>
              <li><Link href="/about/careers" className="text-slate-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/global-presence" className="text-slate-400 hover:text-white transition-colors">Global Presence</Link></li>
              <li><Link href="/partners" className="text-slate-400 hover:text-white transition-colors">Partners</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              📞 Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <div className="font-semibold text-white text-xs mb-1">Head Office — Cairo</div>
                <p className="text-slate-400 text-xs leading-relaxed">{COMPANY_INFO.headOffice}</p>
              </li>
              <li>
                <div className="font-semibold text-white text-xs mb-1">Operations — Damietta</div>
                <p className="text-slate-400 text-xs leading-relaxed">{COMPANY_INFO.operationsOffice}</p>
              </li>
              <li className="pt-1 border-t border-white/10">
                <a href={`tel:${COMPANY_INFO.phoneE164}`} className="block text-slate-300 hover:text-white">
                  📞 {COMPANY_INFO.phone}
                </a>
                <span className="block text-slate-500 text-xs mt-1">Tel & Fax: {COMPANY_INFO.telFax}</span>
                <a href={`mailto:${COMPANY_INFO.email}`} className="block text-slate-300 hover:text-white mt-1">
                  ✉ {COMPANY_INFO.email}
                </a>
              </li>
              <li>
                <Link href="/rfq"
                  className="inline-flex items-center gap-2 text-sm font-bold bg-[#FF6321] hover:bg-[#e0541b] text-white px-4 py-2 rounded-lg transition-colors">
                  📋 Request a Quote
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance / registries strip */}
        <div className="mt-12 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="rounded-lg bg-white/5 px-4 py-3">
            <div className="text-slate-500 uppercase tracking-wider text-[10px]">Commercial Registry</div>
            <div className="text-white font-semibold mt-0.5">{COMPANY_INFO.commercialRegistry}</div>
          </div>
          <div className="rounded-lg bg-white/5 px-4 py-3">
            <div className="text-slate-500 uppercase tracking-wider text-[10px]">Tax Card</div>
            <div className="text-white font-semibold mt-0.5">{COMPANY_INFO.taxCard}</div>
          </div>
          <div className="rounded-lg bg-white/5 px-4 py-3">
            <div className="text-slate-500 uppercase tracking-wider text-[10px]">Egyptian Export License</div>
            <div className="text-white font-semibold mt-0.5">{COMPANY_INFO.exportLicense}</div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span className="text-slate-500">
            © {new Date().getFullYear()} {COMPANY_INFO.name} · All rights reserved
          </span>
          <div className="flex items-center gap-5 text-slate-500">
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <Link href="/rfq" className="hover:text-white">RFQ</Link>
            <a href={COMPANY_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
