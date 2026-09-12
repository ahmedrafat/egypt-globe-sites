/**
 * Banner manifest — public/banners/index.json.
 *
 * The CMS admin (EGG OS → /websites) reads this to show the commissioned
 * banner library, so an editor can pick a hero background instead of typing
 * a path or re-uploading art that already ships with the site.
 *
 * Run after adding banner art: `node scripts/generate-banner-manifest.mjs`
 */
import { readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = resolve(dirname(fileURLToPath(import.meta.url)), '../public/banners')
const title = s => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  .replace(/\bRfq\b/, 'RFQ').replace(/\bQc\b/, 'QC').replace(/\bHq\b/, 'HQ')

const list = (sub, group) => readdirSync(join(dir, sub))
  .filter(f => /\.(jpe?g|png|webp|avif)$/i.test(f))
  .sort()
  .map(f => ({
    url: `/banners/${sub ? sub + '/' : ''}${f}`,
    label: title(f.replace(/\.[a-z]+$/i, '')),
    group,
    bytes: statSync(join(dir, sub, f)).size,
  }))

const banners = [...list('', 'Section banners'), ...list('topics', 'Topic banners')]
writeFileSync(join(dir, 'index.json'), JSON.stringify({ generated: new Date().toISOString(), count: banners.length, banners }, null, 2) + '\n')
console.log(`banners/index.json — ${banners.length} images`)
