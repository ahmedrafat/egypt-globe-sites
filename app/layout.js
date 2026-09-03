import { Geist, Geist_Mono, Fraunces } from 'next/font/google'
import './globals.css'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import WhatsAppFab from '../components/WhatsAppFab'
import { OrganizationJsonLd } from '../components/StructuredData'
import WebVitalsReporter from '../components/WebVitalsReporter'
import { getSiteSettings } from '../lib/corporatePages'
import { getCurrentBrand, brandMeta } from '../lib/brand'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
// Light editorial system — display serif shared by the landing + every template (.egg-display)
const fraunces = Fraunces({ variable: '--font-fraunces', subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], display: 'swap' })

/**
 * Build per-request metadata so the favicon + OG image come from
 * site_settings (admin can swap them without a deploy). Falls back to
 * /favicon.ico shipped in /public when no override is set.
 */
export async function generateMetadata() {
  const settings = await getSiteSettings()
  // Drop 167 — multi-tenant: read current brand from middleware-stamped header
  const brandCode = await getCurrentBrand()
  const meta = brandMeta(brandCode)
  const isUmbrella = brandCode === 'EGG'
  const brandName = isUmbrella ? settings.name : meta.siteName
  const canonicalBase = `https://${meta.host}`
  const description = isUmbrella
    ? 'Egyptian salt, cement, fertilizers, chemicals, construction materials & industrial minerals exported to 60+ countries. FOB / CIF / CFR from 7 Egyptian seaports. ISO 22000 · EN 197-1 · GOEIC certified. Quote in 24h.'
    : (meta.brandCode === 'SINAI_SALT' ? 'Egyptian sea salt from North Sinai (Bardawil + El-Arish coast). Bulk wholesale FOB Damietta + Port Said East. Sea salt specialist brand of Egypt Globe Group.'
      : meta.brandCode === 'EG_SALT'    ? 'Bulk Egyptian industrial salt — chlor-alkali, deicing, water treatment, oilfield. 50+ SKUs. Min 260 MT FOB Damietta. EG Salt — bulk industrial brand of Egypt Globe Group.'
      : meta.brandCode === 'GLOBE_SALT' ? 'Wholesale Egyptian salt to 60+ countries. 100 SKUs across food, deicing, industrial, pharma, chlor-alkali. FOB / CIF / CFR from 7 Egyptian ports. Globe Salt — wholesale export brand of Egypt Globe Group.'
      : 'Egyptian salt. FOB Damietta + Alexandria + Port Said East. Brand of Egypt Globe Group.')

  return {
    metadataBase: new URL(canonicalBase),
    title: {
      default: isUmbrella
        ? `${brandName} — B2B Export Trading Conglomerate`
        : `${brandName} — ${meta.titleSuffix.replace('· ', '')}`,
      template: `%s ${meta.titleSuffix}`,
    },
    description,
    // Drop 96 — expanded per-brand keyword arrays. Researched against
    // procurement-officer + buyer search-intent vocabulary for the
    // Egyptian bulk-salt + B2B export niche. Mix of high-volume head
    // terms (bulk salt, rock salt egypt) + low-competition long-tail
    // (siwa rock salt, qattara depression mines, EN 16811-1 grade a
    // supplier, AASHTO M-143). Next 16 Metadata.keywords accepts arrays
    // (verified against metadata-interface.d.ts) — auto-joins to a
    // comma-separated string in the rendered <meta name="keywords">.
    keywords:
      meta.brandCode === 'SINAI_SALT' ? [
        // Geographic
        'sinai salt', 'north sinai sea salt', 'bardawil sea salt', 'el-arish sea salt',
        'sinai peninsula salt', 'red sea salt',
        // Sea salt specific
        'sea salt in bulk', 'bulk sea salt egypt', 'wholesale sea salt',
        'egyptian sea salt', 'mediterranean sea salt', 'solar-evaporated sea salt',
        // Standards & grades
        'EN 16811-1 grade a sea salt', 'EN 16811-1 grade b sea salt',
        'EN 16811-1 type 2 natural moisture sea salt', 'food grade sea salt',
        'cosmetic spa sea salt', 'pharmaceutical sea salt USP BP',
        // Procurement
        'FOB damietta sea salt', 'FOB port said east sea salt', 'FOB al-arish salt',
        'CIF sea salt prices', 'bulk vessel sea salt 25000 MT', 'panamax sea salt',
        'sea salt MOQ 240 MT', 'sea salt L/C', 'sea salt COA',
        // Supplier intent
        'egyptian sea salt exporter', 'egyptian sea salt supplier', 'sea salt manufacturer egypt',
        // Standards
        'ISO 22000 sea salt', 'HACCP sea salt', 'halal sea salt'
      ]
      : meta.brandCode === 'EG_SALT' ? [
        // Head commercial
        'bulk salt', 'bulk rock salt', 'rock salt egypt', 'industrial salt egypt',
        'bulk industrial salt', 'sodium chloride bulk', 'NaCl bulk', 'halite rock salt',
        // Origin
        'siwa rock salt', 'siwa oasis rock salt', 'qattara rock salt',
        'qattara depression rock salt', 'sinai salt', 'bulk egyptian salt',
        // Applications
        'chlor-alkali salt', 'membrane cell salt', 'PVC production salt',
        'electrolysis salt', 'water-treatment salt', 'ion-exchange salt',
        'water softener salt pellets', 'oilfield drilling salt', 'drilling mud salt',
        'completion fluid salt', 'leather tanning salt', 'hide preservation salt',
        'textile dyeing salt', 'reactive dye salt',
        // De-icing
        'deicing salt suppliers', 'road salt egypt', 'highway salt egypt',
        'snow melt salt', 'ice melt salt', 'winter road salt',
        // Standards
        'EN 16811-1 grade a', 'EN 16811-1 grade b', 'EN 16811-1 grade c lump',
        'EN 16811-1 type 1', 'EN 16811-1 type 2', 'ASTM D632 grade 1', 'ASTM D632 grade 2 fine',
        'AASHTO M-143', 'BS 3247:2011 UK highway salt', 'SS-EN 16811-1 nordic',
        'GOST 13830 grade I', 'GOST 13830 grade II', 'anti-caking E535 YPS',
        'ferrocyanide-free salt', 'pre-wetted MgCl2 salt',
        // Grain sizes (procurement-officer search terms)
        '0/2 mm fine road salt', '0/4 mm road salt', '0/6.3 mm road salt',
        '2/8 mm road salt', '10-40 mm lump road salt', '4.75-9.5 mm grade 1 coarse',
        // Procurement
        'FOB damietta industrial salt', 'FOB alexandria salt', 'FOB ain sokhna salt',
        'bulk vessel 25000 MT', 'panamax salt', 'handysize salt',
        'FCL container salt', 'salt MOQ 240 MT', 'salt tender egypt', 'L/C salt',
        // Certifications
        'ISO 22000', 'HACCP', 'ISO 9001 industrial salt', 'halal salt ESIC',
        'REACH compliant salt', 'GOEIC export certificate'
      ]
      : meta.brandCode === 'GLOBE_SALT' ? [
        // Head wholesale
        'wholesale egyptian salt', 'bulk salt wholesale', 'salt exporter egypt',
        'salt supplier egypt', 'salt manufacturer egypt',
        // Product
        'bulk rock salt', 'bulk sea salt', 'sea salt in bulk', 'rock salt egypt',
        'sodium chloride bulk', 'NaCl wholesale', 'halite rock salt',
        // Origin
        'sinai salt', 'siwa salt', 'qattara rock salt', 'north sinai sea salt',
        'bardawil sea salt', 'el-arish sea salt', 'red sea salt',
        // Grades
        'food grade salt egypt', 'FSSC 22000 food salt', 'pharmaceutical salt USP BP EP',
        'USP grade NaCl', 'BP/EP pharma salt', 'pool salt wholesale',
        'pool salt NSF/ANSI 60', 'cosmetic spa salt', 'bath salt blends',
        'dead sea salt blend', 'water softener salt', 'water-treatment salt',
        // De-icing
        'deicing salt egypt', 'road salt wholesale', 'EN 16811-1 supplier',
        'ASTM D632 grade 1 rock salt', 'BS 3247:2011 highway salt',
        'GOST 13830 grade I', 'SS-EN 16811-1 nordic', 'AASHTO M-143',
        'pre-wetted salt', 'anti-caking E535', 'ferrocyanide-free salt',
        // Applications
        'chlor-alkali salt', 'membrane cell salt', 'oilfield salt', 'agricultural salt',
        'aquaculture salt', 'feed grade salt', 'iodized salt',
        // Procurement & ports
        'FOB damietta', 'FOB alexandria', 'FOB ain sokhna', 'FOB port said east',
        'FOB al-arish', 'FOB el dekheila', 'CIF salt prices', 'CFR salt egypt',
        'bulk vessel 25000 MT', 'panamax salt', 'handysize salt',
        'FCL container salt', 'salt MOQ 240 MT', 'salt L/C', 'salt tender egypt',
        // Country-pair (highest-intent buyer searches)
        'salt supplier germany', 'salt supplier UK', 'salt supplier USA',
        'salt supplier saudi arabia', 'salt supplier india', 'salt supplier brazil',
        'salt supplier netherlands', 'salt supplier turkey', 'salt supplier nigeria',
        'salt supplier kenya', 'salt supplier morocco', 'salt supplier algeria',
        'mediterranean salt exporter', 'egyptian salt 60 countries',
        // Cert
        'ISO 22000', 'HACCP', 'ISO 9001', 'halal salt ESIC', 'GMP salt', 'GOEIC', 'REACH'
      ]
      : [
        // EGG umbrella — broadest topical authority across all divisions
        // Salt cluster
        'bulk salt', 'bulk egyptian salt', 'rock salt egypt', 'bulk rock salt',
        'sea salt in bulk', 'wholesale egyptian salt', 'salt exporter egypt',
        'sinai salt', 'siwa salt', 'qattara rock salt', 'north sinai sea salt',
        'bardawil sea salt', 'red sea salt',
        'deicing salt egypt', 'EN 16811-1 supplier', 'ASTM D632 grade 1 rock salt',
        'BS 3247:2011 highway salt', 'GOST 13830 grade I',
        'food grade salt egypt', 'pharmaceutical salt USP BP', 'pool salt egypt',
        'chlor-alkali salt', 'oilfield salt', 'water-treatment salt',
        // Cement cluster
        'cement egypt', 'OPC cement supplier', 'CEM I 42.5N', 'CEM I 52.5N',
        'sulfate resistant cement SRC', 'white cement egypt', 'clinker egypt',
        'EN 197-1 cement supplier', 'ASTM C150 cement',
        // Fertilizers cluster
        'fertilizer egypt', 'urea fertilizer supplier', 'UAN-32 solution',
        'ammonium nitrate egypt', 'MOP potash supplier', 'phosphate fertilizer',
        'NPK fertilizer egypt', 'sulphur fertilizer',
        // Construction & minerals
        'construction materials egypt', 'industrial minerals egypt',
        'limestone egypt', 'gypsum egypt', 'silica sand egypt', 'dolomite egypt',
        'bauxite egypt', 'kaolin egypt', 'iron ore egypt', 'manganese ore',
        'feldspar', 'bentonite',
        // Metals
        'steel products egypt', 'rebar exporter egypt', 'aluminum egypt',
        'copper supplier', 'ferro-alloys',
        // Chemicals
        'industrial chemicals egypt', 'caustic soda egypt', 'soda ash',
        'hydrochloric acid', 'sodium metabisulfite', 'calcium chloride',
        'hydrogen peroxide', 'aqua ammonia',
        // Agro
        'edible oils egypt', 'olive oil exporter', 'sugar exports egypt',
        'rice supplier egypt', 'cotton exporter', 'grains egypt', 'pulses egypt',
        'dates egypt', 'spices', 'oilseeds',
        // Trade & logistics
        'B2B trading conglomerate egypt', 'egyptian export trader', 'FOB 7 egyptian ports',
        'CIF/CFR egypt', 'vessel chartering egypt', 'L/C export documentation',
        'global trade egypt', 'mediterranean exporter', 'red sea exporter',
        'egypt to 60+ countries'
      ],
    icons: settings.faviconUrl ? {
      icon: [{ url: settings.faviconUrl }],
      apple: [{ url: settings.faviconUrl }],
    } : {
      icon: [{ url: '/favicon.ico' }],
      apple: [{ url: '/og-image.png' }],
    },
    manifest: '/site.webmanifest',
    // No layout-level canonical. Every route declares its own (the catch-all,
    // the homepage and the dedicated routes all do); a canonical set here is
    // inherited by any route that forgets, and six hub pages spent months
    // canonicalising to the homepage on the www host because of it.
    openGraph: {
      type: 'website',
      title: brandName,
      description,
      url: canonicalBase,
      siteName: brandName,
      locale: 'en_US',
      images: [{
        url: settings.ogImageUrl || '/og-image.png',
        width: 1200, height: 630, alt: brandName,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: brandName,
      description,
      images: [settings.ogImageUrl || '/og-image.png'],
    },
    robots: { index: true, follow: true },
  }
}

export default async function RootLayout({ children }) {
  const settings = await getSiteSettings()
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900 antialiased">
        {/* Drop 125 — accessibility skip link (visible only on keyboard focus) */}
        <a href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-[#1d5fa1] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:shadow-lg">
          Skip to main content
        </a>
        {/* Drop 122 — sitewide Organization + WebSite schema (rich SERP) */}
        <OrganizationJsonLd settings={settings} />
        {/* Drop 130 — Web Vitals telemetry beacon (LCP/INP/CLS/FCP/TTFB) */}
        <WebVitalsReporter />
        <SiteHeader settings={settings} />
        <main id="main-content" className="flex-1">{children}</main>
        <SiteFooter settings={settings} />
        <WhatsAppFab url={settings.whatsappUrl} label={`Chat with ${settings.name} on WhatsApp`} />
      </body>
    </html>
  )
}
