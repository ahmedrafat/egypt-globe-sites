/**
 * Data layer for the Egypt Globe Group corporate site.
 *
 * Reads from `egg_corporate_pages` (Supabase) — anon RLS allows SELECT
 * on rows where is_published=true. Photos are stored in the public
 * `corporate-photos` bucket; rows just hold the URL.
 *
 * Drop 96 extends with rich product detail (commodity link, specs,
 * certifications, packing, applications, regions, HS code, MOQ,
 * lead-time) plus a `site_settings` singleton for branding +
 * contact, and a curated supply-chain services section.
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  || 'https://placeholder.supabase.co'
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

/** Visual metadata per category — used by every nav surface. */
export const CATEGORY_META = {
  home:         { label: 'Home',         icon: '🏠', color: '#1d5fa1', tone: 'bg-blue-50  text-blue-700  border-blue-100'   },
  about:        { label: 'About',        icon: '🏢', color: '#6366f1', tone: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  products:     { label: 'Products',     icon: '📦', color: '#1d5fa1', tone: 'bg-blue-50  text-blue-700  border-blue-100'   },
  salt:         { label: 'Salt',         icon: '🧂', color: '#0ea5e9', tone: 'bg-sky-50    text-sky-700    border-sky-100'    },
  fertilizers:  { label: 'Fertilizers',  icon: '🌾', color: '#16a34a', tone: 'bg-green-50  text-green-700  border-green-100'  },
  chemicals:    { label: 'Chemicals',    icon: '⚗️', color: '#db2777', tone: 'bg-pink-50   text-pink-700   border-pink-100'   },
  construction: { label: 'Construction', icon: '🏗', color: '#d97706', tone: 'bg-amber-50  text-amber-700  border-amber-100'  },
  agro:         { label: 'Agro & Food',  icon: '🍅', color: '#059669', tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  minerals:     { label: 'Minerals',     icon: '⛰',  color: '#64748b', tone: 'bg-slate-50  text-slate-700  border-slate-200'    },
  services:     { label: 'Services',     icon: '🚢', color: '#0d9488', tone: 'bg-teal-50   text-teal-700   border-teal-100'   },
  partners:     { label: 'Partners',     icon: '🤝', color: '#2563eb', tone: 'bg-blue-50   text-blue-700   border-blue-100'   },
  blog:         { label: 'News & Blog',  icon: '📝', color: '#e11d48', tone: 'bg-rose-50   text-rose-700   border-rose-100'   },
  rfq:          { label: 'RFQ',          icon: '📋', color: '#ea580c', tone: 'bg-orange-50 text-orange-700 border-orange-100' },
  other:        { label: 'More',         icon: '🔗', color: '#475569', tone: 'bg-slate-50  text-slate-700  border-slate-200'  },
}

/** Canonical product divisions — drives home tile grid + products hub. */
export const PRODUCT_DIVISIONS = [
  { id: 'salt',         path: '/products/salt',         label: 'Salt',         icon: '🧂', color: '#0ea5e9', blurb: 'Sea & rock salt — food, pharma, de-icing, chemical, water treatment.' },
  { id: 'fertilizers',  path: '/products/fertilizers',  label: 'Fertilizers',  icon: '🌾', color: '#16a34a', blurb: 'Urea 46% N, MOP/KCl 60, TSP, MKP — bag or bulk vessel.' },
  { id: 'chemicals',    path: '/products/chemicals',    label: 'Chemicals',    icon: '⚗️', color: '#db2777', blurb: 'Acids, alkalis, salts and water-treatment chemicals.' },
  { id: 'construction', path: '/products/construction', label: 'Construction', icon: '🏗', color: '#d97706', blurb: 'Cement (CEM I / II / SRC), clinker, gypsum, limestone, aggregates.' },
  { id: 'agro',         path: '/products/agro',         label: 'Agro & Food',  icon: '🍅', color: '#059669', blurb: 'Edible oils, grains, citrus, dates, herbs and spices.' },
  { id: 'minerals',     path: '/products/minerals',     label: 'Minerals',     icon: '⛰',  color: '#64748b', blurb: 'Gypsum, limestone, kaolin, feldspar, silica sand, talc.' },
]

/**
 * Curated supply-chain services Egypt Globe operates — these are the
 * actual export-trade services the group runs, not generic consultancy.
 * Mirrors the rows seeded into egg_corporate_pages (category=services).
 */
export const SERVICE_DIVISIONS = [
  { id: 'logistics',     path: '/services/logistics',      label: 'Logistics & Freight', icon: '🚢', color: '#0ea5e9', blurb: 'Sea, road, multimodal — ex 7 Egyptian ports, full track-and-trace.' },
  { id: 'port-services', path: '/services/port-services',  label: 'Port Services',       icon: '⚓', color: '#1d5fa1', blurb: 'Stevedoring, vessel agency, berth booking, customs liaison.' },
  { id: 'added-value',   path: '/services/added-value',    label: 'Added Value',         icon: '🔬', color: '#a855f7', blurb: 'Blending, screening, sieving — match any tender spec.' },
  { id: 'packing',       path: '/services/packing',        label: 'Packing',             icon: '📦', color: '#FF6321', blurb: '50 kg PP / 1 MT FIBC / palletised / bulk — buyer-spec marking.' },
  { id: 'inspection',    path: '/services/inspection',     label: 'Inspection & QC',     icon: '🧪', color: '#16a34a', blurb: 'SGS / Intertek / BV pre-shipment inspection at any port.' },
  { id: 'documentation', path: '/services/documentation',  label: 'Trade Documentation', icon: '📋', color: '#0d9488', blurb: 'Full L/C-bank set + EUR1, COO, Phytosanitary, B/L originals.' },
]

/** Corporate (non-product) sections shown in nav + footer. */
export const CORPORATE_SECTIONS = [
  { id: 'about',    path: '/about',           label: 'About' },
  { id: 'global',   path: '/global-presence', label: 'Global Presence' },
  { id: 'partners', path: '/partners',        label: 'Partners' },
  { id: 'blog',     path: '/blog',            label: 'News & Blog' },
  { id: 'contact',  path: '/contact',         label: 'Contact' },
]

/** Static fallback — overridden by site_settings if a row exists. */
export const COMPANY_INFO_DEFAULT = {
  name: 'Egypt Globe Group',
  tagline: 'Egyptian B2B export trading conglomerate',
  headOffice: '30 Sibawayh Al-Masry Street, off Tayaran, Nasr City, Cairo, Egypt',
  operationsOffice: 'Office No. 2, Building No. 82, Central District, New Damietta',
  phone: '+20 100 772 9844',
  phoneE164: '+201007729844',
  telFax: '057 2402008',
  email: 'export@egyptglobe.com',
  commercialRegistry: '73418',
  taxCard: '655-527-427',
  exportLicense: '600010794',
  linkedin: 'https://eg.linkedin.com/company/egypt-globe-group',
  twitter: null, facebook: null, instagram: null,
  logoUrl: null, logoDarkUrl: null, faviconUrl: null, ogImageUrl: null,
  primaryColor: '#1d5fa1', accentColor: '#FF6321',
}

/** Back-compat: old code that reads COMPANY_INFO directly still works. */
export const COMPANY_INFO = COMPANY_INFO_DEFAULT

/** Pull live site_settings + merge over the default. Cached per request. */
export async function getSiteSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error || !data) return COMPANY_INFO_DEFAULT
  return {
    name:               data.brand_name           ?? COMPANY_INFO_DEFAULT.name,
    tagline:            data.tagline              ?? COMPANY_INFO_DEFAULT.tagline,
    headOffice:         data.head_office          ?? COMPANY_INFO_DEFAULT.headOffice,
    operationsOffice:   data.operations_office    ?? COMPANY_INFO_DEFAULT.operationsOffice,
    phone:              data.phone                ?? COMPANY_INFO_DEFAULT.phone,
    phoneE164:          data.phone_e164           ?? COMPANY_INFO_DEFAULT.phoneE164,
    telFax:             data.tel_fax              ?? COMPANY_INFO_DEFAULT.telFax,
    email:              data.email                ?? COMPANY_INFO_DEFAULT.email,
    commercialRegistry: data.commercial_registry  ?? COMPANY_INFO_DEFAULT.commercialRegistry,
    taxCard:            data.tax_card             ?? COMPANY_INFO_DEFAULT.taxCard,
    exportLicense:      data.export_license       ?? COMPANY_INFO_DEFAULT.exportLicense,
    linkedin:           data.linkedin_url         ?? COMPANY_INFO_DEFAULT.linkedin,
    twitter:            data.twitter_url          ?? null,
    facebook:           data.facebook_url         ?? null,
    instagram:          data.instagram_url        ?? null,
    logoUrl:            data.logo_url             ?? null,
    logoDarkUrl:        data.logo_dark_url        ?? null,
    faviconUrl:         data.favicon_url          ?? null,
    ogImageUrl:         data.og_image_url         ?? null,
    primaryColor:       data.primary_color        ?? COMPANY_INFO_DEFAULT.primaryColor,
    accentColor:        data.accent_color         ?? COMPANY_INFO_DEFAULT.accentColor,
  }
}

