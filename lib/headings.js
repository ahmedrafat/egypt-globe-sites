/**
 * Page headings — separates what a human reads from what Google indexes.
 *
 * Audit UI2 (Sep 2026): 387 pages used the SEO title as the H1, so the
 * About page opened with "About Egypt Globe Group — Egyptian B2B Export
 * Trader, 60+ Countries" and the breadcrumb repeated it. The title tag
 * keeps its ranking terms; the visible heading and breadcrumb use the
 * part before the first separator, with an optional CMS override.
 *
 * Override: set `seo.heading` on the egg_corporate_pages row.
 */

const PRODUCT_CATEGORIES = new Set(['salt', 'fertilizers', 'chemicals', 'construction', 'agro', 'minerals', 'metals'])
/** Categories whose titles are editorial: the first segment is often a
 *  hook ("2026 Buyer's Guide") rather than the subject, so we only cut
 *  when the segment is long enough to stand alone. */
const EDITORIAL = new Set(['blog', 'case_studies', 'compare'])
const SEPARATOR = / — | – | \| | · /
const BRAND_SUFFIX = /\s*[|·—–-]\s*Egypt Globe(?: Group)?\s*$/i

/** Title → short heading. Returns the title unchanged when no safe cut exists. */
export function shortHeading(title, category = '') {
  if (!title) return ''
  const full = String(title).replace(BRAND_SUFFIX, '').trim()
  const first = full.split(SEPARATOR)[0].trim()
  if (first === full) return full
  const minLen = EDITORIAL.has(category) ? 30 : 12
  const words = first.split(/\s+/).filter(Boolean).length
  return first.length >= minLen && words >= 2 ? first : full
}

/** Visible H1 for a CMS page. Product pages keep the full product name. */
export function pageHeading(page) {
  if (!page) return ''
  const override = page.seo?.heading
  if (typeof override === 'string' && override.trim()) return override.trim()
  if (PRODUCT_CATEGORIES.has(page.category)) return page.title || ''
  return shortHeading(page.title, page.category)
}

/** Breadcrumb label — always the short form, product pages included. */
export function crumbLabel(page) {
  if (!page) return ''
  const override = page.seo?.heading
  if (typeof override === 'string' && override.trim()) return override.trim()
  return shortHeading(page.title, page.category)
}
