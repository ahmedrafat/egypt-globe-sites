/**
 * SkuRelatedLinks — Drop 168. Per-SKU internal-linking block.
 *
 * Surfaces 3-5 related landings on every salt SKU page:
 *   • Application landing (deicing-sea-salt / chlor-alkali-salt / etc.)
 *   • Wholesale hub (sea-salt / rock-salt / deicing-salt / sodium-chloride)
 *   • Standards page (en-16811-1 / bs-3247 / astm-d632 / gost-13830 / etc.)
 *   • Port page (damietta-salt / alexandria-salt / port-said-east-salt)
 *   • Buyer's-guide blog (matched by application family)
 *
 * Drives ranking equity into the new landing cluster + helps Google
 * understand the SKU-page ↔ application-page ↔ standard-page taxonomy.
 *
 * Inputs are inferred from the SKU's name + specs + page_path so it
 * works without per-SKU configuration.
 */

import Link from 'next/link'
import Icon from './ui/Icon'

// Match SKU name to application landing
function appLanding(name) {
  const n = (name || '').toLowerCase()
  if (n.includes('deicing') && n.includes('sea')) return { path: '/applications/deicing-sea-salt', label: 'Bulk Sea Salt for Deicing' }
  if (n.includes('deicing') && n.includes('rock')) return { path: '/applications/deicing-rock-salt', label: 'Bulk Rock Salt for Deicing' }
  if (n.includes('chlor-alkali') || n.includes('pca'))    return { path: '/applications/chlor-alkali-salt', label: 'Bulk Salt for Chlor-Alkali' }
  if (n.includes('water') || n.includes('softener') || n.includes('pool') || n.includes('aquaculture')) return { path: '/applications/water-treatment-salt', label: 'Bulk Salt for Water Treatment' }
  if (n.includes('drilling') || n.includes('workover') || n.includes('oil')) return { path: '/applications/oil-gas-salt', label: 'Bulk Salt for Oil & Gas' }
  if (n.includes('leather') || n.includes('tanning'))     return { path: '/applications/leather-tanning-salt', label: 'Bulk Salt for Leather Tanning' }
  if (n.includes('textile') || n.includes('dyeing'))      return { path: '/applications/textile-dyeing-salt', label: 'Bulk Salt for Textile Dyeing' }
  if (n.includes('road') || n.includes('highway'))        return { path: '/applications/road-salt', label: 'Egyptian Road Salt' }
  return null
}

// Match SKU name to wholesale hub
function wholesaleHub(name, sourceType) {
  const n = (name || '').toLowerCase()
  if (n.includes('deicing'))  return { path: '/wholesale/deicing-salt', label: 'Bulk Deicing Salt Suppliers' }
  if (n.includes('chlor') || n.includes('chemical') || n.includes('pvc')) return { path: '/wholesale/sodium-chloride', label: 'Bulk Sodium Chloride Suppliers' }
  if (sourceType === 'Sea Salt')  return { path: '/wholesale/sea-salt',  label: 'Bulk Sea Salt Wholesale' }
  if (sourceType === 'Rock Salt') return { path: '/wholesale/rock-salt', label: 'Bulk Rock Salt Wholesale' }
  return null
}

// Match SKU name to standards page
function standardsPage(name) {
  const n = (name || '').toLowerCase()
  if (n.includes('en 16811') || n.includes('en-16811') || n.includes('grade a') || n.includes('grade b') || n.includes('grade c')) return { path: '/standards/en-16811-1', label: 'EN 16811-1 (EU Deicing)' }
  if (n.includes('bs 3247') || n.includes('uk highway')) return { path: '/standards/bs-3247', label: 'BS 3247:2011 (UK Highway)' }
  if (n.includes('astm d632') || n.includes('us/canada') || n.includes('aashto')) return { path: '/standards/astm-d632', label: 'ASTM D632 / AASHTO M-143 (US/Canada)' }
  if (n.includes('ss-en') || n.includes('nordic')) return { path: '/standards/ss-en-16811', label: 'SS-EN 16811-1 (Nordic)' }
  if (n.includes('gost') || n.includes('cis')) return { path: '/standards/gost-13830', label: 'GOST 13830 (CIS)' }
  return null
}

