/**
 * /products/salt/rock-salt — Egyptian rock salt source page (Sep 2026).
 * Wins over the catch-all route. Copy + FAQs + banner from the CMS row;
 * reference data from lib/salt.js; SKUs from the salt catalogue.
 */
import { notFound } from 'next/navigation'
import { routeOpenGraph } from '../../../../lib/seo'
import { getPageByPath, getSaltCatalogueBySource } from '../../../../lib/corporatePages'
import SaltSourcePage from '../../../../components/salt/SaltSourcePage'
import { SOURCES } from '../../../../lib/salt'

export const dynamic = 'force-dynamic'
const SRC = SOURCES.rock

export async function generateMetadata() {
  const page = await getPageByPath(SRC.path)
  if (!page) return {}
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: SRC.path },
    openGraph: routeOpenGraph({ path: SRC.path, title: page.title, description: page.description }),
  }
}

export default async function Page() {
  const [page, catalogue] = await Promise.all([getPageByPath(SRC.path), getSaltCatalogueBySource()])
  if (!page) notFound()
  return <SaltSourcePage source="rock" page={page} items={catalogue.rock} />
}
