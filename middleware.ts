/**
 * middleware.ts — Drop 167. Multi-tenant brand routing.
 *
 * Same Next.js codebase serves www.egyptglobe.com, www.sinaisalt.com,
 * www.egsalt.com, and www.globesalt.com. The middleware reads the
 * incoming Host header and stamps a request header `x-egg-brand` with
 * the resolved brand_code (matching egg_letterheads.brand_code).
 *
 * Server components read `headers().get('x-egg-brand')` to filter the
 * catalogue: each brand-specific domain shows a meaningfully-different
 * commodity slice (sinaisalt.com → sea salt only; egsalt.com → bulk
 * industrial / deicing; globesalt.com → all 100 salt SKUs).
 *
 * www.egyptglobe.com keeps the full umbrella experience (no filter).
 *
 * Drop 167 strategy:
 *   - Per-brand layout label + colour theme via CSS variables
 *   - Per-brand robots.txt + sitemap.xml served via path rewrites
 *   - Per-brand canonical URL (so Google indexes products on the
 *     brand domain, not the umbrella)
 *   - Per-brand meta title + description prefix injected at layout
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Map host → brand_code. Add new brand domains here as they spin up.
const HOST_TO_BRAND: Record<string, string> = {
  'sinaisalt.com':         'SINAI_SALT',
  'www.sinaisalt.com':     'SINAI_SALT',
  'egsalt.com':            'EG_SALT',
  'www.egsalt.com':        'EG_SALT',
  'globesalt.com':         'GLOBE_SALT',
  'www.globesalt.com':     'GLOBE_SALT',
  // Pelot Salt brand domain (existing)
  'pelotsalt.com':         'PELOT_SALT',
  'www.pelotsalt.com':     'PELOT_SALT',
  // Umbrella host — no filter (shows everything)
  'egyptglobe.com':        'EGG',
  'www.egyptglobe.com':    'EGG',
}

// Routes that must never be served from a shared cache: they are auth-gated
// or set a session. Everything else under the matcher is public content.
const NEVER_CACHE = /^\/(buyer|login|auth|api)(\/|$)/

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase().split(':')[0]
  const brand = HOST_TO_BRAND[host] || 'EGG'

  // Stamp the request with the resolved brand. Server components read this.
  const response = NextResponse.next({
    request: {
      headers: new Headers([
        ...Array.from(request.headers.entries()),
        ['x-egg-brand', brand],
        ['x-egg-host', host],
      ]),
    },
  })

  // Stamp the response too so client code (Brand badge etc.) can detect it
  response.headers.set('x-egg-brand', brand)

  /* Edge-cache public HTML for 60 s.
   *
   * Every page reaches the brand resolver, which calls headers(), so Next
   * renders them dynamically and emits `private, no-cache, no-store` to keep
   * user-specific data out of caches. Correct by default, but it also blocked
   * the CDN and the browser: every visit paid a full render and field TTFB
   * p75 sat at ~4 s on desktop (RUM, Sep 2026), which is what Search Console
   * reports as a Core Web Vitals failure.
   *
   * Page content really does vary by session — supabaseServer.getBuyerVisibility()
   * drives showPrices, the visible category list and the AccessRestricted view —
   * so a shared cache must never mix the two audiences:
   *   - a request carrying a Supabase auth cookie is left untouched and stays
   *     no-store, so a signed-in buyer's HTML is never stored;
   *   - anonymous responses are cacheable, and `Vary: Cookie` keeps a shared
   *     cache from handing that copy to a cookie-bearing request.
   * The anonymous render is also the least-privileged view (showPrices false),
   * so even a Vary failure cannot expose gated content.
   *
   * max-age=0 keeps the browser revalidating, so a CMS edit is visible to a
   * returning visitor within the 60 s shared-cache window.
   */
  const path = request.nextUrl.pathname
  const hasSession = request.cookies.getAll().some(c => c.name.startsWith('sb-'))
  if (!hasSession && !NEVER_CACHE.test(path)) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=0, s-maxage=60, stale-while-revalidate=600',
    )
    response.headers.set('Vary', 'Cookie')
  }

  return response
}

// Run the middleware on every page request EXCEPT static assets + API routes
// + Next.js internal paths.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|heroes/|ogs/|api/).*)',
  ],
}
