import { getSiteBySlug, getAllSlugs } from '../../lib/getSiteConfig'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import ProductsPage from '../../components/pages/ProductsPage'
import ContactPage from '../../components/pages/ContactPage'
import ServicesPage from '../../components/pages/ServicesPage'
import GenericPage from '../../components/pages/GenericPage'
import { notFound } from 'next/navigation'

// This route only exists for single-brand deployments (NEXT_PUBLIC_SITE_SLUG is set).
// e.g. brand-eg-salt.vercel.app/products → renders EG Salt products page
const SITE_SLUG = process.env.NEXT_PUBLIC_SITE_SLUG || null

export const revalidate = 60

export async function generateStaticParams() {
  if (!SITE_SLUG) return []
  const site = await getSiteBySlug(SITE_SLUG)
  if (!site?.custom_pages?.length) return []
  return site.custom_pages.map((pg) => ({ page: pg.slug }))
}

export async function generateMetadata({ params }) {
  if (!SITE_SLUG) return {}
  const { page } = await params
  const site = await getSiteBySlug(SITE_SLUG)
  if (!site) return {}
  const pageConfig = site.custom_pages?.find((p) => p.slug === page)
  return {
    title: `${pageConfig?.title || page} — ${site.brandName}`,
    description: site.seo?.metaDescription,
  }
}

function PageContent({ site, pageConfig }) {
  switch (pageConfig.layout) {
    case 'products':
    case 'minerals':
    case 'crops':
    case 'chemicals':
    case 'cargo':
      return <ProductsPage site={site} />
    case 'contact':
      return <ContactPage site={site} />
    case 'services':
    case 'case-studies':
      return <ServicesPage site={site} />
    default:
      return <GenericPage site={site} pageConfig={pageConfig} />
  }
}

export default async function SingleBrandPage({ params }) {
  if (!SITE_SLUG) notFound()

  const { page } = await params
  const site = await getSiteBySlug(SITE_SLUG)
  if (!site) notFound()

  const pageConfig = site.custom_pages?.find((p) => p.slug === page)
  if (!pageConfig) notFound()

  const cssVars = {
    '--primary': site.theme.primaryColor,
    '--secondary': site.theme.secondaryColor,
    '--accent': site.theme.accentColor,
  }

  return (
    <div style={cssVars} className="min-h-screen font-sans bg-[#0A0A0A] text-white">
      <Navigation site={site} basePath="" />
      <main>
        <PageContent site={site} pageConfig={pageConfig} />
      </main>
      <Footer site={site} />
    </div>
  )
}
