/**
 * Generate per-page hero backgrounds for every published egg_corporate_pages row.
 *
 * Batch 2 (Sep 2026 audit, UI1): the previous generator baked an "EG" tile,
 * the page title and a truncated description into every image. Because the
 * same file is the hero background under a scrim, that text ghosted through
 * behind the real H1, breadcrumb and chips on about 418 pages. Heroes are
 * now TEXTLESS: a category gradient, a fine technical grid, and one large
 * geometric figure whose form depends on the category (halite lattice for
 * salt, strata for construction, hex ring for chemicals, rays for agro …)
 * with placement and rotation seeded by the page slug so cards differ.
 *
 * Social cards live in scripts/generate-page-ogs.mjs and keep their text.
 *
 * Output: public/heroes/<slug>.png, 1200×675, palette-quantised PNG
 * (~25–45 KB). Filenames are unchanged, so hero_photo_url in the CMS
 * keeps pointing at the same paths — no database write.
 *
 * Run: `node scripts/generate-page-heroes.mjs`         (all published pages)
 *      `node scripts/generate-page-heroes.mjs --only-missing`
 */
import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { readFileSync, mkdirSync, writeFileSync, statSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const HEROES_DIR = resolve(__dirname, '../public/heroes')
mkdirSync(HEROES_DIR, { recursive: true })

const env = (() => { try { return readFileSync('.env.local', 'utf8') } catch { return '' } })()
  .split('\n').filter(l => l && !l.startsWith('#') && l.includes('='))
  .reduce((acc, l) => { const [k, ...rest] = l.split('='); acc[k.trim()] = rest.join('=').trim().replace(/^"|"$/g, ''); return acc }, {})
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || 'https://ohobjnbsybdxntaewqdi.supabase.co'
const SUPABASE_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_L9dqQRDBn1bISOu8Y4C0wg_KYZ1NJEC'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })

// Per-category palette — matches CATEGORY_META in lib/corporatePages.js
const PALETTE = {
  salt:         { from: '#0c4a6e', to: '#1d5fa1', accent: '#0ea5e9', motif: 'lattice' },
  fertilizers:  { from: '#14532d', to: '#15803d', accent: '#22c55e', motif: 'rays' },
  chemicals:    { from: '#831843', to: '#be185d', accent: '#ec4899', motif: 'hex' },
  construction: { from: '#7c2d12', to: '#c2410c', accent: '#f59e0b', motif: 'strata' },
  agro:         { from: '#064e3b', to: '#047857', accent: '#10b981', motif: 'rays' },
  minerals:     { from: '#334155', to: '#475569', accent: '#94a3b8', motif: 'lattice' },
  metals:       { from: '#27272a', to: '#3f3f46', accent: '#71717a', motif: 'strata' },
  services:     { from: '#0f766e', to: '#0d9488', accent: '#14b8a6', motif: 'rings' },
  applications: { from: '#5b21b6', to: '#7c3aed', accent: '#a855f7', motif: 'orbit' },
  case_studies: { from: '#3f3f46', to: '#52525b', accent: '#f59e0b', motif: 'rings' },
  blog:         { from: '#9f1239', to: '#be123c', accent: '#f43f5e', motif: 'orbit' },
  markets:      { from: '#1e3a5f', to: '#0f4c81', accent: '#38bdf8', motif: 'orbit' },
  ports:        { from: '#0c4a6e', to: '#075985', accent: '#0ea5e9', motif: 'rings' },
  standards:    { from: '#1e1b4b', to: '#3730a3', accent: '#818cf8', motif: 'dial' },
  trade_tools:  { from: '#312e81', to: '#4338ca', accent: '#818cf8', motif: 'dial' },
  partners:     { from: '#1e3a8a', to: '#1d4ed8', accent: '#3b82f6', motif: 'rings' },
  about:        { from: '#1e1b4b', to: '#312e81', accent: '#6366f1', motif: 'compass' },
  products:     { from: '#581c87', to: '#7e22ce', accent: '#a855f7', motif: 'lattice' },
  wholesale:    { from: '#0c4a6e', to: '#1d5fa1', accent: '#0ea5e9', motif: 'lattice' },
  compare:      { from: '#1e3a5f', to: '#0f4c81', accent: '#38bdf8', motif: 'dial' },
  rfq:          { from: '#9a3412', to: '#c2410c', accent: '#fb923c', motif: 'compass' },
  home:         { from: '#0f1f3a', to: '#1d5fa1', accent: '#FF6321', motif: 'compass' },
  other:        { from: '#1f2937', to: '#374151', accent: '#FF6321', motif: 'compass' },
}

const W = 1200, H = 675

/** Deterministic pseudo-random from a string — same slug, same figure. */
function seeded(str) {
  let h = 2166136261
  for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0 }
  return () => { h = (Math.imul(h, 1664525) + 1013904223) >>> 0; return h / 4294967296 }
}

