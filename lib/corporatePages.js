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
  metals:       { label: 'Metals & Alloys', icon: '⚙️', color: '#71717a', tone: 'bg-zinc-50   text-zinc-700   border-zinc-200'    },
  services:     { label: 'Services',     icon: '🚢', color: '#0d9488', tone: 'bg-teal-50   text-teal-700   border-teal-100'   },
  applications: { label: 'Application',  icon: '🏭', color: '#7c3aed', tone: 'bg-violet-50 text-violet-700 border-violet-100' },
  case_studies:{ label: 'Case Study',    icon: '📖', color: '#0d9488', tone: 'bg-teal-50    text-teal-700    border-teal-100'   },
  partners:     { label: 'Partners',     icon: '🤝', color: '#2563eb', tone: 'bg-blue-50   text-blue-700   border-blue-100'   },
  blog:         { label: 'News & Blog',  icon: '📝', color: '#e11d48', tone: 'bg-rose-50   text-rose-700   border-rose-100'   },
  rfq:          { label: 'RFQ',          icon: '📋', color: '#ea580c', tone: 'bg-orange-50 text-orange-700 border-orange-100' },
  other:        { label: 'More',         icon: '🔗', color: '#475569', tone: 'bg-slate-50  text-slate-700  border-slate-200'  },
}

/** Canonical product divisions — drives home tile grid + products hub.
 *  All 7 divisions are sourced 100% from the commodities master table. */
export const PRODUCT_DIVISIONS = [
  { id: 'salt',         path: '/products/salt',         label: 'Salt',                  icon: '🧂', color: '#0ea5e9', blurb: 'Sea & rock salt — 27 SKUs from food and pharma to de-icing and chlor-alkali.' },
  { id: 'fertilizers',  path: '/products/fertilizers',  label: 'Fertilizers',           icon: '🌾', color: '#16a34a', blurb: 'Urea, MOP, TSP, DAP, MAP, NPK, SOP — nitrogen, phosphate and potassium grades.' },
  { id: 'chemicals',    path: '/products/chemicals',    label: 'Chemicals',             icon: '⚗️', color: '#db2777', blurb: 'Industrial chemicals, polymers, plastics, solvents, fuels and petroleum products.' },
  { id: 'construction', path: '/products/construction', label: 'Construction',          icon: '🏗', color: '#d97706', blurb: 'Cement, clinker, aggregates, granite, marble, gypsum, limestone, glass, ceramics.' },
  { id: 'agro',         path: '/products/agro',         label: 'Agro & Food',           icon: '🍅', color: '#059669', blurb: 'Grains, edible oils, cotton, sugar, spices, fresh produce, seafood and animal feed.' },
  { id: 'minerals',     path: '/products/minerals',     label: 'Industrial Minerals',   icon: '⛰',  color: '#64748b', blurb: 'Silica sand, kaolin, barite, feldspar, talc, bentonite, iron ore, coal — raw materials.' },
  { id: 'metals',       path: '/products/metals',       label: 'Metals & Alloys',       icon: '⚙️', color: '#71717a', blurb: 'Steel, aluminum, copper, zinc, lead, ferro-alloys and scrap metal.' },
]

/**
 * Salt-application industries — drives the /applications hub + per-app
 * landing pages. Each id matches what `salt_app_ids()` (Postgres
 * function) tags onto egg_corporate_pages.applications text[].
 */
export const APPLICATIONS = [
  { id: 'food_processing',   path: '/applications/food_processing',   label: 'Food Processing',           icon: '🍴' },
  { id: 'table_salt',        path: '/applications/table_salt',        label: 'Table & Retail Salt',       icon: '🍽' },
  { id: 'food_preservation', path: '/applications/food_preservation', label: 'Food Preservation',         icon: '🥩' },
  { id: 'water_treatment',   path: '/applications/water_treatment',   label: 'Water Treatment',           icon: '💧' },
  { id: 'chemical',          path: '/applications/chemical',          label: 'Chlor-Alkali & Chemical',   icon: '⚗️' },
  { id: 'oil_gas',           path: '/applications/oil_gas',           label: 'Oil & Gas Drilling',        icon: '🛢' },
  { id: 'deicing',           path: '/applications/deicing',           label: 'De-icing & Road Salt',      icon: '❄️' },
  { id: 'pharmaceutical',    path: '/applications/pharmaceutical',    label: 'Pharmaceutical / Saline',   icon: '💊' },
  { id: 'cosmetic',          path: '/applications/cosmetic',          label: 'Cosmetic & Spa',            icon: '✨' },
  { id: 'pool',              path: '/applications/pool',              label: 'Swimming Pool',             icon: '🏊' },
  { id: 'aquaculture',       path: '/applications/aquaculture',       label: 'Aquaculture',               icon: '🐟' },
  { id: 'agricultural',      path: '/applications/agricultural',      label: 'Agricultural & Livestock',  icon: '🌾' },
]

