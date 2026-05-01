/**
 * /llms.txt — AI-crawler discovery file (emerging standard, llmstxt.org).
 *
 * Drop 125. Used by Perplexity, Anthropic Claude, OpenAI ChatGPT, You.com,
 * and other AI search engines to find authoritative summaries + canonical
 * URLs without scraping the entire site. Pairs with /llms-full.txt which
 * contains the full content concatenated.
 *
 * Best-practice format per llmstxt.org spec — Markdown with H1 site name,
 * blockquote summary, then optional H2 sections with link lists.
 */
import { getAllPages, getCustomerLogos } from '../../lib/corporatePages'

const BASE = 'https://egyptglobe.com'

export async function GET() {
  const pages = await getAllPages()
  const logos = await getCustomerLogos().catch(() => [])

  const byCategory: Record<string, typeof pages> = {}
  for (const p of pages) {
    const k = p.category || 'other'
    if (!byCategory[k]) byCategory[k] = []
    byCategory[k].push(p)
  }

  const sectionTitles: Record<string, string> = {
    home:         'Homepage',
    about:        'About the company',
    products:     'Products hub',
    salt:         'Salt — sea + rock + de-icing + pharma + food + cosmetic + pool grades',
    fertilizers:  'Fertilizers — urea, DAP, MAP, TSP, NPK, phosphate rock',
    chemicals:    'Industrial chemicals — caustic soda, sulphuric acid, methanol, polymers',
    construction: 'Construction materials — cement, clinker, gypsum, granite, marble, aggregates',
    agro:         'Agro & food — fresh produce, grains, sugar, oils, cotton, seafood',
    minerals:     'Industrial minerals — barite, bentonite, kaolin, silica sand, talc, iron ore',
    metals:       'Metals & alloys — steel, aluminium, copper, ferro-alloys, scrap',
    services:     'Supply-chain services — logistics, port operations, packing, documentation',
    applications: 'Applications by industry — food / chem / pharma / oil & gas / de-icing',
    case_studies: 'Real customer references and shipment case studies',
    blog:         'Industry insights and editorial',
    partners:     'Partner organisations',
    rfq:          'Request for quote',
    other:        'Other resources',
  }

  let body = `# Egypt Globe Group

> Egyptian B2B export trading conglomerate. Salt, cement, fertilizers, chemicals, construction materials, agro & food, industrial minerals, metals. FOB / CIF from 7 Egyptian ports (Damietta, Alexandria, El Dekheila, Port Said, Port Said East, Ain Sokhna, Adabiya) to 60+ destination markets. Quote in 24h.

We supply commodities to manufacturers, water utilities, oil & gas operators, fertilizer importers, traders, and downstream blenders globally. Every shipment ships with a Certificate of Analysis, Mill Test Certificate where applicable, and full Letter-of-Credit documentation. Independent third-party inspection (SGS / Intertek / Bureau Veritas) is available on request.

`

  // Most-important pillar pages
  body += `## Most important pages\n\n`
  body += `- [Homepage](${BASE}/): company overview\n`
  body += `- [Products hub](${BASE}/products): all 7 divisions\n`
  body += `- [Services hub](${BASE}/services): logistics, packing, documentation, inspection\n`
  body += `- [Loading ports](${BASE}/services/loading-ports): all 7 Egyptian ports + per-port details\n`
  body += `- [HS-code glossary](${BASE}/trade-tools/hs-codes): canonical HS codes for Egyptian exports\n`
  body += `- [Request a quote](${BASE}/rfq): 24-hour response RFQ form\n`
  body += `- [About / company](${BASE}/about): history, mission, locations, quality, careers\n`
  body += `- [Case studies](${BASE}/case-studies): real shipments + delivered numbers\n\n`

  // Category sections
  for (const cat of ['salt', 'cement', 'construction', 'fertilizers', 'chemicals', 'agro', 'minerals', 'metals', 'services', 'applications', 'about', 'case_studies', 'blog']) {
    const list = byCategory[cat]
    if (!list || list.length === 0) continue
    const title = sectionTitles[cat] || cat
    body += `## ${title}\n\n`
    for (const p of list.slice(0, 60)) {
      const desc = (p.description || '').replace(/\n/g, ' ').slice(0, 140)
      body += `- [${p.title}](${BASE}${p.path})${desc ? ': ' + desc : ''}\n`
    }
    body += '\n'
  }

  if (logos.length > 0) {
    body += `## Customer references\n\n`
    body += `Repeat buyers across ${logos.length} companies in the cement, salt, fertilizer, chemicals, and construction sectors. References available under NDA.\n\n`
  }

  body += `## Optional\n\n`
  body += `- [Full site sitemap](${BASE}/sitemap.xml): every published URL\n`
  body += `- [Robots policy](${BASE}/robots.txt)\n`
  body += `- [Long-form content dump](${BASE}/llms-full.txt): every page body concatenated for AI indexing\n`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

export const revalidate = 3600
