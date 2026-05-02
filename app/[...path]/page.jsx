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

// Drop 139c — render on demand. Layout uses cookies() (via
// getBuyerVisibility) which forces dynamic context anyway; declaring
// it explicitly avoids the DYNAMIC_SERVER_USAGE error that fired when
// the build worker tried to pre-render with cookies present in the
// layout chain. Per-request runtime cost is bounded by the withTimeout
// wrappers in lib/corporatePages.js.
export const dynamic = 'force-dynamic'

/** No-op — generateStaticParams not used in dynamic mode. Kept for
 *  reference / quick revert when Supabase performance is stable. */
export async function generateStaticParams() {
  return []
}

/** Per-page <head> via Next 16 metadata API. */
export async function generateMetadata({ params }) {
  const { path } = await params
  const fullPath = '/' + (Array.isArray(path) ? path.join('/') : path)
  const page = await getPageByPath(fullPath)
  if (!page) return { title: 'Not found' }

  // Drop 125 — pick the per-page OG card from /ogs/<slug>.png if generated.
  // Slug derivation matches scripts/generate-page-ogs.mjs::pathToSlug exactly.
  const slug = (page.path || '/').replace(/^\//, '').replace(/\//g, '-')
    .replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'home'
  const ogImage = `/ogs/${slug}.png`

  return {
    title: page.title,
    description: page.description || undefined,
    alternates: { canonical: `https://egyptglobe.com${page.path}` },
    openGraph: {
      type: page.path?.startsWith('/blog/') ? 'article' : 'website',
      title: page.title,
      description: page.description || undefined,
      url: `https://egyptglobe.com${page.path}`,
      images: [
        // Per-page OG card from Drop 125 generator
        { url: ogImage, width: 1200, height: 630, alt: page.title },
        // CMS hero photo as secondary image (richer for product pages)
        ...(page.hero_photo_url ? [{
          url: page.hero_photo_url.startsWith('/')
            ? `https://egyptglobe.com${page.hero_photo_url}`
            : page.hero_photo_url,
          alt: page.title,
        }] : []),
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description || undefined,
      images: [ogImage],
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
