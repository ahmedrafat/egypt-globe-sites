import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { Fraunces } from 'next/font/google'
import {
  getCaseStudies,
  getSiteSettings,
  getPageByPath,
  PRODUCT_DIVISIONS,
  SERVICE_DIVISIONS,
  APPLICATIONS,
} from '../lib/corporatePages'
import { getCurrentBrand, brandMeta } from '../lib/brand'

/**
 * egyptglobe.com landing — "Quality at the Core" edition (2026-08-23).
 *
 * Server component. The sticky header + corporate footer are rendered by
 * app/layout.js around this page and are NOT touched here. Every product
 * division / service / application / port link below is imported from
 * lib/corporatePages.js (the same source the header + footer read) so the
 * naming can never drift from the navigation.
 *
 * Content model: institutional-reliability positioning. The group is
 * presented as an Egyptian B2B commodity house built around an internal
 * Quality Assurance division since incorporation (2014). The scroll
 * narrative follows one cargo — Siwa rock salt → Sinai sea salt → berth →
 * destination port → quote desk — and the sticky canvas on each step is a
 * DATA PANEL (specification table, comparison table, hairline map, QA
 * verification chain, desk timeline), not an illustration.
 *
 * Vector protocol: no decorative artwork. The only vectors are
 * single-colour 16 px micro-icons (shield / beaker / anchor / document /
 * pin / check) and a hairline monochrome Egypt map whose port nodes are
 * real links. No emoji anywhere on the page.
 *
 * Motion: GSAP 3 + ScrollTrigger loaded from jsDelivr via next/script
 * (afterInteractive). Tailwind is compiled in-project (v4). The page is
 * fully readable with JS disabled: nothing is hidden except the inactive
 * canvas panels, and the first panel is shown by CSS.
 *
 * The "Request a Quote" form POSTs to market_rfqs through the Supabase
 * REST endpoint with the publishable anon key (RLS: anon INSERT only,
 * `Prefer: return=minimal`) using source='egyptglobe-website' — the same
 * source tag the full /rfq form uses, so the existing triage + notify
 * triggers route it exactly like every other website RFQ.
 */

export const dynamic = 'force-dynamic'

// Distinctive high-contrast display serif — the "trading house" gravitas.
const display = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const BASE = 'https://egyptglobe.com'
const GSAP_VERSION = '3.13.0'

export async function generateMetadata() {
  const brandCode = await getCurrentBrand()
  const m = brandMeta(brandCode)
  const isUmbrella = brandCode === 'EGG'
  const title = isUmbrella
    ? 'Egypt Globe Group — Verified Bulk Commodity Exporter, Egypt'
    : `${m.siteName} — Egyptian Commodity Exporter`
  const description = isUmbrella
    ? 'Institutional reliability in bulk commodity exporting. Internal QA division since 2014 — every lot laboratory-verified before B/L. Salt, cement & clinker, fertilizers, chemicals, minerals, agro, metals. FOB / CIF / CFR from 7 Egyptian seaports to 60+ markets. SGS · TÜV Austria · Intertek · BV. Quote in 24h.'
    : 'Egyptian commodity exporter. Quote in 24 hours.'
  const canonical = isUmbrella ? BASE : `https://${m.host}`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website', title, description, url: canonical,
      siteName: isUmbrella ? 'Egypt Globe Group' : m.siteName, locale: 'en_US',
      images: [{ url: `${canonical}/og-image.png`, width: 1200, height: 630, alt: isUmbrella ? 'Egypt Globe Group' : m.siteName }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [`${canonical}/og-image.png`] },
  }
}

/* ─── palette (light) ─────────────────────────────────────────────────── */

const C = {
  ink:        '#14161a', // obsidian text
  body:       '#3f4650', // body copy
  muted:      '#7a8290', // labels / eyebrows
  panel:      '#f6f7f9', // ultra-light gray panels
  teal:       '#0fb5a5', // clear turquoise (decorative)
  tealText:   '#0b8f84', // turquoise for text on white (AA)
  gold:       '#b8862b', // deep gold (text)
  orange:     '#ff6321', // brand CTA
  orangeText: '#d9501a',
  blue:       '#1d5fa1', // nav blue
  ocean:      '#0284c7', // vivid ocean
  oceanText:  '#0369a1',
}

/* ─── monochrome micro-icons (single colour, currentColor) ────────────── */

const ICON_PATHS = {
  shield:   'M12 3l7 3v5c0 4.6-3 8.6-7 10-4-1.4-7-5.4-7-10V6l7-3zM9.3 12.2l1.9 1.9 3.6-3.9',
  beaker:   'M9.5 3h5M10.5 3v6.2L5 18.4A1.8 1.8 0 006.6 21h10.8a1.8 1.8 0 001.6-2.6L13.5 9.2V3M8 15h8',
  anchor:   'M12 3.5a2 2 0 100 4 2 2 0 000-4zM12 7.5V21M5.5 12.5h-2a8.5 8.5 0 0017 0h-2',
  doc:      'M7 3h7l5 5v13H7V3zM14 3v5h5M9.5 13h5M9.5 17h5',
  pin:      'M12 21s-6-5.4-6-10.2a6 6 0 1112 0C18 15.6 12 21 12 21zM12 12.3a1.7 1.7 0 100-3.4 1.7 1.7 0 000 3.4z',
  check:    'M5 12.5l4.5 4.5L19 7.5',
  cube:     'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM12 12l8-4.5M12 12v9M12 12L4 7.5',
  layers:   'M12 3.5l9 4.8-9 4.8-9-4.8 9-4.8zM3 13.3l9 4.8 9-4.8M3 17.1l9 4.8 9-4.8',
  leaf:     'M5 19c0-9.4 6.2-15 15-15 0 8.8-5.6 15-15 15zM5 19l7.5-7.5',
  wheat:    'M12 21V8.5M12 8.5c-2.8 0-4.2-1.9-4.2-4.2 2.3 0 4.2 1.4 4.2 4.2zM12 8.5c2.8 0 4.2-1.9 4.2-4.2-2.3 0-4.2 1.4-4.2 4.2zM12 13.5c-2.8 0-4.2-1.9-4.2-4.2 2.3 0 4.2 1.4 4.2 4.2zM12 13.5c2.8 0 4.2-1.9 4.2-4.2-2.3 0-4.2 1.4-4.2 4.2z',
  gear:     'M12 9a3 3 0 100 6 3 3 0 000-6zM3.5 12h2.2M18.3 12h2.2M12 3.5v2.2M12 18.3v2.2M6 6l1.6 1.6M16.4 16.4L18 18M6 18l1.6-1.6M16.4 7.6L18 6',
  building: 'M4 21V5.5L12 3l8 2.5V21M3 21h18M9 9h1.5M13.5 9H15M9 13h1.5M13.5 13H15M9 17h1.5M13.5 17H15',
  clock:    'M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM12 7.5v5l3 2',
  ship:     'M3 17l2 4h14l2-4M4 17l8-3 8 3M6 13V8h12v5M10 8V5h4v3',
  globe:    'M12 3.5a8.5 8.5 0 100 17 8.5 8.5 0 000-17zM3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17',
  arrow:    'M5 12h14M13 6l6 6-6 6',
}