/**
 * Curated supply-chain services Egypt Globe operates — these are the
 * actual export-trade services the group runs, not generic consultancy.
 * Mirrors the rows seeded into egg_corporate_pages (category=services).
 */
export const SERVICE_DIVISIONS = [
  { id: 'logistics',     path: '/services/logistics',      label: 'Logistics & Freight', icon: '🚢', color: '#0ea5e9', blurb: 'Sea, road, multimodal — ex 7 Egyptian ports, full track-and-trace.' },
  { id: 'port-services', path: '/services/port-services',  label: 'Port Services',       icon: '⚓', color: '#1d5fa1', blurb: 'Stevedoring, vessel agency, berth booking, customs liaison.' },
  { id: 'added-value',   path: '/services/added-value',    label: 'Added-Value Processing', icon: '🔬', color: '#a855f7', blurb: 'Blending, screening, washing, kiln-drying — match any tender spec.' },
  { id: 'packing',       path: '/services/packing',        label: 'Packing',             icon: '📦', color: '#FF6321', blurb: '50 kg PP / 1 MT FIBC / palletised / bulk — buyer-spec marking.' },
  { id: 'distribution',  path: '/services/distribution',   label: 'Distribution & Warehousing', icon: '🏭', color: '#22c55e', blurb: 'Bonded warehousing, cross-docking, final-mile delivery worldwide.' },
  { id: 'inspection',    path: '/services/inspection',     label: 'Inspection & QC',     icon: '🧪', color: '#16a34a', blurb: 'SGS / Intertek / BV pre-shipment inspection at any port.' },
  { id: 'documentation', path: '/services/documentation',  label: 'Trade Documentation', icon: '📋', color: '#0d9488', blurb: 'Full L/C-bank set + EUR1, COO, Phytosanitary, B/L originals.' },
]

/** Public URL of the freight-provider rate-submission portal. */
export const LOGISTICS_PORTAL_URL = 'https://logistics-portal-brown.vercel.app'

/** Customer logos for the home strip + footer. */
export async function getCustomerLogos() {
  const { data, error } = await supabase
    .from('egg_customer_logos')
    .select('id, sort_order, label, hint, logo_url, link_url, country, sector')
    .eq('is_published', true)
    .order('sort_order')
    .limit(20)
  if (error) return []
  return data || []
}

/** All published case studies ordered by sort_order then most recent. */
export async function getCaseStudies({ limit = 20, exclude = null } = {}) {
  let q = supabase
    .from('egg_corporate_pages')
    .select('id, path, title, description, hero_photo_url, sort_order, updated_at')
    .eq('is_published', true)
    .eq('category', 'case_studies')
    .neq('path', '/case-studies')
    .order('sort_order')
    .order('updated_at', { ascending: false })
    .limit(limit)
  if (exclude) q = q.neq('path', exclude)
  const { data, error } = await q
  if (error) return []
  return data || []
}

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
    whatsappUrl:        data.whatsapp_url || (data.phone_e164 ? `https://wa.me/${(data.phone_e164 || '').replace(/[^0-9]/g, '')}` : null),
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
const RESERVED_PATHS = new Set(['/', '/rfq', '/products/salt', '/services', '/blog', '/login', '/buyer', '/case-studies'])
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
    .select('id, path, title, hero_photo_url, description, category, hs_code, price_indication, loading_ports, specs')
    .eq('is_published', true)
    .like('path', norm + '/%')
  if (error) return []
  return (data || []).filter(p => p.path.split('/').filter(Boolean).length === expectedDepth)
}

/**
 * Sub-categories of a division — one entry per direct child of
 * /products/<division>, with the SKU count, a cover image (first
 * SKU's hero photo if any) and a description from the sub-cat row.
 */
export async function getDivisionSubcategories(divisionPath) {
  if (!divisionPath) return []
  const norm = '/' + divisionPath.replace(/^\/+|\/+$/g, '')
  const expectedDepth = norm.split('/').filter(Boolean).length + 1
  const { data, error } = await supabase
    .from('egg_corporate_pages')
    .select('id, path, title, hero_photo_url, description, category')
    .eq('is_published', true)
    .like('path', norm + '/%')
    .is('commodity_id', null)
  if (error) return []
  const subcats = (data || []).filter(p => p.path.split('/').filter(Boolean).length === expectedDepth)

  // Add SKU count per sub-cat
  for (const sc of subcats) {
    const { count } = await supabase
      .from('egg_corporate_pages')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true)
      .like('path', sc.path + '/%')
      .not('commodity_id', 'is', null)
    sc.sku_count = count || 0
  }
  return subcats
}

