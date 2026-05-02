/**
 * Server-side Supabase client backed by Next.js cookies — needed for
 * reading the buyer's auth session in Server Components, generateMetadata,
 * and Route Handlers.
 */
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Drop 139c — race against a hard timeout so a slow Supabase pool
// can't stall an SSR request. See lib/corporatePages.js withTimeout
// for the canonical implementation; duplicated here to avoid a
// cyclic import (corporatePages.js doesn't import from this file).
function withTimeout(promise, ms = 4000, fallback = null) {
  let to
  return Promise.race([
    promise,
    new Promise(resolve => { to = setTimeout(() => resolve({ data: null, error: new Error('timeout') }), ms) }),
  ]).then(r => { clearTimeout(to); return r }).catch(() => ({ data: null, error: new Error('throw') }))
    .then(r => (r && r.error) ? { data: fallback, error: r.error } : r)
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options))
        } catch {
          // Ignored — server components can't mutate cookies; refresh is
          // harmless to drop here, route handlers will re-set them.
        }
      },
    },
  })
}

/**
 * Get the buyer's effective visibility for the current request.
 *
 *   { authenticated, status, showPrices, visibleAll,
 *     visibleCategories[], visiblePaths[], user, email, company, ... }
 *
 * Anon = catalogue visible, prices hidden.
 * Pending / suspended = catalogue visible, prices hidden.
 * Approved (show_prices=true) = scoped catalogue visible, prices shown.
 */
export async function getBuyerVisibility() {
  const supabase = await createSupabaseServerClient()
  // Race auth.getUser against 2.5s — if Supabase is timing out, treat as anon
  // so the layout still renders rather than blocking the whole SSR pipeline.
  const userResult = await Promise.race([
    supabase.auth.getUser(),
    new Promise(resolve => setTimeout(() => resolve({ data: { user: null } }), 2500)),
  ]).catch(() => ({ data: { user: null } }))
  const user = userResult?.data?.user || null
  if (!user) {
    return {
      authenticated: false,
      status: 'anon',
      showPrices: false,
      visibleAll: true,
      visibleCategories: [],
      visiblePaths: [],
      user: null,
    }
  }

  const { data: access } = await withTimeout(
    supabase
      .from('egg_buyer_access')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle(),
    2500,
    null,
  )

  if (!access) {
    return {
      authenticated: true,
      status: 'no_profile',
      showPrices: false,
      visibleAll: true,
      visibleCategories: [],
      visiblePaths: [],
      user,
    }
  }

  return {
    authenticated: true,
    status: access.status,
    showPrices: !!access.show_prices && access.status === 'approved',
    visibleAll: !!access.visible_all || access.status !== 'approved',
    visibleCategories: access.visible_categories || [],
    visiblePaths: access.visible_paths || [],
    company: access.company,
    contactName: access.contact_name,
    country: access.country,
    email: access.email || user.email,
    user,
  }
}

/** Filter a list of pages by buyer scope (only used for approved buyers
 *  with non-visibleAll scope). */
export function filterPagesByVisibility(pages, visibility) {
  if (!visibility || visibility.visibleAll) return pages
  if (!Array.isArray(pages)) return []
  return pages.filter(p => {
    if ((visibility.visiblePaths || []).includes(p.path)) return true
    if ((visibility.visibleCategories || []).includes(p.category)) return true
    return false
  })
}

export function isPageVisible(page, visibility) {
  if (!visibility || visibility.visibleAll) return true
  if (!page) return false
  if ((visibility.visiblePaths || []).includes(page.path)) return true
  if ((visibility.visibleCategories || []).includes(page.category)) return true
  return false
}
