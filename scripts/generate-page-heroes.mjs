/**
 * Drop 125b — generate per-page hero photos for every published egg_corporate_pages
 * row that has hero_photo_url=NULL.
 *
 * The audit flagged 349/349 published pages have NULL hero. Buyers won't actually
 * upload photos for 349 pages, so this generates a brand-coloured procedural hero
 * per page using Sharp's SVG-to-PNG pipeline:
 *
 *   - Category-driven gradient bg (salt=blue, cement=stone, fertilizers=green,
 *     chemicals=pink, construction=amber, agro=emerald, minerals=slate,
 *     metals=gray, services=teal, applications=violet, blog/case_studies=zinc)
 *   - EG brand tile + page title overlay + subtitle + footer URL
 *   - 1600×900 (16:9 hero ratio)
 *
 * Uploads to corporate-photos/heroes/<slug>.png and UPDATEs hero_photo_url.
 * Idempotent — only fires on rows where hero_photo_url IS NULL.
 *
 * Run: `node scripts/generate-page-heroes.mjs`
 * Re-runs are safe — already-set heroes are skipped.
 */
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { readFileSync, mkdirSync, writeFileSync, statSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const HEROES_DIR = resolve(__dirname, '../public/heroes')
mkdirSync(HEROES_DIR, { recursive: true })

// Load .env.local manually (no dotenv dep)
const env = readFileSync('.env.local', 'utf8')
  .split('\n')
  .filter(l => l && !l.startsWith('#') && l.includes('='))
  .reduce((acc, l) => {
    const [k, ...rest] = l.split('=')
    acc[k.trim()] = rest.join('=').trim().replace(/^"|"$/g, '')
    return acc
  }, {})

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || 'https://ohobjnbsybdxntaewqdi.supabase.co'
// Publishable anon key — safe to embed (already in client bundles).
const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  || 'sb_publishable_L9dqQRDBn1bISOu8Y4C0wg_KYZ1NJEC'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })

// Per-category palette — matches CATEGORY_META in lib/corporatePages.js
const PALETTE = {
  salt:         { from: '#0c4a6e', to: '#1d5fa1', accent: '#0ea5e9', icon: '🧂' },
  cement:       { from: '#52525b', to: '#27272a', accent: '#a3a3a3', icon: '🏗' },
  fertilizers:  { from: '#14532d', to: '#15803d', accent: '#22c55e', icon: '🌾' },
  chemicals:    { from: '#831843', to: '#be185d', accent: '#ec4899', icon: '⚗️' },
  construction: { from: '#7c2d12', to: '#c2410c', accent: '#f59e0b', icon: '🏗' },
  agro:         { from: '#064e3b', to: '#047857', accent: '#10b981', icon: '🍅' },
  minerals:     { from: '#334155', to: '#475569', accent: '#94a3b8', icon: '⛰' },
  metals:       { from: '#27272a', to: '#3f3f46', accent: '#71717a', icon: '🔩' },
  services:     { from: '#0f766e', to: '#0d9488', accent: '#14b8a6', icon: '🚢' },
  applications: { from: '#5b21b6', to: '#7c3aed', accent: '#a855f7', icon: '🏭' },
  case_studies: { from: '#3f3f46', to: '#52525b', accent: '#f59e0b', icon: '📖' },
  blog:         { from: '#9f1239', to: '#be123c', accent: '#f43f5e', icon: '📝' },
  partners:     { from: '#1e3a8a', to: '#1d4ed8', accent: '#3b82f6', icon: '🤝' },
  about:        { from: '#1e1b4b', to: '#312e81', accent: '#6366f1', icon: '🏢' },
  products:     { from: '#581c87', to: '#7e22ce', accent: '#a855f7', icon: '📦' },
  rfq:          { from: '#9a3412', to: '#c2410c', accent: '#fb923c', icon: '📋' },
  home:         { from: '#0f1f3a', to: '#1d5fa1', accent: '#FF6321', icon: '🏠' },
  other:        { from: '#1f2937', to: '#374151', accent: '#FF6321', icon: '🔗' },
}

const W = 1200  // 16:9 aspect, smaller for repo size
const H = 675

