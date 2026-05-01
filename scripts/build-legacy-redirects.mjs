// Drop 123 — build legacy → new URL 301 redirect map (no DB calls)
import { readFileSync, writeFileSync } from 'node:fs'

const legacy = readFileSync('./scripts/legacy-paths.txt', 'utf8').split('\n').filter(Boolean)
const newPaths = new Set(readFileSync('./scripts/new-paths.txt', 'utf8').split('\n').filter(Boolean))

// Hand-built rename rules (highest-precedence). Order matters — first match wins.
const RENAME_RULES = [
  ['/agro-products', '/products/agro'],
  ['/all-products', '/products'],
  ['/raw-materials', '/products'],
  ['/agriculture', '/products/agro'],
  ['/food', '/products/agro'],
  ['/fertilizers', '/products/fertilizers'],
  ['/chemicals', '/products/chemicals'],
  ['/minerals', '/products/minerals'],
  ['/salt', '/products/salt'],
  ['/building-materials', '/products/construction'],
  ['/mining-and-extraction', '/products/minerals'],
  ['/machinery-equipment', '/products'],
  ['/consumables', '/products'],
  ['/corn-exports', '/products/agro/grains'],
  ['/wheat-exports', '/products/agro/grains'],
  ['/sugar-exports', '/products/agro/sugar'],
  ['/orange-exports', '/products/agro/fresh-produce'],
  ['/potato-exports', '/products/agro/fresh-produce'],
  ['/logistics-services', '/services/logistics'],
  ['/logistics-and-export', '/services/logistics'],
  ['/international-trade-and-amp-sourcing', '/services'],
  ['/global-trade-strategies', '/services'],
  ['/industries-overview', '/applications'],
  ['/about/company-overview', '/about'],
  ['/about/operations-logistics', '/services/logistics'],
  ['/about/awards-certifications', '/about/quality-compliance'],
  ['/about/pelot-group', '/partners/pelot/globe'],
  ['/about/pelot-globe', '/partners/pelot/globe'],
  ['/about/pelot-slovenia', '/partners/pelot/slovenia'],
  ['/about/values', '/about/mission-vision'],
  ['/investor-relations', '/investors'],
  ['/investment-and-amp-trade-opportunities', '/investors'],
  ['/why-invest-in', '/investors'],
  ['/corporate-responsibility-and-amp-impact', '/about/quality-compliance'],
  ['/corporate-social-responsibility', '/about/quality-compliance'],
  ['/sustainability-and-environmental-impact', '/about/quality-compliance'],
  ['/by-products-waste-management', '/about/quality-compliance'],
  ['/customer-success-stories', '/case-studies'],
  ['/news-and-insights', '/industry-insights'],
  ['/shop-by-category', '/products'],
  ['/legal', '/cookies-policy'],
  ['/privacy-policy', '/cookies-policy'],
  ['/terms-and-conditions', '/cookies-policy'],
  ['/accessibility-statement', '/about'],
  ['/home', '/'],
]

const AGRO_SUB_RENAMES = {
  'edible-oils':              '/products/agro/edible-oils',
  'fresh-fruits':             '/products/agro/fresh-produce',
  'fresh-vegetables':         '/products/agro/fresh-produce',
  'frozen-foods':             '/products/agro/processed-foods',
  'grains-legumes':           '/products/agro/grains',
  'honey-natural-products':   '/products/agro/processed-foods',
  'juices-concentrates':      '/products/agro/processed-foods',
  'processed-food-products':  '/products/agro/processed-foods',
}

const CHEM_GROUP_RENAMES = {
  'acids':            '/products/chemicals/solvents-and-acids',
  'alkalis-salts':    '/products/chemicals/industrial-chemicals',
  'solvents':         '/products/chemicals/solvents-and-acids',
  'water-treatment':  '/products/chemicals/industrial-chemicals',
}

function mapPath(legacyPath) {
  if (newPaths.has(legacyPath)) return null

  for (const [from, to] of RENAME_RULES) {
    if (legacyPath === from) return to
    if (legacyPath.startsWith(from + '/')) {
      const tail = legacyPath.slice(from.length)
      const candidate = to + tail
      if (newPaths.has(candidate)) return candidate
    }
  }

  if (legacyPath.startsWith('/agro-products/')) {
    const seg = legacyPath.split('/')[2]
    if (AGRO_SUB_RENAMES[seg]) return AGRO_SUB_RENAMES[seg]
    return '/products/agro'
  }

  const chemMatch = legacyPath.match(/^\/products\/chemicals\/([a-z-]+)/)
  if (chemMatch) {
    if (CHEM_GROUP_RENAMES[chemMatch[1]]) return CHEM_GROUP_RENAMES[chemMatch[1]]
    return '/products/chemicals'
  }

  if (legacyPath.startsWith('/salt/') || legacyPath.startsWith('/products/salt/')) {
    return '/products/salt'
  }

  const segs = legacyPath.split('/').filter(Boolean)
  if (segs[0] === 'products' && segs.length >= 3) {
    const subPath = '/products/' + segs[1] + '/' + segs[2]
    if (newPaths.has(subPath)) return subPath
    const divPath = '/products/' + segs[1]
    if (newPaths.has(divPath)) return divPath
  }
  if (segs[0] === 'products' && segs.length === 2) {
    const divPath = '/products/' + segs[1]
    if (newPaths.has(divPath)) return divPath
    return '/products'
  }

  if (legacyPath.startsWith('/blog/')) return '/case-studies'
  if (legacyPath.startsWith('/about/')) return '/about'
  if (legacyPath.startsWith('/investor') || legacyPath.startsWith('/investment')) return '/investors'

  if (segs[0] === 'agriculture' || segs[0] === 'food') return '/products/agro'
  if (segs[0] === 'fertilizers') return '/products/fertilizers'
  if (segs[0] === 'chemicals') return '/products/chemicals'
  if (segs[0] === 'minerals') return '/products/minerals'
  if (segs[0] === 'salt') return '/products/salt'
  if (segs[0] === 'building-materials') return '/products/construction'

  return '/'  // last-resort soft fallback
}

const redirects = []
let directHits = 0
let mapped = 0
let fallback = 0

for (const lp of legacy) {
  const target = mapPath(lp)
  if (target === null) { directHits++; continue }
  if (target === lp) { directHits++; continue }
  redirects.push({ source: lp, destination: target, permanent: true })
  if (target === '/') fallback++
  else mapped++
}

console.log(`legacy paths:                       ${legacy.length}`)
console.log(`new paths in seed list:             ${newPaths.size}`)
console.log(`Direct hits (no redirect needed):   ${directHits}`)
console.log(`Mapped via rules:                   ${mapped}`)
console.log(`Soft fallback to / (no equivalent): ${fallback}`)
console.log(`Total redirect rules generated:     ${redirects.length}`)

writeFileSync('./lib/legacy-redirects.json', JSON.stringify(redirects, null, 2))
console.log('\n✓ Wrote ./lib/legacy-redirects.json')

console.log('\n--- Sample first 20 mappings:')
for (const r of redirects.filter(r => r.destination !== '/').slice(0, 20)) {
  console.log(`  ${r.source.padEnd(60)}  →  ${r.destination}`)
}
console.log('\n--- Soft-fallback (sent to /):')
for (const r of redirects.filter(r => r.destination === '/').slice(0, 10)) {
  console.log(`  ${r.source}`)
}
