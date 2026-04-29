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
    'B2B export trading conglomerate. Salt, cement, fertilizers, chemicals, construction materials, agricultural products. 60+ countries. Quote in 24h.',
  openGraph: {
    type: 'website',
    title: 'Egypt Globe Group',
    description: 'Egyptian industrial excellence connected to 60+ countries.',
    url: 'https://egyptglobe.com',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0A0A0A] text-white">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
