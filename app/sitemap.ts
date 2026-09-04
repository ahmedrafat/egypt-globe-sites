/**
 * /sitemap.xml — file-based generator (Next.js 16 metadata API).
 *
 * Drop 122 (cutover-blocker): the legacy Frappe site at the apex used to
 * serve a 267-URL sitemap; the new Vercel build was returning 404. This
 * generator reads every published row of `egg_corporate_pages` (currently
 * 349) and emits a sitemap with sensible per-category priority + change
 * frequency so Google can prioritise crawl budget.
 *
 * Static routes (/login, /buyer) are deliberately excluded — they're
 * auth-gated and have no indexable content.
 */
import type { MetadataRoute } from 'next'
import { getSitemapPages, getCustomerLogos, getCaseStudies } from '../lib/corporatePages'

// Rendered per request. The ISR variant (revalidate = 3600) was measured on
// 4 Sep 2026 serving a copy generated at the previous deploy for 24 h+ — the
// revalidation never fired, so two pages published on 3–4 Sep were missing
// while the always-dynamic llms.txt routes listed them. Googlebot fetches
// this file a few times a day; one 80 KB query per fetch is the right trade.
export const dynamic = 'force-dynamic'

const BASE = 'https://egyptglobe.com'

// Priority + change-frequency tuned per category
const CATEGORY_RANK: Record<string, { priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = {
  home:         { priority: 1.0, changeFrequency: 'weekly'  },
  about:        { priority: 0.7, changeFrequency: 'monthly' },
  products:     { priority: 0.9, changeFrequency: 'weekly'  },
  salt:         { priority: 0.85, changeFrequency: 'weekly' },
  cement:       { priority: 0.85, changeFrequency: 'weekly' },
  fertilizers:  { priority: 0.85, changeFrequency: 'weekly' },
  chemicals:    { priority: 0.85, changeFrequency: 'weekly' },
  construction: { priority: 0.85, changeFrequency: 'weekly' },
  agro:         { priority: 0.85, changeFrequency: 'weekly' },
  minerals:     { priority: 0.85, changeFrequency: 'weekly' },
  metals:       { priority: 0.85, changeFrequency: 'weekly' },
  services:     { priority: 0.8, changeFrequency: 'monthly' },
  applications: { priority: 0.75, changeFrequency: 'monthly' },
  case_studies: { priority: 0.75, changeFrequency: 'monthly' },
  markets:      { priority: 0.85, changeFrequency: 'monthly' },
  blog:         { priority: 0.7, changeFrequency: 'weekly'  },
  partners:     { priority: 0.6, changeFrequency: 'monthly' },
  rfq:          { priority: 0.6, changeFrequency: 'monthly' },
  other:        { priority: 0.5, changeFrequency: 'monthly' },
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, logos, caseStudies] = await Promise.all([
    getSitemapPages(),
    getCustomerLogos().catch(() => []),
    getCaseStudies({ limit: 200 }).catch(() => []),
  ])

  const out: MetadataRoute.Sitemap = []

  // Every published egg_corporate_pages row
  for (const p of pages) {
    if (!p?.path) continue
    const rank = CATEGORY_RANK[p.category] || CATEGORY_RANK.other
    out.push({
      url: `${BASE}${p.path}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: rank.changeFrequency,
      priority: rank.priority,
    })
  }

  // Case-study posts (separate listing — they may sit outside main pages too)
  const seenUrls = new Set(out.map(o => o.url))
  for (const cs of caseStudies) {
    if (!cs?.path) continue
    const url = `${BASE}${cs.path}`
    if (seenUrls.has(url)) continue
    out.push({
      url,
      lastModified: cs.updated_at ? new Date(cs.updated_at) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.75,
    })
    seenUrls.add(url)
  }

  return out
}

