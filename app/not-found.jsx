import Link from 'next/link'
import Icon from '../components/ui/Icon'
import { PRODUCT_DIVISIONS } from '../lib/corporatePages'

/**
 * 404 — the previous copy ("Brand Not Found … View All Brands") was a
 * leftover from the multi-tenant era and sent a lost buyer to the homepage.
 * Batch 1 (Sep 2026): say what happened, then offer the three ways out a
 * buyer actually wants — the catalogue, search, and a quote.
 */
export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] bg-white text-[#14161a] flex items-center justify-center px-4 py-16 overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 egg-grid-light opacity-70 pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(55% 55% at 88% 0%, rgba(255,99,33,.14), transparent 60%), radial-gradient(40% 45% at 0% 100%, rgba(15,181,165,.14), transparent 60%)' }} />
      <div className="relative max-w-2xl w-full text-center">
        <Icon name="globe" className="w-14 h-14 mx-auto mb-5 text-[#14161a]/30" strokeWidth={1} />
        <p className="egg-eyebrow justify-center mb-3">Error 404</p>
        <h1 className="egg-display text-4xl sm:text-5xl mb-4 text-[#14161a]">This page does not exist.</h1>
        <p className="text-[#3f4650] mb-8 max-w-md mx-auto">
          The address may have changed or been typed incorrectly. Everything Egypt Globe Group exports is one step away.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Link href="/products" className="egg-btn-primary">Browse all products</Link>
          <Link href="/search" className="egg-btn-ghost">Search the site</Link>
          <Link href="/rfq" className="egg-btn-ghost">Request a quote</Link>
        </div>
        <nav aria-label="Product divisions" className="flex flex-wrap justify-center gap-2">
          {PRODUCT_DIVISIONS.map(d => (
            <Link key={d.id} href={d.path} className="egg-chip text-xs text-[#3f4650] hover:text-[#14161a] transition-all">
              {d.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
