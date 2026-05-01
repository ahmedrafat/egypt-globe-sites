/**
 * Drop 125c — generate per-page OG cards (1200×630) for every published page.
 *
 * The Sharp-generated heroes (Drop 125b) are 1200×675 — close to OG ratio but
 * not exactly 1.91:1. This script emits proper 1200×630 OG cards into
 * public/ogs/<slug>.png, and we then point per-page openGraph.images at them
 * via metadata.openGraph.images per page in the catch-all route.
 *
 * Net effect: every page has a unique branded preview when shared on Twitter /
 * Facebook / LinkedIn / WhatsApp / Slack — vs all 349 pages falling back to
 * the same /og-image.png from layout.js.
 */
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { readFileSync, mkdirSync, writeFileSync, statSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OGS_DIR = resolve(__dirname, '../public/ogs')
mkdirSync(OGS_DIR, { recursive: true })

const env = readFileSync('.env.local', 'utf8')
  .split('\n')
  .filter(l => l && !l.startsWith('#') && l.includes('='))
  .reduce((acc, l) => {
    const [k, ...rest] = l.split('=')
    acc[k.trim()] = rest.join('=').trim().replace(/^"|"$/g, '')
    return acc
  }, {})

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || 'https://ohobjnbsybdxntaewqdi.supabase.co'
const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  || 'sb_publishable_L9dqQRDBn1bISOu8Y4C0wg_KYZ1NJEC'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })

// Same palette as heroes
const PALETTE = {
  salt:         { from: '#0c4a6e', to: '#1d5fa1', accent: '#0ea5e9' },
  cement:       { from: '#52525b', to: '#27272a', accent: '#a3a3a3' },
  fertilizers:  { from: '#14532d', to: '#15803d', accent: '#22c55e' },
  chemicals:    { from: '#831843', to: '#be185d', accent: '#ec4899' },
  construction: { from: '#7c2d12', to: '#c2410c', accent: '#f59e0b' },
  agro:         { from: '#064e3b', to: '#047857', accent: '#10b981' },
  minerals:     { from: '#334155', to: '#475569', accent: '#94a3b8' },
  metals:       { from: '#27272a', to: '#3f3f46', accent: '#71717a' },
  services:     { from: '#0f766e', to: '#0d9488', accent: '#14b8a6' },
  applications: { from: '#5b21b6', to: '#7c3aed', accent: '#a855f7' },
  case_studies: { from: '#3f3f46', to: '#52525b', accent: '#f59e0b' },
  blog:         { from: '#9f1239', to: '#be123c', accent: '#f43f5e' },
  partners:     { from: '#1e3a8a', to: '#1d4ed8', accent: '#3b82f6' },
  about:        { from: '#1e1b4b', to: '#312e81', accent: '#6366f1' },
  products:     { from: '#581c87', to: '#7e22ce', accent: '#a855f7' },
  rfq:          { from: '#9a3412', to: '#c2410c', accent: '#fb923c' },
  home:         { from: '#0f1f3a', to: '#1d5fa1', accent: '#FF6321' },
  other:        { from: '#1f2937', to: '#374151', accent: '#FF6321' },
}

const W = 1200
const H = 630

function escapeXml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function buildSvg(page) {
  const p = PALETTE[page.category] || PALETTE.other
  const title = escapeXml((page.title || '').slice(0, 60))
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
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g opacity="0.05" fill="none" stroke="#ffffff" stroke-width="1">
    ${Array.from({ length: 24 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${H}"/>`).join('')}
    ${Array.from({ length: 13 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="${W}" y2="${i * 50}"/>`).join('')}
  </g>
  <rect x="0" y="0" width="${W}" height="6" fill="url(#accent)"/>
  <g transform="translate(60, 60)">
    <rect width="56" height="56" rx="12" fill="${p.accent}"/>
    <text x="28" y="38" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
          font-size="24" font-weight="900" fill="#ffffff" text-anchor="middle">EG</text>
  </g>
  <text x="136" y="84" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="20" font-weight="700" fill="#ffffff" letter-spacing="1.5">EGYPT GLOBE GROUP</text>
  <text x="136" y="106" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="13" font-weight="500" fill="#ffffff" opacity="0.65" letter-spacing="1.5">${cat}</text>
  <text x="60" y="320" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="${title.length > 35 ? 50 : 64}" font-weight="900" fill="#ffffff" letter-spacing="-1.5">${title}</text>
  <g transform="translate(60, 540)">
    <rect width="200" height="40" rx="20" fill="#FF6321"/>
    <text x="100" y="27" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
          font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">Quote in 24 hours →</text>
  </g>
  <text x="${W - 60}" y="567" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="16" font-weight="500" fill="#ffffff" opacity="0.5" text-anchor="end">egyptglobe.com</text>
</svg>`
}

function pathToSlug(path) {
  return (path || '/').replace(/^\//, '').replace(/\//g, '-').replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'home'
}

async function main() {
  const { data: pages, error } = await supabase
    .from('egg_corporate_pages')
    .select('id, path, title, category')
    .eq('is_published', true)
    .order('category')
    .order('sort_order')
    .order('title')
    .limit(500)
  if (error) throw error

  console.log(`→ Generating OG cards for ${pages.length} pages`)
  let made = 0, failed = 0, totalBytes = 0
  for (const p of pages) {
    try {
      const slug = pathToSlug(p.path)
      const png = await sharp(Buffer.from(buildSvg(p))).png({ compressionLevel: 9, effort: 10 }).toBuffer()
      const out = join(OGS_DIR, `${slug}.png`)
      writeFileSync(out, png)
      totalBytes += statSync(out).size
      made++
      if (made % 50 === 0) console.log(`   …${made}/${pages.length}`)
    } catch (e) {
      failed++
      console.warn(`   ✗ ${p.path}: ${e.message || e}`)
    }
  }
  console.log(`\n✓ Wrote ${made} OG PNGs to public/ogs/  (${(totalBytes/1024/1024).toFixed(1)} MB total)`)
  console.log(`   Failed: ${failed}`)
}
main().catch(e => { console.error(e); process.exit(1) })
