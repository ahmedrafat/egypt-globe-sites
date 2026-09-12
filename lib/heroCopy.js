/**
 * Hero copy — lets the CMS override what a hero banner says.
 *
 * Most pages render their headline from the row's own title/description, but
 * the landmark pages (home, /products, /services, /blog, /case-studies,
 * /products/salt, the division hubs, the salt source pages) had their hero
 * copy written into the code, so the CMS could change the background and not
 * the words on it. Each of those now reads its copy through `heroCopy()`:
 *
 *   seo.heading     → the main headline line
 *   seo.subheading  → the second (usually italic) line
 *   seo.lede        → the paragraph under the headline
 *
 * A field left blank keeps the copy the page ships with, so nothing changes
 * until an editor types something. `description` stays the meta description
 * (and the lede on templates that already use it) — it is not touched here.
 */
const val = v => (typeof v === 'string' && v.trim() ? v.trim() : null)

export function heroCopy(page) {
  const seo = page?.seo || {}
  return { heading: val(seo.heading), sub: val(seo.subheading), lede: val(seo.lede) }
}
