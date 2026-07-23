import Link from 'next/link'
import Image from 'next/image'
import { Fraunces } from 'next/font/google'
import { getCaseStudies, getSiteSettings, getPageByPath, PRODUCT_DIVISIONS } from '../lib/corporatePages'
import { getCurrentBrand, brandMeta } from '../lib/brand'
import MarkdownBody from '../components/MarkdownBody'
import HeroBgSlider from '../components/HeroBgSlider'

export const dynamic = 'force-dynamic'

// Distinctive high-contrast display serif — the "trading house" gravitas that
// a refined B2B commodity conglomerate should carry. Paired with the site's
// Geist sans for body. Self-hosted + preloaded by next/font (no CLS).
const display = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const BASE = 'https://egyptglobe.com'

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

/* ─── static data ─────────────────────────────────────────────────────── */

const METRICS = [
  { value: '60+', label: 'Export markets' },
  { value: '7',   label: 'Egyptian seaports' },
  { value: '7',   label: 'Commodity divisions' },
  { value: '24h', label: 'RFQ response SLA' },
]

const PILLARS = [
  { n: '01', tag: 'Export Operations', body: 'Commodity sourcing, vessel chartering, freight forwarding and L/C bank documentation. We run the full chain — extraction point to buyer warehouse — across salt, cement, fertilizers, chemicals, minerals, agro and metals.', href: '/products', cta: 'Our operations' },
  { n: '02', tag: 'Industrial Development', body: 'We invest in processing capacity alongside trading. Value-added manufacturing, Egyptian industrial-zone development and greenfield partnerships that build durable margin rather than pure brokerage spread.', href: '/about', cta: 'About the group' },
  { n: '03', tag: 'R&D + Innovation', body: "Application testing, new-grade qualification and process optimisation — executed with buyers' technical teams. We validate specifications in Egyptian facilities before the first container is loaded.", href: '/services', cta: 'Our services' },
]

const WHY_EGYPT = [
  { stat: 'Suez Canal', label: 'Transit corridor', body: "20% of global seaborne trade passes through Egyptian waters. Our products enter the world's major shipping lanes from an origin port, not a transhipment hub." },
  { stat: '14 days', label: 'Damietta → Rotterdam', body: '36 hours to Jeddah from Port Said. 5 days to Mumbai from Ain Sokhna. Seven Egyptian seaports give us lane flexibility no landlocked supplier can match.' },
  { stat: 'SEZ + GAFI', label: 'Incentive framework', body: 'Investment Law 72/2017, Special Economic Zones and 10-year tax holidays in designated industrial areas. Egypt is structurally cheaper to produce in than competing origins.' },
  { stat: '<12h', label: 'Extraction to port', body: 'Salt pans, limestone quarries, mineral belts and agricultural land all sit within 12 hours of an export terminal. The supply chain is short by design.' },
]

// Live "trading floor" ticker — ports + commodities + lanes.
const TICKER = [
  'DAMIETTA', 'ALEXANDRIA', 'AIN SOKHNA', 'PORT SAID', 'EL DEKHEILA', 'ADABIYA', 'SAFAGA',
  'SEA SALT', 'ROCK SALT', 'CEM I 42.5N', 'CLINKER', 'UREA 46%', 'DAP', 'CAUSTIC SODA',
  'GYPSUM', 'SODA ASH', 'BAUXITE', 'FELDSPAR', 'FOB', 'CIF', 'CFR',
]

/* ─── page ────────────────────────────────────────────────────────────── */

