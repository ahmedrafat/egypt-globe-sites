/**
 * Egypt Globe Group home page.
 *
 * Renders the `/` row from `egg_corporate_pages` via the shared PageRenderer,
 * then a category grid linking into the 13 buckets (Salt / Fertilizers /
 * Chemicals / Construction / Agro / etc.).
 */
import Link from 'next/link'
import { getPageByPath, getPagesByCategory, CATEGORY_META } from '../lib/corporatePages'
import PageRenderer from '../components/PageRenderer'

export const revalidate = 60

const HOME_CATEGORY_ORDER = [
  'products', 'salt', 'fertilizers', 'chemicals', 'construction',
  'agro', 'minerals', 'about', 'partners', 'blog',
]

export const metadata = {
  title: 'Egypt Globe Group — B2B Export Trading Conglomerate',
  description:
    'Egyptian industrial excellence delivered to 60+ countries. Salt, cement, fertilizers, chemicals, construction materials, agricultural products. FOB / CIF / CFR from 7 Egyptian ports. Quote in 24 hours.',
}

export default async function HomePage() {
  const home = await getPageByPath('/')
  const grouped = await getPagesByCategory()

  return (
    <>
      {home ? (
        <PageRenderer page={home} />
      ) : (
        // Fallback hero when the `/` row hasn't been created in the CMS yet
        <section className="border-b border-white/10 bg-black/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="text-5xl mb-4">🌍</div>
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-tight">
              Egypt Globe <span className="text-[#FF6321]">Group</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              B2B export trading conglomerate. Salt, cement, fertilizers, chemicals,
              construction materials, agricultural products. Connecting Egyptian
              industrial excellence to 60+ countries.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
              <Link href="/rfq"
                className="bg-[#FF6321] hover:bg-[#FF6321]/90 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                📋 Get a Quote in 24h
              </Link>
              <Link href="/contact"
                className="border border-white/20 hover:bg-white/5 text-white font-medium px-6 py-3 rounded-xl transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories grid — one tile per active category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/5">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Browse by Category</h2>
          <p className="text-gray-400">13 product divisions · 79+ pages · 60+ destination markets</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {HOME_CATEGORY_ORDER.filter(c => grouped[c]?.length).map(catId => {
            const cat = CATEGORY_META[catId]
            const pages = grouped[catId]
            const featured = pages.find(p => p.hero_photo_url) || pages[0]
            return (
              <Link key={catId} href={featured?.path || `/${catId}`}
                className="group relative rounded-2xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 hover:-translate-y-1 transition-all overflow-hidden">
                <div className="aspect-[4/5] bg-[#0A0A0A] overflow-hidden">
                  {featured?.hero_photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={featured.hero_photo_url} alt={cat.label}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl opacity-30"
                      style={{ background: `linear-gradient(135deg, ${cat.color}22, transparent)` }}>
                      {cat.icon}
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{cat.icon}</span>
                    <h3 className="font-bold text-white">{cat.label}</h3>
                  </div>
                  <p className="text-xs text-gray-300">{pages.length} {pages.length === 1 ? 'page' : 'pages'}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Trust strip */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ['🌍', '60+', 'Destination markets'],
            ['🚢', '7', 'Egyptian export ports'],
            ['📦', '13', 'Product divisions'],
            ['⏱', '24h', 'Quote turnaround'],
          ].map(([icon, big, label]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-3xl font-bold text-[#FF6321] mb-1">{big}</div>
              <div className="text-xs text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