/** Fetch a single page (ALL columns including the new rich product fields). */
export async function getPageByPath(path) {
  const norm = path === '/' ? '/' : ('/' + path.replace(/^\/+|\/+$/g, ''))
  const { data, error } = await supabase
    .from('egg_corporate_pages')
    .select('*')
    .eq('path', norm)
    .eq('is_published', true)
    .maybeSingle()
  if (error) return null
  return data
}

/** All published pages — used for the navigation tree + category grids. */
export async function getAllPages() {
  const { data, error } = await supabase
    .from('egg_corporate_pages')
    .select('id, path, title, category, description, hero_photo_url, sort_order, last_crawled, hs_code, moq_mt, price_indication')
    .eq('is_published', true)
    .order('category')
    .order('sort_order')
    .order('title')
  if (error) return []
  return data || []
}

/** Pages grouped by category — for nav menus + category landing grids. */
export async function getPagesByCategory() {
  const all = await getAllPages()
  const grouped = {}
  for (const p of all) {
    const k = p.category || 'other'
    if (!grouped[k]) grouped[k] = []
    grouped[k].push(p)
  }
  return grouped
}

/**
 * Just the path strings — used for generateStaticParams in the catch-all
 * route. Excludes paths that have their own dedicated app/ route
 * (currently `/`, `/rfq`).
 */