/** One large hairline figure, centred at (cx, cy), radius r, rotated deg. */
function figure(kind, cx, cy, r, deg, accent) {
  const g = (inner) => `<g transform="translate(${cx} ${cy}) rotate(${deg})" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.55">${inner}</g>`
  const c = r
  switch (kind) {
    case 'lattice': { // cubic halite wireframe
      const d = c * 0.45
      const sq = (ox, oy) => `<rect x="${-c/2 + ox}" y="${-c/2 + oy}" width="${c}" height="${c}"/>`
      const link = [[-c/2, -c/2], [c/2, -c/2], [c/2, c/2], [-c/2, c/2]].map(([x, y]) => `<line x1="${x}" y1="${y}" x2="${x + d}" y2="${y - d}"/>`).join('')
      return g(sq(0, 0) + sq(d, -d) + link + `<circle r="4" cx="${-c/2}" cy="${-c/2}" fill="${accent}"/><circle r="4" cx="${c/2 + d}" cy="${c/2 - d}" fill="${accent}"/>`)
    }
    case 'hex': {
      const pts = n => Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 3 * i; return `${(n * Math.cos(a)).toFixed(1)},${(n * Math.sin(a)).toFixed(1)}` }).join(' ')
      return g(`<polygon points="${pts(c)}"/><polygon points="${pts(c * 0.62)}"/>` + Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 3 * i; return `<line x1="${(c * 0.62 * Math.cos(a)).toFixed(1)}" y1="${(c * 0.62 * Math.sin(a)).toFixed(1)}" x2="${(c * Math.cos(a)).toFixed(1)}" y2="${(c * Math.sin(a)).toFixed(1)}"/>` }).join('') + `<circle r="5" cx="${c}" cy="0" fill="${accent}"/>`)
    }
    case 'strata': {
      return g(Array.from({ length: 6 }, (_, i) => { const rr = c * (0.35 + i * 0.13); return `<path d="M ${-rr} 0 A ${rr} ${rr * 0.55} 0 0 1 ${rr} 0"/>` }).join(''))
    }
    case 'rays': {
      return g(Array.from({ length: 16 }, (_, i) => { const a = Math.PI * 2 / 16 * i; return `<line x1="${(c * 0.35 * Math.cos(a)).toFixed(1)}" y1="${(c * 0.35 * Math.sin(a)).toFixed(1)}" x2="${(c * Math.cos(a)).toFixed(1)}" y2="${(c * Math.sin(a)).toFixed(1)}"/>` }).join('') + `<circle r="${c * 0.28}"/>`)
    }
    case 'rings': {
      return g(`<circle r="${c}"/><circle r="${c * 0.72}" stroke-dasharray="6 10"/><circle r="${c * 0.44}"/><line x1="${-c}" y1="0" x2="${c}" y2="0"/><line x1="0" y1="${-c}" x2="0" y2="${c}"/><circle r="5" cx="${c * 0.72}" cy="0" fill="${accent}"/>`)
    }
    case 'orbit': {
      return g(`<ellipse rx="${c}" ry="${c * 0.38}"/><ellipse rx="${c}" ry="${c * 0.38}" transform="rotate(60)"/><ellipse rx="${c}" ry="${c * 0.38}" transform="rotate(-60)"/><circle r="${c * 0.12}"/><circle r="5" cx="${c}" cy="0" fill="${accent}"/>`)
    }
    case 'dial': {
      return g(`<circle r="${c}"/>` + Array.from({ length: 36 }, (_, i) => { const a = Math.PI * 2 / 36 * i; const l = i % 3 === 0 ? 0.86 : 0.93; return `<line x1="${(c * l * Math.cos(a)).toFixed(1)}" y1="${(c * l * Math.sin(a)).toFixed(1)}" x2="${(c * Math.cos(a)).toFixed(1)}" y2="${(c * Math.sin(a)).toFixed(1)}"/>` }).join('') + `<line x1="0" y1="0" x2="${c * 0.8}" y2="0" stroke-width="2.5"/>`)
    }
    default: { // compass
      return g(`<circle r="${c}" stroke-dasharray="4 8"/><circle r="${c * 0.66}"/><circle r="${c * 0.3}"/><line x1="${-c}" y1="0" x2="${c}" y2="0"/><line x1="0" y1="${-c}" x2="0" y2="${c}"/><line x1="${-c * 0.7}" y1="${-c * 0.7}" x2="${c * 0.7}" y2="${c * 0.7}" stroke-dasharray="2 6"/><line x1="${-c * 0.7}" y1="${c * 0.7}" x2="${c * 0.7}" y2="${-c * 0.7}" stroke-dasharray="2 6"/>`)
    }
  }
}

