import { Geist, Geist_Mono } from 'next/font/google'
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
    // Drop 95: per-brand target-keyword surface for "bulk salt / rock salt
    // egypt / sea salt in bulk / sinai salt / siwa salt" queries. Next 16
    // Metadata.keywords accepts an array; we pass the strongest commercial
    // terms for the active brand (umbrella vs sub-brand).
    keywords:
      meta.brandCode === 'SINAI_SALT' ? ['sinai salt', 'sea salt in bulk', 'bulk sea salt egypt', 'north sinai sea salt', 'bardawil sea salt', 'el-arish salt', 'FOB damietta sea salt', 'FOB port said east salt', 'egyptian sea salt exporter']
      : meta.brandCode === 'EG_SALT' ? ['bulk salt', 'bulk rock salt', 'industrial salt egypt', 'chlor-alkali salt', 'deicing salt EN 16811-1', 'ASTM D632 rock salt', 'BS 3247 highway salt', 'GOST 13830 salt', 'water-treatment salt', 'oilfield salt', 'leather tanning salt', 'textile dyeing salt', 'siwa rock salt', 'qattara rock salt', 'bulk egyptian salt']
      : meta.brandCode === 'GLOBE_SALT' ? ['wholesale egyptian salt', 'salt exporter egypt', 'bulk salt wholesale', 'sea salt in bulk', 'bulk rock salt', 'food grade salt egypt', 'pharmaceutical salt USP BP', 'pool salt wholesale', 'sinai salt', 'siwa salt', 'qattara rock salt', 'FOB 7 egyptian ports']
      : ['bulk salt', 'rock salt egypt', 'bulk rock salt', 'sea salt in bulk', 'sinai salt', 'siwa salt', 'qattara rock salt', 'bulk egyptian salt', 'egyptian salt exporter', 'cement egypt', 'fertilizer egypt', 'industrial minerals egypt', 'construction materials egypt', 'B2B trading conglomerate egypt', 'FOB 7 egyptian ports'],
    icons: settings.faviconUrl ? {
      icon: [{ url: settings.faviconUrl }],
      apple: [{ url: settings.faviconUrl }],
    } : {
      icon: [{ url: '/favicon.ico' }],
      apple: [{ url: '/og-image.png' }],
    },
    manifest: '/site.webmanifest',
    // Drop 167 — per-brand canonical so Google indexes products on the brand
    // domain (not the umbrella) when the request comes through the brand host.
    alternates: { canonical: canonicalBase },
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
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
