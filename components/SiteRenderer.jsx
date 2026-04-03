'use client'
import Navigation from './Navigation'
import Footer from './Footer'
import HeroSection from './sections/HeroSection'
import StatsSection from './sections/StatsSection'
import NetworkSection from './sections/NetworkSection'
import FeaturesSection from './sections/FeaturesSection'
import AISection from './sections/AISection'
import ProductsPage from './pages/ProductsPage'
import ContactPage from './pages/ContactPage'

export default function SiteRenderer({ site, basePath = '' }) {
  const { theme, sections } = site

  const cssVars = {
    '--primary': theme.primaryColor,
    '--secondary': theme.secondaryColor,
    '--accent': theme.accentColor,
  }

  const bgClass = theme.darkMode
    ? 'bg-[#0A0A0A] text-white'
    : 'bg-white text-gray-900'

  return (
    <div style={cssVars} className={`min-h-screen font-sans ${bgClass}`}>
      <Navigation site={site} basePath={basePath} />
      <main>
        {sections.hero?.enabled && <HeroSection site={site} />}
        {sections.stats?.enabled && <StatsSection site={site} />}
        {sections.features?.enabled && <FeaturesSection site={site} />}
        {sections.network?.enabled && <NetworkSection site={site} />}
        {sections.aiSection?.enabled && <AISection site={site} />}
        {sections.products?.enabled && (
          <section id="products" className="border-t border-white/5">
            <ProductsPage site={site} />
          </section>
        )}
        {sections.contact?.enabled && (
          <section id="contact" className="border-t border-white/5">
            <ContactPage site={site} />
          </section>
        )}
      </main>
      <Footer site={site} />
    </div>
  )
}