function escapeXml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildSvg(page) {
  const p = PALETTE[page.category] || PALETTE.other
  const title = escapeXml((page.title || '').slice(0, 70))
  const subtitle = escapeXml((page.description || '').slice(0, 120))
  const cat = escapeXml((page.category || 'other').replace(/_/g, ' ').toUpperCase())
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.from}"/>
      <stop offset="100%" stop-color="${p.to}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${p.accent}"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.5"/>
    </linearGradient>
    <radialGradient id="glow" cx="80%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g opacity="0.06" fill="none" stroke="#ffffff" stroke-width="1">
    ${Array.from({ length: 32 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${H}"/>`).join('')}
    ${Array.from({ length: 19 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="${W}" y2="${i * 50}"/>`).join('')}
  </g>
  <rect x="0" y="0" width="${W}" height="6" fill="url(#accent)"/>
  <g transform="translate(80, 80)">
    <rect width="64" height="64" rx="14" fill="${p.accent}"/>
    <text x="32" y="44" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
          font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">EG</text>
  </g>
  <text x="164" y="108" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="700" fill="#ffffff" letter-spacing="2">EGYPT GLOBE GROUP</text>
  <text x="164" y="134" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="14" font-weight="500" fill="#ffffff" opacity="0.65" letter-spacing="1.5">${cat}</text>
  <text x="80" y="430" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="${title.length > 40 ? 56 : 72}" font-weight="900" fill="#ffffff" letter-spacing="-2">${title}</text>
  ${subtitle ? `<text x="80" y="500" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="500" fill="#ffffff" opacity="0.78">${subtitle}</text>` : ''}
  <g transform="translate(80, 800)">
    <rect width="220" height="44" rx="22" fill="#FF6321"/>
    <text x="110" y="29" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
          font-size="16" font-weight="700" fill="#ffffff" text-anchor="middle">Quote in 24 hours →</text>
  </g>
  <text x="${W - 80}" y="828" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="18" font-weight="500" fill="#ffffff" opacity="0.5" text-anchor="end">egyptglobe.com</text>
  <text x="${W - 80}" y="120" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="60" font-weight="900" fill="#ffffff" opacity="0.22" text-anchor="end" letter-spacing="2">${cat}</text>
</svg>`
}

function pathToSlug(path) {
  return (path || '/').replace(/^\//, '').replace(/\//g, '-').replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'home'
}

async function main() {
  const onlyMissing = process.argv.includes('--only-missing') || !process.argv.includes('--all')
  let pages
  if (onlyMissing) {
    const { data, error } = await supabase
      .from('egg_corporate_pages')
      .select('id, path, title, description, category, hero_photo_url')
      .eq('is_published', true)
      .is('hero_photo_url', null)
      .order('category')
      .order('sort_order')
      .order('title')
      .limit(500)
    if (error) throw error
    pages = data
  } else {
    const { data, error } = await supabase
      .from('egg_corporate_pages')
      .select('id, path, title, description, category, hero_photo_url')
      .eq('is_published', true)
      .order('category')
      .order('sort_order')
      .order('title')
      .limit(500)
    if (error) throw error
    pages = data
  }

  console.log(`→ Generating heroes for ${pages.length} pages (mode: ${onlyMissing ? 'only-missing' : 'all'})`)

  // Step 1: write all images to public/heroes/<slug>.png (Vercel CDN-cached).
  //
  // Step 2: emit a one-off SQL UPDATE statement to stdout for piping into
  // the Supabase MCP later. We can't write directly here (the legacy
  // SUPABASE_SERVICE_KEY is disabled, only the publishable anon key is
  // available locally — and the egg_corporate_pages table has tight RLS).
  //
  // hero_photo_url uses path-only `/heroes/<slug>.png` so it works on both
  // egypt-globe-sites.vercel.app (pre-cutover) and egyptglobe.com (post).

  let made = 0
  let failed = 0
  let totalBytes = 0
  const sqlValues = []
  for (const p of pages) {
    try {
      const slug = pathToSlug(p.path)
      const png = await sharp(Buffer.from(buildSvg(p)))
        .png({ compressionLevel: 9, effort: 10 })
        .toBuffer()
      const out = join(HEROES_DIR, `${slug}.png`)
      writeFileSync(out, png)
      const sz = statSync(out).size
      totalBytes += sz

      sqlValues.push(`('${p.id}','/heroes/${slug.replace(/'/g, "''")}.png')`)

      made++
      if (made % 50 === 0) console.log(`   …${made}/${pages.length}`)
    } catch (e) {
      failed++
      console.warn(`   ✗ ${p.path}: ${e.message || e}`)
    }
  }

  console.log(`\n✓ Wrote ${made} hero PNGs to public/heroes/  (${(totalBytes/1024/1024).toFixed(1)} MB total)`)
  console.log(`   Failed: ${failed}`)

  // Emit SQL for follow-up via Supabase MCP
  const sqlPath = resolve(__dirname, '../supabase-update-heroes.sql')
  const sql = `-- Drop 125b — wire 349 generated hero PNGs to egg_corporate_pages
-- Apply via Supabase MCP after redeploy (so /heroes/* are live).
UPDATE public.egg_corporate_pages AS t
SET hero_photo_url = v.url, updated_at = now()
FROM (VALUES
  ${sqlValues.join(',\n  ')}
) AS v(id, url)
WHERE t.id = v.id::uuid AND t.is_published;
`
  writeFileSync(sqlPath, sql)
  console.log(`✓ Wrote SQL update to ${sqlPath}`)
}
main().catch(e => { console.error(e); process.exit(1) })
