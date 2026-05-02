/**
 * /llms-full.txt — full-content dump for AI crawlers (llmstxt.org spec).
 *
 * Drop 125. Pairs with /llms.txt — the latter is the discovery file with
 * link lists, this is the actual content concatenated so AI search engines
 * (Perplexity, Anthropic, OpenAI) can index the full site in a single fetch
 * without rendering JavaScript.
 *
 * Cached for 1 hour via Next.js ISR (matches sitemap freshness).
 */
import { getAllPages } from '../../lib/corporatePages'

const BASE = 'https://egyptglobe.com'

export async function GET() {
  const pages = await getAllPages()

  let body = `# Egypt Globe Group — full content dump

> Egyptian B2B export trading conglomerate. Salt, cement, fertilizers, chemicals, construction materials, agro & food, industrial minerals, metals. FOB / CIF from 7 Egyptian ports to 60+ destination markets. Quote in 24h.

This file concatenates every published page on egyptglobe.com so AI crawlers and search engines can index the full site in a single fetch. Discovery file: ${BASE}/llms.txt — Sitemap: ${BASE}/sitemap.xml

---

`

  for (const p of pages) {
    if (!p?.path) continue
    body += `\n# ${p.title}\n\n`
    body += `URL: ${BASE}${p.path}\n`
    if (p.category)    body += `Category: ${p.category}\n`
    if (p.description) body += `Description: ${p.description}\n`
    if (p.hs_code)     body += `HS code: ${p.hs_code}\n`
    if (p.moq_mt)      body += `MOQ: ${p.moq_mt} MT\n`
    body += '\n'
    if (p.body_markdown) {
      body += p.body_markdown + '\n'
    }
    body += '\n---\n'
  }

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

// Drop 139c — render on demand. Build-time generation chokes when
// Supabase is slow (full-corpus dump runs through getAllPages).
// Cache-Control header above keeps the runtime cost low (CDN cached 1h).
export const dynamic = 'force-dynamic'
