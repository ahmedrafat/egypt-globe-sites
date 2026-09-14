/**
 * Salt division — shared reference data for the salt hub (/products/salt)
 * and the two source pages (/products/salt/rock-salt, /products/salt/sea-salt).
 * One source of truth so the hub's comparison table and each source page's
 * "at a glance" table can never disagree.
 */
import { APPLICATIONS } from './corporatePages'

export const TEAL = '#0fb5a5'
export const TEAL_TEXT = '#087a70'
export const GOLD = '#b8862b'
export const GOLD_TEXT = '#8a6d3b'

export const GRADES = [
  { id: 'de-icing-grade',       label: 'Bulk De-icing / Road Salt', href: '/products/salt/de-icing-grade',       icon: 'snow' },
  { id: 'industrial-grade',     label: 'Industrial / Chlor-Alkali', href: '/products/salt/industrial-grade',     icon: 'factory' },
  { id: 'food-grade',           label: 'Food Grade Salt',           href: '/products/salt/food-grade',           icon: 'leaf' },
  { id: 'pharmaceutical-grade', label: 'Pharmaceutical Salt',       href: '/products/salt/pharmaceutical-grade', icon: 'pill' },
  { id: 'pool-grade',           label: 'Water Treatment & Pool',    href: '/products/salt/pool-grade',           icon: 'drop' },
  { id: 'cosmetic-grade',       label: 'Cosmetic & Spa Salt',       href: '/products/salt/cosmetic-grade',       icon: 'sparkle' },
  { id: 'aquaculture-grade',    label: 'Aquaculture Salt',          href: '/products/salt/aquaculture-grade',    icon: 'wave' },
  { id: 'agricultural-grade',   label: 'Agricultural Salt',         href: '/products/salt/agricultural-grade',   icon: 'wheat' },
]

// Siwa Oasis crystalline rock salt vs Sinai sea salt — the differentiation
// buyers tender against. Values are contractual limits from the SKU catalogue.
// Column 1 = rock, column 2 = sea.
export const COMPARE = [
  ['Source',               'Siwa Oasis & Qattara Depression halite beds (mined)', 'North Sinai (Bardawil lagoon, El-Arish) & Red Sea pans at Ain Sokhna (solar-evaporated)'],
  ['NaCl, dry basis',      '≥ 97.00 % guaranteed on every grade; ≥ 99.5 % double-washed / vacuum for pharma', 'Raw 94–97 % · washed 97.5–98 % · double-washed ≥ 99 %'],
  ['Ca²⁺ / Mg²⁺ / SO₄²⁻',  '≤ 0.40 % / ≤ 0.40 % / ≤ 0.80 %', '≤ 0.40 % / ≤ 0.40 % / ≤ 0.80 % (washed); higher on raw industrial'],
  ['Water insolubles',     '≤ 0.50 %', '≤ 0.50 % washed · ≤ 1.0 % raw'],
  ['Moisture',             '≤ 1.5 % natural · ≤ 0.5 % kiln-dried (0.25 % on request)', 'Type 1 kiln-dried ≤ 1.5 % · Type 2 natural 3–4 %'],
  ['Sieve profiles',       '0/2 · 0/4 · 0/6.3 · 2/8 · 10/40 mm (ISO 13320 / sieve, per lot)', '0/2 · 0/4 · 0/6.3 · 2/8 · 0.5/10 mm (per lot)'],
  ['Governing standards',  'EN 16811-1 Grades A/B/C · ASTM D632 · BS 3247 · GOST 13830 · Codex STAN 150 · USP / BP / EP', 'EN 16811-1 Type 1 / Type 2 · ASTM D632 / AASHTO M-143 · SS-EN 16811-1 · NSF/ANSI 60 · ISO 22000'],
  ['Primary grades',       'Food · pharmaceutical · cosmetic · chlor-alkali · drilling · de-icing', 'De-icing · industrial · water treatment · pool · aquaculture · agricultural'],
  ['Loading ports',        'El Dekheila (EGEDK) · Alexandria (EGALY) · Damietta (EGDAM) · Ain Sokhna (EGSOK)', 'Al-Arish (EGEAR) · Port Said East (EGPSE) · Damietta (EGDAM) · Ain Sokhna (EGSOK)'],
  ['Source-to-berth',      '< 12 hours by road', '< 12 hours by road'],
]

