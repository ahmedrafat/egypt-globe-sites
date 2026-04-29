/**
 * Catch-all route for every non-home page in `egg_corporate_pages`.
 *
 * Handles single-segment paths (`/about`, `/contact`) AND nested ones
 * (`/products/salt/sodium-chloride`). Next.js 16 changed `params` to
 * a Promise — we MUST `await` it before destructuring.
 */
import { notFound } from 'next/navigation'
import { getPageByPath, getAllPaths } from '../../lib/corporatePages'
import PageRenderer from '../../components/PageRenderer'

export const revalidate = 60

/** Pre-render every published path at build time. */
export async function generateStaticParams() {
  const paths = await getAllPaths()
  return paths.map(p => ({
    // `path` is a catch-all segment → array of strings
    path: p.replace(/^\//, '').split('/').filter(Boolean),
  }))
}

/** Per-page <head> via Next 16 metadata API. */
export async function generateMetadata({ params }) {
  const { path } = await params
  const fullPath = '/' + (Array.isArray(path) ? path.join('/') : path)
  const page = await getPageByPath(fullPath)
  if (!page) return { title: 'Not found' }
  return {
    title: page.title,
    description: page.description || undefined,
    openGraph: {
      title: page.title,
      description: page.description || undefined,
      images: page.hero_photo_url ? [page.hero_photo_url] : undefined,
    },
  }
}

export default async function CorporatePage({ params }) {
  const { path } = await params
  const fullPath = '/' + (Array.isArray(path) ? path.join('/') : path)
  const page = await getPageByPath(fullPath)
  if (!page) notFound()
  return <PageRenderer page={page} />
}
