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
 * egyptglobe.com landing — "Follow the salt" scrollytelling, light edition
 * (2026-08-22).
 *
 * Server component. The sticky header + corporate footer are rendered by
 * app/layout.js around this page and are NOT touched here. Every product
 * division / service / application / port link below is imported from
 * lib/corporatePages.js (the same source the header + footer read) so the
 * naming can never drift from the navigation.
 *
 * Palette: pure white page, ultra-light gray panels (#f6f7f9), obsidian
 * text (#14161a), clear turquoise (#0fb5a5 / text #0b8f84), deep gold
 * (#b8862b) and brand orange (#ff6321) for the CTA. Scene canvases are
 * bright: turquoise Siwa lake, earth-toned Sinai ridges over a vivid blue
 * sea, and vivid-blue ocean on the port + export maps.
 *
 * Motion: GSAP 3 + ScrollTrigger loaded from jsDelivr via next/script
 * (afterInteractive). Tailwind is already compiled in-project (v4), so no
 * Tailwind CDN is loaded. The page is fully readable with JS disabled:
 * nothing is hidden by default except the inactive visual scenes, and the
 * first scene is shown by CSS.
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
    ? "Egypt Globe Group — Egypt's Industrial Export Operator"
    : `${m.siteName} — Egyptian Commodity Exporter`
  const description = isUmbrella
    ? "Egypt's industrial export operator. Salt, cement, fertilizers, chemicals, minerals — FOB / CIF from 7 Egyptian seaports to 60+ markets. ISO 22000 · EN 197-1 · GOEIC. Quote in 24h."
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
  goldGlow:   '#e0b15a', // gold highlight (decorative)
  orange:     '#ff6321', // brand CTA
  orangeText: '#d9501a',
  blue:       '#1d5fa1', // nav blue
  ocean:      '#0284c7', // vivid ocean
  oceanText:  '#0369a1',
}

/* ─── static data ─────────────────────────────────────────────────────── */

const METRICS = [
  { value: 60, suffix: '+', label: 'Export markets' },
  { value: 7,  suffix: '',  label: 'Egyptian seaports' },
  { value: 7,  suffix: '',  label: 'Commodity divisions' },
  { value: 24, suffix: 'h', label: 'RFQ response SLA' },
]

const PILLARS = [
  { n: '01', tag: 'Export Operations', body: 'Commodity sourcing, vessel chartering, freight forwarding and L/C bank documentation — extraction point to buyer warehouse across salt, cement, fertilizers, chemicals, minerals, agro and metals.', href: '/products', cta: 'Our operations' },
  { n: '02', tag: 'Industrial Development', body: 'Processing capacity alongside trading: value-added manufacturing, Egyptian industrial-zone development and greenfield partnerships that build durable margin rather than pure brokerage spread.', href: '/about', cta: 'About the group' },
  { n: '03', tag: 'R&D + Innovation', body: "Application testing, new-grade qualification and process optimisation — executed with buyers' technical teams. Specifications validated in Egyptian facilities before the first container is loaded.", href: '/services', cta: 'Our services' },
]

// Live "trading floor" ticker — ports + commodities + lanes.
const TICKER = [
  'DAMIETTA', 'ALEXANDRIA', 'AIN SOKHNA', 'PORT SAID', 'EL DEKHEILA', 'ADABIYA', 'SAFAGA',
  'SEA SALT', 'ROCK SALT', 'CEM I 42.5N', 'CLINKER', 'UREA 46%', 'DAP', 'CAUSTIC SODA',
  'GYPSUM', 'SODA ASH', 'BAUXITE', 'FELDSPAR', 'FOB', 'CIF', 'CFR',
]

const CERTS = ['ISO 22000', 'EN 197-1', 'HACCP', 'USP / BP', 'GOEIC', 'TÜV AUSTRIA', 'SGS', 'INTERTEK']

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

// Source → port routes (SVG path d). Drawn in by GSAP when the scene activates.
const ROUTES = [
  { from: 'siwa',     d: 'M75 140 Q 190 55 295 40' },
  { from: 'qattara',  d: 'M175 100 Q 235 62 282 46' },
  { from: 'qattara',  d: 'M175 100 Q 300 112 390 31' },
  { from: 'cairo',    d: 'M362 97 L 417 120' },
  { from: 'bardawil', d: 'M462 46 Q 442 26 418 38' },
  { from: 'bardawil', d: 'M462 46 Q 428 16 392 30' },
  { from: 'bardawil', d: 'M462 46 L 490 43' },
]

// Global export destinations (x/y in the 900×480 arc-map viewBox). Each node
// is a real application landing page so the map doubles as navigation.
const HUB = { x: 527, y: 160 }
const DESTINATIONS = [
  { x: 461, y: 104, market: 'North Europe',     use: 'chlor-alkali · PVC',      appId: 'industrial_chemistry' },
  { x: 468, y: 66,  market: 'UK & Nordics',     use: 'road management',         appId: 'deicing' },
  { x: 265, y: 133, market: 'North America',    use: 'de-icing · ASTM D632',    appId: 'deicing' },
  { x: 342, y: 301, market: 'South America',    use: 'water treatment',         appId: 'water_treatment' },
  { x: 565, y: 176, market: 'Gulf',             use: 'desalination · water',    appId: 'water_treatment' },
  { x: 655, y: 214, market: 'India',            use: 'chlor-alkali plants',     appId: 'industrial_chemistry' },
  { x: 549, y: 251, market: 'East Africa',      use: 'industrial · food',       appId: 'food_processing' },
  { x: 459, y: 223, market: 'West Africa',      use: 'water treatment',         appId: 'water_treatment' },
  { x: 752, y: 157, market: 'Far East',         use: 'industrial chemistry',    appId: 'industrial_chemistry' },
]

const STEP_LABELS = ['Siwa', 'Sinai', 'Ports', 'Export', 'Quote']

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
        {/* layered backdrop (parallaxed by GSAP) */}
        <div data-hero-bg className="absolute inset-[-12%] z-0 pointer-events-none" aria-hidden="true">
          {heroPhoto && (
            <Image src={heroPhoto} alt="" fill sizes="100vw" preload className="object-cover opacity-[0.16]" />
          )}
          {heroPhoto && <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/70 to-white/95" />}
          <div className="absolute inset-0 egg-hero-glow" />
          <div className="absolute inset-0 egg-grid-light opacity-70" />
          {/* slow compass ring */}
          <svg className="absolute -right-[12%] top-[8%] w-[min(78vw,760px)] h-[min(78vw,760px)] opacity-[0.35] animate-spin-slow" viewBox="0 0 400 400" fill="none" aria-hidden="true">
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
            <span className="text-[#7a8290]">Est. 2014 · Cairo · Damietta · 60+ markets</span>
          </p>

          {/* headline */}
          <div className="max-w-5xl w-full py-12 sm:py-16">
            <h1 className={`${display.className} egg-rise text-[clamp(2.7rem,8vw,7rem)] font-normal leading-[0.98] tracking-[-0.02em] text-[#14161a]`} style={{ animationDelay: '.12s' }}>
              Egypt&rsquo;s industrial<br />
              <span className="italic text-[#3f4650]">export operator</span><span className="text-[#ff6321]">.</span>
            </h1>
            <p className="egg-rise mt-7 sm:mt-9 text-base sm:text-lg lg:text-[1.3rem] max-w-2xl leading-relaxed text-[#3f4650]" style={{ animationDelay: '.2s' }}>
              A multinational B2B commodity house — sourcing, shipping and developing Egyptian
              salt, cement, fertilizers, chemicals, minerals, agro and metals for industrial
              buyers across sixty-plus destination markets. Scroll to follow one cargo from the
              salt lakes of Siwa to a chlor-alkali plant overseas.
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
            </div>
          </div>

          {/* metrics + certifications */}
          <div className="egg-rise grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden ring-1 ring-[#14161a]/10 bg-[#14161a]/10 shadow-[0_20px_50px_-30px_rgba(20,22,26,.35)]" style={{ animationDelay: '.38s' }}>
            {METRICS.map(m => (
              <div key={m.label} className="bg-white/90 backdrop-blur px-6 py-5 sm:py-6">
                <p className={`${display.className} text-[2.4rem] sm:text-[2.9rem] leading-none tracking-tight text-[#ff6321]`}>
                  <span data-count={m.value} data-suffix={m.suffix}>{m.value}{m.suffix}</span>
                </p>
                <p className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] text-[#7a8290] mt-3">{m.label}</p>
              </div>
            ))}
          </div>
          <div className="egg-rise mt-6 flex flex-wrap items-center justify-between gap-x-5 gap-y-2" style={{ animationDelay: '.46s' }}>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[10px] sm:text-[11px] font-mono tracking-[0.14em] text-[#8a93a3]">
              {CERTS.map(c => <span key={c} className="whitespace-nowrap hover:text-[#b8862b] transition-colors">{c}</span>)}
            </div>
            <a href="#story" className="hidden sm:inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#7a8290] hover:text-[#14161a] transition-colors">
              Follow the salt <span className="egg-bounce inline-block">↓</span>
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
                  <span className="text-[#ff6321] mr-6">✦</span>{t}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#f6f7f9] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#f6f7f9] to-transparent" />
      </div>

      {/* ── 3. SCROLLYTELLING — text scrolls, canvas sticks ─────────── */}
      <section id="story" className="relative px-4 sm:px-8 lg:px-16 pt-6 lg:pt-10 bg-white">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16">

          {/* ── Sticky visual canvas (right on desktop, top strip on mobile) */}
          <div className="sticky top-14 sm:top-16 lg:top-24 z-10 lg:col-start-2 lg:row-start-1 lg:self-start">
            <div data-canvas className="relative w-full h-[38vh] sm:h-[44vh] lg:h-[calc(100vh-7.5rem)] min-h-[240px] rounded-2xl lg:rounded-3xl overflow-hidden ring-1 ring-[#14161a]/10 bg-[#eef5fb] shadow-[0_30px_70px_-35px_rgba(20,22,26,.45)]">
              <SceneSiwa />
              <SceneSinai />
              <SceneLogistics />
              <SceneGlobal />
              <SceneDesk email={email} phone={phone} phoneE164={phoneE164} />

              {/* progress rail */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-1.5 rounded-full bg-white/85 backdrop-blur px-2.5 py-1.5 ring-1 ring-[#14161a]/10 shadow-sm" aria-hidden="true">
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
              <Eyebrow n="01" tone={C.tealText}>Source · Siwa Oasis & Qattara Depression</Eyebrow>
              <h2 data-rise className={`${display.className} egg-h2`}>
                Where the salt begins: <span className="italic text-[#0b8f84]">ultra-pure lakes</span> of the Western Desert.
              </h2>
              <p data-rise className="egg-p">
                Rock salt from the Siwa Oasis and the Qattara Depression — halite beds laid down more
                than thirty million years ago, delivering a guaranteed minimum <strong>97% NaCl</strong>{' '}
                with low calcium, magnesium and insolubles. It is the feedstock behind our food,
                pharmaceutical, cosmetic and chlor-alkali grades, and the origin point of the{' '}
                <Link href="/products/salt" className="egg-inline">Salt</Link> division — the first of our seven
                commodity divisions.
              </p>
              <div data-rise className="egg-nodes">
                <DivisionNode div={byId(PRODUCT_DIVISIONS, 'salt')} />
                <Node href={SALT_GRADES.food.path}     tone={C.teal}>{SALT_GRADES.food.label}</Node>
                <Node href={SALT_GRADES.pharma.path}   tone={C.teal}>{SALT_GRADES.pharma.label}</Node>
                <Node href={SALT_GRADES.cosmetic.path} tone={C.gold}>{SALT_GRADES.cosmetic.label}</Node>
                <Node href={app('cosmetic').path}      tone={C.gold}>{app('cosmetic').icon} {app('cosmetic').label}</Node>
                <Node href={app('pharmaceutical').path} tone={C.gold}>{app('pharmaceutical').icon} {app('pharmaceutical').label}</Node>
              </div>
              <Facts data-rise items={[
                ['≥ 97%', 'NaCl, rock salt floor'],
                ['30 M yrs', 'halite formation'],
                ['< 12 h', 'mine to berth'],
              ]} />
            </article>

            {/* STEP 2 — Sinai */}
            <article data-step="1" className="egg-step">
              <Eyebrow n="02" tone={C.oceanText}>Source · North Sinai & the Red Sea coast</Eyebrow>
              <h2 data-rise className={`${display.className} egg-h2`}>
                Sea salt at <span className="italic text-[#0369a1]">industrial scale</span> from the Bardawil and El-Arish pans.
              </h2>
              <p data-rise className="egg-p">
                Solar-evaporated sea salt from North Sinai (the Bardawil lagoon and El-Arish coast) and
                the Red Sea pans at Ain Sokhna — raw 94–97%, washed 97.5–98% and double-washed 99%+.
                Screened to <Link href="/standards/en-16811-1" className="egg-inline">EN 16811-1</Link> Type 1 / Type 2
                road-salt gradings, ASTM D632 / AASHTO M-143 for North America, BS 3247 for the UK and
                GOST 13830 for CIS tenders. Kiln-dried or natural moisture, anti-caking E535 on request —
                the high-capacity source behind our de-icing and industrial grades.
              </p>
              <div data-rise className="egg-nodes">
                <Node href={SALT_GRADES.deicing.path}    tone={C.ocean}>❄️ {SALT_GRADES.deicing.label}</Node>
                <Node href={SALT_GRADES.industrial.path} tone={C.ocean}>🏭 {SALT_GRADES.industrial.label}</Node>
                <Node href={SALT_GRADES.pool.path}       tone={C.ocean}>{SALT_GRADES.pool.label}</Node>
                <Node href={app('deicing').path}         tone="#64748b">{app('deicing').icon} {app('deicing').label}</Node>
                <Node href={svc('added-value').path}     tone="#a855f7">{svc('added-value').icon} {svc('added-value').label}</Node>
                <Node href="/trade-tools/deicing-salt-standards" tone="#64748b">📋 84 national de-icing standards</Node>
              </div>
              <Facts data-rise items={[
                ['0/2 – 10/40', 'mm gradings in stock'],
                ['≤ 1.5%', 'kiln-dried moisture'],
                ['240 MT', 'minimum order'],
              ]} />
            </article>

            {/* STEP 3 — Logistics */}
            <article data-step="2" className="egg-step">
              <Eyebrow n="03" tone={C.orangeText}>Logistics · extraction to berth in under twelve hours</Eyebrow>
              <h2 data-rise className={`${display.className} egg-h2`}>
                Every source sits within a day of a <span className="italic text-[#d9501a]">Mediterranean berth</span>.
              </h2>
              <p data-rise className="egg-p">
                Rock salt from Siwa and Qattara runs east to <Link href="/ports/el-dekheila-salt" className="egg-inline">El Dekheila</Link>,{' '}
                <Link href="/ports/alexandria-salt" className="egg-inline">Alexandria</Link> and{' '}
                <Link href="/ports/damietta-salt" className="egg-inline">Damietta</Link>; Sinai sea salt loads at{' '}
                <Link href="/ports/port-said-east-salt" className="egg-inline">Port Said East</Link>, Damietta and Al-Arish, with{' '}
                <Link href="/ports/ain-sokhna-salt" className="egg-inline">Ain Sokhna</Link> serving the Red Sea lanes. Our own
                stevedoring, vessel-agency and documentation teams work the berths — the same terminals that
                load our <Link href="/products/construction" className="egg-inline">Construction</Link> (cement & clinker),{' '}
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
                  return s ? <Node key={id} href={s.path} tone={s.color}>{s.icon} {s.label}</Node> : null
                })}
                <Node href="/services" tone="#0d9488">All services →</Node>
              </div>
            </article>

            {/* STEP 4 — Global export */}
            <article data-step="3" className="egg-step">
              <Eyebrow n="04" tone={C.oceanText}>Export · 60+ destination markets</Eyebrow>
              <h2 data-rise className={`${display.className} egg-h2`}>
                From an origin port on the Suez corridor <span className="italic text-[#0369a1]">to the factory gate</span>.
              </h2>
              <p data-rise className="egg-p">
                FOB, CIF or CFR — Handysize to Panamax bulk, or containerised FIBC. Chlor-alkali and PVC
                plants in Europe and India, municipal water-treatment utilities across the Gulf and Africa,
                highway agencies in the UK, the Nordics and North America. Alongside salt, the same export
                desk ships cement, urea and NPK, caustic soda and soda ash, silica sand, steel and edible
                oils — one counterparty, seven divisions, twenty per cent of world seaborne trade passing
                our front door.
              </p>
              <div data-rise className="egg-nodes">
                {['industrial_chemistry', 'water_treatment', 'deicing', 'oil_gas'].map(id => {
                  const a = app(id)
                  return a ? <Node key={id} href={a.path} tone={C.ocean}>{a.icon} {a.label}</Node> : null
                })}
                <Node href="/applications" tone={C.ocean}>All applications →</Node>
                <Node href="/global-presence" tone={C.gold}>🌍 Global presence — 60+ markets</Node>
              </div>

              {/* Seven divisions — interactive supply-chain nodes (exact nav naming) */}
              <div data-rise className="mt-9">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#7a8290]">Seven commodity divisions</p>
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
            <article data-step="4" id="quote" className="egg-step scroll-mt-24">
              <Eyebrow n="05" tone={C.orangeText}>Request a quote · 24-hour response SLA</Eyebrow>
              <h2 data-rise className={`${display.className} egg-h2`}>
                Tell us the tonnage. <span className="italic text-[#d9501a]">We price it by tomorrow.</span>
              </h2>
              <p data-rise className="egg-p">
                Our export desk sits in Damietta and Cairo. Structured requests get a priced FOB / CIF / CFR
                offer, a Certificate of Analysis and the available L/C document set within 24 hours. Your
                details go to the trade desk only — no marketing email.
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
                      <option>Pool & water-treatment grade (softener, ion-exchange)</option>
                      <option>Food grade (ISO 22000 / HACCP / Halal)</option>
                      <option>Pharmaceutical grade (USP / BP / EP)</option>
                      <option>Cosmetic & spa grade</option>
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
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className={`${display.className} text-2xl text-[#14161a] mb-2`}>Request received — thank you.</h3>
                  <p className="text-sm text-[#3f4650] max-w-md mx-auto leading-relaxed">
                    The export desk reviews every request within an hour and replies with a priced offer within 24 hours.
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

      {/* ── 4. WHAT WE DO (preserved pillar links) ──────────────────── */}
      <section className="border-t border-[#14161a]/10 mt-8 lg:mt-16 bg-white">
        <SectionLabel>What we do</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <div key={p.tag} data-reveal className={`group px-6 sm:px-10 lg:px-14 py-12 border-t border-[#14161a]/10 ${i > 0 ? 'md:border-l md:border-t-0' : ''} hover:bg-[#f6f7f9] transition-colors duration-500`}>
              <div className="flex items-baseline gap-4 mb-6">
                <span className={`${display.className} text-2xl text-[#c9ced6] group-hover:text-[#b8862b] transition-colors duration-500`}>{p.n}</span>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#d9501a]">{p.tag}</p>
              </div>
              <p className="text-[15px] text-[#3f4650] leading-relaxed mb-8">{p.body}</p>
              <Link href={p.href} className="group/l inline-flex items-center gap-2 text-sm text-[#3f4650] hover:text-[#14161a] transition-colors">
                <span className="egg-ul pb-0.5">{p.cta}</span>
                <span className="transition-transform duration-300 group-hover/l:translate-x-1">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. RECENT THINKING ──────────────────────────────────────── */}
      {caseStudies.length > 0 && (
        <section className="border-t border-[#14161a]/10 bg-white">
          <div className="flex items-center justify-between px-6 sm:px-10 lg:px-16 pt-12 pb-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#7a8290]">Recent thinking</p>
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
          Export license {settings?.exportLicense || '600010794'} · Commercial registry {settings?.commercialRegistry || '73418'} · Tax card {settings?.taxCard || '655-527-427'} · Cairo + Damietta, Egypt
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

/* ─── visual scenes (sticky canvas layers) — bright editions ──────────── */

function SceneSiwa() {
  return (
    <div data-scene="0" className="egg-scene">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(85% 70% at 50% 80%, #9ff0e4 0%, #d6faf4 45%, #f2fbfa 100%)' }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <radialGradient id="egg-lake" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#7ff3e6" stopOpacity="1" />
            <stop offset="55%" stopColor="#14b8a6" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0f766e" stopOpacity="0.95" />
          </radialGradient>
          <radialGradient id="egg-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#e0b15a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#e0b15a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="egg-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff1c2" />
            <stop offset="50%" stopColor="#e0b15a" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
        </defs>
        <circle cx="660" cy="120" r="130" fill="url(#egg-sun)" />
        {/* sand dunes */}
        <path d="M0 200 C 140 130 250 240 420 180 S 690 120 800 200 L800 0 L0 0 Z" fill="#f3e7cf" opacity="0.95" />
        <path d="M0 240 C 120 200 230 270 380 230 S 640 190 800 250 L800 0 L0 0 Z" fill="#e9d9b8" opacity="0.6" />
        {/* lake */}
        <ellipse cx="400" cy="420" rx="345" ry="135" fill="url(#egg-lake)" />
        <ellipse cx="400" cy="420" rx="352" ry="142" fill="none" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="1.5" strokeDasharray="2 7" />
        {[[70, 26, 0], [140, 52, 1], [215, 82, 2], [290, 112, 3]].map(([rx, ry, i]) => (
          <ellipse key={i} className="egg-ripple" style={{ animationDelay: `${i * 1.1}s` }} cx="400" cy="420" rx={rx} ry={ry} fill="none" stroke="#ffffff" strokeOpacity={0.7 - i * 0.12} strokeWidth="1.2" />
        ))}
        {/* light caustics */}
        <path d="M120 430 q 40 -14 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />
        <path d="M160 470 q 40 -12 80 0 t 80 0 t 80 0 t 80 0 t 80 0" fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1" />
        {/* gold halite crystals on the crust */}
        {[
          '90,540 112,505 142,532 126,568', '150,585 170,555 196,575 182,600', '640,520 666,492 700,518 684,552',
          '700,560 722,536 748,556 734,586', '40,580 58,552 84,574 70,600', '590,575 612,550 640,570 626,598',
          '300,560 318,538 340,556 328,584', '470,575 490,550 514,572 500,598',
        ].map((pts, i) => (
          <polygon key={i} className="egg-glint" style={{ animationDelay: `${i * 0.45}s` }} points={pts} fill="url(#egg-gold)" opacity="0.9" stroke="#a16207" strokeOpacity="0.35" strokeWidth="0.6" />
        ))}
      </svg>
      <SceneLabel kicker="Siwa Oasis · Qattara Depression" title="Rock salt · ≥ 97% NaCl" tone={C.tealText}
        chips={[['Food', SALT_GRADES.food.path], ['Pharma', SALT_GRADES.pharma.path], ['Cosmetic', SALT_GRADES.cosmetic.path]]} />
    </div>
  )
}

function SceneSinai() {
  return (
    <div data-scene="1" className="egg-scene">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #f3f8fe 0%, #dbeafe 40%, #bae6fd 100%)' }} />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="egg-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="1" />
          </linearGradient>
          <radialGradient id="egg-dawn" cx="70%" cy="20%" r="60%">
            <stop offset="0%" stopColor="#fdba74" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fdba74" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#egg-dawn)" />
        {/* mountain ridges — deep earth tones, far → near */}
        <path d="M0 330 L90 240 L160 300 L240 190 L330 290 L420 220 L500 300 L600 200 L700 280 L800 230 L800 600 L0 600 Z" fill="#b08b66" />
        <path d="M0 400 L110 320 L200 380 L290 300 L380 370 L470 310 L560 380 L650 320 L740 370 L800 330 L800 600 L0 600 Z" fill="#7a573a" />
        <path d="M0 460 L140 400 L260 450 L360 390 L480 450 L600 400 L720 450 L800 420 L800 600 L0 600 Z" fill="#4d3523" />
        {/* snow / salt caps */}
        <path d="M240 190 L228 212 L252 206 Z M600 200 L588 222 L612 214 Z M290 300 L280 318 L302 312 Z" fill="#ffffff" opacity="0.95" />
        {/* evaporation pans */}
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={i} x={30 + i * 55} y={478 + (i % 2) * 6} width="44" height="16" fill="#ffffff" fillOpacity={0.75 + (i % 3) * 0.08} stroke="#b8862b" strokeOpacity="0.7" strokeWidth="0.7" />
        ))}
        {/* sea */}
        <rect x="0" y="505" width="800" height="95" fill="url(#egg-sea)" />
        {[0, 1, 2].map(i => (
          <path key={i} className="egg-wave" style={{ animationDelay: `${i * 0.8}s` }}
            d={`M-40 ${520 + i * 22} q 40 -9 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0`}
            fill="none" stroke="#ffffff" strokeOpacity={0.7 - i * 0.18} strokeWidth="1.2" strokeDasharray="14 10" />
        ))}
      </svg>
      <SceneLabel kicker="North Sinai · Bardawil / El-Arish · Red Sea" title="Sea salt · industrial & de-icing" tone={C.oceanText}
        chips={[['De-icing', SALT_GRADES.deicing.path], ['Industrial', SALT_GRADES.industrial.path], ['EN 16811-1', '/standards/en-16811-1']]} />
    </div>
  )
}

function SceneLogistics() {
  const SOURCES = [
    { x: 75,  y: 140, label: 'Siwa',     tone: '#b8862b' },
    { x: 175, y: 100, label: 'Qattara',  tone: '#b8862b' },
    { x: 462, y: 46,  label: 'Bardawil', tone: '#0369a1' },
  ]
  return (
    <div data-scene="2" className="egg-scene">
      {/* vivid ocean around a sand-toned landmass */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(80% 60% at 50% 0%, #7dd3fc 0%, #bae6fd 45%, #e0f2fe 100%)' }} />
      <div className="absolute inset-0 egg-grid-light opacity-60" />
      <svg className="absolute inset-0 w-full h-full p-4 sm:p-6" viewBox="0 0 680 520" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Map of Egypt showing salt routes from Siwa, Qattara and Sinai converging on Alexandria, El Dekheila, Damietta, Port Said East, Al-Arish and Ain Sokhna">
        <defs>
          <linearGradient id="egg-land" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbf3e3" />
            <stop offset="100%" stopColor="#ead9b8" />
          </linearGradient>
          <filter id="egg-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Egypt landmass (simplified outline, lon/lat projected) */}
        <polygon
          points="55,20 160,32 282,46 295,40 320,27 390,29 418,38 490,43 512,35 545,125 533,150 515,212 460,155 427,102 417,120 432,145 455,182 490,237 497,262 514,295 545,346 575,405 645,500 50,500 50,150 35,100"
          fill="url(#egg-land)" stroke="#0284c7" strokeOpacity="0.8" strokeWidth="1.2" strokeLinejoin="round" />
        {/* Nile */}
        <path d="M320 27 Q 345 70 362 97 M390 29 Q 372 70 362 97 Q 352 170 360 240 Q 395 290 430 315 Q 440 360 445 395" fill="none" stroke="#0fb5a5" strokeOpacity="0.9" strokeWidth="1.4" />
        <text x="40" y="455" className="egg-maptext" fill="#8a6d3b">WESTERN DESERT</text>
        <text x="120" y="16" className="egg-maptext" fill="#0369a1">MEDITERRANEAN SEA</text>
        <text x="560" y="300" className="egg-maptext" fill="#0369a1">RED SEA</text>
        <text x="470" y="110" className="egg-maptext" fill="#6b4f35">SINAI</text>
        {/* routes (drawn in by GSAP) */}
        {ROUTES.map((r, i) => (
          <path key={i} data-draw d={r.d} fill="none" stroke={r.from === 'bardawil' ? '#0284c7' : '#b8862b'} strokeOpacity="0.95" strokeWidth="1.8" strokeLinecap="round" filter="url(#egg-glow)" />
        ))}
        {/* sources */}
        {SOURCES.map(s => (
          <g key={s.label} data-pop>
            <circle cx={s.x} cy={s.y} r="5" fill={s.tone} filter="url(#egg-glow)" />
            <circle cx={s.x} cy={s.y} r="11" fill="none" stroke={s.tone} strokeOpacity="0.6" strokeWidth="1" />
            <text x={s.x + (s.label === 'Bardawil' ? 12 : -12)} y={s.y + (s.label === 'Bardawil' ? 36 : 22)} textAnchor="start" className="egg-maptext" fill={s.tone}>{s.label.toUpperCase()}</text>
          </g>
        ))}
        {/* Cairo */}
        <g data-pop>
          <circle cx="362" cy="97" r="3" fill="#14161a" />
          <text x="372" y="92" className="egg-maptext" fill="#14161a">CAIRO HQ</text>
        </g>
        {/* ports — each is a link */}
        {PORTS.map(p => (
          <a key={p.id} href={p.path} data-pop className="egg-port">
            <circle cx={p.x} cy={p.y} r="14" fill="#ff6321" fillOpacity="0.22" className="egg-pulse" />
            <circle cx={p.x} cy={p.y} r="5.5" fill="#ff6321" filter="url(#egg-glow)" />
            <circle cx={p.x} cy={p.y} r="2" fill="#fff" />
            <text x={p.x + p.lx} y={p.y + p.ly} textAnchor={p.anchor} className="egg-maptext egg-maptext--port" fill="#14161a">{p.name}</text>
          </a>
        ))}
      </svg>
      <SceneLabel kicker="Logistics network · 7 Egyptian seaports" title="Alexandria · Port Said · Damietta" tone={C.orangeText}
        chips={[['Loading ports', '/services/loading-ports'], ['Logistics & Freight', svc('logistics').path], ['Port Services', svc('port-services').path]]} />
    </div>
  )
}

function SceneGlobal() {
  return (
    <div data-scene="3" className="egg-scene egg-scene--global">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(70% 55% at 58% 35%, #e0f2fe 0%, #f1f7fd 45%, #ffffff 100%)' }} />
      {/* viewBox is cropped to the populated band of the 900×480 arc map so the
          nodes + labels fill the canvas instead of letterboxing to a thin strip */}
      <svg className="absolute inset-0 w-full h-full p-3 sm:p-5" viewBox="120 30 740 310" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Trade routes from Egypt to chemical, water-treatment and road-management buyers in Europe, the Americas, the Gulf, India, Africa and the Far East">
        <defs>
          <radialGradient id="egg-hub" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff6321" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ff6321" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* graticule */}
        {Array.from({ length: 9 }).map((_, i) => <line key={`v${i}`} x1={i * 112.5} y1="0" x2={i * 112.5} y2="480" stroke="#0369a1" strokeOpacity="0.1" />)}
        {Array.from({ length: 5 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 120} x2="900" y2={i * 120} stroke="#0369a1" strokeOpacity="0.1" />)}
        <ellipse cx="450" cy="240" rx="440" ry="225" fill="none" stroke="#0284c7" strokeOpacity="0.2" strokeDasharray="3 9" />
        {/* arcs from the Egyptian hub */}
        {DESTINATIONS.map((d, i) => {
          const cx = (HUB.x + d.x) / 2
          const cy = Math.min(HUB.y, d.y) - 55 - Math.abs(HUB.x - d.x) * 0.12
          return <path key={i} data-draw d={`M${HUB.x} ${HUB.y} Q ${cx} ${cy} ${d.x} ${d.y}`} fill="none" stroke="#0284c7" strokeOpacity="0.85" strokeWidth="1.4" strokeLinecap="round" />
        })}
        {/* hub */}
        <g data-pop>
          <circle cx={HUB.x} cy={HUB.y} r="34" fill="url(#egg-hub)" className="egg-pulse" />
          <circle cx={HUB.x} cy={HUB.y} r="7" fill="#ff6321" />
          <circle cx={HUB.x} cy={HUB.y} r="2.5" fill="#fff" />
          <text x={HUB.x - 12} y={HUB.y + 30} textAnchor="end" className="egg-maptext" fill="#d9501a">EGYPT · SUEZ CORRIDOR</text>
        </g>
        {/* destinations — each a link to its application landing */}
        {DESTINATIONS.map((d, i) => {
          const a = app(d.appId)
          const left = d.x < HUB.x - 40
          return (
            <a key={i} href={a?.path || '/applications'} data-pop className="egg-port">
              <circle cx={d.x} cy={d.y} r="10" fill="#0284c7" fillOpacity="0.18" />
              <circle cx={d.x} cy={d.y} r="4" fill="#0284c7" />
              <text x={d.x + (left ? -12 : 12)} y={d.y - 4} textAnchor={left ? 'end' : 'start'} className="egg-maptext egg-maptext--port" fill="#14161a">{d.market}</text>
              <text x={d.x + (left ? -12 : 12)} y={d.y + 11} textAnchor={left ? 'end' : 'start'} className="egg-maptext" fill="#0369a1">{d.use}</text>
            </a>
          )
        })}
      </svg>
      <SceneLabel kicker="Global export · 60+ markets · FOB / CIF / CFR" title="Chemical · water treatment · road management" tone={C.oceanText}
        chips={[[app('industrial_chemistry').label, app('industrial_chemistry').path], [app('water_treatment').label, app('water_treatment').path], [app('deicing').label, app('deicing').path]]} />
    </div>
  )
}

function SceneDesk({ email, phone, phoneE164 }) {
  const STAGES = [
    ['T + 0 h',  'RFQ received',            'Auto-triaged to the commodity desk · reference issued'],
    ['T + 1 h',  'Reviewed by export desk', 'Spec match · origin port · vessel or container plan'],
    ['T + 24 h', 'Priced offer',            'FOB / CIF / CFR · sample CoA · packing options'],
    ['Then',     'Documents & loading',     'L/C-bank set · EUR1 / COO · SGS / TÜV inspection at berth'],
  ]
  return (
    <div data-scene="4" className="egg-scene">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(80% 60% at 50% 100%, #ffe4d6 0%, #fff4ec 40%, #ffffff 100%)' }} />
      <div className="absolute inset-0 egg-grid-light opacity-50" />
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md rounded-2xl ring-1 ring-[#14161a]/10 bg-white/90 backdrop-blur p-4 sm:p-6 shadow-[0_20px_50px_-30px_rgba(20,22,26,.4)]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#d9501a]">Export desk · Cairo + Damietta</p>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-700"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />ONLINE</span>
          </div>
          <ol className="space-y-2.5 sm:space-y-3.5">
            {STAGES.map(([t, h, s], i) => (
              <li key={t} data-pop className="flex gap-3">
                <span className="shrink-0 w-14 text-[10px] font-mono text-[#7a8290] pt-0.5">{t}</span>
                <span className="relative shrink-0 mt-1.5 w-2 h-2 rounded-full" style={{ background: i === 2 ? '#ff6321' : '#0284c7', boxShadow: `0 0 0 4px ${i === 2 ? 'rgba(255,99,33,.18)' : 'rgba(2,132,199,.16)'}` }} />
                <span className="min-w-0">
                  <span className="block text-sm text-[#14161a] leading-tight">{h}</span>
                  <span className="hidden sm:block text-[11px] text-[#5b6472] leading-snug mt-0.5">{s}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-4 pt-3 border-t border-[#14161a]/10 text-[11px] font-mono text-[#7a8290] hidden sm:block">
            <a href={`mailto:${email}`} className="text-[#14161a] hover:text-[#ff6321]">{email}</a> · <a href={`tel:${phoneE164}`} className="hover:text-[#14161a]">{phone}</a>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── small presentational pieces ─────────────────────────────────────── */

function SceneLabel({ kicker, title, tone, chips = [] }) {
  return (
    <div className="absolute left-3 right-3 bottom-3 sm:left-5 sm:right-auto sm:bottom-5 z-20 max-w-[92%] rounded-xl sm:rounded-2xl bg-white/88 backdrop-blur ring-1 ring-[#14161a]/10 shadow-[0_12px_30px_-18px_rgba(20,22,26,.45)] px-3.5 py-2.5 sm:px-4 sm:py-3">
      <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.24em]" style={{ color: tone }}>{kicker}</p>
      <p className="text-sm sm:text-base text-[#14161a] mt-0.5 leading-tight">{title}</p>
      {chips.length > 0 && (
        <div className="hidden sm:flex flex-wrap gap-1.5 mt-2">
          {chips.map(([label, href]) => (
            <Link key={href + label} href={href} className="text-[10px] font-mono uppercase tracking-[0.12em] px-2 py-1 rounded-md ring-1 ring-[#14161a]/15 text-[#3f4650] hover:text-[#14161a] hover:ring-[#14161a]/40 bg-white transition-colors">
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

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
      <span className="relative z-10">{children}</span>
    </Link>
  )
}

function DivisionNode({ div }) {
  if (!div) return null
  return (
    <Link href={div.path} className="egg-node egg-node--division" style={{ '--tone': div.color }}>
      <span className="text-base leading-none">{div.icon}</span>
      <span className="relative z-10 font-semibold">{div.label} division</span>
    </Link>
  )
}

function DivisionCard({ div }) {
  return (
    <Link href={div.path} className="group relative flex flex-col gap-2.5 rounded-xl p-3.5 ring-1 ring-[#14161a]/10 bg-white hover:bg-[#f6f7f9] hover:ring-[#14161a]/25 hover:shadow-[0_14px_30px_-20px_rgba(20,22,26,.35)] transition-all duration-300 overflow-hidden">
      <span className="pointer-events-none absolute -right-6 -top-6 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-35 transition-opacity duration-500" style={{ background: div.color }} />
      <span className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: `${div.color}1f`, boxShadow: `inset 0 0 0 1px ${div.color}66` }}>{div.icon}</span>
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
          <dd className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#7a8290] mt-1.5">{l}</dd>
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
  radial-gradient(60% 50% at 85% 10%,rgba(255,99,33,.14),transparent 60%),
  radial-gradient(55% 45% at 10% 85%,rgba(15,181,165,.18),transparent 60%),
  radial-gradient(70% 60% at 50% 50%,rgba(2,132,199,.10),transparent 70%)}
.egg-rise{opacity:0;transform:translateY(18px);animation:eggRise .9s cubic-bezier(.2,.7,.2,1) forwards}
@keyframes eggRise{to{opacity:1;transform:none}}
.egg-marquee{display:flex;width:max-content;animation:eggMarquee 42s linear infinite}
@keyframes eggMarquee{to{transform:translateX(-50%)}}
.egg-ul{background-image:linear-gradient(#ff6321,#ff6321);background-repeat:no-repeat;background-position:0 100%;background-size:0% 1.5px;transition:background-size .4s cubic-bezier(.2,.7,.2,1)}
.group:hover .egg-ul{background-size:100% 1.5px}
.egg-btn{transition:transform .3s}.egg-btn:hover{transform:scale(1.03)}
.egg-bounce{animation:eggBounce 1.8s ease-in-out infinite}
@keyframes eggBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(4px)}}
.egg-inline{color:#14161a;font-weight:600;text-decoration:underline;text-decoration-color:rgba(15,181,165,.55);text-underline-offset:4px;margin:0 .2em;transition:text-decoration-color .2s,color .2s}
.egg-inline:hover{color:#0b8f84;text-decoration-color:#0fb5a5}

/* scenes — all hidden except the first until GSAP takes over */
.egg-scene{position:absolute;inset:0;will-change:opacity,transform;opacity:0;visibility:hidden}
.egg-scene:first-child{opacity:1;visibility:visible}
.egg-scene:not(.is-active) .egg-ripple,.egg-scene:not(.is-active) .egg-glint,.egg-scene:not(.is-active) .egg-wave,.egg-scene:not(.is-active) .egg-pulse{animation-play-state:paused}
.egg-ripple{transform-box:fill-box;transform-origin:center;animation:eggRipple 4.4s ease-out infinite}
@keyframes eggRipple{0%{transform:scale(.6);opacity:.9}100%{transform:scale(1.25);opacity:0}}
.egg-glint{animation:eggGlint 3.2s ease-in-out infinite}
@keyframes eggGlint{0%,100%{opacity:.55}50%{opacity:1}}
.egg-wave{animation:eggWave 6s linear infinite}
@keyframes eggWave{to{stroke-dashoffset:-240}}
.egg-pulse{transform-box:fill-box;transform-origin:center;animation:eggPulse 2.4s ease-out infinite}
@keyframes eggPulse{0%{transform:scale(.6);opacity:.9}100%{transform:scale(1.6);opacity:0}}
.egg-maptext{font-family:var(--font-geist-mono),ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;letter-spacing:.14em;paint-order:stroke fill;stroke:rgba(255,255,255,.85);stroke-width:3px;stroke-linejoin:round}
.egg-maptext--port{font-size:11.5px;letter-spacing:.04em;font-weight:600}
.egg-scene--global .egg-maptext{font-size:9px;letter-spacing:.1em}
.egg-scene--global .egg-maptext--port{font-size:10.5px;letter-spacing:.03em}
.egg-port{cursor:pointer}.egg-port:hover text{fill:#ff6321}.egg-port:hover circle{filter:brightness(1.1)}

/* progress rail */
.egg-dot{display:inline-block;width:7px;height:7px;border-radius:999px;background:rgba(20,22,26,.18);transition:all .35s cubic-bezier(.2,.7,.2,1)}
.egg-dot.is-on{width:24px;background:#ff6321;box-shadow:0 0 0 3px rgba(255,99,33,.18)}
.egg-step-label{display:none}
.egg-sc[data-active="0"] .egg-step-label:nth-child(1),.egg-sc[data-active="1"] .egg-step-label:nth-child(2),.egg-sc[data-active="2"] .egg-step-label:nth-child(3),.egg-sc[data-active="3"] .egg-step-label:nth-child(4),.egg-sc[data-active="4"] .egg-step-label:nth-child(5){display:inline}

/* narrative */
.egg-step{min-height:70vh;display:flex;flex-direction:column;justify-content:center;padding:3.5rem 0}
@media (min-width:1024px){.egg-step{min-height:100vh;padding:4rem 0}}
.egg-h2{font-size:clamp(1.9rem,4.2vw,3.4rem);line-height:1.04;letter-spacing:-.015em;color:#14161a;margin-top:1.25rem;font-weight:400}
.egg-p{margin-top:1.4rem;font-size:15.5px;line-height:1.75;color:#3f4650;max-width:36rem}
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
  .egg-marquee,.egg-bounce,.egg-ripple,.egg-glint,.egg-wave,.egg-pulse,.animate-spin-slow{animation:none!important}
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
        gsap.to(s, { autoAlpha: on ? 1 : 0, scale: on ? 1 : 1.04, duration: reduced ? 0 : 0.9, ease: 'power2.out', overwrite: true });
        var draws = s.querySelectorAll('[data-draw]');
        var pops  = s.querySelectorAll('[data-pop]');
        if (on) {
          if (draws.length) gsap.to(draws, { strokeDashoffset: 0, duration: reduced ? 0 : 1.7, ease: 'power2.inOut', stagger: 0.12, overwrite: true, delay: reduced ? 0 : 0.25 });
          if (pops.length) gsap.fromTo(pops, { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: reduced ? 0 : 0.55, ease: 'back.out(2.2)', stagger: 0.07, delay: reduced ? 0 : 0.55, transformOrigin: '50% 50%', overwrite: true });
        } else {
          toArr(draws).forEach(function (p) { if (p.__len) gsap.set(p, { strokeDashoffset: p.__len }); });
          if (pops.length) gsap.set(pops, { autoAlpha: 0, scale: 0.5, transformOrigin: '50% 50%' });
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

      // Narrative steps → scene switching + staggered text reveal.
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

    // Re-sync the visual scene to whichever step the viewport is in (same
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
      return; // CDN unavailable — page stays fully readable, first scene shown by CSS
    }
    scan();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  }
  boot();
})();
`
