/**
 * lib/heroesManifest.json — the slugs that have a generated card image in
 * public/heroes/. cardUrl() uses it so a page without one (anything published
 * after the last hero run) falls back to its banner instead of a 404.
 * Runs automatically before every build (package.json "prebuild").
 */
import { readdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const slugs = readdirSync(join(root, 'public/heroes')).filter(f => f.endsWith('.png')).map(f => f.slice(0, -4)).sort()
writeFileSync(join(root, 'lib/heroesManifest.json'), JSON.stringify(slugs) + '\n')
console.log(`lib/heroesManifest.json — ${slugs.length} card images`)
// Same for the social share cards in public/ogs/ (used by app/[...path]/page.jsx).
const ogs = readdirSync(join(root, 'public/ogs')).filter(f => f.endsWith('.png')).map(f => f.slice(0, -4)).sort()
writeFileSync(join(root, 'lib/ogsManifest.json'), JSON.stringify(ogs) + '\n')
console.log(`lib/ogsManifest.json — ${ogs.length} share cards`)
