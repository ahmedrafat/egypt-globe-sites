import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(
  SUPABASE_URL  || 'https://placeholder.supabase.co',
  SUPABASE_ANON || 'placeholder'
)

export async function getSiteConfig(slug) {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error) return null
  return data
}

export async function getAllPublishedSites() {
  const { data, error } = await supabase
    .from('sites')
    .select('id, slug, brand_name, domain, status, seo, brand_logo, brand_color')
    .eq('status', 'published')
  if (error) return []
  return data
}