function buildSvg(page) {
  const p = PALETTE[page.category] || PALETTE.other
  const rnd = seeded(page.path || 'home')
  const cx = Math.round(W * (0.6 + rnd() * 0.3))
  const cy = Math.round(H * (0.25 + rnd() * 0.5))
  const r = Math.round(H * (0.32 + rnd() * 0.18))
  const deg = Math.round(rnd() * 90 - 45)
  const glowX = Math.round(20 + rnd() * 60)
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.from}"/><stop offset="100%" stop-color="${p.to}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${glowX}%" cy="0%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.16"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g opacity="0.07" fill="none" stroke="#ffffff" stroke-width="1">
    ${Array.from({ length: 25 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${H}"/>`).join('')}
    ${Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="${W}" y2="${i * 50}"/>`).join('')}
  </g>
  ${figure(p.motif, cx, cy, r, deg, p.accent)}
  <rect x="0" y="0" width="${W}" height="5" fill="${p.accent}" opacity="0.9"/>
</svg>`
}

function pathToSlug(path) {
  return (path || '/').replace(/^\//, '').replace(/\//g, '-').replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'home'
}

async function main() {
  const onlyMissing = process.argv.includes('--only-missing')
  let q = supabase.from('egg_corporate_pages').select('id, path, category, hero_photo_url').eq('is_published', true).order('path').limit(1000)
  if (onlyMissing) q = q.is('hero_photo_url', null)
  const { data: pages, error } = await q
  if (error) throw error
  // Only rows whose hero is one of our generated files (or missing). Real
  // photographs (Supabase storage URLs) are never touched.
  const limitArg = process.argv.indexOf("--limit")
  let targets = pages.filter(p => !p.hero_photo_url || p.hero_photo_url.startsWith("/heroes/"))
  if (limitArg > -1) targets = targets.filter((_, i) => i % 97 === 0).slice(0, Number(process.argv[limitArg + 1]) || 4)
  console.log(`→ Generating textless heroes for ${targets.length} of ${pages.length} pages`)
  let made = 0, failed = 0, total = 0
  for (const p of targets) {
    try {
      const slug = p.hero_photo_url ? p.hero_photo_url.replace(/^\/heroes\//, '').replace(/\.png$/, '') : pathToSlug(p.path)
      const png = await sharp(Buffer.from(buildSvg(p))).png({ palette: true, colours: 64, dither: 0.4, compressionLevel: 9, effort: 8 }).toBuffer()
      const out = join(HEROES_DIR, `${slug}.png`)
      writeFileSync(out, png)
      total += statSync(out).size
      made++
      if (made % 100 === 0) console.log(`   …${made}/${targets.length}`)
    } catch (e) { failed++; console.warn(`   ✗ ${p.path}: ${e.message || e}`) }
  }
  console.log(`✓ Wrote ${made} heroes (${(total / 1024 / 1024).toFixed(1)} MB, avg ${Math.round(total / Math.max(made, 1) / 1024)} KB). Failed: ${failed}`)
}
main().catch(e => { console.error(e); process.exit(1) })