function Icon({ name, className = 'w-4 h-4', strokeWidth = 1.75 }) {
  const d = ICON_PATHS[name] || ICON_PATHS.check
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

const DIVISION_ICON = {
  salt: 'cube', fertilizers: 'wheat', chemicals: 'beaker', construction: 'building',
  agro: 'leaf', minerals: 'layers', metals: 'gear',
}
const SERVICE_ICON = {
  logistics: 'ship', 'port-services': 'anchor', 'added-value': 'beaker', packing: 'cube',
  distribution: 'globe', inspection: 'shield', documentation: 'doc',
}

/* ─── static data ─────────────────────────────────────────────────────── */

const METRICS = [
  { value: 60,  suffix: '+', label: 'Export markets' },
  { value: 7,   suffix: '',  label: 'Egyptian seaports' },
  { value: 7,   suffix: '',  label: 'Commodity divisions' },
  { value: 100, suffix: '%', label: 'Lots CoA-verified before B/L' },
  { value: 24,  suffix: 'h', label: 'RFQ response SLA' },
]

// "Quality at the Core" — the four non-negotiables, stated once near the top.
const QA_PROTOCOL = [
  { icon: 'shield', t: 'Zero tolerance on specification deviation', b: 'A lot that falls outside its Certificate of Analysis is rejected at the loading port. It is never re-graded, blended down or renegotiated after the fact.' },
  { icon: 'beaker', t: 'Per-lot laboratory verification', b: 'Mine-site and port laboratories test every lot against the contract specification before a Bill of Lading is issued — the CoA ships with the cargo, not after it.' },
  { icon: 'doc',    t: 'Independent third-party inspection', b: 'Pre-shipment sampling and witness testing by TÜV Austria, SGS, Intertek or Bureau Veritas (ISO/IEC 17020 / 17025) at any of seven Egyptian ports.' },
  { icon: 'clock',  t: 'Laycan and grading discipline', b: 'Documented Notice of Readiness and Statement of Facts on every vessel; sieve and laser-diffraction grading verified per lot so the spreader or kiln receives exactly what was contracted.' },
]

const PILLARS = [
  { n: '01', tag: 'Quality Assurance', body: 'An internal QA division has sat at the nucleus of the group since its 2014 incorporation: on-site laboratories at the Siwa Oasis and Qattara Depression mines, port-side QC teams at all seven loading ports, and ISO 9001 / ISO 22000 / HACCP systems across every division. Specification is guaranteed at the port of loading and binding under the sales contract.', href: '/about/quality-compliance', cta: 'Our QA charter' },
  { n: '02', tag: 'Export Operations', body: 'Commodity sourcing, vessel chartering, stevedoring, freight forwarding and the full L/C bank document set — extraction point to buyer warehouse across salt, cement & clinker, fertilizers, chemicals, industrial minerals, agro and metals. One counterparty, seven divisions, seven ports.', href: '/products', cta: 'Our operations' },
  { n: '03', tag: 'Industrial Development', body: 'Processing capacity alongside trading: washing, screening, kiln-drying and blending lines, Egyptian industrial-zone development and greenfield partnerships that build durable, audited supply rather than brokerage spread.', href: '/about', cta: 'About the group' },
  { n: '04', tag: 'Technical Services', body: 'Application testing, new-grade qualification, tender-specification matching and process optimisation — executed with buyers’ technical teams. Every specification is validated in Egyptian facilities before the first container is loaded.', href: '/services', cta: 'Our services' },
]

// Live "trading floor" ticker — ports + commodities + QA tokens.
const TICKER = [
  'DAMIETTA', 'ALEXANDRIA', 'AIN SOKHNA', 'PORT SAID', 'EL DEKHEILA', 'ADABIYA', 'SAFAGA',
  'SEA SALT', 'ROCK SALT', 'CEM I 42.5N', 'CLINKER', 'UREA 46%', 'DAP', 'CAUSTIC SODA',
  'GYPSUM', 'SODA ASH', 'BAUXITE', 'FELDSPAR', 'FOB', 'CIF', 'CFR',
  'COA PER LOT', 'PSI · SGS / TÜV / INTERTEK / BV', 'ISO 17025', 'EN 16811-1', 'EN 197-1', 'ASTM D632',
]

const CERTS = ['ISO 9001', 'ISO 22000', 'EN 197-1', 'HACCP', 'USP / BP', 'GOEIC', 'TÜV AUSTRIA', 'SGS', 'INTERTEK', 'BUREAU VERITAS']

// Salt grade hubs under /products/salt — exact live paths.
const SALT_GRADES = {
  food:       { path: '/products/salt/food-grade',           label: 'Food grade' },
  pharma:     { path: '/products/salt/pharmaceutical-grade', label: 'Pharmaceutical grade' },
  cosmetic:   { path: '/products/salt/cosmetic-grade',       label: 'Cosmetic & spa grade' },
  industrial: { path: '/products/salt/industrial-grade',     label: 'Industrial grade' },
  deicing:    { path: '/products/salt/de-icing-grade',       label: 'De-icing grade' },
  pool:       { path: '/products/salt/pool-grade',           label: 'Pool & water-treatment grade' },
}

// Egyptian loading ports on the logistics map (x/y in the 680×520 map viewBox).
const PORTS = [
  { id: 'alexandria',     code: 'EGALY', name: 'Alexandria',     path: '/ports/alexandria-salt',     x: 295, y: 40,  lx: -8,  ly: -14, anchor: 'end'   },
  { id: 'el-dekheila',    code: 'EGEDK', name: 'El Dekheila',    path: '/ports/el-dekheila-salt',    x: 282, y: 46,  lx: -8,  ly: 18,  anchor: 'end'   },
  { id: 'damietta',       code: 'EGDAM', name: 'Damietta',       path: '/ports/damietta-salt',       x: 390, y: 29,  lx: 0,   ly: -14, anchor: 'middle'},
  { id: 'port-said-east', code: 'EGPSE', name: 'Port Said East', path: '/ports/port-said-east-salt', x: 418, y: 38,  lx: 10,  ly: 22,  anchor: 'start' },
  { id: 'al-arish',       code: 'EGEAR', name: 'Al-Arish',       path: '/ports/al-arish-salt',       x: 490, y: 43,  lx: 10,  ly: -12, anchor: 'start' },
  { id: 'ain-sokhna',     code: 'EGSOK', name: 'Ain Sokhna',     path: '/ports/ain-sokhna-salt',     x: 417, y: 120, lx: -10, ly: 4,   anchor: 'end'   },
]

// Source → port routes (SVG path d). Drawn in by GSAP when the panel activates.
const ROUTES = [
  { from: 'siwa',     d: 'M75 140 Q 190 55 295 40' },
  { from: 'qattara',  d: 'M175 100 Q 235 62 282 46' },
  { from: 'qattara',  d: 'M175 100 Q 300 112 390 31' },
  { from: 'cairo',    d: 'M362 97 L 417 120' },
  { from: 'bardawil', d: 'M462 46 Q 442 26 418 38' },
  { from: 'bardawil', d: 'M462 46 Q 428 16 392 30' },
  { from: 'bardawil', d: 'M462 46 L 490 43' },
]

// Step 01 panel — Siwa Oasis crystalline rock salt: chemical analysis (PS-ROCK-DEIC-A / industrial floor).
const SIWA_ROWS = [
  ['NaCl (dry basis)',  '≥ 97.00 %',         'AOAC 920.179 / ISO 27053'],
  ['Calcium (Ca²⁺)',    '≤ 0.40 %',          'Per EN 16811-1 / ISO 2482'],
  ['Magnesium (Mg²⁺)',  '≤ 0.40 %',          'Per EN 16811-1 / ISO 2482'],
  ['Sulphate (SO₄²⁻)',  '≤ 0.80 %',          'Gravimetric, ISO 2480'],
  ['Water insolubles',  '≤ 0.50 %',          'AOAC 925.45 / EN 1936'],
  ['Moisture, natural', '≤ 1.5 % (typ. 1.0–1.5)', 'ISO 27053'],
  ['Moisture, kiln-dried', '≤ 0.5 % (0.25 % on request)', 'ISO 27053'],
  ['Bulk density',      '950 – 1,200 kg/m³', 'ASTM D7263 / EN 1097-3'],
]

// Step 02 panel — Siwa rock vs Sinai sea salt, the differentiation buyers tender against.
const COMPARE_ROWS = [
  ['NaCl floor',        '≥ 97 % (all grades)',           'raw 94–97 % · washed 97.5–98 % · double-washed ≥ 99 %'],
  ['Moisture',          '≤ 1.5 % natural · ≤ 0.5 % kiln', '≤ 3–4 % natural (Type 2) · ≤ 1.5 % kiln (Type 1)'],
  ['Sieve profiles',    '0/2 · 0/4 · 0/6.3 · 2/8 · 10/40 mm', '0/2 · 0/4 · 0/6.3 · 2/8 · 0.5/10 mm'],
  ['Standards',         'EN 16811-1 A/B/C · ASTM D632 · BS 3247 · GOST 13830', 'EN 16811-1 Type 1/2 · ASTM D632 · AASHTO M-143 · SS-EN 16811-1'],
  ['Primary use',       'Food · pharma · cosmetic · chlor-alkali · de-icing', 'De-icing · industrial · water treatment · pool'],
  ['Loading ports',     'El Dekheila · Alexandria · Damietta · Ain Sokhna', 'Port Said East · Damietta · Al-Arish · Ain Sokhna'],
  ['MOQ',               '240 MT FCL · 2,000–65,000 MT bulk', '240 MT FCL · 2,000–65,000 MT bulk'],
]

// Step 04 panel — the QA verification chain, extraction → destination port.
const QA_CHAIN = [
  ['1', 'Extraction / source',      'Mine-site and pan-side sampling; NaCl, moisture, insolubles on every production lot', 'Mine & saltworks lab · per lot'],
  ['2', 'Processing',               'Washing, screening, kiln-drying verified by sieve / laser diffraction and moisture balance', 'Plant QC · per batch'],
  ['3', 'Port laboratory',          'Full chemical analysis against contract spec; Certificate of Analysis issued before B/L', 'Port QC lab · per shipment'],
  ['4', 'Independent inspection',   'Pre-shipment sampling, draft survey and witness testing; sealed retained samples', 'SGS / TÜV / Intertek / BV · per vessel'],
  ['5', 'Destination acceptance',   'CoA cross-referenced with the buyer’s arrival laboratory; retained samples arbitrate disputes', 'Buyer lab · on discharge'],
]

/* Global export map — Egyptian hub and the destination clusters it serves.
   Coordinates are laid out on the 900x480 arc canvas cropped by the viewBox
   in PanelGlobal. Recovered from the scrollytelling landing (cfc84d7); the
   Quality-at-the-Core rewrite (be002aa) had dropped the whole scene. */
const HUB = { x: 527, y: 160 }
const DESTINATIONS = [
  { x: 461, y: 104, market: 'North Europe',  use: 'chlor-alkali · PVC',   appId: 'industrial_chemistry' },
  { x: 468, y: 66,  market: 'UK & Nordics',  use: 'road management',      appId: 'deicing' },
  { x: 265, y: 133, market: 'North America', use: 'de-icing · ASTM D632', appId: 'deicing' },
  { x: 342, y: 301, market: 'South America', use: 'water treatment',      appId: 'water_treatment' },
  { x: 565, y: 176, market: 'Gulf',          use: 'desalination · water', appId: 'water_treatment' },
  { x: 655, y: 214, market: 'India',         use: 'chlor-alkali plants',  appId: 'industrial_chemistry' },
  { x: 549, y: 251, market: 'East Africa',   use: 'industrial · food',    appId: 'food_processing' },
  { x: 459, y: 223, market: 'West Africa',   use: 'water treatment',      appId: 'water_treatment' },
  { x: 752, y: 157, market: 'Far East',      use: 'industrial chemistry', appId: 'industrial_chemistry' },
]

const STEP_LABELS = ['Siwa', 'Sinai', 'Ports', 'Export', 'QA chain', 'Quote']

const byId = (list, id) => list.find(x => x.id === id)
const svc = id => byId(SERVICE_DIVISIONS, id)
const app = id => byId(APPLICATIONS, id)

/* ─── page ────────────────────────────────────────────────────────────── */

export default async function HomePage() {
  const [settings, caseStudies, cmsHome] = await Promise.all([
    getSiteSettings().catch(() => null),
    getCaseStudies({ limit: 3 }).catch(() => []),
    getPageByPath('/').catch(() => null),
  ])

  const heroPhoto = cmsHome?.hero_photo_url || null
  const email = settings?.email || 'export@egyptglobe.com'
  const phone = settings?.phone || '+20 100 772 9844'
  const phoneE164 = settings?.phoneE164 || '+201007729844'

  const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  return (
    <main data-egg-scrolly data-active="0" className="egg-sc relative bg-white text-[#14161a] antialiased -mb-16 sm:-mb-24">
      <style>{SCOPED_CSS}</style>

      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
      <section data-hero className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden px-5 sm:px-10 lg:px-16 pt-20 sm:pt-24 pb-10 bg-white">
        {/* layered backdrop (parallaxed by GSAP) — photo + hairline grid + compass ring */}
        <div data-hero-bg className="absolute inset-[-12%] z-0 pointer-events-none" aria-hidden="true">
          {heroPhoto && (
            <Image src={heroPhoto} alt="" fill sizes="100vw" preload className="object-cover opacity-[0.16]" />
          )}
          {heroPhoto && <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/70 to-white/95" />}
          <div className="absolute inset-0 egg-hero-glow" />
          <div className="absolute inset-0 egg-grid-light opacity-70" />
          {/* slow compass ring — decorative, rotates once every 3 min */}
          <svg className="egg-compass absolute -right-[12%] top-[8%] w-[min(78vw,760px)] h-[min(78vw,760px)]"
            viewBox="0 0 400 400" fill="none" aria-hidden="true" focusable="false">
            <circle cx="200" cy="200" r="196" stroke="#0284c7" strokeWidth="0.6" strokeDasharray="2 10" />
            <circle cx="200" cy="200" r="150" stroke="#b8862b" strokeWidth="0.6" strokeDasharray="1 6" />
            <circle cx="200" cy="200" r="96" stroke="#0fb5a5" strokeWidth="0.8" />
            <path d="M200 20 L200 380 M20 200 L380 200 M73 73 L327 327 M327 73 L73 327" stroke="#94a3b8" strokeWidth="0.4" />
          </svg>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 z-[1] bg-gradient-to-b from-transparent to-white" aria-hidden="true" />

        <div data-hero-copy className="relative z-10 flex-1 flex flex-col justify-between">
          {/* overline */}
          <p className="egg-rise text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.32em] text-[#b8862b]" style={{ animationDelay: '.05s' }}>
            Egypt Globe Group
            <span className="text-[#c9ced6] mx-2">/</span>
            <span className="text-[#7a8290]">Est. 2014 · Quality at the Core · Cairo · Damietta · 60+ markets</span>
          </p>

          {/* headline */}
          <div className="max-w-5xl w-full py-12 sm:py-16">
            <h1 className={`${display.className} egg-rise text-[clamp(2.5rem,7vw,6.4rem)] font-normal leading-[0.98] tracking-[-0.02em] text-[#14161a]`} style={{ animationDelay: '.12s' }}>
              Institutional reliability<br />
              <span className="italic text-[#3f4650]">in bulk commodity exporting</span><span className="text-[#ff6321]">.</span>
            </h1>
            <p className="egg-rise mt-7 sm:mt-9 text-base sm:text-lg lg:text-[1.25rem] max-w-3xl leading-relaxed text-[#3f4650]" style={{ animationDelay: '.2s' }}>
              Egypt Globe Group is an Egyptian B2B commodity house built around an internal
              Quality Assurance division since its 2014 incorporation. Salt, cement &amp; clinker,
              fertilizers, chemicals, industrial minerals, agro and metals — every lot
              laboratory-verified before a Bill of Lading is issued, loaded FOB / CIF / CFR from
              seven Egyptian seaports to industrial buyers in sixty-plus markets. Scroll to follow one
              cargo from the Siwa salt mines to the buyer&rsquo;s arrival laboratory.
            </p>
            <div className="egg-rise flex flex-wrap items-center gap-6 sm:gap-9 mt-9 sm:mt-11" style={{ animationDelay: '.28s' }}>
              <a href="#quote" className="egg-btn group relative inline-flex items-center gap-2.5 text-sm font-semibold text-white bg-[#ff6321] px-7 py-3.5 rounded-full overflow-hidden shadow-[0_10px_30px_-10px_rgba(255,99,33,.55)]">
                <span className="relative z-10">Request a quote</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
                <span className="absolute inset-0 bg-[#14161a] translate-y-full group-hover:translate-y-0 transition-transform duration-400" />
              </a>
              <Link href="/products" className="group inline-flex items-center gap-2 text-sm text-[#3f4650] hover:text-[#14161a] transition-colors">
                <span className="egg-ul pb-0.5">Explore our operations</span>
              </Link>
              <Link href="/about/quality-compliance" className="group inline-flex items-center gap-2 text-sm text-[#3f4650] hover:text-[#14161a] transition-colors">
                <Icon name="shield" className="w-4 h-4 text-[#0b8f84]" />
                <span className="egg-ul pb-0.5">Read the QA charter</span>
              </Link>
            </div>
          </div>

          {/* metrics + certifications */}
          <div className="egg-rise grid grid-cols-2 md:grid-cols-5 gap-px rounded-2xl overflow-hidden ring-1 ring-[#14161a]/10 bg-[#14161a]/10 shadow-[0_20px_50px_-30px_rgba(20,22,26,.35)]" style={{ animationDelay: '.38s' }}>
            {METRICS.map(m => (
              <div key={m.label} className="bg-white/90 backdrop-blur px-5 py-5 sm:py-6">
                <p className={`${display.className} text-[2.2rem] sm:text-[2.7rem] leading-none tracking-tight text-[#ff6321]`}>
                  <span data-count={m.value} data-suffix={m.suffix}>{m.value}{m.suffix}</span>
                </p>
                <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.18em] text-[#7a8290] mt-3 leading-snug">{m.label}</p>
              </div>
            ))}
          </div>
          <div className="egg-rise mt-6 flex flex-wrap items-center justify-between gap-x-5 gap-y-2" style={{ animationDelay: '.46s' }}>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[10px] sm:text-[11px] font-mono tracking-[0.14em] text-[#8a93a3]">
              {CERTS.map(c => <span key={c} className="whitespace-nowrap hover:text-[#b8862b] transition-colors">{c}</span>)}
            </div>
            <a href="#story" className="hidden sm:inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#7a8290] hover:text-[#14161a] transition-colors">
              Follow the cargo <span className="egg-bounce inline-block">↓</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. TICKER ───────────────────────────────────────────────── */}
      <div className="relative border-y border-[#14161a]/10 bg-[#f6f7f9] overflow-hidden">
        <div className="egg-marquee py-3.5" aria-hidden="true">
          {[0, 1].map(dup => (
            <div key={dup} className="flex shrink-0">
              {TICKER.map((t, i) => (
                <span key={`${dup}-${i}`} className="flex items-center text-[11px] font-mono tracking-[0.2em] text-[#5b6472] px-6">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff6321] mr-6" />{t}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#f6f7f9] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#f6f7f9] to-transparent" />
      </div>

      {/* ── 3. QUALITY AT THE CORE — trust anchor ───────────────────── */}
      <section className="bg-white border-b border-[#14161a]/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 py-14 lg:py-20 grid lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5" data-reveal>
            <p className="flex items-center gap-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.26em] text-[#7a8290]">
              <span className="h-px w-8 bg-[#b8862b]/60" />
              <span className="text-[#b8862b]">Quality at the Core · since 2014</span>
            </p>
            <h2 className={`${display.className} mt-5 text-[clamp(1.8rem,3.6vw,2.9rem)] leading-[1.06] tracking-[-0.015em] text-[#14161a]`}>
              Most regional exporters sell a specification. <span className="italic text-[#0b8f84]">We certify one.</span>
            </h2>
            <p className="mt-6 text-[15.5px] leading-[1.75] text-[#3f4650]">
              Consistency is the industry&rsquo;s chronic failure: a first lot that meets the tender
              specification, a third lot that does not, and a dispute at the discharge port. Egypt
              Globe Group was incorporated in 2014 with a dedicated Quality Assurance division at
              its nucleus — not a service bought in later — with laboratories at the source, at the
              processing plant and at the berth. The result is a Certificate of Analysis the
              buyer&rsquo;s own arrival laboratory reproduces, shipment after shipment, year after year.
            </p>
            <p className="mt-4 text-[15.5px] leading-[1.75] text-[#3f4650]">
              Specification is guaranteed at the port of loading and binding under the sales
              contract; cargo condition on voyage is covered by the Bill of Lading and marine
              insurance we help you arrange. That division of responsibility is written into every
              offer we issue.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Node href="/about/quality-compliance" tone={C.teal}><Icon name="shield" className="w-3.5 h-3.5" /> Quality &amp; compliance</Node>
              <Node href={svc('inspection').path} tone="#16a34a"><Icon name="beaker" className="w-3.5 h-3.5" /> {svc('inspection').label}</Node>
              <Node href="/coa" tone={C.gold}><Icon name="doc" className="w-3.5 h-3.5" /> Certificate of Analysis centre</Node>
              <Node href="/standards/iso-9001-salt-suppliers" tone="#64748b">ISO 9001 for bulk suppliers</Node>
            </div>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-px rounded-2xl overflow-hidden ring-1 ring-[#14161a]/10 bg-[#14161a]/10" data-reveal>
            {QA_PROTOCOL.map(q => (
              <div key={q.t} className="bg-white p-6 lg:p-7 hover:bg-[#f6f7f9] transition-colors duration-400">
                <span className="inline-flex w-9 h-9 items-center justify-center rounded-lg ring-1 ring-[#14161a]/15 text-[#14161a]">
                  <Icon name={q.icon} className="w-[18px] h-[18px]" />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-[#14161a] leading-snug">{q.t}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#5b6472]">{q.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. SCROLLYTELLING — text scrolls, data canvas sticks ────── */}
      <section id="story" className="relative px-4 sm:px-8 lg:px-16 pt-6 lg:pt-10 bg-white">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16">

          {/* ── Sticky data canvas (right on desktop, top strip on mobile) */}
          <div className="sticky top-14 sm:top-16 lg:top-24 z-10 lg:col-start-2 lg:row-start-1 lg:self-start">
            <div data-canvas className="relative w-full h-[40vh] sm:h-[46vh] lg:h-[calc(100vh-7.5rem)] min-h-[260px] rounded-2xl lg:rounded-3xl overflow-hidden ring-1 ring-[#14161a]/10 bg-[#f6f7f9] shadow-[0_30px_70px_-35px_rgba(20,22,26,.45)]">
              <PanelSiwa />
              <PanelSinai />
              <PanelLogistics />
              <PanelGlobal />
              <PanelQaChain />
              <PanelDesk email={email} phone={phone} phoneE164={phoneE164} />

              {/* progress rail */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-2.5 py-1.5 ring-1 ring-[#14161a]/10 shadow-sm" aria-hidden="true">
                {STEP_LABELS.map((l, i) => (
                  <span key={l} data-dot={i} className={`egg-dot ${i === 0 ? 'is-on' : ''}`} title={l} />
                ))}
                <span className="ml-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-[#5b6472] hidden sm:inline">
                  {STEP_LABELS.map((l, i) => <span key={l} data-step-label={i} className="egg-step-label">{l}</span>)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Narrative column */}
          <div className="lg:col-start-1 lg:row-start-1 pt-8 lg:pt-0">

            {/* STEP 1 — Siwa */}
            <article data-step="0" className="egg-step">
              <Eyebrow n="01" tone={C.tealText}>Source · Siwa Oasis &amp; Qattara Depression</Eyebrow>
              <h2 data-rise className={`${display.className} egg-h2`}>
                Siwa Oasis crystalline rock salt — <span className="italic text-[#0b8f84]">certified at the mine</span>, not at the negotiating table.
              </h2>
              <p data-rise className="egg-p">
                Our rock salt is mined from halite beds in the Siwa Oasis and the Qattara Depression —
                deposits laid down more than thirty million years ago and free of the marine
                contaminants that depress purity in coastal product. Every production lot is sampled at
                the mine face and tested in our on-site laboratory against a guaranteed minimum of{' '}
                <strong>97.00 % NaCl</strong> on a dry basis, with calcium and magnesium each held at
                ≤ 0.40 %, sulphate ≤ 0.80 % and water-insolubles ≤ 0.50 %. Sieve profiles from 0/2 mm
                fine to 10/40 mm lump are verified by ISO 13320 laser diffraction, and moisture is
                controlled to ≤ 1.5 % natural or ≤ 0.5 % kiln-dried (0.25 % on request).
              </p>
              <p data-rise className="egg-p">
                That chemistry is the feedstock behind our food, pharmaceutical, cosmetic and
                chlor-alkali grades and the origin of the{' '}
                <Link href="/products/salt" className="egg-inline">Salt</Link> division — the first of our
                seven commodity divisions and the one our QA system was built around.
              </p>
              <div data-rise className="egg-nodes">
                <DivisionNode div={byId(PRODUCT_DIVISIONS, 'salt')} />
                <Node href={SALT_GRADES.food.path}     tone={C.teal}>{SALT_GRADES.food.label}</Node>
                <Node href={SALT_GRADES.pharma.path}   tone={C.teal}>{SALT_GRADES.pharma.label}</Node>
                <Node href={SALT_GRADES.cosmetic.path} tone={C.gold}>{SALT_GRADES.cosmetic.label}</Node>
                <Node href={app('cosmetic').path}      tone={C.gold}>{app('cosmetic').label}</Node>
                <Node href={app('pharmaceutical').path} tone={C.gold}>{app('pharmaceutical').label}</Node>
              </div>
              <Facts data-rise items={[
                ['≥ 97.00%', 'NaCl, dry basis — guaranteed floor'],
                ['≤ 0.40%', 'Ca and Mg, each'],
                ['Per lot', 'mine-site laboratory CoA'],
              ]} />
            </article>

            {/* STEP 2 — Sinai */}
            <article data-step="1" className="egg-step">
              <Eyebrow n="02" tone={C.oceanText}>Source · North Sinai &amp; the Red Sea coast</Eyebrow>
              <h2 data-rise className={`${display.className} egg-h2`}>
                Sinai sea salt at <span className="italic text-[#0369a1]">industrial and de-icing scale</span> — graded to the tender, lot by lot.
              </h2>
              <p data-rise className="egg-p">
                Solar-evaporated sea salt from the Bardawil lagoon and El-Arish coast of North Sinai and
                from the Red Sea pans at Ain Sokhna is the high-capacity source behind our de-icing,
                industrial, water-treatment and pool grades. It is supplied in three verified purity
                tiers — raw 94–97 % NaCl, washed 97.5–98 % and double-washed ≥ 99 % — and screened to{' '}
                <Link href="/standards/en-16811-1" className="egg-inline">EN 16811-1</Link> Type 1
                (kiln-dried, ≤ 1.5 % moisture, anti-caking E535 ≤ 80 ppm on request) or Type 2
                (natural moisture 3–4 %, no additive) gradings; to ASTM D632 / AASHTO M-143 for North
                America; BS 3247 for the UK; SS-EN 16811-1 for the Nordics; and GOST 13830 for CIS
                tenders. Grading is re-verified at the port laboratory on every shipment, because a
                spreader calibrated for 0/6.3 mm cannot tolerate a lot that arrives at 2/8.
              </p>
              <div data-rise className="egg-nodes">
                <Node href={SALT_GRADES.deicing.path}    tone={C.ocean}>{SALT_GRADES.deicing.label}</Node>
                <Node href={SALT_GRADES.industrial.path} tone={C.ocean}>{SALT_GRADES.industrial.label}</Node>
                <Node href={SALT_GRADES.pool.path}       tone={C.ocean}>{SALT_GRADES.pool.label}</Node>
                <Node href={app('deicing').path}         tone="#64748b">{app('deicing').label}</Node>
                <Node href={svc('added-value').path}     tone="#a855f7">{svc('added-value').label}</Node>
                <Node href="/trade-tools/deicing-salt-standards" tone="#64748b">84 national de-icing standards</Node>
              </div>
              <Facts data-rise items={[
                ['0/2 – 10/40', 'mm sieve profiles in stock'],
                ['≤ 1.5% / ≤ 4%', 'moisture — Type 1 / Type 2'],
                ['240 MT', 'minimum order, 10 × 20′ FCL'],
              ]} />
            </article>

            {/* STEP 3 — Logistics */}
            <article data-step="2" className="egg-step">
              <Eyebrow n="03" tone={C.orangeText}>Logistics · mitigating global supply-chain risk</Eyebrow>
              <h2 data-rise className={`${display.className} egg-h2`}>
                Every source sits within a day of a berth <span className="italic text-[#d9501a]">our own teams control</span>.
              </h2>
              <p data-rise className="egg-p">
                Supply-chain risk in Egyptian bulk export is rarely the commodity — it is the handover:
                the trucking contractor, the stevedore, the agent, the document that arrives after the
                vessel. We remove the handovers. Rock salt from Siwa and Qattara runs east to{' '}
                <Link href="/ports/el-dekheila-salt" className="egg-inline">El Dekheila</Link>,{' '}
                <Link href="/ports/alexandria-salt" className="egg-inline">Alexandria</Link> and{' '}
                <Link href="/ports/damietta-salt" className="egg-inline">Damietta</Link>; Sinai sea salt loads at{' '}
                <Link href="/ports/port-said-east-salt" className="egg-inline">Port Said East</Link>, Damietta and Al-Arish, with{' '}
                <Link href="/ports/ain-sokhna-salt" className="egg-inline">Ain Sokhna</Link> serving the Red Sea lanes. Our own
                stevedoring, vessel-agency, port-QC and documentation teams work every berth, issue the
                Notice of Readiness and keep the Statement of Facts — the same terminals and teams that
                load our <Link href="/products/construction" className="egg-inline">Construction</Link> (cement &amp; clinker),{' '}
                <Link href="/products/fertilizers" className="egg-inline">Fertilizers</Link> and{' '}
                <Link href="/products/minerals" className="egg-inline">Industrial Minerals</Link> divisions.
              </p>
              <div data-rise className="egg-nodes">
                {PORTS.map(p => (
                  <Node key={p.id} href={p.path} tone={C.orange} mono>{p.code} · {p.name}</Node>
                ))}
                <Node href="/services/loading-ports" tone={C.orange}>All Egyptian loading ports →</Node>
              </div>
              <div data-rise className="egg-nodes mt-3">
                {['logistics', 'port-services', 'packing', 'inspection', 'documentation', 'distribution'].map(id => {
                  const s = svc(id)
                  return s ? <Node key={id} href={s.path} tone={s.color}><Icon name={SERVICE_ICON[id]} className="w-3.5 h-3.5" /> {s.label}</Node> : null
                })}
                <Node href="/services" tone="#0d9488">All services →</Node>
              </div>
              <Facts data-rise items={[
                ['< 12 h', 'source to berth, any division'],
                ['7', 'ports with resident EGG teams'],
                ['NOR / SOF', 'documented on every vessel'],
              ]} />
            </article>

            {/* STEP 4 — global export map */}
            <article data-step="3" className="egg-step">
              <Eyebrow n="04" tone={C.oceanText}>Export · 60+ destination markets</Eyebrow>
              <h2 data-rise className={`${display.className} egg-h2`}>
                One corridor out of Egypt, <span className="italic text-[#0369a1]">into every industry that buys it</span>.
              </h2>
              <p data-rise className="egg-p">
                What leaves an Egyptian berth is not a commodity in the abstract — it is feedstock for a
                named plant. Sea and rock salt move to{' '}
                <Link href={app('industrial_chemistry').path} className="egg-inline">{app('industrial_chemistry').label}</Link>{' '}
                buyers running chlor-alkali and PVC lines in North Europe, India and the Far East; to{' '}
                <Link href={app('water_treatment').path} className="egg-inline">{app('water_treatment').label}</Link>{' '}
                operators across the Gulf, West Africa and South America; and to{' '}
                <Link href={app('deicing').path} className="egg-inline">{app('deicing').label}</Link>{' '}
                fleets in the UK, the Nordics and North America tendering against EN 16811-1 and ASTM D632.
                Cement, fertilizers and industrial minerals follow the same lanes and the same document set.
                Select any destination on the map to see the specification that market tenders against.
              </p>
              <div data-rise className="egg-nodes">
                {['industrial_chemistry', 'water_treatment', 'deicing', 'food_processing'].map(id => {
                  const a = app(id)
                  return a ? <Node key={id} href={a.path} tone={C.ocean}>{a.label}</Node> : null
                })}
                <Node href="/applications" tone={C.ocean}>All applications →</Node>
                <Node href="/global-presence" tone={C.ocean}>Global presence →</Node>
              </div>
              <Facts data-rise items={[
                ['60+', 'destination markets served'],
                ['FOB / CIF / CFR', 'from 7 Egyptian ports'],
                ['24 h', 'quote turnaround, any lane'],
              ]} />
            </article>

            {/* STEP 5 — QA chain to destination */}
            <article data-step="4" className="egg-step">
              <Eyebrow n="04" tone={C.oceanText}>Export · uncompromising QA verification to the destination port</Eyebrow>
              <h2 data-rise className={`${display.className} egg-h2`}>
                Five verification gates between the mine face <span className="italic text-[#0369a1]">and the buyer&rsquo;s arrival lab</span>.
              </h2>
              <p data-rise className="egg-p">
                FOB, CIF or CFR — Handysize to Panamax bulk, or containerised FIBC — every consignment
                passes the same five gates: source sampling, plant QC, port-laboratory analysis with
                Certificate of Analysis before the Bill of Lading, independent pre-shipment inspection
                with sealed retained samples, and cross-reference against the buyer&rsquo;s own arrival
                test. Chlor-alkali and PVC plants in Europe and India, municipal water utilities across
                the Gulf and Africa and highway agencies in the UK, the Nordics and North America buy on
                that chain — and the same export desk applies it to cement and clinker, urea and NPK,
                caustic soda and soda ash, silica sand, steel and edible oils.
              </p>
              <div data-rise className="egg-nodes">
                {['industrial_chemistry', 'water_treatment', 'deicing', 'oil_gas'].map(id => {
                  const a = app(id)
                  return a ? <Node key={id} href={a.path} tone={C.ocean}>{a.label}</Node> : null
                })}
                <Node href="/applications" tone={C.ocean}>All applications →</Node>
                <Node href="/global-presence" tone={C.gold}><Icon name="globe" className="w-3.5 h-3.5" /> Global presence — 60+ markets</Node>
              </div>

              {/* Seven divisions — supply-chain nodes (exact nav naming) */}
              <div data-rise className="mt-9">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#7a8290]">Seven commodity divisions · one QA system</p>
                  <Link href="/products" className="group inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.18em] text-[#5b6472] hover:text-[#b8862b] transition-colors">
                    All products <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRODUCT_DIVISIONS.map(div => <DivisionCard key={div.id} div={div} />)}
                </div>
              </div>
            </article>

            {/* STEP 5 — Request a quote */}
            <article data-step="5" id="quote" className="egg-step scroll-mt-24">
              <Eyebrow n="05" tone={C.orangeText}>Request a quote · your verified, long-term supply-chain ally</Eyebrow>
              <h2 data-rise className={`${display.className} egg-h2`}>
                Tell us the tonnage and the specification. <span className="italic text-[#d9501a]">We price it, and certify it, by tomorrow.</span>
              </h2>
              <p data-rise className="egg-p">
                Our export desk sits in Damietta and Cairo. A structured request receives a priced FOB /
                CIF / CFR offer, a sample Certificate of Analysis for the grade, the applicable
                independent-inspection protocol and the available L/C document set within 24 hours.
                Annual offtake contracts are available across all seven divisions. Your details go to the
                trade desk only — no marketing email.
              </p>

              <form data-egg-rfq data-rise className="egg-form mt-7" noValidate>
                {/* honeypot — invisible to humans, filled by bots → silently dropped */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                  <label htmlFor="egg-website-field" tabIndex={-1}>Website (leave blank)</label>
                  <input id="egg-website-field" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div data-rfq-fields className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Company" required>
                    <input name="company" required autoComplete="organization" placeholder="ACME Chemicals GmbH" className="egg-input" />
                  </FormField>
                  <FormField label="Work email" required>
                    <input name="email" type="email" required autoComplete="email" placeholder="procurement@company.com" className="egg-input" />
                  </FormField>
                  <FormField label="Volume (tons)" required>
                    <div className="flex">
                      <input name="volume" type="number" min="1" step="1" inputMode="numeric" required placeholder="5000" className="egg-input rounded-r-none" />
                      <span className="inline-flex items-center px-3.5 rounded-r-xl border border-l-0 border-[#14161a]/15 bg-[#f6f7f9] text-xs font-mono text-[#5b6472]">MT</span>
                    </div>
                  </FormField>
                  <FormField label="Salt type" required>
                    <select name="salt_type" required defaultValue="" className="egg-input">
                      <option value="" disabled>Select a grade</option>
                      <option>Rock salt — De-icing grade (EN 16811-1 / ASTM D632)</option>
                      <option>Sea salt — De-icing grade (EN 16811-1 Type 2, natural moisture)</option>
                      <option>Industrial grade — chlor-alkali / PVC / oilfield</option>
                      <option>Pool &amp; water-treatment grade (softener, ion-exchange)</option>
                      <option>Food grade (ISO 22000 / HACCP / Halal)</option>
                      <option>Pharmaceutical grade (USP / BP / EP)</option>
                      <option>Cosmetic &amp; spa grade</option>
                      <option>Agricultural / animal-feed grade</option>
                      <option>Other commodity — cement, fertilizers, chemicals, minerals, metals, agro</option>
                    </select>
                  </FormField>
                  <FormField label="Destination (port or country)" required full>
                    <input name="destination" required placeholder="Rotterdam (NLRTM) · Jebel Ali · Mombasa · Houston" className="egg-input" />
                  </FormField>
                  <FormField label="Notes — Incoterm, packing, timing (optional)" full>
                    <textarea name="notes" rows={2} placeholder="CIF Rotterdam, 1 MT FIBC, first lot Q4 2026, ISO 22000 + SGS inspection" className="egg-input resize-y" />
                  </FormField>
                </div>

                <p data-rfq-status className="hidden mt-3 rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-2.5 text-sm" role="alert" />

                <div data-rfq-actions className="flex flex-col sm:flex-row sm:items-center gap-4 mt-5">
                  <button type="submit" className="egg-btn group relative inline-flex items-center justify-center gap-2.5 text-sm font-semibold text-white bg-[#ff6321] px-8 py-4 rounded-full overflow-hidden shadow-[0_10px_30px_-10px_rgba(255,99,33,.55)] disabled:opacity-60 disabled:cursor-not-allowed">
                    <span className="relative z-10">Send my request</span>
                    <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
                    <span className="absolute inset-0 bg-[#14161a] translate-y-full group-hover:translate-y-0 transition-transform duration-400" />
                  </button>
                  <p className="text-xs text-[#7a8290] leading-relaxed max-w-sm">
                    Need specs, packing and Incoterm detail?{' '}
                    <Link href="/rfq" className="text-[#14161a] hover:text-[#ff6321] underline decoration-[#14161a]/30 underline-offset-4">Use the full RFQ form →</Link>
                  </p>
                </div>

                {/* success state — toggled by the init script */}
                <div data-rfq-success className="hidden rounded-2xl border border-emerald-200 bg-emerald-50 p-7 text-center">
                  <span className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-white ring-1 ring-emerald-300 text-emerald-700 mb-3">
                    <Icon name="check" className="w-5 h-5" strokeWidth={2.2} />
                  </span>
                  <h3 className={`${display.className} text-2xl text-[#14161a] mb-2`}>Request received — thank you.</h3>
                  <p className="text-sm text-[#3f4650] max-w-md mx-auto leading-relaxed">
                    The export desk reviews every request within an hour and replies with a priced, certified offer within 24 hours.
                  </p>
                  <div className="inline-block mt-4 rounded-xl border border-[#14161a]/10 bg-white px-5 py-3">
                    <div className="text-[10px] uppercase tracking-wider font-mono text-[#7a8290]">Reference</div>
                    <div data-rfq-ref className="font-mono font-bold text-lg text-[#14161a]">—</div>
                  </div>
                  <p className="text-xs text-[#7a8290] mt-4">
                    Add specs or packing detail any time via the <Link href="/rfq" className="text-[#14161a] hover:text-[#ff6321] underline underline-offset-4">full RFQ form</Link>.
                  </p>
                </div>
              </form>

              <div data-rise className="mt-8 text-sm font-mono text-[#7a8290] leading-relaxed">
                <a href={`mailto:${email}`} className="text-[#14161a] hover:text-[#ff6321] transition-colors">{email}</a><br />
                <a href={`tel:${phoneE164}`} className="hover:text-[#14161a] transition-colors">{phone}</a>
                <span className="text-[#a3aab5]"> · WhatsApp available</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── 5. WHAT WE DO (preserved pillar links) ──────────────────── */}
      <section className="border-t border-[#14161a]/10 mt-8 lg:mt-16 bg-white">
        <SectionLabel>What we do</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <div key={p.tag} data-reveal className={`group px-6 sm:px-10 lg:px-10 py-12 border-t border-[#14161a]/10 ${i > 0 ? 'lg:border-l' : ''} ${i % 2 === 1 ? 'md:border-l' : ''} hover:bg-[#f6f7f9] transition-colors duration-500`}>
              <div className="flex items-baseline gap-4 mb-6">
                <span className={`${display.className} text-2xl text-[#c9ced6] group-hover:text-[#b8862b] transition-colors duration-500`}>{p.n}</span>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#d9501a]">{p.tag}</p>
              </div>
              <p className="text-[14.5px] text-[#3f4650] leading-relaxed mb-8">{p.body}</p>
              <Link href={p.href} className="group/l inline-flex items-center gap-2 text-sm text-[#3f4650] hover:text-[#14161a] transition-colors">
                <span className="egg-ul pb-0.5">{p.cta}</span>
                <span className="transition-transform duration-300 group-hover/l:translate-x-1">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. RECENT THINKING ──────────────────────────────────────── */}
      {caseStudies.length > 0 && (
        <section className="border-t border-[#14161a]/10 bg-white">
          <div className="flex items-center justify-between px-6 sm:px-10 lg:px-16 pt-12 pb-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#7a8290]">Verified deliveries · case studies</p>
            <Link href="/case-studies" className="group inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-[#5b6472] hover:text-[#b8862b] transition-colors">
              All <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="divide-y divide-[#14161a]/10 border-t border-[#14161a]/10">
            {caseStudies.map(cs => (
              <Link key={cs.path} href={cs.path} data-reveal className="group flex items-center gap-6 px-6 sm:px-10 lg:px-14 py-7 hover:bg-[#f6f7f9] transition-colors duration-400">
                {cs.hero_photo_url && (
                  <div className="hidden sm:block shrink-0 w-16 h-16 rounded-lg overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity duration-400 ring-1 ring-[#14161a]/10">
                    <Image src={cs.hero_photo_url} alt="" width={64} height={64} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#b8862b] mb-2">Case study</p>
                  <p className={`${display.className} text-lg sm:text-xl text-[#2a2f38] group-hover:text-[#14161a] leading-snug transition-colors`}>{cs.title}</p>
                  {cs.description && <p className="text-xs text-[#7a8290] mt-1.5 line-clamp-1 leading-relaxed">{cs.description}</p>}
                </div>
                <span className="shrink-0 text-[#c9ced6] group-hover:text-[#ff6321] transition-all duration-400 group-hover:translate-x-1 text-lg">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── legal trust line ────────────────────────────────────────── */}
      <div className="border-t border-[#14161a]/10 px-6 sm:px-10 lg:px-16 py-7 bg-white">
        <p className="text-[10px] font-mono text-[#8a93a3] tracking-[0.14em]">
          Export license {settings?.exportLicense || '600010794'} · Commercial registry {settings?.commercialRegistry || '73418'} · Tax card {settings?.taxCard || '655-527-427'} · GOEIC-registered exporter · Cairo + Damietta, Egypt
        </p>
      </div>

      {/* ── GSAP + ScrollTrigger (CDN) + init ───────────────────────── */}
      <Script src={`https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/gsap.min.js`} strategy="afterInteractive" />
      <Script src={`https://cdn.jsdelivr.net/npm/gsap@${GSAP_VERSION}/dist/ScrollTrigger.min.js`} strategy="afterInteractive" />
      <Script
        id="egg-scrolly-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: `window.__EGG_ENV=${JSON.stringify({ url: SUPABASE_URL, key: SUPABASE_ANON })};${INIT_SCRIPT}` }}
      />
    </main>
  )
}

/* ─── data panels (sticky canvas layers) ──────────────────────────────── */

/** Shared shell for a tabular data panel inside the canvas. */
function DataPanel({ index, kicker, title, tone, icon = 'shield', children, chips = [] }) {
  return (
    <div data-scene={index} className="egg-scene">
      <div className="absolute inset-0 egg-grid-light opacity-40" aria-hidden="true" />
      <div className="absolute inset-0 flex items-stretch p-3 sm:p-5 lg:p-7">
        <div className="egg-panel w-full flex flex-col rounded-xl sm:rounded-2xl ring-1 ring-[#14161a]/10 bg-white shadow-[0_20px_50px_-30px_rgba(20,22,26,.4)] overflow-hidden">
          <div className="flex items-start justify-between gap-3 px-3.5 sm:px-5 pt-9 sm:pt-11 pb-2.5 sm:pb-3 border-b border-[#14161a]/10">
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.24em] truncate" style={{ color: tone }}>{kicker}</p>
              <p className="text-[13px] sm:text-[15px] text-[#14161a] mt-0.5 leading-tight font-semibold">{title}</p>
            </div>
            <span className="shrink-0 inline-flex w-8 h-8 items-center justify-center rounded-lg ring-1 ring-[#14161a]/12 text-[#14161a]">
              <Icon name={icon} className="w-4 h-4" />
            </span>
          </div>
          <div className="flex-1 min-h-0 overflow-auto egg-panel-body">
            {children}
          </div>
          {chips.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-1.5 px-5 py-3 border-t border-[#14161a]/10 bg-[#f9fafb]">
              {chips.map(([label, href]) => (
                <Link key={href + label} href={href} className="text-[10px] font-mono uppercase tracking-[0.12em] px-2 py-1 rounded-md ring-1 ring-[#14161a]/15 text-[#3f4650] hover:text-[#14161a] hover:ring-[#14161a]/40 bg-white transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SpecTable({ caption, head, rows, mono = [1] }) {
  return (
    <table className="egg-table w-full text-left">
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead>
        <tr>
          {head.map((h, i) => (
            <th key={h} scope="col" className={`px-3.5 sm:px-5 py-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.16em] text-[#7a8290] bg-[#f9fafb] border-b border-[#14161a]/10 ${i === head.length - 1 && head.length > 2 ? 'hidden md:table-cell' : ''}`}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-[#14161a]/8">
        {rows.map((r, ri) => (
          <tr key={ri} className="hover:bg-[#f9fafb] transition-colors">
            {r.map((c, ci) => (
              <td key={ci} className={`px-3.5 sm:px-5 py-2 sm:py-2.5 align-top text-[11px] sm:text-[12.5px] leading-snug ${ci === 0 ? 'text-[#14161a] font-medium' : 'text-[#3f4650]'} ${mono.includes(ci) ? 'font-mono text-[10.5px] sm:text-[12px]' : ''} ${ci === r.length - 1 && r.length > 2 ? 'hidden md:table-cell' : ''}`}>{c}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function PanelSiwa() {
  return (
    <DataPanel index={0} kicker="Siwa Oasis · Qattara Depression · rock salt" title="Chemical analysis — guaranteed limits, dry basis" tone={C.tealText} icon="beaker"
      chips={[['Food', SALT_GRADES.food.path], ['Pharma', SALT_GRADES.pharma.path], ['Cosmetic', SALT_GRADES.cosmetic.path], ['CoA centre', '/coa']]}>
      <SpecTable caption="Siwa rock salt chemical analysis" head={['Parameter', 'Limit', 'Test method']} rows={SIWA_ROWS} />
      <p className="px-3.5 sm:px-5 py-2.5 text-[10px] sm:text-[11px] text-[#7a8290] leading-snug border-t border-[#14161a]/8">
        Values are contractual limits verified per lot at the mine-site laboratory and re-tested at the port of loading. Certificate of Analysis issued before the Bill of Lading.
      </p>
    </DataPanel>
  )
}

function PanelSinai() {
  return (
    <DataPanel index={1} kicker="North Sinai · Bardawil / El-Arish · Red Sea" title="Siwa rock salt vs Sinai sea salt — tender reference" tone={C.oceanText} icon="layers"
      chips={[['De-icing', SALT_GRADES.deicing.path], ['Industrial', SALT_GRADES.industrial.path], ['EN 16811-1', '/standards/en-16811-1'], ['ASTM D632', '/standards/astm-d632']]}>
      <SpecTable caption="Rock salt versus sea salt comparison" head={['Parameter', 'Siwa rock salt', 'Sinai sea salt']} rows={COMPARE_ROWS} mono={[]} />
    </DataPanel>
  )
}

function PanelLogistics() {
  const SOURCES = [
    { x: 75,  y: 140, label: 'Siwa' },
    { x: 175, y: 100, label: 'Qattara' },
    { x: 462, y: 46,  label: 'Bardawil' },
  ]
  return (
    <div data-scene="2" className="egg-scene">
      <div className="absolute inset-0 egg-grid-light opacity-40" aria-hidden="true" />
      {/* hairline monochrome map — single ink colour, ports are real links */}
      <svg className="absolute inset-0 w-full h-full p-4 sm:p-6 text-[#14161a]" viewBox="0 0 680 520" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Map of Egypt showing salt routes from Siwa, Qattara and Sinai converging on Alexandria, El Dekheila, Damietta, Port Said East, Al-Arish and Ain Sokhna">
        <polygon
          points="55,20 160,32 282,46 295,40 320,27 390,29 418,38 490,43 512,35 545,125 533,150 515,212 460,155 427,102 417,120 432,145 455,182 490,237 497,262 514,295 545,346 575,405 645,500 50,500 50,150 35,100"
          fill="#ffffff" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1" strokeLinejoin="round" />
        {/* Nile */}
        <path d="M320 27 Q 345 70 362 97 M390 29 Q 372 70 362 97 Q 352 170 360 240 Q 395 290 430 315 Q 440 360 445 395" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.9" />
        <text x="40" y="455" className="egg-maptext">WESTERN DESERT</text>
        <text x="120" y="16" className="egg-maptext">MEDITERRANEAN SEA</text>
        <text x="560" y="300" className="egg-maptext">RED SEA</text>
        <text x="470" y="110" className="egg-maptext">SINAI</text>
        {/* routes (drawn in by GSAP) */}
        {ROUTES.map((r, i) => (
          <path key={i} data-draw d={r.d} fill="none" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.2" strokeLinecap="round" strokeDasharray={r.from === 'bardawil' ? '4 3' : undefined} />
        ))}
        {/* sources */}
        {SOURCES.map(s => (
          <g key={s.label} data-pop>
            <circle cx={s.x} cy={s.y} r="3.5" fill="currentColor" />
            <circle cx={s.x} cy={s.y} r="9" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.8" />
            <text x={s.x + (s.label === 'Bardawil' ? 12 : -12)} y={s.y + (s.label === 'Bardawil' ? 36 : 22)} textAnchor="start" className="egg-maptext">{s.label.toUpperCase()}</text>
          </g>
        ))}
        {/* Cairo */}
        <g data-pop>
          <rect x="359" y="94" width="6" height="6" fill="currentColor" />
          <text x="372" y="92" className="egg-maptext">CAIRO HQ</text>
        </g>
        {/* ports — each is a link */}
        {/* port nodes — <g data-href> (not SVG <a>) so third-party scripts that
            iterate document anchors never meet an SVGAnimatedString href;
            the init script delegates click / Enter to a real navigation */}
        {PORTS.map(p => (
          <g key={p.id} data-href={p.path} data-pop role="link" tabIndex={0} className="egg-port" aria-label={`${p.name} port`}>
            <circle cx={p.x} cy={p.y} r="5.5" fill="#ffffff" stroke="currentColor" strokeWidth="1.4" />
            <circle cx={p.x} cy={p.y} r="2" fill="currentColor" />
            <text x={p.x + p.lx} y={p.y + p.ly} textAnchor={p.anchor} className="egg-maptext egg-maptext--port">{p.name}</text>
          </g>
        ))}
      </svg>
      <div className="absolute left-3 right-3 bottom-3 sm:left-5 sm:right-auto sm:bottom-5 z-20 max-w-[92%] rounded-xl sm:rounded-2xl bg-white/92 backdrop-blur ring-1 ring-[#14161a]/10 shadow-[0_12px_30px_-18px_rgba(20,22,26,.45)] px-3.5 py-2.5 sm:px-4 sm:py-3">
        <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.24em]" style={{ color: C.orangeText }}>Logistics network · 7 Egyptian seaports · resident EGG teams</p>
        <p className="text-sm sm:text-base text-[#14161a] mt-0.5 leading-tight">Source to berth in under twelve hours</p>
        <div className="hidden sm:flex flex-wrap gap-1.5 mt-2">
          {[['Loading ports', '/services/loading-ports'], [svc('logistics').label, svc('logistics').path], [svc('port-services').label, svc('port-services').path], ['Vessel sizes', '/trade-tools/vessel-sizes']].map(([label, href]) => (
            <Link key={href + label} href={href} className="text-[10px] font-mono uppercase tracking-[0.12em] px-2 py-1 rounded-md ring-1 ring-[#14161a]/15 text-[#3f4650] hover:text-[#14161a] hover:ring-[#14161a]/40 bg-white transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Global export map — restored Aug 2026.
   Interactive: every destination cluster is a link to the application
   landing it buys for. Uses <g data-href> rather than SVG <a> — the init
   script delegates click/Enter — because Cloudflare's email-decode script
   walks document anchors and throws on an SVGAnimatedString href (the bug
   fixed in 79c31e1). Arcs carry data-draw and nodes data-pop so GSAP
   animates them in exactly like the other scenes. */
function PanelGlobal() {
  return (
    <div data-scene="3" className="egg-scene">
      <div className="absolute inset-0 egg-grid-light opacity-40" aria-hidden="true" />
      <svg
        className="absolute inset-0 w-full h-full p-4 sm:p-6 text-[#14161a]"
        viewBox="120 30 740 310" preserveAspectRatio="xMidYMid meet" role="img"
        aria-label="Export arcs from the Egyptian hub to chemical, water-treatment, food and road-management buyers in Europe, the Americas, the Gulf, India, Africa and the Far East"
      >
        {/* graticule — the same hairline weight as the Egypt map */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 112.5} y1="0" x2={i * 112.5} y2="480" stroke="currentColor" strokeOpacity="0.08" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 120} x2="900" y2={i * 120} stroke="currentColor" strokeOpacity="0.08" />
        ))}
        <ellipse cx="450" cy="240" rx="440" ry="225" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeDasharray="3 9" />

        {/* great-circle-ish arcs out of the hub */}
        {DESTINATIONS.map((d, i) => {
          const cx = (HUB.x + d.x) / 2
          const cy = Math.min(HUB.y, d.y) - 55 - Math.abs(HUB.x - d.x) * 0.12
          return (
            <path key={i} data-draw d={`M${HUB.x} ${HUB.y} Q ${cx} ${cy} ${d.x} ${d.y}`}
              fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.1" strokeLinecap="round" />
          )
        })}

        {/* Egyptian hub */}
        <g data-pop>
          <circle cx={HUB.x} cy={HUB.y} r="15" fill="none" stroke="#ff6321" strokeOpacity="0.35" strokeWidth="0.9" />
          <circle cx={HUB.x} cy={HUB.y} r="5.5" fill="#ff6321" />
          <circle cx={HUB.x} cy={HUB.y} r="2" fill="#ffffff" />
          <text x={HUB.x - 14} y={HUB.y + 28} textAnchor="end" className="egg-maptext" fill="#d9501a">EGYPT · SUEZ CORRIDOR</text>
        </g>

        {/* destination clusters — each navigates to its application landing */}
        {DESTINATIONS.map((d, i) => {
          const a = app(d.appId)
          // Label runs left of the node when the node sits left of the hub, and
          // also near the right edge of the cropped viewBox (x 120→860) so a long
          // use-case string like "industrial chemistry" can't clip off-canvas.
          const left = d.x < HUB.x - 40 || d.x > 690
          return (
            <g key={i} data-href={a?.path || '/applications'} data-pop role="link" tabIndex={0}
              className="egg-port" aria-label={`${d.market} — ${d.use}`}>
              <circle cx={d.x} cy={d.y} r="9" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.8" />
              <circle cx={d.x} cy={d.y} r="3.5" fill="currentColor" />
              <text x={d.x + (left ? -12 : 12)} y={d.y - 4} textAnchor={left ? 'end' : 'start'} className="egg-maptext egg-maptext--port">{d.market}</text>
              <text x={d.x + (left ? -12 : 12)} y={d.y + 11} textAnchor={left ? 'end' : 'start'} className="egg-maptext">{d.use}</text>
            </g>
          )
        })}
      </svg>

      <div className="absolute left-3 right-3 bottom-3 sm:left-5 sm:right-auto sm:bottom-5 z-20 max-w-[92%] rounded-xl sm:rounded-2xl bg-white/92 backdrop-blur ring-1 ring-[#14161a]/10 shadow-[0_12px_30px_-18px_rgba(20,22,26,.45)] px-3.5 py-2.5 sm:px-4 sm:py-3">
        <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.24em]" style={{ color: C.oceanText }}>Global export · 60+ destination markets · FOB / CIF / CFR</p>
        <p className="text-sm sm:text-base text-[#14161a] mt-0.5 leading-tight">Chemical · water treatment · road management</p>
        <div className="hidden sm:flex flex-wrap gap-1.5 mt-2">
          {['industrial_chemistry', 'water_treatment', 'deicing', 'food_processing'].map(id => {
            const a = app(id)
            return a ? (
              <Link key={id} href={a.path} className="text-[10px] font-mono uppercase tracking-[0.12em] px-2 py-1 rounded-md ring-1 ring-[#14161a]/15 text-[#3f4650] hover:text-[#14161a] hover:ring-[#14161a]/40 bg-white transition-colors">
                {a.label}
              </Link>
            ) : null
          })}
        </div>
      </div>
    </div>
  )
}

function PanelQaChain() {
  return (
    <DataPanel index={4} kicker="QA verification chain · extraction to destination port" title="Five gates, every consignment, every division" tone={C.oceanText} icon="shield"
      chips={[[app('industrial_chemistry').label, app('industrial_chemistry').path], [app('water_treatment').label, app('water_treatment').path], [app('deicing').label, app('deicing').path], ['Inspection & QC', svc('inspection').path]]}>
      <table className="egg-table w-full text-left">
        <caption className="sr-only">QA verification chain</caption>
        <thead>
          <tr>
            <th scope="col" className="px-3.5 sm:px-5 py-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.16em] text-[#7a8290] bg-[#f9fafb] border-b border-[#14161a]/10 w-10">Gate</th>
            <th scope="col" className="px-2 sm:px-3 py-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.16em] text-[#7a8290] bg-[#f9fafb] border-b border-[#14161a]/10">Control</th>
            <th scope="col" className="hidden md:table-cell px-3 py-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.16em] text-[#7a8290] bg-[#f9fafb] border-b border-[#14161a]/10">Evidence</th>
            <th scope="col" className="px-3 sm:px-5 py-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.16em] text-[#7a8290] bg-[#f9fafb] border-b border-[#14161a]/10">Who · frequency</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#14161a]/8">
          {QA_CHAIN.map(([n, stage, evidence, who]) => (
            <tr key={n} className="hover:bg-[#f9fafb] transition-colors">
              <td className="px-3.5 sm:px-5 py-2.5 align-top">
                <span className="inline-flex w-6 h-6 items-center justify-center rounded-md ring-1 ring-[#14161a]/15 text-[#14161a]"><Icon name="shield" className="w-3.5 h-3.5" /></span>
              </td>
              <td className="px-2 sm:px-3 py-2.5 align-top text-[11px] sm:text-[12.5px] font-medium text-[#14161a] leading-snug">{stage}</td>
              <td className="hidden md:table-cell px-3 py-2.5 align-top text-[12px] text-[#3f4650] leading-snug">{evidence}</td>
              <td className="px-3 sm:px-5 py-2.5 align-top text-[10.5px] sm:text-[11.5px] font-mono text-[#3f4650] leading-snug">{who}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-3.5 sm:px-5 py-2.5 text-[10px] sm:text-[11px] text-[#7a8290] leading-snug border-t border-[#14161a]/8">
        Retained samples are sealed at gate 4 and held for 90 days to arbitrate any variance at gate 5. Specification is binding at the port of loading under the sales contract.
      </p>
    </DataPanel>
  )
}

function PanelDesk({ email, phone, phoneE164 }) {
  const STAGES = [
    ['T + 0 h',  'RFQ received',            'Auto-triaged to the commodity desk · reference issued'],
    ['T + 1 h',  'Reviewed by export desk', 'Spec match · origin port · vessel or container plan'],
    ['T + 24 h', 'Priced, certified offer', 'FOB / CIF / CFR · sample CoA · inspection protocol · packing'],
    ['Then',     'Documents & loading',     'L/C-bank set · EUR.1 / COO · SGS / TÜV / Intertek / BV at berth'],
  ]
  return (
    <div data-scene="5" className="egg-scene">
      <div className="absolute inset-0 egg-grid-light opacity-40" aria-hidden="true" />
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md rounded-2xl ring-1 ring-[#14161a]/10 bg-white p-4 sm:p-6 shadow-[0_20px_50px_-30px_rgba(20,22,26,.4)]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#d9501a]">Export desk · Cairo + Damietta</p>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />ONLINE</span>
          </div>
          <ol className="space-y-2.5 sm:space-y-3.5">
            {STAGES.map(([t, h, s], i) => (
              <li key={t} data-pop className="flex gap-3">
                <span className="shrink-0 w-14 text-[10px] font-mono text-[#7a8290] pt-0.5">{t}</span>
                <span className="relative shrink-0 mt-1.5 w-2 h-2 rounded-full" style={{ background: i === 2 ? '#ff6321' : '#14161a', boxShadow: `0 0 0 4px ${i === 2 ? 'rgba(255,99,33,.18)' : 'rgba(20,22,26,.10)'}` }} />
                <span className="min-w-0">
                  <span className="block text-sm text-[#14161a] leading-tight">{h}</span>
                  <span className="hidden sm:block text-[11px] text-[#5b6472] leading-snug mt-0.5">{s}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-4 pt-3 border-t border-[#14161a]/10 text-[11px] font-mono text-[#7a8290] hidden sm:flex items-center gap-2">
            <Icon name="pin" className="w-3.5 h-3.5 text-[#14161a]" />
            <span><a href={`mailto:${email}`} className="text-[#14161a] hover:text-[#ff6321]">{email}</a> · <a href={`tel:${phoneE164}`} className="hover:text-[#14161a]">{phone}</a></span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── small presentational pieces ─────────────────────────────────────── */

function Eyebrow({ n, tone, children }) {
  return (
    <p data-rise className="flex items-center gap-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.26em] text-[#7a8290]">
      <span className="text-[#14161a]">{n}</span>
      <span className="h-px w-8" style={{ background: tone, opacity: 0.8 }} />
      <span style={{ color: tone }}>{children}</span>
    </p>
  )
}

function Node({ href, tone = '#64748b', mono = false, children }) {
  return (
    <Link href={href} className={`egg-node ${mono ? 'font-mono text-[11px] tracking-[0.08em]' : 'text-[12.5px]'}`} style={{ '--tone': tone }}>
      <span className="egg-node-dot" />
      <span className="relative z-10 inline-flex items-center gap-1.5">{children}</span>
    </Link>
  )
}

function DivisionNode({ div }) {
  if (!div) return null
  return (
    <Link href={div.path} className="egg-node egg-node--division" style={{ '--tone': div.color }}>
      <Icon name={DIVISION_ICON[div.id] || 'cube'} className="w-4 h-4" />
      <span className="relative z-10 font-semibold">{div.label} division</span>
    </Link>
  )
}

function DivisionCard({ div }) {
  return (
    <Link href={div.path} className="group relative flex flex-col gap-2.5 rounded-xl p-3.5 ring-1 ring-[#14161a]/10 bg-white hover:bg-[#f6f7f9] hover:ring-[#14161a]/25 hover:shadow-[0_14px_30px_-20px_rgba(20,22,26,.35)] transition-all duration-300 overflow-hidden">
      <span className="w-9 h-9 rounded-lg flex items-center justify-center text-[#14161a] ring-1 ring-[#14161a]/15 group-hover:ring-[#14161a]/40 transition-colors">
        <Icon name={DIVISION_ICON[div.id] || 'cube'} className="w-[18px] h-[18px]" />
      </span>
      <span>
        <span className="block text-sm font-semibold text-[#14161a] leading-tight">{div.label}</span>
        <span className="block text-[11px] text-[#7a8290] leading-snug mt-1 line-clamp-2">{div.blurb}</span>
      </span>
      <span className="mt-auto inline-block h-[1.5px] w-0 group-hover:w-8 transition-all duration-400" style={{ background: div.color }} />
    </Link>
  )
}

function Facts({ items, ...rest }) {
  return (
    <dl {...rest} className="mt-7 grid grid-cols-3 gap-px rounded-xl overflow-hidden ring-1 ring-[#14161a]/10 bg-[#14161a]/10">
      {items.map(([v, l]) => (
        <div key={l} className="bg-[#f6f7f9] px-3 sm:px-4 py-3">
          <dt className={`${display.className} text-lg sm:text-xl text-[#14161a] leading-none`}>{v}</dt>
          <dd className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#7a8290] mt-1.5 leading-snug">{l}</dd>
        </div>
      ))}
    </dl>
  )
}

function FormField({ label, required, full, children }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#5b6472] mb-1.5">
        {label}{required && <span className="text-[#ff6321]"> *</span>}
      </span>
      {children}
    </label>
  )
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-4 px-6 sm:px-10 lg:px-16 pt-12 pb-4">
      <span className="h-px w-8 bg-[#b8862b]/60" />
      <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#7a8290]">{children}</p>
    </div>
  )
}

/* ─── scoped CSS (light) ──────────────────────────────────────────────── */

const SCOPED_CSS = `
.egg-sc{--ink:#14161a;--orange:#ff6321;--gold:#b8862b;--teal:#0fb5a5;--ocean:#0284c7}
.egg-sc .egg-grid-light{background-image:linear-gradient(rgba(20,22,26,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(20,22,26,.055) 1px,transparent 1px);background-size:48px 48px}
.egg-sc .egg-hero-glow{background:
  radial-gradient(60% 50% at 85% 10%,rgba(255,99,33,.10),transparent 60%),
  radial-gradient(55% 45% at 10% 85%,rgba(15,181,165,.12),transparent 60%)}
/* Decorative compass ring. Rotates about its own centre; lives inside
   [data-hero-bg], which GSAP parallaxes — parent and child transforms
   compose, so the two never fight. */
.egg-sc .egg-compass{opacity:.35;transform-origin:50% 50%;will-change:transform;animation:eggCompass 180s linear infinite}
@keyframes eggCompass{to{transform:rotate(360deg)}}
.egg-rise{opacity:0;transform:translateY(18px);animation:eggRise .9s cubic-bezier(.2,.7,.2,1) forwards}
@keyframes eggRise{to{opacity:1;transform:none}}
.egg-marquee{display:flex;width:max-content;animation:eggMarquee 54s linear infinite}
@keyframes eggMarquee{to{transform:translateX(-50%)}}
.egg-ul{background-image:linear-gradient(#ff6321,#ff6321);background-repeat:no-repeat;background-position:0 100%;background-size:0% 1.5px;transition:background-size .4s cubic-bezier(.2,.7,.2,1)}
.group:hover .egg-ul{background-size:100% 1.5px}
.egg-btn{transition:transform .3s}.egg-btn:hover{transform:scale(1.03)}
.egg-bounce{animation:eggBounce 1.8s ease-in-out infinite}
@keyframes eggBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}
.egg-inline{color:#14161a;font-weight:600;text-decoration:underline;text-decoration-color:rgba(15,181,165,.55);text-underline-offset:4px;margin:0 .2em;transition:text-decoration-color .2s,color .2s}
.egg-inline:hover{color:#0b8f84;text-decoration-color:#0fb5a5}

/* canvas panels — all hidden except the first until GSAP takes over */
.egg-scene{position:absolute;inset:0;will-change:opacity,transform;opacity:0;visibility:hidden}
.egg-scene:first-child{opacity:1;visibility:visible}
.egg-panel-body{scrollbar-width:thin;scrollbar-color:rgba(20,22,26,.2) transparent}
.egg-table th,.egg-table td{white-space:normal}
.egg-maptext{font-family:var(--font-geist-mono),ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;letter-spacing:.14em;fill:currentColor;fill-opacity:.75;paint-order:stroke fill;stroke:rgba(255,255,255,.9);stroke-width:3px;stroke-linejoin:round}
.egg-maptext--port{font-size:11.5px;letter-spacing:.04em;font-weight:600;fill-opacity:1}
.egg-port{cursor:pointer;outline:none}.egg-port:focus-visible circle{stroke:#ff6321}.egg-port:hover text{fill:#ff6321;fill-opacity:1}.egg-port:hover circle{stroke:#ff6321}

/* progress rail */
.egg-dot{display:inline-block;width:7px;height:7px;border-radius:999px;background:rgba(20,22,26,.18);transition:all .35s cubic-bezier(.2,.7,.2,1)}
.egg-dot.is-on{width:24px;background:#ff6321;box-shadow:0 0 0 3px rgba(255,99,33,.18)}
.egg-step-label{display:none}
.egg-sc[data-active="0"] .egg-step-label:nth-child(1),.egg-sc[data-active="1"] .egg-step-label:nth-child(2),.egg-sc[data-active="2"] .egg-step-label:nth-child(3),.egg-sc[data-active="3"] .egg-step-label:nth-child(4),.egg-sc[data-active="4"] .egg-step-label:nth-child(5){display:inline}

/* narrative */
.egg-step{min-height:70vh;display:flex;flex-direction:column;justify-content:center;padding:3.5rem 0}
@media (min-width:1024px){.egg-step{min-height:100vh;padding:4rem 0}}
.egg-h2{font-size:clamp(1.8rem,3.9vw,3.15rem);line-height:1.06;letter-spacing:-.015em;color:#14161a;margin-top:1.25rem;font-weight:400}
.egg-p{margin-top:1.4rem;font-size:15.5px;line-height:1.75;color:#3f4650;max-width:38rem}
.egg-p+.egg-p{margin-top:1rem}
.egg-p strong{font-weight:600;color:#14161a}
.egg-nodes{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.6rem}
.egg-node{position:relative;display:inline-flex;align-items:center;gap:.5rem;padding:.45rem .8rem;border-radius:999px;color:#2a2f38;background:#fff;box-shadow:inset 0 0 0 1px rgba(20,22,26,.14);transition:all .3s cubic-bezier(.2,.7,.2,1);overflow:hidden}
.egg-node::before{content:"";position:absolute;inset:0;background:var(--tone);opacity:0;transition:opacity .3s}
.egg-node:hover{color:#14161a;box-shadow:inset 0 0 0 1.5px var(--tone),0 10px 24px -14px var(--tone);transform:translateY(-1px)}
.egg-node:hover::before{opacity:.10}
.egg-node-dot{width:7px;height:7px;border-radius:999px;background:var(--tone);box-shadow:0 0 0 3px color-mix(in srgb,var(--tone) 18%,transparent);flex:none}
.egg-node--division{padding:.55rem .95rem;box-shadow:inset 0 0 0 1.5px var(--tone);color:#14161a}

/* form */
.egg-form{position:relative}
.egg-input{width:100%;padding:.8rem 1rem;border-radius:.75rem;border:1px solid rgba(20,22,26,.15);background:#fff;color:#14161a;font-size:.9rem;outline:none;transition:border-color .2s,box-shadow .2s,background .2s}
.egg-input::placeholder{color:#9aa2ae}
.egg-input:focus{border-color:#ff6321;box-shadow:0 0 0 3px rgba(255,99,33,.18)}
.egg-form.is-done [data-rfq-fields],.egg-form.is-done [data-rfq-actions]{display:none}
.egg-form.is-done [data-rfq-success]{display:block}

@media (prefers-reduced-motion:reduce){
  .egg-rise{animation:none;opacity:1;transform:none}
  .egg-marquee,.egg-bounce,.egg-compass{animation:none!important}
}
`

/* ─── GSAP init (inline, idempotent, re-binds on client-side navigation) ─ */

const INIT_SCRIPT = String.raw`
(function () {
  if (window.__eggScrollyBooted) return;
  window.__eggScrollyBooted = true;

  var ROOTS = [];
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function toArr(list) { return Array.prototype.slice.call(list); }

  /* ── Request-a-quote form → market_rfqs (anon INSERT, return=minimal) ── */
  function setupForm(root) {
    var form = root.querySelector('[data-egg-rfq]');
    if (!form || form.__eggBound) return;
    form.__eggBound = true;
    var env = window.__EGG_ENV || {};
    var renderedAt = Date.now();
    var status = form.querySelector('[data-rfq-status]');
    var btn = form.querySelector('button[type="submit"]');
    var btnHtml = btn ? btn.innerHTML : '';

    function fail(msg) {
      if (status) { status.textContent = msg; status.classList.remove('hidden'); }
      if (btn) { btn.disabled = false; btn.innerHTML = btnHtml; }
    }
    function success(ref) {
      if (status) status.classList.add('hidden');
      var refEl = form.querySelector('[data-rfq-ref]');
      if (refEl) refEl.textContent = ref;
      form.classList.add('is-done');
      try { form.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); } catch (e) {}
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (status) status.classList.add('hidden');
      var fd = new FormData(form);
      var get = function (k) { return String(fd.get(k) || '').trim(); };
      var company = get('company'), email = get('email'), volume = get('volume');
      var salt = get('salt_type'), dest = get('destination'), notes = get('notes');
      var ref = 'EGG-RFQ-' + Date.now().toString(36).toUpperCase();

      // Honeypot + timing trap: bots get a fake success, nothing is written.
      if (get('website') || Date.now() - renderedAt < 3000) { success(ref); return; }

      if (company.length < 2) return fail('Please enter your company name.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Please enter a valid work email.');
      var qty = Number(volume);
      if (!(qty > 0)) return fail('Please enter the volume in metric tons.');
      if (!salt) return fail('Please choose a salt type.');
      if (!dest) return fail('Please enter a destination port or country.');
      if (!env.url || !env.key) return fail('The form is temporarily unavailable — please email export@egyptglobe.com.');

      if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; }

      var message = [
        'RFQ from ' + company + ' (homepage quick form)',
        '',
        'Commodity: ' + salt,
        'Quantity: ' + qty + ' MT',
        'Destination: ' + dest,
        notes ? 'Notes: ' + notes : '',
        '',
        '— Submitted via egyptglobe.com (landing page)'
      ].filter(function (l, i, a) { return !(l === '' && a[i - 1] === ''); }).join('\n');

      var payload = {
        ref_code: ref,
        source: 'egyptglobe-website',
        buyer_company: company, company: company,
        buyer_name: company, contact: company,
        buyer_email: email, email: email,
        commodity_name: salt,
        quantity: qty, unit: 'MT',
        dest_port: dest, delivery_port: dest,
        message: message,
        status: 'new'
      };

      fetch(env.url.replace(/\/+$/, '') + '/rest/v1/market_rfqs', {
        method: 'POST',
        headers: {
          'apikey': env.key,
          'Authorization': 'Bearer ' + env.key,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(payload)
      }).then(function (r) {
        if (!r.ok) return r.text().then(function (t) { throw new Error(t ? t.slice(0, 160) : ('HTTP ' + r.status)); });
        success(ref);
      }).catch(function (err) {
        fail('Could not submit (' + (err && err.message ? err.message : 'network error') + '). Please email export@egyptglobe.com.');
      });
    });
  }

  /* ── Scrollytelling ──────────────────────────────────────────────── */
  function init(root) {
    if (root.__eggInit) return;
    root.__eggInit = true;
    ROOTS.push(root);
    var gsap = window.gsap, ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);

    // ScrollTrigger.refresh() measures every trigger after calling
    // window.scrollTo(x, 0). This site sets html { scroll-behavior: smooth }
    // (globals.css), and Chrome then applies that scrollTo asynchronously —
    // so the measurements are taken while the page is still scrolled and
    // every trigger ends up offset by the current scrollY (reload with
    // scroll restoration, resize mid-page, any refresh while scrolled).
    // Jump to 0 instantly before ST measures and jump back once it is done.
    if (!window.__eggStHooked) {
      window.__eggStHooked = true;
      var savedY = 0;
      ST.addEventListener('refreshInit', function () {
        savedY = window.pageYOffset || 0;
        if (savedY) window.scrollTo({ top: 0, left: window.pageXOffset || 0, behavior: 'instant' });
      });
      ST.addEventListener('refresh', function () {
        if (savedY) window.scrollTo({ top: savedY, left: window.pageXOffset || 0, behavior: 'instant' });
        savedY = 0;
      });
    }

    var scenes = toArr(root.querySelectorAll('[data-scene]'));
    var steps  = toArr(root.querySelectorAll('[data-step]'));
    var dots   = toArr(root.querySelectorAll('[data-dot]'));
    var active = -1;
    var stepTriggers = [];

    // Prepare stroke-draw paths (visible by default without JS).
    toArr(root.querySelectorAll('[data-draw]')).forEach(function (p) {
      try { var L = p.getTotalLength(); p.__len = L; gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); } catch (e) {}
    });

    function show(i) {
      if (i === active) return;
      active = i;
      root.setAttribute('data-active', String(i));
      scenes.forEach(function (s, j) {
        var on = j === i;
        s.classList.toggle('is-active', on);
        gsap.to(s, { autoAlpha: on ? 1 : 0, scale: on ? 1 : 1.02, duration: reduced ? 0 : 0.8, ease: 'power2.out', overwrite: true });
        var draws = s.querySelectorAll('[data-draw]');
        var pops  = s.querySelectorAll('[data-pop]');
        if (on) {
          if (draws.length) gsap.to(draws, { strokeDashoffset: 0, duration: reduced ? 0 : 1.5, ease: 'power2.inOut', stagger: 0.1, overwrite: true, delay: reduced ? 0 : 0.2 });
          if (pops.length) gsap.fromTo(pops, { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: reduced ? 0 : 0.5, ease: 'back.out(1.8)', stagger: 0.06, delay: reduced ? 0 : 0.45, transformOrigin: '50% 50%', overwrite: true });
        } else {
          toArr(draws).forEach(function (p) { if (p.__len) gsap.set(p, { strokeDashoffset: p.__len }); });
          if (pops.length) gsap.set(pops, { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' });
        }
      });
      dots.forEach(function (d, j) { d.classList.toggle('is-on', j === i); });
    }

    var ctx = gsap.context(function () {
      // Hero parallax — backdrop drifts down, copy lifts and fades.
      var hero = root.querySelector('[data-hero]');
      var heroBg = root.querySelector('[data-hero-bg]');
      var heroCopy = root.querySelector('[data-hero-copy]');
      if (hero && !reduced) {
        if (heroBg) gsap.to(heroBg, { yPercent: 18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
        if (heroCopy) gsap.to(heroCopy, { yPercent: -10, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: hero, start: '40% top', end: 'bottom top', scrub: true } });
      }

      // Metric counters.
      toArr(root.querySelectorAll('[data-count]')).forEach(function (el) {
        var target = parseFloat(el.getAttribute('data-count')) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        if (reduced) { el.textContent = Math.round(target) + suffix; return; }
        var obj = { v: 0 };
        gsap.to(obj, { v: target, duration: 1.6, ease: 'power2.out', delay: 0.5,
          onUpdate: function () { el.textContent = Math.round(obj.v) + suffix; },
          onComplete: function () { el.textContent = Math.round(target) + suffix; } });
      });

      // Narrative steps → panel switching + staggered text reveal.
      steps.forEach(function (st, i) {
        stepTriggers.push(ST.create({ trigger: st, start: 'top 62%', end: 'bottom 38%', onEnter: function () { show(i); }, onEnterBack: function () { show(i); } }));
        var rises = st.querySelectorAll('[data-rise]');
        if (rises.length && !reduced) {
          gsap.from(rises, { y: 26, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07, scrollTrigger: { trigger: st, start: 'top 78%', once: true } });
        }
      });

      // Generic reveals outside the story.
      if (!reduced) {
        toArr(root.querySelectorAll('[data-reveal]')).forEach(function (el) {
          gsap.from(el, { y: 22, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        });
      }
    }, root);

    root.__eggCtx = ctx;
    show(0);
    setupForm(root);

    // Delegated navigation for SVG map nodes marked data-href (see PanelLogistics).
    root.addEventListener('click', function (e) {
      var g = e.target && e.target.closest ? e.target.closest('[data-href]') : null;
      if (g) { e.preventDefault(); window.location.assign(g.getAttribute('data-href')); }
    });
    root.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var g = e.target && e.target.closest ? e.target.closest('[data-href]') : null;
      if (g) { e.preventDefault(); window.location.assign(g.getAttribute('data-href')); }
    });

    // Re-sync the visual panel to whichever step the viewport is in (same
    // 62% line as the triggers). ScrollTrigger.refresh() corrects positions
    // but does not replay enter callbacks, so after a refresh we derive it.
    function syncActive() {
      var line = window.innerHeight * 0.62, idx = -1;
      steps.forEach(function (st, i) { if (st.getBoundingClientRect().top <= line) idx = i; });
      show(idx < 0 ? 0 : idx);
    }
    function refresh() { ST.refresh(); syncActive(); }
    ST.addEventListener('refresh', function () { if (document.contains(root)) syncActive(); });

    // Recalculate positions once fonts/images settle.
    if (document.readyState === 'complete') setTimeout(refresh, 300);
    else window.addEventListener('load', refresh, { once: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);

    // Browser scroll restoration on reload / back-forward is animated here
    // (html { scroll-behavior: smooth } in globals.css), so the page can still
    // be gliding while the triggers are created — element rects and scrollY
    // then disagree. During the first seconds after init, refresh once the
    // scroll settles.
    var initAt = Date.now(), settleTimer = 0;
    window.addEventListener('scroll', function onEarlyScroll() {
      if (Date.now() - initAt > 6000) { window.removeEventListener('scroll', onEarlyScroll); return; }
      clearTimeout(settleTimer);
      settleTimer = setTimeout(refresh, 180);
    }, { passive: true });
  }

  function scan() {
    toArr(document.querySelectorAll('[data-egg-scrolly]')).forEach(function (r) { if (!r.__eggInit) init(r); });
    // Tear down contexts whose root left the DOM (client-side navigation away).
    ROOTS = ROOTS.filter(function (r) {
      if (document.contains(r)) return true;
      try { r.__eggCtx && r.__eggCtx.revert(); } catch (e) {}
      return false;
    });
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; scan(); });
  }

  var tries = 0;
  function boot() {
    if (!(window.gsap && window.ScrollTrigger)) {
      if (tries++ < 300) return setTimeout(boot, 50);
      return; // CDN unavailable — page stays fully readable, first panel shown by CSS
    }
    scan();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  }
  boot();
})();
`
