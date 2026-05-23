/**
 * /products — Egypt Globe Group commodity divisions hub.
 * White theme, consistent with homepage. Responsive throughout.
 */
import Link from 'next/link'
import { PRODUCT_DIVISIONS } from '../../lib/corporatePages'

export const revalidate = 3600

export const metadata = {
  title: 'Products — Egyptian Commodity Exporter',
  description:
    'Salt, fertilizers, construction materials, chemicals, industrial minerals, agro & food, metals — 7 commodity divisions exported FOB / CIF / CFR from 7 Egyptian seaports to 60+ markets.',
}

const INCOTERMS = [
  { term: 'FOB', desc: 'Buyer arranges freight from the Egyptian port.' },
  { term: 'CIF', desc: 'We deliver cost + insurance + freight to your port.' },
  { term: 'CFR', desc: 'Cost & freight — CIF without insurance.' },
  { term: 'DAP', desc: 'Door delivery, buyer clears import customs.' },
  { term: 'EXW', desc: 'Buyer collects ex-works; lowest price basis.' },
  { term: 'DDP', desc: 'Full door-to-door, we handle import clearance.' },
]

const PORTS = [
  { name: 'Damietta',       code: 'EGDAM', note: 'Primary salt & agro terminal' },
  { name: 'Alexandria',     code: 'EGALY', note: 'General cargo & container hub' },
  { name: 'El Dekheila',    code: 'EGEDK', note: 'Bulk minerals & rock salt' },
  { name: 'Port Said East', code: 'EGPSE', note: 'Container & sea salt' },
  { name: 'Ain Sokhna',     code: 'EGSOK', note: 'Minerals & fertilizers' },
  { name: 'Al-Arish',       code: 'EGEAR', note: 'Sinai sea salt' },
  { name: 'Suez',           code: 'EGPSD', note: 'Red Sea lane entry' },
]

const CERTS = [
  'ISO 22000', 'EN 197-1', 'HACCP', 'USP / BP',
  'GOEIC', 'SGS / Intertek', 'ASTM D632', 'EN 16811-1',
]

export default function ProductsHub() {
  return (
    <article className="bg-white">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 px-5 sm:px-8 lg:px-14 pt-14 sm:pt-16 pb-12 sm:pb-14">
        <nav className="flex items-center gap-2 text-[11px] text-slate-400 mb-8 font-mono uppercase tracking-wider">
          <Link href="/" className="hover:text-slate-700 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-600">Products</span>
        </nav>

        <div className="max-w-3xl">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-4">
            7 commodity divisions · 60+ destination markets
          </p>
          <h1 className="text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.06] tracking-tight mb-5 text-slate-900">
            Egyptian commodities,<br />
            <span className="text-[#1d5fa1]">shipped on your terms.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-8">
            Salt, cement, fertilizers, chemicals, industrial minerals, agro & food,
            and metals — sourced from Egyptian capacity and shipped FOB / CIF / CFR
            from 7 Egyptian seaports. Every shipment with a Certificate of Analysis.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/rfq"
              className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#FF6321] hover:bg-[#e0541b] px-6 py-3 transition-colors">
              Request a quote →
            </Link>
            <Link href="/services"
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors border-b border-slate-300 hover:border-slate-600 pb-0.5">
              Pairing services
            </Link>
          </div>
        </div>
      </section>

      {/* ── Division grid ──────────────────────────────────────────── */}
      <section className="border-b border-slate-200">
        <div className="px-5 sm:px-8 lg:px-14 pt-8 pb-2 flex items-center justify-between">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Product divisions</p>
        </div>
        <div className="divide-y divide-slate-200 sm:grid sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3 xl:grid-cols-4">
          {PRODUCT_DIVISIONS.map((div, i) => (
            <Link key={div.id} href={div.path}
              className={[
                'flex items-start gap-4 px-5 sm:px-8 lg:px-10 py-7 hover:bg-slate-50 transition-colors group',
                // On sm+, add dividers between columns
                'sm:border-b sm:border-slate-200',
                // Right border between columns
                i % 2 === 0 ? 'sm:border-r sm:border-r-slate-200 lg:border-r' : '',
                i % 3 === 0 ? 'lg:border-r-slate-200' : '',
                i % 3 === 1 ? 'lg:border-r-slate-200' : '',
              ].join(' ')}>
              <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-xl mt-0.5"
                style={{ background: `${div.color}15` }}>
                {div.icon}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-slate-900 group-hover:text-[#1d5fa1] transition-colors text-[15px] mb-1">
                  {div.label}
                </div>
                <div className="text-sm text-slate-500 leading-relaxed line-clamp-2">{div.blurb}</div>
                <div className="mt-2.5 text-xs font-semibold text-[#FF6321]">Browse →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Incoterms ──────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="px-5 sm:px-8 lg:px-14 pt-8 pb-2">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Incoterms we quote</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y divide-slate-200 sm:divide-y-0">
          {INCOTERMS.map((t, i) => (
            <div key={t.term} className={[
              'px-5 sm:px-6 py-6',
              'border-b border-slate-200',
              // Vertical dividers between columns only on larger screens
              i > 0 ? 'sm:border-l sm:border-l-slate-200' : '',
              i > 2 ? 'sm:border-t sm:border-t-slate-200' : '',
            ].join(' ')}>
              <div className="text-lg font-bold mb-1" style={{ color: '#FF6321' }}>{t.term}</div>
              <div className="text-xs text-slate-500 leading-relaxed">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ports ──────────────────────────────────────────────────── */}
      <section className="border-b border-slate-200">
        <div className="px-5 sm:px-8 lg:px-14 py-10">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-6">
            Loading ports — 7 Egyptian seaports
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {PORTS.map(p => (
              <div key={p.code} className="border border-slate-200 bg-slate-50 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm">
                <div className="font-semibold text-slate-900">
                  {p.name}
                  <span className="ml-2 text-[10px] font-mono text-slate-400">{p.code}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{p.note}</div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-slate-400 font-mono">
            Full vessel charter · 20ft / 40ft HC containers · bulk · min 25 MT per commodity
          </p>
        </div>
      </section>

      {/* ── Certifications ─────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="px-5 sm:px-8 lg:px-14 py-8">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-5">
            Standards &amp; certifications
          </p>
          <div className="flex flex-wrap gap-2">
            {CERTS.map(c => (
              <span key={c}
                className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 lg:px-14 py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-2xl">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 mb-8">Get a price</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-slate-900">
            Know your commodity. Need a price?
          </h2>
          <p className="text-slate-500 text-base mb-10 leading-relaxed">
            Submit an RFQ with your commodity, quantity, destination port and preferred
            Incoterm. We respond within 24 hours with a priced offer, Certificate of
            Analysis, and L/C documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <Link href="/rfq"
              className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#FF6321] hover:bg-[#e0541b] px-6 py-3 transition-colors">
              Submit an RFQ
            </Link>
            <Link href="/services"
              className="text-sm text-slate-400 sm:pt-3 hover:text-slate-700 transition-colors border-b border-slate-200 hover:border-slate-400 pb-0.5">
              View pairing services →
            </Link>
          </div>
        </div>
      </section>

    </article>
  )
}
