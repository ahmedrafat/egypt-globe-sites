/**
 * /api/tariff-lookup — Drop 138c.
 *
 * Server-side tariff lookup proxying World Bank WITS UNCTAD TRAINS API.
 * Cached in public.tariff_cache (30-day TTL — tariffs change quarterly
 * at most, per global-trade-data skill rate-limiting guidance).
 *
 * Query params:
 *   reporter — destination country ISO3 (KEN / NGA / IND / SAU / etc.)
 *   hs       — 6-digit HS code (longer accepted, trimmed to 6)
 *   year     — query year (defaults to last complete year)
 *
 * Returns:
 *   { mfn_rate_pct, preferential_pct, bound_rate_pct, source, cached, fetched_at }
 *
 * Falls back to the hardcoded TariffCalculator table when WITS is
 * unreachable / returns no data, so the buyer always gets *some* number.
 */

import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'  // never SSG — every request hits cache check
export const runtime = 'nodejs'         // need Node fetch + DB driver

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ohobjnbsybdxntaewqdi.supabase.co'
// Drop 138c-fix v3 — earlier we tried SUPABASE_SERVICE_KEY as a service-role
// fallback, but Vercel's value for that env var is a legacy JWT that was
// disabled in the Apr 17 group migration. Using it silently broke every
// query (Supabase rejected the dead key and supabase-js swallowed the
// 401 inside our cache try/catch). Cache writes go through cache_tariff_lookup()
// SECURITY DEFINER RPC instead, so the publishable anon key is sufficient.
// Only accept the modern sb_secret_* prefix as service fallback (skip JWTs).
function pickKey() {
  const candidates = [process.env.SUPABASE_SERVICE_ROLE_KEY, process.env.SUPABASE_SERVICE_KEY]
  for (const k of candidates) if (k && k.startsWith('sb_secret_')) return k
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_L9dqQRDBn1bISOu8Y4C0wg_KYZ1NJEC'
}
const SUPABASE_KEY = pickKey()

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })

// ── Hardcoded fallback (matches TariffCalculator.jsx Drop 133) ──────────
const FALLBACK = {
  KEN: { fta: 'COMESA', pref: { '252329': 0, '251000': 0, '310210': 0, '250100': 0, '281512': 10 },
         mfn:  { '252329': 25, '251000': 0, '310210': 0, '250100': 10, '281512': 10, default: 25 } },
  NGA: { fta: null,
         mfn:  { '252329': 35, '251000': 5, '310210': 0, '250100': 5, '281512': 5, default: 20 } },
  IND: { fta: null,
         mfn:  { '252329': 20, '251000': 5, '310210': 0, '250100': 5, '281512': 7.5, default: 10 } },
  SAU: { fta: 'PAFTA', pref: { '252329': 0, '251000': 0, '310210': 0, '250100': 0, '281512': 0 },
         mfn:  { '252329': 5,  '251000': 5, '310210': 5, '250100': 5, '281512': 5, default: 5 } },
}

function trimHs6(hs: string): string {
  return (hs || '').replace(/[^0-9]/g, '').slice(0, 6).padEnd(6, '0').slice(0, 6)
}

function fallbackRate(reporter: string, hs6: string) {
  const country = FALLBACK[reporter as keyof typeof FALLBACK]
  if (!country) return null
  const mfn  = country.mfn[hs6 as keyof typeof country.mfn] ?? country.mfn.default ?? null
  const pref = (country as any).pref?.[hs6] ?? ((country as any).pref ? 0 : null)
  return { mfn_rate_pct: mfn, preferential_pct: pref, bound_rate_pct: null, source: 'fallback' }
}

// ── WITS SDMX call ──────────────────────────────────────────────────────
// Endpoint pattern (per global-trade-data skill, references/apis/world-bank-wits.md):
//   /SDMX/V21/datasource/tradestats-tariff/reporter/{reporter}/year/{year}/partner/{partner}/product/{product}?format=JSON
async function fetchFromWits(reporter: string, hs6: string, year: number) {
  const url = `https://wits.worldbank.org/API/V1/SDMX/V21/datasource/tradestats-tariff/reporter/${reporter.toLowerCase()}/year/${year}/partner/all/product/${hs6}/indicator/AHS-WGHTD-AVRG?format=JSON`

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 8000)  // 8s budget — WITS can be slow
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } })
    clearTimeout(timer)
    if (!res.ok) return null
    const json = await res.json() as any

    // SDMX response: dataSets[0].observations is a key→value map. We average
    // all observed values for the partner=all aggregate to get the MFN rate.
    const obs = json?.dataSets?.[0]?.observations
    if (!obs || typeof obs !== 'object') return null

    const values = Object.values(obs)
      .map((v: any) => Number(Array.isArray(v) ? v[0] : v))
      .filter(v => Number.isFinite(v) && v >= 0 && v <= 1000)
    if (!values.length) return null

    const avg = values.reduce((a, b) => a + b, 0) / values.length
    return {
      mfn_rate_pct: Math.round(avg * 100) / 100,
      preferential_pct: null,
      bound_rate_pct: null,
      source: 'WITS',
      raw: json,
    }
  } catch {
    clearTimeout(timer)
    return null
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const reporter = (url.searchParams.get('reporter') || '').toUpperCase().trim()
  const hsRaw = url.searchParams.get('hs') || ''
  const hs6 = trimHs6(hsRaw)
  const year = Number(url.searchParams.get('year')) || (new Date().getFullYear() - 1)

  if (!reporter || !hs6 || hs6.length < 4) {
    return Response.json({ error: 'reporter (ISO3) + hs (6-digit) required' }, { status: 400 })
  }

  // 1. Cache check
  try {
    const { data: cached } = await supabase
      .from('tariff_cache')
      .select('mfn_rate_pct, preferential_pct, bound_rate_pct, source, fetched_at, expires_at')
      .eq('reporter_iso3', reporter)
      .eq('partner_iso3',  'EGY')
      .eq('hs_code',       hs6)
      .eq('year',          year)
      .gt('expires_at',    new Date().toISOString())
      .maybeSingle()
    if (cached) {
      return Response.json({ ...cached, cached: true, hs_code: hs6, reporter, year })
    }
  } catch { /* cache miss is non-fatal */ }

  // 2. WITS live call
  const wits = await fetchFromWits(reporter, hs6, year)

  // 3. Fallback to hardcoded if WITS empty
  const result = wits || fallbackRate(reporter, hs6) || { mfn_rate_pct: null, preferential_pct: null, bound_rate_pct: null, source: 'no-data' }

  // 4. Cache write via SECURITY DEFINER RPC (bypasses anon RLS — see
  //    cache_tariff_lookup definition for input-validation guards)
  if (result.mfn_rate_pct != null && result.source !== 'no-data') {
    try {
      await supabase.rpc('cache_tariff_lookup', {
        p_reporter_iso3:    reporter,
        p_hs_code:          hs6,
        p_year:             year,
        p_mfn_rate_pct:     result.mfn_rate_pct,
        p_preferential_pct: result.preferential_pct,
        p_bound_rate_pct:   result.bound_rate_pct,
        p_source:           result.source,
      })
    } catch { /* write rejected — keep going, response is correct */ }
  }

  return Response.json({ ...result, cached: false, hs_code: hs6, reporter, year, raw: undefined })
}