/** Pages belonging to a product / service division by category id. */
export async function getPagesInCategory(categoryId, { excludePath = null, limit = 60 } = {}) {
  if (!categoryId) return []
  let q = supabase
    .from('egg_corporate_pages')
    .select('id, path, title, hero_photo_url, description, category, hs_code, price_indication, packing_options, loading_ports, applications, specs')
    .eq('is_published', true)
    .eq('category', categoryId)
    .order('sort_order')
    .order('title')
    .limit(200)
  if (excludePath) q = q.neq('path', excludePath)
  const { data, error } = await q
  if (error) return []
  return data || []
}

/**
 * Pages whose `applications` text[] contains the given app id.
 * Used by /applications/<id> to surface every salt SKU that serves
 * that industry.
 */
export async function getPagesForApplication(appId, { limit = 60 } = {}) {
  if (!appId) return []
  const { data, error } = await supabase
    .from('egg_corporate_pages')
    .select('id, path, title, hero_photo_url, description, category, hs_code, price_indication, packing_options, certifications, loading_ports, specs')
    .eq('is_published', true)
    .contains('applications', [appId])
    .order('sort_order')
    .order('title')
    .limit(limit)
  if (error) return []
  return data || []
}

/**
 * Master destination ports for the RFQ form's destination dropdown.
 * Filters out Egyptian-origin ports (those are loading ports, not
 * destinations) and groups by region for the optgroup display.
 */
export async function getMasterDestPorts() {
  const { data, error } = await supabase
    .from('globe_ports')
    .select('id, unlocode, name, country, region, is_major')
    .eq('is_active', true)
    .eq('is_egypt_origin', false)
    .order('region')
    .order('country')
    .order('name')
  if (error) return []
  return data || []
}

/**
 * Salt catalogue helper — returns every published salt SKU split by
 * source_type (Sea Salt / Rock Salt) so the /products/salt landing
 * can render two side-by-side sections.
 */
export async function getSaltCatalogueBySource() {
  const { data, error } = await supabase
    .from('egg_corporate_pages')
    .select('id, path, title, hero_photo_url, description, hs_code, price_indication, packing_options, certifications, applications, specs, moq_mt, loading_ports')
    .eq('is_published', true)
    .eq('category', 'salt')
    .not('commodity_id', 'is', null)
    .order('sort_order')
    .order('title')
  if (error) return { sea: [], rock: [], all: [] }
  const all = data || []
  const sea = all.filter(p => (p.specs?.source_type || '').toLowerCase().includes('sea'))
  const rock = all.filter(p => (p.specs?.source_type || '').toLowerCase().includes('rock'))
  return { sea, rock, all }
}

/**
 * Salt catalogue helper — returns the unique application ids actually
 * tagged on at least one salt SKU. Used by the Salt main page to
 * render only the applications we actively serve.
 */
export async function getSaltApplicationsServed() {
  const { sea, rock } = await getSaltCatalogueBySource()
  const all = [...sea, ...rock]
  const ids = new Set()
  for (const p of all) for (const a of (p.applications || [])) ids.add(a)
  return [...ids]
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
 * Returns every product page (not services/about/blog) including
 * specs jsonb, certifications + lead time so the form's product-detail
 * preview can render every QC parameter without a second round trip.
 */
export async function getRfqProductOptions() {
  const PRODUCT_CATS = ['salt','fertilizers','chemicals','construction','agro','minerals','metals','products']
  const { data, error } = await supabase
    .from('egg_corporate_pages')
    .select('id, path, title, category, hs_code, packing_options, moq_mt, specs, certifications, lead_time_min_weeks, lead_time_max_weeks, applications, regions, price_indication, loading_ports')
    .eq('is_published', true)
    .in('category', PRODUCT_CATS)
    .order('category')
    .order('title')
  if (error) return []
  // Drop landings — keep only specific SKU pages (children of /products/<division>)
  return (data || []).filter(p => {
    if (p.path === '/products') return false
    if (PRODUCT_DIVISIONS.some(d => d.path === p.path)) return false
    // Drop sub-category landings (eg /products/construction/cement-and-clinker — no SKU)
    if (/^\/products\/[a-z-]+\/[a-z0-9-]+$/.test(p.path)) return false
    return true
  })
}
