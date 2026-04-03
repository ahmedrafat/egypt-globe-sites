import { getSiteBySlug, getAllSlugs } from '../../../lib/getSiteConfig'
import SiteRenderer from '../../../components/SiteRenderer'
import { notFound } from 'next/navigation'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const site = await getSiteBySlug(slug)
  if (!site) return {}
  return {
    title: site.seo.metaTitle,
    description: site.seo.metaDescription,
    keywords: site.seo.keywords?.join(', '),
    openGraph: {
      title: site.seo.metaTitle,
      description: site.seo.metaDescription,
      images: site.seo.ogImage ? [site.seo.ogImage] : [],
    },
  }
}

export default async function SitePage({ params }) {
  const { slug } = await params
  const site = await getSiteBySlug(slug)
  if (!site) notFound()
  return <SiteRenderer site={site} />
}
