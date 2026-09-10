#!/usr/bin/env node
/**
 * hero-ingest — turn a generated banner into a site hero.
 *
 * ChatGPT's landscape output is 1536x1024 (3:2), but every hero in
 * public/heroes/ is 1200x675 (16:9). Cropping vertically is safe for this
 * set because the prompts reserve the left 45% of the frame for text, so
 * nothing important sits along the top or bottom edge.
 *
 *   node scripts/hero-ingest.mjs <source> <hero-name> [--gravity centre|north|south]
 *   node scripts/hero-ingest.mjs --batch <dir>       # <file>.png -> heroes/<file>.png
 *
 * Writes public/heroes/<hero-name>.png and reports the size delta. Refuses
 * to overwrite silently: the previous file is kept as <name>.bak.png.
 */
import { createRequire } from 'module'
import { existsSync, renameSync, readdirSync, statSync } from 'fs'
import { basename, extname, join, resolve } from 'path'

const require = createRequire('/Users/egg/egg system/pelotsalt/package.json')
const sharp = require('sharp')

const HEROES = resolve('/Users/egg/egg system/egypt-globe-sites/public/heroes')
const W = 1200
const H = 675
const MAX_KB = 130

const argv = process.argv.slice(2)
if (!argv.length || argv.includes('--help')) {
  console.log(`usage:
  node scripts/hero-ingest.mjs <source-image> <hero-name> [--gravity north|centre|south]
  node scripts/hero-ingest.mjs --batch <directory>

hero-name is the filename without extension, e.g. products, products-salt.`)
  process.exit(0)
}

const gravity = (() => {
  const i = argv.indexOf('--gravity')
  return i === -1 ? 'centre' : argv[i + 1]
})()

async function ingest(src, name) {
  const dest = join(HEROES, `${name}.png`)
  const meta = await sharp(src).metadata()
  const srcKB = (statSync(src).size / 1024).toFixed(0)

  if (existsSync(dest)) renameSync(dest, join(HEROES, `${name}.bak.png`))

  // resize with cover+gravity does the 3:2 -> 16:9 crop in one step
  let buf = await sharp(src)
    .resize(W, H, { fit: 'cover', position: gravity })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer()

  // step the palette down until it fits the weight the other heroes run at
  for (const q of [80, 70, 60, 50]) {
    if (buf.length / 1024 <= MAX_KB) break
    buf = await sharp(src)
      .resize(W, H, { fit: 'cover', position: gravity })
      .png({ compressionLevel: 9, palette: true, quality: q })
      .toBuffer()
  }

  await sharp(buf).toFile(dest)
  const outKB = (buf.length / 1024).toFixed(0)
  const flag = buf.length / 1024 > MAX_KB ? '  (over target, still fine — Next re-encodes to AVIF)' : ''
  console.log(
    `${basename(src)}  ${meta.width}x${meta.height} ${srcKB} KB` +
    `  ->  heroes/${name}.png  ${W}x${H} ${outKB} KB${flag}`
  )
}

if (argv[0] === '--batch') {
  const dir = resolve(argv[1])
  const files = readdirSync(dir).filter(f => /\.(png|jpe?g|webp)$/i.test(f))
  if (!files.length) { console.log('no images in', dir); process.exit(1) }
  for (const f of files) await ingest(join(dir, f), basename(f, extname(f)))
} else {
  await ingest(resolve(argv[0]), argv[1])
}