// Pick the best port landing for the SKU
function portPage(name, sourceType, loadingPorts = []) {
  const n = (name || '').toLowerCase()
  // North Sinai sea salt → Port Said East
  if (sourceType === 'Sea Salt' && (n.includes('north sinai') || n.includes('bardawil') || (loadingPorts || []).some(p => p.includes('Port Said')))) {
    return { path: '/ports/port-said-east-salt', label: 'FOB Port Said East (EGPSE)' }
  }
  // Rock salt → Alexandria
  if (sourceType === 'Rock Salt' && (loadingPorts || []).some(p => p.includes('Alexandria'))) {
    return { path: '/ports/alexandria-salt', label: 'FOB Alexandria (EGALY)' }
  }
  // Default: Damietta — primary salt port
  return { path: '/ports/damietta-salt', label: 'FOB Damietta (EGDAM)' }
}

// Pick the best blog buyer's guide
function blogGuide(name, sourceType) {
  const n = (name || '').toLowerCase()
  if (n.includes('chlor-alkali') || n.includes('pca')) return { path: '/blog/bulk-salt-chlor-alkali-membrane-cell-spec-supplier-selection', label: "Bulk Salt for Chlor-Alkali — Buyer's Guide" }
  if (n.includes('deicing') && n.includes('en 16811')) return { path: '/blog/en-16811-grade-a-vs-b-vs-c-deicing-salt-explained', label: 'EN 16811-1 Grade A vs B vs C — Explained' }
  if (n.includes('deicing')) return { path: '/blog/bulk-rock-salt-deicing-eu-vs-us-vs-nordic-vs-cis', label: 'Deicing Salt — EU / US / Nordic / CIS Compared' }
  if (n.includes('pre-wetted')) return { path: '/blog/pre-wetted-deicing-salt-when-needed-when-bulk-dry-wins', label: 'Pre-Wetted vs Dry Deicing Salt — When Each Wins' }
  if (sourceType === 'Sea Salt') return { path: '/blog/bulk-egyptian-sea-salt-buyers-guide-2026', label: "Bulk Egyptian Sea Salt — 2026 Buyer's Guide" }
  return { path: '/blog/bulk-egyptian-salt-price-2026-fob-guide', label: 'Bulk Egyptian Salt — 2026 FOB Price Guide' }
}

export default function SkuRelatedLinks({ page, commodity }) {
  if (!page || !page.path?.startsWith('/products/salt/')) return null

  const name = page.title
  const sourceType = page.specs?.source_type || commodity?.specifications?.source_type
  const loadingPorts = page.loading_ports || commodity?.loading_ports || []

  const links = [
    appLanding(name),
    wholesaleHub(name, sourceType),
    standardsPage(name),
    portPage(name, sourceType, loadingPorts),
    blogGuide(name, sourceType),
  ].filter(Boolean)

  if (!links.length) return null

  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 border-t border-[#14161a]/10">
      <div className="egg-panel p-6 sm:p-8">
        <div className="mb-5">
          <h2 className="egg-display text-2xl sm:text-3xl text-[#14161a] mb-1">
            Related — bulk-salt buyer resources
          </h2>
          <p className="text-sm text-[#3f4650]">
            Spec, standard, port, and buyer's guide pages for this SKU.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map((l, i) => (
            <Link
              key={l.path + i}
              href={l.path}
              className="group flex items-center gap-2 rounded-xl bg-white border border-[#14161a]/10 hover:border-[#0fb5a5] hover:shadow-sm transition-all px-4 py-3"
            >
              <span className="flex-shrink-0 inline-flex w-8 h-8 items-center justify-center rounded-lg ring-1 ring-[#14161a]/15 text-[#14161a]"><Icon name={LINK_ICONS[i] || 'arrow'} className="w-4 h-4" /></span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[#7a8290] uppercase tracking-wider mb-0.5">
                  {LINK_LABELS[i] || 'Related'}
                </div>
                <div className="text-sm font-bold text-[#14161a] group-hover:text-[#0b8f84] transition-colors leading-tight truncate">
                  {l.label}
                </div>
              </div>
              <span className="text-[#c9ced6] group-hover:text-[#0b8f84] transition-colors">→</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

const LINK_LABELS = ['Application', 'Wholesale Hub', 'Standard', 'Loading Port', "Buyer's Guide"]
const LINK_ICONS  = ['target', 'doc', 'shield', 'anchor', 'book']
