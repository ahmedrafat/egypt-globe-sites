/**
 * One breadcrumb builder for the visible trail and the BreadcrumbList
 * schema (audit UX3: the SKU trail read "Home › Salt › <title>" while the
 * schema had five levels, Contact sat under "Resources", Applications
 * read "Home › Application › Applications").
 *
 * Every crumb is derived from the URL path. Intermediate segments take
 * their label from a known hub, a product division, or the ancestor
 * page's own short heading when the caller passes `ancestors`
 * (path → title). A crumb links only when that path answers 200.
 */
import { PRODUCT_DIVISIONS } from './corporatePages'
import { crumbLabel, shortHeading } from './headings'

const ROOT = {
  products:      { name: 'Products',        href: '/products' },
  services:      { name: 'Services',        href: '/services' },
  applications:  { name: 'Applications',    href: '/applications' },
  markets:       { name: 'Market briefs',   href: '/markets' },
  ports:         { name: 'Loading ports',   href: '/services/loading-ports' },
  standards:     { name: 'Standards',       href: null },
  'trade-tools': { name: 'Trade tools',     href: null },
  blog:          { name: 'News & insights', href: '/blog' },
  'case-studies':{ name: 'Case studies',    href: '/case-studies' },
  about:         { name: 'About',           href: '/about' },
  compare:       { name: 'Compare',         href: null },
  wholesale:     { name: 'Wholesale',       href: null },
  partners:      { name: 'Partners',        href: '/partners' },
  contact:       { name: 'Contact',         href: '/contact' },
}
const DIVISION_BY_PATH = Object.fromEntries(PRODUCT_DIVISIONS.map(d => [d.path, d]))

const titleCase = s => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

/** Paths between the root hub and the page that need a title lookup. */
export function ancestorPaths(path) {
  const segs = (path || '').split('/').filter(Boolean)
  const out = []
  let acc = ''
  for (let i = 0; i < segs.length - 1; i++) {
    acc += '/' + segs[i]
    if (i === 0) continue
    if (DIVISION_BY_PATH[acc]) continue
    out.push(acc)
  }
  return out
}

/**
 * @returns {Array<{name: string, path: string, href: string|null}>}
 *  `path` is the canonical URL used in the schema; `href` is null when the
 *  crumb should render as text.
 */
export function buildBreadcrumb(page, ancestors = {}) {
  const crumbs = [{ name: 'Home', path: '/', href: '/' }]
  if (!page?.path || page.path === '/') return crumbs
  const segs = page.path.split('/').filter(Boolean)
  let acc = ''
  for (let i = 0; i < segs.length; i++) {
    acc += '/' + segs[i]
    const isLast = i === segs.length - 1
    if (isLast) { crumbs.push({ name: DIVISION_BY_PATH[acc]?.label || crumbLabel(page), path: acc, href: null }); continue }
    if (i === 0) {
      const root = ROOT[segs[0]]
      crumbs.push({ name: root?.name || titleCase(segs[0]), path: acc, href: root ? root.href : null })
      continue
    }
    const division = DIVISION_BY_PATH[acc]
    if (division) { crumbs.push({ name: division.label, path: acc, href: acc }); continue }
    const title = ancestors[acc]
    crumbs.push({ name: title ? shortHeading(title) : titleCase(segs[i]), path: acc, href: title ? acc : null })
  }
  return crumbs
}
