import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import SiteHeader from '../components/SiteHeader'
import SiteFooter from '../components/SiteFooter'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://egyptglobe.com'),
  title: {
    default: 'Egypt Globe Group — B2B Export Trading Conglomerate',
    template: '%s · Egypt Globe Group',
  },
  description:
    'Egyptian B2B export trading conglomerate. Salt, cement, fertilizers, chemicals, construction materials, agro & food, industrial minerals. FOB / CIF from 7 Egyptian ports to 60+ countries. Quote in 24h.',
  keywords: ['Egypt Globe Group', 'Egyptian exporter', 'B2B trade', 'cement Egypt', 'salt Egypt', 'fertilizers Egypt', 'industrial minerals', 'Damietta export', 'Cairo trading house'],
  openGraph: {
    type: 'website',
    title: 'Egypt Globe Group',
    description: 'Egyptian industrial excellence connected to 60+ countries.',
    url: 'https://egyptglobe.com',
    siteName: 'Egypt Globe Group',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', title: 'Egypt Globe Group', description: 'Egyptian industrial excellence connected to 60+ countries.' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900 antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
