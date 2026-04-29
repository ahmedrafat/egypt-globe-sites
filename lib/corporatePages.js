/**
 * Data layer for the Egypt Globe Group corporate site.
 *
 * Reads from `egg_corporate_pages` (Supabase) — anon RLS allows SELECT
 * on rows where is_published=true. Photos are stored in the public
 * `corporate-photos` bucket; rows just hold the URL.
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  || 'https://placeholder.supabase.co'
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

/** Visual metadata per category — used by every nav surface. */
export const CATEGORY_META = {
  home:         { label: 'Home',         icon: '🏠', color: '#1d5fa1', tone: 'bg-blue-50  text-blue-700  border-blue-100'  },
  about:        { label: 'About',        icon: '🏢', color: '#6366f1', tone: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
  products:     { label: 'Products',     icon: '📦', color: '#1d5fa1', tone: 'bg-blue-50  text-blue-700  border-blue-100'  },
  salt:         { label: 'Salt',         icon: '🧂', color: '#0ea5e9', tone: 'bg-sky-50    text-sky-700    border-sky-100'    },
  fertilizers:  { label: 'Fertilizers',  icon: '🌾', color: '#16a34a', tone: 'bg-green-50  text-green-700  border-green-100'  },
  chemicals:    { label: 'Chemicals',    icon: '⚗️', color: '#db2777', tone: 'bg-pink-50   text-pink-700   border-pink-100'   },
  construction: { label: 'Construction', icon: '🏗', color: '#d97706', tone: 'bg-amber-50  text-amber-700  border-amber-100'  },
  agro:         { label: 'Agro & Food',  icon: '🍅', color: '#059669', tone: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  minerals:     { label: 'Minerals',     icon: '⛰',  color: '#64748b', tone: 'bg-slate-50  text-slate-700  border-slate-200'   },
  partners:     { label: 'Partners',     icon: '🤝', color: '#2563eb', tone: 'bg-blue-50   text-blue-700   border-blue-100'   },
  blog:         { label: 'News & Blog',  icon: '📝', color: '#e11d48', tone: 'bg-rose-50   text-rose-700   border-rose-100'   },
  rfq:          { label: 'RFQ',          icon: '📋', color: '#ea580c', tone: 'bg-orange-50 text-orange-700 border-orange-100' },
  other:        { label: 'More',         icon: '🔗', color: '#475569', tone: 'bg-slate-50  text-slate-700  border-slate-200'  },
}

/**
 * Canonical product divisions — always rendered in this order on the
 * home page tile grid + products hub. Each one MUST have a landing
 * page row in `egg_corporate_pages` (seeded by drop 95 migration).
 */
export const PRODUCT_DIVISIONS = [
  { id: 'salt',         path: '/products/salt',         label: 'Salt',                  icon: '🧂', color: '#0ea5e9', blurb: 'Sea & rock salt — food, pharma, de-icing, chemical, water treatment.' },
  { id: 'fertilizers',  path: '/products/fertilizers',  label: 'Fertilizers',           icon: '🌾', color: '#16a34a', blurb: 'Urea 46% N, MOP/KCl 60, TSP, MKP — bag or bulk vessel.' },
  { id: 'chemicals',    path: '/products/chemicals',    label: 'Chemicals',             icon: '⚗️', color: '#db2777', blurb: 'Acids, alkalis, salts and water-treatment chemicals.' },
  { id: 'construction', path: '/products/construction', label: 'Construction',          icon: '🏗', color: '#d97706', blurb: 'Cement (CEM I / II / SRC), clinker, gypsum, limestone, aggregates.' },
  { id: 'agro',         path: '/products/agro',         label: 'Agro & Food',           icon: '🍅', color: '#059669', blurb: 'Edible oils, grains, citrus, dates, herbs and spices.' },
  { id: 'minerals',     path: '/products/minerals',     label: 'Minerals',              icon: '⛰',  color: '#64748b', blurb: 'Gypsum, limestone, kaolin, feldspar, silica sand, talc.' },
]

/** Corporate (non-product) sections shown in nav + footer. */
export const CORPORATE_SECTIONS = [
  { id: 'about',    path: '/about',           label: 'About' },
  { id: 'global',   path: '/global-presence', label: 'Global Presence' },
  { id: 'partners', path: '/partners',        label: 'Partners' },
  { id: 'blog',     path: '/blog',            label: 'News & Blog' },
  { id: 'contact',  path: '/contact',         label: 'Contact' },
]

/** Static company info — referenced by footer + contact page. */
export const COMPANY_INFO = {
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
}

/** Fetch a single page by its path. Returns null if not found / not published. */
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
    .select('id, path, title, category, description, hero_photo_url, sort_order, last_crawled')
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

/** Just the path strings — used for generateStaticParams. */
export async function getAllPaths() {
  const { data, error } = await supabase
    .from('egg_corporate_pages')
    .select('path')
    .eq('is_published', true)
  if (error) return []
  return (data || []).map(r => r.path).filter(p => p && p !== '/')
}

/** Pages in the same category as `current`, excluding `current` itself. */
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

/**
 * Direct child pages of `parentPath` — i.e. pages whose path is
 * exactly one segment deeper. Used for category landings:
 *   /products → [/products/salt, /products/chemicals, …]
 *   /products/salt → [/products/salt/sea-salt, /products/salt/industrial-salt, …]
 */
export async function getDirectChildren(parentPath) {
  if (!parentPath || parentPath === '/') return []
  const norm = '/' + parentPath.replace(/^\/+|\/+$/g, '')
  const expectedDepth = norm.split('/').filter(Boolean).length + 1
  const { data, error } = await supabase
    .from('egg_corporate_pages')
    .select('id, path, title, hero_photo_url, description, category')
    .eq('is_published', true)
    .like('path', norm + '/%')
  if (error) return []
  return (data || []).filter(p => p.path.split('/').filter(Boolean).length === expectedDepth)
}

/**
 * Pages belonging to a product division by category id.
 * Used by /products/<division> landing pages — surfaces every SKU
 * in that division regardless of where it sits in the URL tree.
 */
export async function getPagesInCategory(categoryId, { excludePath = null, limit = 60 } = {}) {
  if (!categoryId) return []
  let q = supabase
    .from('egg_corporate_pages')
    .select('id, path, title, hero_photo_url, description, category')
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