export const LOGISTICS = [
  ['MOQ — containerised (FCL)',      '240 MT (10 × 20′ FCL, ~24 MT per box) · 25 MT trial lots for food, pharma and cosmetic grades'],
  ['MOQ — break-bulk vessel',        '2,000 MT Handysize part-cargo · up to 65,000 MT Panamax; annual offtake contracts available'],
  ['Packing',                        'Loose bulk · 1 / 1.25 / 1.5 MT FIBC (PE liner for food, pharma and kiln-dried grades) · 50 kg / 25 kg PP, PE or kraft bags · bag-in-jumbo for bulk vessels · OEM print'],
  ['Incoterms',                      'FOB · CFR · CIF (DAP / DDP on request)'],
  ['Lead time',                      '1–2 weeks from L/C or advance for stock grades; 3–4 weeks for kiln-dried or custom gradings'],
  ['Independent inspection protocol','TÜV Austria (EU / GCC) · SGS · Intertek (ASTM / BS) · Bureau Veritas — pre-shipment sampling per ISO 2479 / EN 16811-1 Annex B, NaCl, moisture and sieve witness tests, draft survey on bulk vessels, sealed retained samples held 90 days'],
  ['Internal QA gate',               'Mine-site or saltworks lab on every production lot; port laboratory re-test (NaCl, Ca, Mg, SO₄, insolubles, moisture, sieve) on every shipment; Certificate of Analysis issued before the Bill of Lading; any out-of-spec lot rejected at the port'],
  ['Documents',                      'Commercial Invoice · Packing List · B/L · Certificate of Origin (EUR.1 / PAFTA / COMESA / AfCFTA) · CoA · Halal / ISO 22000 certificates for food grades · SDS'],
  ['HS code',                        '2501.00 (national subheading per destination tariff; EU / UK: 2501.00.91 salt suitable for human consumption)'],
]

const port = (name, code, href) => ({ name, code, href })

/** The two Egyptian salt sources. `col` indexes the COMPARE table. */
export const SOURCES = {
  rock: {
    key: 'rock', col: 1, other: 'sea',
    path: '/products/salt/rock-salt',
    label: 'Rock Salt', longLabel: 'Siwa Oasis Crystalline Rock Salt',
    headline: 'Egyptian rock salt —', headlineTail: 'Siwa Oasis & Qattara Depression halite.',
    icon: 'pickaxe', tone: GOLD, toneText: GOLD_TEXT,
    eyebrow: 'Source 2 · high-purity chemical grades',
    nacl: '≥ 97 %',
    banner: '/banners/salt-rock.jpg',
    summary: 'Mined from Siwa Oasis and the Qattara Depression — halite deposits formed 30+ million years ago, free of marine contaminants. Guaranteed minimum 97.00 % NaCl on every grade, tested at the mine-site laboratory on every production lot and re-tested at the port.',
    ports: [port('El Dekheila', 'EGEDK', '/ports/el-dekheila-salt'), port('Alexandria', 'EGALY', '/ports/alexandria-salt'), port('Damietta', 'EGDAM', '/ports/damietta-salt'), port('Ain Sokhna', 'EGSOK', '/ports/ain-sokhna-salt')],
    bestFor: [
      'Chlor-alkali, PVC and soda-ash feedstock — low Ca / Mg / SO₄',
      'Food-grade and pharmaceutical NaCl (USP / BP / EP after refining)',
      'De-icing road salt to EN 16811-1 Grade A / B / C, ASTM D632, BS 3247, GOST 13830',
      'Drilling-mud weighting, oil & gas completion brines',
      'Leather tanning, textile dyeing (low iron) and livestock lick blocks',
    ],
  },
  sea: {
    key: 'sea', col: 2, other: 'rock',
    path: '/products/salt/sea-salt',
    label: 'Sea Salt', longLabel: 'Sinai Sea Salt',
    headline: 'Egyptian sea salt —', headlineTail: 'North Sinai & Red Sea solar salt.',
    icon: 'wave', tone: TEAL, toneText: TEAL_TEXT,
    eyebrow: 'Source 1 · industrial & de-icing scale',
    nacl: '94–99+ %',
    banner: '/banners/salt-sea.jpg',
    summary: 'Solar-evaporated from North Sinai (El-Arish / Bardawil) and the Red Sea coast at Ain Sokhna. Raw 94–97 % NaCl, washed 97.5–98 % and double-washed ≥ 99 %, screened per lot to EN 16811-1 Type 1 / Type 2, ASTM D632 and BS 3247 gradings with moisture held to the tender tolerance.',
    ports: [port('Al-Arish', 'EGEAR', '/ports/al-arish-salt'), port('Port Said East', 'EGPSE', '/ports/port-said-east-salt'), port('Damietta', 'EGDAM', '/ports/damietta-salt'), port('Ain Sokhna', 'EGSOK', '/ports/ain-sokhna-salt')],
    bestFor: [
      'De-icing and road salt — EN 16811-1 Type 1 / 2, ASTM D632, BS 3247, SS-EN, GOST',
      'Industrial bulk — chlor-alkali feed, water softening, ion exchange',
      'Pool and water-treatment salt (NSF/ANSI 60)',
      'Aquaculture and fish curing / food preservation',
      'Food-grade washed sea salt (ISO 22000 / HACCP / Halal)',
    ],
  },
}

/** High-level APPLICATIONS served by a set of salt SKUs (via APPLICATIONS.matches). */
export function applicationsFor(items) {
  const tags = new Set()
  for (const p of items || []) for (const a of (p.applications || [])) tags.add(a)
  return APPLICATIONS.filter(app => [app.id, ...(app.matches || [])].some(t => tags.has(t)))
}

/** Grade hubs present in a set of salt SKUs, with a SKU count each. */
export function gradesFor(items) {
  const count = {}
  for (const p of items || []) {
    const g = (p.path || '').split('/')[3]
    if (g) count[g] = (count[g] || 0) + 1
  }
  return GRADES.filter(g => count[g.id]).map(g => ({ ...g, count: count[g.id] }))
}
