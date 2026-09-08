/**
 * Generate Open Graph cards (1200×630) for every published egg_corporate_pages row.
 *
 * Batch 2 (Sep 2026 audit): the previous card drew the title on ONE line
 * at 50–64 px, so any title over ~35 characters ran off the right edge and
 * long ones were cut at 60 characters mid-word. Titles now wrap onto up to
 * three lines with the font size stepping down to fit, the category sits
 * as an eyebrow, and the description is dropped (it never fit).
 *
 * Output: public/ogs/<slug>.png — referenced by app/[...path]/page.jsx.
 * Run: `node scripts/generate-page-ogs.mjs`
 */
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { readFileSync, mkdirSync, writeFileSync, statSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OGS_DIR = resolve(__dirname, '../public/ogs')
mkdirSync(OGS_DIR, { recursive: true })

const env = (() => { try { return readFileSync('.env.local', 'utf8') } catch { return '' } })()
  .split('\n').filter(l => l && !l.startsWith('#') && l.includes('='))
  .reduce((acc, l) => { const [k, ...rest] = l.split('='); acc[k.trim()] = rest.join('=').trim().replace(/^"|"$/g, ''); return acc }, {})
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || 'https://ohobjnbsybdxntaewqdi.supabase.co'
const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_L9dqQRDBn1bISOu8Y4C0wg_KYZ1NJEC'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })

const PALETTE = {
  salt:         { from: '#0c4a6e', to: '#1d5fa1', accent: '#0ea5e9' },
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
  markets:      { from: '#1e3a5f', to: '#0f4c81', accent: '#38bdf8' },
  ports:        { from: '#0c4a6e', to: '#075985', accent: '#0ea5e9' },
  standards:    { from: '#1e1b4b', to: '#3730a3', accent: '#818cf8' },
  trade_tools:  { from: '#312e81', to: '#4338ca', accent: '#818cf8' },
  partners:     { from: '#1e3a8a', to: '#1d4ed8', accent: '#3b82f6' },
  about:        { from: '#1e1b4b', to: '#312e81', accent: '#6366f1' },
  products:     { from: '#581c87', to: '#7e22ce', accent: '#a855f7' },
  wholesale:    { from: '#0c4a6e', to: '#1d5fa1', accent: '#0ea5e9' },
  compare:      { from: '#1e3a5f', to: '#0f4c81', accent: '#38bdf8' },
  rfq:          { from: '#9a3412', to: '#c2410c', accent: '#fb923c' },
  home:         { from: '#0f1f3a', to: '#1d5fa1', accent: '#FF6321' },
  other:        { from: '#1f2937', to: '#374151', accent: '#FF6321' },
}
const CATEGORY_LABEL = { case_studies: 'Case study', trade_tools: 'Trade tools', blog: 'News & insights', markets: 'Market brief', ports: 'Loading port', standards: 'Standard', applications: 'Industry', other: 'Egypt Globe Group' }

const W = 1200, H = 630
const FONT = "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

/** Greedy word wrap on an estimated glyph width (0.56 em for a bold sans). */
function wrap(text, fontSize, maxWidth, maxLines) {
  const perChar = fontSize * 0.56
  const maxChars = Math.floor(maxWidth / perChar)
  const words = text.split(/\s+/).filter(Boolean)
  const lines = []
  let cur = ''
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w
    if (next.length <= maxChars || !cur) cur = next
    else { lines.push(cur); cur = w }
  }
  if (cur) lines.push(cur)
  return lines.length <= maxLines ? lines : null
}

/** Pick the largest size whose wrapped title fits in maxLines. */
function fitTitle(title) {
  for (const size of [68, 60, 52, 46, 40, 36]) {
    const lines = wrap(title, size, W - 120, size >= 52 ? 3 : 4)
    if (lines) return { size, lines }
  }
  const lines = wrap(title, 32, W - 120, 5) || [title.slice(0, 90) + '…']
  return { size: 32, lines: lines.slice(0, 5) }
}

function buildSvg(page) {
  const p = PALETTE[page.category] || PALETTE.other
  const { size, lines } = fitTitle(page.title || 'Egypt Globe Group')
  const lineH = Math.round(size * 1.12)
  const blockH = lines.length * lineH
  const startY = Math.round((H - blockH) / 2 + size * 0.85) + 20
  const cat = CATEGORY_LABEL[page.category] || (page.category || 'Egypt Globe Group').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${p.from}"/><stop offset="100%" stop-color="${p.to}"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g opacity="0.06" fill="none" stroke="#ffffff" stroke-width="1">
    ${Array.from({ length: 24 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${H}"/>`).join('')}
    ${Array.from({ length: 13 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="${W}" y2="${i * 50}"/>`).join('')}
  </g>
  <rect x="0" y="0" width="${W}" height="6" fill="${p.accent}"/>
  <g transform="translate(60, 56)">
    <rect width="52" height="52" rx="12" fill="${p.accent}"/>
    <text x="26" y="35" font-family="${FONT}" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">EG</text>
  </g>
  <text x="130" y="80" font-family="${FONT}" font-size="20" font-weight="700" fill="#ffffff" letter-spacing="1.5">EGYPT GLOBE GROUP</text>
  <text x="130" y="103" font-family="${FONT}" font-size="14" font-weight="500" fill="#ffffff" opacity="0.7" letter-spacing="2">${esc(cat.toUpperCase())}</text>
  ${lines.map((l, i) => `<text x="60" y="${startY + i * lineH}" font-family="${FONT}" font-size="${size}" font-weight="800" fill="#ffffff" letter-spacing="-1">${esc(l)}</text>`).join('\n  ')}
  <text x="60" y="${H - 48}" font-family="${FONT}" font-size="18" font-weight="600" fill="#ffffff" opacity="0.85">Quote in 24 hours · per-lot Certificate of Analysis · FOB / CIF / CFR from 7 Egyptian ports</text>
  <text x="${W - 60}" y="${H - 48}" font-family="${FONT}" font-size="18" font-weight="500" fill="#ffffff" opacity="0.6" text-anchor="end">egyptglobe.com</text>
</svg>`
}

function pathToSlug(path) {
  return (path || '/').replace(/^\//, '').replace(/\//g, '-').replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'home'
}

async function main() {
  const { data: pages, error } = await supabase.from('egg_corporate_pages').select('id, path, title, category').eq('is_published', true).order('path').limit(1000)
  if (error) throw error
  const limitArg = process.argv.indexOf('--limit')
  const targets = limitArg > -1 ? pages.filter((_, i) => i % 97 === 0).slice(0, Number(process.argv[limitArg + 1]) || 4) : pages
  console.log(`→ Generating OG cards for ${targets.length} pages`)
  let made = 0, failed = 0, total = 0
  for (const p of targets) {
    try {
      const png = await sharp(Buffer.from(buildSvg(p))).png({ palette: true, colours: 48, dither: 0.15, compressionLevel: 9, effort: 8 }).toBuffer()
      const out = join(OGS_DIR, `${pathToSlug(p.path)}.png`)
      writeFileSync(out, png); total += statSync(out).size; made++
      if (made % 100 === 0) console.log(`   …${made}/${targets.length}`)
    } catch (e) { failed++; console.warn(`   ✗ ${p.path}: ${e.message || e}`) }
  }
  console.log(`✓ Wrote ${made} OG cards (${(total / 1024 / 1024).toFixed(1)} MB, avg ${Math.round(total / Math.max(made, 1) / 1024)} KB). Failed: ${failed}`)
}
main().catch(e => { console.error(e); process.exit(1) })
