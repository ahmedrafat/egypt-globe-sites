import Link from 'next/link'
import Image from 'next/image'
import { getCaseStudies, getSiteSettings, getPageByPath, PRODUCT_DIVISIONS } from '../lib/corporatePages'
import { getCurrentBrand, brandMeta } from '../lib/brand'
import MarkdownBody from '../components/MarkdownBody'
import HeroBgSlider from '../components/HeroBgSlider'

export const dynamic = 'force-dynamic'

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
      type: 'website',
      title,
      description,
      url: canonical,
      siteName: isUmbrella ? 'Egypt Globe Group' : m.siteName,
      locale: 'en_US',
      images: [{ url: `${canonical}/og-image.png`, width: 1200, height: 630, alt: isUmbrella ? 'Egypt Globe Group' : m.siteName }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${canonical}/og-image.png`],
    },
  }
}

/* ─── static data ─────────────────────────────────────────────────────── */

const METRICS = [
  { value: '60+',  label: 'Export markets'     },
  { value: '7',    label: 'Egyptian seaports'  },
  { value: '7',    label: 'Commodity divisions' },
  { value: '24h',  label: 'RFQ response SLA'   },
]

const PILLARS = [
  {
    tag:  'Export Operations',
    body: 'Commodity sourcing, vessel chartering, freight forwarding, and L/C bank documentation. We run the full chain — extraction point to buyer warehouse — across salt, cement, fertilizers, chemicals, minerals, agro, and metals.',
    href: '/products',
    cta:  'Our operations',
  },
  {
    tag:  'Industrial Development',
    body: 'We invest in processing capacity alongside trading. Value-added manufacturing, Egyptian industrial zone development, and greenfield partnerships that build durable margin rather than pure brokerage spread.',
    href: '/about',
    cta:  'About the group',
  },
  {
    tag:  'R&D + Innovation',
    body: 'Application testing, new-grade qualification, and process optimisation — executed in partnership with buyers\' technical teams. We validate specifications in Egyptian facilities before the first container is loaded.',
    href: '/services',
    cta:  'Our services',
  },
]

const WHY_EGYPT = [
  {
    stat:  'Suez Canal',
    label: 'Transit corridor',
    body:  '20% of global seaborne trade passes through Egyptian waters. Our products enter the world\'s major shipping lanes from an origin port, not a transhipment hub.',
  },
  {
    stat:  '14 days',
    label: 'Damietta → Rotterdam',
    body:  '36 hours to Jeddah from Port Said. 5 days to Mumbai from Ain Sokhna. Seven Egyptian seaports give us lane flexibility no landlocked supplier can match.',
  },
  {
    stat:  'SEZ + GAFI',
    label: 'Incentive framework',
    body:  'Investment Law 72/2017, Special Economic Zones, and 10-year tax holidays in designated industrial areas. Egypt is structurally cheaper to produce in than competing origin markets.',
  },
  {
    stat:  '<12h',
    label: 'Extraction to port',
    body:  'Salt pans, limestone quarries, mineral belts, and agricultural land all sit within 12 hours of an export terminal. The supply chain is short by design.',
  },
]

/* ─── page ────────────────────────────────────────────────────────────── */

export default async function HomePage() {
  // Drop 169 — homepage now reads CMS row at path='/' for hero photo + custom
  // title / description / body. Public hardcoded copy still serves as fallback
  // when those CMS fields are empty, so the page never breaks on a missing row.
  const [settings, caseStudies, cmsHome] = await Promise.all([
    getSiteSettings().catch(() => null),
    getCaseStudies({ limit: 3 }).catch(() => []),
    getPageByPath('/').catch(() => null),
  ])

  // Slider photos = hero_photo_url first (if set), then gallery_urls.
  // When this array has 1+ photos, they become the background of the hero
  // section (sliding). When empty, the hero shows the plain white background.
  const sliderPhotos = [
    cmsHome?.hero_photo_url,
    ...(Array.isArray(cmsHome?.gallery_urls) ? cmsHome.gallery_urls : []),
  ].filter(Boolean)
  const hasPhotos = sliderPhotos.length > 0
  const heroBody = cmsHome?.body_markdown?.trim()

  return (
    <main className="bg-white text-slate-900 min-h-screen">

      {/* ── 1. Hero — text + buttons on top of optional photo slider ─── */}
      <section className={`relative min-h-[80vh] flex flex-col justify-between px-6 sm:px-10 lg:px-16 pt-20 pb-14 border-b border-slate-200 overflow-hidden ${hasPhotos ? 'text-white' : 'text-slate-900'}`}>
        {/* CMS-driven background slider — only renders when photos uploaded */}
        <HeroBgSlider photos={sliderPhotos} />

        {/* Top — identity mark */}
        <p className={`relative z-10 text-[11px] font-mono uppercase tracking-[0.2em] ${hasPhotos ? 'text-white/70' : 'text-slate-400'}`}>
          Egypt Globe Group · Est.&nbsp;2014
        </p>

        {/* Middle — headline block */}
        <div className="relative z-10 max-w-4xl">
          <h1 className={`text-[clamp(2.6rem,6.5vw,5.5rem)] font-bold leading-[1.04] tracking-tight mb-6 ${hasPhotos ? 'text-white' : 'text-slate-900'}`}>
            Egypt&rsquo;s industrial<br />export operator.
          </h1>
          <p className={`text-lg sm:text-xl max-w-xl leading-relaxed mb-10 ${hasPhotos ? 'text-white/90' : 'text-slate-500'}`}>
            We source, ship, and develop. Salt, cement, fertilizers, chemicals,
            minerals, agro commodities, and metals — from Egyptian capacity to
            markets in 60+ countries.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/rfq"
              className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#FF6321] hover:bg-[#e0541b] px-6 py-3 transition-colors">
              Request a quote&nbsp;→
            </Link>
            <Link href="/products"
              className={`text-sm transition-colors border-b pb-0.5 ${
                hasPhotos
                  ? 'text-white/85 hover:text-white border-white/40 hover:border-white/80'
                  : 'text-slate-500 hover:text-slate-900 border-slate-300 hover:border-slate-600'
              }`}>
              Our operations
            </Link>
          </div>
        </div>

        {/* Bottom — certifications line */}
        <div className={`relative z-10 flex flex-wrap gap-x-2 gap-y-1 text-[11px] font-mono tracking-wider ${hasPhotos ? 'text-white/60' : 'text-slate-400'}`}>
          {['ISO 22000', 'EN 197-1', 'HACCP', 'USP/BP', 'GOEIC', 'TÜV Austria', 'SGS', 'Intertek'].map((c, i, a) => (
            <span key={c} className="whitespace-nowrap">{c}{i < a.length - 1 ? ' ·' : ''}</span>
          ))}
        </div>
      </section>

      {/* ── 1b. CMS body markdown — only when set in /websites ────────── */}
      {heroBody && (
        <section className="border-b border-slate-200 bg-white">
          <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-16 py-16">
            <article className="prose prose-slate max-w-none">
              <MarkdownBody content={heroBody} />
            </article>
          </div>
        </section>
      )}

      {/* ── 2. Numbers ───────────────────────────────────────────────── */}
      <section className="border-b border-slate-200">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {METRICS.map((m, i) => (
            <div key={m.label}
              className={`px-8 sm:px-10 py-10 sm:py-12 ${i > 0 ? 'border-l border-slate-200' : ''}`}>
              <p className="text-[3rem] sm:text-[3.5rem] font-bold leading-none tracking-tight"
                style={{ color: '#FF6321' }}>
                {m.value}
              </p>
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-3">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Three pillars ─────────────────────────────────────────── */}
      <section className="border-b border-slate-200">
        <div className="px-6 sm:px-10 lg:px-16 pt-10 pb-2">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400">
            What we do
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <div key={p.tag}
              className={`px-8 sm:px-10 lg:px-14 py-12 border-t border-slate-200 ${i > 0 ? 'md:border-l md:border-t-0 border-t border-slate-200' : ''}`}>
              <p className="text-[11px] font-mono uppercase tracking-widest mb-6" style={{ color: '#FF6321' }}>
                {p.tag}
              </p>
              <p className="text-[15px] text-slate-500 leading-relaxed mb-8">
                {p.body}
              </p>
              <Link href={p.href}
                className="text-sm text-slate-400 hover:text-slate-900 transition-colors border-b border-slate-200 hover:border-slate-400 pb-0.5">
                {p.cta}&nbsp;→
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Product divisions ─────────────────────────────────────── */}
      <section className="border-b border-slate-200">
        <div className="px-6 sm:px-10 lg:px-16 pt-10 pb-2 flex items-center justify-between">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400">
            Commodity divisions
          </p>
          <Link href="/products"
            className="text-[11px] font-mono text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-wider">
            All products →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
          {PRODUCT_DIVISIONS.map((div, i) => (
            <Link key={div.id} href={div.path}
              className={[
                'group flex flex-col items-center gap-3 px-4 py-8 border-t border-slate-200 text-center hover:bg-slate-50 transition-colors',
                // Mobile 2-col: right column only
                i % 2 !== 0 && i > 0 ? 'border-l border-l-slate-200' : '',
                // sm 4-col: 2nd and 3rd positions in row (i%4===2 only, since odd already have border-l)
                i % 4 === 2 ? 'sm:border-l sm:border-l-slate-200' : '',
                // lg 7-col: only i=4 needs to gain border-l (others already have it from above)
                i === 4 ? 'lg:border-l lg:border-l-slate-200' : '',
              ].filter(Boolean).join(' ')}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: `${div.color}15` }}>
                {div.icon}
              </div>
              <span className="text-xs font-semibold text-slate-700 group-hover:text-[#1d5fa1] transition-colors leading-tight">
                {div.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 5. Why Egypt ─────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="px-6 sm:px-10 lg:px-16 pt-10 pb-2">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400">
            The case for Egypt
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {WHY_EGYPT.map((w, i) => (
            <div key={w.label}
              className={[
                'px-8 sm:px-10 lg:px-14 py-10 border-t border-slate-200',
                i % 2 === 1 ? 'sm:border-l' : '',
              ].join(' ')}>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold text-slate-900">{w.stat}</span>
                <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">{w.label}</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Recent thinking ───────────────────────────────────────── */}
      {caseStudies.length > 0 && (
        <section className="border-b border-slate-200">
          <div className="px-6 sm:px-10 lg:px-16 pt-10 pb-2 flex items-center justify-between">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400">
              Recent thinking
            </p>
            <Link href="/case-studies"
              className="text-[11px] font-mono text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-wider">
              All →
            </Link>
          </div>
          <div className="divide-y divide-slate-200">
            {caseStudies.map(cs => (
              <Link key={cs.path} href={cs.path}
                className="group flex items-start gap-6 px-8 sm:px-10 lg:px-14 py-7 hover:bg-slate-50 transition-colors">
                {cs.hero_photo_url && (
                  <div className="hidden sm:block shrink-0 w-16 h-16 rounded overflow-hidden opacity-70 group-hover:opacity-100 transition-opacity">
                    <Image src={cs.hero_photo_url} alt=""
                      width={64} height={64} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-mono uppercase tracking-widest mb-1.5" style={{ color: '#FF6321' }}>
                    Case study
                  </p>
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors leading-snug">
                    {cs.title}
                  </p>
                  {cs.description && (
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1 leading-relaxed">
                      {cs.description}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-slate-300 group-hover:text-slate-600 transition-colors text-sm mt-0.5">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── 7. CTA ───────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28 bg-slate-50 border-b border-slate-200">
        <div className="max-w-2xl">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-8">
            Get in touch
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-slate-900">
            Have a procurement requirement?
          </h2>
          <p className="text-slate-500 text-base mb-10 leading-relaxed">
            Our export desk is in Damietta and Cairo. We respond to structured
            RFQs within 24 hours with a priced FOB&nbsp;/&nbsp;CIF&nbsp;/&nbsp;CFR offer,
            full Certificate of Analysis, and available L/C documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <Link href="/rfq"
              className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#FF6321] hover:bg-[#e0541b] px-6 py-3 transition-colors">
              Submit an RFQ
            </Link>
            <div className="text-sm text-slate-400 pt-3 sm:pt-3 font-mono">
              export@egyptglobe.com<br />
              <span className="text-slate-300">+20 100 772 9844 · WhatsApp available</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer trust line ─────────────────────────────────────────── */}
      <div className="px-6 sm:px-10 lg:px-16 py-6">
        <p className="text-[11px] font-mono text-slate-400 tracking-wider">
          Export license&nbsp;600010794&nbsp;&middot;&nbsp;Commercial registry&nbsp;73418&nbsp;&middot;&nbsp;
          Tax card&nbsp;655-527-427&nbsp;&middot;&nbsp;Cairo&nbsp;+&nbsp;Damietta,&nbsp;Egypt
        </p>
      </div>

    </main>
  )
}
