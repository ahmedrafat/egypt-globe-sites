/**
 * routeOpenGraph — Open Graph block for the dedicated (non-CMS) routes.
 *
 * Next.js metadata merges `openGraph` shallowly: a route that sets only
 * `openGraph.url` loses the layout's images and siteName. The layout's
 * block therefore stayed untouched on the dedicated routes, and og:url on
 * /products, /services, /blog, /case-studies, /rfq, /coa and /search
 * pointed at the homepage (audit SEO4, Sep 2026). This helper returns a
 * complete block so a route can declare its own og:url in one line.
 */
const BASE = 'https://egyptglobe.com'

export function routeOpenGraph({ path, title, description, type = 'website' }) {
  return {
    type,
    title,
    description,
    url: `${BASE}${path}`,
    siteName: 'Egypt Globe Group',
    locale: 'en_US',
    images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630, alt: title }],
  }
}
