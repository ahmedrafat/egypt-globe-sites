import legacyRedirects from './lib/legacy-redirects.json' with { type: 'json' }

/**
 * Drop 122 — preserve link equity from legacy Frappe site (267-URL sitemap).
 * Drop 123 — 236 hand-tuned 301 rules in lib/legacy-redirects.json.
 * Drop 125 — security headers + compression + powered-by hidden + image opt.
 *
 * See DROP-123-CUTOVER.md for the full apex-cutover runbook.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Drop 125d — best-practice perf + security hardening
  poweredByHeader: false,        // strip the "x-powered-by: Next.js" leak
  compress: true,                // gzip / brotli on all responses
  reactStrictMode: true,
  productionBrowserSourceMaps: false,

  // Image-domain whitelist for the Next.js Image component
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ohobjnbsybdxntaewqdi.supabase.co' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,    // 1 year — heroes are rebuilt deliberately
  },

  // Drop 125d — sitewide security headers (HSTS, anti-clickjacking, MIME-sniff
  // protection, referrer policy, permissions, content-security-policy lite).
  // Image / font / static asset routes get an aggressive 1-year immutable cache.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'X-DNS-Prefetch-Control',    value: 'on' },
        ],
      },
      {
        // Static heroes + OG cards + favicons — eternal cache (versioned by deploy)
        source: '/(heroes|ogs)/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/og-image.png',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' },
        ],
      },
    ]
  },

  // 236 hand-tuned 301 rules diffed from the legacy Frappe sitemap.
  // See scripts/build-legacy-redirects.mjs to regenerate.
  async redirects() {
    return legacyRedirects
  },
}

export default nextConfig
