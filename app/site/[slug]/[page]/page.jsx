import { getSiteBySlug, getAllSlugs } from '../../../../lib/getSiteConfig'
import Navigation from '../../../../components/Navigation'
import Footer from '../../../../components/Footer'
import ProductsPage from '../../../../components/pages/ProductsPage'
import ContactPage from '../../../../components/pages/ContactPage'
import ServicesPage from '../../../../components/pages/ServicesPage'
import GenericPage from '../../../../components/pages/GenericPage'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  const params = []
  for (const slug of slugs) {
    const site = await getSiteBySlug(slug)
    if (!site?.custom_pages?.length) continue
    for (const pg of site.custom_pages) {
      params.push({ slug, page: pg.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }) {
  const { slug, page } = await params
  const site = await getSiteBySlug(slug)
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

export default async function BrandPage({ params }) {
  const { slug, page } = await params
  const site = await getSiteBySlug(slug)
  if (!site) notFound()

  const pageConfig = site.custom_pages?.find((p) => p.slug === page)
  if (!pageConfig) notFound()

  const cssVars = {
    '--primary': site.theme.primaryColor,
    '--secondary': site.theme.secondaryColor,
    '--accent': site.theme.accentColor,
  }

  const basePath = `/site/${slug}`

  return (
    <div style={cssVars} className="min-h-screen font-sans bg-[#0A0A0A] text-white">
      <Navigation site={site} basePath={basePath} />
      <main>
        <PageContent site={site} pageConfig={pageConfig} />
      </main>
      <Footer site={site} />
    </div>
  )
}