const RESERVED_PATHS = new Set(['/', '/rfq'])
export async function getAllPaths() {
  const { data, error } = await supabase
    .from('egg_corporate_pages')
    .select('path')
    .eq('is_published', true)
  if (error) return []
  return (data || []).map(r => r.path).filter(p => p && !RESERVED_PATHS.has(p))
}

/** Pages in the same category as `current`, excluding `current`. */
export async function getRelatedPages(current, limit = 6) {
  if (!current?.category) return []
  const { data, error } = await supabase
    .from('egg_corporate_pages')
    .select('id, path, title, hero_photo_url, description')
    .eq('is_published', true)
    .eq('category', current.category)
    .neq('id', current.id)
    .limit(limit)
  if (error) return []
  return data || []
}

/** Pages whose path is exactly one segment deeper than `parentPath`. */
export async function getDirectChildren(parentPath) {
  if (!parentPath || parentPath === '/') return []
  const norm = '/' + parentPath.replace(/^\/+|\/+$/g, '')
  const expectedDepth = norm.split('/').filter(Boolean).length + 1
  const { data, error } = await supabase
    .from('egg_corporate_pages')
    .select('id, path, title, hero_photo_url, description, category, hs_code, price_indication')
    .eq('is_published', true)
    .like('path', norm + '/%')
  if (error) return []
  return (data || []).filter(p => p.path.split('/').filter(Boolean).length === expectedDepth)
}

/** Pages belonging to a product / service division by category id. */
export async function getPagesInCategory(categoryId, { excludePath = null, limit = 60 } = {}) {
  if (!categoryId) return []
  let q = supabase
    .from('egg_corporate_pages')
    .select('id, path, title, hero_photo_url, description, category, hs_code, price_indication, packing_options')
    .eq('is_published', true)
    .eq('category', categoryId)
    .order('sort_order')
    .order('title')
    .limit(limit)
  if (excludePath) q = q.neq('path', excludePath)
  const { data, error } = await q
  if (error) return []
  return data || []
}

/** Fetch the linked commodity row when a page has commodity_id set. */
export async function getCommodityById(id) {
  if (!id) return null
  const { data } = await supabase
    .from('commodities')
    .select('id, code, sku, name, category, hs_code, unit, current_price, currency, origin, grade, specifications, active')
    .eq('id', id)
    .maybeSingle()
  return data
}

/**
 * Lightweight catalogue list for the RFQ form's product dropdown.
 * Returns every product page (not services/about/blog), with display
 * label, hs_code and division id for filtering.
 */
export async function getRfqProductOptions() {
  const PRODUCT_CATS = ['salt','fertilizers','chemicals','construction','agro','minerals','products']
  const { data, error } = await supabase
    .from('egg_corporate_pages')
    .select('id, path, title, category, hs_code, packing_options, moq_mt')
    .eq('is_published', true)
    .in('category', PRODUCT_CATS)
    .order('category')
    .order('title')
  if (error) return []
  // Drop the bare /products hub from the dropdown — keep only specific SKU pages
  return (data || []).filter(p => p.path !== '/products' && !PRODUCT_DIVISIONS.some(d => d.path === p.path))
}
