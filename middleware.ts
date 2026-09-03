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

  // Security headers, set here as well as in next.config.mjs headers().
  // On Vercel the config route declares all six (confirmed in the build
  // output) and a local `next start` emits all six, but the production
  // response carried only Referrer-Policy and Permissions-Policy — HSTS,
  // X-Frame-Options, X-Content-Type-Options and X-DNS-Prefetch-Control were
  // dropped somewhere in the platform layer, on both the apex and the
  // deployment host, and not by this middleware (robots.txt bypasses it and
  // lost them too). Headers set on this response demonstrably survive
  // (x-egg-brand above), so this makes delivery deterministic. Static files
  // outside the matcher (robots, sitemap, heroes, ogs) do not need them.
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  return response
}

// Run the middleware on every page request EXCEPT static assets + API routes
// + Next.js internal paths.
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|heroes/|ogs/|api/).*)',
  ],
}
