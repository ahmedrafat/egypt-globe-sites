import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'
import WhatsAppFab from '../components/WhatsAppFab'
import { OrganizationJsonLd } from '../components/StructuredData'
import { getSiteSettings } from '../lib/corporatePages'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

/**
 * Build per-request metadata so the favicon + OG image come from
 * site_settings (admin can swap them without a deploy). Falls back to
 * /favicon.ico shipped in /public when no override is set.
 */
export async function generateMetadata() {
  const settings = await getSiteSettings()
  return {
    metadataBase: new URL('https://egyptglobe.com'),
    title: {
      default: `${settings.name} — B2B Export Trading Conglomerate`,
      template: `%s · ${settings.name}`,
    },
    description:
      'Egyptian B2B export trading conglomerate. Salt, cement, fertilizers, chemicals, construction materials, agro & food, industrial minerals. FOB / CIF from 7 Egyptian ports to 60+ countries. Quote in 24h.',
    keywords: ['Egypt Globe Group', 'Egyptian exporter', 'B2B trade', 'cement Egypt', 'salt Egypt', 'fertilizers Egypt', 'industrial minerals', 'Damietta export', 'Cairo trading house'],
    icons: settings.faviconUrl ? {
      icon: [{ url: settings.faviconUrl }],
      apple: [{ url: settings.faviconUrl }],
    } : undefined,
    openGraph: {
      type: 'website',
      title: settings.name,
      description: 'Egyptian industrial excellence connected to 60+ countries.',
      url: 'https://egyptglobe.com',
      siteName: settings.name,
      locale: 'en_US',
      // Drop 122 — fallback to the static /og-image.png (sharp-generated)
      // when the CMS-driven settings.ogImageUrl is not set.
      images: [{
        url: settings.ogImageUrl || '/og-image.png',
        width: 1200, height: 630, alt: settings.name,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.name,
      description: 'Egyptian industrial excellence connected to 60+ countries.',
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
        {/* Drop 122 — sitewide Organization + WebSite schema (rich SERP) */}
        <OrganizationJsonLd settings={settings} />
        <SiteHeader settings={settings} />
        <main className="flex-1">{children}</main>
        <SiteFooter settings={settings} />
        <WhatsAppFab url={settings.whatsappUrl} label={`Chat with ${settings.name} on WhatsApp`} />
      </body>
    </html>
  )
}