export default async function HomePage() {
  const [settings, caseStudies, cmsHome] = await Promise.all([
    getSiteSettings().catch(() => null),
    getCaseStudies({ limit: 3 }).catch(() => []),
    getPageByPath('/').catch(() => null),
  ])

  const sliderPhotos = [
    cmsHome?.hero_photo_url,
    ...(Array.isArray(cmsHome?.gallery_urls) ? cmsHome.gallery_urls : []),
  ].filter(Boolean)
  const hasPhotos = sliderPhotos.length > 0
  const heroBody = cmsHome?.body_markdown?.trim()

  return (
    <main className="egg-lux bg-[#0a0c0f] text-[#f2ece1] min-h-screen antialiased">
      {/* scoped styles — grain, gold hairlines, marquee, staggered reveal */}
      <style>{`
        .egg-lux{--line:rgba(195,154,99,.16)}
        .egg-grain::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.5;
          background-image:radial-gradient(rgba(255,255,255,.025) 1px,transparent 1px);background-size:3px 3px;z-index:0}
        .egg-vignette::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:0;
          background:radial-gradient(120% 90% at 78% 0%,rgba(255,99,33,.09),transparent 55%),
                     radial-gradient(90% 70% at 6% 100%,rgba(195,154,99,.08),transparent 60%)}
        .egg-rise{opacity:0;transform:translateY(18px);animation:eggRise .9s cubic-bezier(.2,.7,.2,1) forwards}
        @keyframes eggRise{to{opacity:1;transform:none}}
        @media (prefers-reduced-motion:reduce){.egg-rise{animation:none;opacity:1;transform:none}}
        .egg-marquee{display:flex;width:max-content;animation:eggMarquee 42s linear infinite}
        @keyframes eggMarquee{to{transform:translateX(-50%)}}
        .egg-ul{background-image:linear-gradient(#ff6321,#ff6321);background-repeat:no-repeat;
          background-position:0 100%;background-size:0% 1.5px;transition:background-size .4s cubic-bezier(.2,.7,.2,1)}
        .group:hover .egg-ul{background-size:100% 1.5px}
      `}</style>

      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
      <section className="egg-grain egg-vignette relative min-h-[92vh] flex flex-col justify-between px-5 sm:px-10 lg:px-16 pt-20 sm:pt-24 pb-12 overflow-hidden">
        {hasPhotos && <HeroBgSlider photos={sliderPhotos} />}
        {hasPhotos && <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#0a0c0f]/85 via-[#0a0c0f]/70 to-[#0a0c0f]/95" />}

        {/* overline */}
        <p className="egg-rise relative z-10 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.32em] text-[#c39a63]" style={{ animationDelay: '.05s' }}>
          Egypt Globe Group
          <span className="text-[#5c574d] mx-2">/</span>
          <span className="text-[#9a9488]">Est. 2014 · Cairo · Damietta · 60+ markets</span>
        </p>

        {/* headline */}
        <div className="relative z-10 max-w-5xl w-full">
          <h1 className={`${display.className} egg-rise text-[clamp(2.6rem,8vw,7rem)] font-normal leading-[0.98] tracking-[-0.02em] text-[#f2ece1]`} style={{ animationDelay: '.12s' }}>
            Egypt&rsquo;s industrial<br />
            <span className="italic text-[#e9dfce]">export operator</span><span className="text-[#ff6321]">.</span>
          </h1>
          <p className="egg-rise relative z-10 mt-7 sm:mt-9 text-base sm:text-lg lg:text-[1.35rem] max-w-2xl leading-relaxed text-[#b3ac9e]" style={{ animationDelay: '.2s' }}>
            A multinational B2B commodity house — sourcing, shipping and developing
            Egyptian salt, cement, fertilizers, chemicals, minerals, agro and metals
            for industrial buyers across sixty-plus destination markets.
          </p>
          <div className="egg-rise flex flex-wrap items-center gap-6 sm:gap-9 mt-9 sm:mt-11" style={{ animationDelay: '.28s' }}>
            <Link href="/rfq" className="group relative inline-flex items-center gap-2.5 text-sm font-semibold text-[#0a0c0f] bg-[#ff6321] px-7 py-3.5 rounded-full overflow-hidden transition-transform duration-300 hover:scale-[1.03]">
              <span className="relative z-10">Request a quote</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 bg-[#ffd7bf] translate-y-full group-hover:translate-y-0 transition-transform duration-400" />
            </Link>
            <Link href="/products" className="group inline-flex items-center gap-2 text-sm text-[#c9c2b4] hover:text-[#f2ece1] transition-colors">
              <span className="egg-ul pb-0.5">Explore our operations</span>
            </Link>
          </div>
        </div>

        {/* certifications */}
        <div className="egg-rise relative z-10 flex flex-wrap gap-x-5 gap-y-1.5 text-[10px] sm:text-[11px] font-mono tracking-[0.14em] text-[#7c766a]" style={{ animationDelay: '.4s' }}>
          {['ISO 22000', 'EN 197-1', 'HACCP', 'USP / BP', 'GOEIC', 'TÜV AUSTRIA', 'SGS', 'INTERTEK'].map(c => (
            <span key={c} className="whitespace-nowrap hover:text-[#c39a63] transition-colors">{c}</span>
          ))}
        </div>
      </section>

      {/* ── 2. TICKER ───────────────────────────────────────────────── */}
      <div className="relative border-y border-[var(--line)] bg-[#0f1319] overflow-hidden">
        <div className="egg-marquee py-3.5" aria-hidden="true">
          {[0, 1].map(dup => (
            <div key={dup} className="flex shrink-0">
              {TICKER.map((t, i) => (
                <span key={`${dup}-${i}`} className="flex items-center text-[11px] font-mono tracking-[0.2em] text-[#8a8578] px-6">
                  <span className="text-[#ff6321] mr-6">✦</span>{t}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0f1319] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0f1319] to-transparent" />
      </div>

      {/* ── 1b. CMS body ────────────────────────────────────────────── */}
      {heroBody && (
        <section className="border-b border-[var(--line)]">
          <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 py-16">
            <article className="prose prose-invert max-w-none prose-headings:font-normal">
              <MarkdownBody content={heroBody} />
            </article>
          </div>
        </section>
      )}

      {/* ── 3. METRICS ──────────────────────────────────────────────── */}
      <section className="border-b border-[var(--line)]">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {METRICS.map((m, i) => (
            <div key={m.label} className={`px-8 sm:px-10 py-12 sm:py-16 ${i > 0 ? 'border-l border-[var(--line)]' : ''} ${i >= 2 ? 'border-t md:border-t-0 border-[var(--line)]' : ''} ${i === 2 ? 'border-l-0 md:border-l' : ''}`}>
              <p className={`${display.className} text-[3.4rem] sm:text-[4rem] font-normal leading-none tracking-tight text-[#ff6321]`}>
                {m.value}
              </p>
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#7c766a] mt-4">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. PILLARS ──────────────────────────────────────────────── */}
      <section className="border-b border-[var(--line)]">
        <SectionLabel>What we do</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <div key={p.tag} className={`group px-8 sm:px-10 lg:px-14 py-14 border-t border-[var(--line)] ${i > 0 ? 'md:border-l md:border-t-0' : ''} hover:bg-[#0f1319] transition-colors duration-500`}>
              <div className="flex items-baseline gap-4 mb-7">
                <span className={`${display.className} text-2xl text-[#3f3b34] group-hover:text-[#c39a63] transition-colors duration-500`}>{p.n}</span>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#ff6321]">{p.tag}</p>
              </div>
              <p className="text-[15px] text-[#a8a196] leading-relaxed mb-9">{p.body}</p>
              <Link href={p.href} className="group/l inline-flex items-center gap-2 text-sm text-[#8a8578] hover:text-[#f2ece1] transition-colors">
                <span className="egg-ul pb-0.5">{p.cta}</span>
                <span className="transition-transform duration-300 group-hover/l:translate-x-1">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. DIVISIONS ────────────────────────────────────────────── */}
      <section className="border-b border-[var(--line)]">
        <div className="flex items-center justify-between px-6 sm:px-10 lg:px-16 pt-12 pb-4">
          <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#7c766a]">Commodity divisions</p>
          <Link href="/products" className="group inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-[#8a8578] hover:text-[#c39a63] transition-colors">
            All products <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
          {PRODUCT_DIVISIONS.map((div, i) => (
            <Link key={div.id} href={div.path}
              className={[
                'group relative flex flex-col items-start gap-4 px-6 py-10 border-t border-[var(--line)] hover:bg-[#0f1319] transition-colors duration-400',
                i % 2 !== 0 ? 'border-l border-[var(--line)]' : '',
                i % 4 === 2 ? 'sm:border-l sm:border-[var(--line)]' : '',
                i === 4 ? 'lg:border-l lg:border-[var(--line)]' : '',
              ].filter(Boolean).join(' ')}>
              <span className="w-11 h-11 rounded-lg flex items-center justify-center text-2xl grayscale-[.2] group-hover:grayscale-0 transition-all duration-400 group-hover:scale-110"
                style={{ background: `${div.color}1a`, boxShadow: `inset 0 0 0 1px ${div.color}33` }}>
                {div.icon}
              </span>
              <div>
                <span className={`${display.className} block text-lg text-[#e9dfce] group-hover:text-[#f2ece1] leading-tight transition-colors`}>{div.label}</span>
                <span className="mt-1 inline-block h-[1.5px] w-0 group-hover:w-8 bg-[#ff6321] transition-all duration-400" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 6. WHY EGYPT ────────────────────────────────────────────── */}
      <section className="border-b border-[var(--line)] bg-[#0f1319] egg-grain relative">
        <SectionLabel>The case for Egypt</SectionLabel>
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2">
          {WHY_EGYPT.map((w, i) => (
            <div key={w.label} className={`px-8 sm:px-10 lg:px-14 py-12 border-t border-[var(--line)] ${i % 2 === 1 ? 'sm:border-l' : ''}`}>
              <div className="flex items-baseline gap-3.5 mb-5">
                <span className={`${display.className} text-3xl text-[#f2ece1]`}>{w.stat}</span>
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#c39a63]">{w.label}</span>
              </div>
              <p className="text-sm text-[#a8a196] leading-relaxed max-w-md">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. RECENT THINKING ──────────────────────────────────────── */}
      {caseStudies.length > 0 && (
        <section className="border-b border-[var(--line)]">
          <div className="flex items-center justify-between px-6 sm:px-10 lg:px-16 pt-12 pb-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#7c766a]">Recent thinking</p>
            <Link href="/case-studies" className="group inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-[#8a8578] hover:text-[#c39a63] transition-colors">
              All <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="divide-y divide-[var(--line)]">
            {caseStudies.map(cs => (
              <Link key={cs.path} href={cs.path} className="group flex items-center gap-6 px-8 sm:px-10 lg:px-14 py-8 hover:bg-[#0f1319] transition-colors duration-400">
                {cs.hero_photo_url && (
                  <div className="hidden sm:block shrink-0 w-16 h-16 rounded-lg overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity duration-400 ring-1 ring-[var(--line)]">
                    <Image src={cs.hero_photo_url} alt="" width={64} height={64} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#c39a63] mb-2">Case study</p>
                  <p className={`${display.className} text-lg sm:text-xl text-[#e9dfce] group-hover:text-[#f2ece1] leading-snug transition-colors`}>{cs.title}</p>
                  {cs.description && <p className="text-xs text-[#7c766a] mt-1.5 line-clamp-1 leading-relaxed">{cs.description}</p>}
                </div>
                <span className="shrink-0 text-[#4a463e] group-hover:text-[#ff6321] transition-all duration-400 group-hover:translate-x-1 text-lg">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── 8. CTA ──────────────────────────────────────────────────── */}
      <section className="egg-grain egg-vignette relative px-6 sm:px-10 lg:px-16 py-24 sm:py-36 overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#c39a63] mb-9">Get in touch</p>
          <h2 className={`${display.className} text-[clamp(2.2rem,5vw,4rem)] font-normal leading-[1.02] tracking-tight text-[#f2ece1] mb-7`}>
            Have a procurement<br /><span className="italic">requirement?</span>
          </h2>
          <p className="text-[#a8a196] text-base sm:text-lg leading-relaxed max-w-xl mb-12">
            Our export desk sits in Damietta and Cairo. We answer structured RFQs within
            24 hours — a priced FOB / CIF / CFR offer, full Certificate of Analysis and
            available L/C documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 sm:items-center">
            <Link href="/rfq" className="group relative inline-flex items-center gap-2.5 text-sm font-semibold text-[#0a0c0f] bg-[#ff6321] px-8 py-4 rounded-full overflow-hidden self-start transition-transform duration-300 hover:scale-[1.03]">
              <span className="relative z-10">Submit an RFQ</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 bg-[#ffd7bf] translate-y-full group-hover:translate-y-0 transition-transform duration-400" />
            </Link>
            <div className="text-sm font-mono text-[#8a8578] leading-relaxed">
              <a href="mailto:export@egyptglobe.com" className="text-[#c9c2b4] hover:text-[#ff6321] transition-colors">export@egyptglobe.com</a><br />
              <span className="text-[#5c574d]">+20 100 772 9844 · WhatsApp available</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── legal trust line ────────────────────────────────────────── */}
      <div className="px-6 sm:px-10 lg:px-16 py-7 border-t border-[var(--line)]">
        <p className="text-[10px] font-mono text-[#5c574d] tracking-[0.14em]">
          Export license 600010794 · Commercial registry 73418 · Tax card 655-527-427 · Cairo + Damietta, Egypt
        </p>
      </div>
    </main>
  )
}

/* ─── recurring section label ─────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-4 px-6 sm:px-10 lg:px-16 pt-12 pb-4">
      <span className="h-px w-8 bg-[#c39a63]/40" />
      <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#7c766a]">{children}</p>
    </div>
  )
}
