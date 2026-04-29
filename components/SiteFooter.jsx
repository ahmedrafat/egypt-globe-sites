import Link from 'next/link'
import { getPagesByCategory, CATEGORY_META } from '../lib/corporatePages'

const FOOTER_ORDER = ['products', 'salt', 'fertilizers', 'chemicals', 'construction', 'agro', 'about', 'partners']

export default async function SiteFooter() {
  const grouped = await getPagesByCategory()

  return (
    <footer className="border-t border-white/10 bg-black/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🌍</span>
              <span className="font-bold">Egypt Globe Group</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              B2B export trading conglomerate. Salt, cement, fertilizers, chemicals, construction materials, and agricultural products. 60+ countries.
            </p>
            <Link href="/contact" className="text-sm text-[#FF6321] hover:underline">
              Contact us →
            </Link>
          </div>

          {/* Category columns */}
          {FOOTER_ORDER.filter(c => grouped[c]?.length).slice(0, 4).map(catId => {
            const cat = CATEGORY_META[catId]
            const pages = grouped[catId].slice(0, 6)
            return (
              <div key={catId}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">{cat.icon} {cat.label}</h4>
                <ul className="space-y-1.5">
                  {pages.map(p => (
                    <li key={p.id}>
                      <Link href={p.path} className="text-xs text-gray-500 hover:text-white transition-colors line-clamp-1">
                        {p.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <span>&copy; {new Date().getFullYear()} Egypt Globe Group · All rights reserved</span>
          <div className="flex gap-4">
            <Link href="/cookies-policy" className="hover:text-white">Cookies</Link>
            <Link href="/faq" className="hover:text-white">FAQ</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
