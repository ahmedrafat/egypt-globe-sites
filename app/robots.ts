/**
 * /robots.txt — file-based generator (Next.js 16 metadata API).
 *
 * Drop 122 (cutover-blocker): the Vercel-served new build was returning
 * 404 on /robots.txt while the legacy Frappe site still owned the apex.
 * Once `egyptglobe.com` cuts over to Vercel, we need this in place from
 * minute zero so Google can immediately crawl + sitemap-discover.
 *
 * Allows everything for everyone, blocks the buyer-gated routes from being
 * indexed (they require auth and would just be 401/redirect for crawlers).
 */
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/buyer',          // authenticated-only buyer dashboard
          '/login',          // sign-in form, not an indexable surface
          '/auth/',          // Supabase callbacks
          '/api/',            // server-only routes
          '/__qa-',           // QA pages (defensive — never indexed)
        ],
      },
    ],
    sitemap: 'https://egyptglobe.com/sitemap.xml',
    host: 'https://egyptglobe.com',
  }
}
