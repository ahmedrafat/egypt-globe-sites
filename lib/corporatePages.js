/**
 * Data layer for the Egypt Globe Group corporate site.
 *
 * Reads from `egg_corporate_pages` (Supabase) — anon RLS allows SELECT
 * on rows where is_published=true. Photos are stored in the public
 * `corporate-photos` bucket; rows just hold the URL.
 *
 * Drop 94 (frontend wiring for drop 93's CMS schema).
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  || 'https://placeholder.supabase.co'
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

export const CATEGORY_META = {
  home:         { label: 'Home',         icon: '🏠', color: '#FF6321' },
  about:        { label: 'About',        icon: '🏢', color: '#6366f1' },
  products:     { label: 'Products',     icon: '📦', color: '#a855f7' },
  salt:         { label: 'Salt',         icon: '🧂', color: '#0ea5e9' },
  fertilizers:  { label: 'Fertilizers',  icon: '🌾', color: '#22c55e' },
  chemicals:    { label: 'Chemicals',    icon: '⚗️', color: '#ec4899' },
  construction: { label: 'Construction', icon: '🏗', color: '#f59e0b' },
  agro:         { label: 'Agro & Food',  icon: '🍅', color: '#10b981' },
  minerals:     { label: 'Minerals',     icon: '⛰', color: '#94a3b8' },
  partners:     { label: 'Partners',     icon: '🤝', color: '#3b82f6' },
  blog:         { label: 'News & Blog',  icon: '📝', color: '#f43f5e' },
  rfq:          { label: 'RFQ',          icon: '📋', color: '#fb923c' },
  other:        { label: 'More',         icon: '🔗', color: '#64748b' },
}

/** Fetch a single page by its path. Returns null if not found / not published. */
export async function getPageByPath(path) {
  // Normalize: ensure leading slash, strip trailing slash (except '/')
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
  // Drop the home path '/' since it's handled by app/page.js (not [...path])
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
