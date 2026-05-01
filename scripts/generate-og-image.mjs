// Generates public/og-image.png — 1200x630 OpenGraph card for egypt-globe-sites.
//
// Drop 122 (cutover-blocker): the new build had no fallback OG image, and 349/349
// pages have NULL hero photo, so every link share preview was bare.
//
// Run via `node scripts/generate-og-image.mjs` whenever brand or copy changes.
// Mirrors cement-site (drop 22) + pelotsalt (drop 52) + egg-marketplace (drop 53)
// patterns — sharp's SVG-to-PNG pipeline, no headless browser.

import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/og-image.png')

const W = 1200
const H = 630
const ORANGE = '#FF6321'
const NAVY = '#0f1f3a'
const BLUE = '#1d5fa1'
const WHITE = '#FFFFFF'
const MUTED = '#A1A1AA'

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${NAVY}"/>
      <stop offset="60%" stop-color="${BLUE}"/>
      <stop offset="100%" stop-color="${NAVY}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${ORANGE}"/>
      <stop offset="100%" stop-color="#FF8A4C"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Grid pattern overlay -->
  <g opacity="0.07" fill="none" stroke="${WHITE}" stroke-width="1">
    ${Array.from({ length: 24 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="${H}"/>`).join('')}
    ${Array.from({ length: 13 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="${W}" y2="${i * 50}"/>`).join('')}
  </g>

  <!-- Top orange accent bar -->
  <rect x="0" y="0" width="${W}" height="8" fill="url(#accent)"/>

  <!-- EG brand tile (top-left) -->
  <g transform="translate(80, 80)">
    <rect width="64" height="64" rx="14" fill="${ORANGE}"/>
    <text x="32" y="44" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
          font-size="28" font-weight="900" fill="${WHITE}" text-anchor="middle">EG</text>
  </g>

  <!-- Brand wordmark -->
  <text x="164" y="108" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="700" fill="${WHITE}" letter-spacing="2">EGYPT GLOBE GROUP</text>
  <text x="164" y="132" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="14" font-weight="500" fill="${MUTED}" letter-spacing="1.5">B2B EXPORT TRADING CONGLOMERATE</text>

  <!-- Main headline -->
  <text x="80" y="270" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="64" font-weight="900" fill="${WHITE}" letter-spacing="-2">Egyptian industry,</text>
  <text x="80" y="345" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="64" font-weight="900" fill="${WHITE}" letter-spacing="-2">
    shipped to <tspan fill="${ORANGE}">60+ countries.</tspan>
  </text>

  <!-- Subline -->
  <text x="80" y="405" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="500" fill="${MUTED}">Salt · Cement · Fertilizers · Chemicals · Construction · Agro · Minerals</text>
  <text x="80" y="438" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="22" font-weight="500" fill="${MUTED}">FOB / CIF from 7 Egyptian ports · Quote in 24 hours</text>

  <!-- Division chips strip -->
  <g transform="translate(80, 478)">
    ${[
      ['Salt', 0],
      ['Cement', 110],
      ['Fertilizers', 240],
      ['Chemicals', 410],
      ['Minerals', 570],
      ['Construction', 720],
    ]
      .map(
        ([label, x]) => `
      <g transform="translate(${x}, 0)">
        <rect width="${label.length * 11 + 30}" height="44" rx="22" fill="none" stroke="${ORANGE}" stroke-width="2"/>
        <text x="${(label.length * 11 + 30) / 2}" y="29" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
              font-size="18" font-weight="700" fill="${ORANGE}" text-anchor="middle">${label}</text>
      </g>`
      )
      .join('')}
  </g>

  <!-- Footer call -->
  <text x="80" y="585" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="20" font-weight="600" fill="${WHITE}">egyptglobe.com</text>
  <text x="${W - 80}" y="585" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif"
        font-size="20" font-weight="600" fill="${MUTED}" text-anchor="end">Quote in 24 hours →</text>
</svg>`

const pngBuffer = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer()
writeFileSync(OUT, pngBuffer)
console.log(`✓ Wrote ${OUT} (${(pngBuffer.length / 1024).toFixed(1)} kB)`)
