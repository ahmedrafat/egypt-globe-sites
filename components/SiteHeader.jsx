/**
 * SiteHeader — sticky navigation for egyptglobe.com.
 *
 * Categories driven by the live `egg_corporate_pages` rows. Each category
 * becomes a dropdown listing its pages.
 */
import Link from 'next/link'
import { getPagesByCategory, CATEGORY_META } from '../lib/corporatePages'

const NAV_ORDER = ['products', 'salt', 'fertilizers', 'chemicals', 'construction', 'agro', 'minerals', 'about', 'partners', 'blog']

export default async function SiteHeader() {
  const grouped = await getPagesByCategory()

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0A0A0A]/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🌍</span>
            <span className="font-bold text-base group-hover:text-[#FF6321] transition-colors">
              Egypt Globe <span className="text-[#FF6321]">Group</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ORDER.filter(c => grouped[c]?.length).map(catId => {
              const cat = CATEGORY_META[catId]
              const pages = grouped[catId]
              return (
                <div key={catId} className="relative group">
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                    <span>{cat.icon}</span> {cat.label}
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-72 bg-[#111] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2">
                    {pages.map(p => (
                      <Link key={p.id} href={p.path}
                        className="block px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded transition-colors">
                        {p.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/rfq"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-white bg-[#FF6321] hover:bg-[#FF6321]/90 px-3 py-1.5 rounded-lg transition-colors">
              📋 Get a Quote
            </Link>
            <Link href="/contact"
              className="text-xs font-semibold text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
