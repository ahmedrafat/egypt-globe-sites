import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
)

// Map Supabase snake_case row → component-friendly camelCase shape
function mapSiteRow(row) {
  if (!row) return null
  return {
    id: row.id,
    slug: row.slug,
    brandId: row.slug,
    brandName: row.brand_name,
    brandLogo: row.brand_logo,
    brandColor: row.brand_color,
    domain: row.domain,
    hosting: row.hosting,
    framework: row.framework,
    status: row.status,
    visitors: row.visitors,
    pageViews: row.page_views,
    seo: row.seo || {},
    theme: row.theme || { primaryColor: '#FF6321', secondaryColor: '#ffffff', accentColor: '#FF6321', darkMode: true },
    sections: row.sections || {},
    navigation: row.navigation || [],
    social: row.social || {},
    custom_pages: row.custom_pages || [],
  }
}

export async function getSiteBySlug(slug) {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error || !data) return null
  return mapSiteRow(data)
}

export async function getSiteByDomain(domain) {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('domain', domain)
    .single()
  if (error || !data) return null
  return mapSiteRow(data)
}

export async function getAllSlugs() {
  const { data, error } = await supabase
    .from('sites')
    .select('slug')
    .eq('status', 'published')
  if (error || !data) return []
  return data.map((r) => r.slug)
}

export async function getAllSites() {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('status', 'published')
  if (error || !data) return []
  return data.map(mapSiteRow)
}
