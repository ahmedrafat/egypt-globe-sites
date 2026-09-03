/**
 * brand.js — Drop 167. Multi-tenant brand resolution for the public site.
 *
 * The middleware (middleware.ts) reads the incoming Host header and
 * stamps `x-egg-brand` on the request. Server components call
 * `getCurrentBrand()` to read it back and apply per-brand catalogue
 * filtering, layout theming, canonical URLs, and meta titles.
 *
 * BRAND_HOSTS is the inverse of HOST_TO_BRAND in middleware.ts —
 * given a brand_code, returns the canonical public host so the page
 * can emit the right canonical URL + Open Graph URL even when the
 * Vercel preview URL is hit directly.
 */

import { headers } from 'next/headers'

export const BRAND_HOSTS = {
  EGG:        'egyptglobe.com',   // apex — www 308s here; a canonical must never name a redirecting host
  PELOT_SALT: 'www.pelotsalt.com',
  SINAI_SALT: 'www.sinaisalt.com',
  EG_SALT:    'www.egsalt.com',
  GLOBE_SALT: 'www.globesalt.com',
}

// Per-brand catalogue filter:
//   'all'     — show everything (umbrella egyptglobe.com)
//   'sea'     — sea salt SKUs only (sinaisalt.com)
//   'rock'    — rock salt only
//   'bulk'    — bulk industrial / deicing only (egsalt.com)
//   'wholesale' — all salt SKUs (globesalt.com — wholesale-export framing)
export const BRAND_CATALOGUE_FILTER = {
  EGG:        'all',
  PELOT_SALT: 'all',          // Pelot Salt was umbrella salt brand pre-multi-tenant; can keep all
  SINAI_SALT: 'sea',          // Sea salt specialist
  EG_SALT:    'bulk',         // Bulk industrial / chlor-alkali / deicing
  GLOBE_SALT: 'wholesale',    // All salt SKUs, wholesale-export framing
}

// Per-brand metadata template
export const BRAND_META = {
  EGG: {
    siteName:        'Egypt Globe Group',
    titleSuffix:     '· Egypt Globe Group',
    descriptionTail: '',
    primaryColor:    '#1d5fa1',
    accentColor:     '#FF6321',
  },
  PELOT_SALT: {
    siteName:        'Pelot Salt',
    titleSuffix:     '· Pelot Salt',
    descriptionTail: ' — Pelot Salt, a brand of Egypt Globe Group.',
    primaryColor:    '#0ea5e9',
    accentColor:     '#FF6321',
  },
  SINAI_SALT: {
    siteName:        'Sinai Salt',
    titleSuffix:     '· Sinai Salt — Egyptian Sea Salt from North Sinai',
    descriptionTail: ' — Sinai Salt, sea salt specialist from Bardawil + El-Arish (a brand of Egypt Globe Group).',
    primaryColor:    '#0284c7',
    accentColor:     '#FF6321',
  },
  EG_SALT: {
    siteName:        'EG Salt',
    titleSuffix:     '· EG Salt — Bulk Egyptian Industrial & Deicing Salt',
    descriptionTail: ' — EG Salt, bulk industrial salt specialist (a brand of Egypt Globe Group).',
    primaryColor:    '#475569',
    accentColor:     '#FF6321',
  },
  GLOBE_SALT: {
    siteName:        'Globe Salt',
    titleSuffix:     '· Globe Salt — Egyptian Salt Wholesale Exporter',
    descriptionTail: ' — Globe Salt, wholesale Egyptian salt export to 60+ countries (a brand of Egypt Globe Group).',
    primaryColor:    '#0d9488',
    accentColor:     '#FF6321',
  },
}

/**
 * Read the brand_code stamped by middleware.ts. Server components only.
 * Defaults to 'EGG' (umbrella) for safety when called from a context
 * without a request (build-time generateStaticParams etc.).
 */
export async function getCurrentBrand() {
  try {
    const h = await headers()
    return h.get('x-egg-brand') || 'EGG'
  } catch {
    return 'EGG'
  }
}

/**
 * Per-brand canonical host (without protocol) — used to build absolute
 * canonical URLs and Open Graph URLs that point to the brand domain
 * even when the request came through a Vercel preview URL.
 */
export function brandHost(brandCode = 'EGG') {
  return BRAND_HOSTS[brandCode] || BRAND_HOSTS.EGG
}

/**
 * Per-brand catalogue filter spec — the corporatePages.js helpers
 * read this to slice the catalogue. Returns one of:
 *   'all' | 'sea' | 'rock' | 'bulk' | 'wholesale'
 */
export function brandCatalogueFilter(brandCode = 'EGG') {
  return BRAND_CATALOGUE_FILTER[brandCode] || 'all'
}

/**
 * Returns the page-path filter to apply to a Supabase query for the
 * given brand. Used in getAllPaths / getPagesByCategory / etc. so each
 * brand domain serves only its relevant slice.
 *
 * Returns:
 *   { kind: 'all' }                              — no filter
 *   { kind: 'sea_salt' }                         — only /products/salt + sea-salt SKUs
 *   { kind: 'bulk_salt' }                        — only bulk + industrial + deicing salt
 *   { kind: 'all_salt' }                         — only /products/salt/* paths
 */
export function brandPathFilter(brandCode = 'EGG') {
  const f = brandCatalogueFilter(brandCode)
  if (f === 'all') return { kind: 'all' }
  if (f === 'sea') return { kind: 'sea_salt' }
  if (f === 'rock') return { kind: 'rock_salt' }
  if (f === 'bulk') return { kind: 'bulk_salt' }
  if (f === 'wholesale') return { kind: 'all_salt' }
  return { kind: 'all' }
}

/**
 * Per-brand meta — for layout.js + page metadata generation.
 * Returns the META block + brand_code so callers can render the right
 * letterhead / colours / canonical without re-fetching the row.
 */
export function brandMeta(brandCode = 'EGG') {
  const m = BRAND_META[brandCode] || BRAND_META.EGG
  return { ...m, brandCode, host: brandHost(brandCode) }
}
